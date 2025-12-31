import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { databaseService } from '../services/database';

interface Entry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  images: string[];
  entry_date: string;
  created_at: string;
  updated_at: string;
}

const moodEmoji: Record<string, string> = {
  calm: '😊',
  happy: '😄',
  sad: '😔',
  anxious: '😟',
  angry: '😡',
  neutral: '😐',
};

export const EntryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ENTRY ================= */
  useEffect(() => {
    if (!id) return;

    const loadEntry = async () => {
      try {
        const data = await databaseService.getEntry(id);
        setEntry(data);
      } catch (err) {
        console.error('Failed to load entry:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, [id]);

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen diary-bg flex items-center justify-center">
        <span className="italic text-gray-500">
          Opening diary…
        </span>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen diary-bg flex items-center justify-center">
        <span className="italic text-gray-500">
          This page is missing.
        </span>
      </div>
    );
  }

  const dateLabel = new Date(entry.entry_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  /* ================= UI ================= */
  return (
    <div className="min-h-screen diary-bg flex justify-center py-12 px-4">
      <div className="diary-page">

        {/* Header */}
        <div className="diary-header">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Back
          </button>

          <span className="text-xl">
            {moodEmoji[entry.mood] || '📖'}
          </span>
        </div>

        {/* Date */}
        <div className="diary-date-full">
          {dateLabel}
        </div>

        {/* Content */}
        <div className="diary-content">
          {entry.content}
        </div>

        {/* Images */}
        {entry.images.length > 0 && (
          <div className="diary-images">
            {entry.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="memory"
                className="diary-image"
              />
            ))}
          </div>
        )}

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="diary-tags">
            {entry.tags.map(tag => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="diary-footer">
          Written quietly ✨
        </div>
      </div>
    </div>
  );
};
