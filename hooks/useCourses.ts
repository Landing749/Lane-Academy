'use client';

import { useState, useEffect, useCallback } from 'react';
import { subscribeToCourses, subscribeToFeaturedCourses } from '@/lib/firebase';
import type { Course, Category, SortOption } from '@/types';

interface UseCoursesOptions {
  featuredOnly?: boolean;
  category?: Category | null;
  search?: string;
  sort?: SortOption;
  difficulty?: string | null;
}

export function useCourses(options: UseCoursesOptions = {}) {
  const { featuredOnly = false, category, search, sort = 'newest', difficulty } = options;
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const subscribe = featuredOnly ? subscribeToFeaturedCourses : subscribeToCourses;
    const unsubscribe = subscribe(
      (courses) => {
        setAllCourses(courses);
        setLoading(false);
        setError(null);
      },
      () => {
        setError('Unable to load courses. Please try again later.');
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [featuredOnly]);

  const filtered = useCallback(() => {
    let result = [...allCourses];

    if (category) {
      result = result.filter((c) => c.category === category);
    }

    if (difficulty) {
      result = result.filter((c) => c.difficulty === difficulty);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.tags?.some((t) => t.toLowerCase().includes(q)) ||
          c.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'newest':
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popular':
        // Featured courses first as a proxy for popularity
        result.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return result;
  }, [allCourses, category, difficulty, search, sort]);

  return {
    courses: filtered(),
    loading,
    error,
    total: allCourses.length,
  };
}
