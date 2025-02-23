import { Metadata } from 'next';
import { courses } from '@/lib/courses/index';
import CourseDetailPage from './page.client';

type Props = {
  params: { courseId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const courseId = params.courseId;
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

export default function Page(props: Props) {
  return <CourseDetailPage {...props} />;
} 