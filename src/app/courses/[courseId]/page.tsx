import { courses } from '@/lib/courses';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CourseDetail from './CourseDetail';
import ClientOnly from '@/app/components/ClientOnly';

type Props = {
  params: { courseId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = courses.find(c => c.id === params.courseId);
  
  if (!course) {
    return {
      title: 'Course Not Found',
    };
  }

  return {
    title: course.title,
    description: course.description,
  };
}

export default function CourseDetailPage({
  params,
}: Props) {
  const course = courses.find(c => c.id === params.courseId);
  
  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <ClientOnly>
        <CourseDetail course={course} />
      </ClientOnly>
    </div>
  );
} 