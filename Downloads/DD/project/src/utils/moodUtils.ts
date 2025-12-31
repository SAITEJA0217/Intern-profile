export const moods = [
  { value: 'happy', label: 'Happy', emoji: '😊', color: 'text-yellow-500' },
  { value: 'sad', label: 'Sad', emoji: '😢', color: 'text-blue-500' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'text-gray-500' },
  { value: 'excited', label: 'Excited', emoji: '🤩', color: 'text-orange-500' },
  { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'text-purple-500' },
  { value: 'grateful', label: 'Grateful', emoji: '🙏', color: 'text-green-500' },
  { value: 'angry', label: 'Angry', emoji: '😠', color: 'text-red-500' },
  { value: 'peaceful', label: 'Peaceful', emoji: '😌', color: 'text-teal-500' },
];

export const getMoodInfo = (moodValue: string) => {
  return moods.find((m) => m.value === moodValue) || moods[2];
};

export const getMoodColor = (moodValue: string): string => {
  const mood = getMoodInfo(moodValue);
  return mood.color;
};

export const getMoodEmoji = (moodValue: string): string => {
  const mood = getMoodInfo(moodValue);
  return mood.emoji;
};
