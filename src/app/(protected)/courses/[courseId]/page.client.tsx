'use client';

import { notFound } from 'next/navigation';
import { courses } from '@/lib/courses/index';
import CourseDetail from './CourseDetail';
import ClientOnly from '@/app/components/ClientOnly';
import { Course } from '@/lib/types/courses';

type Props = {
  params: { courseId: string };
};

// Create a type for the serialized course
type SerializedCourse = Omit<Course, 'icon'> & {
  icon: string;
};

export default function CourseDetailPage({
  params,
}: Props) {
  const courseId = params.courseId;
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    notFound();
  }

  // Serialize the course data, converting the icon to a string name
  const serializedCourse: SerializedCourse = {
    ...course,
    icon: course?.icon?.displayName || 'Users', // Use displayName or fallback to 'Users'
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <ClientOnly>
        <CourseDetail course={serializedCourse} />
      </ClientOnly>
    </div>
  );
} 