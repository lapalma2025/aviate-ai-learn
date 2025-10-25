// Skrypt generujący KOMPLETNY plik SQL ze strukturą bazy + wszystkimi pytaniami
// Wystarczy uruchomić: node generate-complete-migration.js
// Powstanie plik KOMPLETNA-MIGRACJA-Z-PYTANIAMI.sql gotowy do wykonania w Supabase

const fs = require('fs');

// Dane do połączenia z OBECNYM Supabase (źródło danych)
const SUPABASE_URL = 'https://exkmhzdwgiovivncdmtp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4a21oemR3Z2lvdml2bmNkbXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNTgzNzUsImV4cCI6MjA3NjYzNDM3NX0.By2dpO-vlwxXEbzJOKCXhh6rzsvkqnPDhR5-Xw6X84Q';

async function generateCompleteSQL() {
  console.log('🚀 Rozpoczynam generowanie kompletnej migracji...\n');
  
  try {
    // Pobieranie pytań z bazy
    console.log('📥 Pobieranie pytań z bazy danych...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/questions?select=*&order=created_at`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const questions = await response.json();
    console.log(`✅ Pobrano ${questions.length} pytań\n`);

    // Funkcja do escapowania stringów SQL
    function escapeSql(str) {
      if (!str) return '';
      return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
    }

    console.log('📝 Generowanie pliku SQL...');

    // Początek pliku SQL
    let sqlContent = `-- =====================================================
-- KOMPLETNA MIGRACJA PPLA ACADEMY
-- =====================================================
-- Ten skrypt tworzy CAŁĄ strukturę bazy danych i importuje wszystkie pytania
-- 
-- JAK UŻYĆ:
-- 1. Zaloguj się do Supabase Dashboard: https://supabase.com/dashboard
-- 2. Wybierz swój projekt
-- 3. Przejdź do: SQL Editor
-- 4. Kliknij: New query
-- 5. Skopiuj i wklej CAŁĄ zawartość tego pliku
-- 6. Kliknij: RUN (Ctrl+Enter)
-- 7. Poczekaj 1-2 minuty aż wszystko się wykona
-- 
-- ⚠️ WAŻNE: 
-- - Ten skrypt MUSI być wykonany na PUSTEJ bazie danych
-- - Jeśli masz już jakieś tabele, najpierw je usuń
-- - Po wykonaniu będziesz miał ${questions.length} pytań gotowych do użycia
-- =====================================================

-- =====================================================
-- CZĘŚĆ 1: TYPY ENUM
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
-- CZĘŚĆ 2: TABELE
-- =====================================================

-- Tabela: questions (pytania egzaminacyjne)
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

-- Tabela: user_roles (role użytkowników - admin/student)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Tabela: user_progress (historia odpowiedzi użytkownika)
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  time_spent_seconds INTEGER,
  explanation TEXT
);

-- Tabela: exam_sessions (sesje egzaminacyjne)
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

-- Tabela: exam_answers (odpowiedzi w sesji egzaminacyjnej)
CREATE TABLE public.exam_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela: user_notes (notatki użytkownika)
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
-- CZĘŚĆ 3: FUNKCJE
-- =====================================================

-- Funkcja: has_role (sprawdza czy użytkownik ma określoną rolę)
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

-- Funkcja: update_updated_at_column (automatyczna aktualizacja updated_at)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CZĘŚĆ 4: ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Włączenie RLS na wszystkich tabelach
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla questions
CREATE POLICY "Anyone can view questions"
ON public.questions FOR SELECT USING (true);

CREATE POLICY "Admins can insert questions"
ON public.questions FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update questions"
ON public.questions FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete questions"
ON public.questions FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Polityki RLS dla user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Polityki RLS dla user_progress
CREATE POLICY "Users can view own progress"
ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Polityki RLS dla exam_sessions
CREATE POLICY "Users can view own exam sessions"
ON public.exam_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exam sessions"
ON public.exam_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exam sessions"
ON public.exam_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Polityki RLS dla exam_answers
CREATE POLICY "Users can view own exam answers"
ON public.exam_answers FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.exam_sessions
  WHERE exam_sessions.id = exam_answers.session_id
  AND exam_sessions.user_id = auth.uid()
));

CREATE POLICY "Users can insert own exam answers"
ON public.exam_answers FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.exam_sessions
  WHERE exam_sessions.id = exam_answers.session_id
  AND exam_sessions.user_id = auth.uid()
));

-- Polityki RLS dla user_notes
CREATE POLICY "Users can manage own notes"
ON public.user_notes FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- CZĘŚĆ 5: TRIGGERY
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
-- CZĘŚĆ 6: INDEKSY (dla wydajności)
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
-- CZĘŚĆ 7: IMPORT PYTAŃ (${questions.length} pytań)
-- =====================================================
-- 
-- ⚠️ Ta sekcja zawiera ${questions.length} pytań egzaminacyjnych
-- Wykonanie może potrwać 1-2 minuty - to normalne!
-- 
-- =====================================================

`;

    // Generowanie INSERT statements dla wszystkich pytań
    console.log('📊 Dodawanie pytań do pliku...');
    
    questions.forEach((q, index) => {
      const question = escapeSql(q.question);
      const answerA = escapeSql(q.answer_a);
      const answerB = escapeSql(q.answer_b);
      const answerC = escapeSql(q.answer_c);
      const answerD = escapeSql(q.answer_d);
      const correctAnswer = q.correct_answer || 'A';
      const category = q.category || 'operational_procedures';
      const questionCode = q.question_code ? `'${escapeSql(q.question_code)}'` : 'NULL';
      const explanation = q.explanation ? `'${escapeSql(q.explanation)}'` : 'NULL';
      const imageUrl = q.image_url ? `'${escapeSql(q.image_url)}'` : 'NULL';

      sqlContent += `-- Pytanie ${index + 1}/${questions.length}\n`;
      sqlContent += `INSERT INTO public.questions (question, answer_a, answer_b, answer_c, answer_d, correct_answer, category, question_code, explanation, image_url) VALUES (\n`;
      sqlContent += `  '${question}',\n`;
      sqlContent += `  '${answerA}',\n`;
      sqlContent += `  '${answerB}',\n`;
      sqlContent += `  '${answerC}',\n`;
      sqlContent += `  '${answerD}',\n`;
      sqlContent += `  '${correctAnswer}',\n`;
      sqlContent += `  '${category}'::question_category,\n`;
      sqlContent += `  ${questionCode},\n`;
      sqlContent += `  ${explanation},\n`;
      sqlContent += `  ${imageUrl}\n`;
      sqlContent += `);\n\n`;

      if ((index + 1) % 100 === 0) {
        console.log(`   ✏️  ${index + 1}/${questions.length} pytań...`);
      }
    });

    // Zakończenie pliku
    sqlContent += `-- =====================================================
-- KONIEC MIGRACJI
-- =====================================================
-- 
-- ✅ GRATULACJE! Migracja zakończona!
-- 
-- Zostało utworzone:
-- - 6 tabel (questions, user_roles, user_progress, exam_sessions, exam_answers, user_notes)
-- - ${questions.length} pytań egzaminacyjnych
-- - Wszystkie polityki RLS
-- - Triggery i indeksy
-- 
-- NASTĘPNE KROKI:
-- 1. Sprawdź w Table Editor czy wszystko się utworzyło
-- 2. Skonfiguruj Authentication (wyłącz email confirmation dla testów)
-- 3. Zarejestruj się w aplikacji
-- 4. Nadaj sobie rolę admin w tabeli user_roles
-- 5. Gotowe! Możesz korzystać z aplikacji
-- 
-- =====================================================
`;

    // Zapisanie do pliku
    const outputFile = 'KOMPLETNA-MIGRACJA-Z-PYTANIAMI.sql';
    fs.writeFileSync(outputFile, sqlContent, 'utf8');
    
    const fileSizeMB = (fs.statSync(outputFile).size / 1024 / 1024).toFixed(2);
    
    console.log(`\n✅ SUKCES! Plik został wygenerowany!\n`);
    console.log(`📦 Plik: ${outputFile}`);
    console.log(`📊 Rozmiar: ${fileSizeMB} MB`);
    console.log(`📝 Zawiera: ${questions.length} pytań + całą strukturę bazy\n`);
    console.log(`═══════════════════════════════════════════════════════`);
    console.log(`🚀 JAK UŻYĆ:`);
    console.log(`   1. Otwórz Supabase Dashboard → SQL Editor`);
    console.log(`   2. New query`);
    console.log(`   3. Skopiuj i wklej CAŁĄ zawartość pliku`);
    console.log(`   4. Kliknij RUN`);
    console.log(`   5. Poczekaj 1-2 minuty`);
    console.log(`   6. Gotowe! ✨`);
    console.log(`═══════════════════════════════════════════════════════\n`);

  } catch (error) {
    console.error('\n❌ BŁĄD:', error.message);
    console.error('\n💡 Sprawdź czy:');
    console.error('   - Masz dostęp do internetu');
    console.error('   - URL Supabase jest poprawny');
    console.error('   - Klucz API jest aktywny\n');
  }
}

// Uruchom generator
generateCompleteSQL();
