'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, Layers, Tag, ShieldCheck,
  BookOpen, CheckCircle2, Circle, ArrowRight,
} from 'lucide-react';
import { getCourseBySlug } from '@/lib/firebase';
import { buildCloudinaryUrl } from '@/lib/cloudinary';
import { getProgress, markLessonComplete } from '@/lib/storage';
import { CATEGORIES, DIFFICULTY_COLORS } from '@/lib/categories';
import type { Course, LocalProgress } from '@/types';

interface Props {
  slug: string;
}

// Derive a placeholder module list from moduleCount when no lesson data exists
function buildPlaceholderModules(course: Course) {
  return Array.from({ length: course.moduleCount }, (_, mi) => ({
    id: `module-${mi + 1}`,
    title: `Module ${mi + 1}`,
    lessons: Array.from({ length: 3 }, (_, li) => ({
      id: `module-${mi + 1}-lesson-${li + 1}`,
      title: `Lesson ${li + 1}`,
    })),
  }));
}

export default function CoursePageClient({ slug }: Props) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [progress, setProgress] = useState<LocalProgress | null>(null);

  useEffect(() => {
    getCourseBySlug(slug).then((c) => {
      if (!c) { setNotFound(true); } else { setCourse(c); }
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (course) {
      setProgress(getProgress(course.id));
    }
  }, [course]);

  const handleLessonToggle = (lessonId: string) => {
    if (!course) return;
    const updated = markLessonComplete(course.id, lessonId);
    setProgress({ ...updated });
  };

  const isLessonDone = (lessonId: string) =>
    progress?.completedLessons?.includes(lessonId) ?? false;

  if (loading) {
    return (
      <div style={{ paddingTop: '68px' }}>
        <div className="container-xl" style={{ padding: '3rem 1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 800 }}>
            {[280, 180, 120, 320, 220].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: 24, width: w, maxWidth: '100%' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div style={{
        paddingTop: '68px', minHeight: '80vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</p>
          <h1 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Course not found
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            This course doesn&apos;t exist or isn&apos;t published yet.
          </p>
          <Link href="/courses" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            color: 'var(--accent)', textDecoration: 'none', fontWeight: 600,
          }}>
            <ArrowLeft size={15} /> Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = CATEGORIES.find((c) => c.name === course.category);
  const difficultyStyle = DIFFICULTY_COLORS[course.difficulty] ?? DIFFICULTY_COLORS.Beginner;
  const coverUrl = course.cover?.publicId
    ? buildCloudinaryUrl(course.cover.publicId, { width: 1200, height: 600 })
    : course.cover?.secureUrl ?? null;
  const modules = buildPlaceholderModules(course);
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = progress?.completedLessons?.length ?? 0;
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div style={{ paddingTop: '68px' }}>
      {/* Hero banner */}
      <div style={{
        background: categoryInfo
          ? `linear-gradient(135deg, ${categoryInfo.bgColor} 0%, ${categoryInfo.color}18 100%)`
          : 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Cover image backdrop */}
        {coverUrl && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.07,
          }} />
        )}

        <div className="container-xl" style={{ padding: '3.5rem 1.5rem 3rem', position: 'relative' }}>
          {/* Back link */}
          <Link href="/courses" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            color: 'var(--text-secondary)', textDecoration: 'none',
            fontSize: '0.875rem', fontWeight: 500,
            marginBottom: '1.5rem',
            transition: 'color 0.2s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <ArrowLeft size={14} /> All courses
          </Link>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '2rem',
            alignItems: 'start',
          }} className="course-hero-grid">
            {/* Left: metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badges */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
                  background: categoryInfo?.bgColor ?? 'var(--surface-2)',
                  color: categoryInfo?.color ?? 'var(--text-secondary)',
                  border: `1px solid ${categoryInfo?.color ?? 'transparent'}30`,
                }}>
                  {categoryInfo?.emoji} {course.category}
                </span>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
                  background: difficultyStyle.bg,
                  color: difficultyStyle.text,
                }}>
                  {course.difficulty}
                </span>
              </div>

              <h1 className="font-display" style={{
                fontSize: 'clamp(1.9rem, 4vw, 3rem)',
                fontStyle: 'italic', fontWeight: 400,
                letterSpacing: '-0.025em',
                color: 'var(--text-primary)',
                margin: '0 0 0.75rem', lineHeight: 1.15,
              }}>
                {course.title}
              </h1>

              <p style={{
                fontSize: '1.05rem', color: 'var(--text-secondary)',
                lineHeight: 1.7, maxWidth: 620, marginBottom: '1.5rem',
              }}>
                {course.description || course.shortDescription}
              </p>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {[
                  { icon: Clock, label: course.duration },
                  { icon: Layers, label: `${course.moduleCount} modules` },
                  { icon: BookOpen, label: `${totalLessons} lessons` },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    color: 'var(--text-secondary)', fontSize: '0.875rem',
                  }}>
                    <Icon size={14} style={{ color: 'var(--accent)' }} />
                    {label}
                  </span>
                ))}
              </div>

              {/* Tags */}
              {course.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Tag size={12} style={{ color: 'var(--text-tertiary)' }} />
                  {course.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: '0.75rem', padding: '3px 10px',
                      borderRadius: 20, background: 'var(--surface)',
                      color: 'var(--text-tertiary)', border: '1px solid var(--border)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right: cover image */}
            {coverUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  width: 260, height: 176,
                  borderRadius: 16, overflow: 'hidden',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--card-shadow)',
                  flexShrink: 0,
                }}
                className="course-cover-img"
              >
                <img
                  src={coverUrl}
                  alt={course.cover?.alt ?? course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-xl" style={{ padding: '2.5rem 1.5rem 5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '2.5rem',
          alignItems: 'start',
        }} className="course-layout">

          {/* Left: module list */}
          <div>
            <h2 style={{
              fontWeight: 700, fontSize: '1.1rem',
              color: 'var(--text-primary)',
              margin: '0 0 1.25rem',
              letterSpacing: '-0.02em',
            }}>
              Course content
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {modules.map((mod, mi) => {
                const modDone = mod.lessons.every((l) => isLessonDone(l.id));
                return (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: mi * 0.06 }}
                    style={{
                      borderRadius: 14,
                      background: 'var(--surface)',
                      border: `1.5px solid ${modDone ? 'rgba(44,155,106,0.3)' : 'var(--border)'}`,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Module header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '1rem 1.25rem',
                      background: modDone ? 'rgba(44,155,106,0.06)' : 'var(--surface-2)',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: modDone ? '#2C9B6A' : 'var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{
                          color: modDone ? 'white' : 'var(--text-tertiary)',
                          fontSize: '0.75rem', fontWeight: 700,
                        }}>
                          {mi + 1}
                        </span>
                      </div>
                      <span style={{
                        fontWeight: 700, fontSize: '0.95rem',
                        color: 'var(--text-primary)',
                      }}>
                        {mod.title}
                      </span>
                      {modDone && (
                        <span style={{
                          marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 600,
                          color: '#2C9B6A', background: 'rgba(44,155,106,0.12)',
                          padding: '2px 8px', borderRadius: 10,
                        }}>
                          Complete
                        </span>
                      )}
                    </div>

                    {/* Lesson list */}
                    <div style={{ padding: '0.5rem 0' }}>
                      {mod.lessons.map((lesson, li) => {
                        const done = isLessonDone(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonToggle(lesson.id)}
                            style={{
                              width: '100%',
                              display: 'flex', alignItems: 'center', gap: '0.75rem',
                              padding: '0.7rem 1.25rem',
                              background: 'transparent', border: 'none',
                              cursor: 'pointer', textAlign: 'left',
                              transition: 'background 0.15s ease',
                              fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            {done
                              ? <CheckCircle2 size={17} style={{ color: '#2C9B6A', flexShrink: 0 }} />
                              : <Circle size={17} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                            }
                            <span style={{
                              fontSize: '0.9rem',
                              color: done ? 'var(--text-tertiary)' : 'var(--text-primary)',
                              textDecoration: done ? 'line-through' : 'none',
                              flex: 1,
                            }}>
                              {lesson.title}
                            </span>
                            <span style={{
                              fontSize: '0.72rem', color: 'var(--text-tertiary)',
                              flexShrink: 0,
                            }}>
                              {8 + li * 3} min
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: sticky sidebar */}
          <div style={{ position: 'sticky', top: '88px' }}>
            {/* Progress card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              style={{
                borderRadius: 16,
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                padding: '1.5rem',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{
                fontWeight: 700, fontSize: '0.95rem',
                color: 'var(--text-primary)',
                margin: '0 0 1rem', letterSpacing: '-0.01em',
              }}>
                Your progress
              </h3>

              {/* Progress bar */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '0.4rem',
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {completedCount} of {totalLessons} lessons
                  </span>
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 700,
                    color: pct === 100 ? '#2C9B6A' : 'var(--accent)',
                  }}>
                    {pct}%
                  </span>
                </div>
                <div style={{
                  height: 8, borderRadius: 4,
                  background: 'var(--surface-2)',
                  overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      height: '100%', borderRadius: 4,
                      background: pct === 100
                        ? 'linear-gradient(90deg, #2C9B6A, #059669)'
                        : 'linear-gradient(90deg, var(--accent), #8B5CF6)',
                    }}
                  />
                </div>
              </div>

              {pct === 100 ? (
                <div style={{
                  padding: '0.75rem', borderRadius: 10,
                  background: 'rgba(44,155,106,0.1)',
                  border: '1px solid rgba(44,155,106,0.25)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: '1.2rem', margin: '0 0 0.25rem' }}>🎉</p>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2C9B6A', margin: 0 }}>
                    Course complete!
                  </p>
                </div>
              ) : (
                <button style={{
                  width: '100%', padding: '0.75rem',
                  borderRadius: 10, background: 'var(--accent)',
                  color: 'white', border: 'none',
                  cursor: 'pointer', fontWeight: 600,
                  fontSize: '0.9rem', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '0.4rem',
                  transition: 'background 0.2s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; }}
                >
                  {completedCount === 0 ? 'Start learning' : 'Continue'} <ArrowRight size={15} />
                </button>
              )}
            </motion.div>

            {/* Privacy notice */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              style={{
                borderRadius: 14,
                background: 'var(--accent-lighter)',
                border: '1px solid rgba(79,126,247,0.15)',
                padding: '1rem 1.25rem',
                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              }}
            >
              <ShieldCheck size={16} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
              <p style={{
                fontSize: '0.8rem', color: 'var(--text-secondary)',
                margin: 0, lineHeight: 1.55,
              }}>
                Your progress is saved{' '}
                <strong style={{ color: 'var(--text-primary)' }}>only on this device</strong>.
                Nothing is uploaded or tracked.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .course-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .course-hero-grid { grid-template-columns: 1fr !important; }
          .course-cover-img { display: none !important; }
        }
      `}</style>
    </div>
  );
}
