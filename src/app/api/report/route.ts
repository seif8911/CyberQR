import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { url, reportType, userReason } = await request.json();

    if (!url || !reportType) {
      return NextResponse.json(
        { error: 'URL and report type are required' },
        { status: 400 }
      );
    }

    // Add report to database
    const reportData = {
      url: url.toLowerCase().trim(),
      reportType, // 'malicious', 'safe', 'false_positive'
      userReason: userReason || '',
      timestamp: serverTimestamp(),
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    await addDoc(collection(db, 'reports'), reportData);

    return NextResponse.json({ 
      success: true, 
      message: 'Report submitted successfully' 
    });

  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}
