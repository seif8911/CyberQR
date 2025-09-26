'use client';

import { useAppStore } from '@/lib/store';
import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import ResultScreen from './screens/ResultScreen';
import ICSAHubScreen from './screens/ICSAHubScreen';
import EducationScreen from './screens/EducationScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import FootprintDemoScreen from './screens/FootprintDemoScreen';
import TextResultScreen from './screens/TextResultScreen';

export default function SimpleScreenManager() {
  const { currentScreen } = useAppStore();

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'scan':
        return <ScannerScreen />;
      case 'result-safe':
      case 'result-caution':
      case 'result-malicious':
        return <ResultScreen resultType={currentScreen} />;
      case 'icsa':
        return <ICSAHubScreen />;
      case 'footprint-demo':
        return <FootprintDemoScreen />;
      case 'text-result':
        return <TextResultScreen />;
      case 'lesson-spot':
      case 'lesson-url':
      case 'lesson-phishing':
      case 'lesson-privacy':
      case 'lesson-mobile':
      case 'lesson-financial':
        return <EducationScreen lessonType={currentScreen} />;
      case 'biometric-demo':
      case 'email-trainer':
      case 'twofa-demo':
      case 'social-demo':
      case 'arabic-demo':
        return <EducationScreen lessonType={currentScreen} />;
      case 'onboarding':
        return <OnboardingScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="screen active">
      {renderCurrentScreen()}
    </div>
  );
}
