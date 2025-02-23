-- Create course_enrollments table
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, course_id)
);

-- Add RLS policies
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments" 
  ON course_enrollments FOR SELECT 
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can enroll in courses" 
  ON course_enrollments FOR INSERT 
  WITH CHECK (requesting_user_id() = user_id);

CREATE POLICY "Users can unenroll from courses" 
  ON course_enrollments FOR DELETE 
  USING (requesting_user_id() = user_id);

-- Add trigger for last_accessed_at
CREATE OR REPLACE FUNCTION update_last_accessed_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_accessed_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_course_enrollment_last_accessed
    BEFORE UPDATE ON course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_last_accessed_at(); 