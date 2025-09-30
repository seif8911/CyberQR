'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Code, 
  Shield, 
  Bug,
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SecurityPrinciple {
  icon: any;
  title: string;
  description: string;
  example: string;
}

export default function SecureCodingIntroScreen() {
  const { setCurrentScreen, addXP } = useAppStore();

  const securityPrinciples: SecurityPrinciple[] = [
    {
      icon: Lock,
      title: "Input Validation",
      description: "Always validate and sanitize user input to prevent injection attacks",
      example: "Check data types, length limits, and format before processing"
    },
    {
      icon: Shield,
      title: "Authentication & Authorization",
      description: "Implement proper user authentication and access controls",
      example: "Use strong passwords, 2FA, and principle of least privilege"
    },
    {
      icon: Bug,
      title: "Error Handling",
      description: "Handle errors gracefully without exposing sensitive information",
      example: "Log errors securely and show generic messages to users"
    }
  ];

  const commonVulnerabilities = [
    "SQL Injection - Malicious SQL code in user input",
    "Cross-Site Scripting (XSS) - Injecting malicious scripts",
    "Buffer Overflow - Writing beyond allocated memory",
    "Insecure Direct Object References - Accessing unauthorized resources",
    "Security Misconfiguration - Default settings and unnecessary features"
  ];

  const handleBack = () => {
    setCurrentScreen('icsa');
  };

  const handleStartGame = () => {
    addXP(10);
    toast.success('🎯 Starting Secure Coding Challenge!');
    setCurrentScreen('secure-coding-game');
  };

  return (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="chip">Secure Coding</div>
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
          <Code className="w-8 h-8" />
        </div>
        <h1 className="title" style={{ fontSize: '24px', margin: '0 0 8px' }}>
          Secure Coding Training
        </h1>
        <p className="subtitle">
          Learn to write secure code and identify common vulnerabilities
        </p>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 12px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
          What is Secure Coding?
        </h2>
        <p className="subtitle" style={{ lineHeight: '1.6' }}>
          Secure coding is the practice of writing software that is resistant to attack by malicious users. 
          It involves following security best practices, understanding common vulnerabilities, and implementing 
          proper security controls throughout the development process.
        </p>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>
          Core Security Principles
        </h2>
        <div className="col" style={{ gap: '12px' }}>
          {securityPrinciples.map((principle, index) => {
            const IconComponent = principle.icon;
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
                    <strong style={{ fontSize: '14px' }}>{principle.title}</strong>
                    <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      {principle.description}
                    </span>
                    <span className="subtitle" style={{ fontSize: '11px', lineHeight: '1.3', color: 'var(--accent-2)' }}>
                      Example: {principle.example}
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
          Common Vulnerabilities
        </h2>
        <div className="col" style={{ gap: '8px' }}>
          {commonVulnerabilities.map((vuln, index) => (
            <div key={index} className="row" style={{ gap: '8px', alignItems: 'flex-start' }}>
              <AlertTriangle className="w-4 h-4" style={{ color: 'var(--warn)', marginTop: '2px', minWidth: '16px' }} />
              <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                {vuln}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
          Best Practices
        </h2>
        <div className="col" style={{ gap: '8px' }}>
          {[
            "Use parameterized queries to prevent SQL injection",
            "Validate all input on both client and server side",
            "Implement proper error handling and logging",
            "Keep software and dependencies updated",
            "Use HTTPS for all communications",
            "Implement proper session management",
            "Follow the principle of least privilege"
          ].map((practice, index) => (
            <div key={index} className="row" style={{ gap: '8px', alignItems: 'flex-start' }}>
              <CheckCircle className="w-4 h-4" style={{ color: 'var(--ok)', marginTop: '2px', minWidth: '16px' }} />
              <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                {practice}
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
          Start Challenge
        </button>
        <button className="cta secondary" onClick={handleBack}>
          Back to Hub
        </button>
      </div>
    </>
  );
}
