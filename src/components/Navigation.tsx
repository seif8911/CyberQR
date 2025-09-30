'use client';

import { useAppStore } from '@/lib/store';

export default function Navigation() {
  const { currentScreen, setCurrentScreen } = useAppStore();

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'scan', icon: '📱', label: 'Scanner' },
    { id: 'icsa', icon: '🎯', label: 'ICSA Hub' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  const handleNavClick = (screenId: string) => {
    console.log('Nav clicked:', screenId);
    console.log('Current screen before:', currentScreen);
    setCurrentScreen(screenId);
  };

  return (
    <div className="nav-footer">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-btn ${currentScreen === item.id ? 'active' : ''}`}
          onClick={() => handleNavClick(item.id)}
          aria-label={`Navigate to ${item.label}`}
        >
          <div className="nav-icon">{item.icon}</div>
          <div className="nav-label">{item.label}</div>
        </button>
      ))}
    </div>
  );
}
