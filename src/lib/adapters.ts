/**
 * Adapters for converting between old and new data structures
 * This allows for a gradual transition to the new database schema
 */

import { Course as DBCourse, Lesson, LessonStage, CourseEnrollment, LessonProgress, Category as DBCategory } from './supabase';
import { Course as FrontendCourse, CourseChapter, CourseCategory } from './types/courses';
import { QuickTrainingSituation, Category, Difficulty } from './types/situations';
import { Users } from 'lucide-react';

/**
 * Maps database category_id to frontend CourseCategory
 */
function getCategoryFromId(categoryId: string | null, categories: DBCategory[]): CourseCategory {
  if (!categoryId) return 'personal';
  
  const category = categories.find(cat => cat.id === categoryId);
  
  // Map database category name to frontend CourseCategory
  switch(category?.name.toLowerCase()) {
    case 'communication': return 'communication';
    case 'professional': return 'professional';
    case 'personal': return 'personal';
    case 'health': return 'health';
    case 'mental health': return 'mental-health';
    default: return 'personal';
  }
}

/**
 * Get category color based on category
 */
function getCategoryColor(category: CourseCategory): string {
  const colorMap: Record<CourseCategory, string> = {
    'communication': '#3498DB',
    'professional': '#2ECC71',
    'personal': '#9B59B6',
    'health': '#E74C3C',
    'mental-health': '#F39C12'
  };
  
  return colorMap[category];
}

/**
 * Converts database courses to the frontend course structure
 */
export function adaptDatabaseCoursesToFrontend(
  dbCourses: DBCourse[],
  lessons: Lesson[],
  lessonStages: LessonStage[],
  categories: DBCategory[] = []
): FrontendCourse[] {
  return dbCourses.map(dbCourse => {
    // Get all lessons for this course
    const courseLessons = lessons.filter(lesson => lesson.course_id === dbCourse.id);
    
    // Convert lessons to chapters
    const chapters: CourseChapter[] = courseLessons.map(lesson => {
      // Get stages for this lesson
      const stages = lessonStages.filter(stage => stage.lesson_id === lesson.id);
      
      // Extract situations from the conversation stage (stage 3)
      const conversationStage = stages.find(stage => stage.stage_number === 3);
      let situations: QuickTrainingSituation[] = [];
      
      if (conversationStage) {
        try {
          const content = JSON.parse(conversationStage.content);
          situations = (content.situations || []).map((situation: { 
            id: string; 
            title: string; 
            description?: string; 
            context?: string;
            difficulty?: string;
            category?: string;
            tags?: string[];
            icon?: string;
            userGoal?: string;
            aiRole?: string;
          }) => ({
            id: situation.id,
            title: situation.title,
            description: situation.description || '',
            context: situation.context || '',
            difficulty: (situation.difficulty || 'medium') as Difficulty,
            category: (situation.category || 'professional') as Category,
            tags: situation.tags || [],
            icon: situation.icon || 'message-circle',
            userGoal: situation.userGoal || '',
            aiRole: situation.aiRole || ''
          }));
        } catch (e) {
          console.error('Error parsing conversation stage content:', e);
        }
      }
      
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || '',
        order: lesson.order_number,
        situations
      };
    });
    
    const courseCategory = getCategoryFromId(dbCourse.category_id, categories);
    
    return {
      id: dbCourse.id,
      title: dbCourse.title,
      description: dbCourse.description || '',
      category: courseCategory,
      categoryColor: getCategoryColor(courseCategory),
      icon: Users, // Using actual Lucide component instead of string
      chapters,
      isEnrollable: true
    };
  });
}

/**
 * Maps old chapter progress format to the new lesson progress format
 */
export function adaptLessonProgress(lessonProgress: LessonProgress[]) {
  return lessonProgress.map(progress => ({
    id: progress.id,
    userId: progress.user_id,
    lessonId: progress.lesson_id,
    completed: progress.completed,
    completionPercentage: progress.completion_percentage,
    currentStage: progress.current_stage,
    lastAccessedAt: progress.last_accessed_at,
    createdAt: progress.created_at,
    updatedAt: progress.updated_at
  }));
}

/**
 * Returns an object with enrollment status for each course
 */
export function getEnrollmentStatusMap(enrollments: CourseEnrollment[]): Record<string, boolean> {
  const enrollmentMap: Record<string, boolean> = {};
  
  for (const enrollment of enrollments) {
    enrollmentMap[enrollment.course_id] = true;
  }
  
  return enrollmentMap;
} 