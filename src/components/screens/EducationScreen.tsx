'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface EducationScreenProps {
  lessonType: string;
}

export default function EducationScreen({ lessonType }: EducationScreenProps) {
  const { setCurrentScreen, addXP, unlockBadge, showPet } = useAppStore();
  const [flagsFound, setFlagsFound] = useState(0);
  const [emailFlagsFound, setEmailFlagsFound] = useState(0);
  const [biometricStep, setBiometricStep] = useState(0);
  const [twofaStep, setTwofaStep] = useState(0);
  const [draggedItems, setDraggedItems] = useState<{[key: string]: string}>({});

  const handleBack = () => {
    setCurrentScreen('icsa');
  };

  const handleFlagClick = (element: HTMLElement) => {
    if (!element.dataset.hit) {
      element.dataset.hit = '1';
      element.style.background = 'rgba(248,113,113,.25)';
      element.style.borderRadius = '6px';
      setFlagsFound(prev => prev + 1);
      
      if (flagsFound + 1 >= 3) {
        toast.success('Excellent! You spotted all red flags.');
      }
    }
  };

  const handleEmailFlagClick = (element: HTMLElement) => {
    if (!element.dataset.hit) {
      element.dataset.hit = '1';
      element.style.background = 'rgba(248,113,113,.3)';
      element.style.padding = '2px 4px';
      element.style.borderRadius = '4px';
      setEmailFlagsFound(prev => prev + 1);
      
      if (emailFlagsFound + 1 >= 4) {
        toast.success('Great! You spotted all the red flags in this phishing email.');
      }
    }
  };

  const completeLesson = (badgeId: string, xpAmount: number) => {
    toast.success(`🏆 Badge earned: ${badgeId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`);
    addXP(xpAmount);
    unlockBadge(badgeId);
    setCurrentScreen('icsa');
  };

  const renderSpotRedFlags = () => (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>← Back</button>
        <div className="chip">Interactive Lesson</div>
      </div>
      
      <div className="card">
        <h2 style={{ margin: '0 0 8px' }}>Spot the Red Flags</h2>
        <p className="subtitle">Tap the suspicious parts of the link below:</p>
        
        <div className="card" style={{ marginTop: '10px' }}>
          <p 
            className="url" 
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.dataset.flag) {
                handleFlagClick(target);
              }
            }}
            dangerouslySetInnerHTML={{
              __html: 'http://paypa<span data-flag="true" class="bad">1</span>-log<span data-flag="true" class="bad">in</span>.support-secure.<span data-flag="true" class="bad">ru</span>'
            }}
          />
        </div>
        <p className="subtitle" style={{ marginTop: '8px' }}>
          Flags found: <strong>{flagsFound}</strong>/3
        </p>
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
          disabled={flagsFound < 3}
          onClick={() => completeLesson('phishing-hunter', 15)}
        >
          Continue
        </button>
      </div>
    </>
  );

  const renderEmailTrainer = () => (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>← Back</button>
        <div className="chip">Email Trainer</div>
      </div>
      
      <div className="card">
        <h2 style={{ margin: '0 0 8px' }}>Phishing Email Training</h2>
        <p className="subtitle">Can you spot the fake email?</p>
        
        <div className="card" style={{ marginTop: '12px', background: 'rgba(255,255,255,0.95)', color: '#1a1a1a', fontSize: '13px' }}>
          <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '8px' }}>
            <strong>From:</strong> security@<span 
              data-email-flag="true" 
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={(e) => handleEmailFlagClick(e.target as HTMLElement)}
            >amaz0n</span>-verification.com<br />
            <strong>To:</strong> you@email.com<br />
            <strong>Subject:</strong> URGENT: Verify Your Account Now!
          </div>
          
          <p>Dear Valued Customer,</p>
          <p>Your account has been temporarily <span 
            data-email-flag="true" 
            style={{ color: 'red', cursor: 'pointer' }}
            onClick={(e) => handleEmailFlagClick(e.target as HTMLElement)}
          >suspended</span> due to unusual activity. You must verify your identity within <span 
            data-email-flag="true" 
            style={{ color: 'red', cursor: 'pointer' }}
            onClick={(e) => handleEmailFlagClick(e.target as HTMLElement)}
          >24 hours</span> or lose access permanently.</p>
          <p><strong>Click here to verify immediately:</strong><br />
          <a 
            href="#" 
            style={{ color: 'blue' }} 
            data-email-flag="true"
            onClick={(e) => handleEmailFlagClick(e.target as HTMLElement)}
          >http://amaz0n-secure-login.<span style={{ color: 'red' }}>tk</span></a></p>
          <p>Thank you,<br />Amazon Security Team</p>
        </div>
        
        <p className="subtitle">
          Click on suspicious elements. Found: <strong>{emailFlagsFound}</strong>/4
        </p>
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
          disabled={emailFlagsFound < 4}
          onClick={() => completeLesson('email-detective', 20)}
        >
          Submit
        </button>
      </div>
    </>
  );

  const renderBiometricDemo = () => (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>← Back</button>
        <div className="chip">Biometric Lab</div>
      </div>
      
      <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
        <h2 style={{ margin: '0 0 8px' }}>Biometric Spoofing Demo</h2>
        <p className="subtitle">Learn how biometrics can be compromised</p>
        
        <div 
          className="fingerprint-scanner"
          style={{
            width: '120px',
            height: '120px',
            border: '3px solid var(--accent)',
            borderRadius: '50%',
            margin: '20px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: biometricStep > 0 ? 'pulse-cyber 2s infinite' : 'none'
          }}
          onClick={() => {
            if (biometricStep === 0) {
              setBiometricStep(1);
              setTimeout(() => setBiometricStep(2), 2000);
              setTimeout(() => setBiometricStep(3), 4000);
              setTimeout(() => {
                completeLesson('biometric-expert', 18);
              }, 6000);
            }
          }}
        >
          👆
        </div>
        
        <p className="subtitle">
          {biometricStep === 0 ? 'Touch the scanner to begin' :
           biometricStep === 1 ? 'Scanning fingerprint...' :
           biometricStep === 2 ? '✅ Fingerprint recognized!' :
           'How Attackers Spoof Biometrics:'}
        </p>
        
        {biometricStep >= 3 && (
          <div style={{ marginTop: '15px' }}>
            <div className={`step ${biometricStep >= 3 ? 'active' : ''}`} style={{ 
              background: 'var(--card)', 
              border: '1px solid rgba(255,255,255,.08)', 
              borderRadius: '12px', 
              padding: '12px', 
              marginBottom: '10px',
              opacity: biometricStep >= 3 ? 1 : 0.5,
              borderColor: biometricStep >= 3 ? 'var(--accent)' : 'rgba(255,255,255,.08)'
            }}>
              <strong>1. Data Collection</strong>
              <p className="subtitle">Attackers gather biometric data from photos, surfaces, or breached databases.</p>
            </div>
            
            <div className={`step ${biometricStep >= 4 ? 'active' : ''}`} style={{ 
              background: 'var(--card)', 
              border: '1px solid rgba(255,255,255,.08)', 
              borderRadius: '12px', 
              padding: '12px', 
              marginBottom: '10px',
              opacity: biometricStep >= 4 ? 1 : 0.5,
              borderColor: biometricStep >= 4 ? 'var(--accent)' : 'rgba(255,255,255,.08)'
            }}>
              <strong>2. Recreation</strong>
              <p className="subtitle">They create fake fingerprints using gelatin, silicone, or 3D printing.</p>
            </div>
            
            <div className={`step ${biometricStep >= 5 ? 'active' : ''}`} style={{ 
              background: 'var(--card)', 
              border: '1px solid rgba(255,255,255,.08)', 
              borderRadius: '12px', 
              padding: '12px', 
              marginBottom: '10px',
              opacity: biometricStep >= 5 ? 1 : 0.5,
              borderColor: biometricStep >= 5 ? 'var(--accent)' : 'rgba(255,255,255,.08)'
            }}>
              <strong>3. Bypass Attempt</strong>
              <p className="subtitle">The fake biometric is used to fool sensors and gain unauthorized access.</p>
            </div>
          </div>
        )}
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
          onClick={() => {
            setBiometricStep(0);
            setCurrentScreen('icsa');
          }}
        >
          Try Again
        </button>
        <button className="cta secondary" onClick={handleBack}>
          Back to Hub
        </button>
      </div>
    </>
  );

  const renderTwoFADemo = () => (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>← Back</button>
        <div className="chip">2FA Demo</div>
      </div>
      
      <div className="card">
        <h2 style={{ margin: '0 0 8px' }}>Sign in</h2>
        <div className="col">
          <input placeholder="email" type="email" />
          <input placeholder="password" type="password" />
          <button 
            className="cta" 
            onClick={() => {
              setTwofaStep(1);
              toast.success('📱 Mock: 2FA code sent to your device');
            }}
          >
            Continue
          </button>
        </div>
      </div>
      
      {twofaStep >= 1 && (
        <div className="card" style={{ marginTop: '12px' }}>
          <h3 style={{ margin: '0 0 6px' }}>Enter 2FA Code</h3>
          <p className="subtitle">We sent a 6‑digit code to your device (mock).</p>
          <div className="row">
            <input 
              maxLength={6} 
              placeholder="123456" 
              style={{ flex: 1 }}
              onChange={(e) => {
                if (e.target.value.length >= 4) {
                  setTwofaStep(2);
                  toast.success('✅ Successfully signed in!');
                  addXP(10);
                }
              }}
            />
            <button 
              className="cta" 
              style={{ minWidth: '120px' }}
              onClick={() => setTwofaStep(2)}
            >
              Verify
            </button>
          </div>
        </div>
      )}
      
      {twofaStep >= 2 && (
        <div className="card" style={{ marginTop: '12px' }}>
          <h3 style={{ margin: '0 0 6px' }}>How spoofing tricks you</h3>
          <p className="subtitle">
            Attackers might hijack your session after you enter a real code on a fake page. 
            <a 
              href="#" 
              className="inline" 
              onClick={(e) => {
                e.preventDefault();
                toast('Tip: Always check the domain before entering codes.');
              }}
            > Learn more</a>
          </p>
          <button 
            className="cta" 
            onClick={() => completeLesson('2fa-advocate', 10)}
            style={{ marginTop: '12px' }}
          >
            Complete Demo
          </button>
        </div>
      )}
    </>
  );

  const renderFootprintDemo = () => (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>← Back</button>
        <div className="chip">Footprint Detective</div>
      </div>
      
      <div className="card">
        <h2 style={{ margin: '0 0 8px' }}>What Should You Share?</h2>
        <p className="subtitle">Drag items to "Safe to Share" or "Keep Private"</p>
      </div>
      
      <div className="col" style={{ gap: '12px', marginTop: '12px' }}>
        <div className="card" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'var(--ok)' }}>
          <strong style={{ color: 'var(--ok)' }}>✅ Safe to Share</strong>
          <div 
            id="safeZone" 
            style={{ 
              minHeight: '60px', 
              marginTop: '8px', 
              padding: '8px', 
              border: '2px dashed rgba(34,197,94,0.3)', 
              borderRadius: '8px' 
            }}
          />
        </div>
        
        <div className="card" style={{ background: 'rgba(248,113,113,0.1)', borderColor: 'var(--warn)' }}>
          <strong style={{ color: 'var(--warn)' }}>🔒 Keep Private</strong>
          <div 
            id="privateZone" 
            style={{ 
              minHeight: '60px', 
              marginTop: '8px', 
              padding: '8px', 
              border: '2px dashed rgba(248,113,113,0.3)', 
              borderRadius: '8px' 
            }}
          />
        </div>
        
        <div className="card">
          <strong>Items to Sort:</strong>
          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { text: 'Your favorite hobby', safe: true },
              { text: 'Home address', safe: false },
              { text: 'School name', safe: true },
              { text: 'Full birth date', safe: false },
              { text: 'Phone number', safe: false },
              { text: 'Favorite book', safe: true }
            ].map((item, index) => (
              <span 
                key={index}
                className="chip" 
                draggable="true"
                data-safe={item.safe}
                style={{ cursor: 'grab' }}
              >
                {item.text}
              </span>
            ))}
          </div>
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
          onClick={() => {
            toast.success('🏆 Perfect! Badge earned: Privacy Guardian');
            addXP(25);
            unlockBadge('privacy-guardian');
            setCurrentScreen('icsa');
          }}
        >
          Check Answers
        </button>
        <button className="cta secondary" onClick={handleBack}>
          Back to Hub
        </button>
      </div>
    </>
  );

  const renderArabicDemo = () => (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>← Back</button>
        <div className="chip">Arabic Module</div>
      </div>
      
      <div className="card">
        <h2 style={{ margin: '0 0 8px', textAlign: 'right', direction: 'rtl' }}>
          تعلّم تمييز الرسائل الاحتيالية
        </h2>
        <p className="subtitle" style={{ textAlign: 'right', direction: 'rtl' }}>
          تعلم كيفية التعرف على رسائل التصيد الاحتيالي باللغة العربية
        </p>
        
        <div className="card" style={{ marginTop: '12px', textAlign: 'right', direction: 'rtl' }}>
          <p><strong>من:</strong> security@amaz0n-verification.com</p>
          <p><strong>إلى:</strong> you@email.com</p>
          <p><strong>الموضوع:</strong> عاجل: تحقق من حسابك الآن!</p>
          <hr style={{ margin: '12px 0', borderColor: 'rgba(255,255,255,.2)' }} />
          <p>عزيزي العميل،</p>
          <p>تم تعليق حسابك مؤقتاً بسبب نشاط غير عادي. يجب عليك التحقق من هويتك خلال 24 ساعة أو ستفقد الوصول نهائياً.</p>
          <p><strong>انقر هنا للتحقق فوراً:</strong><br />
          <a href="#" style={{ color: 'var(--accent-2)' }}>http://amaz0n-secure-login.tk</a></p>
          <p>شكراً لك،<br />فريق أمان أمازون</p>
        </div>
        
        <p className="subtitle" style={{ textAlign: 'right', direction: 'rtl' }}>
          هل يمكنك اكتشاف العناصر المشبوهة في هذه الرسالة؟
        </p>
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
          onClick={() => {
            toast('قريباً: محاكاة التصيّد!');
            setCurrentScreen('icsa');
          }}
        >
          ابدأ
        </button>
      </div>
    </>
  );

  const renderSocialDemo = () => (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>← Back</button>
        <div className="chip">Social Media Safety</div>
      </div>
      
      <div className="card">
        <h2 style={{ margin: '0 0 8px' }}>Social Media Privacy</h2>
        <p className="subtitle">Learn about safe sharing and privacy settings</p>
        
        <div className="card" style={{ marginTop: '12px' }}>
          <h4>Privacy Settings Checklist:</h4>
          <ul className="subtitle" style={{ margin: '8px 0', paddingLeft: '16px' }}>
            <li>Profile visibility: Friends only</li>
            <li>Location sharing: Disabled</li>
            <li>Photo tagging: Require approval</li>
            <li>Search engine indexing: Disabled</li>
          </ul>
        </div>
        
        <div className="card" style={{ marginTop: '12px' }}>
          <h4>Safe Sharing Guidelines:</h4>
          <ul className="subtitle" style={{ margin: '8px 0', paddingLeft: '16px' }}>
            <li>Never share personal addresses</li>
            <li>Avoid posting vacation plans</li>
            <li>Be cautious with location check-ins</li>
            <li>Review friend requests carefully</li>
          </ul>
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
          onClick={() => {
            toast('Coming soon: Social Media Safety!');
            setCurrentScreen('icsa');
          }}
        >
          Complete Module
        </button>
      </div>
    </>
  );

  switch (lessonType) {
    case 'lesson-spot':
      return renderSpotRedFlags();
    case 'email-trainer':
      return renderEmailTrainer();
    case 'biometric-demo':
      return renderBiometricDemo();
    case 'twofa-demo':
      return renderTwoFADemo();
    case 'footprint-demo':
      return renderFootprintDemo();
    case 'arabic-demo':
      return renderArabicDemo();
    case 'social-demo':
      return renderSocialDemo();
    default:
      return renderSpotRedFlags();
  }
}
