import { getMoodInfo } from '../utils/moodUtils';

interface MoodBadgeProps {
  mood: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MoodBadge = ({ mood, size = 'md' }: MoodBadgeProps) => {
  const moodInfo = getMoodInfo(mood);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const emojiSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-700 font-medium ${sizeClasses[size]} ${moodInfo.color}`}
    >
      <span className={emojiSizes[size]}>{moodInfo.emoji}</span>
      <span>{moodInfo.label}</span>
    </span>
  );
};
