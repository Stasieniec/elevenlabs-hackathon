# Oratoria Database Structure

## Overview
Oratoria uses Supabase as its database provider. The database is designed to store user-specific data, while course content is maintained in the codebase for better version control and maintainability.

## Tables

### user_preferences

Stores user preferences and language settings.

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT requesting_user_id(),
  native_languages TEXT[] NOT NULL DEFAULT '{}',
  social_languages TEXT[] NOT NULL DEFAULT '{}',
  professional_languages TEXT[] NOT NULL DEFAULT '{}',
  desired_professional_style TEXT,
  desired_social_style TEXT,
  current_professional_style TEXT,
  current_social_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);
```

#### Fields:
- `id`: Unique identifier for the preference record
- `user_id`: References the Clerk user ID
- `native_languages`: Array of languages the user is native in
- `social_languages`: Array of languages used in social settings
- `professional_languages`: Array of languages used in professional settings
- `desired_professional_style`: Target professional communication style
- `desired_social_style`: Target social communication style
- `current_professional_style`: Current professional communication style
- `current_social_style`: Current social communication style
- `created_at`: Timestamp of record creation
- `updated_at`: Timestamp of last update

### user_progress

Tracks user progress through situations and stores feedback.

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT requesting_user_id(),
  situation_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, situation_id)
);
```

#### Fields:
- `id`: Unique identifier for the progress record
- `user_id`: References the Clerk user ID
- `situation_id`: References the situation ID from the codebase
- `completed`: Whether the situation has been completed
- `score`: Numerical score for the situation (optional)
- `feedback`: Textual feedback for the situation (optional)
- `created_at`: Timestamp of record creation
- `updated_at`: Timestamp of last update

### course_enrollments

Stores user course enrollments and tracks their access.

```sql
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT requesting_user_id(),
  course_id TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  last_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, course_id)
);
```

#### Fields:
- `id`: Unique identifier for the enrollment record
- `user_id`: References the Clerk user ID
- `course_id`: References the course ID from the static course data
- `enrolled_at`: Timestamp when the user enrolled in the course
- `last_accessed_at`: Timestamp of last course access
- `UNIQUE(user_id, course_id)`: Ensures a user can only enroll once in a course

### user_goals

Tracks user's learning goals and their progress.

```sql
CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT requesting_user_id(),
  goal_type TEXT NOT NULL,
  goal_description TEXT NOT NULL,
  priority INTEGER,
  achieved BOOLEAN DEFAULT false,
  target_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### conversation_performances

Stores detailed metrics and feedback from conversation practice sessions.

```sql
CREATE TABLE conversation_performances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT requesting_user_id(),
  course_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  situation_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  duration_seconds INTEGER,
  clarity_score INTEGER,
  confidence_score INTEGER,
  appropriateness_score INTEGER,
  effectiveness_score INTEGER,
  strong_points TEXT[],
  weak_points TEXT[],
  ai_perception TEXT,
  improvement_suggestions TEXT,
  conversation_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### chapter_progress

Tracks user progress through course chapters.

```sql
CREATE TABLE chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT requesting_user_id(),
  course_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completion_percentage INTEGER DEFAULT 0,
  average_score INTEGER,
  key_learnings TEXT[],
  areas_for_improvement TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);
```

## Row Level Security (RLS)

All tables implement Row Level Security to ensure users can only access their own data. The `requesting_user_id()` function is used to extract the user ID from the JWT token:

```sql
CREATE OR REPLACE FUNCTION requesting_user_id() 
RETURNS text AS $$ 
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$ LANGUAGE sql;
```

### RLS Policies

Each table has the following policies:

```sql
-- Example for user_preferences (similar for all tables)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" 
  ON user_preferences FOR SELECT 
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can insert their own data" 
  ON user_preferences FOR INSERT 
  WITH CHECK (requesting_user_id() = user_id);

CREATE POLICY "Users can update their own data" 
  ON user_preferences FOR UPDATE 
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can delete their own data" 
  ON user_preferences FOR DELETE 
  USING (requesting_user_id() = user_id);
```

## Automatic Timestamps

Tables with `updated_at` fields have automatic timestamp updates through triggers:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_timestamp
    BEFORE UPDATE ON [table_name]
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

The `course_enrollments` table also implements automatic `last_accessed_at` timestamp updates:

```sql
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
```

## Authentication

The database uses Clerk for authentication. JWT tokens from Clerk are used to identify users, and the `requesting_user_id()` function extracts the user ID from these tokens. This ensures that users can only access their own data through Row Level Security policies.

## Course Content

Course content (courses, chapters, situations) is stored in the codebase under `src/app/courses/browse/page.tsx` as static data. This includes:
- Course information (title, description, category, difficulty)
- Duration and enrollment statistics
- Visual elements (icons, colors)

This approach allows for:
- Version control of course content
- Easy content updates without database migrations
- Better development workflow
- Simpler deployment process 