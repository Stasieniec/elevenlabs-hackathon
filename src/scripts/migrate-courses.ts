/**
 * Migration script for converting static course data to new database schema
 * Run with: npx ts-node src/scripts/migrate-courses.ts
 */

import { createClient } from '@supabase/supabase-js';
import { courses } from '../lib/courses';
import { Database } from '../lib/database.types';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client with service role key for admin operations
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function migrateCourses() {
  console.log('Starting course migration...');

  // Map for storing generated UUIDs
  const categoryMap = new Map<string, string>();
  const courseMap = new Map<string, string>();
  const lessonMap = new Map<string, string>();
  
  try {
    // 1. Create categories first
    console.log('Creating categories...');
    const categories = new Set(courses.map(course => course.category));
    
    for (const category of categories) {
      console.log(`  - Creating category: ${category}`);
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category,
          description: `${category.charAt(0).toUpperCase() + category.slice(1)} courses`
        })
        .select('id')
        .single();
      
      if (error) {
        throw new Error(`Failed to create category ${category}: ${error.message}`);
      }
      
      categoryMap.set(category, data.id);
    }
    
    // 2. Create courses
    console.log('Creating courses...');
    for (const course of courses) {
      console.log(`  - Creating course: ${course.title}`);
      
      const categoryId = categoryMap.get(course.category);
      if (!categoryId) {
        throw new Error(`Category ID not found for ${course.category}`);
      }
      
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: course.title,
          description: course.description,
          category_id: categoryId,
          difficulty_level: course.category === 'professional' ? 'Advanced' : 'Beginner',
          estimated_duration: 60, // Default: 60 minutes
        })
        .select('id')
        .single();
      
      if (error) {
        throw new Error(`Failed to create course ${course.title}: ${error.message}`);
      }
      
      courseMap.set(course.id, data.id);
      
      // 3. Create lessons and lesson stages for each course
      if (course.chapters && course.chapters.length > 0) {
        console.log(`    Creating lessons for ${course.title}...`);
        
        for (const chapter of course.chapters) {
          console.log(`      - Creating lesson: ${chapter.title}`);
          
          const { data: lessonData, error: lessonError } = await supabase
            .from('lessons')
            .insert({
              course_id: data.id,
              title: chapter.title,
              description: chapter.description,
              order_number: chapter.order || 0
            })
            .select('id')
            .single();
          
          if (lessonError) {
            throw new Error(`Failed to create lesson ${chapter.title}: ${lessonError.message}`);
          }
          
          lessonMap.set(chapter.id, lessonData.id);
          
          // Create three stages for each lesson
          console.log(`        Creating stages for ${chapter.title}...`);
          
          // Stage 1: Theory/Introduction
          await supabase
            .from('lesson_stages')
            .insert({
              lesson_id: lessonData.id,
              stage_number: 1,
              title: 'Introduction',
              content: JSON.stringify({
                type: 'theory',
                content: `Introduction to ${chapter.title}. This section explains key concepts.`
              })
            });
          
          // Stage 2: Practice
          await supabase
            .from('lesson_stages')
            .insert({
              lesson_id: lessonData.id,
              stage_number: 2,
              title: 'Practice',
              content: JSON.stringify({
                type: 'interactive',
                content: `Practice section for ${chapter.title}. Interactive exercises to build skills.`
              })
            });
          
          // Stage 3: Conversation
          await supabase
            .from('lesson_stages')
            .insert({
              lesson_id: lessonData.id,
              stage_number: 3,
              title: 'Conversation',
              content: JSON.stringify({
                type: 'conversation',
                scenario: `Conversation scenario for ${chapter.title}. Apply what you've learned in a realistic conversation.`,
                situations: chapter.situations.map(situation => ({
                  id: situation.id,
                  title: situation.title,
                  description: situation.description,
                  context: situation.context || ''
                }))
              })
            });
        }
      }
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateCourses().catch(console.error); 