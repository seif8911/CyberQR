import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { TwoFactorAuthService } from '@/lib/two-factor-auth';
import { authService } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { Shield, ArrowLeft, Key } from 'lucide-react';

interface TwoFactorVerificationScreenProps {
  onSuccess: () => void;
  onCancel: () => void;
  pendingUser?: any;
}

export default function TwoFactorVerificationScreen({ onSuccess, onCancel, pendingUser }: TwoFactorVerificationScreenProps) {
  const { firebaseUser } = useAppStore();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);


  const handleVerifyCode = async (codeToVerify?: string) => {
    const user = pendingUser || firebaseUser;
    const codeToUse = codeToVerify || code;
    
    if (!user || !codeToUse) {
      return;
    }

    setIsLoading(true);
    try {
      const isValid = await TwoFactorAuthService.verify2FA(user.uid, codeToUse);
      
      if (isValid) {
        toast.success('2FA verification successful!');
        onSuccess();
      } else {
        toast.error('Invalid verification code');
        setCode('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      toast.error('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyBackupCode = async () => {
    const user = pendingUser || firebaseUser;
    if (!user || !backupCode) return;

    setIsLoading(true);
    try {
      const isValid = await TwoFactorAuthService.verify2FA(user.uid, backupCode);
      
      if (isValid) {
        toast.success('Backup code accepted!');
        onSuccess();
      } else {
        toast.error('Invalid backup code');
        setBackupCode('');
      }
    } catch (error) {
      console.error('Backup code verification error:', error);
      toast.error('Failed to verify backup code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleanedValue = rawValue.replace(/\D/g, '');
    const finalValue = cleanedValue.slice(0, 6);
    
    setCode(finalValue);
    
    // Auto-submit when 6 digits are entered
    if (finalValue.length === 6) {
      setTimeout(() => {
        handleVerifyCode(finalValue);
      }, 100);
    }
  };

  const handleBackupCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setBackupCode(value);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.8)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <div style={{ 
        backgroundColor: 'var(--background)', 
        borderRadius: '16px', 
        padding: '24px', 
        maxWidth: '400px', 
        width: '100%',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="topbar" style={{ marginBottom: '20px' }}>
          <button className="ghost" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4" style={{ marginRight: '8px' }} />
            Cancel
          </button>
          <div className="chip">2FA Required</div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--accent)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Shield className="w-8 h-8" style={{ color: 'white' }} />
          </div>
          <h2 style={{ margin: '0 0 8px' }}>Two-Factor Authentication</h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'var(--card)', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          fontSize: '12px',
          color: 'var(--muted)',
          textAlign: 'center',
          border: '1px solid var(--border)'
        }}>
          <p style={{ margin: 0 }}>
            💡 <strong>Tip:</strong> If the code doesn't work, wait for the next one to generate (30 seconds) and try again.
          </p>
        </div>

        {!showBackupCodes ? (
          <>
            <div className="col" style={{ gap: '16px' }}>
              <input
                ref={inputRef}
                type="text"
                placeholder="000000"
                value={code}
                onChange={handleCodeChange}
                style={{ 
                  textAlign: 'center', 
                  fontSize: '24px', 
                  letterSpacing: '4px',
                  fontFamily: 'monospace',
                  padding: '16px',
                  border: '2px solid var(--border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--card)',
                  width: '100%'
                }}
                maxLength={6}
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              
              <button 
                className="cta" 
                onClick={() => {
                  handleVerifyCode();
                }}
                disabled={isLoading || code.length !== 6}
                style={{ width: '100%' }}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button 
                className="ghost" 
                onClick={() => setShowBackupCodes(true)}
                style={{ fontSize: '14px' }}
              >
                <Key className="w-4 h-4" style={{ marginRight: '8px' }} />
                Use backup code instead
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="col" style={{ gap: '16px' }}>
              <input
                type="text"
                placeholder="Backup Code"
                value={backupCode}
                onChange={handleBackupCodeChange}
                style={{ 
                  textAlign: 'center', 
                  fontSize: '18px', 
                  letterSpacing: '2px',
                  fontFamily: 'monospace',
                  padding: '16px',
                  border: '2px solid var(--border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--card)'
                }}
                maxLength={6}
              />
              
              <button 
                className="cta" 
                onClick={handleVerifyBackupCode}
                disabled={isLoading || backupCode.length !== 6}
                style={{ width: '100%' }}
              >
                {isLoading ? 'Verifying...' : 'Verify Backup Code'}
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button 
                className="ghost" 
                onClick={() => {
                  setShowBackupCodes(false);
                  setBackupCode('');
                }}
                style={{ fontSize: '14px' }}
              >
                ← Back to authenticator code
              </button>
            </div>
          </>
        )}

        <div style={{ 
          marginTop: '20px', 
          padding: '12px', 
          backgroundColor: 'var(--card)', 
          borderRadius: '8px',
          fontSize: '12px',
          color: 'var(--muted)',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>
            Can't access your authenticator app? Use one of your backup codes.
          </p>
        </div>
      </div>
    </div>
  );
}
