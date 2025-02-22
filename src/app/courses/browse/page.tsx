'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { BookOpen, Users, MessageSquare, Briefcase, Search, Lightbulb, HeartHandshake, Brain, Plus, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import ConfirmDialog from '../../components/ConfirmDialog';

type Course = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  categoryColor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  enrolled: number;
};

const courses: Course[] = [
  {
    id: 1,
    title: 'Small Talk Mastery',
    description: 'Learn to navigate casual conversations with confidence and ease.',
    icon: Users,
    category: 'Social Skills',
    categoryColor: '#F39C12',
    difficulty: 'Beginner',
    duration: '4 weeks',
    enrolled: 1234,
  },
  {
    id: 2,
    title: 'Professional Negotiations',
    description: 'Master the art of business negotiations and deal-making.',
    icon: Briefcase,
    category: 'Professional',
    categoryColor: '#27AE60',
    difficulty: 'Advanced',
    duration: '6 weeks',
    enrolled: 856,
  },
  {
    id: 3,
    title: 'Interview Excellence',
    description: 'Prepare for job interviews and learn to present yourself effectively.',
    icon: MessageSquare,
    category: 'Career',
    categoryColor: '#2C3E50',
    difficulty: 'Intermediate',
    duration: '3 weeks',
    enrolled: 2156,
  },
  {
    id: 4,
    title: 'Public Speaking Fundamentals',
    description: 'Build confidence and master the art of public speaking.',
    icon: Users,
    category: 'Professional',
    categoryColor: '#27AE60',
    difficulty: 'Beginner',
    duration: '5 weeks',
    enrolled: 3421,
  },
  {
    id: 5,
    title: 'Conflict Resolution',
    description: 'Learn to handle difficult conversations and resolve conflicts effectively.',
    icon: HeartHandshake,
    category: 'Social Skills',
    categoryColor: '#F39C12',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    enrolled: 987,
  },
  {
    id: 6,
    title: 'Leadership Communication',
    description: 'Develop the communication skills needed to be an effective leader.',
    icon: Brain,
    category: 'Professional',
    categoryColor: '#27AE60',
    difficulty: 'Advanced',
    duration: '8 weeks',
    enrolled: 654,
  },
  {
    id: 7,
    title: 'Social Intelligence',
    description: 'Enhance your emotional intelligence and social awareness.',
    icon: Lightbulb,
    category: 'Social Skills',
    categoryColor: '#F39C12',
    difficulty: 'Intermediate',
    duration: '6 weeks',
    enrolled: 1543,
  },
];

const categories = Array.from(new Set(courses.map(course => course.category)));
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

export default function BrowseCoursesPage() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [enrollingCourseId, setEnrollingCourseId] = useState<number | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
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

        const ids = enrollments?.map(e => parseInt(e.course_id)) || [];
        setEnrolledCourseIds(ids);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  const handleUnenroll = async (courseId: number) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    
    setEnrollingCourseId(courseId);
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId.toString());

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      setEnrolledCourseIds(prev => prev.filter(id => id !== courseId));
    } catch (error) {
      console.error('Error unenrolling from course:', error);
    } finally {
      setEnrollingCourseId(null);
      setCourseToUnenroll(null);
    }
  };

  const handleEnroll = async (courseId: number) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    
    setEnrollingCourseId(courseId);
    try {
      // First check if already enrolled
      const { data: existing } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId.toString())
        .single();

      if (existing) {
        console.error('Already enrolled in this course');
        return;
      }

      const { error } = await supabase
        .from('course_enrollments')
        .insert([
          {
            user_id: user.id,
            course_id: courseId.toString(),
          }
        ]);

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      // Show success message or redirect
      window.location.href = '/courses';
    } catch (error) {
      console.error('Error enrolling in course:', error);
      // Show error message to user
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

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
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
                const isEnrolling = enrollingCourseId === course.id;

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
                            <span className="mr-4">{course.duration}</span>
                            <span>{course.enrolled.toLocaleString()} enrolled</span>
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
        onConfirm={() => courseToUnenroll && handleUnenroll(courseToUnenroll.id)}
        onCancel={() => setCourseToUnenroll(null)}
      />
    </main>
  );
} 