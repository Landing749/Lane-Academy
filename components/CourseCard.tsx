'use client';

import Link from 'next/link';
import { Clock, Layers, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Course } from '@/types';
import { buildCloudinaryUrl } from '@/lib/cloudinary';
import { DIFFICULTY_COLORS, CATEGORIES } from '@/lib/categories';

interface CourseCardProps {
  course: Course;
  index?: number;
}

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
  const categoryInfo = CATEGORIES.find((c) => c.name === course.category);
  const difficultyStyle = DIFFICULTY_COLORS[course.difficulty] ?? DIFFICULTY_COLORS.Beginner;

  const coverUrl = course.cover?.publicId
    ? buildCloudinaryUrl(course.cover.publicId, { width: 600, height: 360 })
    : course.cover?.secureUrl ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="course-card"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Cover image */}
      <div
        className="card-image"
        style={{
          height: 200,
          background: categoryInfo
            ? `linear-gradient(135deg, ${categoryInfo.bgColor} 0%, ${categoryInfo.color}22 100%)`
            : 'var(--surface-2)',
          position: 'relative',
        }}
      >
        {coverUrl ? (
          <img src={coverUrl} alt={course.cover?.alt ?? course.title} loading="lazy" />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3.5rem',
          }}>
            {categoryInfo?.emoji}
          </div>
        )}

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          borderRadius: 20,
          padding: '4px 10px',
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '0.72rem', fontWeight: 600,
          color: categoryInfo?.color ?? 'var(--text-secondary)',
          border: `1px solid ${categoryInfo?.color ?? 'transparent'}22`,
        }}>
          {categoryInfo?.emoji} {course.category}
        </div>

        {/* Difficulty badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: difficultyStyle.bg,
          borderRadius: 20,
          padding: '4px 10px',
          fontSize: '0.7rem', fontWeight: 600,
          color: difficultyStyle.text,
        }}>
          {course.difficulty}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 0.5rem',
          lineHeight: 1.35,
          letterSpacing: '-0.02em',
        }}>
          {course.title}
        </h3>

        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: '0 0 1rem',
          flex: 1,
        }}>
          {course.shortDescription}
        </p>

        {/* Meta row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
            <Clock size={13} />
            {course.duration}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
            <Layers size={13} />
            {course.moduleCount} modules
          </span>
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {course.tags.slice(0, 3).map((tag) => (
              <span key={tag} style={{
                fontSize: '0.72rem',
                padding: '3px 8px',
                borderRadius: 20,
                background: 'var(--surface-2)',
                color: 'var(--text-tertiary)',
                border: '1px solid var(--border)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/courses/${course.slug}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.6rem 1rem',
            borderRadius: 10,
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            border: '1px solid transparent',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = 'var(--accent)';
            el.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = 'var(--accent-light)';
            el.style.color = 'var(--accent)';
          }}
        >
          Start Course <ArrowRight size={15} />
        </Link>
      </div>
    </motion.div>
  );
}
