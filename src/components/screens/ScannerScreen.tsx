'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';
import { scanImageFile, captureVideoFrame } from '@/lib/qr-scanner';

export default function ScannerScreen() {
  const { setCurrentScreen, addScanResult, addXP, showPet, setExtractedText } = useAppStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [captureStatus, setCaptureStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const capturedUrlRef = useRef<string | null>(null);

  const clearCapturedImage = () => {
    if (capturedUrlRef.current) {
      URL.revokeObjectURL(capturedUrlRef.current);
      capturedUrlRef.current = null;
    }
    setCapturedImage(null);
  };

  // Mock URLs for demonstration
  const mockUrls = {
    safe: [
      'https://www.wikipedia.org',
      'https://store.steampowered.com',
      'https://developer.mozilla.org',
      'https://www.github.com',
      'https://www.stackoverflow.com'
    ],
    caution: [
      'https://bit.ly/3x4mPl9',
      'https://tinyurl.com/abc123',
      'https://short.ly/xyz789',
      'https://t.co/randomlink'
    ],
    malicious: [
      'http://paypa1-secure-login.com',
      'http://g00gle-verify.support.ru',
      'http://micros0ft.account-reset.cn',
      'http://amazn-security.tk',
      'http://bank0famerica-login.ml'
    ]
  };

  async function analyze(url: string) {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      const result = {
        id: uuidv4(),
        url: data.url,
        riskLevel: data.riskLevel,
        riskScore: data.riskScore,
        timestamp: new Date(),
        threats: data.threats || [],
        recommendations: data.recommendations || [],
        explanation: data.explanation || '',
        results: Array.isArray(data.results) ? data.results : [],
      };
      addScanResult(result);
      addXP(6);
      const messages = {
        safe: 'Great job! Always verify before you trust 🔍',
        caution: 'Stay alert! Check for HTTPS after redirect 🔒',
        malicious: 'Excellent detection! You avoided a dangerous link 🛡️',
      } as const;
      showPet(messages[result.riskLevel as keyof typeof messages]);
      setCurrentScreen(`result-${result.riskLevel}`);
    } catch (e) {
      console.error(e);
      showPet('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function onAnalyzeClick() {
    if (!urlInput.trim()) return;
    await analyze(urlInput.trim());
  }

  async function onImageSelected(file: File) {
    try {
      showPet('Processing image...');
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        showPet('Please select an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        showPet('Image too large (max 10MB)');
        return;
      }
      
      // Scan the image using goQR.me API
      const result = await scanImageFile(file);
      
      if (result.error) {
        showPet(`Scan failed: ${result.error}`);
        return;
      }
      
      const text: string = result.data || '';
      console.log('QR Code extracted:', text);
      
      if (text && text.trim()) {
        // Check if it's a URL
        const isUrl = /^https?:\/\/.+/.test(text.trim());
        
        if (isUrl) {
          setUrlInput(text.trim());
          showPet('URL detected! Analyzing...');
          await analyze(text.trim());
        } else {
          // Show text content in a modal
          setExtractedText(text.trim());
          showPet('Text content found!');
          setCurrentScreen('text-result');
        }
      } else {
        showPet('No QR code found in image');
      }
    } catch (e: any) {
      console.error('Image processing error:', e);
      showPet('Failed to process image: ' + (e.message || 'Unknown error'));
    }
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => undefined);
      }
      clearCapturedImage();
    };
  }, []);

  useEffect(() => {
    if (captureStatus === 'error') {
      const timer = setTimeout(() => {
        clearCapturedImage();
        setCaptureStatus('idle');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [captureStatus]);

  async function toggleCamera() {
    if (cameraActive) {
      setCameraActive(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      clearCapturedImage();
      setCaptureStatus('idle');
      return;
    }
    
    try {
      showPet('Starting camera...');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }
      
      if (!videoRef.current) {
        showPet('Video element not ready');
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      await new Promise<void>((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => resolve();
        } else {
          resolve();
        }
      });
      
      setCameraActive(true);
      setCapturedImage(null);
      setCaptureStatus('idle');
      showPet('Camera ready! Use capture button to scan');
      
    } catch (e: any) {
      console.error('Camera error:', e);
      setCameraActive(false);
      if (e.name === 'NotAllowedError') {
        showPet('Camera permission denied. Please allow camera access.');
      } else if (e.name === 'NotFoundError') {
        showPet('No camera found on this device.');
      } else if (e.name === 'NotSupportedError') {
        showPet('Camera not supported. Try uploading an image instead.');
      } else if (e.message?.includes('not supported')) {
        showPet('Camera not supported on this device.');
      } else {
        showPet('Camera error: ' + (e.message || 'Unknown error'));
      }
    }
  }

  const handleBack = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="scanner-screen">
      <div className="scanner-content">
        <div className="scanner-header">
          <button className="ghost" onClick={handleBack}>
            ← Back
          </button>
          <div className={`scanner-status ${cameraActive ? 'active' : ''}`}>
            {cameraActive ? 'Camera Live' : 'Camera Ready'}
          </div>
        </div>

        <div className="scanner-body">
          <section className="scanner-preview">
            <div className="preview-card">
              <div className="preview-frame">
                <video
                  ref={videoRef}
                  className={cameraActive ? 'preview-video' : 'preview-video hidden'}
                  playsInline
                  muted
                  autoPlay
                />
                {!cameraActive && !capturedImage && (
                  <div className="preview-placeholder">
                    <div className="preview-icon">📱</div>
                    <p className="preview-title">Start the camera or upload an image to scan a QR code</p>
                    <p className="preview-subtitle">Desktop tip: align your code near the center for best results</p>
                  </div>
                )}

                {capturedImage && (
                  <div className="captured-overlay">
                    <img src={capturedImage} alt="Captured QR" />
                    <div className={`capture-status ${captureStatus}`}>
                      {captureStatus === 'processing' && 'Processing...'}
                      {captureStatus === 'success' && '✅ QR found'}
                      {captureStatus === 'error' && '❌ No QR detected'}
                    </div>
                  </div>
                )}

                {cameraActive && !capturedImage && <div className="preview-scan-overlay" />}

                <div className="capture-label">
                  <span className={cameraActive ? 'label live' : 'label idle'}>
                    {cameraActive ? 'Live Preview' : 'Preview'}
                  </span>
                </div>
              </div>

              <div className="preview-actions capture-only">
                <button
                  className="cta primary"
                  onClick={toggleCamera}
                  type="button"
                >
                  {cameraActive ? '📹 Stop Camera' : '📷 Start Camera'}
                </button>

                <button
                  className="cta success"
                  onClick={async () => {
                    if (!videoRef.current) return;
                    setCaptureStatus('processing');
                    clearCapturedImage();

                    try {
                      if (!audioContextRef.current) {
                        audioContextRef.current = new AudioContext();
                      }
                      const ctx = audioContextRef.current;
                      const oscillator = ctx.createOscillator();
                      const gain = ctx.createGain();
                      oscillator.type = 'triangle';
                      oscillator.frequency.value = 880;
                      gain.gain.value = 0.1;
                      oscillator.connect(gain);
                      gain.connect(ctx.destination);
                      oscillator.start();
                      oscillator.stop(ctx.currentTime + 0.15);
                    } catch (error) {
                      console.warn('Audio playback failed:', error);
                    }

                    try {
                      const frameBlob = await captureVideoFrame(videoRef.current);
                      const previewUrl = URL.createObjectURL(frameBlob);
                      capturedUrlRef.current = previewUrl;
                      setCapturedImage(previewUrl);

                      const file = new File([frameBlob], 'camera-capture.jpg', { type: 'image/jpeg' });
                      const result = await scanImageFile(file);

                      if (result.data && result.data.trim()) {
                        const text = result.data.trim();
                        setCaptureStatus('success');
                        showPet('✅ QR Code found!');
                        setCameraActive(false);
                        if (streamRef.current) {
                          streamRef.current.getTracks().forEach(track => track.stop());
                          streamRef.current = null;
                        }
                        setUrlInput(text);
                        analyze(text);
                      } else {
                        setCaptureStatus('error');
                        showPet(result.error || 'No QR code detected in photo');
                      }
                    } catch (error) {
                      console.error('Capture failed:', error);
                      setCaptureStatus('error');
                      showPet('Photo scan failed: ' + (error as Error).message);
                    }
                  }}
                  disabled={!cameraActive}
                  type="button"
                >
                  📸 Capture & Analyze
                </button>

                <label className="cta outline upload" htmlFor="scan-upload">
                  📁 Upload Image
                  <input
                    id="scan-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        clearCapturedImage();
                        setCaptureStatus('processing');
                        onImageSelected(f)
                          .then(() => setCaptureStatus('success'))
                          .catch(() => setCaptureStatus('error'));
                      }
                    }}
                  />
                </label>

                {captureStatus === 'error' && (
                  <button
                    className="cta outline"
                    onClick={() => {
                      clearCapturedImage();
                      setCaptureStatus('idle');
                      if (!cameraActive) {
                        toggleCamera();
                      }
                    }}
                    type="button"
                  >
                    ↺ Retake
                  </button>
                )}
              </div>

              {capturedImage && captureStatus !== 'processing' && (
                <div className="preview-footer">
                  <p>
                    {captureStatus === 'success' ? 'QR code recognized successfully.' : 'No QR code detected. Try retaking or upload an image.'}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="scanner-panel">
            <div className="card panel-card">
              <div className="panel-header">
                <strong>Manual URL Analysis</strong>
                {isAnalyzing && <span className="chip">Analyzing…</span>}
              </div>
              <div className="panel-body">
                <input
                  className="panel-input"
                  placeholder="Enter URL: https://example.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isAnalyzing && urlInput.trim()) {
                      onAnalyzeClick();
                    }
                  }}
                />
                <button
                  className="cta primary"
                  onClick={onAnalyzeClick}
                  disabled={isAnalyzing || !urlInput.trim()}
                  type="button"
                >
                  {isAnalyzing ? 'Analyzing URL…' : 'Analyze URL'}
                </button>
              </div>
            </div>

            <div className="card tips-card">
              <h3>Scanner Tips</h3>
              <ul>
                <li>Ensure the QR code fills most of the frame for better accuracy.</li>
                <li>Use Capture to take a single high-quality frame before analysis.</li>
                <li>Desktop users can upload screenshots or use external cameras.</li>
                <li>Scan results instantly recommend safe actions and learning paths.</li>
              </ul>
            </div>

            <button
              className="cta outline full"
              onClick={() => setCurrentScreen('icsa')}
              type="button"
            >
              🎯 Explore ICSA Hub
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
