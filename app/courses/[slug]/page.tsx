import type { Metadata } from 'next';
import CoursePageClient from './CoursePageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

// Fetch ALL course slugs (published or not) from Firebase REST API at build time.
// This ensures every course page is pre-rendered — new courses require a redeploy.
// The admin panel has a "Redeploy" button that triggers the GitHub Actions workflow.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const res = await fetch(
      'https://lane-academy-default-rtdb.firebaseio.com/courses.json',
      { cache: 'no-store' }
    );
    if (!res.ok) return [{ slug: '_placeholder' }];
    const data = (await res.json()) as Record<
      string,
      { slug?: string }
    > | null;
    if (!data) return [{ slug: '_placeholder' }];
    const slugs = Object.values(data)
      .filter((c) => c.slug)
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
