import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, authService, FirestoreUser } from './firebase';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  lastActive: Date;
  premium: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
  phoneNumber?: string;
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
  firebaseUser: FirebaseUser | null;
  scanHistory: ScanResult[];
  badges: Badge[];
  currentScreen: string;
  petVisible: boolean;
  petMessage: string;
  extractedText: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  is2FAVerificationInProgress: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  addScanResult: (result: ScanResult) => void;
  addXP: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
  refreshUserData: () => Promise<void>;
  setCurrentScreen: (screen: string) => void;
  showPet: (message: string) => void;
  hidePet: () => void;
  updateStreak: () => void;
  checkStreakLoss: () => void;
  setExtractedText: (text: string) => void;
  initializeAuth: () => void;
  signOut: () => Promise<void>;
  set2FAVerificationInProgress: (inProgress: boolean) => void;
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

const defaultUser: User = {
  id: 'default-user',
  email: 'user@cyberqr.app',
  displayName: 'CyberQR User',
  photoURL: '',
  xp: 25,
  level: 1,
  streak: 1,
  badges: [],
  lastActive: new Date(),
  premium: false,
  twoFactorEnabled: false,
  phoneNumber: '',
  createdAt: new Date(),
  updatedAt: new Date()
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      firebaseUser: null,
      scanHistory: [],
      badges: initialBadges,
      currentScreen: 'mini-onboarding',
      petVisible: false,
      petMessage: '',
      extractedText: '',
      isLoading: true,
      isAuthenticated: false,
      is2FAVerificationInProgress: false,
      
      setUser: (user) => set({ user }),
      setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
      
      addScanResult: (result) => set((state) => ({
        scanHistory: [result, ...state.scanHistory.slice(0, 49)] // Keep last 50 scans
      })),
      
      addXP: async (amount) => {
        const state = get();
        if (!state.firebaseUser) return;
        
        try {
          const result = await authService.addXP(state.firebaseUser.uid, amount);
          if (result) {
            set((state) => ({
              user: state.user ? {
                ...state.user,
                xp: result.xp,
                level: result.level
              } : null
            }));
          }
        } catch (error) {
          console.error('Error adding XP:', error);
        }
      },
      
      unlockBadge: async (badgeId) => {
        const state = get();
        if (!state.firebaseUser) return;
        
        try {
          await authService.unlockBadge(state.firebaseUser.uid, badgeId);
          set((state) => ({
            badges: state.badges.map(badge => 
              badge.id === badgeId 
                ? { ...badge, unlocked: true, unlockedAt: new Date() }
                : badge
            )
          }));
        } catch (error) {
          console.error('Error unlocking badge:', error);
        }
      },

      refreshUserData: async () => {
        const state = get();
        if (!state.firebaseUser) return;
        
        try {
          const userData = await authService.getUserData(state.firebaseUser.uid);
          if (userData) {
            set((state) => ({
              user: {
                id: userData.uid,
                email: userData.email,
                displayName: userData.displayName,
                photoURL: userData.photoURL,
                xp: userData.xp,
                level: userData.level,
                streak: userData.streak,
                badges: userData.badges,
                lastActive: userData.lastActive,
                premium: userData.premium,
                twoFactorEnabled: userData.twoFactorEnabled,
                phoneNumber: userData.phoneNumber,
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt
              }
            }));
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      },
      
      setCurrentScreen: (screen) => {
        console.log('Store: Setting current screen to:', screen);
        set({ currentScreen: screen });
      },
      
      showPet: (message) => set({ 
        petVisible: true, 
        petMessage: message 
      }),
      
      hidePet: () => set({ petVisible: false }),
      
      updateStreak: async () => {
        const state = get();
        if (!state.firebaseUser) return;
        
        try {
          const newStreak = await authService.updateStreak(state.firebaseUser.uid);
          set((state) => ({
            user: state.user ? {
              ...state.user,
              streak: newStreak,
              lastActive: new Date()
            } : null
          }));
        } catch (error) {
          console.error('Error updating streak:', error);
        }
      },

      checkStreakLoss: () => {
        const { user, firebaseUser } = get();
        if (user && firebaseUser) {
          const today = new Date().toDateString();
          const lastActive = user.lastActive ? new Date(user.lastActive).toDateString() : null;
          
          // Check if streak should be lost (more than 1 day since last activity)
          if (lastActive && user.streak > 0) {
            const daysSinceLastActive = Math.floor(
              (new Date().getTime() - new Date(user.lastActive).getTime()) / (24 * 60 * 60 * 1000)
            );
            
            if (daysSinceLastActive > 1) {
              // Streak lost - redirect to restoration screen
              set({ 
                user: { 
                  ...user, 
                  streak: 0, 
                  lastActive: new Date() 
                },
                currentScreen: 'streak-restore'
              });
            }
          }
        }
      },
      
      setExtractedText: (text) => set({ extractedText: text }),
      
      initializeAuth: () => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const userData = await authService.getUserData(firebaseUser.uid);
              if (userData) {
                // Update streak when user logs in
                const updatedStreak = await authService.updateStreak(firebaseUser.uid);
                
                set({ 
                  firebaseUser, 
                  user: {
                    id: userData.uid,
                    email: userData.email,
                    displayName: userData.displayName,
                    photoURL: userData.photoURL,
                    xp: userData.xp,
                    level: userData.level,
                    streak: updatedStreak,
                    badges: userData.badges,
                    lastActive: userData.lastActive,
                    premium: userData.premium,
                    twoFactorEnabled: userData.twoFactorEnabled,
                    phoneNumber: userData.phoneNumber,
                    createdAt: userData.createdAt,
                    updatedAt: userData.updatedAt
                  }, 
                  isAuthenticated: true, 
                  isLoading: false 
                });
              } else {
                // Create user document if it doesn't exist
                await authService.createUserDocument(firebaseUser, firebaseUser.displayName || 'User');
                const newUserData = await authService.getUserData(firebaseUser.uid);
                // Update streak for new users too
                const updatedStreak = await authService.updateStreak(firebaseUser.uid);
                
                set({ 
                  firebaseUser, 
                  user: {
                    id: newUserData.uid,
                    email: newUserData.email,
                    displayName: newUserData.displayName,
                    photoURL: newUserData.photoURL,
                    xp: newUserData.xp,
                    level: newUserData.level,
                    streak: updatedStreak,
                    badges: newUserData.badges,
                    lastActive: newUserData.lastActive,
                    premium: newUserData.premium,
                    twoFactorEnabled: newUserData.twoFactorEnabled,
                    phoneNumber: newUserData.phoneNumber,
                    createdAt: newUserData.createdAt,
                    updatedAt: newUserData.updatedAt
                  }, 
                  isAuthenticated: true, 
                  isLoading: false,
                  currentScreen: 'onboarding' // Redirect new users to onboarding
                });
              }
            } catch (error) {
              console.error('Error loading user data:', error);
              set({ isLoading: false });
            }
          } else {
            set({ 
              firebaseUser: null, 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          }
        });
      },
      
      signOut: async () => {
        try {
          await authService.signOut();
          set({ 
            firebaseUser: null, 
            user: null, 
            isAuthenticated: false,
            is2FAVerificationInProgress: false,
            currentScreen: 'home'
          });
        } catch (error) {
          console.error('Error signing out:', error);
        }
      },

      set2FAVerificationInProgress: (inProgress) => set({ is2FAVerificationInProgress: inProgress }),
    }),
    {
      name: 'cyberqr-storage',
      partialize: (state) => ({
        user: state.user,
        badges: state.badges,
        scanHistory: state.scanHistory.slice(0, 10) // Only persist last 10 scans
      })
    }
  )
);
