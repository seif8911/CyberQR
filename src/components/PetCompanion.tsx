'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import CyberSecurityChat from './CyberSecurityChat';

export default function PetCompanion() {
  const { petVisible, petMessage, hidePet, showPet, user, is2FAVerificationInProgress } = useAppStore();
  const [isVisible, setIsVisible] = useState(true);
  const [showBubble, setShowBubble] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const petRef = useRef<HTMLDivElement>(null);
  const lastSavedPosition = useRef<{ x: number; y: number } | null>(null);
  const periodicSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const lastScreenSize = useRef<{ width: number; height: number } | null>(null);

  // Load saved position from localStorage
  useEffect(() => {
    const loadPetPosition = () => {
      const deviceType = isMobile ? 'mobile' : 'desktop';
      const storageKey = `petPosition_${deviceType}`;
      const savedData = localStorage.getItem(storageKey);
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // Check if screen size has changed significantly (more than 100px difference)
          if (lastScreenSize.current && 
              (Math.abs(lastScreenSize.current.width - screenSize.width) > 100 || 
               Math.abs(lastScreenSize.current.height - screenSize.height) > 100)) {
            // Screen size changed significantly, reset to default position
            console.log('Screen size changed significantly, resetting pet to default position');
            setPosition({ x: 20, y: 20 });
            lastSavedPosition.current = { x: 20, y: 20 };
            return;
          }
          
          // Convert relative position to absolute position
          const relativePosition = parsedData.relativePosition || parsedData; // Backward compatibility
          const absolutePosition = {
            x: Math.round((relativePosition.x / 100) * screenSize.width),
            y: Math.round((relativePosition.y / 100) * screenSize.height)
          };
          
          // Ensure position is within bounds
          const petSize = 60;
          const boundedPosition = {
            x: Math.max(0, Math.min(absolutePosition.x, screenSize.width - petSize)),
            y: Math.max(0, Math.min(absolutePosition.y, screenSize.height - petSize))
          };
          
          setPosition(boundedPosition);
          lastSavedPosition.current = boundedPosition;
        } catch (error) {
          console.error('Error parsing saved pet position:', error);
          setPosition({ x: 20, y: 20 });
        }
      } else {
        // No saved position, use default
        setPosition({ x: 20, y: 20 });
        lastSavedPosition.current = { x: 20, y: 20 };
      }
    };

    if (screenSize.width > 0 && screenSize.height > 0) {
      loadPetPosition();
    }
  }, [isMobile, screenSize.width, screenSize.height]);

  // Detect mobile device and track screen size
  useEffect(() => {
    const checkMobileAndScreenSize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      
      // More accurate detection: consider both screen size and user agent
      const isSmallScreen = currentWidth <= 1024; // Match our desktop breakpoint
      const isMobileUserAgent = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Consider it mobile if it's a small screen OR has mobile user agent OR is touch device
      const newIsMobile = isSmallScreen || isMobileUserAgent || isTouchDevice;
      
      // Update screen size
      setScreenSize({ width: currentWidth, height: currentHeight });
      
      // Check if screen size changed significantly
      if (lastScreenSize.current && 
          (Math.abs(lastScreenSize.current.width - currentWidth) > 100 || 
           Math.abs(lastScreenSize.current.height - currentHeight) > 100)) {
        console.log('Screen size changed significantly, will reset pet position');
      }
      
      // Update last screen size
      lastScreenSize.current = { width: currentWidth, height: currentHeight };
      
      setIsMobile(newIsMobile);
    };
    
    checkMobileAndScreenSize();
    window.addEventListener('resize', checkMobileAndScreenSize);
    return () => window.removeEventListener('resize', checkMobileAndScreenSize);
  }, []);

  useEffect(() => {
    if (petVisible) {
      setShowBubble(true);
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [petVisible]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!petRef.current) return;
    const rect = petRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDragStartTime(Date.now());
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!petRef.current) return;
    e.preventDefault();
    const rect = petRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    setDragStartTime(Date.now());
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep pet within viewport bounds (60px is the pet size)
    const petSize = 60;
    const maxX = window.innerWidth - petSize;
    const maxY = window.innerHeight - petSize;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    savePositionToLocalStorage();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const newX = touch.clientX - dragOffset.x;
    const newY = touch.clientY - dragOffset.y;
    
    // Keep pet within viewport bounds (60px is the pet size)
    const petSize = 60;
    const maxX = window.innerWidth - petSize;
    const maxY = window.innerHeight - petSize;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    savePositionToLocalStorage();
  };

  const savePositionToLocalStorage = () => {
    const deviceType = isMobile ? 'mobile' : 'desktop';
    const storageKey = `petPosition_${deviceType}`;
    
    // Convert absolute position to relative position (percentage of screen)
    const relativePosition = {
      x: Math.round((position.x / screenSize.width) * 100),
      y: Math.round((position.y / screenSize.height) * 100)
    };
    
    // Save both relative position and screen size for reference
    const saveData = {
      relativePosition,
      screenSize: { width: screenSize.width, height: screenSize.height },
      timestamp: Date.now()
    };
    
    localStorage.setItem(storageKey, JSON.stringify(saveData));
    lastSavedPosition.current = { ...position };
  };

  // Periodic save function - saves every second if position changed
  const periodicSave = () => {
    if (!lastSavedPosition.current || 
        lastSavedPosition.current.x !== position.x || 
        lastSavedPosition.current.y !== position.y) {
      savePositionToLocalStorage();
    }
  };

  const handlePetClick = () => {
    // Check if this was a quick click (less than 200ms) vs a drag
    const clickDuration = Date.now() - dragStartTime;
    if (isDragging && clickDuration > 200) {
      // This was a drag, not a click
      return;
    }
    
    // Open chat interface
    setShowChat(true);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove as any, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove as any);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset]);

  // Start periodic save interval
  useEffect(() => {
    // Start the periodic save interval (every 1 second)
    periodicSaveInterval.current = setInterval(periodicSave, 1000);

    // Cleanup on unmount
    return () => {
      if (periodicSaveInterval.current) {
        clearInterval(periodicSaveInterval.current);
      }
    };
  }, [position]); // Re-run when position changes

  if (!isVisible || !user || is2FAVerificationInProgress) return null;

  return (
    <>
      {/* Chat Interface */}
      <CyberSecurityChat 
        isOpen={showChat} 
        onClose={() => setShowChat(false)} 
      />
      
      {/* Pet Companion */}
      <div 
        className={`streak-pet ${isMobile ? 'mobile' : 'desktop'}`}
        ref={petRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 1000,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Speech Bubble */}
        {showBubble && petMessage && (
          <div className="speech-bubble">
            <div className="bubble-content">
              {petMessage}
            </div>
            <div className="bubble-tail"></div>
          </div>
        )}
        
        {/* Pet Character */}
        <div 
          className="pet-character"
          onClick={handlePetClick}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!isDragging) {
              e.currentTarget.style.transform = 'scale(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <DotLottieReact
            src="/animations/Streak.lottie"
            loop
            autoplay
            style={{ width: '60px', height: '60px' }}
          />
        </div>
      </div>
    </>
  );
}