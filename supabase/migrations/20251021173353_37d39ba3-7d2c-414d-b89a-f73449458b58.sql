-- Add explanation column to user_progress table to cache AI explanations
ALTER TABLE user_progress
ADD COLUMN explanation TEXT;

-- Add index for faster lookups
CREATE INDEX idx_user_progress_question_user ON user_progress(question_id, user_id);