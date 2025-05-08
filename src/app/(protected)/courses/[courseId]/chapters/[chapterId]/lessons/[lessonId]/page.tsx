import { Metadata } from 'next';
import { getLessonWithStages } from '@/lib/courses/services';
import { notFound } from 'next/navigation';
import LessonPage from './page.client';

type Props = {
  params: { courseId: string; chapterId: string; lessonId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { lesson } = await getLessonWithStages(params.lessonId);
    
    if (!lesson) {
      return {
        title: 'Lesson Not Found',
      };
    }

    return {
      title: lesson.title,
      description: lesson.description,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Lesson',
    };
  }
}

export default async function Page({ params }: Props) {
  try {
    const { lesson, stages } = await getLessonWithStages(params.lessonId);
    
    if (!lesson) {
      notFound();
    }
    
    return <LessonPage 
      lesson={lesson} 
      stages={stages} 
      courseId={params.courseId}
      chapterId={params.chapterId}
    />;
  } catch (error) {
    console.error('Error loading lesson:', error);
    notFound();
  }
} 