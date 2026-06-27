import type { Metadata } from 'next';
import CoursePageClient from './CoursePageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

// With output: 'export', only pre-rendered paths are served.
// Unknown slugs hit the 404 page automatically.
export const dynamicParams = false;

// Fetch published course slugs from Firebase REST API at build time.
// Courses node has ".read": true so no auth token required.
// Falls back to a placeholder slug so the static export always has at
// least one path — prevents the "missing generateStaticParams" build error
// when the Firebase endpoint is unreachable or returns no courses yet.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const res = await fetch(
      'https://lane-academy-default-rtdb.firebaseio.com/courses.json',
      { cache: 'no-store' }
    );
    if (!res.ok) return [{ slug: '_placeholder' }];
    const data = (await res.json()) as Record<
      string,
      { slug?: string; published?: boolean }
    > | null;
    if (!data) return [{ slug: '_placeholder' }];
    const slugs = Object.values(data)
      .filter((c) => c.published && c.slug)
      .map((c) => ({ slug: c.slug as string }));
    return slugs.length > 0 ? slugs : [{ slug: '_placeholder' }];
  } catch {
    return [{ slug: '_placeholder' }];
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
