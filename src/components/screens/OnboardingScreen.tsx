'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Shield, 
  QrCode, 
  Brain, 
  Trophy, 
  Target, 
  Lock, 
  Eye, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Star,
  Zap,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  features: string[];
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to CyberQR',
    description: 'Your personal cybersecurity companion for safe QR code scanning and digital security education.',
    icon: Shield,
    features: [
      'Secure QR code scanning with real-time threat detection',
      'Gamified cybersecurity education and training',
      'Personal progress tracking with XP and badges',
      'Daily streaks to build security habits'
    ],
    color: 'var(--accent)'
  },
  {
    id: 2,
    title: 'QR Code Scanner',
    description: 'Scan any QR code safely with our advanced threat detection system.',
    icon: QrCode,
    features: [
      'Real-time malware and phishing detection',
      'URL safety analysis and risk assessment',
      'Detailed security reports and recommendations',
      'Scan history and threat tracking'
    ],
    color: 'var(--accent-2)'
  },
  {
    id: 3,
    title: 'ICSA Training Hub',
    description: 'Master cybersecurity through interactive challenges and simulations.',
    icon: Brain,
    features: [
      'Phishing email identification training',
      'Digital forensics and encryption challenges',
      'Social media privacy risk analysis',
      'Secure coding and access control lessons'
    ],
    color: 'var(--ok)'
  },
  {
    id: 4,
    title: 'Gamification System',
    description: 'Level up your cybersecurity skills with our engaging progression system.',
    icon: Trophy,
    features: [
      'Earn XP for completing challenges and scans',
      'Unlock badges for security achievements',
      'Build daily streaks for consistent learning',
      'Track your progress and skill development'
    ],
    color: 'var(--warn)'
  },
  {
    id: 5,
    title: 'Security Features',
    description: 'Advanced security tools to protect your digital life.',
    icon: Lock,
    features: [
      'Two-factor authentication support',
      'Secure profile management',
      'Privacy-focused data handling',
      'Real-time security monitoring'
    ],
    color: 'var(--accent)'
  }
];

