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

export const PastEntries = () => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    const load = async () => {
      try {
        const data = await databaseService.getEntries(profile.id);
        setEntries(data);
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
        <span className="text-gray-500 italic">Opening your diary…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen diary-bg px-4 py-12">
      <div className="max-w-3xl mx-auto diary-shelf">

        <h1 className="diary-shelf-title">My Diary</h1>

        {entries.length === 0 && (
          <p className="diary-empty">
            You haven’t written anything yet.
          </p>
        )}

        <ul className="diary-entry-list">
          {entries.map(entry => {
            const preview =
              entry.content.split('\n').find(line => line.trim()) || '…';

            const dateLabel = new Date(entry.entry_date).toLocaleDateString(
              'en-US',
              { month: 'short', day: 'numeric', year: 'numeric' }
            );

            return (
              <li
                key={entry.id}
                onClick={() => navigate(`/entry/${entry.id}`)}
                className="diary-entry-item"
              >
                <span className="diary-entry-date">{dateLabel}</span>

                <span className="diary-entry-text">
                  “{preview.slice(0, 70)}”
                </span>

                <span className="diary-entry-mood">
                  {moodEmoji[entry.mood] || '📖'}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
