import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore, Theme } from '../store/themeStore';
import { authService } from '../services/auth';

export const Settings = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const [name, setName] = useState(profile?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState<
    null | 'name' | 'password' | 'theme' | 'privacy'
  >(null);

  const themes: Theme[] = ['light', 'dark', 'sepia'];

  /* ---------- Sync profile ---------- */
  useEffect(() => {
    if (profile?.name) setName(profile.name);
    if (profile?.theme) setTheme(profile.theme as Theme);
  }, [profile]);

  /* ---------- Auto-hide message ---------- */
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  /* ---------- Actions ---------- */

  const saveName = async () => {
    if (!name.trim() || name === profile?.name) return;

    try {
      setLoading('name');
      await updateProfile({ name: name.trim() });
      setMessage('Saved quietly ✨');
    } catch {
      setMessage('Could not save name');
    } finally {
      setLoading(null);
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      setLoading('password');
      await authService.updatePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Password updated 🔐');
    } catch {
      setMessage('Password update failed');
    } finally {
      setLoading(null);
    }
  };

  const togglePrivacy = async () => {
    if (!profile) return;

    try {
      setLoading('privacy');
      await updateProfile({ privacy_mode: !profile.privacy_mode });
      setMessage(
        profile.privacy_mode ? 'Diary unlocked' : 'Diary locked 🔒'
      );
    } catch {
      setMessage('Could not update privacy');
    } finally {
      setLoading(null);
    }
  };

  const changeTheme = async (t: Theme) => {
    if (t === theme) return;

    const prev = theme;
    setTheme(t);

    try {
      setLoading('theme');
      await updateProfile({ theme: t });
      setMessage('Theme updated');
    } catch {
      setTheme(prev);
      setMessage('Theme change failed');
    } finally {
      setLoading(null);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen diary-bg px-4 py-12">
      <div className="max-w-2xl mx-auto diary-page">

        {/* Header */}
        <div className="diary-settings-header">
          <button onClick={() => navigate(-1)} className="diary-back">
            ← Back
          </button>
          <h1 className="diary-settings-title">Diary Preferences</h1>
          <p className="diary-settings-sub">Make this space feel yours.</p>
        </div>

        {/* Name */}
        <section className="diary-section">
          <label className="diary-label">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="diary-input"
            placeholder="Name on the diary"
          />
          <button
            onClick={saveName}
            disabled={loading === 'name'}
            className="diary-action disabled:opacity-50"
          >
            {loading === 'name' ? 'Saving…' : 'Save name'}
          </button>
        </section>

        {/* Theme */}
        <section className="diary-section">
          <label className="diary-label">Paper style</label>

          <div className="diary-theme-row flex gap-3">
            {themes.map((t) => (
              <button
                key={t}
                disabled={theme === t}
                onClick={() => changeTheme(t)}
                className={`diary-theme ${
                  theme === t ? 'active opacity-50 cursor-default' : ''
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section className="diary-section">
          <label className="diary-label">Privacy</label>
          <button
            onClick={togglePrivacy}
            disabled={loading === 'privacy'}
            className="diary-action disabled:opacity-50"
          >
            {profile?.privacy_mode ? 'Unlock diary' : 'Lock diary'}
          </button>
        </section>

        {/* Password */}
        <section className="diary-section">
          <label className="diary-label">Change password</label>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="diary-input"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="diary-input"
          />
          <button
            onClick={changePassword}
            disabled={loading === 'password'}
            className="diary-action disabled:opacity-50"
          >
            {loading === 'password' ? 'Updating…' : 'Update password'}
          </button>
        </section>

        {/* Message */}
        {message && <div className="diary-message">{message}</div>}
      </div>
    </div>
  );
};
