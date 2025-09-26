'use client';

import { useAppStore } from '@/lib/store';

export default function ICSAHubScreen() {
  const { setCurrentScreen } = useAppStore();

  const modules = [
    {
      id: 'footprint-demo',
      title: 'Digital Footprint Detective',
      description: 'Learn what info to share online and what to keep private.',
      icon: '🕵️'
    },
    {
      id: 'biometric-demo',
      title: 'Biometric Spoofing Lab',
      description: 'See how fingerprints & face ID can be tricked.',
      icon: '👆'
    },
    {
      id: 'email-trainer',
      title: 'Phishing Email Trainer',
      description: 'Practice spotting fake emails before they fool you.',
      icon: '📧'
    },
    {
      id: 'arabic-demo',
      title: 'Arabic Phishing Sim',
      description: 'تعلّم تمييز الرسائل الاحتيالية',
      icon: '🌍'
    },
    {
      id: 'social-demo',
      title: 'Social Media Safety',
      description: 'Safe sharing, privacy settings, and avoiding scams.',
      icon: '📱'
    },
    {
      id: 'twofa-demo',
      title: '2FA & Authentication',
      description: 'Try two-factor auth and learn about security.',
      icon: '🔐'
    }
  ];

  const handleModuleClick = (moduleId: string) => {
    setCurrentScreen(moduleId);
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  return (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          ← Back
        </button>
        <div className="chip">ICSA Hub</div>
      </div>
      
      <h2 className="title" style={{ marginTop: 0 }}>
        Interactive Cybersecurity Awareness
      </h2>
      <p className="subtitle">
        Pick a mini‑module. Everything is gamified and kid‑friendly.
      </p>
      
      <div className="grid" style={{ marginTop: '10px' }}>
        {modules.map((module) => (
          <div key={module.id} className="module">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>{module.icon}</span>
              <h4>{module.title}</h4>
            </div>
            <p>{module.description}</p>
            <button 
              className="cta" 
              onClick={() => handleModuleClick(module.id)}
              style={{ marginTop: 'auto' }}
            >
              {module.id === 'arabic-demo' ? 'ابدأ' : 
               module.id === 'social-demo' ? 'Coming Soon' : 'Play'}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
