# Oratoria Database Structure

## Overview
Oratoria uses Supabase as its database provider. The database is designed to store only user-specific data, while course content is maintained in the codebase for better version control and maintainability.

## Tables

### user_preferences

Stores user preferences and language settings.

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  native_languages TEXT[] NOT NULL DEFAULT '{}',
  social_languages TEXT[] NOT NULL DEFAULT '{}',
  professional_languages TEXT[] NOT NULL DEFAULT '{}',
  desired_professional_style TEXT,
  desired_social_style TEXT,
  current_professional_style TEXT,
  current_social_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
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
  user_id UUID NOT NULL,
  situation_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
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

## Row Level Security (RLS)

Both tables implement Row Level Security to ensure users can only access their own data.

### user_preferences Policies:
```sql
CREATE POLICY "Users can view their own preferences" 
  ON user_preferences FOR SELECT 
  USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can insert their own preferences" 
  ON user_preferences FOR INSERT 
  WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON user_preferences FOR UPDATE 
  USING (auth.uid()::uuid = user_id);
```

### user_progress Policies:
```sql
CREATE POLICY "Users can view their own progress" 
  ON user_progress FOR SELECT 
  USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON user_progress FOR INSERT 
  WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can update their own progress" 
  ON user_progress FOR UPDATE 
  USING (auth.uid()::uuid = user_id);
```

## Automatic Timestamps

Both tables implement automatic `updated_at` timestamp updates using a trigger:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Course Content

Course content (courses, chapters, situations) is stored in the codebase under `src/lib/courses.ts` as static data. This includes:
- Course information
- Chapter structure
- Situation details
- AI persona configurations

This approach allows for:
- Version control of course content
- Easy content updates without database migrations
- Better development workflow
- Simpler deployment process 