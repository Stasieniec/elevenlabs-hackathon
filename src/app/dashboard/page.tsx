'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Target, BookOpen, MessageSquare, Loader2 } from 'lucide-react';
import { courses } from '@/lib/courses';
import Navigation from '../components/Navigation';
import { useAuth } from '@clerk/nextjs';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function DashboardPage() {
  const { userId } = useAuth();
  const supabase = useSupabaseAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<typeof courses>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!userId || !supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: enrollments, error } = await supabase
          .from('course_enrollments')
          .select('course_id')
          .eq('user_id', userId);

        if (error) throw error;

        // Map enrolled course IDs to actual course data
        const enrolledCourseData = enrollments
          .map(enrollment => courses.find(c => c.id === enrollment.course_id))
          .filter(course => course !== undefined) as typeof courses;

        setEnrolledCourses(enrolledCourseData);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId, supabase]);

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      <div className="container mx-auto mt-8 px-4 space-y-12 pb-12">
        {/* Welcome Section */}
        <section>
          <h2 className="text-3xl font-bold text-neutral-dark mb-6">Welcome to Oratoria</h2>
          <p className="text-neutral text-lg mb-8">
            Master the art of conversation through interactive practice and AI-powered feedback.
          </p>
        </section>

        {/* Quick Access Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/quick-training"
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all group border border-gray-100 flex items-start space-x-6"
            >
              <div className="p-4 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-dark mb-2 group-hover:text-primary transition-colors">
                  Quick Training
                </h3>
                <p className="text-neutral">
                  Practice specific conversation scenarios in short, focused sessions.
                </p>
              </div>
            </Link>

            <Link 
              href="/custom"
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all group border border-gray-100 flex items-start space-x-6"
            >
              <div className="p-4 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                <MessageSquare className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-dark mb-2 group-hover:text-secondary transition-colors">
                  Custom Situation
                </h3>
                <p className="text-neutral">
                  Create and practice your own unique conversation scenarios.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* My Courses */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-dark">My Courses</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Link 
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${course.categoryColor}20` }}
                    >
                      <course.icon 
                        className="w-6 h-6"
                        style={{ color: course.categoryColor }}
                      />
                    </div>
                    <div>
                      <span 
                        className="text-sm font-medium px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${course.categoryColor}20`,
                          color: course.categoryColor
                        }}
                      >
                        {course.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-neutral-dark mb-2">
                    {course.title}
                  </h3>
                  <p className="text-neutral mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-neutral">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {course.difficulty}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <h3 className="text-xl font-semibold text-neutral-dark mb-4">
                You haven&apos;t enrolled in any courses yet
              </h3>
              <p className="text-neutral mb-8">
                Start your journey by exploring our available courses and find the ones that match your goals.
              </p>
              <Link 
                href="/courses/browse"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Browse Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
} 