-- Update the requesting_user_id function to use the user_id claim
CREATE OR REPLACE FUNCTION requesting_user_id() 
RETURNS text AS $$ 
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'user_id', '')::text;
$$ LANGUAGE sql;

-- Update RLS policies for course_enrollments
DROP POLICY IF EXISTS "Users can view their own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Users can enroll in courses" ON course_enrollments;
DROP POLICY IF EXISTS "Users can unenroll from courses" ON course_enrollments;

CREATE POLICY "Users can view their own enrollments" 
  ON course_enrollments FOR SELECT 
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can enroll in courses" 
  ON course_enrollments FOR INSERT 
  WITH CHECK (requesting_user_id() = user_id);

CREATE POLICY "Users can unenroll from courses" 
  ON course_enrollments FOR DELETE 
  USING (requesting_user_id() = user_id);

-- Update RLS policies for chapter_progress
DROP POLICY IF EXISTS "Users can view their own progress" ON chapter_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON chapter_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON chapter_progress;

CREATE POLICY "Users can view their own progress" 
  ON chapter_progress FOR SELECT 
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON chapter_progress FOR UPDATE
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON chapter_progress FOR INSERT 
  WITH CHECK (requesting_user_id() = user_id);

-- Update RLS policies for user_progress
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;

CREATE POLICY "Users can view their own progress" 
  ON user_progress FOR SELECT 
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON user_progress FOR UPDATE
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON user_progress FOR INSERT 
  WITH CHECK (requesting_user_id() = user_id); 