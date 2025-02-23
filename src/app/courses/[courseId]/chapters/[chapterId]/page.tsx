'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Brain, Heart, Frown, Clock, Target } from 'lucide-react';
import Navigation from '@/app/components/Navigation';
import { courses } from '@/lib/courses';
import { QuickTrainingSituation } from '@/lib/types/situations';

const iconMap: Record<string, typeof Brain | typeof Heart | typeof Frown> = {
  brain: Brain,
  heart: Heart,
  frown: Frown,
};

export default function ChapterPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const chapterId = params.chapterId as string;

  const course = courses.find(c => c.id === courseId);
  const chapter = course?.chapters.find(ch => ch.id === chapterId);

  if (!course || !chapter) {
    return (
      <div className="min-h-screen bg-[#ECF0F1] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-4">Chapter not found</h1>
          <Link 
            href="/courses"
            className="text-[#27AE60] hover:underline"
          >
            Return to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="md:pl-64 transition-all duration-200">
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
          {/* Back button */}
          <Link 
            href={`/courses/${courseId}`}
            className="inline-flex items-center text-[#7F8C8D] hover:text-[#2C3E50] transition-colors mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Course
          </Link>

          {/* Chapter Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-[#2C3E50] mb-4">
                {chapter.title}
              </h1>
              <p className="text-[#7F8C8D] text-lg leading-relaxed mb-6">
                {chapter.description}
              </p>
              <div className="flex items-center space-x-6 text-[#7F8C8D]">
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  <span>{chapter.situations.length} Situations</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>~30 minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Situations Grid */}
          <div className="grid gap-6">
            {chapter.situations.map((situation: QuickTrainingSituation, index: number) => {
              const Icon = iconMap[situation.icon] || Brain;
              
              return (
                <Link
                  key={situation.id}
                  href={`/courses/${courseId}/chapters/${chapterId}/situations/${situation.id}`}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="p-3 rounded-full bg-opacity-10"
                      style={{ backgroundColor: `${course.categoryColor}20` }}
                    >
                      <Icon size={24} style={{ color: course.categoryColor }} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-[#7F8C8D]">
                          Situation {index + 1}
                        </span>
                        <span 
                          className="text-sm px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${course.categoryColor}20`,
                            color: course.categoryColor
                          }}
                        >
                          {situation.difficulty}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-semibold text-[#2C3E50] group-hover:text-[#27AE60] transition-colors mb-2">
                        {situation.title}
                      </h2>
                      
                      <p className="text-[#7F8C8D] line-clamp-2">
                        {situation.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
} 