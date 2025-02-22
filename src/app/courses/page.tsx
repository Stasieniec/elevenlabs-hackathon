'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { BookOpen, Users, MessageSquare, Briefcase, LucideIcon } from 'lucide-react';
import Navigation from '../components/Navigation';

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
const courses: Course[] = [
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

        {/* Course Grid */}
        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <Link 
                key={course.id}
                href={`/courses/${course.id}`}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start space-x-4">
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
                      <span className="text-lg font-semibold text-[#27AE60]">
                        {course.progress}%
                      </span>
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
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
} 