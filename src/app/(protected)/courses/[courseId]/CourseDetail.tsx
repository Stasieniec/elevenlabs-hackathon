'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Course } from '@/lib/types/courses';
import { useUser } from '@clerk/nextjs';
import { useSupabase } from '../../../supabase-provider';
import { Users, Briefcase, MessageCircle, ArrowLeft, BookOpen, Target } from 'lucide-react';
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
  const supabase = useSupabase().supabase;
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get the icon component based on the string name
  const Icon = {
    Users,
    Briefcase,
    MessageCircle
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
        <main className="max-w-4xl mx-auto px-4 pt-20 pb-12">
          {/* Back button */}
          <Link 
            href="/courses"
            className="inline-flex items-center text-[#7F8C8D] hover:text-[#2C3E50] transition-colors mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Courses
          </Link>

          {/* Course Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-start space-x-4">
                <div 
                  className="p-4 rounded-xl bg-opacity-10"
                  style={{ backgroundColor: `${course.categoryColor}20` }}
                >
                  <Icon size={32} style={{ color: course.categoryColor }} />
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
                  </div>
                  <h1 className="text-3xl font-bold text-[#2C3E50] mb-3">{course.title}</h1>
                  <p className="text-[#7F8C8D] text-lg leading-relaxed">{course.description}</p>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="px-8 py-4 bg-[#F8FAFC] flex items-center space-x-6">
              <div className="flex items-center text-[#7F8C8D]">
                <BookOpen className="w-5 h-5 mr-2" />
                <span>{course.chapters.length} Chapters</span>
              </div>
              <div className="flex items-center text-[#7F8C8D]">
                <Target className="w-5 h-5 mr-2" />
                <span>{course.chapters.reduce((acc, chapter) => acc + chapter.situations.length, 0)} Situations</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#27AE60]/20 border-t-[#27AE60] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#7F8C8D]">Loading course content...</p>
            </div>
          ) : !isEnrolled ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">
                Ready to Begin Your Journey?
              </h3>
              <p className="text-[#7F8C8D] text-lg mb-8 max-w-2xl mx-auto">
                Enroll now to access all course materials and start practicing with our AI-powered conversation scenarios.
              </p>
              <button
                onClick={handleEnroll}
                className="bg-[#27AE60] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#219653] transition-all transform hover:scale-105"
              >
                Enroll Now
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Course Content</h2>
              <div className="space-y-4">
                {course.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-[#7F8C8D]">
                            Chapter {index + 1}
                          </span>
                          <span className="text-sm bg-[#F8FAFC] text-[#7F8C8D] px-2 py-1 rounded">
                            {chapter.situations.length} Situations
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                          {chapter.title}
                        </h3>
                        <p className="text-[#7F8C8D] leading-relaxed">
                          {chapter.description}
                        </p>
                      </div>
                      <Link
                        href={`/courses/${course.id}/chapters/${chapter.id}`}
                        className="ml-6 inline-flex items-center bg-[#27AE60] text-white px-6 py-3 rounded-lg hover:bg-[#219653] transition-all transform hover:scale-105"
                      >
                        Start Chapter
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
} 