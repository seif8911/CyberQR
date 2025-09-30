'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Shield, Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, setCurrentScreen, currentScreen, is2FAVerificationInProgress } = useAppStore();

  useEffect(() => {
    // If not loading and not authenticated, redirect to mini-onboarding (unless already on auth screen)
    if (!isLoading && !isAuthenticated) {
      const authScreens = ['welcome', 'mini-onboarding', 'login', 'register'];
      if (!authScreens.includes(currentScreen)) {
        setCurrentScreen('mini-onboarding');
      }
    }
    // If authenticated and on auth screens, redirect to home (unless 2FA verification is in progress)
    else if (!isLoading && isAuthenticated && !is2FAVerificationInProgress && (currentScreen === 'login' || currentScreen === 'register' || currentScreen === 'welcome' || currentScreen === 'mini-onboarding')) {
      setCurrentScreen('home');
    }
  }, [isAuthenticated, isLoading, setCurrentScreen, currentScreen, is2FAVerificationInProgress]);

  // Show loading screen while checking authentication
  if (isLoading) {
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
            justifyContent: 'center'
          }}
        >
          <Shield className="w-10 h-10" />
        </div>
        <h1 style={{ fontSize: '24px', margin: '0 0 8px', textAlign: 'center' }}>
          CyberQR
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: 'var(--muted)', 
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          Securing your digital world
        </p>
        <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--accent-2)' }} />
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  // Allow access to auth screens for unauthenticated users
  const authScreens = ['welcome', 'mini-onboarding', 'login', 'register'];
  if (!isAuthenticated && !authScreens.includes(currentScreen)) {
    return null;
  }

  // Render the app
  return <>{children}</>;
}
