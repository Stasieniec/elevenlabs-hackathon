'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Course } from '@/lib/courses';

type Props = {
  course: Course;
};

export default function CourseDetail({ course }: Props) {
  return (
    <div className="min-h-screen">
      <nav className="bg-[#2C3E50] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/courses" className="text-white hover:text-gray-300">
              ← Back to Courses
            </Link>
            <h1 className="text-white text-2xl font-bold">{course.title}</h1>
          </div>
          <UserButton afterSignOutUrl="/"/>
        </div>
      </nav>
      
      <main className="container mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Chapters</h2>
        
        <div className="space-y-4">
          {course.chapters.map((chapter) => (
            <div 
              key={chapter.id}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[#34495E] text-xl font-semibold mb-2">
                    {chapter.title}
                  </h3>
                  {chapter.description && (
                    <p className="text-gray-600 mb-4">{chapter.description}</p>
                  )}
                </div>
                <Link
                  href={`/courses/${course.id}/chapters/${chapter.id}`}
                  className="inline-block bg-[#27AE60] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
                >
                  Start Chapter
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 