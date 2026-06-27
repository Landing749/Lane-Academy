'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import CourseCard from './CourseCard';

export default function FeaturedCourses() {
  const { courses, loading, error } = useCourses({ featuredOnly: true });

  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <p style={{
              fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--accent)',
              marginBottom: '0.5rem',
            }}>
              Handpicked for you
            </p>
            <h2 className="font-display" style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              Featured courses
            </h2>
          </div>
          <Link
            href="/courses"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              color: 'var(--accent)', textDecoration: 'none',
              fontWeight: 600, fontSize: '0.9rem',
              transition: 'gap 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.gap = '0.65rem'; }}
            onMouseLeave={(e) => { e.currentTarget.style.gap = '0.4rem'; }}
          >
            View all courses <ArrowRight size={16} />
          </Link>
        </motion.div>

        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 420, borderRadius: 16,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, var(--surface-2) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.4s infinite',
                }} />
              </div>
            ))}
            <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
          </div>
        )}

        {error && (
          <div style={{
            padding: '2rem',
            borderRadius: 16,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Couldn't load courses</p>
            <p style={{ fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div style={{
            padding: '4rem 2rem',
            borderRadius: 16,
            background: 'var(--surface)',
            border: '1px dashed var(--border)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📚</p>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Courses coming soon
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              We're building something great. Check back soon.
            </p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}>
            {courses.slice(0, 6).map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
