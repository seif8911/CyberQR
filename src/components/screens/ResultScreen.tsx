'use client';

import { useAppStore } from '@/lib/store';
import { useEffect, useMemo, useState } from 'react';

interface ResultScreenProps {
  resultType: string;
}

export default function ResultScreen({ resultType }: ResultScreenProps) {
  const { setCurrentScreen, scanHistory, addXP, showPet } = useAppStore();
  const [result, setResult] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    if (scanHistory.length > 0) {
      const latestResult = scanHistory[0];
      setResult(latestResult);
      // Reset modal states when result changes
      setShowDetails(false);
      setShowReportModal(false);
      setShowAiModal(false);
      // Console log for debugging
      console.log('Analysis Result:', {
        url: latestResult.url,
        riskLevel: latestResult.riskLevel,
        riskScore: latestResult.riskScore,
        threats: latestResult.threats,
        providers: latestResult.results?.map((r: any) => ({
          provider: r.provider,
          status: r.status,
          score: r.score,
          elapsedMs: r.elapsedMs
        }))
      });
    }
  }, [scanHistory]);

  const { hasHttps, domain, dnsExists, geminiExplanation } = useMemo(() => {
    if (!result) return { hasHttps: false, domain: '', dnsExists: undefined as undefined | boolean, geminiExplanation: '' };
    let parsedDomain = '';
    let https = false;
    try {
      const u = new URL(result.url);
      parsedDomain = u.hostname;
      https = u.protocol === 'https:';
    } catch {}
    let dns: boolean | undefined = undefined;
    let gemExplain = '';
    if (Array.isArray(result.results)) {
      for (const r of result.results) {
        if (r.provider === 'heuristics' && r.details && typeof r.details.dnsExists === 'boolean') {
          dns = r.details.dnsExists;
        }
        if (r.provider === 'gemini' && r.details && typeof r.details.explanation === 'string') {
          gemExplain = r.details.explanation;
        }
      }
    }
    return { hasHttps: https, domain: parsedDomain, dnsExists: dns, geminiExplanation: gemExplain };
  }, [result]);

  const [showAiModal, setShowAiModal] = useState(false);

  const handleBack = () => {
    setCurrentScreen('scan');
  };

  const handleDetailsClick = () => {
    console.log('Details button clicked, result:', result);
    console.log('Result results array:', result?.results);
    console.log('ShowDetails current state:', showDetails);
    setShowDetails(true);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'scan-another':
        setCurrentScreen('scan');
        break;
      case 'proceed-caution':
        if (result?.url) {
          showPet('Redirecting... Remember to stay alert! 🔍');
          addXP(3);
          window.open(result.url, '_blank', 'noopener,noreferrer');
        }
        break;
      case 'learn-spot':
        setCurrentScreen('lesson-spot');
        break;
      case 'visit-site':
        if (result?.url) {
          showPet('Opening site... Stay vigilant! 👀');
          window.open(result.url, '_blank', 'noopener,noreferrer');
        }
        break;
    }
  };

  if (!result) {
    return (
      <>
        <div className="topbar">
          <button className="ghost" onClick={handleBack}>← Back</button>
          <div className="chip">Loading...</div>
        </div>
        <div className="card">
          <p>Loading scan result...</p>
        </div>
      </>
    );
  }

  const highlightBad = (url: string) => {
    try {
      // Escape HTML special chars first
      const escaped = url
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return escaped
        .replace(/^http:\/\//, '<span class="bad">http://</span>')
        .replace(/(\d)/g, '<span class="bad">$1</span>')
        .replace(/(\.ru|\.cn|\.tk|\.ml)(\/|$)/g, '<span class="bad">$1</span>$2');
    } catch {
      return url;
    }
  };

  const renderSafeResult = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>← Back</button>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>✅</div>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Safe to Visit</h2>
        <div style={{ 
          fontSize: '32px', 
          fontWeight: '800', 
          color: 'var(--ok)',
          marginTop: '8px'
        }}>
          {result.riskScore}/10
        </div>
        <p className="subtitle">Low Risk Score</p>
        {result.cached && (
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--accent)', 
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            ⚡ Cached result ({result.cacheAge}m ago)
          </div>
        )}
      </div>
      
      <div className="card">
        <p className="url" style={{ 
          fontSize: '16px', 
          marginBottom: '16px',
          padding: '12px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          wordBreak: 'break-all'
        }}>
          {result.url}
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ 
            textAlign: 'center', 
            padding: '12px', 
            background: hasHttps ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', 
            borderRadius: '12px' 
          }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{hasHttps ? '🔒' : '🔓'}</div>
            <div style={{ 
              fontSize: '12px', 
              color: hasHttps ? 'var(--ok)' : 'var(--danger)' 
            }}>
              {hasHttps ? 'HTTPS' : 'No HTTPS'}
            </div>
          </div>
          <div style={{ 
            textAlign: 'center', 
            padding: '12px', 
            background: dnsExists ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', 
            borderRadius: '12px' 
          }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{dnsExists ? '🌐' : '❌'}</div>
            <div style={{ 
              fontSize: '12px', 
              color: dnsExists ? 'var(--ok)' : 'var(--danger)' 
            }}>
              {dnsExists ? 'Domain OK' : 'DNS Issue'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button 
            className="cta secondary" 
            onClick={handleDetailsClick}
            style={{ flex: 1 }}
          >
            📊 Details
          </button>
          {geminiExplanation && (
            <button 
              className="cta secondary" 
              onClick={() => setShowAiModal(true)}
              style={{ flex: 1 }}
            >
              💡 AI Analysis
            </button>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
        <button className="cta ok" onClick={() => handleAction('visit-site')} style={{ flex: 1 }}>
          Visit Site
        </button>
        <button className="cta secondary" onClick={() => handleAction('scan-another')} style={{ flex: 1 }}>
          Scan Another
        </button>
      </div>
      
      {/* Details Modal */}
      {showDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Analysis Details</h3>
              <button 
                onClick={() => setShowDetails(false)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            
            {Array.isArray(result?.results) && result.results.length > 0 ? result.results.map((r: any, i: number) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ textTransform: 'capitalize' }}>{r.provider}</strong>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    background: r.status === 'ok' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)',
                    color: r.status === 'ok' ? 'var(--ok)' : 'var(--warn)'
                  }}>
                    {r.status || 'ok'}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                  <div>Score: <strong>{Math.round(r.score/10)}/10</strong></div>
                  {typeof r.elapsedMs === 'number' && (
                    <div>Time: <strong>{r.elapsedMs}ms</strong></div>
                  )}
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
                <p>No analysis details available</p>
              </div>
            )}
            
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button 
                className="cta secondary"
                onClick={() => setShowReportModal(true)}
                style={{ marginRight: '8px' }}
              >
                🚨 Report Website
              </button>
              <button 
                className="cta"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Report Modal */}
      {showReportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Report Website</h3>
            <p style={{ margin: '0 0 16px 0', color: 'var(--muted)' }}>
              Help us improve our database by reporting this website. Your report will help protect other users.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="cta warn"
                onClick={async () => {
                  try {
                    await fetch('/api/report', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        url: result.url, 
                        reportType: 'malicious',
                        userReason: 'User reported as malicious'
                      })
                    });
                    showPet('Website reported successfully! Thank you for helping keep others safe.');
                    setShowReportModal(false);
                    setShowDetails(false);
                  } catch (e) {
                    showPet('Failed to report website. Please try again.');
                  }
                }}
                style={{ flex: 1 }}
              >
                Report as Malicious
              </button>
              <button 
                className="cta secondary"
                onClick={() => setShowReportModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCautionResult = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>← Back</button>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>⚠️</div>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Proceed with Caution</h2>
        <div style={{ 
          fontSize: '32px', 
          fontWeight: '800', 
          color: '#d97706',
          marginTop: '8px'
        }}>
          {result.riskScore}/10
        </div>
        <p className="subtitle">Medium Risk Score</p>
        {result.cached && (
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--accent)', 
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            ⚡ Cached result ({result.cacheAge}m ago)
          </div>
        )}
      </div>
      
      <div className="card">
        <p className="url" style={{ 
          fontSize: '16px', 
          marginBottom: '16px',
          padding: '12px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          wordBreak: 'break-all'
        }}>
          {result.url}
        </p>
        
        {result.threats && result.threats.length > 0 && (
          <div style={{ 
            background: 'rgba(251,191,36,0.1)', 
            borderRadius: '12px', 
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid rgba(251,191,36,0.3)'
          }}>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>⚠️ Potential Issues</div>
            {result.threats.slice(0, 3).map((threat: string, index: number) => (
              <div key={index} style={{ fontSize: '14px', marginBottom: '4px', opacity: 0.9 }}>
                • {threat}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button 
            className="cta secondary" 
            onClick={handleDetailsClick}
            style={{ flex: 1 }}
          >
            📊 Details
          </button>
          {geminiExplanation && (
            <button 
              className="cta secondary" 
              onClick={() => setShowAiModal(true)}
              style={{ flex: 1 }}
            >
              💡 AI Analysis
            </button>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
        <button className="cta caution" onClick={() => handleAction('proceed-caution')} style={{ flex: 1 }}>
          Proceed Anyway
        </button>
        <button className="cta secondary" onClick={() => handleAction('scan-another')} style={{ flex: 1 }}>
          Scan Another
        </button>
      </div>
    </div>
  );

  const renderMaliciousResult = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>← Back</button>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>🚨</div>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--warn)' }}>Dangerous Link</h2>
        <div style={{ 
          fontSize: '32px', 
          fontWeight: '800', 
          color: 'var(--warn)',
          marginTop: '8px'
        }}>
          {result.riskScore}/10
        </div>
        <p className="subtitle">High Risk Score</p>
        {result.cached && (
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--accent)', 
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            ⚡ Cached result ({result.cacheAge}m ago)
          </div>
        )}
      </div>
      
      <div className="card">
        <p 
          className="url"
          style={{ 
            fontSize: '16px', 
            marginBottom: '16px',
            padding: '12px',
            background: 'rgba(248,113,113,0.1)',
            borderRadius: '12px',
            wordBreak: 'break-all',
            border: '1px solid rgba(248,113,113,0.3)'
          }}
          dangerouslySetInnerHTML={{ __html: highlightBad(result.url) }}
        />
        
        <div style={{ 
          background: 'rgba(248,113,113,0.15)', 
          borderRadius: '12px', 
          padding: '16px',
          marginBottom: '16px',
          border: '2px solid rgba(248,113,113,0.4)'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'var(--warn)' }}>
            🚨 DO NOT VISIT
          </div>
          <div style={{ fontSize: '14px', marginBottom: '12px', opacity: 0.9 }}>
            This link appears to be malicious and could steal your information.
          </div>
          {result.threats && result.threats.length > 0 && (
            <div>
              {result.threats.slice(0, 3).map((threat: string, index: number) => (
                <div key={index} style={{ fontSize: '13px', marginBottom: '4px', opacity: 0.8 }}>
                  • {threat}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button 
            className="cta secondary" 
            onClick={handleDetailsClick}
            style={{ flex: 1 }}
          >
            📊 Details
          </button>
          {geminiExplanation && (
            <button 
              className="cta secondary" 
              onClick={() => setShowAiModal(true)}
              style={{ flex: 1 }}
            >
              💡 AI Analysis
            </button>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
        <button className="cta warn" onClick={() => handleAction('learn-spot')} style={{ flex: 1 }}>
          Learn More
        </button>
        <button className="cta secondary" onClick={() => handleAction('scan-another')} style={{ flex: 1 }}>
          Scan Another
        </button>
      </div>
    </div>
  );

  switch (resultType) {
    case 'result-safe':
      return (
        <>
          {renderSafeResult()}
          {showAiModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 200 }}>
              <div className="card" style={{ maxWidth: '340px' }}>
                <strong>AI Explanation</strong>
                <p className="subtitle" style={{ marginTop: '8px' }}>{geminiExplanation || 'No additional details.'}</p>
                <div className="row" style={{ marginTop: '12px', justifyContent: 'flex-end' }}>
                  <button className="cta" style={{ minWidth: '120px' }} onClick={() => setShowAiModal(false)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    case 'result-caution':
      return (
        <>
          {renderCautionResult()}
          {showAiModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 200 }}>
              <div className="card" style={{ maxWidth: '340px' }}>
                <strong>AI Explanation</strong>
                <p className="subtitle" style={{ marginTop: '8px' }}>{geminiExplanation || 'No additional details.'}</p>
                <div className="row" style={{ marginTop: '12px', justifyContent: 'flex-end' }}>
                  <button className="cta" style={{ minWidth: '120px' }} onClick={() => setShowAiModal(false)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    case 'result-malicious':
      return (
        <>
          {renderMaliciousResult()}
          {showAiModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 200 }}>
              <div className="card" style={{ maxWidth: '340px' }}>
                <strong>AI Explanation</strong>
                <p className="subtitle" style={{ marginTop: '8px' }}>{geminiExplanation || 'No additional details.'}</p>
                <div className="row" style={{ marginTop: '12px', justifyContent: 'flex-end' }}>
                  <button className="cta" style={{ minWidth: '120px' }} onClick={() => setShowAiModal(false)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    default:
      return renderSafeResult();
  }
}
