'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { BookOpen, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import ConfirmDialog from '../components/ConfirmDialog';
import { courses } from '@/lib/courses';

type Course = {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalChapters: number;
  completedChapters: number;
  icon: LucideIcon;
  category: string;
  categoryColor: string;
};

export default function CoursesPage() {
  const { user } = useUser();
  const supabase = useSupabaseAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseToUnenroll, setCourseToUnenroll] = useState<Course | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('course_enrollments')
          .select('course_id')
          .eq('user_id', user.id);

        if (enrollmentsError) throw enrollmentsError;

        // Get enrolled courses from our static data
        const userCourses = enrollments?.map(enrollment => {
          const course = courses.find(c => c.id === enrollment.course_id);
          if (!course) return null;
          
          return {
            id: course.id,
            title: course.title,
            description: course.description,
            progress: 0, // We'll implement proper progress tracking later
            totalChapters: course.chapters.length,
            completedChapters: 0, // We'll implement this later
            icon: course.icon,
            category: course.category,
            categoryColor: course.categoryColor,
          };
        }).filter((course): course is Course => course !== null) || [];

        setEnrolledCourses(userCourses);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchEnrolledCourses();
  }, [user, supabase]);

  const handleUnenroll = async () => {
    if (!user || !supabase || !courseToUnenroll) {
      console.error('Missing required data for unenrollment');
      return;
    }

    try {
      setError(null);

      // Get the static course data which contains chapters and situations
      const staticCourse = courses.find(c => c.id === courseToUnenroll.id);
      if (!staticCourse) {
        throw new Error('Course not found in static data');
      }

      // 1. Delete chapter progress first (due to foreign key constraint)
      const { error: chapterError } = await supabase
        .from('chapter_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseToUnenroll.id);

      if (chapterError) throw chapterError;

      // 2. Delete user progress for all situations in this course
      const { error: progressError } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)
        .in(
          'situation_id', 
          staticCourse.chapters.flatMap(chapter => 
            chapter.situations.map(situation => situation.id)
          )
        );

      if (progressError) throw progressError;

      // 3. Delete course enrollment (must be last due to foreign key constraints)
      const { error: deleteError } = await supabase
        .from('course_enrollments')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseToUnenroll.id);

      if (deleteError) throw deleteError;

      // Remove course from state
      setEnrolledCourses(prev => 
        prev.filter(course => course.id !== courseToUnenroll.id)
      );
    } catch (err) {
      console.error('Error unenrolling from course:', err);
      setError('Failed to unenroll from the course. Please try again later.');
    } finally {
      setCourseToUnenroll(null);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <Navigation />
        <div className="md:pl-64 transition-all duration-200">
          <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
            <div className="text-center">
              <p className="text-[#34495E] text-lg">Please sign in to view your courses.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!supabase) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <Navigation />
        <div className="md:pl-64 transition-all duration-200">
          <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
            <div className="text-center">
              <p className="text-[#34495E] text-lg">Initializing...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="md:pl-64 transition-all duration-200">
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-[#27AE60] bg-opacity-10">
                <BookOpen size={32} className="text-[#27AE60]" />
              </div>
              <h1 className="text-3xl font-bold text-[#2C3E50]">My Courses</h1>
            </div>
            <Link 
              href="/courses/browse"
              className="bg-[#27AE60] text-white px-6 py-2 rounded-lg hover:bg-[#219653] transition-colors"
            >
              Browse Courses
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#34495E] text-lg">Loading your courses...</p>
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="mb-4">
                <BookOpen size={48} className="text-gray-400 mx-auto" />
              </div>
              <p className="text-[#34495E] mb-4">
                You haven&apos;t enrolled in any courses yet.
              </p>
              <Link 
                href="/courses/browse"
                className="inline-block bg-[#27AE60] text-white px-6 py-3 rounded-lg hover:bg-[#219653] transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {enrolledCourses.map((course) => {
                const Icon = course.icon;
                return (
                  <div 
                    key={course.id}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div 
                          className="p-3 rounded-full bg-opacity-10"
                          style={{ backgroundColor: `${course.categoryColor}20` }}
                        >
                          <Icon size={24} style={{ color: course.categoryColor }} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span 
                              className="text-sm font-medium px-3 py-1 rounded-full"
                              style={{ 
                                backgroundColor: `${course.categoryColor}20`,
                                color: course.categoryColor
                              }}
                            >
                              {course.category}
                            </span>
                            <span className="text-sm text-gray-600">
                              {course.completedChapters} of {course.totalChapters} chapters completed
                            </span>
                          </div>
                          <h2 className="text-xl font-semibold text-[#2C3E50] mb-2">
                            {course.title}
                          </h2>
                          <p className="text-[#34495E] mb-4">
                            {course.description}
                          </p>
                          <div className="flex items-center space-x-4">
                            <Link
                              href={`/courses/${course.id}`}
                              className="bg-[#27AE60] text-white px-4 py-2 rounded hover:bg-[#219653] transition-colors"
                            >
                              Continue Learning
                            </Link>
                            <button
                              onClick={() => setCourseToUnenroll(course)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-[#27AE60] rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!courseToUnenroll}
        title="Unenroll from Course"
        message={`Are you sure you want to unenroll from ${courseToUnenroll?.title}? Your progress will be lost.`}
        confirmLabel="Unenroll"
        cancelLabel="Cancel"
        onConfirm={handleUnenroll}
        onCancel={() => setCourseToUnenroll(null)}
      />
    </main>
  );
} 