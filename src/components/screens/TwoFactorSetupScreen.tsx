import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { TwoFactorAuthService } from '@/lib/two-factor-auth';
import toast from 'react-hot-toast';
import { ArrowLeft, Shield, Smartphone, Key, Download } from 'lucide-react';

export default function TwoFactorSetupScreen() {
  const { user, firebaseUser, setCurrentScreen, initializeAuth } = useAppStore();
  const [step, setStep] = useState(1);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (step === 1 && firebaseUser) {
      initialize2FA();
    }
  }, [step, firebaseUser]);

  const initialize2FA = async () => {
    if (!firebaseUser || !user) return;
    
    setIsLoading(true);
    try {
      const { qrCodeUrl, backupCodes } = await TwoFactorAuthService.setup2FA(
        firebaseUser.uid, 
        user.email
      );
      setQrCodeUrl(qrCodeUrl);
      setBackupCodes(backupCodes);
    } catch (error) {
      console.error('2FA setup error:', error);
      toast.error('Failed to initialize 2FA setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!firebaseUser || !verificationCode) return;

    setIsLoading(true);
    try {
      const isValid = await TwoFactorAuthService.verify2FASetup(
        firebaseUser.uid, 
        verificationCode
      );
      
      if (isValid) {
        toast.success('2FA enabled successfully!');
        await initializeAuth(); // Refresh user data
        setStep(3);
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      toast.error('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cyberqr-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStep1 = () => (
    <div className="card">
      <div className="row" style={{ alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Shield className="w-6 h-6" style={{ color: 'var(--accent)' }} />
        <h2 style={{ margin: 0 }}>Enable Two-Factor Authentication</h2>
      </div>
      
      <p style={{ marginBottom: '20px', color: 'var(--muted)' }}>
        Add an extra layer of security to your account by enabling 2FA. You'll need an authenticator app like Google Authenticator or Microsoft Authenticator.
      </p>

      <div className="col" style={{ gap: '16px' }}>
        <div className="row" style={{ alignItems: 'center', gap: '12px' }}>
          <Smartphone className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>Step 1: Install Authenticator App</h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
              Download Google Authenticator, Microsoft Authenticator, or similar app
            </p>
          </div>
        </div>

        <div className="row" style={{ alignItems: 'center', gap: '12px' }}>
          <Key className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>Step 2: Scan QR Code</h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
              Scan the QR code with your authenticator app
            </p>
          </div>
        </div>
      </div>

      <button 
        className="cta" 
        onClick={() => setStep(2)}
        disabled={isLoading}
        style={{ marginTop: '20px' }}
      >
        {isLoading ? 'Setting up...' : 'Continue'}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <>
      <div className="card">
        <h2 style={{ margin: '0 0 16px' }}>Scan QR Code</h2>
        
        {qrCodeUrl ? (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '20px', 
              backgroundColor: 'white', 
              borderRadius: '12px',
              border: '1px solid var(--border)'
            }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                alt="2FA QR Code"
                style={{ width: '200px', height: '200px' }}
              />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            Loading QR code...
          </div>
        )}

        <p style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--muted)', textAlign: 'center' }}>
          Scan this QR code with your authenticator app, then enter the 6-digit code below.
        </p>
        
        <div style={{ 
          backgroundColor: 'var(--card)', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '16px',
          fontSize: '12px',
          color: 'var(--muted)',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>
            💡 <strong>Tip:</strong> If verification fails, your device time might be off. 
            The system will automatically compensate for time differences.
          </p>
        </div>

        <div className="col" style={{ gap: '12px' }}>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '2px' }}
          />
          <button 
            className="cta" 
            onClick={handleVerifyCode}
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify & Enable 2FA'}
          </button>
        </div>
      </div>

      <button 
        className="ghost" 
        onClick={() => setStep(1)}
        style={{ marginTop: '12px' }}
      >
        ← Back
      </button>
    </>
  );

  const renderStep3 = () => (
    <div className="card">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--success)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Shield className="w-8 h-8" style={{ color: 'white' }} />
        </div>
        <h2 style={{ margin: '0 0 8px' }}>2FA Enabled Successfully!</h2>
        <p style={{ margin: 0, color: 'var(--muted)' }}>
          Your account is now protected with two-factor authentication.
        </p>
      </div>

      <div style={{ 
        backgroundColor: 'var(--card)', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>Backup Codes</h3>
        <p style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--muted)' }}>
          Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '8px', 
          marginBottom: '12px' 
        }}>
          {backupCodes.map((code, index) => (
            <div 
              key={index}
              style={{ 
                padding: '8px', 
                backgroundColor: 'var(--background)', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '14px',
                textAlign: 'center'
              }}
            >
              {code}
            </div>
          ))}
        </div>

        <button 
          className="secondary" 
          onClick={downloadBackupCodes}
          style={{ width: '100%', fontSize: '14px' }}
        >
          <Download className="w-4 h-4" style={{ marginRight: '8px' }} />
          Download Backup Codes
        </button>
      </div>

      <button 
        className="cta" 
        onClick={() => setCurrentScreen('profile')}
        style={{ width: '100%' }}
      >
        Complete Setup
      </button>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <div className="topbar">
        <button className="ghost" onClick={() => setCurrentScreen('profile')}>
          <ArrowLeft className="w-4 h-4" style={{ marginRight: '8px' }} />
          Back to Settings
        </button>
        <div className="chip">2FA Setup</div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}
