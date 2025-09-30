import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  updateEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Pet position interface
export interface PetPosition {
  x: number;
  y: number;
  screenSize: 'desktop' | 'mobile';
  lastUpdated: Date;
}

// User interface for Firestore
export interface FirestoreUser {
  uid: string;
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
  petPositions?: {
    desktop?: PetPosition;
    mobile?: PetPosition;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Authentication functions
export const authService = {
  // Email/Password Authentication
  async signUpWithEmail(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile
    await updateProfile(user, { displayName });
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Create user document in Firestore
    await this.createUserDocument(user, displayName);
    
    return user;
  },

  async signInWithEmail(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await this.updateLastActive(userCredential.user.uid);
    return userCredential.user;
  },

  // Check credentials without signing in (for 2FA flow)
  async verifyCredentials(email: string, password: string) {
    try {
      // Try to sign in temporarily
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data before signing out
      const userData = await this.getUserData(userCredential.user.uid);
      
      // Immediately sign out to prevent auto-redirect
      await this.signOut();
      
      // Wait a bit to ensure sign out is processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return { success: true, user: userCredential.user, userData };
    } catch (error) {
      return { success: false, error };
    }
  },

  async signOut() {
    await signOut(auth);
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  // Phone Authentication
  async sendPhoneVerification(phoneNumber: string) {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  },

  async verifyPhoneCode(confirmationResult: any, code: string) {
    const result = await confirmationResult.confirm(code);
    await this.updateLastActive(result.user.uid);
    return result.user;
  },

  // User Management
  async createUserDocument(user: User, displayName: string) {
    const userData: FirestoreUser = {
      uid: user.uid,
      email: user.email!,
      displayName,
      photoURL: user.photoURL || '',
      xp: 0,
      level: 1,
      streak: 1,
      badges: [],
      lastActive: new Date(),
      premium: false,
      twoFactorEnabled: false,
      phoneNumber: user.phoneNumber || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    return userData;
  },


  async updateUserData(uid: string, data: Partial<FirestoreUser>) {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  async updateLastActive(uid: string) {
    await updateDoc(doc(db, 'users', uid), {
      lastActive: serverTimestamp()
    });
  },

  async addXP(uid: string, amount: number) {
    const userData = await this.getUserData(uid);
    if (userData) {
      const newXP = userData.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      await this.updateUserData(uid, {
        xp: newXP,
        level: newLevel
      });
      
      return { xp: newXP, level: newLevel };
    }
    return null;
  },

  async updateStreak(uid: string) {
    const userData = await this.getUserData(uid);
    if (userData) {
      const today = new Date().toDateString();
      const lastActive = new Date(userData.lastActive).toDateString();
      
      let newStreak = userData.streak;
      if (today !== lastActive) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActive === yesterday.toDateString()) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }
      
      await this.updateUserData(uid, { 
        streak: newStreak,
        lastActive: new Date()
      });
      return newStreak;
    }
    return 1;
  },

  async unlockBadge(uid: string, badgeId: string) {
    const userData = await this.getUserData(uid);
    if (userData && !userData.badges.includes(badgeId)) {
      await this.updateUserData(uid, {
        badges: [...userData.badges, badgeId]
      });
    }
  },

  // Profile Management
  async updateProfile(uid: string, data: { displayName?: string; email?: string; phoneNumber?: string }) {
    const user = auth.currentUser;
    if (user) {
      if (data.displayName) {
        await updateProfile(user, { displayName: data.displayName });
      }
      if (data.email) {
        await updateEmail(user, data.email);
      }
    }
    
    await this.updateUserData(uid, data);
  },

  async updatePassword(newPassword: string) {
    const user = auth.currentUser;
    if (user) {
      await updatePassword(user, newPassword);
    }
  },

  async uploadProfilePicture(uid: string, file: File): Promise<string> {
    // Use local upload service instead of Firebase Storage
    const { profilePictureService } = await import('./profile-picture-service');
    const result = await profilePictureService.uploadProfilePicture(uid, file);
    
    if (!result.success || !result.url) {
      throw new Error(result.error || 'Failed to upload profile picture');
    }
    
    await this.updateUserData(uid, { photoURL: result.url });
    
    // Update Firebase Auth profile
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, { photoURL: result.url });
    }
    
    return result.url;
  },

  async deleteProfilePicture(uid: string) {
    // Use local delete service instead of Firebase Storage
    const { profilePictureService } = await import('./profile-picture-service');
    const result = await profilePictureService.deleteProfilePicture(uid);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete profile picture');
    }
    
    await this.updateUserData(uid, { photoURL: '' });
    
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, { photoURL: null });
    }
  },

  async toggleTwoFactor(uid: string, enabled: boolean) {
    await this.updateUserData(uid, { twoFactorEnabled: enabled });
  },

  async getUserData(uid: string) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  },

  // Challenge Progress Management
  async saveChallengeProgress(uid: string, challengeId: string, progressData: any) {
    try {
      const userRef = doc(db, 'users', uid);
      const challengeProgressRef = doc(userRef, 'challengeProgress', challengeId);
      
      const dataToSave = {
        ...progressData,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(challengeProgressRef, dataToSave, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Error saving challenge progress:', error);
      throw error;
    }
  },

  async getChallengeProgress(uid: string, challengeId: string) {
    try {
      const challengeProgressRef = doc(db, 'users', uid, 'challengeProgress', challengeId);
      const challengeProgressSnap = await getDoc(challengeProgressRef);
      
      if (challengeProgressSnap.exists()) {
        return challengeProgressSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting challenge progress:', error);
      throw error;
    }
  },

  async getAllChallengeProgress(uid: string) {
    try {
      const challengeProgressRef = collection(db, 'users', uid, 'challengeProgress');
      const challengeProgressSnap = await getDocs(challengeProgressRef);
      
      const progress: { [key: string]: any } = {};
      challengeProgressSnap.forEach((doc) => {
        progress[doc.id] = doc.data();
      });
      
      return progress;
    } catch (error) {
      console.error('Error getting all challenge progress:', error);
      throw error;
    }
  },

  async updateChallengeProgress(uid: string, challengeId: string, updates: any) {
    try {
      const challengeProgressRef = doc(db, 'users', uid, 'challengeProgress', challengeId);
      await updateDoc(challengeProgressRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      throw error;
    }
  },

  // Pet Position Management
  async savePetPosition(uid: string, position: { x: number; y: number }, screenSize: 'desktop' | 'mobile') {
    try {
      const userData = await this.getUserData(uid);
      if (!userData) {
        throw new Error('User not found');
      }

      const petPosition: PetPosition = {
        x: position.x,
        y: position.y,
        screenSize,
        lastUpdated: new Date()
      };

      const currentPositions = userData.petPositions || {};
      const updatedPositions = {
        ...currentPositions,
        [screenSize]: petPosition
      };

      await this.updateUserData(uid, {
        petPositions: updatedPositions
      });

      return true;
    } catch (error) {
      console.error('Error saving pet position:', error);
      throw error;
    }
  },

  async getPetPosition(uid: string, screenSize: 'desktop' | 'mobile'): Promise<{ x: number; y: number } | null> {
    try {
      const userData = await this.getUserData(uid);
      if (!userData || !userData.petPositions) {
        return null;
      }

      const position = userData.petPositions[screenSize];
      if (position) {
        return { x: position.x, y: position.y };
      }

      return null;
    } catch (error) {
      console.error('Error getting pet position:', error);
      return null;
    }
  },

  async getAllPetPositions(uid: string): Promise<{ desktop?: PetPosition; mobile?: PetPosition } | null> {
    try {
      const userData = await this.getUserData(uid);
      if (!userData || !userData.petPositions) {
        return null;
      }

      return userData.petPositions;
    } catch (error) {
      console.error('Error getting all pet positions:', error);
      return null;
    }
  },

};

export default app;
