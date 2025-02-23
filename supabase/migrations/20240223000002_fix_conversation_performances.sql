-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view their own performances" ON conversation_performances;
DROP POLICY IF EXISTS "Users can create their own performances" ON conversation_performances;
DROP POLICY IF EXISTS "Users can update their own performances" ON conversation_performances;
DROP POLICY IF EXISTS "Users can delete their own performances" ON conversation_performances;

-- Update the conversation_performances table to use TEXT for user_id
ALTER TABLE conversation_performances ALTER COLUMN user_id TYPE TEXT;

-- Add RLS policies
ALTER TABLE conversation_performances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own performances" 
  ON conversation_performances FOR SELECT 
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can create their own performances" 
  ON conversation_performances FOR INSERT 
  WITH CHECK (requesting_user_id() = user_id);

CREATE POLICY "Users can update their own performances" 
  ON conversation_performances FOR UPDATE
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can delete their own performances" 
  ON conversation_performances FOR DELETE 
  USING (requesting_user_id() = user_id); 