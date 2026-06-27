'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, HardDrive, UserX, ArrowRight } from 'lucide-react';

const PRIVACY_POINTS = [
  {
    icon: UserX,
    label: 'No login. No account.',
    detail: "Start learning immediately. We don't need to know who you are.",
  },
  {
    icon: HardDrive,
    label: 'Stored only on your device.',
    detail: 'Journal entries, reflections, and progress live in your browser — nowhere else.',
  },
  {
    icon: ShieldCheck,
    label: 'Zero data transmitted.',
    detail: 'Nothing you write or complete is ever uploaded to any server.',
  },
];

export default function PrivacyHighlight() {
  return (
    <section
      className="section-pad"
      style={{
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle bg accent */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,126,247,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }}
          className="privacy-grid"
        >
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p style={{
              fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem',
            }}>
              Built on trust
            </p>
            <h2 className="font-display" style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontStyle: 'italic', fontWeight: 400,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
            }}>
              Your story belongs to you.
            </h2>
            <p style={{
              fontSize: '1.05rem', color: 'var(--text-secondary)',
              lineHeight: 1.7, marginBottom: '2rem',
            }}>
              Lane Academy never stores your journal entries, reflections, or course progress.
              Everything is saved locally on your device using browser storage.
              When you close the tab, your private thoughts stay private — always.
            </p>
            <Link
              href="/privacy"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                color: 'var(--accent)', textDecoration: 'none',
                fontWeight: 600, fontSize: '0.9rem',
              }}
            >
              Read our full privacy policy <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Points side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {PRIVACY_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  style={{
                    display: 'flex', gap: '1rem', alignItems: 'flex-start',
                    padding: '1.25rem',
                    borderRadius: 14,
                    background: 'var(--surface)',
                    border: '1.5px solid var(--border)',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, flexShrink: 0,
                    borderRadius: 12,
                    background: 'var(--accent-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color="var(--accent)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>
                      {point.label}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      {point.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .privacy-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  );
}
