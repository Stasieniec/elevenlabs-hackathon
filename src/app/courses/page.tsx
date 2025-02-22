'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { BookOpen, Users, MessageSquare, Briefcase, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import ConfirmDialog from '../components/ConfirmDialog';

type Course = {
  id: number;
  title: string;
  description: string;
  progress: number;
  totalChapters: number;
  completedChapters: number;
  icon: LucideIcon;
  category: string;
  categoryColor: string;
};

// Temporary mock data
const coursesData: Course[] = [
  {
    id: 1,
    title: 'Small Talk Mastery',
    description: 'Learn to navigate casual conversations with confidence and ease.',
    progress: 60,
    totalChapters: 5,
    completedChapters: 3,
    icon: Users,
    category: 'Social Skills',
    categoryColor: '#F39C12',
  },
  {
    id: 2,
    title: 'Professional Negotiations',
    description: 'Master the art of business negotiations and deal-making.',
    progress: 30,
    totalChapters: 6,
    completedChapters: 2,
    icon: Briefcase,
    category: 'Professional',
    categoryColor: '#27AE60',
  },
  {
    id: 3,
    title: 'Interview Excellence',
    description: 'Prepare for job interviews and learn to present yourself effectively.',
    progress: 15,
    totalChapters: 4,
    completedChapters: 1,
    icon: MessageSquare,
    category: 'Career',
    categoryColor: '#2C3E50',
  },
];

export default function CoursesPage() {
  const { user } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseToUnenroll, setCourseToUnenroll] = useState<Course | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) return;

      try {
        const { data: enrollments, error } = await supabase
          .from('course_enrollments')
          .select('course_id')
          .eq('user_id', user.id);

        if (error) throw error;

        // Filter coursesData to get only enrolled courses
        const enrolledCourseIds = enrollments.map(e => parseInt(e.course_id));
        const userCourses = coursesData.filter(course => 
          enrolledCourseIds.includes(course.id)
        );

        setEnrolledCourses(userCourses);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  const handleUnenroll = async () => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    if (!courseToUnenroll) {
      console.error('No course selected for unenrollment');
      return;
    }

    try {
      // First verify the enrollment exists
      const { data: existing } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseToUnenroll.id.toString())
        .single();

      if (!existing) {
        console.error('Not enrolled in this course');
        return;
      }

      const { error } = await supabase
        .from('course_enrollments')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseToUnenroll.id.toString());

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      // Remove course from state
      setEnrolledCourses(prev => 
        prev.filter(course => course.id !== courseToUnenroll.id)
      );
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      // Show error message to user
    } finally {
      setCourseToUnenroll(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
          <div className="text-center">Loading your courses...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 rounded-full bg-[#27AE60] bg-opacity-10">
            <BookOpen size={32} className="text-[#27AE60]" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">My Courses</h1>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-[#34495E] text-lg mb-4">
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
          <div className="grid grid-cols-1 gap-6">
            {enrolledCourses.map((course) => {
              const Icon = course.icon;
              return (
                <div 
                  key={course.id}
                  className="bg-white rounded-xl p-6 shadow-sm group relative"
                >
                  <button
                    onClick={() => setCourseToUnenroll(course)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Unenroll from course"
                  >
                    <Trash2 size={20} />
                  </button>

                  <Link 
                    href={`/courses/${course.id}`}
                    className="flex items-start space-x-4"
                  >
                    <div className="p-3 rounded-full bg-opacity-10" style={{ backgroundColor: `${course.categoryColor}20` }}>
                      <Icon size={24} style={{ color: course.categoryColor }} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span 
                            className="text-sm font-medium px-3 py-1 rounded-full" 
                            style={{ 
                              backgroundColor: `${course.categoryColor}20`,
                              color: course.categoryColor
                            }}
                          >
                            {course.category}
                          </span>
                          <h2 className="text-xl font-semibold text-[#2C3E50] mt-2 group-hover:text-[#27AE60] transition-colors">
                            {course.title}
                          </h2>
                        </div>
                      </div>
                      
                      <p className="text-[#34495E] mt-2">
                        {course.description}
                      </p>
                      
                      <div className="mt-4">
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${course.progress}%`,
                              backgroundColor: course.categoryColor
                            }}
                          />
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          {course.completedChapters} of {course.totalChapters} chapters completed
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
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