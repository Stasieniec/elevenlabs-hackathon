-- Update user IDs in all tables to ensure they have the 'user_' prefix
UPDATE user_progress
SET user_id = CASE 
  WHEN user_id NOT LIKE 'user_%' THEN 'user_' || user_id 
  ELSE user_id 
END;

UPDATE chapter_progress
SET user_id = CASE 
  WHEN user_id NOT LIKE 'user_%' THEN 'user_' || user_id 
  ELSE user_id 
END;

UPDATE course_enrollments
SET user_id = CASE 
  WHEN user_id NOT LIKE 'user_%' THEN 'user_' || user_id 
  ELSE user_id 
END;

UPDATE conversation_performances
SET user_id = CASE 
  WHEN user_id NOT LIKE 'user_%' THEN 'user_' || user_id 
  ELSE user_id 
END;

UPDATE user_preferences
SET user_id = CASE 
  WHEN user_id NOT LIKE 'user_%' THEN 'user_' || user_id 
  ELSE user_id 
END;

UPDATE user_goals
SET user_id = CASE 
  WHEN user_id NOT LIKE 'user_%' THEN 'user_' || user_id 
  ELSE user_id 
END; 