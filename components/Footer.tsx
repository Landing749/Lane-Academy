import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
];

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      padding: '3rem 0 2rem',
    }}>
      <div className="container-xl">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'inline-block', textDecoration: 'none', marginBottom: '0.875rem' }}>
              <Image
                src={`${basePath}/logo.png`}
                alt="Lane Academy"
                width={130}
                height={44}
                style={{ objectFit: 'contain', objectPosition: 'left center' }}
              />
            </Link>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 240 }}>
              Learn the skills life doesn&apos;t always teach — at your own pace, in total privacy.
            </p>
          </div>

          {/* Links */}
          <div>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
              Navigate
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} style={{
                  textDecoration: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Privacy pledge */}
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Our Pledge
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {['No account required', 'No data collected', 'No tracking', 'Progress stays on your device'].map((item) => (
                <li key={item} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.75rem' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Lane Academy. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Made with <Heart size={12} style={{ color: '#E85D75', fill: '#E85D75' }} /> for lifelong learners
          </p>
        </div>
      </div>
    </footer>
  );
}
