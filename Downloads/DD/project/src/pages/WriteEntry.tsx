import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { databaseService } from '../services/database';

type Mood = 'calm' | 'happy' | 'sad' | 'anxious' | 'angry';

const moods: { value: Mood; emoji: string; label: string }[] = [
  { value: 'calm', emoji: '😊', label: 'Calm' },
  { value: 'happy', emoji: '😄', label: 'Happy' },
  { value: 'sad', emoji: '😔', label: 'Sad' },
  { value: 'anxious', emoji: '😟', label: 'Anxious' },
  { value: 'angry', emoji: '😡', label: 'Angry' },
];

export const WriteEntry = () => {
  const { profile } = useAuthStore();

  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('calm');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);

  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  /* ✅ Memoized date (fixes exhaustive-deps warning) */
  const today = useMemo(() => new Date(), []);

  const dateLabel = useMemo(
    () =>
      today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    [today]
  );

  /* ================= AUTO SAVE ================= */
  useEffect(() => {
    if (!profile || !content.trim()) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    autoSaveTimer.current = setTimeout(async () => {
      try {
        if (entryId) {
          await databaseService.updateEntry(entryId, {
            content,
            mood,
          });
        } else {
          const newEntry = await databaseService.createEntry({
            user_id: profile.id,
            title: '',
            content,
            mood,
            tags: [],
            images: [],
            entry_date: today.toISOString().slice(0, 10),
          });
          setEntryId(newEntry.id);
        }

        setLastSaved(new Date());
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, 2500);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [content, mood, profile, entryId, today]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen diary-bg flex justify-center py-12 px-4">
      <div className="diary-page">

        {/* Header */}
        <div className="diary-header">
          <span className="diary-date">{dateLabel}</span>

          <div className="diary-moods">
            {moods.map(m => (
              <button
                key={m.value}
                title={m.label}
                onClick={() => setMood(m.value)}
                className={`diary-mood ${
                  mood === m.value ? 'active' : ''
                }`}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <textarea
          autoFocus
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Dear diary…"
          className="diary-editor"
        />

        {/* Footer */}
        <div className="diary-footer">
          {lastSaved ? 'Saved quietly ✨' : 'Writing…'}
        </div>
      </div>
    </div>
  );
};
