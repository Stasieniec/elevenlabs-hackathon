import { courses } from '@/lib/courses';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CourseDetail from './CourseDetail';
import ClientOnly from '@/app/components/ClientOnly';

type Props = {
  params: { courseId: string };
};

// Create a type for the serialized course
type SerializedCourse = Omit<typeof courses[0], 'icon'> & {
  icon: string;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Ensure params is awaited
  const courseId = await Promise.resolve(params.courseId);
  const course = courses.find(c => c.id === courseId);
  
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

export default async function CourseDetailPage({
  params,
}: Props) {
  // Ensure params is awaited
  const courseId = await Promise.resolve(params.courseId);
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    notFound();
  }

  // Serialize the course data, converting the icon to a string name
  const serializedCourse: SerializedCourse = {
    ...course,
    icon: course.icon.displayName || 'Users', // Use displayName or fallback to 'Users'
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <ClientOnly>
        <CourseDetail course={serializedCourse} />
      </ClientOnly>
    </div>
  );
} 