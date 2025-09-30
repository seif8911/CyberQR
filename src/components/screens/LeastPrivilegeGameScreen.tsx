'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { authService } from '@/lib/firebase';
import { 
  Users, 
  Clock, 
  Save, 
  CheckCircle, 
  ArrowLeft,
  User,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Account {
  id: string;
  name: string;
  email: string;
  role: string;
  jobDescription: string;
  avatar: string;
  lastLogin: string;
  correctPrivilege: PrivilegeLevel;
}

type PrivilegeLevel = 
  | "no-access"
  | "read-only"
  | "read-write"
  | "upload-submit"
  | "limited-admin"
  | "full-admin"
  | "temporary-elevated"
  | "customer-self-service";

const privilegeOptions = [
  { value: "no-access", label: "No Access", description: "Cannot access resource at all" },
  { value: "read-only", label: "Read-Only", description: "View only access" },
  { value: "read-write", label: "Read / Write", description: "View and modify data" },
  { value: "upload-submit", label: "Upload / Submit", description: "Can upload or submit content but not change system config" },
  { value: "limited-admin", label: "Limited Admin", description: "Can manage user settings for own team only" },
  { value: "full-admin", label: "Full Admin", description: "Full system-level administrative privileges" },
  { value: "temporary-elevated", label: "Temporary Elevated", description: "Elevated for 1 session; used for limited tasks" },
  { value: "customer-self-service", label: "Customer (Self-Service)", description: "Customer-level portal; only their own records" }
];

const accounts: Account[] = [
  {
    id: "amina",
    name: "Amina Hassan",
    email: "amina.hassan@company.com",
    role: "System Administrator",
    jobDescription: "Manages servers, deploys code, updates patches",
    avatar: "/avatar_amina.png",
    lastLogin: "2024-01-15 09:30",
    correctPrivilege: "full-admin"
  },
  {
    id: "omar",
    name: "Omar Nasser",
    email: "omar.nasser@company.com",
    role: "Senior DevOps Engineer",
    jobDescription: "Deploy pipelines and manage CI/CD",
    avatar: "/avatar_omar.png",
    lastLogin: "2024-01-15 08:45",
    correctPrivilege: "limited-admin"
  },
  {
    id: "laila",
    name: "Laila Mostafa",
    email: "laila.mostafa@company.com",
    role: "Customer Support Agent",
    jobDescription: "Responds to customer tickets, looks up customer orders",
    avatar: "/avatar_laila.png",
    lastLogin: "2024-01-15 10:15",
    correctPrivilege: "read-write"
  },
  {
    id: "karim",
    name: "Karim Adel",
    email: "karim.intern@company.com",
    role: "Intern (Engineering)",
    jobDescription: "Assist developers, test features in staging (not production)",
    avatar: "/avatar_karim.png",
    lastLogin: "2024-01-15 11:20",
    correctPrivilege: "read-only"
  },
  {
    id: "nour",
    name: "Nour El-Sayed",
    email: "nour.elsayed@company.com",
    role: "Finance Manager",
    jobDescription: "Views financial reports and exports payroll",
    avatar: "/avatar_nour.png",
    lastLogin: "2024-01-15 07:30",
    correctPrivilege: "read-write"
  },
  {
    id: "hassan",
    name: "Hassan Omar",
    email: "hassan.contractor@company.com",
    role: "Marketing Contractor",
    jobDescription: "Uploads marketing assets to CMS",
    avatar: "/avatar_hassan.png",
    lastLogin: "2024-01-14 16:45",
    correctPrivilege: "upload-submit"
  },
  {
    id: "sara",
    name: "Sara Ibrahim",
    email: "sara.ibrahim@company.com",
    role: "Database Admin (DBA)",
    jobDescription: "Manages production database backups and restores",
    avatar: "/avatar_sara.png",
    lastLogin: "2024-01-15 06:15",
    correctPrivilege: "limited-admin"
  },
  {
    id: "fatima",
    name: "Fatima R.",
    email: "fatima.r@example.com",
    role: "Registered Customer",
    jobDescription: "Purchases and views her orders",
    avatar: "/avatar_fatima.png",
    lastLogin: "2024-01-15 12:30",
    correctPrivilege: "customer-self-service"
  },
  {
    id: "ahmed",
    name: "Ahmed K.",
    email: "ahmed.k@example.com",
    role: "Registered Customer",
    jobDescription: "Purchases and views his orders",
    avatar: "/avatar_ahmed.png",
    lastLogin: "2024-01-15 14:20",
    correctPrivilege: "customer-self-service"
  },
  {
    id: "cloudmon",
    name: "CloudMonitoring Co.",
    email: "svc-cloudmon@cloudmonitoring.com",
    role: "Third-party Vendor",
    jobDescription: "Sends telemetry and gets read-only logs",
    avatar: "/avatar_cloudmon.png",
    lastLogin: "2024-01-15 15:00",
    correctPrivilege: "read-only"
  }
];

export default function LeastPrivilegeGameScreen() {
  const { setCurrentScreen, addXP, unlockBadge, user, refreshUserData } = useAppStore();
  const [assignments, setAssignments] = useState<Record<string, PrivilegeLevel>>({});
  const [assignedCount, setAssignedCount] = useState(0);
  const [startTime] = useState(Date.now());

  // Shuffle accounts on mount
  const [shuffledAccounts] = useState(() => [...accounts].sort(() => Math.random() - 0.5));

  useEffect(() => {
    const count = Object.keys(assignments).length;
    setAssignedCount(count);
  }, [assignments]);

  const handleBack = () => {
    setCurrentScreen('icsa');
  };

  const handleAssignment = (accountId: string, privilege: PrivilegeLevel) => {
    setAssignments(prev => ({
      ...prev,
      [accountId]: privilege
    }));
  };

  const handleFinishAssignments = async () => {
    if (assignedCount < 10) {
      toast.error("Please assign privileges to all accounts");
      return;
    }
    
    // Calculate score based on correct assignments
    let correctAssignments = 0;
    shuffledAccounts.forEach(account => {
      if (assignments[account.id] === account.correctPrivilege) {
        correctAssignments++;
      }
    });
    
    const percentage = (correctAssignments / 10) * 100;
    const score = Math.round(percentage);
    
    // Save progress to Firebase
    if (user?.id) {
      try {
        const progressData = {
          completed: 1,
          total: 1,
          score: score,
          percentage: percentage,
          assignments,
          startTime,
          accounts: shuffledAccounts,
          completedAt: new Date().toISOString()
        };
        
        await authService.saveChallengeProgress(user.id, 'least-privilege', progressData);
        
        // Award XP and badges
        if (percentage >= 80) {
          await addXP(30);
          await unlockBadge('privilege-master');
          toast.success('🏆 Badge earned: Privilege Master!');
        } else if (percentage >= 60) {
          await addXP(20);
          toast.success('Good job! You understand privilege management.');
        } else {
          await addXP(10);
          toast('Keep learning! Privilege management is crucial for security.');
        }
        
        // Refresh user data to ensure UI is updated
        await refreshUserData();
        
      } catch (error) {
        console.error('Error saving least privilege progress:', error);
        toast.error('Error saving progress. Please try again.');
      }
    }
    
    // Also save to localStorage for backward compatibility
    localStorage.setItem('least-privilege-progress', JSON.stringify({
      completed: 1,
      total: 1,
      score: score,
      assignments,
      startTime,
      accounts: shuffledAccounts
    }));
    
    setCurrentScreen('icsa');
  };

  const handleSaveDraft = () => {
    localStorage.setItem('privilege-draft', JSON.stringify(assignments));
    toast.success("Draft saved successfully");
  };

  const progress = (assignedCount / 10) * 100;

  return (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="chip">Privilege Assignment</div>
      </div>
      
      <div className="card" style={{ marginBottom: '18px' }}>
        <h1 className="title" style={{ fontSize: '24px', margin: '0 0 8px' }}>
          Privilege Assignment Challenge
        </h1>
        <p className="subtitle">
          You are the General Cybersecurity Manager. Assign appropriate privileges to each account based on their role and responsibilities.
        </p>
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom: '18px' }}>
        <div className="row" style={{ gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
          <Users className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
          <span style={{ fontWeight: '600' }}>Progress</span>
          <span style={{ color: 'var(--accent-2)', fontWeight: '600' }}>{Math.round(progress)}%</span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div style={{ width: `${progress}%` }} />
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginTop: '8px' }}>
          <span className="subtitle" style={{ fontSize: '12px' }}>
            <Clock className="w-4 h-4" style={{ display: 'inline', marginRight: '4px' }} />
            Session Active
          </span>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>
            Assignments: {assignedCount}/10
          </span>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="col" style={{ gap: '12px', marginBottom: '18px' }}>
        {shuffledAccounts.map((account) => (
          <div key={account.id} className="card">
            <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
              <img 
                src={account.avatar} 
                alt={account.name}
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px' }}>{account.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--accent-2)', margin: '0 0 4px' }}>{account.role}</p>
                <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '0 0 8px' }}>{account.email}</p>
                <p style={{ fontSize: '12px', margin: '0 0 8px', lineHeight: '1.4' }}>{account.jobDescription}</p>
                <p style={{ fontSize: '10px', color: 'var(--muted)', margin: '0 0 12px' }}>
                  Last login: {account.lastLogin}
                </p>
                
                <select
                  value={assignments[account.id] || ""}
                  onChange={(e) => handleAssignment(account.id, e.target.value as PrivilegeLevel)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text)',
                    fontSize: '12px'
                  }}
                >
                  <option value="">Select privilege level</option>
                  {privilegeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ 
        position: 'sticky', 
        bottom: 0, 
        background: 'linear-gradient(180deg, transparent, rgba(0,0,0,.35))', 
        padding: '14px 10px 8px', 
        display: 'flex', 
        gap: '10px' 
      }}>
        <button 
          className="cta secondary"
          onClick={handleSaveDraft}
          style={{ flex: 1 }}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </button>
        <button 
          className="cta" 
          onClick={handleFinishAssignments}
          disabled={assignedCount < 10}
          style={{ flex: 1 }}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Finish Assignments
        </button>
      </div>
    </>
  );
}
