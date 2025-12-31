import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { databaseService } from '../services/database';

interface Entry {
  id: string;
  content: string;
  mood: string;
  entry_date: string;
}

const moodEmoji: Record<string, string> = {
  calm: '😊',
  happy: '😄',
  sad: '😔',
  anxious: '😟',
  angry: '😡',
  neutral: '😐',
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [recentEntries, setRecentEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    if (!profile) return;

    const load = async () => {
      try {
        const data = await databaseService.getEntries(profile.id, 3);
        setRecentEntries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen diary-bg flex items-center justify-center">
        <span className="italic text-gray-500">Opening your diary…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen diary-bg px-4 py-14">
      <div className="max-w-3xl mx-auto diary-home">

        {/* Greeting */}
        <div className="diary-home-header">
          <p className="diary-home-date">{todayLabel}</p>
          <h1 className="diary-home-greeting">
            Welcome back{profile?.name ? `, ${profile.name}` : ''}.
          </h1>
          <p className="diary-home-sub">
            Take a moment. Write whatever you feel.
          </p>
        </div>

        {/* Write Button */}
        <div className="diary-home-write">
          <button
            onClick={() => navigate('/write')}
            className="diary-write-btn"
          >
            ✍️ Write Today
          </button>
        </div>

        {/* Recent memories */}
        {recentEntries.length > 0 && (
          <div className="diary-home-recent">
            <p className="diary-recent-title">Recent memories</p>

            <ul className="diary-recent-list">
              {recentEntries.map(entry => {
                const preview =
                  entry.content.split('\n').find(l => l.trim()) || '…';

                const date = new Date(entry.entry_date).toLocaleDateString(
                  'en-US',
                  { month: 'short', day: 'numeric' }
                );

                return (
                  <li
                    key={entry.id}
                    onClick={() => navigate(`/entry/${entry.id}`)}
                    className="diary-recent-item"
                  >
                    <span className="diary-recent-date">{date}</span>
                    <span className="diary-recent-text">
                      “{preview.slice(0, 50)}”
                    </span>
                    <span className="diary-recent-mood">
                      {moodEmoji[entry.mood] || '📖'}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
