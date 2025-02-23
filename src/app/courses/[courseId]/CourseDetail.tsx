'use client';

import { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Course } from '@/lib/courses';
import { useUser } from '@clerk/nextjs';
import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';

type Props = {
  course: Course;
};

export default function CourseDetail({ course }: Props) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const router = useRouter();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterProgress, setChapterProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !supabase) return;

      try {
        const userId = user.id.replace('user_', '');
        const { data, error } = await supabase
          .from('course_enrollments')
          .select('id')
          .eq('user_id', userId)
          .eq('course_id', course.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setIsEnrolled(!!data);
      } catch (err) {
        console.error('Error checking enrollment:', err);
        setError('Failed to check enrollment status');
      } finally {
        setIsLoading(false);
      }
    };

    checkEnrollment();
  }, [user, supabase, course.id]);

  useEffect(() => {
    async function fetchProgress() {
      if (!user || !supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: progress } = await supabase
          .from('chapter_progress')
          .select('chapter_id, completion_percentage')
          .eq('course_id', course.id)
          .eq('user_id', user.id);

        if (progress) {
          const progressMap = progress.reduce((acc, curr) => ({
            ...acc,
            [curr.chapter_id]: curr.completion_percentage
          }), {});
          setChapterProgress(progressMap);
        }
      } catch (error) {
        console.error('Error fetching chapter progress:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgress();
  }, [user, supabase, course.id]);

  return (
    <>
      <nav className="bg-[#2C3E50] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/courses" className="text-white hover:text-gray-300">
              ← Back to Courses
            </Link>
            <h1 className="text-white text-2xl font-bold">{course.title}</h1>
          </div>
          <UserButton afterSignOutUrl="/"/>
        </div>
      </nav>
      
      <main className="container mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Chapters</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {course.chapters.map((chapter) => (
            <div 
              key={chapter.id}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-[#34495E] text-xl font-semibold mb-2">
                    {chapter.title}
                  </h3>
                  {chapter.description && (
                    <p className="text-gray-600 mb-4">{chapter.description}</p>
                  )}
                  {!isLoading && chapterProgress[chapter.id] > 0 && (
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full w-full">
                        <div 
                          className="h-full bg-[#27AE60] rounded-full transition-all duration-300"
                          style={{ width: `${chapterProgress[chapter.id]}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {chapterProgress[chapter.id]}% complete
                      </p>
                    </div>
                  )}
                </div>
                <Link
                  href={`/courses/${course.id}/chapters/${chapter.id}`}
                  className="inline-block bg-[#27AE60] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
                >
                  {chapterProgress[chapter.id] > 0 ? 'Continue Chapter' : 'Start Chapter'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
} 