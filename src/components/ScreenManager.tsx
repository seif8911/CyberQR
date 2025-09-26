'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import ResultScreen from './screens/ResultScreen';
import ICSAHubScreen from './screens/ICSAHubScreen';
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
