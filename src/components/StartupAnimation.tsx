'use client';

import { useState, useEffect, useRef } from 'react';

interface StartupAnimationProps {
  onComplete: () => void;
  showGif?: boolean;
}

export default function StartupAnimation({ onComplete, showGif = true }: StartupAnimationProps) {
  const [showVideo, setShowVideo] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showSecurityTip, setShowSecurityTip] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const securityTips = [
    "Always verify QR codes before scanning",
    "Check URLs before clicking links",
    "Use strong, unique passwords",
    "Enable two-factor authentication",
    "Keep your software updated",
    "Be cautious with public WiFi",
    "Don't share personal information online",
    "Use a password manager",
    "Regularly backup your data",
    "Be skeptical of unsolicited messages"
  ];

  const [currentTip, setCurrentTip] = useState(
    securityTips[Math.floor(Math.random() * securityTips.length)]
  );

  // Cleanup function to clear all timeouts
  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  };

  // Reset animation state
  const resetAnimationState = () => {
    setShowVideo(true);
    setShowLoading(false);
    setShowSecurityTip(false);
    setAnimationComplete(false);
    setShowSkipButton(false);
  };

  // Manual skip function
  const handleSkip = () => {
    clearAllTimeouts();
    setAnimationComplete(true);
    onComplete();
  };

  useEffect(() => {
    // Clear any existing timeouts and reset state
    clearAllTimeouts();
    resetAnimationState();
    
    if (showGif) {
      // For unauthenticated users: show video first, then loading
      const video = videoRef.current;
      if (!video) return;

      const handleVideoEnd = () => {
        if (animationComplete) return; // Prevent overlapping
        console.log('Video ended, starting loading sequence');
        setShowVideo(false);
        setShowLoading(true);
        
        // Show loading animation for 3 seconds (increased from 2)
        const timer1 = setTimeout(() => {
          if (animationComplete) return; // Prevent overlapping
          console.log('Showing security tip');
          setShowSecurityTip(true);
          
          // Complete the animation after showing the tip for 4 seconds (increased from 3)
          const timer2 = setTimeout(() => {
            if (animationComplete) return; // Prevent overlapping
            console.log('Animation complete, calling onComplete');
            setAnimationComplete(true);
            onComplete();
          }, 4000);
          
          timeoutRefs.current.push(timer2);
        }, 3000);
        
        timeoutRefs.current.push(timer1);
      };

      const handleVideoError = (e: Event) => {
        console.error('Video error:', e);
        // If video fails, proceed with loading sequence
        handleVideoEnd();
      };

      const handleVideoCanPlay = () => {
        console.log('Video can play, starting playback');
        video.play().catch((error) => {
          console.error('Video play error:', error);
          // If video can't play, proceed with loading sequence
          handleVideoEnd();
        });
      };

      // Add event listeners
      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('error', handleVideoError);
      video.addEventListener('canplay', handleVideoCanPlay);
      
      // Set video properties to ensure it plays
      video.load();
      video.currentTime = 0;

      // Show skip button after 3 seconds
      const skipButtonTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 3000);
      
      timeoutRefs.current.push(skipButtonTimer);

      // Fallback: if video doesn't start within 8 seconds, proceed anyway
      const fallbackTimer = setTimeout(() => {
        if (!animationComplete && showVideo) {
          console.log('Video fallback triggered, proceeding with animation');
          handleVideoEnd();
        }
      }, 8000);
      
      timeoutRefs.current.push(fallbackTimer);

      // Cleanup function
      return () => {
        video.removeEventListener('ended', handleVideoEnd);
        video.removeEventListener('error', handleVideoError);
        video.removeEventListener('canplay', handleVideoCanPlay);
        clearAllTimeouts();
      };
    } else {
      // For authenticated users: skip video, go straight to loading
      console.log('Skipping video for authenticated user');
      setShowVideo(false);
      setShowLoading(true);
      
      // Show loading animation for 3 seconds (increased from 2)
      const timer1 = setTimeout(() => {
        if (animationComplete) return; // Prevent overlapping
        console.log('Showing security tip for authenticated user');
        setShowSecurityTip(true);
        
        // Complete the animation after showing the tip for 4 seconds (increased from 3)
        const timer2 = setTimeout(() => {
          if (animationComplete) return; // Prevent overlapping
          console.log('Animation complete for authenticated user, calling onComplete');
          setAnimationComplete(true);
          onComplete();
        }, 4000);
        
        timeoutRefs.current.push(timer2);
      }, 3000);
      
      timeoutRefs.current.push(timer1);

      // Cleanup function
      return () => {
        clearAllTimeouts();
      };
    }
  }, [onComplete, showGif, animationComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  return (
    <div className="startup-animation">
      <div className="startup-container">
        {showVideo && (
          <div className="video-container">
            <video
              ref={videoRef}
              className="mascot-video"
              muted
              playsInline
              preload="auto"
              autoPlay
              loop={false}
            >
              <source src="/animations/startup-animation.webm" type="video/webm" />
              <source src="/animations/mascot-1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {showLoading && (
          <div className="loading-container">
            <div className="loading-animation">
              <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <h2 className="loading-text">Cyber QR Loading</h2>
            </div>
          </div>
        )}

        {showSecurityTip && (
          <div className="security-tip-container">
            <div className="security-tip">
              <div className="tip-icon">🛡️</div>
              <p className="tip-text">{currentTip}</p>
            </div>
          </div>
        )}

        {showSkipButton && !animationComplete && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1000
          }}>
            <button
              onClick={handleSkip}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '20px',
                padding: '8px 16px',
                color: 'var(--text)',
                fontSize: '14px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
            >
              Skip Animation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
