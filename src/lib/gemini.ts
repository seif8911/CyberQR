import { GoogleGenerativeAI } from '@google/generative-ai';
import { getICSAContext } from './icsa-data';

// Initialize Gemini AI with proper error handling
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

export interface SecurityAnalysisResult {
  riskLevel: 'safe' | 'caution' | 'malicious';
  riskScore: number;
  threats: string[];
  recommendations: string[];
  explanation: string;
}

export async function analyzeUrlWithContext(url: string, context?: any): Promise<SecurityAnalysisResult> {
  try {
    const genAI = getGeminiAI();
    
    // Use available Gemini models with fallback
    const models = ['gemini-2.5-flash-lite'];
    
    for (const modelName of models) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
      
      const icsaContext = getICSAContext();
      
      const prompt = `
      ${icsaContext}
      
      Analyze this URL for cybersecurity threats: ${url}
      
      ${context ? `Context (non-PII JSON you can rely on): ${JSON.stringify(context)}` : ''}

      As Shieldo, the user's cute streak pet and cybersecurity AI advisor, provide a comprehensive security analysis in JSON format with the following structure:
      {
        "riskLevel": "safe" | "caution" | "malicious",
        "riskScore": number (0-100),
        "threats": ["list of specific threats found"],
        "recommendations": ["actionable security recommendations"],
        "explanation": "brief user-facing explanation of what is wrong and why"
      }
      
      Consider these factors (drawing from ICSA phishing detection modules):
      - URL structure and domain legitimacy
      - Typosquatting indicators (like paypa1.com vs paypal.com)
      - Suspicious TLDs (.tk, .ml, .cn, .ru)
      - URL shorteners (bit.ly, tinyurl, etc.)
      - HTTPS vs HTTP
      - Domain age and reputation
      - Whether DNS resolves and whether HTTPS endpoint is reachable
      - Common phishing patterns from ICSA examples
      - Social engineering tactics used in phishing attacks
      
      Risk levels:
      - safe: Legitimate, trusted domains with HTTPS
      - caution: URL shorteners, unknown domains, or minor concerns
      - malicious: Clear phishing, typosquatting, or security threats
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log(`Success with model: ${modelName}`);
        return JSON.parse(jsonMatch[0]);
      }
      
    } catch (error: any) {
      console.error(`Model ${modelName} failed:`, error.message);
      // Continue to next model
      continue;
      }
    }
    
    // If all Gemini models fail, use fallback analysis
    console.log('All Gemini models failed, using fallback analysis');
    return fallbackAnalysis(url);
    
  } catch (error: any) {
    console.error('Gemini API error:', error.message);
    // If API key is not configured, use fallback analysis
    if (error.message.includes('API key not configured')) {
      console.log('Using fallback analysis due to missing API key');
      return fallbackAnalysis(url);
    }
    throw error;
  }
}

export async function analyzeUrl(url: string): Promise<SecurityAnalysisResult> {
  return analyzeUrlWithContext(url);
}

function fallbackAnalysis(url: string): SecurityAnalysisResult {
  const lowerUrl = url.toLowerCase();
  
  // Check for malicious indicators
  const maliciousPatterns = [
    /paypa[0-9]/,
    /g[0-9]ogle/,
    /micros[0-9]ft/,
    /amaz[0-9]n/,
    /bank[0-9]f/,
    /\.tk$/,
    /\.ml$/,
    /\.cn$/,
    /\.ru$/
  ];
  
  const cautionPatterns = [
    /bit\.ly/,
    /tinyurl/,
    /short\.ly/,
    /t\.co/,
    /goo\.gl/
  ];
  
  const isMalicious = maliciousPatterns.some(pattern => pattern.test(lowerUrl));
  const isCaution = cautionPatterns.some(pattern => pattern.test(lowerUrl));
  const hasHttps = url.startsWith('https://');
  
  if (isMalicious) {
    return {
      riskLevel: 'malicious',
      riskScore: 8, // 8/10 - high risk (above 3.5 threshold for malicious)
      threats: ['Typosquatting detected', 'Suspicious domain', 'Potential phishing'],
      recommendations: ['Do not visit this link', 'Report as suspicious', 'Use official websites'],
      explanation: 'This URL contains indicators of typosquatting and potential phishing attempts.'
    };
  }
  
  if (isCaution || !hasHttps) {
    return {
      riskLevel: 'caution',
      riskScore: 2, // 2/10 - moderate risk (above 1.5 threshold for caution)
      threats: isCaution ? ['URL shortener detected'] : ['No HTTPS encryption'],
      recommendations: ['Verify the source', 'Check HTTPS after redirect', 'Be cautious with personal information'],
      explanation: isCaution 
        ? 'This URL requires caution due to shortened links that hide the destination.'
        : 'This URL requires caution due to lack of HTTPS encryption.'
    };
  }
  
  return {
    riskLevel: 'safe',
    riskScore: 1, // 1/10 - very low risk (below 1.5 threshold for safe)
    threats: [],
    recommendations: ['Safe to visit', 'HTTPS encryption confirmed'],
    explanation: 'This URL appears to be safe with proper encryption and legitimate domain.'
  };
}
