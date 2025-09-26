'use client';

import { useAppStore } from '@/lib/store';

export default function DebugInfo() {
  const { currentScreen, setCurrentScreen } = useAppStore();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 1000,
      fontFamily: 'monospace',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }}>
      <div>Current Screen: {currentScreen}</div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button 
          onClick={() => setCurrentScreen('home')}
          style={{ fontSize: '10px', padding: '2px 4px' }}
        >
          Home
        </button>
        <button 
          onClick={() => setCurrentScreen('scan')}
          style={{ fontSize: '10px', padding: '2px 4px' }}
        >
          Scan
        </button>
        <button 
          onClick={() => setCurrentScreen('icsa')}
          style={{ fontSize: '10px', padding: '2px 4px' }}
        >
          ICSA
        </button>
      </div>
    </div>
  );
}
