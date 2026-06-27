import type { LocalProgress, JournalEntry } from '@/types';

const STORAGE_PREFIX = 'lane_academy_';

function getKey(courseId: string) {
  return `${STORAGE_PREFIX}progress_${courseId}`;
}

function safeGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
}

export function getProgress(courseId: string): LocalProgress | null {
  return safeGet<LocalProgress>(getKey(courseId));
}

function defaultProgress(courseId: string): LocalProgress {
  return {
    courseId,
    completedLessons: [],
    completedModules: [],
    reflections: {},
    journalEntries: [],
    lastOpenedLesson: null,
    completionPercentage: 0,
    bookmarks: [],
    notes: '',
    startedAt: Date.now(),
    lastAccessedAt: Date.now(),
  };
}

export function markLessonComplete(courseId: string, lessonId: string): LocalProgress {
  const progress = getProgress(courseId) ?? defaultProgress(courseId);
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  progress.lastAccessedAt = Date.now();
  safeSet(getKey(courseId), progress);
  return progress;
}

export function saveReflection(courseId: string, lessonId: string, text: string): void {
  const progress = getProgress(courseId) ?? defaultProgress(courseId);
  progress.reflections[lessonId] = text;
  progress.lastAccessedAt = Date.now();
  safeSet(getKey(courseId), progress);
}

export function addJournalEntry(
  courseId: string,
  lessonId: string,
  content: string
): JournalEntry {
  const progress = getProgress(courseId) ?? defaultProgress(courseId);
  const entry: JournalEntry = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    courseId,
    lessonId,
    content,
    createdAt: Date.now(),
  };
  progress.journalEntries.push(entry);
  progress.lastAccessedAt = Date.now();
  safeSet(getKey(courseId), progress);
  return entry;
}

export function toggleBookmark(courseId: string, lessonId: string): boolean {
  const progress = getProgress(courseId) ?? defaultProgress(courseId);
  const idx = progress.bookmarks.indexOf(lessonId);
  if (idx === -1) {
    progress.bookmarks.push(lessonId);
  } else {
    progress.bookmarks.splice(idx, 1);
  }
  safeSet(getKey(courseId), progress);
  return idx === -1;
}

export function getAllProgress(): LocalProgress[] {
  if (typeof window === 'undefined') return [];
  return Object.keys(localStorage)
    .filter((k) => k.startsWith(`${STORAGE_PREFIX}progress_`))
    .map((k) => safeGet<LocalProgress>(k))
    .filter(Boolean) as LocalProgress[];
}

export function clearCourseProgress(courseId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getKey(courseId));
}

export function exportProgressBundle(): string {
  const all = getAllProgress();
  return JSON.stringify({ exported: new Date().toISOString(), courses: all }, null, 2);
}
