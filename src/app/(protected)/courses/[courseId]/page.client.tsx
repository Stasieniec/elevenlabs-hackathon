'use client';

import { useUser } from '@clerk/nextjs';
import Navigation from '../../../components/Navigation';
import { useState, useEffect } from 'react';
import { useSupabase } from '../../../supabase-provider';
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface DbCourse {
  id: string;
  title: string;
  description: string;
  category_id?: string;
  image_url?: string;
  icon?: string;
  icon_color?: string;
  estimated_duration?: number;
  created_at?: string;
  updated_at?: string;
}

interface DbLesson {
  id: string;
  title: string;
  description: string;
  course_id: string;
  order_number: number;
  created_at?: string;
  updated_at?: string;
}

interface CourseDetailProps {
  course: DbCourse;
  lessons: DbLesson[];
}

export default function CourseDetailPage({ course, lessons }: CourseDetailProps) {
  const { user } = useUser();
  const supabase = useSupabase().supabase;
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', course.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error checking enrollment:', error);
        }

        setIsEnrolled(!!data);

        // Fetch lesson progress if enrolled
        if (data) {
          await fetchLessonProgress();
        }
      } catch (err) {
        console.error('Error in enrollment check:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLessonProgress = async () => {
      if (!user || !supabase || !lessons || lessons.length === 0) return;

      try {
        // Get progress for all lessons in this course
        const { data: progress, error } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .in('lesson_id', lessons.map(lesson => lesson.id));
            
        if (error) throw error;
        
        // Create a map of lesson ID to completion status
        const progressMap: Record<string, boolean> = {};
        
        progress?.forEach(p => {
          progressMap[p.lesson_id] = p.completed;
        });
        
        setLessonProgress(progressMap);
      } catch (err) {
        console.error('Error fetching lesson progress:', err);
      }
    };

    setLoading(true);
    checkEnrollment();
  }, [user, supabase, course.id, lessons]);

  const handleEnroll = async () => {
    if (!user || !supabase) {
      console.error('User or Supabase client not available');
      return;
    }

    setEnrolling(true);

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id
        });

      if (error) throw error;

      setIsEnrolled(true);
    } catch (err) {
      console.error('Error enrolling in course:', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <Navigation />
        <div className="md:pl-64 transition-all duration-200">
          <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
            <div className="text-center">
              <p className="text-[#34495E] text-lg">Please sign in to view course details.</p>
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
          <div className="mb-8">
            <Link 
              href="/courses"
              className="flex items-center text-[#34495E] hover:text-[#2C3E50] font-medium mb-6"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to My Courses
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
              <h1 className="text-3xl font-bold text-[#2C3E50]">
                {course.title}
              </h1>
              
              {!isEnrolled ? (
                <button 
                  className="bg-[#27AE60] text-white font-medium px-6 py-2 rounded-lg hover:bg-[#219653] transition-colors"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll in Course'}
                </button>
              ) : (
                <div className="flex items-center text-[#27AE60] bg-[#27AE60] bg-opacity-10 px-4 py-2 rounded-lg">
                  <CheckCircle size={18} className="mr-2" />
                  <span className="font-medium">Enrolled</span>
                </div>
              )}
            </div>
            
            <p className="text-[#34495E] text-lg mb-6">
              {course.description}
            </p>
            
            <div className="flex items-center text-[#7F8C8D] mb-8">
              <div className="flex items-center mr-6">
                <Clock size={18} className="mr-2" />
                <span>{course.estimated_duration || 'N/A'} minutes</span>
              </div>
              <div className="flex items-center">
                <BookOpen size={18} className="mr-2" />
                <span>{lessons?.length || 0} lessons</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6">Course Lessons</h2>
            
            {loading ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-[#34495E]">Loading course content...</p>
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-[#34495E]">No lessons available for this course yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lessons.map((lesson, index) => (
                  <div 
                    key={lesson.id}
                    className="bg-white rounded-xl p-6 shadow-sm flex flex-col"
                  >
                    <div className="flex items-center mb-3">
                      {lessonProgress[lesson.id] ? (
                        <div className="rounded-full p-1 bg-[#27AE60] bg-opacity-10 mr-3">
                          <CheckCircle size={20} className="text-[#27AE60]" />
                        </div>
                      ) : (
                        <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center mr-3">
                          <span className="font-medium">{index + 1}</span>
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-[#2C3E50] line-clamp-1">
                        {lesson.title}
                      </h3>
                    </div>
                    
                    <p className="text-[#34495E] text-sm mb-4 line-clamp-2 flex-grow">
                      {lesson.description}
                    </p>
                    
                    <Link 
                      href={isEnrolled ? `/courses/${course.id}/lessons/${lesson.id}` : '#'}
                      onClick={(e) => !isEnrolled && e.preventDefault()}
                      className={`flex items-center justify-center py-2 px-4 rounded-lg ${
                        isEnrolled 
                          ? 'bg-[#3498DB] text-white hover:bg-[#2980B9]' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      } transition-colors w-full`}
                    >
                      {isEnrolled ? 'Start Lesson' : 'Enroll to Access'}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 