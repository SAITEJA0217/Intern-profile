import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword || password.length < 6) {
      setMessage('Passwords must match and be at least 6 characters');
      return;
    }

    try {
      await signUp(email.trim(), password.trim(), name.trim());
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Try again.'
      );
    }
  };

  return (
    <div className="min-h-screen diary-bg flex items-center justify-center px-4">
      <div className="diary-page max-w-md w-full">

        {/* Header */}
        <div className="diary-auth-header">
          <h1 className="diary-auth-title">Create your diary</h1>
          <p className="diary-auth-sub">
            A private space for your thoughts.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="diary-auth-form">
          <input
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="diary-input"
            required
          />

          <input
            placeholder="Email address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="diary-input"
            required
          />

          <input
            placeholder="Create a password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="diary-input"
            required
          />

          <input
            placeholder="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="diary-input"
            required
          />

          <button type="submit" className="diary-action primary">
            Open my diary
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="diary-message">{message}</p>
        )}

        {/* Footer */}
        <div className="diary-auth-footer">
          <p>
            Already have a diary?{' '}
            <Link to="/login">Open it</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
