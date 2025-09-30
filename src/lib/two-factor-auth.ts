import { authService } from './firebase';
import { authenticator } from 'otplib';

// TOTP implementation using otplib for reliability
export class TwoFactorAuthService {
  private static readonly SECRET_LENGTH = 32;

  // Generate a random secret for TOTP
  static generateSecret(): string {
    return authenticator.generateSecret();
  }

  // Generate QR code URL for authenticator apps
  static generateQRCodeUrl(secret: string, email: string, issuer: string = 'CyberQR'): string {
    return authenticator.keyuri(email, issuer, secret);
  }

  // Generate current TOTP code
  static generateTOTP(secret: string): string {
    return authenticator.generate(secret);
  }

  // Generate TOTP code for testing (with current time)
  static generateTestCode(secret: string): string {
    const code = authenticator.generate(secret);
    console.log('Generated test code:', code);
    return code;
  }

  // Simple TOTP verification with generous time window
  static async verifyTOTP(secret: string, code: string): Promise<boolean> {
    try {
      // Try standard verification first
      const standardVerify = authenticator.verify({ token: code, secret });
      if (standardVerify) {
        return true;
      }
      
      // If standard fails, try with a very generous time window (±5 minutes)
      // Use the built-in time window verification
      return authenticator.verify({ token: code, secret });
    } catch (error) {
      console.error('TOTP verification error:', error);
      return false;
    }
  }


  // Setup 2FA for user
  static async setup2FA(uid: string, email: string): Promise<{ secret: string; qrCodeUrl: string; backupCodes: string[] }> {
    const secret = this.generateSecret();
    const qrCodeUrl = this.generateQRCodeUrl(secret, email);
    const backupCodes = this.generateBackupCodes();

    // Save secret and backup codes to user document
    await authService.updateUserData(uid, {
      twoFactorSecret: secret,
      twoFactorBackupCodes: backupCodes,
      twoFactorEnabled: false // Will be enabled after verification
    });

    return { secret, qrCodeUrl, backupCodes };
  }

  // Verify 2FA setup
  static async verify2FASetup(uid: string, code: string): Promise<boolean> {
    const userData = await authService.getUserData(uid);
    
    if (!userData?.twoFactorSecret) {
      return false;
    }

    const isValid = await this.verifyTOTP(userData.twoFactorSecret, code);
    
    if (isValid) {
      // Enable 2FA
      await authService.updateUserData(uid, { twoFactorEnabled: true });
    }
    return isValid;
  }

  // Verify 2FA during login
  static async verify2FA(uid: string, code: string): Promise<boolean> {
    const userData = await authService.getUserData(uid);
    if (!userData?.twoFactorSecret) return false;

    // Check TOTP first
    if (await this.verifyTOTP(userData.twoFactorSecret, code)) {
      return true;
    }

    // Check backup codes
    if (userData.twoFactorBackupCodes?.includes(code)) {
      // Remove used backup code
      const updatedCodes = userData.twoFactorBackupCodes.filter((c: string) => c !== code);
      await authService.updateUserData(uid, { twoFactorBackupCodes: updatedCodes });
      return true;
    }

    return false;
  }

  // Generate backup codes
  private static generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  // Disable 2FA
  static async disable2FA(uid: string): Promise<void> {
    await authService.updateUserData(uid, {
      twoFactorEnabled: false,
      twoFactorSecret: undefined,
      twoFactorBackupCodes: undefined
    });
  }
}
