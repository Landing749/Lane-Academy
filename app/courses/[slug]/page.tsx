import type { Metadata } from 'next';
import CoursePageClient from './CoursePageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

// Fetch published course slugs from Firebase REST API at build time.
// Courses node has ".read": true so no auth token required.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const res = await fetch(
      'https://lane-academy-default-rtdb.firebaseio.com/courses.json',
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Record<
      string,
      { slug?: string; published?: boolean }
    > | null;
    if (!data) return [];
    return Object.values(data)
      .filter((c) => c.published && c.slug)
      .map((c) => ({ slug: c.slug as string }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    title: `${title} — Lane Academy`,
    description: `Start the ${title} course on Lane Academy. Self-paced, privacy-first, no account required.`,
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  return <CoursePageClient slug={slug} />;
}
