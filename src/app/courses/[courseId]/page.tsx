import { courses } from '@/lib/courses';
import { notFound } from 'next/navigation';
import CourseDetail from './CourseDetail';

type Props = {
  params: { courseId: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function CourseDetailPage(props: Props) {
  const course = courses.find(c => c.id === props.params.courseId);
  
  
  if (!course) {
    notFound();
  }

  return <CourseDetail course={course} />;
} 