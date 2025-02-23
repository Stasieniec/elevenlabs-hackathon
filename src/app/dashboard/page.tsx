'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Target, BookOpen, MessageSquare, Loader2 } from 'lucide-react';
import { courses } from '@/lib/courses';
import Navigation from '../components/Navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function DashboardPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const supabase = useSupabaseAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<typeof courses>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApiKeys, setHasApiKeys] = useState(false);

  // Get onboarding status from Clerk metadata
  const hasCompletedOnboarding = user?.unsafeMetadata?.onboardingComplete as boolean;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !supabase) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch enrolled courses
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('course_enrollments')
          .select('course_id')
          .eq('user_id', userId);

        if (enrollmentsError) throw enrollmentsError;

        const enrolledCourseData = enrollments
          .map(enrollment => courses.find(c => c.id === enrollment.course_id))
          .filter(course => course !== undefined) as typeof courses;

        setEnrolledCourses(enrolledCourseData);

        // Check API keys
        const { data: apiKeys } = await supabase
          .from('user_api_keys')
          .select('elevenlabs_api_key_encrypted, fal_ai_api_key_encrypted')
          .maybeSingle();

        setHasApiKeys(
          !!apiKeys?.elevenlabs_api_key_encrypted && 
          !!apiKeys?.fal_ai_api_key_encrypted
        );
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
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

          {/* API Keys Notice */}
          {!hasApiKeys && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Set Up Your API Keys</h3>
              <p className="text-yellow-700 mb-4">
                To start practicing conversations, you'll need to set up your API keys for ElevenLabs and fal.ai. 
                These services provide the AI voice and language processing capabilities for our conversation practice.
              </p>
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Set Up API Keys
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {!hasCompletedOnboarding && (
            <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-secondary mb-1">Complete Your Profile</h3>
                <p className="text-neutral">Tell us about your language preferences and communication goals.</p>
              </div>
              <Link
                href="/onboarding"
                className="shrink-0 bg-secondary text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
              >
                Complete Onboarding
              </Link>
            </div>
          )}
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