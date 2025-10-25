-- =====================================================
-- EKSPORT UŻYTKOWNIKA I NOTATEK
-- Data eksportu: 2025-10-25
-- =====================================================

-- =====================================================
-- 1. UŻYTKOWNIK (auth.users)
-- =====================================================
-- UWAGA: Ten INSERT działa tylko jeśli masz dostęp do tabeli auth.users
-- W większości przypadków użytkownicy są dodawani przez Supabase Auth API

-- Jeśli chcesz dodać użytkownika manualnie:
/*
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '9ea3f56f-a87c-4d59-86c0-30e05a31ab62',
  'm.zborowski@polskiedzieje.pl',
  '$2a$10$EXAMPLE_HASH', -- Musisz wygenerować hash hasła
  '2025-10-21 15:00:15.136585+00',
  '2025-10-21 15:00:15.136585+00',
  '2025-10-21 15:00:15.136585+00',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
);
*/

-- ZALECANA METODA: Użytkownik powinien się zarejestrować przez aplikację
-- Potem możesz zmienić jego UUID w bazie jeśli potrzebujesz zachować to ID

-- =====================================================
-- 2. ROLA UŻYTKOWNIKA (user_roles)
-- =====================================================

INSERT INTO public.user_roles (id, user_id, role, created_at) 
VALUES (
  '9ae62186-1e3c-495c-85b5-0d0ac2a8dfd5',
  '9ea3f56f-a87c-4d59-86c0-30e05a31ab62',
  'admin',
  '2025-10-21 15:10:18.619423+00'
)
ON CONFLICT (user_id, role) DO NOTHING;

-- =====================================================
-- 3. NOTATKI UŻYTKOWNIKA (user_notes)
-- =====================================================

INSERT INTO public.user_notes (id, user_id, title, content, link, tags, created_at, updated_at) VALUES
('ccdd4b9b-ab0a-4cc1-a8a3-69807bd649a5', '9ea3f56f-a87c-4d59-86c0-30e05a31ab62', 'Procedruy23', 'lorem', NULL, NULL, '2025-10-23 16:01:27.839+00', '2025-10-23 16:01:27.839+00'),
('21427f85-9cc8-49e8-b65d-089c5f698861', '9ea3f56f-a87c-4d59-86c0-30e05a31ab62', 'Procedura2', 'lorem', NULL, NULL, '2025-10-23 16:02:02.822334+00', '2025-10-23 16:02:02.822334+00'),
('73af5b4d-3d67-475d-9d30-9bca7e8eb771', '9ea3f56f-a87c-4d59-86c0-30e05a31ab62', 'Procedrua', '3432432', NULL, NULL, '2025-10-23 16:15:45.217969+00', '2025-10-23 16:15:45.217969+00'),
('ebfc1923-32bd-4f5a-963d-05bc30787eae', '9ea3f56f-a87c-4d59-86c0-30e05a31ab62', 'Procedura666', 'rewrwer', NULL, NULL, '2025-10-23 16:20:04.258055+00', '2025-10-23 16:20:04.258055+00'),
('7d85215e-8673-43ff-b726-9f33f94da15d', '9ea3f56f-a87c-4d59-86c0-30e05a31ab62', 'dasd', 'dasasdas', NULL, NULL, '2025-10-23 16:20:09.189002+00', '2025-10-23 16:20:09.189002+00'),
('2f124f44-49e3-437a-abdb-9eb3523f87e0', '9ea3f56f-a87c-4d59-86c0-30e05a31ab62', 'asdasd', 'sadasdsad', NULL, NULL, '2025-10-23 16:20:13.019051+00', '2025-10-23 16:20:13.019051+00');

-- =====================================================
-- INSTRUKCJE IMPORTU
-- =====================================================

/*
KROK 1: Zarejestruj użytkownika przez aplikację
   - Email: m.zborowski@polskiedzieje.pl
   - Hasło: [ustaw swoje]

KROK 2: Po rejestracji znajdź UUID użytkownika
   SELECT id, email FROM auth.users WHERE email = 'm.zborowski@polskiedzieje.pl';

KROK 3A: Jeśli UUID się zgadza (9ea3f56f-a87c-4d59-86c0-30e05a31ab62)
   - Uruchom powyższe SQL (rola + notatki)

KROK 3B: Jeśli UUID jest inny
   - Zamień wszystkie wystąpienia '9ea3f56f-a87c-4d59-86c0-30e05a31ab62' 
     na nowy UUID użytkownika w tym pliku
   - Potem uruchom SQL

KROK 4: Zweryfikuj import
   SELECT * FROM user_roles WHERE user_id = '9ea3f56f-a87c-4d59-86c0-30e05a31ab62';
   SELECT * FROM user_notes WHERE user_id = '9ea3f56f-a87c-4d59-86c0-30e05a31ab62';
*/

-- =====================================================
-- STATYSTYKI
-- =====================================================
-- Użytkownik: m.zborowski@polskiedzieje.pl
-- Rola: admin
-- Liczba notatek: 6
-- Data najstarszej notatki: 2025-10-23 16:01:27
-- Data najnowszej notatki: 2025-10-23 16:20:13
-- =====================================================
