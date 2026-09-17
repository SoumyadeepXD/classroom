'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { apiFetch } from '@/lib/api-client';
import {
  X,
  User as UserIcon,
  Shield,
  Volume2,
  Palette,
  LogOut,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSettingsModal({ isOpen, onClose }: UserSettingsModalProps) {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'account' | 'voice' | 'appearance'>('account');

  // Profile edit
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Voice settings mockup
  const [inputVolume, setInputVolume] = useState(80);
  const [outputVolume, setOutputVolume] = useState(100);

  if (!isOpen || !user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setSavingProfile(true);

    try {
      const res = await apiFetch<any>('/users/me', {
        method: 'PUT',
        body: JSON.stringify({ displayName: displayName.trim() }),
      });
      // Update local storage user profile
      const stored = localStorage.getItem('current_user');
      if (stored) {
        const u = JSON.parse(stored);
        u.displayName = res.displayName || displayName.trim();
        localStorage.setItem('current_user', JSON.stringify(u));
      }
      setProfileSuccess('Profile updated successfully!');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setSavingPassword(true);
    try {
      await apiFetch('/users/me/password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      setPasswordSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Settings Modal Container */}
      <div className="flex w-full h-full max-w-5xl mx-auto bg-[#313338] shadow-2xl overflow-hidden md:my-6 md:rounded-2xl border border-gray-800">
        {/* Left Sidebar */}
        <div className="w-60 bg-[#2b2d31] flex flex-col justify-between p-4 border-r border-[#1f2023] flex-shrink-0">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
              User Settings
            </div>

            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'account'
                  ? 'bg-[#35373c] text-white'
                  : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
              }`}
            >
              <UserIcon className="w-4 h-4 text-brand-400" />
              <span>My Account</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'voice'
                  ? 'bg-[#35373c] text-white'
                  : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
              }`}
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Voice & Video</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'appearance'
                  ? 'bg-[#35373c] text-white'
                  : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
              }`}
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Appearance</span>
            </button>

            <div className="h-[1px] bg-gray-800 my-2" />

            <button
              onClick={logout}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-500 px-3 font-mono">
            Classroom v1.0.0
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-8 relative">
          {/* Close button */}
          <div className="absolute top-6 right-6 flex items-center space-x-1">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-700 text-xs font-semibold text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
            >
              <span>ESC</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeTab === 'account' && (
            <div className="max-w-xl space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white">My Account</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Manage your public profile and authentication credentials.
                </p>
              </div>

              {/* Profile Card Banner */}
              <div className="bg-[#1e1f22] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-xl font-bold text-white relative shadow-lg">
                    {user.displayName.charAt(0).toUpperCase()}
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#1e1f22]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{user.displayName}</h3>
                    <p className="text-xs text-gray-400">{user.email}</p>
                    <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded">
                      {user.systemRole || 'Verified Member'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Display Name */}
              <div className="bg-[#2b2d31] rounded-2xl p-6 border border-gray-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-brand-400" />
                  Profile Details
                </h3>

                {profileSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{profileSuccess}</span>
                  </div>
                )}
                {profileError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-[#1e1f22]/50 border border-gray-800 rounded-xl py-2 px-3 text-sm text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Institutional emails cannot be modified.</p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile || displayName.trim() === user.displayName}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                    >
                      {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Change Password Card */}
              <div className="bg-[#2b2d31] rounded-2xl p-6 border border-gray-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  Change Password
                </h3>

                {passwordSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}
                {passwordError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm match"
                        className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={savingPassword || !oldPassword || !newPassword}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-emerald-600/30 disabled:opacity-40"
                    >
                      {savingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="max-w-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Voice & Video Settings</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Configure microphone input sensitivity, speaker output, and video cameras.
                </p>
              </div>

              <div className="bg-[#2b2d31] rounded-2xl p-6 border border-gray-800 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-300 uppercase mb-2">
                    <span>Input Volume (Microphone)</span>
                    <span className="text-brand-400">{inputVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={inputVolume}
                    onChange={(e) => setInputVolume(Number(e.target.value))}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-300 uppercase mb-2">
                    <span>Output Volume (Headphones)</span>
                    <span className="text-emerald-400">{outputVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={outputVolume}
                    onChange={(e) => setOutputVolume(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-[#1e1f22] rounded-xl border border-gray-800">
                  <span className="text-xs font-semibold text-white block mb-1">Mic Test</span>
                  <p className="text-xs text-gray-400 mb-3">Check if your audio hardware is picking up sound.</p>
                  <div className="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 rounded-full animate-pulse w-3/5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="max-w-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Appearance</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Customize the theme and layout aesthetics.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1e1f22] border-2 border-brand-500 rounded-2xl p-4 cursor-pointer">
                  <div className="h-16 bg-[#313338] rounded-xl mb-3 flex items-center justify-center font-bold text-xs text-brand-400">
                    Modern Dark (Active)
                  </div>
                  <span className="text-sm font-bold text-white block">Dark Mode</span>
                  <span className="text-xs text-gray-400">Classic charcoal canvas</span>
                </div>

                <div className="bg-[#2b2d31] border border-gray-800 rounded-2xl p-4 opacity-50 cursor-not-allowed">
                  <div className="h-16 bg-gray-100 rounded-xl mb-3 flex items-center justify-center font-bold text-xs text-gray-800">
                    Light Mode
                  </div>
                  <span className="text-sm font-bold text-white block">Light Mode</span>
                  <span className="text-xs text-gray-400">Coming soon</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
