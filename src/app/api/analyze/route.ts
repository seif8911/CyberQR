import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';

type RiskLevel = 'safe' | 'caution' | 'malicious';

interface AnalysisInput {
  url: string;
}

interface ProviderResult {
  provider: 'safe_browsing' | 'virustotal' | 'gemini' | 'heuristics';
  verdict: RiskLevel;
  score: number; // 0-100
  details?: any;
  status?: 'ok' | 'skipped' | 'error';
  elapsedMs?: number;
}

interface AnalysisResponse {
  url: string;
  riskLevel: RiskLevel;
  riskScore: number;
  results: ProviderResult[];
  threats: string[];
  recommendations: string[];
  explanation: string;
}

function normalizeUrl(input: string): string {
  try {
    const u = new URL(input);
    return u.toString();
  } catch {
    // Try adding protocol
    try {
      return new URL(`https://${input}`).toString();
    } catch {
      return input;
    }
  }
}

function deriveFinalVerdict(results: ProviderResult[], url: string): { riskLevel: RiskLevel; riskScore: number; } {
  // Sum up all provider scores (each provider contributes their full score)
  let totalScore = 0;
  results.forEach(r => {
    if (r.score !== undefined && r.score !== null) {
      totalScore += r.score;
    }
  });
  let riskScore = totalScore;

  // Veto rules: any provider with very high malicious score should strongly influence the outcome
  const maxMalicious = results
    .filter(r => r.verdict === 'malicious')
    .reduce((m, r) => Math.max(m, r.score || 0), 0);
  if (maxMalicious >= 80) {
    riskScore = Math.max(riskScore, 75); // 7.5/10
  }

  // If two or more providers are not safe (caution or malicious), ensure at least caution
  const notSafeCount = results.filter(r => r.verdict !== 'safe').length;
  if (notSafeCount >= 2) {
    riskScore = Math.max(riskScore, 20); // 2.0/10 (above 1.5 threshold for caution)
  }

  // If heuristics detect both no HTTPS and suspicious TLD, enforce a minimum score
  const heur = results.find(r => r.provider === 'heuristics');
  const d = (heur?.details || {}) as any;
  if (d?.hasHttp && d?.badTld) {
    riskScore = Math.max(riskScore, 40); // 4.0/10 (above 3.5 threshold for malicious)
  }

  // Convert summed score to /10 scale
  // If we have 4 providers each scoring 5, that's 20 total
  // We need to map this to 0-10 scale appropriately
  const maxPossibleScore = results.length * 100; // Maximum possible sum if all providers score 100
  const scaledScore = Math.round((riskScore / maxPossibleScore) * 10); // Convert to 0-10 scale
  
  // Check if URL has HTTPS - if not, force minimum caution level
  const hasHttps = url.toLowerCase().startsWith('https://');
  
  let riskLevel: RiskLevel = 'safe';
  if (scaledScore > 3.5) riskLevel = 'malicious';  // 3.5+ out of 10 (35% risk) = do not visit
  else if (scaledScore > 1.5) riskLevel = 'caution'; // 1.5+ out of 10 (15% risk) = exercise caution
  
  // Force caution for any non-HTTPS URL, regardless of other factors
  if (!hasHttps && riskLevel === 'safe') {
    riskLevel = 'caution';
    // Ensure score reflects the caution level (minimum 1.6/10 for caution)
    const adjustedScore = Math.max(scaledScore, 1.6);
    return { riskLevel, riskScore: adjustedScore };
  }
  
  return { riskLevel, riskScore: scaledScore };
}

async function checkSafeBrowsing(url: string): Promise<ProviderResult | null> {
  const key = process.env.SAFE_BROWSING_API_KEY;
  if (!key) return {
    provider: 'safe_browsing', verdict: 'safe', score: 10, status: 'skipped', details: { reason: 'missing_api_key' }
  };
  try {
    const start = Date.now();
    const body = {
      client: { clientId: 'cyberqr', clientVersion: '1.0.0' },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }],
      },
    };
    const res = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await res.json();
    const hasThreats = !!data?.matches?.length;
    return {
      provider: 'safe_browsing',
      verdict: hasThreats ? 'malicious' as RiskLevel : 'safe',
      score: hasThreats ? 85 : 10,
      details: data,
      status: 'ok',
      elapsedMs: Date.now() - start,
    };
  } catch (e) {
    return { provider: 'safe_browsing', verdict: 'safe', score: 10, status: 'error', details: { error: String(e) } };
  }
}

