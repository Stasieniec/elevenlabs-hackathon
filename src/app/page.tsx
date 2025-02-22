'use client';

import { useState, useEffect } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Zap, PlusCircle, ChevronRight, ArrowRight, BookOpen } from 'lucide-react';
import Navigation from './components/Navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { courses } from '@/lib/courses';

type Course = {
  id: string;
  title: string;
  description: string;
  progress: number;
  lastAccessed: string;
};

export default function Home() {
  const { user } = useUser();
  const supabase = useSupabaseAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          .select('course_id, last_accessed_at')
          .eq('user_id', user.id)
          .order('last_accessed_at', { ascending: false })
          .limit(3);

        if (enrollmentsError) throw enrollmentsError;

        // Get the course details from our static data
        const userCourses = enrollments?.map((enrollment: { course_id: string; last_accessed_at: string }) => {
          const course = courses.find(c => c.id === enrollment.course_id);
          return {
            id: enrollment.course_id,
            title: course?.title || 'Unknown Course',
            description: course?.description || '',
            progress: 0, // We'll implement proper progress tracking later
            lastAccessed: new Date(enrollment.last_accessed_at).toLocaleDateString(),
          };
        }) || [];

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

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <SignedIn>
          <section className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#2C3E50]">Recent Courses</h2>
              <Link 
                href="/courses/browse"
                className="text-[#27AE60] hover:text-[#219653] flex items-center"
              >
                Browse All <ChevronRight size={20} />
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-4">
                <p className="text-[#34495E]">Loading your courses...</p>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="text-center py-8">
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
              <div className="space-y-4">
                {enrolledCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                  >
                    <div 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-[#34495E]">{course.title}</h3>
                        <p className="text-sm text-gray-500">
                          Last accessed: {course.lastAccessed}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-[#27AE60] rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#2C3E50]">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/quick-training">
                <div className="p-6 border rounded-lg hover:border-[#27AE60] group transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-[#27AE60] bg-opacity-10 group-hover:bg-opacity-20 transition-colors">
                      <Zap size={24} className="text-[#27AE60]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2C3E50] group-hover:text-[#27AE60] transition-colors">Quick Training</h3>
                      <p className="text-sm text-gray-600">Practice random situations</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/custom">
                <div className="p-6 border rounded-lg hover:border-[#27AE60] group transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-[#27AE60] bg-opacity-10 group-hover:bg-opacity-20 transition-colors">
                      <PlusCircle size={24} className="text-[#27AE60]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2C3E50] group-hover:text-[#27AE60] transition-colors">Custom Situation</h3>
                      <p className="text-sm text-gray-600">Create your own scenario</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </SignedIn>

        <SignedOut>
          <main className="min-h-screen bg-[#ECF0F1]">
            <nav className="bg-white shadow-sm">
              <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
                <span className="text-xl font-semibold text-[#2C3E50]">Oratoria</span>
                <SignInButton mode="modal">
                  <button className="bg-[#27AE60] text-white px-6 py-2 rounded-lg hover:bg-[#219653] transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-[#2C3E50] mb-4">
                  Master the Art of Communication
                </h1>
                <p className="text-xl text-[#34495E] mb-8">
                  Practice conversations, improve your social skills, and boost your confidence with AI-powered training.
                </p>
                <SignInButton mode="modal">
                  <button className="bg-[#27AE60] text-white px-8 py-3 rounded-lg text-lg hover:bg-[#219653] transition-colors flex items-center mx-auto">
                    Get Started
                    <ArrowRight className="ml-2" size={20} />
                  </button>
                </SignInButton>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="p-3 rounded-full bg-[#27AE60] bg-opacity-10 w-fit mb-4">
                    <Zap size={24} className="text-[#27AE60]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">AI-Powered Practice</h3>
                  <p className="text-[#34495E]">
                    Train with our advanced AI that adapts to your style and provides personalized feedback.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="p-3 rounded-full bg-[#27AE60] bg-opacity-10 w-fit mb-4">
                    <BookOpen size={24} className="text-[#27AE60]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Structured Learning</h3>
                  <p className="text-[#34495E]">
                    Follow our carefully designed courses to master different aspects of communication.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </SignedOut>
      </div>
    </main>
  );
} 