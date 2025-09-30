'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { authService } from '@/lib/firebase';
import { TwoFactorAuthService } from '@/lib/two-factor-auth';
import TwoFactorVerificationScreen from './TwoFactorVerificationScreen';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginScreen() {
  const { setCurrentScreen, set2FAVerificationInProgress } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [pendingCredentials, setPendingCredentials] = useState<{email: string, password: string} | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // First verify credentials without signing in
      const credentialCheck = await authService.verifyCredentials(email, password);
      
      if (!credentialCheck.success) {
        throw credentialCheck.error;
      }
      
      const user = credentialCheck.user;
      const userData = credentialCheck.userData;
      
      // Check if user has 2FA enabled
      console.log('User data for 2FA check:', { uid: user.uid, twoFactorEnabled: userData?.twoFactorEnabled });
      
      if (userData?.twoFactorEnabled) {
        console.log('2FA is enabled, showing verification screen');
        // Store pending user and credentials, show 2FA verification
        setPendingUser(user);
        setPendingCredentials({ email, password });
        set2FAVerificationInProgress(true);
        setShow2FA(true);
        setIsLoading(false);
        console.log('2FA verification screen should now be visible');
        console.log('Current screen state:', { show2FA, is2FAVerificationInProgress: true });
        console.log('Pending user data:', { uid: user.uid, email: user.email });
        return;
      }
      
      console.log('2FA is not enabled, proceeding with normal login');
      
      // No 2FA required, sign in normally
      await authService.signInWithEmail(email, password);
      toast.success('Welcome back!');
      // AuthGuard will automatically redirect to home when authenticated
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASuccess = async () => {
    if (pendingUser && pendingCredentials) {
      // Sign the user in after successful 2FA verification
      try {
        await authService.signInWithEmail(pendingCredentials.email, pendingCredentials.password);
        set2FAVerificationInProgress(false);
        setShow2FA(false);
        setPendingUser(null);
        setPendingCredentials(null);
        toast.success('Welcome back!');
        // AuthGuard will automatically redirect to home when authenticated
      } catch (error) {
        console.error('Failed to sign in after 2FA:', error);
        toast.error('Failed to complete login');
        set2FAVerificationInProgress(false);
        setShow2FA(false);
        setPendingUser(null);
        setPendingCredentials(null);
      }
    }
  };

  const handle2FACancel = () => {
    set2FAVerificationInProgress(false);
    setShow2FA(false);
    setPendingUser(null);
    setPendingCredentials(null);
    // Sign out the user since 2FA was required but cancelled
    authService.signOut();
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email first');
      return;
    }

    try {
      await authService.resetPassword(email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('Failed to send reset email');
    }
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const handleGoToRegister = () => {
    setCurrentScreen('register');
  };

  return (
    <>
      {show2FA && (
        <TwoFactorVerificationScreen 
          onSuccess={handle2FASuccess}
          onCancel={handle2FACancel}
          pendingUser={pendingUser}
        />
      )}
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          marginTop: '40px'
        }}>
          <button 
            className="ghost" 
            onClick={handleBack}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div 
            className="logo" 
            style={{ 
              width: '80px', 
              height: '80px', 
              fontSize: '32px',
              background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Shield className="w-10 h-10" />
          </div>
          
          <h1 style={{ 
            fontSize: '28px', 
            margin: '0 0 8px',
            background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700'
          }}>
            Welcome Back
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: 'var(--muted)',
            margin: 0
          }}>
            Sign in to continue your cybersecurity journey
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleEmailLogin} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-2)' }}>
                  Email Address
                </label>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text)',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
                disabled={isLoading}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-2)';
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-2)' }}>
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '16px 50px 16px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'var(--text)',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  disabled={isLoading}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-2)';
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '30px' }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{ 
                  fontSize: '14px', 
                  color: 'var(--accent-2)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Forgot your password?
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: 'auto' }}>
            <button 
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(34, 211, 238, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(34, 211, 238, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(34, 211, 238, 0.3)';
                }
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            
            <button 
              type="button"
              onClick={handleGoToRegister}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--text)',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>

    </>
  );
}

