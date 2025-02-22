import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

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