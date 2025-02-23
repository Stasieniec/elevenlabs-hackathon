'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { BookOpen, Search, Plus, Trash2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Course as CourseType, courses } from '@/lib/courses';

type Course = CourseType;

const categories = Array.from(new Set(courses.map(course => course.category)));
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

export default function BrowseCoursesPage() {
  const { user } = useUser();
  const supabase = useSupabaseAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
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
        const { data: enrollments, error: supabaseError } = await supabase
          .from('course_enrollments')
          .select('course_id')
          .eq('user_id', user.id);

        if (supabaseError) {
          throw supabaseError;
        }

        const ids = enrollments?.map(e => e.course_id) || [];
        setEnrolledCourseIds(ids);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Failed to load enrolled courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchEnrolledCourses();
  }, [user, supabase]);

  const handleUnenroll = async (courseId: string) => {
    if (!user || !supabase) {
      setError('You must be signed in to unenroll from courses');
      return;
    }
    
    setEnrollingCourseId(courseId);
    try {
      setError(null);

      // Get the static course data which contains chapters and situations
      const staticCourse = courses.find(c => c.id === courseId);
      if (!staticCourse) {
        throw new Error('Course not found in static data');
      }

      // 1. Delete conversation performances
      const { error: conversationError } = await supabase
        .from('conversation_performances')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (conversationError) throw conversationError;

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

      // 3. Delete chapter progress
      const { error: chapterError } = await supabase
        .from('chapter_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (chapterError) throw chapterError;

      // 4. Finally delete course enrollment
      const { error: deleteError } = await supabase
        .from('course_enrollments')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (deleteError) throw deleteError;

      setEnrolledCourseIds(prev => prev.filter(id => id !== courseId));
    } catch (err) {
      console.error('Error unenrolling from course:', err);
      setError('Failed to unenroll from course. Please try again later.');
    } finally {
      setEnrollingCourseId(null);
      setCourseToUnenroll(null);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user || !supabase) {
      setError('You must be signed in to enroll in courses');
      return;
    }
    
    setEnrollingCourseId(courseId);
    try {
      setError(null);
      // First check if already enrolled
      const { data: existing, error: existingError } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (existingError && existingError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw existingError;
      }

      if (existing) {
        setError('You are already enrolled in this course');
        return;
      }

      // Start a transaction to create all necessary records
      const course = courses.find(c => c.id === courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // 1. Create course enrollment
      const { error: enrollmentError } = await supabase
        .from('course_enrollments')
        .insert([
          {
            user_id: user.id,
            course_id: courseId,
          }
        ]);

      if (enrollmentError) throw enrollmentError;

      // 2. Initialize chapter progress for each chapter
      for (const chapter of course.chapters) {
        const { error: chapterError } = await supabase
          .from('chapter_progress')
          .insert([
            {
              user_id: user.id,
              course_id: courseId,
              chapter_id: chapter.id,
              completed: false,
              completion_percentage: 0,
              average_score: 0,
              key_learnings: [],
              areas_for_improvement: []
            }
          ]);
        
        if (chapterError) throw chapterError;

        // 3. Initialize situation progress for each situation
        for (const situation of chapter.situations) {
          const { error: progressError } = await supabase
            .from('user_progress')
            .insert([
              {
                user_id: user.id,
                situation_id: situation.id,
                completed: false,
                score: 0,
                feedback: null
              }
            ]);
          
          if (progressError) throw progressError;
        }
      }

      // Show success message or redirect
      window.location.href = '/courses';
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Failed to enroll in course. Please try again later.');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (!user) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="text-center">
            <p className="text-[#34495E] text-lg">Please sign in to browse courses.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!supabase) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="text-center">
            <p className="text-[#34495E] text-lg">Initializing...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 rounded-full bg-[#27AE60] bg-opacity-10">
            <BookOpen size={32} className="text-[#27AE60]" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Browse Courses</h1>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex-1">
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                disabled={loading}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex-1">
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent"
                value={selectedDifficulty || ''}
                onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                disabled={loading}
              >
                <option value="">All Difficulties</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#34495E] text-lg">Loading courses...</p>
          </div>
        ) : (
          <>
            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => {
                const Icon = course.icon;
                const isEnrolling = enrollingCourseId === course.id.toString();

                return (
                  <div 
                    key={course.id}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-full bg-opacity-10" style={{ backgroundColor: `${course.categoryColor}20` }}>
                        <Icon size={24} style={{ color: course.categoryColor }} />
                      </div>
                      
                      <div className="flex-1">
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
                          <span className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-full">
                            {course.difficulty}
                          </span>
                        </div>

                        <h2 className="text-xl font-semibold text-[#2C3E50] group-hover:text-[#27AE60] transition-colors">
                          {course.title}
                        </h2>
                        
                        <p className="text-[#34495E] mt-2 line-clamp-2">
                          {course.description}
                        </p>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span>{course.duration}</span>
                          </div>
                          {enrolledCourseIds.includes(course.id) ? (
                            <button
                              onClick={() => setCourseToUnenroll(course)}
                              disabled={isEnrolling}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
                                isEnrolling 
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-red-500 hover:bg-red-600'
                              }`}
                            >
                              <Trash2 size={20} />
                              <span>{isEnrolling ? 'Processing...' : 'Unenroll'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEnroll(course.id)}
                              disabled={isEnrolling}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
                                isEnrolling 
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-[#27AE60] hover:bg-[#219653]'
                              }`}
                            >
                              <Plus size={20} />
                              <span>{isEnrolling ? 'Enrolling...' : 'Enroll Now'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#34495E] text-lg">No courses found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!courseToUnenroll}
        title="Unenroll from Course"
        message={`Are you sure you want to unenroll from ${courseToUnenroll?.title}? Your progress will be lost.`}
        confirmLabel="Unenroll"
        cancelLabel="Cancel"
        onConfirm={() => courseToUnenroll && handleUnenroll(courseToUnenroll.id.toString())}
        onCancel={() => setCourseToUnenroll(null)}
      />
    </main>
  );
} 