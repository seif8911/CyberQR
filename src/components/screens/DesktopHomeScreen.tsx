'use client';

import { useAppStore } from '@/lib/store';
import { useEffect } from 'react';

export default function DesktopHomeScreen() {
  const { user, setCurrentScreen, showPet, updateStreak, checkStreakLoss } = useAppStore();

  useEffect(() => {
    updateStreak();
    checkStreakLoss();
  }, [updateStreak, checkStreakLoss]);

  const handleQuickAction = (action: string) => {
    console.log('Navigating to:', action);
    setCurrentScreen(action);
    if (action === 'scan') {
      showPet('Great! Always verify before you trust 🔍');
    }
  };

  const xpPercentage = user ? (user.xp % 100) : 0;
  const nextLevelXP = 100 - (user?.xp % 100) || 100;

  const stats = [
    { label: 'Scans Today', value: '12', icon: '📱', color: 'from-blue-500 to-cyan-500' },
    { label: 'Threats Blocked', value: '3', icon: '🛡️', color: 'from-red-500 to-pink-500' },
    { label: 'Lessons Completed', value: '8', icon: '🎓', color: 'from-green-500 to-emerald-500' },
    { label: 'Current Streak', value: `${user?.streak ?? 1}`, icon: '🔥', color: 'from-orange-500 to-yellow-500' },
  ];

  const recentActivity = [
    { 
      type: 'scan', 
      title: 'QR Code Scanned', 
      description: 'Verified safe website', 
      time: '2 min ago',
      status: 'safe',
      icon: '✅'
    },
    { 
      type: 'lesson', 
      title: 'Phishing Lesson', 
      description: 'Completed with 95% score', 
      time: '1 hour ago',
      status: 'completed',
      icon: '🎯'
    },
    { 
      type: 'threat', 
      title: 'Suspicious Link', 
      description: 'Blocked potential phishing', 
      time: '3 hours ago',
      status: 'blocked',
      icon: '🚫'
    },
  ];

  return (
    <div className="desktop-home-screen">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome back, {user?.displayName || 'Cyber Warrior'}! 👋
          </h1>
          <p className="welcome-subtitle">
            Ready to continue your cybersecurity journey? Let's keep you safe and secure.
          </p>
        </div>
        <div className="welcome-actions">
          <button
            onClick={() => handleQuickAction('scan')}
            className="primary-action-btn"
          >
            <span className="btn-icon">📱</span>
            <div className="btn-content">
              <span className="btn-title">Start QR Scan</span>
              <span className="btn-subtitle">Scan & analyze QR codes</span>
            </div>
          </button>
          <button
            onClick={() => handleQuickAction('icsa')}
            className="secondary-action-btn"
          >
            <span className="btn-icon">🎯</span>
            <div className="btn-content">
              <span className="btn-title">ICSA Hub</span>
              <span className="btn-subtitle">Cybersecurity training</span>
            </div>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-section">
        <h2 className="section-title">Today's Overview</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Level Progress */}
      <div className="level-section">
        <div className="level-card">
          <div className="level-header">
            <div className="level-info">
              <h3 className="level-title">Level {user?.level ?? 1}</h3>
              <p className="level-subtitle">{nextLevelXP} XP to next level</p>
            </div>
            <div className="level-badge">
              <span className="level-xp">{user?.xp ?? 0}</span>
              <span className="level-xp-label">XP</span>
            </div>
          </div>
          <div className="level-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
            <div className="progress-labels">
              <span>Level {user?.level ?? 1}</span>
              <span>Level {(user?.level ?? 1) + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="activity-header">
          <h2 className="section-title">Recent Activity</h2>
          <button className="view-all-btn">View All</button>
        </div>
        <div className="activity-list">
          {recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <div className="activity-title">{activity.title}</div>
                <div className="activity-description">{activity.description}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
              <div className={`activity-status ${activity.status}`}>
                {activity.status === 'safe' && '✅'}
                {activity.status === 'completed' && '🎯'}
                {activity.status === 'blocked' && '🚫'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="tips-section">
        <h2 className="section-title">Security Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🔍</div>
            <div className="tip-content">
              <h4>Always Verify</h4>
              <p>Check URLs before clicking links in QR codes</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔒</div>
            <div className="tip-content">
              <h4>Use HTTPS</h4>
              <p>Look for the lock icon in your browser</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📱</div>
            <div className="tip-content">
              <h4>Update Apps</h4>
              <p>Keep your apps and OS updated for security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
