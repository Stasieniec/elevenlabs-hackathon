-- First, drop existing foreign key constraints
ALTER TABLE chapter_progress DROP CONSTRAINT IF EXISTS chapter_progress_user_id_course_id_fkey;

-- Re-create the foreign key constraint with CASCADE
ALTER TABLE chapter_progress 
  ADD CONSTRAINT chapter_progress_user_id_course_id_fkey 
  FOREIGN KEY (user_id, course_id) 
  REFERENCES course_enrollments(user_id, course_id) 
  ON DELETE CASCADE;

-- Add DELETE policy to chapter_progress
DROP POLICY IF EXISTS "Users can delete their own progress" ON chapter_progress;

CREATE POLICY "Users can delete their own progress" 
  ON chapter_progress FOR DELETE 
  USING (requesting_user_id() = user_id);

-- Add DELETE policy to user_progress
DROP POLICY IF EXISTS "Users can delete their own progress" ON user_progress;

CREATE POLICY "Users can delete their own progress" 
  ON user_progress FOR DELETE 
  USING (requesting_user_id() = user_id); 