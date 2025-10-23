-- Add question_code column to questions table
ALTER TABLE public.questions 
ADD COLUMN question_code TEXT;

-- Create index for better performance when searching by question_code
CREATE INDEX idx_questions_question_code ON public.questions(question_code);

-- Add unique constraint to prevent duplicate question codes
ALTER TABLE public.questions 
ADD CONSTRAINT unique_question_code UNIQUE (question_code);