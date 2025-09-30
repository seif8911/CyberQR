'use client';

import { ReactNode, useState } from 'react';
import { useAppStore } from '@/lib/store';

interface DesktopLayoutProps {
  children: ReactNode;
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const { user, currentScreen, setCurrentScreen, showPet } = useAppStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Dashboard', icon: '🏠', description: 'Overview & Stats' },
    { id: 'scan', label: 'QR Scanner', icon: '📱', description: 'Scan & Analyze' },
    { id: 'icsa', label: 'ICSA Hub', icon: '🎯', description: 'Cybersecurity Arena' },
    { id: 'profile', label: 'Profile', icon: '👤', description: 'Account Settings' },
  ];


  const handleNavigation = (screenId: string) => {
    setCurrentScreen(screenId);
    if (screenId === 'scan') {
      showPet('Great! Always verify before you trust 🔍');
    }
  };

  return (
    <div className="desktop-layout">
      {/* Sidebar */}
      <aside className={`desktop-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">
              <img src="/animations/Snapshot_3.PNG" alt="CyberQR Logo" />
            </div>
            {!sidebarCollapsed && (
              <div className="logo-text">
                <h1>CyberQR</h1>
                <p>Security Hub</p>
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && (
                <div className="nav-content">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!sidebarCollapsed && (
            <div 
              className="user-info clickable"
              onClick={() => handleNavigation('profile')}
            >
              <div className="user-avatar">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" />
                ) : (
                  <span>👤</span>
                )}
                <div className="avatar-edit-icon">
                  ✏️
                </div>
              </div>
              <div className="user-details">
                <p className="user-name">{user?.displayName || 'Cyber Warrior'}</p>
                <p className="user-level">Level {user?.level ?? 1}</p>
              </div>
            </div>
          )}
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="desktop-main">
        {/* Top Header */}
        <header className="desktop-header">
          <div className="header-left">
            <h2 className="page-title">
              {navigationItems.find(item => item.id === currentScreen)?.label || 'Dashboard'}
            </h2>
            <p className="page-description">
              {navigationItems.find(item => item.id === currentScreen)?.description || 'Welcome to your security dashboard'}
            </p>
          </div>
          
          <div className="header-right">
            <div className="streak-badge">
              <span className="streak-icon">🔥</span>
              <span className="streak-text">Day {user?.streak ?? 1}</span>
            </div>
            
            <div className="xp-badge">
              <span className="xp-value">{user?.xp ?? 0}</span>
              <span className="xp-label">XP</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="desktop-content">
          {children}
        </div>
      </main>

    </div>
  );
}
