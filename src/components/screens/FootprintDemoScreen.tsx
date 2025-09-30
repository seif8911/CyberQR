'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

interface Item {
  id: string;
  text: string;
  isPrivate: boolean;
  zone?: 'safe' | 'private';
}

export default function FootprintDemoScreen() {
  const { setCurrentScreen, addXP, showPet } = useAppStore();
  
  const [items] = useState<Item[]>([
    { id: '1', text: 'Favorite hobby', isPrivate: false },
    { id: '2', text: 'Home address', isPrivate: true },
    { id: '3', text: 'School name', isPrivate: true },
    { id: '4', text: 'Birth date', isPrivate: true },
    { id: '5', text: 'Phone number', isPrivate: true },
    { id: '6', text: 'Favorite book', isPrivate: false },
    { id: '7', text: 'Pet\'s name', isPrivate: false },
    { id: '8', text: 'Social Security Number', isPrivate: true }
  ]);
  
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [placedItems, setPlacedItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const handleDragStart = (item: Item) => {
    setDraggedItem(item);
  };

  const handleDrop = (zone: 'safe' | 'private') => {
    if (!draggedItem) return;
    
    const isCorrect = (zone === 'safe' && !draggedItem.isPrivate) || 
                      (zone === 'private' && draggedItem.isPrivate);
    
    const newItem = { ...draggedItem, zone };
    setPlacedItems(prev => [...prev, newItem]);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      showPet(zone === 'safe' ? 'Great! This is safe to share online' : 'Correct! Keep this private');
    } else {
      showPet(zone === 'safe' ? 'Careful! This should stay private' : 'This one is actually safe to share');
    }
    
    setDraggedItem(null);
    
    if (placedItems.length + 1 === items.length) {
      setGameComplete(true);
      addXP(25);
      setTimeout(() => {
        showPet(`Game complete! You scored ${score + (isCorrect ? 10 : 0)}/${items.length * 10} points`);
      }, 1000);
    }
  };

  // Handle mobile touch events
  const handleItemClick = (item: Item) => {
    if (placedItems.find(p => p.id === item.id)) return;
    
    // For mobile: automatically place in correct zone
    const zone: 'safe' | 'private' = item.isPrivate ? 'private' : 'safe';
    const newItem = { ...item, zone };
    setPlacedItems(prev => [...prev, newItem]);
    setScore(prev => prev + 10);
    showPet(zone === 'safe' ? 'Correct! This is safe to share' : 'Right! Keep this private');
    
    if (placedItems.length + 1 === items.length) {
      setGameComplete(true);
      addXP(25);
      setTimeout(() => {
        showPet(`Perfect score! You know what to share and what to keep private!`);
      }, 1000);
    }
  };

  const handleBack = () => {
    setCurrentScreen('icsa');
  };

  const availableItems = items.filter(item => !placedItems.find(p => p.id === item.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          ← Back
        </button>
        <div className="chip">Score: {score}</div>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🕵️</div>
        <h2 style={{ margin: 0, fontSize: '20px' }}>Digital Footprint Detective</h2>
        <p className="subtitle">Drag items to the correct zone or tap to auto-place</p>
      </div>
      
      {!gameComplete && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Items to Sort:</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '8px' 
          }}>
            {availableItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                onClick={() => handleItemClick(item)}
                style={{
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px dashed rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontSize: '13px',
                  userSelect: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1 }}>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop('safe')}
          style={{
            background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(34,197,94,0.1))',
            border: '2px dashed rgba(74,222,128,0.5)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--ok)' }}>Safe to Share</h3>
          <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '16px' }}>Public information that's okay online</p>
          
          <div style={{ flex: 1 }}>
            {placedItems.filter(item => item.zone === 'safe').map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '8px',
                  background: 'rgba(74,222,128,0.3)',
                  border: '1px solid rgba(74,222,128,0.5)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  fontSize: '12px'
                }}
              >
                {item.text} {item.isPrivate ? '❌' : '✅'}
              </div>
            ))}
          </div>
        </div>
        
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop('private')}
          style={{
            background: 'linear-gradient(135deg, rgba(248,113,113,0.2), rgba(239,68,68,0.1))',
            border: '2px dashed rgba(248,113,113,0.5)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--warn)' }}>Keep Private</h3>
          <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '16px' }}>Personal info that should stay secret</p>
          
          <div style={{ flex: 1 }}>
            {placedItems.filter(item => item.zone === 'private').map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '8px',
                  background: 'rgba(248,113,113,0.3)',
                  border: '1px solid rgba(248,113,113,0.5)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  fontSize: '12px'
                }}
              >
                {item.text} {item.isPrivate ? '✅' : '❌'}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {gameComplete && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button className="cta ok" onClick={() => setCurrentScreen('icsa')}>
            Back to ICSA Hub
          </button>
        </div>
      )}
    </div>
  );
}

