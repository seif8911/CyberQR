export interface User {
  id: string;
  email: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  lastActive: Date;
  premium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScanResult {
  id: string;
  url: string;
  riskLevel: 'safe' | 'caution' | 'malicious';
  riskScore: number;
  timestamp: Date;
  threats: string[];
  recommendations: string[];
  explanation: string;
  userId?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'scanner' | 'education' | 'security' | 'streak' | 'special';
  unlocked: boolean;
  unlockedAt?: Date;
  requirement?: string;
  xpReward?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'interactive' | 'video' | 'quiz' | 'demo';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  xpReward: number;
  badgeReward?: string;
  completed: boolean;
  completedAt?: Date;
  progress: number; // 0-100
}

export interface SecurityAnalysisResult {
  riskLevel: 'safe' | 'caution' | 'malicious';
  riskScore: number;
  threats: string[];
  recommendations: string[];
  explanation: string;
  confidence: number;
  analysisTime: number;
}

export interface PetMessage {
  id: string;
  message: string;
  type: 'tip' | 'encouragement' | 'warning' | 'celebration';
  timestamp: Date;
  context?: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'scan' | 'lesson' | 'streak' | 'badge';
  xpReward: number;
  completed: boolean;
  date: Date;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  language: 'en' | 'ar';
  privacyMode: boolean;
}

export interface AnalyticsEvent {
  id: string;
  type: 'scan' | 'lesson' | 'badge' | 'error' | 'performance';
  data: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  component?: string;
  userId?: string;
  timestamp: Date;
  resolved: boolean;
}

export type ScreenType = 
  | 'home'
  | 'scan'
  | 'result-safe'
  | 'result-caution'
  | 'result-malicious'
  | 'icsa'
  | 'phishing-intro'
  | 'phishing-game'
  | 'secure-coding-intro'
  | 'secure-coding-game'
  | 'least-privilege-intro'
  | 'least-privilege-game'
  | 'encryption-intro'
  | 'encryption-game'
  | 'security-quiz-intro'
  | 'security-quiz-game'
  | 'welcome'
  | 'mini-onboarding'
  | 'login'
  | 'register'
  | 'profile'
  | 'streak-restore'
  | 'text-result'
  | 'lesson-spot'
  | 'lesson-url'
  | 'lesson-phishing'
  | 'lesson-privacy'
  | 'lesson-mobile'
  | 'lesson-financial'
  | 'footprint-demo'
  | 'biometric-demo'
  | 'email-trainer'
  | 'twofa-demo'
  | 'social-demo'
  | 'arabic-demo'
  | 'onboarding';

export type RiskLevel = 'safe' | 'caution' | 'malicious';

export type BadgeCategory = 'scanner' | 'education' | 'security' | 'streak' | 'special';

export type LessonType = 'interactive' | 'video' | 'quiz' | 'demo';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
