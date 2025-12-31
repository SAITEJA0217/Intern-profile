import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await signIn(email.trim(), password.trim());
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : 'Unable to open your diary.'
      );
    }
  };

  return (
    <div className="min-h-screen diary-bg flex items-center justify-center px-4">
      <div className="diary-page max-w-md w-full">

        {/* Header */}
        <div className="diary-auth-header">
          <h1 className="diary-auth-title">Open your diary</h1>
          <p className="diary-auth-sub">
            Welcome back. Your thoughts are waiting.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="diary-auth-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="diary-input"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="diary-input"
            required
          />

          <button type="submit" className="diary-action primary">
            Open diary
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="diary-message">{message}</p>
        )}

        {/* Footer */}
        <div className="diary-auth-footer">
          <p>
            New here? <Link to="/signup">Create a diary</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot password</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
