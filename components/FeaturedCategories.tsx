'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/categories';

export default function FeaturedCategories() {
  const router = useRouter();

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
            textTransform: 'uppercase', color: 'var(--accent)',
            marginBottom: '0.75rem',
          }}>
            What do you want to learn?
          </p>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontStyle: 'italic',
            fontWeight: 400,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            Explore by topic
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}>
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              onClick={() => router.push(`/courses?category=${encodeURIComponent(cat.name)}`)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.5rem',
                padding: '1.25rem',
                borderRadius: 16,
                background: cat.bgColor,
                border: '1.5px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = cat.color + '50';
                el.style.transform = 'translateY(-3px)';
                el.style.boxShadow = `0 8px 24px ${cat.color}20`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'transparent';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '2rem', lineHeight: 1 }}>{cat.emoji}</span>
              <div>
                <p style={{
                  fontWeight: 700, fontSize: '0.95rem',
                  color: cat.color, margin: '0 0 0.2rem',
                }}>
                  {cat.name}
                </p>
                <p style={{
                  fontSize: '0.78rem', color: cat.color + 'BB',
                  margin: 0, lineHeight: 1.4,
                }}>
                  {cat.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
