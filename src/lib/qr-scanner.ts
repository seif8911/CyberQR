export type ScanResult = {
  data?: string;
  error?: string;
};

/**
 * Uploads an image file to the goQR API and returns the decoded text.
 */
export async function scanImageFile(file: File): Promise<ScanResult> {
  const endpoint = 'https://api.qrserver.com/v1/read-qr-code/';

  const body = new FormData();
  body.append('file', file);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body,
    });

    if (!response.ok) {
      return { error: `HTTP ${response.status}: Unable to read QR code.` };
    }

    const payload: any = await response.json();
    const symbol = payload?.[0]?.symbol?.[0];

    if (!symbol) {
      return { error: 'Unexpected QR response format.' };
    }

    if (symbol.error) {
      return { error: symbol.error };
    }

    if (typeof symbol.data === 'string' && symbol.data.trim()) {
      return { data: symbol.data.trim() };
    }

    return { error: 'No QR code data detected.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { error: `QR scan failed: ${message}` };
  }
}

/**
 * Captures the current frame from a playing video element.
 */
export async function captureVideoFrame(video: HTMLVideoElement): Promise<Blob> {
  if (!video.videoWidth || !video.videoHeight) {
    throw new Error('Video stream not ready.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to create canvas context.');
  }

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result);
      } else {
        reject(new Error('Failed to capture frame.'));
      }
    }, 'image/jpeg', 0.92);
  });

  return blob;
}

