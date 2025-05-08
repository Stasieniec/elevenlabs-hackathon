import { Metadata } from 'next';
import { courses } from '@/lib/courses/index';
import CourseDetailPage from './page.client';

type Props = {
  params: { courseId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const courseId = (await Promise.resolve(params)).courseId;
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

export default async function Page(props: Props) {
  const params = await Promise.resolve(props.params);
  return <CourseDetailPage params={params} />;
} 