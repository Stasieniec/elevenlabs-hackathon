import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a Supabase client with custom auth header handling
export const createClerkSupabaseClient = async (session: { getToken: (opts: { template: string }) => Promise<string | null> }) => {
  const token = await session.getToken({ template: 'supabase' })
  if (!token) {
    throw new Error('Failed to get Supabase token from Clerk session');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

// Export types
export type Course = {
  id: string
  title: string
  description: string | null
  created_at: string
}

export type Chapter = {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  created_at: string
}

export type Situation = {
  id: string
  chapter_id: string
  title: string
  description: string | null
  context: string
  order_index: number
  created_at: string
}

export type UserProgress = {
  id: string
  user_id: string // This is a UUID but we'll handle it as string in TypeScript
  situation_id: string
  completed: boolean
  score: number | null
  feedback: string | null
  created_at: string
} 