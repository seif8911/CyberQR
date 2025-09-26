'use client';

import { useAppStore } from '@/lib/store';

export default function TextResultScreen() {
  const { setCurrentScreen, showPet, extractedText } = useAppStore();

  const handleBack = () => {
    setCurrentScreen('scan');
  };

  const handleAnalyzeAsUrl = () => {
    if (extractedText.trim()) {
      setCurrentScreen('scan');
      // You could trigger the analysis here
      showPet('Text content: ' + extractedText);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          ← Back
        </button>
        <div className="chip">QR Text Content</div>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>📝</div>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Text Content Found</h2>
        <p className="subtitle">QR code contains text content</p>
      </div>
      
      <div className="card" style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Content:</h3>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '16px',
          minHeight: '200px',
          fontSize: '16px',
          lineHeight: '1.5',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}>
          {extractedText || 'No text content available'}
        </div>
        
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button 
            className="cta secondary"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(extractedText);
                showPet('Text copied to clipboard!');
              }
            }}
            style={{ flex: 1 }}
          >
            📋 Copy Text
          </button>
          <button 
            className="cta"
            onClick={handleAnalyzeAsUrl}
            style={{ flex: 1 }}
          >
            🔍 Analyze as URL
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
        <button className="cta secondary" onClick={handleBack} style={{ flex: 1 }}>
          Scan Another
        </button>
      </div>
    </div>
  );
}
