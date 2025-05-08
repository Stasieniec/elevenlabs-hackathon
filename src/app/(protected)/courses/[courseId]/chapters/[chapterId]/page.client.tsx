'use client';

import { useUser } from '@clerk/nextjs';
import Navigation from '../../../../../components/Navigation';
import { useState, useEffect } from 'react';
import { useSupabase } from '../../../../../supabase-provider';
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, Clock, PlayCircle } from 'lucide-react';
import Link from 'next/link';

interface DbChapter {
  id: string;
  title: string;
  description: string;
  course_id: string;
  order_number: number;
  created_at?: string;
  updated_at?: string;
}

interface DbLesson {
  id: string;
  title: string;
  description: string;
  chapter_id: string;
  order_number: number;
  created_at?: string;
  updated_at?: string;
}

interface ChapterDetailProps {
  chapter: DbChapter;
  lessons: DbLesson[];
  courseId: string;
}

export default function ChapterDetailPage({ chapter, lessons, courseId }: ChapterDetailProps) {
  const { user } = useUser();
  const supabase = useSupabase().supabase;
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessonProgress = async () => {
      if (!user || !supabase || !lessons || lessons.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Get progress for all lessons in this chapter
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
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchLessonProgress();
  }, [user, supabase, lessons]);

  if (!user) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <Navigation />
        <div className="md:pl-64 transition-all duration-200">
          <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
            <div className="text-center">
              <p className="text-[#34495E] text-lg">Please sign in to view chapter details.</p>
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
              href={`/courses/${courseId}`}
              className="flex items-center text-[#34495E] hover:text-[#2C3E50] font-medium mb-6"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Course
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
              <h1 className="text-3xl font-bold text-[#2C3E50]">
                {chapter.title}
              </h1>
            </div>
            
            <p className="text-[#34495E] text-lg mb-6">
              {chapter.description}
            </p>
            
            <div className="flex items-center text-[#7F8C8D] mb-8">
              <div className="flex items-center">
                <BookOpen size={18} className="mr-2" />
                <span>{lessons?.length || 0} lessons</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6">Lessons</h2>
            
            {loading ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-[#34495E]">Loading lessons...</p>
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-[#34495E]">No lessons available for this chapter yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div 
                    key={lesson.id}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex">
                        <div className="pt-1">
                          {lessonProgress[lesson.id] ? (
                            <div className="rounded-full p-1 bg-[#27AE60] bg-opacity-10">
                              <CheckCircle size={20} className="text-[#27AE60]" />
                            </div>
                          ) : (
                            <div className="rounded-full p-1 bg-gray-100">
                              <PlayCircle size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                            {index + 1}. {lesson.title}
                          </h3>
                          <p className="text-[#34495E] mb-2">
                            {lesson.description}
                          </p>
                          <div className="flex items-center text-gray-500">
                            <Clock size={16} className="mr-1" />
                            <span className="text-sm">15 minutes</span>
                          </div>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/courses/${courseId}/chapters/${chapter.id}/lessons/${lesson.id}`}
                        className="p-2 rounded-full bg-[#27AE60] bg-opacity-10 text-[#27AE60] hover:bg-opacity-20"
                      >
                        <ChevronRight size={20} />
                      </Link>
                    </div>
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