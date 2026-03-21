'use client';

import { useState, useEffect, useCallback } from 'react';

export type CourseProgress = {
  enrolled: boolean;
  completedLessons: number[];
  enrolledAt: string;
  completedAt?: string;
};

type AllProgress = Record<number, CourseProgress>;

export function useProgress(courseId: number) {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('forex_progress');
    const all: AllProgress = stored ? JSON.parse(stored) : {};
    setProgress(all[courseId] ?? null);
    setLoaded(true);
  }, [courseId]);

  const save = useCallback((updated: AllProgress) => {
    localStorage.setItem('forex_progress', JSON.stringify(updated));
  }, []);

  const getAll = useCallback((): AllProgress => {
    const stored = localStorage.getItem('forex_progress');
    return stored ? JSON.parse(stored) : {};
  }, []);

  const enroll = useCallback(() => {
    const all = getAll();
    all[courseId] = {
      enrolled: true,
      completedLessons: [],
      enrolledAt: new Date().toISOString(),
    };
    save(all);
    setProgress(all[courseId]);
  }, [courseId, getAll, save]);

  const completeLesson = useCallback((lessonIndex: number, totalLessons: number) => {
    const all = getAll();
    const current = all[courseId] ?? { enrolled: true, completedLessons: [], enrolledAt: new Date().toISOString() };
    if (!current.completedLessons.includes(lessonIndex)) {
      current.completedLessons = [...current.completedLessons, lessonIndex];
    }
    if (current.completedLessons.length === totalLessons && !current.completedAt) {
      current.completedAt = new Date().toISOString();
    }
    all[courseId] = current;
    save(all);
    setProgress({ ...current });
  }, [courseId, getAll, save]);

  const resetCourse = useCallback(() => {
    const all = getAll();
    all[courseId] = { enrolled: true, completedLessons: [], enrolledAt: new Date().toISOString() };
    save(all);
    setProgress(all[courseId]);
  }, [courseId, getAll, save]);

  const uncompleteLesson = useCallback((lessonIndex: number) => {
    const all = getAll();
    const current = all[courseId];
    if (!current) return;
    current.completedLessons = current.completedLessons.filter((i) => i !== lessonIndex);
    delete current.completedAt;
    all[courseId] = current;
    save(all);
    setProgress({ ...current });
  }, [courseId, getAll, save]);

  const isLessonComplete = useCallback((lessonIndex: number): boolean => {
    return progress?.completedLessons.includes(lessonIndex) ?? false;
  }, [progress]);

  const progressPercent = useCallback((totalLessons: number): number => {
    if (!progress) return 0;
    return Math.round((progress.completedLessons.length / totalLessons) * 100);
  }, [progress]);

  return { progress, loaded, enroll, resetCourse, completeLesson, uncompleteLesson, isLessonComplete, progressPercent };
}