export default function OnboardingScreen() {
  const { setCurrentScreen, user, addXP } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setCurrentScreen('home');
  };

  const handleComplete = async () => {
    try {
      await addXP(50); // Bonus XP for completing onboarding
      toast.success('🎉 Welcome to CyberQR! You earned 50 XP for completing onboarding!');
      setCurrentScreen('home');
    } catch (error) {
      console.error('Error adding XP:', error);
      setCurrentScreen('home');
    }
  };

  const handleGetStarted = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="onboarding-screen" style={{ 
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="topbar">
        <div className="chip">
          Step {currentStep + 1} of {onboardingSteps.length}
        </div>
        <button className="ghost" onClick={handleSkip}>
          Skip
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: '100px',
        paddingRight: '4px'
      }}>
        {/* Progress Bar */}
        <div className="card" style={{ marginBottom: '18px' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Onboarding Progress</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-2)' }}>{Math.round(progress)}%</span>
          </div>
          <div className="progress" style={{ height: '8px' }}>
            <div style={{ width: `${progress}%` }} />
          </div>
        </div>

      {/* Main Content */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '18px', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div 
          className="logo" 
          style={{ 
            width: '100px', 
            height: '100px', 
            fontSize: '40px',
            background: `linear-gradient(135deg, ${currentStepData.color} 0%, var(--accent) 100%)`,
            margin: '0 auto 24px'
          }}
        >
          <IconComponent className="w-12 h-12" />
        </div>
        <h1 className="title" style={{ fontSize: '32px', margin: '0 0 16px', fontWeight: '700' }}>
          {currentStepData.title}
        </h1>
        <p className="subtitle" style={{ fontSize: '18px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
          {currentStepData.description}
        </p>
      </div>

      {/* Features List */}
      <div className="card" style={{ marginBottom: '18px' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: '600' }}>
          Key Features
        </h2>
        <div className="col" style={{ gap: '16px' }}>
          {currentStepData.features.map((feature, index) => (
            <div key={index} className="row" style={{ gap: '16px', alignItems: 'flex-start' }}>
              <div 
                className="logo" 
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  fontSize: '14px',
                  background: `linear-gradient(135deg, ${currentStepData.color} 0%, var(--accent) 100%)`,
                  minWidth: '28px'
                }}
              >
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="subtitle" style={{ fontSize: '16px', lineHeight: '1.5', flex: 1 }}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step-specific Information */}
      {currentStep === 0 && (
        <div className="card" style={{ background: 'rgba(249,178,34,0.1)', borderColor: 'var(--accent)', marginBottom: '18px' }}>
          <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <Star className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <strong style={{ color: 'var(--accent)' }}>Getting Started</strong>
          </div>
          <p className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
            Complete this onboarding to earn 50 bonus XP and unlock all features. 
            You can always revisit this tutorial from your profile.
          </p>
        </div>
      )}

      {currentStep === 1 && (
        <div className="card" style={{ background: 'rgba(34,211,238,0.1)', borderColor: 'var(--accent-2)', marginBottom: '18px' }}>
          <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <Zap className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
            <strong style={{ color: 'var(--accent-2)' }}>Pro Tip</strong>
          </div>
          <p className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
            Always scan QR codes before clicking links. Our AI-powered detection 
            can identify malicious URLs in real-time.
          </p>
        </div>
      )}

      {currentStep === 2 && (
        <div className="card" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'var(--ok)', marginBottom: '18px' }}>
          <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <Target className="w-5 h-5" style={{ color: 'var(--ok)' }} />
            <strong style={{ color: 'var(--ok)' }}>Training Modules</strong>
          </div>
          <p className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
            Each challenge is designed by cybersecurity experts to teach real-world 
            skills you can apply immediately.
          </p>
        </div>
      )}

      {currentStep === 3 && (
        <div className="card" style={{ background: 'rgba(248,113,113,0.1)', borderColor: 'var(--warn)', marginBottom: '18px' }}>
          <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <Trophy className="w-5 h-5" style={{ color: 'var(--warn)' }} />
            <strong style={{ color: 'var(--warn)' }}>Achievement System</strong>
          </div>
          <p className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
            Build your cybersecurity expertise with our comprehensive badge system. 
            Each badge represents a real security skill you've mastered.
          </p>
        </div>
      )}

      {currentStep === 4 && (
        <div className="card" style={{ background: 'rgba(249,178,34,0.1)', borderColor: 'var(--accent)', marginBottom: '18px' }}>
          <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <Users className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <strong style={{ color: 'var(--accent)' }}>Community</strong>
          </div>
          <p className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
            Join thousands of users building better security habits. Your progress 
            contributes to a safer digital world for everyone.
          </p>
        </div>
      )}
      </div>

      {/* Navigation */}
      <div style={{ 
        position: 'sticky', 
        bottom: 0, 
        background: 'linear-gradient(180deg, transparent, rgba(0,0,0,.35))', 
        padding: '16px 0 12px', 
        display: 'flex', 
        gap: '12px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {currentStep > 0 ? (
          <>
            <button 
              className="cta secondary" 
              onClick={handlePrevious}
              style={{ 
                flex: '0 0 auto',
                minWidth: '120px',
                maxWidth: '200px'
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            
            <button 
              className="cta" 
              onClick={currentStep === onboardingSteps.length - 1 ? handleComplete : handleNext}
              style={{ 
                flex: '0 0 auto',
                minWidth: '120px',
                maxWidth: '200px'
              }}
            >
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </>
        ) : (
          <button 
            className="cta" 
            onClick={currentStep === onboardingSteps.length - 1 ? handleComplete : handleNext}
            style={{ 
              minWidth: '160px',
              maxWidth: '200px'
            }}
          >
            {currentStep === onboardingSteps.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}