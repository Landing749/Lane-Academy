'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Heart, Lightbulb } from 'lucide-react';

const VALUES = [
  {
    icon: BookOpen,
    color: '#4F7EF7',
    title: 'Accessible knowledge',
    body: 'The things that matter most in life — how to communicate, heal, relate, plan, and grow — shouldn\'t be gatekept behind expensive therapy or corporate workshops.',
  },
  {
    icon: Heart,
    color: '#E85D75',
    title: 'Privacy as a right',
    body: 'When you\'re learning about something personal, the last thing you need is a platform harvesting your data. What you explore here stays with you.',
  },
  {
    icon: Lightbulb,
    color: '#D97706',
    title: 'Practical over theoretical',
    body: 'Every lesson is built around what you can actually do. Real exercises. Honest reflection. Skills you\'ll use the day after you finish a module.',
  },
];

export default function AboutClient() {
  return (
    <div style={{ paddingTop: '68px' }}>
      {/* Hero */}
      <section style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '5rem 0 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,126,247,0.07) 0%, transparent 65%)',
          transform: 'translate(30%, -30%)',
          pointerEvents: 'none',
        }} />
        <div className="container-xl" style={{ maxWidth: 760, position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p style={{
              fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--accent)',
              marginBottom: '1rem',
            }}>
              Our story
            </p>
            <h1 className="font-display" style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontStyle: 'italic', fontWeight: 400,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              lineHeight: 1.08,
              marginBottom: '1.5rem',
            }}>
              Life doesn't come with a manual.
            </h1>
            <p style={{
              fontSize: '1.15rem', color: 'var(--text-secondary)',
              lineHeight: 1.75, maxWidth: 640,
            }}>
              Nobody teaches you how to set boundaries with your family, how to have hard
              conversations at work, how to actually save money, or how to sit with anxiety
              without letting it run your life. Lane Academy exists to change that.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container-xl" style={{ maxWidth: 760 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display" style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontStyle: 'italic', fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}>
              A different kind of learning platform
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                'Lane Academy isn\'t a course marketplace or a subscription trap. It\'s a library — carefully built, thoughtfully designed, and completely on your terms.',
                'Our courses cover the topics schools rarely teach and therapy sometimes can\'t reach: relationships, emotional intelligence, money basics, communication skills, career clarity, and the slow, necessary work of becoming more fully yourself.',
                'We believe learning should feel safe. That means no accounts, no tracking, no pressure. Your progress, reflections, and journal entries live only on your device. You can even export them and take them anywhere.',
                'Every course is self-contained, self-paced, and built to be genuinely useful — not just informative.',
              ].map((paragraph, i) => (
                <p key={i} style={{
                  fontSize: '1rem', color: 'var(--text-secondary)',
                  lineHeight: 1.8, margin: 0,
                }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad" style={{ background: 'var(--surface)' }}>
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '2.5rem' }}
          >
            <h2 className="font-display" style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontStyle: 'italic', fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}>
              What we believe
            </h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}>
            {VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{
                    padding: '2rem',
                    borderRadius: 20,
                    background: 'var(--bg)',
                    border: '1.5px solid var(--border)',
                  }}
                >
                  <div style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: val.color + '18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}>
                    <Icon size={22} color={val.color} />
                  </div>
                  <h3 style={{
                    fontWeight: 700, fontSize: '1.05rem',
                    color: 'var(--text-primary)',
                    margin: '0 0 0.6rem',
                    letterSpacing: '-0.02em',
                  }}>
                    {val.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    {val.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container-xl" style={{ textAlign: 'center', maxWidth: 600 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display" style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontStyle: 'italic', fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '1rem',
            }}>
              Ready to begin?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
              No sign-up needed. Just choose a course and start learning.
            </p>
            <Link
              href="/courses"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.9rem 2rem',
                borderRadius: 12,
                background: 'var(--accent)',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 600, fontSize: '0.95rem',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 16px rgba(79,126,247,0.3)',
              }}
            >
              Browse Courses <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
