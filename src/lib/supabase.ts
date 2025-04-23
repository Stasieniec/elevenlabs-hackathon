import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a Supabase client with custom auth header handling
export const createClerkSupabaseClient = async (session: { getToken: (opts: { template: string }) => Promise<string | null> }) => {
  const token = await session.getToken({ template: 'supabase' })
  if (!token) {
    throw new Error('Failed to get Supabase token from Clerk session');
  }
  
  return createClient<Database>(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

// Export types for convenience
export type User = Database['public']['Tables']['users']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type LessonStage = Database['public']['Tables']['lesson_stages']['Row']
export type CourseEnrollment = Database['public']['Tables']['course_enrollments']['Row']
export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'] 