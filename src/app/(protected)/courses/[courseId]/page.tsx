import { Metadata } from 'next';
import { getCourseWithLessons } from '@/lib/courses/services';
import CourseDetailPage from './page.client';
import { notFound } from 'next/navigation';

type Props = {
  params: { courseId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { course } = await getCourseWithLessons(params.courseId);
    
    if (!course) {
      return {
        title: 'Course Not Found',
      };
    }

    return {
      title: course.title,
      description: course.description,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Course Details',
    };
  }
}

export default async function Page(props: Props) {
  try {
    const { course, lessons } = await getCourseWithLessons(props.params.courseId);
    
    if (!course) {
      notFound();
    }
    
    return <CourseDetailPage course={course} lessons={lessons} />;
  } catch (error) {
    console.error('Error loading course:', error);
    notFound();
  }
} 