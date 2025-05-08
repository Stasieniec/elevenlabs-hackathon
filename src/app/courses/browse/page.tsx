'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { BookOpen, Search, Plus, Trash2, Briefcase, Heart, Users } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useSupabase } from '../../supabase-provider';
import ConfirmDialog from '../../components/ConfirmDialog';
import type { LucideIcon } from 'lucide-react';

// Category color/icon mapping
const CATEGORY_MAP = {
  professional: { color: '#3498DB', icon: Briefcase },
  personal: { color: '#E74C3C', icon: Heart },
  communication: { color: '#F1C40F', icon: Users },
};

type DbCourse = {
  id: string;
  title: string;
  description: string;
  category_id: string;
};
type DbCategory = {
  id: string;
  name: string;
};
type CourseDisplay = {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  icon: LucideIcon;
  isEnrollable: boolean;
  chapters: never[];
};

export default function BrowseCoursesPage() {
  const { user } = useUser();
  const supabase = useSupabase().supabase;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseToUnenroll, setCourseToUnenroll] = useState<CourseDisplay | null>(null);
  const [courses, setCourses] = useState<CourseDisplay[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Debug logs
  if (typeof window !== 'undefined') {
    // Only log on client
    // eslint-disable-next-line no-console
    console.log('BrowseCoursesPage: user', user, 'supabase', supabase);
  }

  // Fetch courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data, error: courseError } = await supabase
          .from('courses')
          .select('id, title, description, category_id')
          .order('title', { ascending: true });
        if (courseError) throw courseError;
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('id, name');
        if (catError) throw catError;
        const catMap: Record<string, string> = Object.fromEntries((catData || []).map((c: DbCategory) => [c.id, c.name]));
        const mapped: CourseDisplay[] = (data || []).map((c: DbCourse) => {
          const category = catMap[c.category_id] || 'professional';
          const catInfo = CATEGORY_MAP[category as keyof typeof CATEGORY_MAP] || CATEGORY_MAP['professional'];
          return {
            id: c.id,
            title: c.title,
            description: c.description,
            category,
            categoryColor: catInfo.color,
            icon: catInfo.icon,
            isEnrollable: true,
            chapters: [],
          };
        });
        setCourses(mapped);
        setCategories([...new Set(mapped.map(c => c.category))]);
      } catch (e) {
        console.error('Error in fetchCourses:', e);
        setError('Failed to load courses. Please check console.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [supabase]);

  // Fetch enrolled courses
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
        if (supabaseError) throw supabaseError;
        const ids = enrollments?.map((e: { course_id: string }) => e.course_id) || [];
        setEnrolledCourseIds(ids);
      } catch {
        setError('Failed to load enrolled courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, [user, supabase]);

  const handleEnroll = async (courseId: string) => {
    if (!user || !supabase) {
      setError('You must be signed in to enroll in courses');
      return;
    }
    setEnrollingCourseId(courseId);
    try {
      setError(null);
      // Check if already enrolled
      const { data: existing, error: existingError } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
      }
      if (existing) {
        setError('You are already enrolled in this course');
        return;
      }
      // Enroll
      const { error: enrollmentError } = await supabase
        .from('course_enrollments')
        .insert([{ user_id: user.id, course_id: courseId }]);
      if (enrollmentError) throw enrollmentError;
      setEnrolledCourseIds(prev => [...prev, courseId]);
    } catch {
      setError('Failed to enroll in course.');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    if (!user || !supabase) {
      setError('You must be signed in to unenroll from courses');
      return;
    }
    setEnrollingCourseId(courseId);
    try {
      setError(null);
      // Remove enrollment
      const { error: deleteError } = await supabase
        .from('course_enrollments')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);
      if (deleteError) throw deleteError;
      setEnrolledCourseIds(prev => prev.filter(id => id !== courseId));
    } catch {
      setError('Failed to unenroll from course.');
    } finally {
      setEnrollingCourseId(null);
      setCourseToUnenroll(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!user) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <Navigation />
        <div className="md:pl-64 transition-all duration-200">
          <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
            <div className="text-center">
              <p className="text-[#34495E] text-lg">Please sign in to browse courses.</p>
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
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent text-[#2C3E50]"
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory((e.target.value || null))}
                  disabled={loading}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="text-[#2C3E50]">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#34495E] text-lg">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#34495E] text-lg">No courses available.</p>
            </div>
          ) : (
            <>
              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => {
                  const Icon = course.icon;
                  const isEnrolling = enrollingCourseId === course.id;
                  const isEnrolled = enrolledCourseIds.includes(course.id);
                  return (
                    <div key={course.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-full bg-opacity-10" style={{ backgroundColor: `${course.categoryColor}20` }}>
                          <Icon size={24} style={{ color: course.categoryColor }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: `${course.categoryColor}20`, color: course.categoryColor }}>
                              {course.category}
                            </span>
                          </div>
                          <h2 className="text-xl font-semibold text-[#2C3E50] group-hover:text-[#27AE60] transition-colors">
                            {course.title}
                          </h2>
                          <p className="text-[#34495E] mt-2 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            {isEnrolled ? (
                              <button
                                onClick={() => setCourseToUnenroll(course)}
                                disabled={isEnrolling}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${isEnrolling ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                              >
                                <Trash2 size={20} />
                                <span>{isEnrolling ? 'Processing...' : 'Unenroll'}</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEnroll(course.id)}
                                disabled={isEnrolling || isEnrolled}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${isEnrolling || isEnrolled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#27AE60] hover:bg-[#219653]'}`}
                              >
                                <Plus size={20} />
                                <span>
                                  {isEnrolling ? 'Enrolling...' : isEnrolled ? 'Enrolled' : 'Enroll Now'}
                                </span>
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
      </div>
      <ConfirmDialog
        isOpen={!!courseToUnenroll}
        title="Unenroll from Course"
        message={`Are you sure you want to unenroll from ${courseToUnenroll?.title}? Your progress will be lost.`}
        confirmLabel="Unenroll"
        cancelLabel="Cancel"
        onConfirm={() => courseToUnenroll && handleUnenroll(courseToUnenroll.id)}
        onCancel={() => setCourseToUnenroll(null)}
      />
    </main>
  );
} 