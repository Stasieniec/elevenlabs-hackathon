'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { courses } from '@/lib/courses';

export default function CoursesPage() {
  return (
    <div className="min-h-screen">
      <nav className="bg-[#2C3E50] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-2xl font-bold">
            Oratoria
          </Link>
          <UserButton afterSignOutUrl="/"/>
        </div>
      </nav>
      
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-[#34495E] text-xl font-semibold mb-2">
                {course.title}
              </h2>
              {course.description && (
                <p className="text-gray-600 mb-4">{course.description}</p>
              )}
              <Link
                href={`/courses/${course.id}`}
                className="inline-block bg-[#27AE60] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
              >
                Start Learning
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 