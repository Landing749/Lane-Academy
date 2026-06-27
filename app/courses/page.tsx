import type { Metadata } from 'next';
import { Suspense } from 'react';
import CoursesClient from './CoursesClient';

export const metadata: Metadata = {
  title: 'Courses — Lane Academy',
  description: 'Browse our full library of practical, self-paced courses. No account needed.',
};

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div style={{ paddingTop: '68px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Loading courses…</div>
      </div>
    }>
      <CoursesClient />
    </Suspense>
  );
}
