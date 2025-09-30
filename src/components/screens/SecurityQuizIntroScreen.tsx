'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Brain, 
  Shield, 
  Eye,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  User,
  Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SecurityConcept {
  icon: any;
  title: string;
  description: string;
  example: string;
}

export default function SecurityQuizIntroScreen() {
  const { setCurrentScreen, addXP } = useAppStore();

  const securityConcepts: SecurityConcept[] = [
    {
      icon: Eye,
      title: "Digital Footprint",
      description: "The trail of data you leave behind when using digital services",
      example: "Social media posts, location check-ins, and online purchases"
    },
    {
      icon: Camera,
      title: "Oversharing",
      description: "Sharing too much personal information online that can be used against you",
      example: "Posting your daily routine, home address, or personal documents"
    },
    {
      icon: Shield,
      title: "Social Engineering",
      description: "Manipulating people into revealing confidential information",
      example: "Using personal details from social media to create convincing phishing attacks"
    }
  ];

  const investigationSteps = [
    "Analyze social media posts for personal information",
    "Identify location patterns and daily routines",
    "Look for sensitive documents or personal details",
    "Assess privacy settings and sharing habits",
    "Evaluate potential security risks and vulnerabilities"
  ];

  const privacyTips = [
    "Review and adjust privacy settings regularly",
    "Be cautious about location sharing and check-ins",
    "Avoid posting personal documents or sensitive information",
    "Think before sharing - once posted, it's hard to remove",
    "Use strong, unique passwords for all accounts",
    "Enable two-factor authentication when available"
  ];

  const handleBack = () => {
    setCurrentScreen('icsa');
  };

  const handleStartGame = () => {
    addXP(10);
    toast.success('🎯 Starting Digital Forensics Investigation!');
    setCurrentScreen('security-quiz-game');
  };

  return (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="chip">Digital Forensics</div>
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
          <Brain className="w-8 h-8" />
        </div>
        <h1 className="title" style={{ fontSize: '24px', margin: '0 0 8px' }}>
          Digital Forensics Investigation
        </h1>
        <p className="subtitle">
          Analyze Laila's social media activity and identify security risks in this interactive investigation
        </p>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 12px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
          What is Digital Forensics?
        </h2>
        <p className="subtitle" style={{ lineHeight: '1.6' }}>
          Digital forensics is the process of investigating digital evidence to understand what happened 
          and who was involved. In this challenge, you'll analyze social media posts to identify security 
          risks and privacy violations that could be exploited by attackers.
        </p>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>
          Key Security Concepts
        </h2>
        <div className="col" style={{ gap: '12px' }}>
          {securityConcepts.map((concept, index) => {
            const IconComponent = concept.icon;
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
                    <strong style={{ fontSize: '14px' }}>{concept.title}</strong>
                    <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      {concept.description}
                    </span>
                    <span className="subtitle" style={{ fontSize: '11px', lineHeight: '1.3', color: 'var(--accent-2)' }}>
                      Example: {concept.example}
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
          Investigation Process
        </h2>
        <div className="col" style={{ gap: '8px' }}>
          {investigationSteps.map((step, index) => (
            <div key={index} className="row" style={{ gap: '8px', alignItems: 'flex-start' }}>
              <CheckCircle className="w-4 h-4" style={{ color: 'var(--ok)', marginTop: '2px', minWidth: '16px' }} />
              <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                {index + 1}. {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
          Privacy Protection Tips
        </h2>
        <div className="col" style={{ gap: '8px' }}>
          {privacyTips.map((tip, index) => (
            <div key={index} className="row" style={{ gap: '8px', alignItems: 'flex-start' }}>
              <AlertTriangle className="w-4 h-4" style={{ color: 'var(--warn)', marginTop: '2px', minWidth: '16px' }} />
              <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                {tip}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ background: 'rgba(34,211,238,0.1)', borderColor: 'var(--accent-2)' }}>
        <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <User className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
          <strong style={{ color: 'var(--accent-2)' }}>Case Study: Laila's Social Media</strong>
        </div>
        <p className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
          You'll investigate Laila's social media activity to identify security risks. Look for patterns, 
          personal information, and potential vulnerabilities that could be exploited by cybercriminals.
        </p>
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
          Start Investigation
        </button>
        <button className="cta secondary" onClick={handleBack}>
          Back to Hub
        </button>
      </div>
    </>
  );
}

