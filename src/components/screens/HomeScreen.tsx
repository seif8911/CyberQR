'use client';

import { useAppStore } from '@/lib/store';
import { useEffect } from 'react';

export default function HomeScreen() {
  const { user, setCurrentScreen, showPet, updateStreak, checkStreakLoss, isAuthenticated } = useAppStore();

  useEffect(() => {
    updateStreak();
    checkStreakLoss();
  }, [updateStreak, checkStreakLoss]);

  const handleQuickAction = (action: string) => {
    console.log('Navigating to:', action);
    setCurrentScreen(action);
    if (action === 'scan') {
      showPet('Great! Always verify before you trust 🔍');
    }
  };

  const xpPercentage = user ? (user.xp % 100) : 0;
  const nextLevelXP = 100 - ((user?.xp || 0) % 100);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Header with user info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingTop: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            onClick={() => setCurrentScreen('profile')}
            style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%',
              background: user?.photoURL 
                ? `url(${user.photoURL})` 
                : 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'var(--accent-2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
          >
            {!user?.photoURL && (
              <span style={{ fontSize: '20px' }}>👤</span>
            )}
          </div>
          <div>
            <h2 style={{ 
              fontSize: '18px', 
              margin: '0 0 4px',
              fontWeight: '600'
            }}>
              Welcome back!
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--muted)',
              margin: 0
            }}>
              {user?.displayName || 'Cyber Warrior'}
            </p>
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <span style={{ fontSize: '16px' }}>🔥</span>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>
            Day {user?.streak ?? 1}
          </span>
        </div>
      </div>

      {/* Level Progress Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(249,178,34,0.1) 100%)',
        border: '1px solid rgba(34,211,238,0.3)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
          borderRadius: '50%',
          opacity: 0.1
        }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ 
              fontSize: '20px', 
              margin: '0 0 4px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Level {user?.level ?? 1}
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--muted)',
              margin: 0
            }}>
              {nextLevelXP} XP to next level
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-2)' }}>
              {user?.xp ?? 0}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>XP</div>
          </div>
        </div>
        
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${xpPercentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent-2) 0%, var(--accent) 100%)',
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          margin: '0 0 16px',
          fontWeight: '600'
        }}>
          Quick Actions
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => handleQuickAction('scan')}
            style={{
              width: '100%',
              padding: '16px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(34, 211, 238, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(34, 211, 238, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(34, 211, 238, 0.3)';
            }}
          >
            <span style={{ fontSize: '20px' }}>📱</span>
            Start QR Scan
          </button>
          
          <button
            onClick={() => handleQuickAction('icsa')}
            style={{
              width: '100%',
              padding: '16px 20px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--text)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '20px' }}>🎯</span>
            Cybersecurity Arena
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          margin: '0 0 16px',
          fontWeight: '600'
        }}>
          Recent Activity
        </h3>
        
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, var(--ok) 0%, var(--accent-2) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              🏆
            </div>
            <div>
              <p style={{ 
                fontSize: '14px', 
                margin: '0 0 4px',
                fontWeight: '600'
              }}>
                Welcome to CyberQR!
              </p>
              <p style={{ 
                fontSize: '12px', 
                color: 'var(--muted)',
                margin: 0
              }}>
                Start your cybersecurity journey
              </p>
            </div>
          </div>
          
          <button
            onClick={() => handleQuickAction('onboarding')}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(34,211,238,0.1)',
              border: '1px solid var(--accent-2)',
              color: 'var(--accent-2)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(34,211,238,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(34,211,238,0.1)';
            }}
          >
            Start Onboarding
          </button>
        </div>
      </div>

    </div>
  );
}