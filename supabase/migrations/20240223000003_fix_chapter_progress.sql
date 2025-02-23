-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view their own progress" ON chapter_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON chapter_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON chapter_progress;

-- Update the chapter_progress table to use TEXT for user_id
ALTER TABLE chapter_progress ALTER COLUMN user_id TYPE TEXT;

-- Add RLS policies
ALTER TABLE chapter_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" 
  ON chapter_progress FOR SELECT 
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON chapter_progress FOR UPDATE
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON chapter_progress FOR INSERT 
  WITH CHECK (requesting_user_id() = user_id); 