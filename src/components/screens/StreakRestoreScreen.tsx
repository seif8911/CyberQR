'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Flame, QrCode, Target, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StreakRestoreScreen() {
  const { user, setCurrentScreen, updateStreak } = useAppStore();
  const [restorationProgress, setRestorationProgress] = useState({
    qrScans: 0,
    challengeCompleted: false
  });
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const handleQRScan = () => {
    setCurrentScreen('scan');
  };

  const handleChallenge = () => {
    setCurrentScreen('icsa');
  };

  const checkRestorationComplete = () => {
    const { qrScans, challengeCompleted } = restorationProgress;
    
    if (qrScans >= 3 || challengeCompleted) {
      setIsRestoring(true);
      
      // Simulate restoration process
      setTimeout(() => {
        // Restore streak to 1
        updateStreak();
        toast.success('🔥 Streak restored! Welcome back!');
        setCurrentScreen('home');
      }, 2000);
    }
  };

  useEffect(() => {
    checkRestorationComplete();
  }, [restorationProgress]);

  // Listen for QR scan completions and challenge completions
  useEffect(() => {
    const handleQRScanComplete = () => {
      setRestorationProgress(prev => ({
        ...prev,
        qrScans: Math.min(prev.qrScans + 1, 3)
      }));
    };

    const handleChallengeComplete = () => {
      setRestorationProgress(prev => ({
        ...prev,
        challengeCompleted: true
      }));
    };

    // Listen for custom events (these would be dispatched from other components)
    window.addEventListener('qr-scan-complete', handleQRScanComplete);
    window.addEventListener('challenge-complete', handleChallengeComplete);

    return () => {
      window.removeEventListener('qr-scan-complete', handleQRScanComplete);
      window.removeEventListener('challenge-complete', handleChallengeComplete);
    };
  }, []);

  const { qrScans, challengeCompleted } = restorationProgress;
  const isComplete = qrScans >= 3 || challengeCompleted;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '30px'
      }}>
        <button 
          onClick={handleBack}
          style={{
            padding: '8px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'var(--text)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <h1 style={{ 
          fontSize: '24px', 
          margin: 0,
          fontWeight: '700'
        }}>
          Restore Your Streak
        </h1>
      </div>

      {/* Streak Lost Message */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 147, 30, 0.1) 100%)',
        border: '1px solid rgba(255, 107, 53, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          💔
        </div>
        <h2 style={{
          fontSize: '20px',
          margin: '0 0 8px',
          color: 'var(--warn)'
        }}>
          Streak Lost
        </h2>
        <p style={{
          fontSize: '16px',
          color: 'var(--muted)',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Don't worry! You can restore your streak by completing one of the challenges below.
        </p>
      </div>

      {/* Restoration Options */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{
          fontSize: '18px',
          margin: '0 0 16px',
          fontWeight: '600'
        }}>
          Choose Your Restoration Method
        </h3>

        {/* QR Scan Option */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <QrCode className="w-6 h-6" style={{ color: 'white' }} />
            </div>
            
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: '16px',
                margin: '0 0 4px',
                fontWeight: '600'
              }}>
                Scan 3 QR Codes
              </h4>
              <p style={{
                fontSize: '14px',
                color: 'var(--muted)',
                margin: 0
              }}>
                Complete 3 QR code scans to restore your streak
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                display: 'flex',
                gap: '4px'
              }}>
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: num <= qrScans ? 'var(--ok)' : 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: num <= qrScans ? 'white' : 'var(--muted)'
                    }}
                  >
                    {num <= qrScans ? <CheckCircle className="w-3 h-3" /> : num}
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleQRScan}
                disabled={qrScans >= 3}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: qrScans >= 3 
                    ? 'var(--ok)' 
                    : 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
                  border: 'none',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: qrScans >= 3 ? 'default' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {qrScans >= 3 ? 'Complete!' : 'Start Scanning'}
              </button>
            </div>
          </div>
        </div>

        {/* Challenge Option */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '20px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, var(--ok) 0%, var(--accent-2) 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target className="w-6 h-6" style={{ color: 'white' }} />
            </div>
            
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: '16px',
                margin: '0 0 4px',
                fontWeight: '600'
              }}>
                Complete a Cybersecurity Challenge
              </h4>
              <p style={{
                fontSize: '14px',
                color: 'var(--muted)',
                margin: 0
              }}>
                Finish any challenge in the Cybersecurity Arena
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: challengeCompleted ? 'var(--ok)' : 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                {challengeCompleted ? <CheckCircle className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
              </div>
              
              <button
                onClick={handleChallenge}
                disabled={challengeCompleted}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: challengeCompleted 
                    ? 'var(--ok)' 
                    : 'linear-gradient(135deg, var(--ok) 0%, var(--accent-2) 100%)',
                  border: 'none',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: challengeCompleted ? 'default' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {challengeCompleted ? 'Complete!' : 'Start Challenge'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {isComplete && (
        <div style={{
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid var(--ok)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '12px'
          }}>
            🎉
          </div>
          <h3 style={{
            fontSize: '18px',
            margin: '0 0 8px',
            color: 'var(--ok)'
          }}>
            Restoration Complete!
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--muted)',
            margin: 0
          }}>
            Your streak is being restored...
          </p>
        </div>
      )}

      {/* Tips */}
      <div style={{
        background: 'rgba(34,211,238,0.1)',
        border: '1px solid var(--accent-2)',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <h4 style={{
          fontSize: '14px',
          margin: '0 0 8px',
          color: 'var(--accent-2)',
          fontWeight: '600'
        }}>
          💡 Tips to Maintain Your Streak
        </h4>
        <ul style={{
          fontSize: '12px',
          color: 'var(--muted)',
          margin: 0,
          paddingLeft: '16px',
          lineHeight: '1.5'
        }}>
          <li>Complete at least one activity daily</li>
          <li>Set a reminder to check the app</li>
          <li>Try different challenges to keep it interesting</li>
          <li>Share your progress with friends</li>
        </ul>
      </div>
    </div>
  );
}
