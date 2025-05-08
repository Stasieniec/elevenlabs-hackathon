'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { 
  Course, Lesson, CoachConversation, 
  TeacherConversation, SpecificProblemConversation, 
  ChatMessage 
} from '../types/courses';
import { Database } from '@/types/supabase';

/**
 * Fetches all available courses
 */
export async function getAllCourses() {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*');

  if (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to load courses');
  }
  
  return courses;
}

/**
 * Fetches a specific course by ID with its lessons
 */
export async function getCourseWithLessons(courseId: string) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Fetch the course details
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (courseError) {
    console.error('Error fetching course:', courseError);
    throw new Error('Failed to load course');
  }
  
  // Fetch the lessons for this course
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_number', { ascending: true });

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError);
    throw new Error('Failed to load course lessons');
  }
  
  return { course, lessons };
}

/**
 * Fetches a specific lesson by ID
 */
export async function getLessonById(lessonId: string) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Fetch the lesson details
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (lessonError) {
    console.error('Error fetching lesson:', lessonError);
    throw new Error('Failed to load lesson');
  }
  
  return lesson;
}

/**
 * Fetches coach conversation for a lesson
 */
export async function getCoachConversation(userId: string, lessonId: string) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Try to fetch existing conversation
  const { data, error } = await supabase
    .from('coach_conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching coach conversation:', error);
    throw new Error('Failed to load coach conversation');
  }

  return data;
}

/**
 * Creates or updates a coach conversation
 */
export async function updateCoachConversation(
  userId: string, 
  lessonId: string, 
  messages: ChatMessage[]
) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Check if conversation exists
  const { data: existing, error: checkError } = await supabase
    .from('coach_conversations')
    .select('id')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking coach conversation:', checkError);
    throw new Error('Failed to update coach conversation');
  }

  if (existing) {
    // Update existing conversation
    const { error: updateError } = await supabase
      .from('coach_conversations')
      .update({
        conversation_data: messages,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);

    if (updateError) {
      console.error('Error updating coach conversation:', updateError);
      throw new Error('Failed to update coach conversation');
    }
  } else {
    // Create new conversation
    const { error: insertError } = await supabase
      .from('coach_conversations')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        conversation_data: messages
      });

    if (insertError) {
      console.error('Error creating coach conversation:', insertError);
      throw new Error('Failed to create coach conversation');
    }
  }
  
  return { success: true };
}

/**
 * Fetches teacher conversation for a lesson
 */
export async function getTeacherConversation(userId: string, lessonId: string) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Try to fetch existing conversation
  const { data, error } = await supabase
    .from('teacher_conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching teacher conversation:', error);
    throw new Error('Failed to load teacher conversation');
  }

  return data;
}

/**
 * Creates or updates a teacher conversation
 */
export async function updateTeacherConversation(
  userId: string, 
  lessonId: string, 
  messages: ChatMessage[],
  sharedWithCoach: boolean = false
) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Check if conversation exists
  const { data: existing, error: checkError } = await supabase
    .from('teacher_conversations')
    .select('id')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking teacher conversation:', checkError);
    throw new Error('Failed to update teacher conversation');
  }

  if (existing) {
    // Update existing conversation
    const { error: updateError } = await supabase
      .from('teacher_conversations')
      .update({
        conversation_data: messages,
        shared_with_coach: sharedWithCoach,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);

    if (updateError) {
      console.error('Error updating teacher conversation:', updateError);
      throw new Error('Failed to update teacher conversation');
    }
  } else {
    // Create new conversation
    const { error: insertError } = await supabase
      .from('teacher_conversations')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        conversation_data: messages,
        shared_with_coach: sharedWithCoach
      });

    if (insertError) {
      console.error('Error creating teacher conversation:', insertError);
      throw new Error('Failed to create teacher conversation');
    }
  }
  
  return { success: true };
}

/**
 * Fetches user progress for a course
 */
export async function getUserCourseProgress(courseId: string, userId: string) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Get all lessons for the course
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId);
  
  if (lessonsError) {
    console.error('Error fetching course lessons:', lessonsError);
    throw new Error('Failed to load course progress');
  }
  
  // Get progress for all lessons in the course
  const { data: progress, error: progressError } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .in('lesson_id', lessons.map(lesson => lesson.id));
  
  if (progressError) {
    console.error('Error fetching lesson progress:', progressError);
    throw new Error('Failed to load lesson progress');
  }
  
  return { lessons, progress };
}

/**
 * Updates the user's lesson progress
 */
export async function updateLessonProgress(userId: string, lessonId: string, completed: boolean) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Check if a progress record already exists
  const { data: existingProgress, error: checkError } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
    console.error('Error checking lesson progress:', checkError);
    throw new Error('Failed to update lesson progress');
  }
  
  if (existingProgress) {
    // Update existing progress
    const { error: updateError } = await supabase
      .from('lesson_progress')
      .update({
        completed,
        last_accessed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', existingProgress.id);
    
    if (updateError) {
      console.error('Error updating lesson progress:', updateError);
      throw new Error('Failed to update lesson progress');
    }
  } else {
    // Create new progress entry
    const { error: insertError } = await supabase
      .from('lesson_progress')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        completed,
        last_accessed_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.error('Error creating lesson progress:', insertError);
      throw new Error('Failed to create lesson progress');
    }
  }
  
  return { success: true };
} 