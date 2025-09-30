'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { authService } from '@/lib/firebase';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterScreen() {
  const { setCurrentScreen } = useAppStore();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.displayName.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await authService.signUpWithEmail(formData.email, formData.password, formData.displayName);
      setEmailVerificationSent(true);
      toast.success('Account created! Please check your email for verification.');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (emailVerificationSent) {
      setEmailVerificationSent(false);
    } else {
      setCurrentScreen('mini-onboarding');
    }
  };

  const handleGoToLogin = () => {
    setCurrentScreen('login');
  };

  const handleContinueToOnboarding = () => {
    setCurrentScreen('onboarding');
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return 'var(--warn)';
    if (strength <= 3) return 'var(--accent)';
    return 'var(--ok)';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  if (emailVerificationSent) {
    return (
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
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--text)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
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
              background: 'linear-gradient(135deg, var(--ok) 0%, var(--accent-2) 100%)',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircle className="w-10 h-10" />
          </div>
          
          <h1 style={{ 
            fontSize: '28px', 
            margin: '0 0 8px',
            background: 'linear-gradient(135deg, var(--ok) 0%, var(--accent-2) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700'
          }}>
            Check Your Email
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: 'var(--muted)',
            margin: 0
          }}>
            We've sent a verification link to {formData.email}
          </p>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            background: 'rgba(34,211,238,0.1)',
            border: '1px solid var(--accent-2)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
              <AlertCircle className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
              <strong style={{ color: 'var(--accent-2)', fontSize: '16px' }}>Next Steps</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '14px', lineHeight: '1.4', color: 'var(--muted)', margin: 0 }}>
                1. Check your email inbox (and spam folder)
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.4', color: 'var(--muted)', margin: 0 }}>
                2. Click the verification link in the email
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.4', color: 'var(--muted)', margin: 0 }}>
                3. Return here to continue with onboarding
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ marginTop: 'auto' }}>
          <button 
            onClick={handleContinueToOnboarding}
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(34, 211, 238, 0.3)',
              minHeight: '48px'
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
            Continue to Onboarding
          </button>
          
          <button 
            onClick={handleGoToLogin}
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--text)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minHeight: '48px'
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
            Sign In Instead
          </button>
        </div>
      </div>
    );
  }

  return (
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
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'var(--text)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
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
          Create Account
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--muted)',
          margin: 0
        }}>
          Join CyberQR and start your cybersecurity journey
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleRegister} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-2)' }}>
                Full Name
              </label>
            </div>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              placeholder="Enter your full name"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--text)',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                minHeight: '48px',
                boxSizing: 'border-box'
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
                Email Address
              </label>
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--text)',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                minHeight: '48px',
                boxSizing: 'border-box'
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
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a strong password"
                style={{
                  width: '100%',
                  padding: '16px 50px 16px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text)',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  minHeight: '48px',
                  boxSizing: 'border-box'
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
                  padding: '8px',
                  minWidth: '32px',
                  minHeight: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Password Strength</span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: getPasswordStrengthColor(passwordStrength(formData.password)),
                    fontWeight: '600'
                  }}>
                    {getPasswordStrengthText(passwordStrength(formData.password))}
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '4px', 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${(passwordStrength(formData.password) / 5) * 100}%`,
                    height: '100%',
                    background: getPasswordStrengthColor(passwordStrength(formData.password)),
                    borderRadius: '2px',
                    transition: 'all 0.3s ease'
                  }} />
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-2)' }}>
                Confirm Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                style={{
                  width: '100%',
                  padding: '16px 50px 16px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text)',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  minHeight: '48px',
                  boxSizing: 'border-box'
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  padding: '8px',
                  minWidth: '32px',
                  minHeight: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.confirmPassword && (
              <div style={{ marginTop: '8px' }}>
                {formData.password === formData.confirmPassword ? (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <CheckCircle className="w-4 h-4" style={{ color: 'var(--ok)' }} />
                    <span style={{ fontSize: '12px', color: 'var(--ok)' }}>Passwords match</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <AlertCircle className="w-4 h-4" style={{ color: 'var(--warn)' }} />
                    <span style={{ fontSize: '12px', color: 'var(--warn)' }}>Passwords do not match</span>
                  </div>
                )}
              </div>
            )}
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
              boxShadow: '0 4px 20px rgba(34, 211, 238, 0.3)',
              minHeight: '48px'
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <button 
            type="button"
            onClick={handleGoToLogin}
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
              transition: 'all 0.3s ease',
              minHeight: '48px'
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
            Sign In Instead
          </button>
        </div>

        <div style={{
          background: 'rgba(34,211,238,0.1)',
          border: '1px solid var(--accent-2)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <Shield className="w-4 h-4" style={{ color: 'var(--accent-2)' }} />
            <strong style={{ color: 'var(--accent-2)', fontSize: '14px' }}>Security Notice</strong>
          </div>
          <p style={{ 
            fontSize: '12px', 
            lineHeight: '1.4',
            color: 'var(--muted)',
            margin: 0
          }}>
            By creating an account, you agree to our terms of service and privacy policy. 
            Your data is encrypted and secure with Firebase authentication.
          </p>
        </div>
      </form>
    </div>
  );
}