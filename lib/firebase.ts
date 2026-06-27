import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase, ref, onValue, query,
  orderByChild, equalTo, get, set, push, update, remove,
} from 'firebase/database';
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import type { Course } from '@/types';

const firebaseConfig = {
  apiKey: "AIzaSyDREDrySU_ae_ubPZy_f2pxqH0QI-Hg0Tg",
  authDomain: "lane-academy.firebaseapp.com",
  projectId: "lane-academy",
  storageBucket: "lane-academy.firebasestorage.app",
  messagingSenderId: "962327337454",
  appId: "1:962327337454:web:b798efaae3da31512b96ff",
  measurementId: "G-4TRD318F8V",
  databaseURL: "https://lane-academy-default-rtdb.firebaseio.com",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };

// ── Auth ──────────────────────────────────────────────

export function adminLogin(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function adminLogout() {
  return signOut(auth);
}

export function onAdminAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

// ── Public read ───────────────────────────────────────

export function subscribeToCourses(
  callback: (courses: Course[]) => void,
  onError?: (error: Error) => void
): () => void {
  const coursesRef = ref(db, 'courses');
  const publishedQuery = query(coursesRef, orderByChild('published'), equalTo(true));
  return onValue(
    publishedQuery,
    (snapshot) => {
      if (!snapshot.exists()) { callback([]); return; }
      const courses: Course[] = Object.entries(snapshot.val()).map(([id, val]) => ({
        id,
        ...(val as Omit<Course, 'id'>),
      }));
      callback(courses);
    },
    (error) => { console.error('Firebase error:', error); onError?.(error); }
  );
}

export function subscribeToFeaturedCourses(
  callback: (courses: Course[]) => void,
  onError?: (error: Error) => void
): () => void {
  return subscribeToCourses((courses) => callback(courses.filter((c) => c.featured)), onError);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const snapshot = await get(ref(db, 'courses'));
  if (!snapshot.exists()) return null;
  const entry = Object.entries(snapshot.val()).find(
    ([, val]) => (val as Course).slug === slug && (val as Course).published
  );
  if (!entry) return null;
  const [id, val] = entry;
  return { id, ...(val as Omit<Course, 'id'>) };
}

// ── Admin write ───────────────────────────────────────

/** Fetch ALL courses (including unpublished) — admin only */
export async function adminGetAllCourses(): Promise<Course[]> {
  const snapshot = await get(ref(db, 'courses'));
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([id, val]) => ({
    id,
    ...(val as Omit<Course, 'id'>),
  }));
}

/** Subscribe to ALL courses in realtime — admin only */
export function adminSubscribeAllCourses(
  callback: (courses: Course[]) => void
): () => void {
  return onValue(ref(db, 'courses'), (snapshot) => {
    if (!snapshot.exists()) { callback([]); return; }
    const courses: Course[] = Object.entries(snapshot.val()).map(([id, val]) => ({
      id,
      ...(val as Omit<Course, 'id'>),
    }));
    courses.sort((a, b) => b.createdAt - a.createdAt);
    callback(courses);
  });
}

export type CourseInput = Omit<Course, 'id'>;

/** Create a new course */
export async function adminCreateCourse(data: CourseInput): Promise<string> {
  const newRef = push(ref(db, 'courses'));
  await set(newRef, data);
  return newRef.key!;
}

/** Update an existing course */
export async function adminUpdateCourse(id: string, data: Partial<CourseInput>): Promise<void> {
  await update(ref(db, `courses/${id}`), { ...data, updatedAt: Date.now() });
}

/** Delete a course */
export async function adminDeleteCourse(id: string): Promise<void> {
  await remove(ref(db, `courses/${id}`));
}

/** Toggle a boolean field */
export async function adminToggleField(
  id: string,
  field: 'published' | 'featured',
  value: boolean
): Promise<void> {
  await update(ref(db, `courses/${id}`), { [field]: value, updatedAt: Date.now() });
}
