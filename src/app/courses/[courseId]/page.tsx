import { courses } from '@/lib/courses';
import { notFound } from 'next/navigation';
import CourseDetail from './CourseDetail';

// @ts-expect-error - Next.js type issue with params in page components
export default async function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = courses.find(c => c.id === params.courseId);
  
  if (!course) {
    notFound();
  }

  return <CourseDetail course={course} />;
} 