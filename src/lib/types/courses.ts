import { LucideIcon } from 'lucide-react';
import { QuickTrainingSituation } from './situations';

export type CourseCategory = 'communication' | 'professional' | 'personal';

export interface CourseChapter {
  id: string;
  title: string;
  description: string;
  situations: QuickTrainingSituation[];
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  categoryColor: string;
  icon: LucideIcon;
  chapters: CourseChapter[];
  isEnrollable: boolean;
  duration: string;
}

export interface ChapterProgress {
  chapterId: string;
  completed: boolean;
  completionPercentage: number;
  averageScore: number;
  keyLearnings: string[];
  areasForImprovement: string[];
}

export interface CourseProgress {
  courseId: string;
  completedChapters: number;
  totalChapters: number;
  progress: number;
  chapterProgress: ChapterProgress[];
} 