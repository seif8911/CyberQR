'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import PhoneContainer from '@/components/PhoneContainer';
import DesktopLayout from '@/components/DesktopLayout';
import Navigation from '@/components/Navigation';
import PetCompanion from '@/components/PetCompanion';
import SimpleScreenManager from '@/components/SimpleScreenManager';
import DesktopHomeScreen from '@/components/screens/DesktopHomeScreen';
import AuthGuard from '@/components/AuthGuard';
import StartupAnimation from '@/components/StartupAnimation';

export default function ResponsiveLayout() {
  const { showPet, initializeAuth, isLoading, isAuthenticated, currentScreen } = useAppStore();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showStartup, setShowStartup] = useState(true);

  useEffect(() => {
    // Initialize Firebase authentication
    initializeAuth();
    setIsHydrated(true);
  }, [initializeAuth]);

  useEffect(() => {
    if (!isHydrated) return;

    // Check if we're on desktop
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    // Check on mount
    checkIsDesktop();

    // Add resize listener
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, [isHydrated]);

  const handleStartupComplete = () => {
    setShowStartup(false);
  };

  useEffect(() => {
    // Show welcome message only when authenticated and on home screen
    if (isAuthenticated && currentScreen === 'home') {
      setTimeout(() => {
        showPet('Welcome back! Ready to continue your cybersecurity journey? 🛡️');
      }, 1000);
    }
  }, [showPet, isAuthenticated, currentScreen]);

  // Show loading screen while initializing (only for logged-in users)
  if ((isLoading || !isHydrated) && isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        padding: '20px'
      }}>
        <div 
          className="logo" 
          style={{ 
            width: '80px', 
            height: '80px', 
            fontSize: '32px',
            background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px',
            overflow: 'hidden'
          }}
        >
          <img 
            src="/animations/Snapshot_3.PNG" 
            alt="CyberQR Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <h1 style={{ fontSize: '24px', margin: '0 0 8px', textAlign: 'center' }}>
          CyberQR
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: 'var(--muted)', 
          textAlign: 'center'
        }}>
          Initializing security systems...
        </p>
      </div>
    );
  }

  // Show startup animation first
  if (showStartup) {
    return <StartupAnimation onComplete={handleStartupComplete} showGif={!isAuthenticated} />;
  }

  // Desktop layout for screens larger than 1024px
  if (isDesktop) {
    // For unauthenticated users, show full-screen auth screens
    if (!isAuthenticated) {
      return (
        <AuthGuard>
          <div className="desktop-auth-fullscreen">
            <SimpleScreenManager />
          </div>
        </AuthGuard>
      );
    }

    // Hide sidebar during auth screens for authenticated users
    const authScreens = ['login', 'register', 'onboarding', 'welcome', 'mini-onboarding'];
    const shouldShowSidebar = !authScreens.includes(currentScreen);

    return (
      <AuthGuard>
        {shouldShowSidebar ? (
          <DesktopLayout>
            {currentScreen === 'home' ? (
              <DesktopHomeScreen />
            ) : (
              <SimpleScreenManager />
            )}
          </DesktopLayout>
        ) : (
          <div className="desktop-layout auth-layout">
            <main className="desktop-main">
              <div className="desktop-content">
                <SimpleScreenManager />
              </div>
            </main>
          </div>
        )}
        <PetCompanion />
      </AuthGuard>
    );
  }

  // Mobile layout for screens 1024px and below
  return (
    <PhoneContainer>
      <AuthGuard>
        <SimpleScreenManager />
        {isAuthenticated && <Navigation />}
        {isAuthenticated && <PetCompanion />}
      </AuthGuard>
    </PhoneContainer>
  );
}
