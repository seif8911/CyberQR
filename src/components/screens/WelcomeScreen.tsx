'use client';

import { useAppStore } from '@/lib/store';
import { 
  Shield, 
  ArrowRight, 
  Mail, 
  Phone,
  Lock,
  CheckCircle
} from 'lucide-react';

export default function WelcomeScreen() {
  const { setCurrentScreen } = useAppStore();

  const handleGetStarted = () => {
    setCurrentScreen('register');
  };

  const handleSignIn = () => {
    setCurrentScreen('login');
  };

  return (
    <>
      <div className="topbar">
        <div className="chip">Welcome</div>
      </div>

      <div className="card" style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div 
          className="logo" 
          style={{ 
            width: '80px', 
            height: '80px', 
            fontSize: '32px',
            background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
            margin: '0 auto 20px'
          }}
        >
          <Shield className="w-10 h-10" />
        </div>
        <h1 className="title" style={{ fontSize: '28px', margin: '0 0 12px' }}>
          Welcome to CyberQR
        </h1>
        <p className="subtitle" style={{ fontSize: '16px', lineHeight: '1.5' }}>
          Your personal cybersecurity companion for safe QR code scanning and digital security education.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '18px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>
          Why Create an Account?
        </h2>
        <div className="col" style={{ gap: '12px' }}>
          <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
            <div 
              className="logo" 
              style={{ 
                width: '24px', 
                height: '24px', 
                fontSize: '12px',
                background: 'linear-gradient(135deg, var(--ok) 0%, var(--accent-2) 100%)',
                minWidth: '24px'
              }}
            >
              <CheckCircle className="w-3 h-3" />
            </div>
            <div className="col" style={{ gap: '4px', flex: 1 }}>
              <strong style={{ fontSize: '14px' }}>Secure Your Data</strong>
              <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                Your scan history and progress are encrypted and stored securely
              </span>
            </div>
          </div>
          
          <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
            <div 
              className="logo" 
              style={{ 
                width: '24px', 
                height: '24px', 
                fontSize: '12px',
                background: 'linear-gradient(135deg, var(--ok) 0%, var(--accent-2) 100%)',
                minWidth: '24px'
              }}
            >
              <CheckCircle className="w-3 h-3" />
            </div>
            <div className="col" style={{ gap: '4px', flex: 1 }}>
              <strong style={{ fontSize: '14px' }}>Track Your Progress</strong>
              <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                Earn XP, unlock badges, and build your cybersecurity expertise
              </span>
            </div>
          </div>
          
          <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
            <div 
              className="logo" 
              style={{ 
                width: '24px', 
                height: '24px', 
                fontSize: '12px',
                background: 'linear-gradient(135deg, var(--ok) 0%, var(--accent-2) 100%)',
                minWidth: '24px'
              }}
            >
              <CheckCircle className="w-3 h-3" />
            </div>
            <div className="col" style={{ gap: '4px', flex: 1 }}>
              <strong style={{ fontSize: '14px' }}>Sync Across Devices</strong>
              <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                Access your progress and settings from any device
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ background: 'rgba(34,211,238,0.1)', borderColor: 'var(--accent-2)', marginBottom: '18px' }}>
        <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <Lock className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
          <strong style={{ color: 'var(--accent-2)' }}>Privacy First</strong>
        </div>
        <p className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
          We use industry-standard encryption and never share your personal data. 
          Your security is our top priority.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '18px' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '16px' }}>
          Sign Up Options
        </h2>
        <div className="col" style={{ gap: '8px' }}>
          <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
            <Mail className="w-4 h-4" style={{ color: 'var(--accent-2)' }} />
            <span style={{ fontSize: '13px' }}>Email & Password</span>
          </div>
          <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
            <Phone className="w-4 h-4" style={{ color: 'var(--accent-2)' }} />
            <span style={{ fontSize: '13px' }}>Phone Number (SMS)</span>
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
        <button 
          className="cta" 
          onClick={handleGetStarted}
          style={{ flex: 1 }}
        >
          Create Account
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
        <button 
          className="cta secondary" 
          onClick={handleSignIn}
        >
          Sign In
        </button>
      </div>
    </>
  );
}
