import { LucideIcon } from 'lucide-react';

export type CourseCategory = 'communication' | 'professional' | 'personal' | 'health' | 'mental-health';
export type VoiceType = 'male' | 'female';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  courseId: string;
  orderNumber: number;
  materials?: {
    graphs?: string[]; // URLs to graphs/images 
    tables?: string[]; // HTML content for tables
    caseStudy?: string; // Markdown/HTML content
  };
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  categoryColor: string;
  icon: string; // Name of icon (e.g., "Sales") or icon URL
  iconColor?: string;
  lessons: Lesson[];
  isEnrollable: boolean;
  estimatedDuration?: number;
  imageUrl?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CoachConversation {
  id: string;
  userId: string;
  lessonId: string;
  conversationData: ChatMessage[];
  created_at?: string;
  updated_at?: string;
}

export interface TeacherConversation {
  id: string;
  userId: string;
  lessonId: string;
  conversationData: ChatMessage[];
  sharedWithCoach: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SpecificProblemConversation {
  id: string;
  userId: string;
  problemDescription: string;
  conversationData: ChatMessage[];
  created_at?: string;
  updated_at?: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  lastAccessedAt: Date;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  progress: number;
  lessonProgress: LessonProgress[];
} 