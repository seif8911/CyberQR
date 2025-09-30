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
        setShowVideo(false);
        setShowLoading(true);
        
        // Show loading animation for 2 seconds
        const timer1 = setTimeout(() => {
          if (animationComplete) return; // Prevent overlapping
          setShowSecurityTip(true);
          
          // Complete the animation after showing the tip
          const timer2 = setTimeout(() => {
            if (animationComplete) return; // Prevent overlapping
            setAnimationComplete(true);
            onComplete();
          }, 3000);
          
          timeoutRefs.current.push(timer2);
        }, 2000);
        
        timeoutRefs.current.push(timer1);
      };

      // Add event listener for video end
      video.addEventListener('ended', handleVideoEnd);
      
      // Start playing the video
      video.play().catch(console.error);

      // Cleanup function
      return () => {
        video.removeEventListener('ended', handleVideoEnd);
        clearAllTimeouts();
      };
    } else {
      // For authenticated users: skip video, go straight to loading
      setShowVideo(false);
      setShowLoading(true);
      
      // Show loading animation for 2 seconds
      const timer1 = setTimeout(() => {
        if (animationComplete) return; // Prevent overlapping
        setShowSecurityTip(true);
        
        // Complete the animation after showing the tip
        const timer2 = setTimeout(() => {
          if (animationComplete) return; // Prevent overlapping
          setAnimationComplete(true);
          onComplete();
        }, 3000);
        
        timeoutRefs.current.push(timer2);
      }, 2000);
      
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
            >
              <source src="/animations/startup-animation.webm" type="video/webm" />
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
      </div>
    </div>
  );
}
