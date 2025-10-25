# 🚀 Instrukcje Migracji PPLA Academy do Twojego Supabase

## 📊 Podsumowanie danych do przeniesienia:
- ✅ **1,332 pytań egzaminacyjnych**
- ✅ **71 rekordów postępu użytkownika**
- ✅ **8 sesji egzaminacyjnych**
- ✅ **6 notatek użytkownika**
- ✅ **1 rola admina**
- ✅ **3 Edge Functions**

---

## 📋 KROK 1: Przygotowanie Supabase Dashboard

### 1.1 Zaloguj się do Supabase
1. Otwórz: https://supabase.com/dashboard
2. Wybierz projekt: **kkfvsnifwgkzpsdmxqbt**

### 1.2 Włącz Auto-Confirm Email (Ważne!)
1. Idź do: **Authentication** → **Providers** → **Email**
2. Znajdź: **Confirm email**
3. **WYŁĄCZ** tę opcję (dla testów)
4. Kliknij **Save**

---

## 📋 KROK 2: Wykonanie Migracji Struktury Bazy

### 2.1 Otwórz SQL Editor
1. W dashboardzie Supabase kliknij: **SQL Editor** (ikona </> w lewym menu)
2. Kliknij: **New query**

### 2.2 Wykonaj Skrypt Struktury
1. Otwórz plik: `migration-to-your-supabase.sql`
2. **Skopiuj CAŁĄ zawartość**
3. Wklej do SQL Editor w Supabase
4. Kliknij: **RUN** (lub Ctrl+Enter)

### 2.3 Sprawdź czy wszystko działa
Po wykonaniu powinieneś zobaczyć:
- ✅ "Success. No rows returned"
- ✅ W zakładce **Table Editor** zobaczysz 6 nowych tabel:
  - `questions`
  - `user_roles`
  - `user_progress`
  - `exam_sessions`
  - `exam_answers`
  - `user_notes`

**Jeśli coś poszło nie tak:**
- Sprawdź czy w zakładce **Database** → **Enums** są 2 enumy: `question_category` i `app_role`
- Jeśli są błędy, skopiuj błąd i daj mi znać

---

## 📋 KROK 3: Import Danych (Czekam na Twoje potwierdzenie)

**⚠️ UWAGA**: Dane są duże (1,332 pytań), więc przygotowuję teraz skrypt eksportu.

Gdy potwierdzisz, że KROK 2 wykonał się poprawnie, dam Ci:
- Skrypt SQL z wszystkimi pytaniami
- Skrypt z rolami użytkowników
- Instrukcje importu

---

## 📋 KROK 4: Wdrożenie Edge Functions (BEZ CLI)

Ponieważ nie masz Supabase CLI, mamy 2 opcje:

### Opcja A: Zainstaluj Supabase CLI (Polecane, 5 minut)
```bash
# Windows (PowerShell):
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# macOS (Homebrew):
brew install supabase/tap/supabase

# Linux:
brew install supabase/tap/supabase
```

Po instalacji:
```bash
# 1. Login do Supabase
supabase login

# 2. Link do projektu
supabase link --project-ref kkfvsnifwgkzpsdmxqbt

# 3. Deploy funkcji
supabase functions deploy parse-pdf
supabase functions deploy ai-explain
supabase functions deploy generate-explanations
```

### Opcja B: Ręczne utworzenie przez Dashboard (Dłuższe)

Dla każdej funkcji musisz:

#### Funkcja 1: parse-pdf
1. **Dashboard** → **Edge Functions** → **Create a new function**
2. Nazwa: `parse-pdf`
3. Skopiuj kod z: `supabase/functions/parse-pdf/index.ts`
4. Deploy

#### Funkcja 2: ai-explain
1. **Dashboard** → **Edge Functions** → **Create a new function**
2. Nazwa: `ai-explain`
3. Skopiuj kod z: `supabase/functions/ai-explain/index.ts`
4. Deploy

#### Funkcja 3: generate-explanations
1. **Dashboard** → **Edge Functions** → **Create a new function**
2. Nazwa: `generate-explanations`
3. Skopiuj kod z: `supabase/functions/generate-explanations/index.ts`
4. Deploy

---

## 📋 KROK 5: Konfiguracja Sekretów (Secrets)

### 5.1 Dodaj LOVABLE_API_KEY
1. **Dashboard** → **Project Settings** (ikona ⚙️)
2. **Edge Functions** → **Manage secrets**
3. Kliknij: **Add new secret**
4. Nazwa: `LOVABLE_API_KEY`
5. Wartość: **DAM CI ZARAZ KLUCZ** (poczekaj na następny krok)
6. Kliknij **Save**

---

## 📋 KROK 6: Konfiguracja Authentication

### 6.1 Włącz Email/Password Provider
1. **Authentication** → **Providers**
2. Znajdź **Email**
3. Upewnij się że jest **włączony**

### 6.2 Skonfiguruj Redirect URLs
1. **Authentication** → **URL Configuration**
2. **Site URL**: Wpisz URL swojej aplikacji (np. `https://twoja-domena.com`)
3. **Redirect URLs**: Dodaj:
   - `http://localhost:5173/**` (dla testów lokalnych)
   - `https://twoja-domena.com/**` (Twoja produkcja)
4. **Save**

### 6.3 Wyłącz Email Confirmation (dla testów)
1. **Authentication** → **Providers** → **Email**
2. Znajdź: **Confirm email**
3. **WYŁĄCZ** (możesz włączyć później na produkcji)
4. **Save**

---

## 📋 KROK 7: Testowanie Połączenia

Po wykonaniu wszystkich kroków:

1. **Odśwież aplikację** (Ctrl+R lub F5)
2. Sprawdź konsolę przeglądarki (F12) - nie powinno być błędów
3. Spróbuj się zarejestrować nowym kontem
4. Sprawdź czy pytania się ładują w sekcji "Nauka"

---

## 🆘 Pomoc i Troubleshooting

### Problem: "Failed to fetch"
- Sprawdź czy URL i API key są poprawne w pliku `.env`
- Sprawdź Network tab w DevTools (F12)

### Problem: "Row Level Security" error
- Upewnij się że wykonałeś CAŁY skrypt `migration-to-your-supabase.sql`
- Sprawdź czy w **Database** → **Policies** są polityki RLS

### Problem: Edge Functions nie działają
- Sprawdź czy są wdrożone w **Edge Functions** w dashboardzie
- Sprawdź czy `LOVABLE_API_KEY` jest ustawiony w **Secrets**

---

## ✅ Checklist Migracji

- [ ] Krok 1: Włączony Auto-Confirm Email
- [ ] Krok 2: Wykonany skrypt `migration-to-your-supabase.sql`
- [ ] Krok 3: Zaimportowane dane (czekam na potwierdzenie)
- [ ] Krok 4: Wdrożone Edge Functions
- [ ] Krok 5: Dodany `LOVABLE_API_KEY` secret
- [ ] Krok 6: Skonfigurowany Authentication
- [ ] Krok 7: Przetestowane połączenie

---

## 📞 Następne Kroki

**WYKONAJ TERAZ:**
1. Wykonaj KROK 1 i KROK 2 z tej instrukcji
2. **DAJ MI ZNAĆ** gdy zakończysz - wtedy wyeksportuję dane
3. Otrzymasz skrypt z 1,332 pytaniami do importu

**NIE ZAPOMNIJ:**
- Zapisz sobie ten plik
- Rób screenshoty jeśli coś pójdzie nie tak
- Pytaj jeśli cokolwiek nie działa

---

🎓 **Powodzenia z migracją!**
