export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chapter_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          chapter_id: string
          completed: boolean
          completion_percentage: number
          average_score: number
          key_learnings: string[]
          areas_for_improvement: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          chapter_id: string
          completed?: boolean
          completion_percentage?: number
          average_score?: number
          key_learnings?: string[]
          areas_for_improvement?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          chapter_id?: string
          completed?: boolean
          completion_percentage?: number
          average_score?: number
          key_learnings?: string[]
          areas_for_improvement?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      conversation_performances: {
        Row: {
          id: string
          user_id: string
          course_id: string
          situation_id: string
          conversation_id: string
          score: number
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          situation_id: string
          conversation_id: string
          score?: number
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          situation_id?: string
          conversation_id?: string
          score?: number
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      course_enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          situation_id: string
          completed: boolean
          score: number
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          situation_id: string
          completed?: boolean
          score?: number
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          situation_id?: string
          completed?: boolean
          score?: number
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 