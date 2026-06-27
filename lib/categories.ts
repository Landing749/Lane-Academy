import type { CategoryInfo } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'Relationships',
    emoji: '❤️',
    description: 'Navigate love, friendship, and human connection',
    color: '#E85D75',
    bgColor: '#FFF0F3',
  },
  {
    name: 'Emotional Wellbeing',
    emoji: '🧠',
    description: 'Understand and care for your inner world',
    color: '#7C5CE4',
    bgColor: '#F3F0FF',
  },
  {
    name: 'Career',
    emoji: '💼',
    description: 'Build a meaningful, rewarding working life',
    color: '#2D7DD2',
    bgColor: '#EFF6FF',
  },
  {
    name: 'Money',
    emoji: '💰',
    description: 'Make smarter decisions with your finances',
    color: '#2C9B6A',
    bgColor: '#F0FFF8',
  },
  {
    name: 'Life Skills',
    emoji: '🏡',
    description: 'Practical skills for everyday adulting',
    color: '#D97706',
    bgColor: '#FFFBEB',
  },
  {
    name: 'Productivity',
    emoji: '🎯',
    description: 'Do more of what matters, with less friction',
    color: '#0891B2',
    bgColor: '#F0FDFF',
  },
  {
    name: 'Communication',
    emoji: '🗣',
    description: 'Say what you mean. Be heard. Connect better.',
    color: '#7C3AED',
    bgColor: '#F5F0FF',
  },
  {
    name: 'Personal Growth',
    emoji: '🌱',
    description: 'Become more fully yourself, one step at a time',
    color: '#059669',
    bgColor: '#F0FFF4',
  },
];

export const DIFFICULTY_COLORS: Record<string, { text: string; bg: string }> = {
  Beginner: { text: '#2C9B6A', bg: '#F0FFF8' },
  Intermediate: { text: '#D97706', bg: '#FFFBEB' },
  Advanced: { text: '#E85D75', bg: '#FFF0F3' },
};
