import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Landing = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen diary-bg flex flex-col">

      {/* Header */}
      <header className="diary-landing-header">
        <h1 className="diary-brand">Dear Diary</h1>

        <div className="diary-landing-actions">
          {user ? (
            <Link to="/dashboard" className="diary-link">
              Open diary
            </Link>
          ) : (
            <>
              <Link to="/login" className="diary-link">
                Open diary
              </Link>
              <Link to="/signup" className="diary-link primary">
                Create diary
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="diary-landing-main">
        <div className="diary-landing-content">
          <h2 className="diary-landing-title">
            A private place<br />
            for your thoughts
          </h2>

          <p className="diary-landing-sub">
            Write freely. Remember quietly.<br />
            Your diary stays yours.
          </p><br />
            
          {!user ? (
            <Link to="/signup" className="diary-action primary">
              Begin writing
            </Link>
          ) : (
            <Link to="/dashboard" className="diary-action primary">
              Continue writing
            </Link>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="diary-landing-footer">
        <p>
          Your words are private. Always.
        </p>
      </footer>
    </div>
  );
};
