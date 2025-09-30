import { NextRequest, NextResponse } from 'next/server';
import { imgbbService } from '@/lib/imgbb-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Upload to imgBB
    const result = await imgbbService.uploadQRImage(file);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 500 }
      );
    }

    // Return file info
    return NextResponse.json({
      success: true,
      url: result.url,
      display_url: result.display_url,
      thumb_url: result.thumb_url,
      medium_url: result.medium_url,
      delete_url: result.delete_url,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
