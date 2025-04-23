import { Database } from './database.types'

// Only export types now, client creation is handled in the provider
export type User = Database['public']['Tables']['users']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type LessonStage = Database['public']['Tables']['lesson_stages']['Row']
export type CourseEnrollment = Database['public']['Tables']['course_enrollments']['Row']
export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'] 