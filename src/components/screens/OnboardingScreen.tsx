'use client';

import { useAppStore } from '@/lib/store';

export default function OnboardingScreen() {
  const { setCurrentScreen } = useAppStore();

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const handleStartScanning = () => {
    setCurrentScreen('scan');
  };

  const handleBeginTraining = () => {
    setCurrentScreen('lesson-spot');
  };

  return (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          ← Back
        </button>
        <div className="chip">Onboarding</div>
      </div>
      
      <div className="card">
        <h2 style={{ margin: '0 0 8px' }}>Welcome to CyberQR</h2>
        <p className="subtitle">
          We scan QR codes, teach you how to spot scams, and reward you with points, badges, and a cute streak pet 🐾.
        </p>
        <ul className="subtitle" style={{ margin: '12px 0', paddingLeft: '16px' }}>
          <li>Real-time link safety analysis</li>
          <li>Interactive cybersecurity lessons</li>
          <li>Daily streaks & achievements</li>
          <li>Gamified learning experience</li>
        </ul>
      </div>
      
      <div className="card" style={{ marginTop: '12px' }}>
        <h3 style={{ margin: '0 0 8px' }}>How It Works</h3>
        <div className="col" style={{ gap: '8px' }}>
          <div className="row" style={{ alignItems: 'flex-start', gap: '12px' }}>
            <div className="chip" style={{ minWidth: '24px', textAlign: 'center' }}>1</div>
            <div>
              <strong>Scan QR Codes</strong>
              <p className="subtitle" style={{ margin: '2px 0 0' }}>
                Use our scanner to analyze QR codes for security threats
              </p>
            </div>
          </div>
          <div className="row" style={{ alignItems: 'flex-start', gap: '12px' }}>
            <div className="chip" style={{ minWidth: '24px', textAlign: 'center' }}>2</div>
            <div>
              <strong>Learn & Practice</strong>
              <p className="subtitle" style={{ margin: '2px 0 0' }}>
                Complete interactive lessons to improve your cyber skills
              </p>
            </div>
          </div>
          <div className="row" style={{ alignItems: 'flex-start', gap: '12px' }}>
            <div className="chip" style={{ minWidth: '24px', textAlign: 'center' }}>3</div>
            <div>
              <strong>Earn Rewards</strong>
              <p className="subtitle" style={{ margin: '2px 0 0' }}>
                Gain XP, unlock badges, and maintain your security streak
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ 
        position: 'sticky', 
        bottom: 0, 
        background: 'linear-gradient(180deg, transparent, rgba(0,0,0,.35))', 
        padding: '14px 10px 8px', 
        display: 'flex', 
        gap: '10px' 
      }}>
        <button className="cta secondary" onClick={handleStartScanning}>
          Start Scanning
        </button>
        <button className="cta" onClick={handleBeginTraining}>
          Begin Training
        </button>
      </div>
    </>
  );
}
