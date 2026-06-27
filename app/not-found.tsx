import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found — Lane Academy',
};

export default function NotFound() {
  return (
    <div style={{
      paddingTop: '68px',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <p style={{
          fontFamily: 'Instrument Serif, Georgia, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(5rem, 15vw, 9rem)',
          fontWeight: 400,
          color: 'var(--border)',
          lineHeight: 1,
          margin: '0 0 1rem',
          letterSpacing: '-0.05em',
        }}>
          404
        </p>
        <h1 style={{
          fontFamily: 'Instrument Serif, Georgia, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 400,
          color: 'var(--text-primary)',
          margin: '0 0 0.75rem',
          letterSpacing: '-0.02em',
        }}>
          Page not found
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          lineHeight: 1.65,
          marginBottom: '2rem',
        }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.8rem 1.5rem',
            borderRadius: 12,
            background: 'var(--accent)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600, fontSize: '0.9rem',
            transition: 'background 0.2s ease',
          }}>
            Go home
          </Link>
          <Link href="/courses" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '0.8rem 1.5rem',
            borderRadius: 12,
            background: 'var(--surface)',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontWeight: 600, fontSize: '0.9rem',
            border: '1.5px solid var(--border)',
            transition: 'all 0.2s ease',
          }}>
            Browse courses
          </Link>
        </div>
      </div>
    </div>
  );
}
