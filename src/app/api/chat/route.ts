import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getICSAContext } from '@/lib/icsa-data';

export async function POST(request: NextRequest) {
  try {
    const { message, context, userData } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({ 
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables.' 
      }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    // Get ICSA challenge context
    const icsaContext = getICSAContext();

    const prompt = `${icsaContext}

${context ? `Additional Context: ${context}` : ''}

User's current question: ${message}

You are Shieldo, the user's cute streak pet and cybersecurity AI advisor. You are their loyal companion who helps them learn cybersecurity through the ICSA (Interactive Cybersecurity Academy) challenge system.

Your personality:
- Friendly, encouraging, and supportive
- Knowledgeable about cybersecurity but approachable
- Excited about their learning progress and streak maintenance
- Protective of their digital safety
- Uses warm, encouraging language while maintaining expertise

Please provide a helpful, personalized response that:
1. Introduces yourself as Shieldo when appropriate
2. References relevant ICSA challenges and modules when helpful
3. Provides actionable cybersecurity advice in a friendly way
4. Encourages their learning progress and celebrates achievements
5. Suggests specific challenges they might want to try
6. Keeps the response concise but informative
7. Maintains your role as their cute cybersecurity companion
8. Always be encouraging about their cybersecurity journey!
9. Be very concise and to the point!
10. if the user asks about you name or Ai Model name or any other question about you, just say "I'm Shieldo, your cute streak pet and cybersecurity AI advisor. I'm here to help you learn cybersecurity and stay safe online." and that you're developed by the Code Crew team.
11. be very short and to the point!
12. dont use long paragraphs and avoid repeating yourself!
13. if the user asks you about outside topics, just say "I'm here to help you learn cybersecurity and stay safe online. If you have any questions about cybersecurity, I'm happy to help!"

If the user asks about specific security topics, relate them to the available ICSA challenges and provide practical examples from the challenge system. Always be encouraging about their cybersecurity journey!`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
