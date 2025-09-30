'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Mail, 
  Link, 
  Lock,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PhishingSign {
  icon: any;
  title: string;
  description: string;
}

export default function PhishingIntroScreen() {
  const { setCurrentScreen, addXP } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  const phishingSigns: PhishingSign[] = [
    {
      icon: AlertTriangle,
      title: "Urgent Language",
      description: "Phrases like 'Act now!', 'Immediate action required', or threats of account closure"
    },
    {
      icon: Mail,
      title: "Suspicious Sender",
      description: "Email addresses that don't match the claimed organization or contain misspellings"
    },
    {
      icon: Link,
      title: "Malicious Links",
      description: "URLs that don't match the legitimate website or redirect to suspicious domains"
    },
    {
      icon: Lock,
      title: "Requests for Sensitive Info",
      description: "Asking for passwords, social security numbers, or financial information via email"
    }
  ];

  const safetyTips = [
    "Always verify the sender's identity through official channels",
    "Hover over links to preview the destination URL before clicking",
    "Never provide sensitive information via email or unsecured websites",
    "Enable two-factor authentication whenever possible",
    "Keep your software and security tools up to date"
  ];

  const handleBack = () => {
    setCurrentScreen('icsa');
  };

  const handleStartGame = () => {
    addXP(10);
    toast.success('🎯 Starting Phishing Simulation!');
    setCurrentScreen('phishing-game');
  };

  const renderIntro = () => (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="chip">Phishing Training</div>
      </div>
      
      <div className="card" style={{ textAlign: 'center', marginBottom: '18px' }}>
        <div 
          className="logo" 
          style={{ 
            width: '64px', 
            height: '64px', 
            fontSize: '28px',
            background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
            margin: '0 auto 16px'
          }}
        >
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="title" style={{ fontSize: '24px', margin: '0 0 8px' }}>
          Phishing Simulation Training
        </h1>
        <p className="subtitle">
          Learn to identify and defend against phishing attacks through interactive challenges
        </p>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 12px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
          What is Phishing?
        </h2>
        <p className="subtitle" style={{ lineHeight: '1.6' }}>
          Phishing is a cybercrime where attackers impersonate trusted entities to steal sensitive information 
          like passwords, credit card numbers, or personal data. These attacks commonly arrive via email, 
          text messages, or fake websites designed to look legitimate.
        </p>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>
          Common Signs of Phishing
        </h2>
        <div className="col" style={{ gap: '12px' }}>
          {phishingSigns.map((sign, index) => {
            const IconComponent = sign.icon;
            return (
              <div key={index} className="card" style={{ padding: '12px', background: 'rgba(255,255,255,0.05)' }}>
                <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
                  <div 
                    className="logo" 
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      fontSize: '16px',
                      background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
                      minWidth: '36px'
                    }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="col" style={{ gap: '4px', flex: 1 }}>
                    <strong style={{ fontSize: '14px' }}>{sign.title}</strong>
                    <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      {sign.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
          How to Stay Safe
        </h2>
        <div className="col" style={{ gap: '8px' }}>
          {safetyTips.map((tip, index) => (
            <div key={index} className="row" style={{ gap: '8px', alignItems: 'flex-start' }}>
              <CheckCircle className="w-4 h-4" style={{ color: 'var(--ok)', marginTop: '2px', minWidth: '16px' }} />
              <span className="subtitle" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                {tip}
              </span>
            </div>
          ))}
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
          onClick={handleStartGame}
        >
          Start Playing
        </button>
        <button className="cta secondary" onClick={handleBack}>
          Back to Hub
        </button>
      </div>
    </>
  );

  return renderIntro();
}
