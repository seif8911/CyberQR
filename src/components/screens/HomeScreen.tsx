'use client';

import { useAppStore } from '@/lib/store';
import { useEffect } from 'react';

export default function HomeScreen() {
  const { user, setCurrentScreen, showPet, updateStreak } = useAppStore();

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const handleQuickAction = (action: string) => {
    console.log('Navigating to:', action);
    setCurrentScreen(action);
    if (action === 'scan') {
      showPet('Great! Always verify before you trust 🔍');
    }
  };

  const xpPercentage = user ? (user.xp % 100) : 0;

  return (
    <>
      <div className="topbar">
        <div className="logo">🛡️</div>
        <div className="chip">
          Day {user?.streak || 1} 🔥 Streak
        </div>
      </div>
      
      <h1 className="title">CyberQR</h1>
      <p className="subtitle">
        Scan QR codes safely, learn to spot scams, and level up your cyber skills.
      </p>
      
      <div className="card" style={{ margin: '18px 0' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="col" style={{ gap: '6px' }}>
            <strong>Quick Start</strong>
            <span className="subtitle">
              Jump into a scan or your first lesson.
            </span>
          </div>
          <div className="badge">
            {user ? `Level ${user.level}` : 'Welcome!'}
          </div>
        </div>
        <div className="progress" style={{ marginTop: '12px' }}>
          <div style={{ width: `${xpPercentage}%` }} />
        </div>
      </div>
      
      <div className="col">
        <button 
          className="cta" 
          onClick={() => handleQuickAction('scan')}
        >
          Start QR Scan
        </button>
        <button 
          className="cta secondary" 
          onClick={() => handleQuickAction('onboarding')}
        >
          Start First Lesson
        </button>
        <button 
          className="cta secondary" 
          onClick={() => handleQuickAction('icsa')}
        >
          Open ICSA Hub
        </button>
      </div>
    </>
  );
}
