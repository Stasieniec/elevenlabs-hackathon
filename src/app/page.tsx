'use client';

import { useState, useEffect } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Zap, PlusCircle, ChevronRight, ArrowRight, BookOpen } from 'lucide-react';
import Navigation from './components/Navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

// Temporary mock data
const coursesData = [
  { id: 1, title: 'Small Talk', description: 'Learn how to have a conversation with anyone', progress: 60, lastAccessed: '2024-02-22' },
  { id: 2, title: 'Negotiations', description: 'Learn how to negotiate effectively', progress: 30, lastAccessed: '2024-02-21' },
  { id: 3, title: 'Interviews', description: 'Learn how to prepare for and ace job interviews', progress: 15, lastAccessed: '2024-02-20' },
];

type Course = {
  id: number;
  title: string;
  description: string;
  progress: number;
  lastAccessed: string;
};

export default function Home() {
  const { user } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) return;

      try {
        const { data: enrollments, error } = await supabase
          .from('course_enrollments')
          .select('course_id, last_accessed_at')
          .eq('user_id', user.id)
          .order('last_accessed_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        // Get the course details from our static data
        const courses = enrollments.map(enrollment => ({
          id: parseInt(enrollment.course_id),
          title: coursesData.find(c => c.id === parseInt(enrollment.course_id))?.title || 'Unknown Course',
          description: coursesData.find(c => c.id === parseInt(enrollment.course_id))?.description || '',
          progress: 0, // We'll implement proper progress tracking later
          lastAccessed: new Date(enrollment.last_accessed_at).toLocaleDateString(),
        }));

        setEnrolledCourses(courses);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  return (
    <>
      <SignedIn>
        <main className="min-h-screen bg-[#ECF0F1]">
          <Navigation />
          
          <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
            <h1 className="text-3xl font-bold text-[#2C3E50] mb-8">Welcome to Oratoria</h1>
            
            {/* Continue Training Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#2C3E50]">Continue Training</h2>
                <Link 
                  href="/courses" 
                  className="flex items-center text-[#27AE60] hover:text-[#219653] transition-colors"
                >
                  See all courses
                  <ChevronRight size={20} />
                </Link>
              </div>
              
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
            
            {/* Quick Actions Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Training Card */}
              <Link 
                href="/quick-training"
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-[#F39C12] bg-opacity-10">
                    <Zap size={24} className="text-[#F39C12]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#2C3E50] group-hover:text-[#27AE60] transition-colors">
                      Quick Training
                    </h2>
                    <p className="text-gray-600">Practice with random situations</p>
                  </div>
                </div>
              </Link>
              
              {/* Custom Situation Card */}
              <Link 
                href="/custom"
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-[#27AE60] bg-opacity-10">
                    <PlusCircle size={24} className="text-[#27AE60]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#2C3E50] group-hover:text-[#27AE60] transition-colors">
                      Custom Situation
                    </h2>
                    <p className="text-gray-600">Create your own scenario</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </main>
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
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="p-3 rounded-full bg-[#F39C12] bg-opacity-10 w-fit mb-4">
                  <Zap size={24} className="text-[#F39C12]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Real-time Practice</h3>
                <p className="text-[#34495E]">Practice conversations with AI that adapts to your style and pace.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="p-3 rounded-full bg-[#27AE60] bg-opacity-10 w-fit mb-4">
                  <PlusCircle size={24} className="text-[#27AE60]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Custom Scenarios</h3>
                <p className="text-[#34495E]">Create and practice your own conversation scenarios.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="p-3 rounded-full bg-[#2C3E50] bg-opacity-10 w-fit mb-4">
                  <ChevronRight size={24} className="text-[#2C3E50]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Track Progress</h3>
                <p className="text-[#34495E]">Monitor your improvement with detailed feedback and analytics.</p>
              </div>
            </div>
          </div>
        </main>
      </SignedOut>
    </>
  );
} 