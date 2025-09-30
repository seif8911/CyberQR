'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { authService } from '@/lib/firebase';
import { 
  Flag, 
  Shield, 
  Code, 
  Lock, 
  Brain,
  Trophy,
  Target,
  Flame,
  User,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Challenge {
  id: string;
  icon: any;
  title: string;
  description: string;
  progress: number;
  totalChallenges: number;
  completedChallenges: number;
  route: string;
}

export default function ICSAHubScreen() {
  const { setCurrentScreen, user, addXP, unlockBadge, refreshUserData } = useAppStore();
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'phishing',
      icon: Shield,
      title: 'Phishing Simulation',
      description: 'Learn to identify and prevent phishing attacks',
      progress: 0,
      totalChallenges: 10,
      completedChallenges: 0,
      route: 'phishing-intro'
    },
    {
      id: 'least-privilege',
      icon: Flag,
      title: 'Least Privilege',
      description: 'Master access control and privilege management',
      progress: 0,
      totalChallenges: 8,
      completedChallenges: 0,
      route: 'least-privilege-intro'
    },
    {
      id: 'secure-coding',
      icon: Code,
      title: 'Secure Coding',
      description: 'Master secure programming practices',
      progress: 0,
      totalChallenges: 12,
      completedChallenges: 0,
      route: 'secure-coding-intro'
    },
    {
      id: 'encryption',
      icon: Lock,
      title: 'Digital Forensics Lab',
      description: 'Decrypt files using Caesar cipher techniques',
      progress: 0,
      totalChallenges: 5,
      completedChallenges: 0,
      route: 'encryption-intro'
    },
    {
      id: 'security-quiz',
      icon: Brain,
      title: 'Social Media Investigation',
      description: 'Analyze social media posts for security risks',
      progress: 0,
      totalChallenges: 5,
      completedChallenges: 0,
      route: 'security-quiz-intro'
    }
  ]);

  useEffect(() => {
    // Load progress from Firebase and refresh user data
    const loadProgress = async () => {
      if (user?.id) {
        try {
          const allProgress = await authService.getAllChallengeProgress(user.id);
          
          setChallenges(prev => prev.map(challenge => {
            const progressData = allProgress[challenge.id];
            if (progressData) {
              const newProgress = Math.round((progressData.completed / progressData.total) * 100);
              return { 
                ...challenge, 
                progress: newProgress, 
                completedChallenges: progressData.completed 
              };
            }
            return challenge;
          }));
        } catch (error) {
          console.error('Error loading challenge progress:', error);
        }
      }
    };

    loadProgress();

    // Set up real-time progress updates
    const interval = setInterval(loadProgress, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [user?.id, refreshUserData]);

  const handleBack = () => {
    setCurrentScreen('home');
  };


  const handleChallengeStart = (challenge: Challenge) => {
    // Add some XP for exploring
    addXP(5);
    console.log('ICSA Hub: Starting challenge:', challenge.title, 'Route:', challenge.route);
    setCurrentScreen(challenge.route);
  };

  const totalCompleted = challenges.reduce((sum, c) => sum + c.completedChallenges, 0);
  const totalChallenges = challenges.reduce((sum, c) => sum + c.totalChallenges, 0);
  const overallProgress = Math.round((totalCompleted / totalChallenges) * 100);

  return (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="chip">
          ICSA Hub
        </div>
      </div>
      
      <h1 className="title">CyberSec Arena</h1>
      <p className="subtitle">
        Master cybersecurity through gamified challenges and interactive learning.
      </p>
      
      {/* Stats Overview */}
      <div className="card" style={{ margin: '18px 0' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="col" style={{ gap: '6px' }}>
            <strong>Your Progress</strong>
            <span className="subtitle">
              {totalCompleted}/{totalChallenges} challenges completed
            </span>
          </div>
          <div className="badge">
            {overallProgress}% Complete
          </div>
        </div>
        <div className="progress" style={{ marginTop: '12px' }}>
          <div style={{ width: `${overallProgress}%` }} />
        </div>
      </div>

      {/* Challenge Cards */}
      <div className="col" style={{ gap: '12px', marginTop: '12px' }}>
        {challenges.map((challenge) => {
          const IconComponent = challenge.icon;
          return (
            <div key={challenge.id} className="card" style={{ cursor: 'pointer' }} onClick={() => handleChallengeStart(challenge)}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
                  <div 
                    className="logo" 
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      fontSize: '20px',
                      background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)'
                    }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="col" style={{ gap: '4px', flex: 1 }}>
                    <strong style={{ fontSize: '16px' }}>{challenge.title}</strong>
                    <span className="subtitle" style={{ fontSize: '13px' }}>
                      {challenge.description}
                    </span>
                    <div className="row" style={{ gap: '8px', marginTop: '8px' }}>
                      <span className="chip" style={{ fontSize: '11px' }}>
                        {challenge.completedChallenges}/{challenge.totalChallenges} done
                      </span>
                      <span className="chip" style={{ fontSize: '11px', background: 'rgba(34,197,94,0.18)', borderColor: 'rgba(34,197,94,0.35)', color: '#22c55e' }}>
                        {challenge.progress}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="progress" style={{ width: '60px', height: '6px', marginTop: '4px' }}>
                  <div style={{ width: `${challenge.progress}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="card" style={{ marginTop: '18px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>Achievement Summary</h3>
        <div className="grid" style={{ gap: '12px' }}>
          <div className="module">
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <Trophy className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>Level {user?.level ?? 1}</h4>
                <p style={{ margin: '2px 0 0', fontSize: '11px' }}>Current Level</p>
              </div>
            </div>
          </div>
          <div className="module">
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <Target className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>{totalCompleted}</h4>
                <p style={{ margin: '2px 0 0', fontSize: '11px' }}>Challenges Done</p>
              </div>
            </div>
          </div>
          <div className="module">
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <Flame className="w-5 h-5" style={{ color: 'var(--warn)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>{user?.streak ?? 1} Days</h4>
                <p style={{ margin: '2px 0 0', fontSize: '11px' }}>Active Streak</p>
              </div>
            </div>
          </div>
          <div className="module">
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <User className="w-5 h-5" style={{ color: 'var(--ok)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>{user?.xp ?? 0} XP</h4>
                <p style={{ margin: '2px 0 0', fontSize: '11px' }}>Total Points</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="card" style={{ marginTop: '12px', textAlign: 'center', background: 'rgba(249,178,34,0.1)', borderColor: 'var(--accent)' }}>
        <div className="row" style={{ justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🔥</span>
          <strong style={{ color: 'var(--accent)' }}>
            Keep going! {user?.streak ?? 1}-day streak achieved!
          </strong>
        </div>
        <p className="subtitle" style={{ marginTop: '8px', fontSize: '13px' }}>
          Complete challenges to unlock new levels and earn badges.
        </p>
      </div>
    </>
  );
}