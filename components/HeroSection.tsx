'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      paddingTop: '68px',
    }}>
      {/* Orb backgrounds */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <div
          className="orb-drift"
          style={{
            position: 'absolute',
            top: '8%', left: '60%',
            width: 600, height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,126,247,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)',
            filter: 'blur(40px)',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          className="orb-drift-reverse"
          style={{
            position: 'absolute',
            top: '45%', left: '15%',
            width: 400, height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,93,117,0.08) 0%, rgba(217,119,6,0.04) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%', right: '-5%',
            width: 500, height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(5,150,105,0.07) 0%, transparent 65%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="container-xl" style={{ position: 'relative', zIndex: 1, padding: '4rem 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: 800 }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--accent-light)',
              border: '1px solid rgba(79,126,247,0.2)',
              borderRadius: 20, padding: '6px 14px',
              marginBottom: '1.75rem',
            }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.03em' }}>
              Privacy-first learning
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}
          >
            Learn the skills{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent), #8B5CF6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              life doesn't
            </span>
            {' '}always teach.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: 580,
              marginBottom: '2.5rem',
            }}
          >
            Practical, self-paced courses designed to help you navigate relationships,
            emotions, communication, careers, finances, productivity, and personal growth.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <Link
              href="/courses"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.875rem 1.75rem',
                borderRadius: 12,
                background: 'var(--accent)',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 600, fontSize: '0.95rem',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 20px rgba(79,126,247,0.35)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(79,126,247,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,126,247,0.35)';
              }}
            >
              Browse Courses <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.875rem 1.75rem',
                borderRadius: 12,
                background: 'transparent',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 600, fontSize: '0.95rem',
                border: '1.5px solid var(--border)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Learn More
            </Link>
          </motion.div>

          {/* Social proof / trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{
              marginTop: '3rem',
              display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'No account needed' },
              { label: 'Your data stays private' },
              { label: 'Learn at your own pace' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                color: 'var(--text-tertiary)', fontSize: '0.82rem',
              }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>
                {item.label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
