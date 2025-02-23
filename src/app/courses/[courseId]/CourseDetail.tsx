'use client';

import { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Course } from '@/lib/types/courses';
import { useUser } from '@clerk/nextjs';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Users, Briefcase, MessageSquare } from 'lucide-react';
import Navigation from '@/app/components/Navigation';

// Create a type for the serialized course
type SerializedCourse = Omit<Course, 'icon'> & {
  icon: string;
};

type Props = {
  course: SerializedCourse;
};

export default function CourseDetail({ course }: Props) {
  const { user } = useUser();
  const supabase = useSupabaseAuth();
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get the icon component based on the string name
  const Icon = {
    Users,
    Briefcase,
    MessageSquare
  }[course.icon] || Users;

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: enrollmentError } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', course.id)
          .maybeSingle();

        if (enrollmentError) throw enrollmentError;
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

  const handleEnroll = async () => {
    if (!user || !supabase) return;

    try {
      setError(null);
      setIsLoading(true);

      const { error: enrollmentError } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id
        });

      if (enrollmentError) throw enrollmentError;
      setIsEnrolled(true);
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Failed to enroll in course');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="md:pl-64 transition-all duration-200">
        <nav className="bg-[#2C3E50] p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/courses" className="text-white hover:text-gray-300">
                ← Back to Courses
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-white bg-opacity-10">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-white text-2xl font-bold">{course.title}</h1>
              </div>
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

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-[#34495E] text-lg">Loading...</p>
            </div>
          ) : !isEnrolled ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">
                Enroll to Access Course Content
              </h3>
              <p className="text-[#34495E] mb-6">
                {course.description}
              </p>
              <button
                onClick={handleEnroll}
                className="bg-[#27AE60] text-white px-6 py-3 rounded-lg hover:bg-[#219653] transition-colors"
              >
                Enroll Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {course.chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#2C3E50]">
                        {chapter.title}
                      </h3>
                      <p className="text-[#34495E] mt-1">
                        {chapter.description}
                      </p>
                    </div>
                    <Link
                      href={`/courses/${course.id}/chapters/${index + 1}`}
                      className="bg-[#27AE60] text-white px-4 py-2 rounded hover:bg-[#219653] transition-colors"
                    >
                      Start Chapter
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
} 