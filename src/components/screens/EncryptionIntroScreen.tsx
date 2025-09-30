'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Lock, 
  Shield, 
  Key,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Eye,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EncryptionConcept {
  icon: any;
  title: string;
  description: string;
  example: string;
}

export default function EncryptionIntroScreen() {
  const { setCurrentScreen, addXP } = useAppStore();

  const encryptionConcepts: EncryptionConcept[] = [
    {
      icon: Key,
      title: "Caesar Cipher",
      description: "A substitution cipher where each letter is shifted by a fixed number of positions",
      example: "HELLO becomes KHOOR with a shift of 3"
    },
    {
      icon: Shield,
      title: "Digital Forensics",
      description: "The process of recovering and analyzing digital evidence from electronic devices",
      example: "Finding encrypted files on a suspect's computer and decrypting them"
    },
    {
      icon: Eye,
      title: "Cryptanalysis",
      description: "The study of analyzing and breaking cryptographic systems",
      example: "Using frequency analysis to crack simple substitution ciphers"
    }
  ];

  const caesarCipherSteps = [
    "Choose a shift value (1-25)",
    "Replace each letter with the letter that many positions down the alphabet",
    "Wrap around from Z to A if needed",
    "Numbers and symbols remain unchanged"
  ];

  const forensicProcess = [
    "Acquire digital evidence from devices",
    "Create forensic images to preserve original data",
    "Analyze files and recover deleted information",
    "Decrypt encrypted files using various techniques",
    "Document findings for legal proceedings"
  ];

  const handleBack = () => {
    setCurrentScreen('icsa');
  };

  const handleStartGame = () => {
    addXP(10);
    toast.success('🎯 Starting Digital Forensics Lab!');
    setCurrentScreen('encryption-game');
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
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="title" style={{ fontSize: '24px', margin: '0 0 8px' }}>
          Digital Forensics Lab
        </h1>
        <p className="subtitle">
          Decrypt encrypted files found on a hacker's computer using Caesar cipher techniques
        </p>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 12px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
          What is Digital Forensics?
        </h2>
        <p className="subtitle" style={{ lineHeight: '1.6' }}>
          Digital forensics is the process of recovering and analyzing digital evidence from electronic devices. 
          In this challenge, you'll act as a digital forensics specialist investigating a cybercriminal's computer 
          and decrypting encrypted files to gather evidence.
        </p>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>
          Core Concepts
        </h2>
        <div className="col" style={{ gap: '12px' }}>
          {encryptionConcepts.map((concept, index) => {
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
          How Caesar Cipher Works
        </h2>
        <div className="col" style={{ gap: '8px' }}>
          {caesarCipherSteps.map((step, index) => (
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
          Forensic Investigation Process
        </h2>
        <div className="col" style={{ gap: '8px' }}>
          {forensicProcess.map((step, index) => (
            <div key={index} className="row" style={{ gap: '8px', alignItems: 'flex-start' }}>
              <Clock className="w-4 h-4" style={{ color: 'var(--accent-2)', marginTop: '2px', minWidth: '16px' }} />
              <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                {index + 1}. {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ background: 'rgba(248,113,113,0.1)', borderColor: 'var(--warn)' }}>
        <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warn)' }} />
          <strong style={{ color: 'var(--warn)' }}>Challenge Warning</strong>
        </div>
        <p className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
          This challenge contains 10 encrypted files with increasing difficulty. You'll have limited time 
          and attempts for each file. Use hints wisely as they cost points and time!
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

