'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Users, 
  Shield, 
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Principle {
  icon: any;
  title: string;
  description: string;
  example: string;
}

export default function LeastPrivilegeIntroScreen() {
  const { setCurrentScreen, addXP } = useAppStore();

  const principles: Principle[] = [
    {
      icon: Lock,
      title: "Principle of Least Privilege",
      description: "Users should only have the minimum access necessary to perform their job functions",
      example: "A customer support agent only needs read-write access to customer records, not admin privileges"
    },
    {
      icon: Shield,
      title: "Role-Based Access Control",
      description: "Access permissions are assigned based on job roles and responsibilities",
      example: "System administrators get full admin access, while interns get read-only access"
    },
    {
      icon: UserCheck,
      title: "Regular Access Reviews",
      description: "Periodically review and update user permissions to ensure they're still appropriate",
      example: "Quarterly reviews to remove access for employees who changed roles or left the company"
    }
  ];

  const privilegeLevels = [
    { level: "No Access", description: "Cannot access resource at all", use: "For sensitive data or restricted systems" },
    { level: "Read-Only", description: "View only access", use: "For viewing reports, documentation, or monitoring" },
    { level: "Read/Write", description: "View and modify data", use: "For daily operational tasks" },
    { level: "Upload/Submit", description: "Can upload content but not change system config", use: "For content creators and contractors" },
    { level: "Limited Admin", description: "Manage user settings for own team only", use: "For team leads and department managers" },
    { level: "Full Admin", description: "Full system-level administrative privileges", use: "For system administrators and IT staff" },
    { level: "Temporary Elevated", description: "Elevated for 1 session; used for limited tasks", use: "For one-time administrative tasks" },
    { level: "Customer Self-Service", description: "Customer-level portal; only their own records", use: "For external customers and clients" }
  ];

  const commonMistakes = [
    "Giving everyone admin access 'just in case'",
    "Not removing access when employees change roles",
    "Sharing admin credentials instead of individual accounts",
    "Giving contractors the same access as full-time employees",
    "Not reviewing access permissions regularly"
  ];

  const handleBack = () => {
    setCurrentScreen('icsa');
  };

  const handleStartGame = () => {
    addXP(10);
    toast.success('🎯 Starting Privilege Assignment Challenge!');
    setCurrentScreen('least-privilege-game');
  };

  return (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="chip">Least Privilege Training</div>
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
          <Users className="w-8 h-8" />
        </div>
        <h1 className="title" style={{ fontSize: '24px', margin: '0 0 8px' }}>
          Least Privilege Challenge
        </h1>
        <p className="subtitle">
          Learn to assign appropriate access privileges based on job roles and responsibilities
        </p>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 12px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
          What is Least Privilege?
        </h2>
        <p className="subtitle" style={{ lineHeight: '1.6' }}>
          The Principle of Least Privilege is a security concept that limits user access rights to the minimum 
          necessary to perform their job functions. This reduces the attack surface and limits potential damage 
          if an account is compromised.
        </p>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>
          Core Principles
        </h2>
        <div className="col" style={{ gap: '12px' }}>
          {principles.map((principle, index) => {
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
          Privilege Levels
        </h2>
        <div className="col" style={{ gap: '8px' }}>
          {privilegeLevels.map((privilege, index) => (
            <div key={index} className="row" style={{ gap: '8px', alignItems: 'flex-start' }}>
              <CheckCircle className="w-4 h-4" style={{ color: 'var(--ok)', marginTop: '2px', minWidth: '16px' }} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '13px' }}>{privilege.level}:</strong>
                <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4', marginLeft: '4px' }}>
                  {privilege.description}
                </span>
                <div className="subtitle" style={{ fontSize: '11px', lineHeight: '1.3', color: 'var(--accent-2)', marginTop: '2px' }}>
                  Use case: {privilege.use}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
          Common Mistakes to Avoid
        </h2>
        <div className="col" style={{ gap: '8px' }}>
          {commonMistakes.map((mistake, index) => (
            <div key={index} className="row" style={{ gap: '8px', alignItems: 'flex-start' }}>
              <AlertTriangle className="w-4 h-4" style={{ color: 'var(--warn)', marginTop: '2px', minWidth: '16px' }} />
              <span className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                {mistake}
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
