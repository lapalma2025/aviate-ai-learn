-- Add category column to exam_sessions
ALTER TABLE exam_sessions 
ADD COLUMN category text DEFAULT 'all';

COMMENT ON COLUMN exam_sessions.category IS 'Category of exam questions: all or specific category name';