'use client';

import { useAppStore } from '@/lib/store';
import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import ResultScreen from './screens/ResultScreen';
import ICSAHubScreen from './screens/ICSAHubScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MiniOnboardingScreen from './screens/MiniOnboardingScreen';
import StreakRestoreScreen from './screens/StreakRestoreScreen';
import EducationScreen from './screens/EducationScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import FootprintDemoScreen from './screens/FootprintDemoScreen';
import TextResultScreen from './screens/TextResultScreen';
import PhishingIntroScreen from './screens/PhishingIntroScreen';
import PhishingGameScreen from './screens/PhishingGameScreen';
import SecureCodingIntroScreen from './screens/SecureCodingIntroScreen';
import SecureCodingGameScreen from './screens/SecureCodingGameScreen';
import LeastPrivilegeIntroScreen from './screens/LeastPrivilegeIntroScreen';
import LeastPrivilegeGameScreen from './screens/LeastPrivilegeGameScreen';
import EncryptionIntroScreen from './screens/EncryptionIntroScreen';
import EncryptionGameScreen from './screens/EncryptionGameScreen';
import SecurityQuizIntroScreen from './screens/SecurityQuizIntroScreen';
import SecurityQuizGameScreen from './screens/SecurityQuizGameScreen';
import TwoFactorSetupScreen from './screens/TwoFactorSetupScreen';

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
        return <EncryptionIntroScreen />;
      case 'encryption-game':
        return <EncryptionGameScreen />;
      case 'security-quiz-intro':
        return <SecurityQuizIntroScreen />;
      case 'security-quiz-game':
        return <SecurityQuizGameScreen />;
      case 'welcome':
        return <WelcomeScreen />;
      case 'mini-onboarding':
        return <MiniOnboardingScreen />;
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'streak-restore':
        return <StreakRestoreScreen />;
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
      case 'two-factor-setup':
        return <TwoFactorSetupScreen />;
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