async function checkVirusTotal(url: string): Promise<ProviderResult | null> {
  const key = process.env.VIRUSTOTAL_API_KEY;
  if (!key) return {
    provider: 'virustotal', verdict: 'safe', score: 10, status: 'skipped', details: { reason: 'missing_api_key' }
  };
  try {
    const start = Date.now();
    // Submit URL
    const submit = await fetch('https://www.virustotal.com/api/v3/urls', {
      method: 'POST',
      headers: { 'x-apikey': key, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `url=${encodeURIComponent(url)}`,
      cache: 'no-store',
    });
    const submitted = await submit.json();
    const analysisId = submitted?.data?.id;
    let analysis: any = null;
    if (analysisId) {
      // Briefly poll once
      const report = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        headers: { 'x-apikey': key },
        cache: 'no-store',
      });
      analysis = await report.json();
    }
    const stats = analysis?.data?.attributes?.stats || analysis?.data?.attributes?.results || analysis?.attributes?.stats;
    let malicious = 0;
    let suspicious = 0;
    let harmless = 0;
    if (stats) {
      malicious = stats.malicious || 0;
      suspicious = stats.suspicious || 0;
      harmless = stats.harmless || 0;
    }
    const total = malicious + suspicious + harmless || 1;
    const ratio = (malicious * 1.0 + suspicious * 0.6) / total;
    const score = Math.round(100 * ratio);
    const verdict: RiskLevel = score >= 70 ? 'malicious' : score >= 35 ? 'caution' : 'safe';
    return {
      provider: 'virustotal',
      verdict,
      score: Math.max(score, verdict === 'safe' ? 10 : score),
      details: analysis || submitted,
      status: 'ok',
      elapsedMs: Date.now() - start,
    };
  } catch (e) {
    return { provider: 'virustotal', verdict: 'safe', score: 10, status: 'error', details: { error: String(e) } };
  }
}

function heuristicCheck(url: string): ProviderResult {
  const lower = url.toLowerCase();
  const hasHttp = lower.startsWith('http://');
  const tlds = ['.tk', '.ml', '.cn', '.ru'];
  const badTld = tlds.some(t => lower.endsWith(t) || lower.includes(`${t}/`) || lower.includes(`${t}?`));
  const shorteners = ['bit.ly', 'tinyurl.com', 'short.ly', 't.co', 'goo.gl'];
  const isShort = shorteners.some(d => lower.includes(d));
  const typo = /(paypa[0-9])|(g[0-9]ogle)|(micros[0-9]ft)|(amaz[0-9]n)|(bank[0-9]f)/.test(lower);

  let score = 10;
  if (hasHttp) score += 20;
  if (badTld) score += 40;
  if (isShort) score += 25;
  if (typo) score += 40;
  score = Math.min(95, score);
  const verdict: RiskLevel = score >= 70 ? 'malicious' : score >= 35 ? 'caution' : 'safe';
  return { provider: 'heuristics', verdict, score, details: { hasHttp, badTld, isShort, typo } };
}

async function dnsLookup(domain: string): Promise<{ exists: boolean; records?: any; elapsedMs?: number; }> {
  try {
    const start = Date.now();
    // Use Google DNS over HTTPS to check if the domain resolves
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, { cache: 'no-store' });
    const data = await res.json();
    const exists = Array.isArray(data?.Answer) && data.Answer.length > 0;
    return { exists, records: data?.Answer, elapsedMs: Date.now() - start };
  } catch (e) {
    return { exists: false };
  }
}

