'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import CourseCard from '@/components/CourseCard';
import { CATEGORIES } from '@/lib/categories';
import type { Category, SortOption } from '@/types';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'alphabetical', label: 'A–Z' },
];

export default function CoursesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category') as Category | null;
    if (cat) setCategory(cat);
  }, [searchParams]);

  const { courses, loading, error } = useCourses({ category, search, sort, difficulty });

  const clearFilters = () => {
    setSearch('');
    setCategory(null);
    setDifficulty(null);
    setSort('newest');
    router.push(pathname);
  };

  const hasActiveFilters = !!search || !!category || !!difficulty || sort !== 'newest';
  const activeFilterCount = [category, difficulty].filter(Boolean).length;

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '3.5rem 0 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,126,247,0.06) 0%, transparent 65%)',
          transform: 'translate(30%, -30%)',
          pointerEvents: 'none',
        }} />
        <div className="container-xl" style={{ position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <p style={{
              fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem',
            }}>
              Course Library
            </p>
            <h1 className="font-display" style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontStyle: 'italic', fontWeight: 400,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              margin: '0 0 0.75rem',
            }}>
              Find your next lesson
            </h1>
            <p style={{
              color: 'var(--text-secondary)', fontSize: '1.05rem',
              margin: 0, maxWidth: 500,
            }}>
              Browse our library of practical, self-paced courses. No account needed to start.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-xl" style={{ padding: '2rem 1.5rem 5rem' }}>
        {/* Search + filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{
            display: 'flex', gap: '0.75rem',
            marginBottom: '1.25rem', flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div style={{ flex: '1 1 280px', position: 'relative', minWidth: 200 }}>
            <Search size={15} style={{
              position: 'absolute', left: 13, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-tertiary)',
              pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search courses, topics, tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.72rem 2.4rem 0.72rem 2.6rem',
                borderRadius: 12,
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute', right: 10, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: '50%', width: 20, height: 20,
                    cursor: 'pointer', color: 'var(--text-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0,
                  }}
                >
                  <X size={10} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Sort select */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            style={{
              padding: '0.72rem 1rem',
              borderRadius: 12,
              background: 'var(--surface)',
              border: '1.5px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              padding: '0.72rem 1rem',
              borderRadius: 12,
              background: showFilters ? 'var(--accent-light)' : 'var(--surface)',
              border: `1.5px solid ${showFilters ? 'var(--accent)' : 'var(--border)'}`,
              color: showFilters ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
              transition: 'all 0.2s ease', fontFamily: 'inherit',
            }}
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span style={{
                width: 18, height: 18,
                background: 'var(--accent)', color: 'white',
                borderRadius: '50%', fontSize: '0.68rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                onClick={clearFilters}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.72rem 0.9rem',
                  borderRadius: 12,
                  background: 'transparent',
                  border: '1.5px solid var(--border)',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer', fontSize: '0.82rem',
                  transition: 'all 0.2s ease', fontFamily: 'inherit',
                }}
              >
                <X size={12} /> Clear all
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: '1.25rem' }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                padding: '1.5rem',
                background: 'var(--surface)',
                borderRadius: 16,
                border: '1.5px solid var(--border)',
                display: 'flex', flexDirection: 'column', gap: '1.25rem',
              }}>
                {/* Category */}
                <div>
                  <p style={{
                    fontWeight: 600, fontSize: '0.76rem',
                    color: 'var(--text-tertiary)', marginBottom: '0.75rem',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    Category
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {CATEGORIES.map((cat) => {
                      const active = category === cat.name;
                      return (
                        <button
                          key={cat.name}
                          onClick={() => setCategory(active ? null : cat.name)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: 20,
                            background: active ? cat.bgColor : 'var(--bg)',
                            border: `1.5px solid ${active ? cat.color + '55' : 'var(--border)'}`,
                            color: active ? cat.color : 'var(--text-secondary)',
                            cursor: 'pointer', fontSize: '0.82rem',
                            fontWeight: active ? 700 : 500,
                            transition: 'all 0.2s ease', fontFamily: 'inherit',
                          }}
                        >
                          {cat.emoji} {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <p style={{
                    fontWeight: 600, fontSize: '0.76rem',
                    color: 'var(--text-tertiary)', marginBottom: '0.75rem',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    Difficulty
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {DIFFICULTIES.map((d) => {
                      const active = difficulty === d;
                      return (
                        <button
                          key={d}
                          onClick={() => setDifficulty(active ? null : d)}
                          style={{
                            padding: '5px 14px',
                            borderRadius: 20,
                            background: active ? 'var(--accent-light)' : 'var(--bg)',
                            border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                            color: active ? 'var(--accent)' : 'var(--text-secondary)',
                            cursor: 'pointer', fontSize: '0.82rem',
                            fontWeight: active ? 700 : 500,
                            transition: 'all 0.2s ease', fontFamily: 'inherit',
                          }}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results summary */}
        <AnimatePresence mode="wait">
          {!loading && (
            <motion.p
              key={`${courses.length}-${category}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: 'var(--text-tertiary)', fontSize: '0.84rem',
                marginBottom: '1.25rem',
              }}
            >
              {courses.length === 0
                ? 'No courses found'
                : `${courses.length} course${courses.length !== 1 ? 's' : ''}`}
              {category ? ` in ${category}` : ''}
              {search ? ` matching "${search}"` : ''}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Loading skeletons */}
        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                height: 420, borderRadius: 16,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, var(--surface-2) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }} />
              </div>
            ))}
            <style>{`@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }`}</style>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{
            padding: '3rem', borderRadius: 16,
            background: 'var(--surface)', border: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>⚠️</p>
            <p style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Couldn&apos;t load courses
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && courses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '5rem 2rem', textAlign: 'center',
              borderRadius: 20,
              background: 'var(--surface)',
              border: '1.5px dashed var(--border)',
            }}
          >
            <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</p>
            <h3 style={{
              fontWeight: 700, fontSize: '1.1rem',
              color: 'var(--text-primary)', marginBottom: '0.5rem',
            }}>
              No courses found
            </h3>
            <p style={{
              color: 'var(--text-secondary)', fontSize: '0.9rem',
              maxWidth: 340, margin: '0 auto 1.5rem',
            }}>
              Try adjusting your search or removing some filters.
            </p>
            <button
              onClick={clearFilters}
              style={{
                padding: '0.7rem 1.5rem',
                borderRadius: 10, background: 'var(--accent)',
                color: 'white', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {/* Course grid */}
        {!loading && !error && courses.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}>
            {courses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
