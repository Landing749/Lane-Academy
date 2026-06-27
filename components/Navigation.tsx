'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          background: 'var(--nav-bg)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="container-xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <Image
              src={`${basePath}/logo.png`}
              alt="Lane Academy"
              width={140}
              height={47}
              style={{ objectFit: 'contain', objectPosition: 'left center' }}
              priority
            />
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="nav-desktop">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: pathname === link.href ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                }}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute',
                      bottom: -4, left: 0, right: 0,
                      height: 2,
                      background: 'var(--accent)',
                      borderRadius: 1,
                    }}
                  />
                )}
              </Link>
            ))}

            {mounted && (
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{
                  width: 38, height: 38,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 10,
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              width: 38, height: 38,
              display: 'none', alignItems: 'center', justifyContent: 'center',
              borderRadius: 10,
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 72, left: 0, right: 0,
              zIndex: 49,
              background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              padding: '1rem 1.5rem 1.5rem',
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  textDecoration: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: 10,
                  color: pathname === link.href ? 'var(--accent)' : 'var(--text-primary)',
                  background: pathname === link.href ? 'var(--accent-light)' : 'transparent',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              >
                {link.label}
              </Link>
            ))}
            {mounted && (
              <button
                onClick={() => { toggleTheme(); setMobileOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 10,
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', color: 'var(--text-secondary)',
                  fontWeight: 500, textAlign: 'left', fontFamily: 'inherit',
                }}
              >
                {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
