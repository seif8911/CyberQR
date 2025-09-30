'use client';

import { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { authService } from '@/lib/firebase';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Camera, 
  Shield, 
  Trophy, 
  Target, 
  Flame, 
  Settings, 
  ArrowLeft,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileScreen() {
  const { user, firebaseUser, signOut, setCurrentScreen, initializeAuth } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setProfileData({
      displayName: user?.displayName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      displayName: user?.displayName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || ''
    });
  };

  const handleSave = async () => {
    if (!firebaseUser) return;

    setIsLoading(true);
    try {
      await authService.updateProfile(firebaseUser.uid, profileData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await authService.updatePassword(passwordData.newPassword);
      toast.success('Password updated successfully!');
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !firebaseUser) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsLoading(true);
    try {
      await authService.uploadProfilePicture(firebaseUser.uid, file);
      // Refresh user data to update the UI
      initializeAuth();
      toast.success('Profile picture updated!');
    } catch (error: any) {
      console.error('Profile picture upload error:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!firebaseUser) return;

    setIsLoading(true);
    try {
      await authService.deleteProfilePicture(firebaseUser.uid);
      // Refresh user data to update the UI
      initializeAuth();
      toast.success('Profile picture removed');
    } catch (error: any) {
      console.error('Profile picture deletion error:', error);
      toast.error('Failed to remove profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    if (!firebaseUser) return;

    if (user?.twoFactorEnabled) {
      // Disable 2FA
      setIsLoading(true);
      try {
        await authService.toggleTwoFactor(firebaseUser.uid, false);
        toast.success('Two-factor authentication disabled');
        await initializeAuth();
      } catch (error: any) {
        console.error('2FA disable error:', error);
        toast.error('Failed to disable two-factor authentication');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Enable 2FA - redirect to setup
      setCurrentScreen('two-factor-setup');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const xpPercentage = user ? (user.xp % 100) : 0;
  const nextLevelXP = user ? (100 - (user.xp % 100)) : 100;

  return (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="chip">Profile</div>
      </div>

      {/* Profile Header */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '18px' }}>
        <div className="row" style={{ justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ position: 'relative' }}>
            <div 
              className="logo" 
              style={{ 
                width: '80px', 
                height: '80px', 
                fontSize: '32px',
                background: user?.photoURL 
                  ? `url(${user.photoURL})` 
                  : 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!user?.photoURL && <User className="w-10 h-10" />}
            </div>
            <button
              className="ghost"
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--accent)',
                border: '2px solid var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Edit3 className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        <h1 className="title" style={{ fontSize: '24px', margin: '0 0 8px' }}>
          {user?.displayName || 'User'}
        </h1>
        <p className="subtitle">
          Level {user?.level ?? 1} • {user?.xp ?? 0} XP
        </p>
        
        {user?.photoURL && (
          <button
            className="ghost"
            onClick={handleDeleteProfilePicture}
            style={{ fontSize: '12px', color: 'var(--warn)', marginTop: '8px' }}
          >
            Remove Photo
          </button>
        )}
      </div>

      {/* Level Progress */}
      <div className="card" style={{ marginBottom: '18px' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
            <Trophy className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <strong>Level Progress</strong>
          </div>
          <span className="chip">{xpPercentage}%</span>
        </div>
        <div className="progress" style={{ height: '8px', marginBottom: '8px' }}>
          <div style={{ width: `${xpPercentage}%` }} />
        </div>
        <p className="subtitle" style={{ fontSize: '12px', textAlign: 'center' }}>
          {nextLevelXP} XP until Level {(user?.level ?? 1) + 1}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="card" style={{ marginBottom: '18px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>Your Stats</h2>
        <div className="grid" style={{ gap: '12px' }}>
          <div className="module">
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <Target className="w-5 h-5" style={{ color: 'var(--accent-2)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>{user?.xp ?? 0}</h4>
                <p style={{ margin: '2px 0 0', fontSize: '11px' }}>Total XP</p>
              </div>
            </div>
          </div>
          <div className="module">
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <Flame className="w-5 h-5" style={{ color: 'var(--warn)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>{user?.streak ?? 1}</h4>
                <p style={{ margin: '2px 0 0', fontSize: '11px' }}>Day Streak</p>
              </div>
            </div>
          </div>
          <div className="module">
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <Shield className="w-5 h-5" style={{ color: 'var(--ok)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>{user?.badges?.length ?? 0}</h4>
                <p style={{ margin: '2px 0 0', fontSize: '11px' }}>Badges</p>
              </div>
            </div>
          </div>
          <div className="module">
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <Trophy className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>{user?.level ?? 1}</h4>
                <p style={{ margin: '2px 0 0', fontSize: '11px' }}>Level</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="card" style={{ marginBottom: '18px' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Profile Settings</h2>
          {!isEditing ? (
            <button className="ghost" onClick={handleEdit}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </button>
          ) : (
            <div className="row" style={{ gap: '8px' }}>
              <button className="ghost" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </button>
              <button className="ghost" onClick={handleSave} disabled={isLoading}>
                <Save className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="col" style={{ gap: '12px' }}>
          {/* Display Name */}
          <div>
            <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <User className="w-4 h-4" style={{ color: 'var(--accent-2)' }} />
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Display Name</label>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
                disabled={isLoading}
              />
            ) : (
              <p className="subtitle" style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                {user?.displayName || 'Not set'}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <Mail className="w-4 h-4" style={{ color: 'var(--accent-2)' }} />
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Email</label>
            </div>
            {isEditing ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
                disabled={isLoading}
              />
            ) : (
              <p className="subtitle" style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                {user?.email || 'Not set'}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <Phone className="w-4 h-4" style={{ color: 'var(--accent-2)' }} />
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Phone Number</label>
            </div>
            {isEditing ? (
              <input
                type="tel"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="+1 (555) 123-4567"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
                disabled={isLoading}
              />
            ) : (
              <p className="subtitle" style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                {user?.phoneNumber || 'Not set'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card" style={{ marginBottom: '18px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>Security Settings</h2>
        
        <div className="col" style={{ gap: '12px' }}>
          {/* Password Change */}
          <div>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
                <Lock className="w-4 h-4" style={{ color: 'var(--accent-2)' }} />
                <label style={{ fontSize: '14px', fontWeight: '600' }}>Password</label>
              </div>
              <button 
                className="ghost" 
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                style={{ fontSize: '12px', color: 'var(--accent-2)' }}
              >
                {showPasswordForm ? 'Cancel' : 'Change'}
              </button>
            </div>
            
            {showPasswordForm && (
              <div className="col" style={{ gap: '8px', marginTop: '8px' }}>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Current password"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'var(--text)',
                    fontSize: '12px'
                  }}
                  disabled={isLoading}
                />
                <div className="row" style={{ gap: '8px' }}>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="New password"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'var(--text)',
                      fontSize: '12px'
                    }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    style={{ padding: '8px' }}
                  >
                    {showPasswords.new ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                <div className="row" style={{ gap: '8px' }}>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'var(--text)',
                      fontSize: '12px'
                    }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    style={{ padding: '8px' }}
                  >
                    {showPasswords.confirm ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                <button 
                  className="cta" 
                  onClick={handlePasswordChange}
                  disabled={isLoading}
                  style={{ fontSize: '12px', padding: '8px 12px' }}
                >
                  Update Password
                </button>
              </div>
            )}
          </div>

          {/* Two-Factor Authentication */}
          <div>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
                <Shield className="w-4 h-4" style={{ color: 'var(--accent-2)' }} />
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600' }}>Two-Factor Authentication</label>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--muted)' }}>
                    {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <button 
                className={`cta ${user?.twoFactorEnabled ? 'secondary' : 'primary'}`}
                onClick={handleToggleTwoFactor}
                disabled={isLoading}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {user?.twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card" style={{ marginBottom: '18px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>Account Actions</h2>
        
        <div className="col" style={{ gap: '8px' }}>
          <button 
            className="cta secondary" 
            onClick={() => setCurrentScreen('onboarding')}
            style={{ fontSize: '14px', padding: '12px' }}
          >
            <Settings className="w-4 h-4 mr-2" />
            View Onboarding Tutorial
          </button>
          
          <button 
            className="cta secondary" 
            onClick={handleSignOut}
            style={{ fontSize: '14px', padding: '12px', color: 'var(--warn)' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePictureUpload}
        style={{ display: 'none' }}
      />
    </>
  );
}

