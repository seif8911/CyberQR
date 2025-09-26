'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { getRandomPetTip } from '@/lib/utils';

export default function PetCompanion() {
  const { petVisible, petMessage, hidePet, showPet } = useAppStore();
  const [isVisible, setIsVisible] = useState(true); // Always visible
  const [showBubble, setShowBubble] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);
  const petRef = useRef<HTMLDivElement>(null);

  // Initialize position based on device type
  useEffect(() => {
    if (isMobile) {
      setPosition({ x: 20, y: 20 });
    } else {
      setPosition({ x: 20, y: 20 });
    }
  }, [isMobile]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
  };

  const handlePetClick = () => {
    // Check if this was a quick click (less than 200ms) vs a drag
    const clickDuration = Date.now() - dragStartTime;
    if (isDragging && clickDuration > 200) {
      // This was a drag, not a click
      return;
    }
    
    // Get a random cybersecurity tip
    const tip = getRandomPetTip();
    showPet(tip);
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

  if (!isVisible) return null;

  return (
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
        style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
      >
        <DotLottieReact
          src="/animations/Streak.lottie"
          loop
          autoplay
          style={{ width: '60px', height: '60px' }}
        />
      </div>
    </div>
  );
}
