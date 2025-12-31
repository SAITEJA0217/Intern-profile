import { MoodBadge } from './MoodBadge';
import { formatDate, formatRelativeTime } from '../utils/dateUtils';
import { Calendar, Image } from 'lucide-react';

interface EntryCardProps {
  entry: {
    id: string;
    title: string;
    content: string;
    mood: string;
    tags: string[];
    images: string[];
    entry_date: string;
    created_at: string;
  };
  onClick: () => void;
}

export const EntryCard = ({ entry, onClick }: EntryCardProps) => {
  const truncateContent = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5 transition-all duration-200 hover:shadow-xl hover:scale-[1.01] cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {entry.title || 'Untitled Entry'}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(entry.entry_date)}</span>
            <span>•</span>
            <span>{formatRelativeTime(entry.created_at)}</span>
          </div>
        </div>
        <MoodBadge mood={entry.mood} size="sm" />
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
        {truncateContent(entry.content, 150)}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
            >
              #{tag}
            </span>
          ))}
          {entry.tags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
              +{entry.tags.length - 3} more
            </span>
          )}
        </div>
        {entry.images.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Image className="w-4 h-4" />
            <span>{entry.images.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};
