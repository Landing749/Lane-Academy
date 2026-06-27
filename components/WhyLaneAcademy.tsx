'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    color: '#4F7EF7',
    bgColor: '#EEF3FF',
    title: 'Privacy First',
    description:
      'No accounts. No cloud journals. No tracking of any kind. Everything you write and complete stays on your own device — always.',
  },
  {
    icon: Clock,
    color: '#2C9B6A',
    bgColor: '#F0FFF8',
    title: 'Self Paced',
    description:
      "Learn whenever you want. No deadlines, no pressure, no notifications chasing you. Come back to a lesson a week later — it's still there.",
  },
  {
    icon: Zap,
    color: '#7C5CE4',
    bgColor: '#F3F0FF',
    title: 'Practical',
    description:
      'Courses designed for real life with actionable lessons, honest reflection exercises, and skills you can use immediately.',
  },
];

export default function WhyLaneAcademy() {
  return (
    <section className="section-pad" style={{ background: 'var(--surface)' }}>
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <p style={{
            fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem',
          }}>
            Why Lane Academy?
          </p>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontStyle: 'italic', fontWeight: 400,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)', margin: 0,
          }}>
            Learning the way it should be
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  padding: '2rem',
                  borderRadius: 20,
                  background: 'var(--bg)',
                  border: '1.5px solid var(--border)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = feat.color + '40';
                  el.style.transform = 'translateY(-4px)';
                  el.style.boxShadow = `0 12px 32px ${feat.color}15`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'var(--border)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 14,
                  background: feat.bgColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <Icon size={22} color={feat.color} />
                </div>
                <h3 style={{
                  fontSize: '1.15rem', fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: '0 0 0.6rem',
                  letterSpacing: '-0.02em',
                }}>
                  {feat.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem', color: 'var(--text-secondary)',
                  lineHeight: 1.65, margin: 0,
                }}>
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
