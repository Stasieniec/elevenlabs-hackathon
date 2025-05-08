import { Metadata } from 'next';
import { getChapterWithLessons } from '@/lib/courses/services';
import { notFound } from 'next/navigation';
import ChapterDetailPage from './page.client';

type Props = {
  params: { courseId: string; chapterId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { chapter } = await getChapterWithLessons(params.chapterId);
    
    if (!chapter) {
      return {
        title: 'Chapter Not Found',
      };
    }

    return {
      title: chapter.title,
      description: chapter.description,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Chapter Details',
    };
  }
}

export default async function Page({ params }: Props) {
  try {
    const { chapter, lessons } = await getChapterWithLessons(params.chapterId);
    
    if (!chapter) {
      notFound();
    }
    
    return <ChapterDetailPage 
      chapter={chapter} 
      lessons={lessons} 
      courseId={params.courseId} 
    />;
  } catch (error) {
    console.error('Error loading chapter:', error);
    notFound();
  }
} 