async function checkGemini(url: string, context?: any): Promise<ProviderResult | null> {
  const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) return { provider: 'gemini', verdict: 'safe', score: 10, status: 'skipped', details: { reason: 'missing_api_key' } };
  try {
    const start = Date.now();
    // Lightweight call to our existing helper through dynamic import to avoid server top-level import cost
    const { analyzeUrlWithContext } = await import('@/lib/gemini');
    const res = await analyzeUrlWithContext(url, context);
    const score = Math.max(10, Math.min(95, res.riskScore));
    return {
      provider: 'gemini',
      verdict: res.riskLevel,
      score,
      details: res,
      status: 'ok',
      elapsedMs: Date.now() - start,
    };
  } catch (e) {
    return { provider: 'gemini', verdict: 'safe', score: 10, status: 'error', details: { error: String(e) } };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalysisInput;
    if (!body?.url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }
    const url = normalizeUrl(body.url);
    
    // Check cache first
    try {
      const cacheQuery = query(
        collection(db, 'url_cache'),
        where('url', '==', url.toLowerCase().trim()),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      
      const cacheSnapshot = await getDocs(cacheQuery);
      
      if (!cacheSnapshot.empty) {
        const cachedResult = cacheSnapshot.docs[0].data();
        const cacheAge = Date.now() - cachedResult.timestamp.toMillis();
        const maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (cacheAge < maxCacheAge) {
          console.log(`Cache hit for ${url}, age: ${Math.round(cacheAge / 1000 / 60)} minutes`);
          return NextResponse.json({
            ...cachedResult.analysis,
            cached: true,
            cacheAge: Math.round(cacheAge / 1000 / 60) // minutes
          });
        }
      }
    } catch (error) {
      console.error('Cache check error:', error);
      // Continue with fresh analysis if cache fails
    }

    const results: ProviderResult[] = [];

    // DNS existence check first
    const domain = (() => { try { return new URL(url).hostname; } catch { return ''; } })();
    const dns = domain ? await dnsLookup(domain) : { exists: false };

    // Run providers in parallel (pass context to Gemini so it can reason about DNS and heuristics)
    const [sb, vt, gm] = await Promise.all([
      checkSafeBrowsing(url),
      checkVirusTotal(url),
      checkGemini(url, { dnsExists: dns.exists, dnsRecords: dns.records || null }),
    ]);

    if (sb) results.push(sb);
    if (vt) results.push(vt);
    if (gm) results.push(gm);
    // Always include heuristics
    const heur = heuristicCheck(url);
    results.push(heur);

    // If DNS does not exist, add a provider-like signal
    if (domain) {
      results.push({
        provider: 'heuristics',
        verdict: dns.exists ? 'safe' : 'malicious',
        score: dns.exists ? 10 : 80,
        details: { dnsExists: dns.exists, records: dns.records, domain },
        status: 'ok',
        elapsedMs: dns.elapsedMs,
      });
    }

    const { riskLevel, riskScore } = deriveFinalVerdict(results, url);

    const threats: string[] = [];
    results.forEach(r => {
      if (r.provider === 'safe_browsing' && r.verdict !== 'safe') threats.push('Listed by Google Safe Browsing');
      if (r.provider === 'virustotal' && r.verdict !== 'safe') threats.push('VirusTotal engines flagged this URL');
      if (r.provider === 'heuristics') {
        const d = r.details || {};
        if (d.hasHttp) threats.push('No HTTPS encryption');
        if (d.badTld) threats.push('Suspicious TLD');
        if (d.isShort) threats.push('URL shortener hides destination');
        if (d.typo) threats.push('Possible typosquatting');
        if (typeof d.dnsExists === 'boolean' && !d.dnsExists) threats.push('Domain does not resolve (NXDOMAIN)');
      }
    });

    const recommendations: string[] = [];
    if (riskLevel === 'malicious') {
      recommendations.push('Do not visit this link');
      recommendations.push('Report as suspicious');
      recommendations.push('Use official websites and verified apps');
    } else if (riskLevel === 'caution') {
      recommendations.push('Verify the source before proceeding');
      recommendations.push('Check for HTTPS after redirects');
      recommendations.push('Avoid entering sensitive information');
    } else {
      recommendations.push('HTTPS encryption confirmed');
      recommendations.push('No major threats detected');
    }

    const response: AnalysisResponse = {
      url,
      riskLevel,
      riskScore,
      results,
      threats,
      recommendations,
      explanation: 'Aggregated risk score from Safe Browsing, VirusTotal, Gemini (AI), heuristics, and DNS existence check.',
    };

    // Save to cache
    try {
      const cacheData: any = {
        url: url.toLowerCase().trim(),
        analysis: response,
        timestamp: serverTimestamp(),
        riskLevel,
        riskScore
      };
      
      // Only add domain if it exists and is valid
      if (domain && domain.trim()) {
        cacheData.domain = domain.trim();
      }
      
      await addDoc(collection(db, 'url_cache'), cacheData);
      console.log(`Cached analysis for ${url}`);
    } catch (error) {
      console.error('Cache save error:', error);
      // Don't fail the request if caching fails
    }

    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    console.error('Analysis error:', e);
    return NextResponse.json({ 
      error: 'Failed to analyze URL', 
      details: e instanceof Error ? e.message : String(e) 
    }, { status: 500 });
  }
}


