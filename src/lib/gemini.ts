import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  (process.env.GEMINI_API_KEY as string) || (process.env.NEXT_PUBLIC_GEMINI_API_KEY as string) || ''
);

export interface SecurityAnalysisResult {
  riskLevel: 'safe' | 'caution' | 'malicious';
  riskScore: number;
  threats: string[];
  recommendations: string[];
  explanation: string;
}

export async function analyzeUrlWithContext(url: string, context?: any): Promise<SecurityAnalysisResult> {
  // Use Gemini 2.5 Flash-Lite as primary, with Gemini 2.0 Flash-Lite as fallback
  const models = ['gemini-2.5-flash-lite-preview', 'gemini-2.0-flash-lite'];
  
  for (const modelName of models) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const prompt = `
      Analyze this URL for cybersecurity threats: ${url}
      
      ${context ? `Context (non-PII JSON you can rely on): ${JSON.stringify(context)}` : ''}

      Provide a comprehensive security analysis in JSON format with the following structure:
      {
        "riskLevel": "safe" | "caution" | "malicious",
        "riskScore": number (0-100),
        "threats": ["list of specific threats found"],
        "recommendations": ["actionable security recommendations"],
        "explanation": "brief user-facing explanation of what is wrong and why"
      }
      
      Consider these factors:
      - URL structure and domain legitimacy
      - Typosquatting indicators
      - Suspicious TLDs (.tk, .ml, .cn, .ru)
      - URL shorteners
      - HTTPS vs HTTP
      - Domain age and reputation
      - Whether DNS resolves and whether HTTPS endpoint is reachable
      - Common phishing patterns
      
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
  
  // If both Gemini 2.5 Flash-Lite and 2.0 Flash-Lite fail, use fallback analysis
  console.log('All Gemini models failed, using fallback analysis');
  return fallbackAnalysis(url);
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
