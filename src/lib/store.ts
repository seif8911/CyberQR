import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

export interface ScanResult {
  id: string;
  url: string;
  riskLevel: 'safe' | 'caution' | 'malicious';
  riskScore: number;
  timestamp: Date;
  threats: string[];
  recommendations: string[];
  explanation?: string;
  results?: any[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'scanner' | 'education' | 'security' | 'streak' | 'special';
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AppState {
  user: User | null;
  scanHistory: ScanResult[];
  badges: Badge[];
  currentScreen: string;
  petVisible: boolean;
  petMessage: string;
  extractedText: string;
  
  // Actions
  setUser: (user: User | null) => void;
  addScanResult: (result: ScanResult) => void;
  addXP: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
  setCurrentScreen: (screen: string) => void;
  showPet: (message: string) => void;
  hidePet: () => void;
  updateStreak: () => void;
  setExtractedText: (text: string) => void;
}

const initialBadges: Badge[] = [
  { id: 'qr-rookie', name: 'QR Rookie', description: 'Complete your first QR scan', icon: '📱', category: 'scanner', unlocked: false },
  { id: 'scanner-pro', name: 'Scanner Pro', description: 'Complete 10 QR scans', icon: '🔍', category: 'scanner', unlocked: false },
  { id: 'threat-hunter', name: 'Threat Hunter', description: 'Detect 5 malicious links', icon: '🛡️', category: 'scanner', unlocked: false },
  { id: 'phishing-hunter', name: 'Phishing Hunter', description: 'Complete phishing detection lesson', icon: '🎣', category: 'education', unlocked: false },
  { id: 'email-detective', name: 'Email Detective', description: 'Spot all red flags in email trainer', icon: '📧', category: 'education', unlocked: false },
  { id: 'privacy-guardian', name: 'Privacy Guardian', description: 'Master digital footprint lesson', icon: '🔒', category: 'education', unlocked: false },
  { id: 'biometric-expert', name: 'Biometric Expert', description: 'Complete biometric spoofing demo', icon: '👆', category: 'security', unlocked: false },
  { id: '2fa-advocate', name: '2FA Advocate', description: 'Complete 2FA demonstration', icon: '🔐', category: 'security', unlocked: false },
  { id: 'mobile-guardian', name: 'Mobile Guardian', description: 'Complete mobile security module', icon: '📱', category: 'security', unlocked: false },
  { id: '7-day-warrior', name: '7-Day Warrior', description: 'Maintain 7-day streak', icon: '🔥', category: 'streak', unlocked: false },
  { id: 'monthly-master', name: 'Monthly Master', description: 'Maintain 30-day streak', icon: '👑', category: 'streak', unlocked: false },
  { id: 'annual-champion', name: 'Annual Champion', description: 'Maintain 365-day streak', icon: '🏆', category: 'streak', unlocked: false },
];

export const useAppStore = create<AppState>((set, get) => ({
      user: null,
      scanHistory: [],
      badges: initialBadges,
      currentScreen: 'home',
      petVisible: false,
      petMessage: '',
      extractedText: '',
      
      setUser: (user) => set({ user }),
      
      addScanResult: (result) => set((state) => ({
        scanHistory: [result, ...state.scanHistory.slice(0, 49)] // Keep last 50 scans
      })),
      
      addXP: (amount) => set((state) => {
        if (!state.user) return state;
        
        const newXP = state.user.xp + amount;
        const newLevel = Math.floor(newXP / 100) + 1;
        
        return {
          user: {
            ...state.user,
            xp: newXP,
            level: newLevel
          }
        };
      }),
      
      unlockBadge: (badgeId) => set((state) => ({
        badges: state.badges.map(badge => 
          badge.id === badgeId 
            ? { ...badge, unlocked: true, unlockedAt: new Date() }
            : badge
        )
      })),
      
      setCurrentScreen: (screen) => {
        console.log('Store: Setting current screen to:', screen);
        set({ currentScreen: screen });
      },
      
      showPet: (message) => set({ 
        petVisible: true, 
        petMessage: message 
      }),
      
      hidePet: () => set({ petVisible: false }),
      
      updateStreak: () => set((state) => {
        if (!state.user) return state;
        
        const today = new Date().toDateString();
        const lastActive = new Date(state.user.lastActive).toDateString();
        
        let newStreak = state.user.streak;
        if (today !== lastActive) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastActive === yesterday.toDateString()) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        }
        
        return {
          user: {
            ...state.user,
            streak: newStreak,
            lastActive: new Date()
          }
        };
      }),
      
      setExtractedText: (text) => set({ extractedText: text }),
    }));
