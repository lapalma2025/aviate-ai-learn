-- =====================================================
-- MIGRACJA KOMPLETNA PPLA ACADEMY DO TWOJEGO SUPABASE
-- =====================================================
-- Wykonaj ten skrypt w Twoim Supabase Dashboard:
-- SQL Editor -> New Query -> Wklej poniższy kod -> Run

-- =====================================================
-- KROK 1: Utworzenie ENUM types
-- =====================================================

CREATE TYPE public.question_category AS ENUM (
  'meteorology',
  'navigation',
  'flight_planning',
  'aircraft_general',
  'flight_performance',
  'human_performance',
  'operational_procedures',
  'principles_of_flight',
  'communications',
  'air_law'
);

CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- =====================================================
-- KROK 2: Utworzenie tabel
-- =====================================================

-- Tabela: questions
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer_a TEXT NOT NULL,
  answer_b TEXT NOT NULL,
  answer_c TEXT NOT NULL,
  answer_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL DEFAULT 'A',
  category question_category DEFAULT 'operational_procedures',
  question_code TEXT,
  explanation TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela: user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Tabela: user_progress
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  time_spent_seconds INTEGER,
  explanation TEXT
);

-- Tabela: exam_sessions
CREATE TABLE public.exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  total_questions INTEGER NOT NULL DEFAULT 50,
  time_spent_seconds INTEGER,
  category TEXT DEFAULT 'all'
);

-- Tabela: exam_answers
CREATE TABLE public.exam_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela: user_notes
CREATE TABLE public.user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  link TEXT,
  tags TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- KROK 3: Funkcja has_role (Security Definer)
-- =====================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =====================================================
-- KROK 4: Funkcja update_updated_at_column (Trigger)
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- KROK 5: Włączenie Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- KROK 6: Polityki RLS dla questions
-- =====================================================

CREATE POLICY "Anyone can view questions"
ON public.questions
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert questions"
ON public.questions
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update questions"
ON public.questions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete questions"
ON public.questions
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- KROK 7: Polityki RLS dla user_roles
-- =====================================================

CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- KROK 8: Polityki RLS dla user_progress
-- =====================================================

CREATE POLICY "Users can view own progress"
ON public.user_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON public.user_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- KROK 9: Polityki RLS dla exam_sessions
-- =====================================================

CREATE POLICY "Users can view own exam sessions"
ON public.exam_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exam sessions"
ON public.exam_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exam sessions"
ON public.exam_sessions
FOR UPDATE
USING (auth.uid() = user_id);

-- =====================================================
-- KROK 10: Polityki RLS dla exam_answers
-- =====================================================

CREATE POLICY "Users can view own exam answers"
ON public.exam_answers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.exam_sessions
    WHERE exam_sessions.id = exam_answers.session_id
    AND exam_sessions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own exam answers"
ON public.exam_answers
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.exam_sessions
    WHERE exam_sessions.id = exam_answers.session_id
    AND exam_sessions.user_id = auth.uid()
  )
);

-- =====================================================
-- KROK 11: Polityki RLS dla user_notes
-- =====================================================

CREATE POLICY "Users can manage own notes"
ON public.user_notes
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- KROK 12: Triggery dla automatycznej aktualizacji updated_at
-- =====================================================

CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_notes_updated_at
BEFORE UPDATE ON public.user_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- KROK 13: Indeksy dla wydajności
-- =====================================================

CREATE INDEX idx_questions_category ON public.questions(category);
CREATE INDEX idx_questions_code ON public.questions(question_code);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_question_id ON public.user_progress(question_id);
CREATE INDEX idx_exam_sessions_user_id ON public.exam_sessions(user_id);
CREATE INDEX idx_exam_answers_session_id ON public.exam_answers(session_id);
CREATE INDEX idx_user_notes_user_id ON public.user_notes(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- =====================================================
-- KONIEC MIGRACJI STRUKTURY
-- =====================================================
-- STRUKTURA BAZY DANYCH JEST GOTOWA!
-- 
-- NASTĘPNY KROK: Wykonaj skrypt data-export.sql
-- aby zaimportować dane (pytania, role, postępy, itp.)
-- =====================================================
