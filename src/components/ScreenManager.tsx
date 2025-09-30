'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import ResultScreen from './screens/ResultScreen';
import ICSAHubScreen from './screens/ICSAHubScreen';
import PhishingIntroScreen from './screens/PhishingIntroScreen';
import PhishingGameScreen from './screens/PhishingGameScreen';
import SecureCodingIntroScreen from './screens/SecureCodingIntroScreen';
import SecureCodingGameScreen from './screens/SecureCodingGameScreen';
import LeastPrivilegeIntroScreen from './screens/LeastPrivilegeIntroScreen';
import LeastPrivilegeGameScreen from './screens/LeastPrivilegeGameScreen';
import EducationScreen from './screens/EducationScreen';
import OnboardingScreen from './screens/OnboardingScreen';

interface ScreenManagerProps {
  currentScreen: string;
}

export default function ScreenManager({ currentScreen }: ScreenManagerProps) {
  const [activeScreen, setActiveScreen] = useState('home');
  const [previousScreen, setPreviousScreen] = useState('home');

  useEffect(() => {
    console.log('ScreenManager: currentScreen changed to:', currentScreen);
    console.log('ScreenManager: activeScreen is:', activeScreen);
    if (currentScreen !== activeScreen) {
      setPreviousScreen(activeScreen);
      setActiveScreen(currentScreen);
      console.log('ScreenManager: Setting active screen to:', currentScreen);
    }
  }, [currentScreen, activeScreen]);

  const screens = [
    'home',
    'scan',
    'result-safe',
    'result-caution',
    'result-malicious',
    'icsa',
    'phishing-intro',
    'phishing-game',
    'secure-coding-intro',
    'secure-coding-game',
    'least-privilege-intro',
    'least-privilege-game',
    'encryption-intro',
    'security-quiz-intro',
    'lesson-spot',
    'lesson-url',
    'lesson-phishing',
    'lesson-privacy',
    'lesson-mobile',
    'lesson-financial',
    'footprint-demo',
    'biometric-demo',
    'email-trainer',
    'twofa-demo',
    'social-demo',
    'arabic-demo',
    'onboarding'
  ];

  const renderScreen = (screenId: string) => {
    switch (screenId) {
      case 'home':
        return <HomeScreen />;
      case 'scan':
        return <ScannerScreen />;
      case 'result-safe':
      case 'result-caution':
      case 'result-malicious':
        return <ResultScreen resultType={screenId} />;
      case 'icsa':
        return <ICSAHubScreen />;
      case 'phishing-intro':
        return <PhishingIntroScreen />;
      case 'phishing-game':
        return <PhishingGameScreen />;
      case 'secure-coding-intro':
        return <SecureCodingIntroScreen />;
      case 'secure-coding-game':
        return <SecureCodingGameScreen />;
      case 'least-privilege-intro':
        return <LeastPrivilegeIntroScreen />;
      case 'least-privilege-game':
        return <LeastPrivilegeGameScreen />;
      case 'encryption-intro':
        return <EducationScreen lessonType="encryption-intro" />;
      case 'security-quiz-intro':
        return <EducationScreen lessonType="security-quiz-intro" />;
      case 'lesson-spot':
      case 'lesson-url':
      case 'lesson-phishing':
      case 'lesson-privacy':
      case 'lesson-mobile':
      case 'lesson-financial':
        return <EducationScreen lessonType={screenId} />;
      case 'footprint-demo':
      case 'biometric-demo':
      case 'email-trainer':
      case 'twofa-demo':
      case 'social-demo':
      case 'arabic-demo':
        return <EducationScreen lessonType={screenId} />;
      case 'onboarding':
        return <OnboardingScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <>
      {screens.map((screenId) => {
        // Only render active screen and previous screen for smooth transitions
        const shouldRender = screenId === activeScreen || screenId === previousScreen;
        
        return (
          <div
            key={screenId}
            className={`screen ${screenId === activeScreen ? 'active' : ''}`}
            style={{ 
              display: shouldRender ? 'block' : 'none'
            }}
          >
            {shouldRender && renderScreen(screenId)}
          </div>
        );
      })}
    </>
  );
}
