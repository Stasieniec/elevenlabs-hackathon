-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;

-- Update the user_progress table to use TEXT for user_id
ALTER TABLE user_progress ALTER COLUMN user_id TYPE TEXT;

-- Add RLS policies
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" 
  ON user_progress FOR SELECT 
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON user_progress FOR UPDATE
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON user_progress FOR INSERT 
  WITH CHECK (requesting_user_id() = user_id); 