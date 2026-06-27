export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type Category =
  | 'Relationships'
  | 'Emotional Wellbeing'
  | 'Career'
  | 'Money'
  | 'Life Skills'
  | 'Productivity'
  | 'Communication'
  | 'Personal Growth';

export interface CourseCover {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  alt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: Category;
  difficulty: Difficulty;
  duration: string; // e.g. "2h 30m"
  moduleCount: number;
  tags: string[];
  featured: boolean;
  published: boolean;
  createdAt: number;
  updatedAt: number;
  cover: CourseCover;
}

export interface CategoryInfo {
  name: Category;
  emoji: string;
  description: string;
  color: string;
  bgColor: string;
}

export interface LocalProgress {
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  reflections: Record<string, string>;
  journalEntries: JournalEntry[];
  lastOpenedLesson: string | null;
  completionPercentage: number;
  bookmarks: string[];
  notes: string;
  startedAt: number;
  lastAccessedAt: number;
}

export interface JournalEntry {
  id: string;
  courseId: string;
  lessonId: string;
  content: string;
  createdAt: number;
}

export type SortOption = 'newest' | 'popular' | 'alphabetical';
