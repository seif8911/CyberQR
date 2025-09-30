'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Shield, 
  QrCode, 
  Brain, 
  Trophy, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Zap,
  Target,
  Lock
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  features: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Secure QR Scanning',
    description: 'Scan any QR code safely with our advanced threat detection system.',
    icon: QrCode,
    color: 'var(--accent-2)',
    features: ['Real-time malware detection', 'URL safety analysis', 'Detailed security reports']
  },
  {
    id: 2,
    title: 'Cybersecurity Training',
    description: 'Master security skills through interactive challenges and simulations.',
    icon: Brain,
    color: 'var(--ok)',
    features: ['Phishing detection training', 'Digital forensics challenges', 'Privacy risk analysis']
  },
  {
    id: 3,
    title: 'Gamified Learning',
    description: 'Level up your cybersecurity expertise with XP, badges, and streaks.',
    icon: Trophy,
    color: 'var(--warn)',
    features: ['Earn XP for completing challenges', 'Unlock achievement badges', 'Build daily learning streaks']
  }
];

export default function MiniOnboardingScreen() {
  const { setCurrentScreen } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  useEffect(() => {
    // Initial animation
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handleGetStarted = () => {
    setCurrentScreen('register');
  };

  const handleSignIn = () => {
    setCurrentScreen('login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent-2) 0%, transparent 100%)',
        opacity: 0.1,
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent) 0%, transparent 100%)',
        opacity: 0.1,
        animation: 'float 8s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '30%',
        left: '20%',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--ok) 0%, transparent 100%)',
        opacity: 0.1,
        animation: 'float 7s ease-in-out infinite'
      }} />

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div style={{
          position: 'relative',
          display: 'inline-block',
          marginBottom: '20px'
        }}>
          <div 
            className="logo" 
            style={{ 
              width: '80px', 
              height: '80px', 
              fontSize: '32px',
              background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            <Shield className="w-10 h-10" />
          </div>
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            animation: 'sparkle 2s ease-in-out infinite'
          }}>
            <Sparkles className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          </div>
        </div>
        
        <h1 style={{ 
          fontSize: '32px', 
          margin: '0 0 8px',
          background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '700'
        }}>
          CyberQR
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--muted)',
          margin: 0
        }}>
          Your personal cybersecurity companion
        </p>
      </div>

      {/* Progress indicator */}
      <div style={{
        marginBottom: '30px',
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out 0.2s'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}>
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: index <= currentStep ? 'var(--accent-2)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
        <div style={{
          width: '100%',
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent-2) 0%, var(--accent) 100%)',
            borderRadius: '2px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s ease-out 0.4s'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          opacity: isAnimating ? 0.5 : 1,
          transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
          transition: 'all 0.2s ease'
        }}>
          <div 
            className="logo" 
            style={{ 
              width: '100px', 
              height: '100px', 
              fontSize: '40px',
              background: `linear-gradient(135deg, ${currentStepData.color} 0%, var(--accent) 100%)`,
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'bounce 2s ease-in-out infinite'
            }}
          >
            <IconComponent className="w-12 h-12" />
          </div>
          
          <h2 style={{ 
            fontSize: '24px', 
            margin: '0 0 12px',
            fontWeight: '600'
          }}>
            {currentStepData.title}
          </h2>
          
          <p style={{ 
            fontSize: '16px', 
            color: 'var(--muted)',
            lineHeight: '1.5',
            margin: '0 0 20px'
          }}>
            {currentStepData.description}
          </p>

          {/* Features list */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center'
          }}>
            {currentStepData.features.map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: 'var(--accent-2)',
                  opacity: 0,
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1 + 0.5}s forwards`
                }}
              >
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: currentStepData.color
                }} />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            style={{
              padding: '12px',
              borderRadius: '50%',
              background: currentStep === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
              border: 'none',
              color: currentStep === 0 ? 'var(--muted)' : 'var(--text)',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span style={{
            fontSize: '14px',
            color: 'var(--muted)',
            fontWeight: '500'
          }}>
            {currentStep + 1} of {onboardingSteps.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentStep === onboardingSteps.length - 1}
            style={{
              padding: '12px',
              borderRadius: '50%',
              background: currentStep === onboardingSteps.length - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
              border: 'none',
              color: currentStep === onboardingSteps.length - 1 ? 'var(--muted)' : 'var(--text)',
              cursor: currentStep === onboardingSteps.length - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s ease-out 0.6s'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <button
            onClick={handleGetStarted}
            style={{
              flex: 1,
              padding: '16px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
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
            <Zap className="w-5 h-5" />
            Get Started
          </button>
          
          <button
            onClick={handleSignIn}
            style={{
              flex: 1,
              padding: '16px 24px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--text)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
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
            <Target className="w-5 h-5" />
            Sign In
          </button>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--muted)',
          margin: 0,
          lineHeight: '1.4'
        }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.<br />
          Your data is encrypted and secure with Firebase.
        </p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.7; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
