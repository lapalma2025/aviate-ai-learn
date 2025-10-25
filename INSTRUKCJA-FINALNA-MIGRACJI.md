# 🎯 PROSTA INSTRUKCJA MIGRACJI - 3 KROKI

## ✅ KROK 1: Wykonaj Skrypt Struktury Bazy

### 1.1 Otwórz Supabase Dashboard
1. Idź do: https://supabase.com/dashboard
2. Wybierz projekt: **kkfvsnifwgkzpsdmxqbt**

### 1.2 Wykonaj Skrypt SQL
1. Kliknij: **SQL Editor** (ikona </> w menu)
2. Kliknij: **New query**
3. Otwórz plik: `KOMPLETNA-MIGRACJA-SUPABASE.sql`
4. **SKOPIUJ I WKLEJ CAŁĄ ZAWARTOŚĆ**
5. Kliknij: **RUN** (lub Ctrl+Enter)
6. Poczekaj ~10 sekund

### 1.3 Sprawdź czy działa
W zakładce **Table Editor** powinieneś zobaczyć 6 tabel:
- ✅ questions (pusta)
- ✅ user_roles (pusta)
- ✅ user_progress (pusta)
- ✅ exam_sessions (pusta)
- ✅ exam_answers (pusta)
- ✅ user_notes (pusta)

---

## ✅ KROK 2: Konfiguracja Podstawowa

### 2.1 Wyłącz Email Confirmation (dla testów)
1. **Authentication** → **Providers** → **Email**
2. Znajdź: **Confirm email** 
3. **WYŁĄCZ** (toggle off)
4. **Save**

### 2.2 Dodaj Redirect URLs
1. **Authentication** → **URL Configuration**
2. **Redirect URLs** - dodaj:
   ```
   http://localhost:5173/**
   https://*.lovable.app/**
   ```
3. **Save**

---

## ✅ KROK 3: Import Pytań (Automatyczny!)

### 3.1 Odśwież Aplikację
1. Naciśnij **F5** lub **Ctrl+R** w przeglądarce
2. Aplikacja połączy się z nową bazą danych

### 3.2 Użyj Narzędzia Migracji
1. W przeglądarce wejdź na:
   ```
   http://localhost:5173/data-migration
   ```
   (lub w podglądzie Lovable kliknij ten link)

2. Zobaczysz kartę "Narzędzie Migracji Danych"

3. Kliknij: **"Rozpocznij Migrację"**

4. Poczekaj 1-2 minuty - zobaczysz:
   - Progress bar (postęp)
   - Status importu
   - Licznik: X/1332 pytania

5. Po zakończeniu zobaczysz:
   - ✅ Sukces: 1332 pytania
   - ❌ Błędy: 0

### 3.3 Sprawdź czy działa
1. Idź do: **Nauka** (lewe menu)
2. Pytania powinny się załadować!
3. Możesz zacząć odpowiadać

---

## 🎓 KROK 4: Utwórz Konto i Nadaj Role Admin

### 4.1 Zarejestruj się
1. Idź do strony głównej lub logowania
2. Kliknij "Zarejestruj się"
3. Wpisz email i hasło
4. **WAŻNE**: Email NIE wymaga potwierdzenia (bo wyłączyliśmy w kroku 2.1)
5. Zostaniesz automatycznie zalogowany

### 4.2 Nadaj sobie rolę Admin (w Supabase)
1. Wróć do Supabase Dashboard
2. **Table Editor** → **user_roles**
3. Kliknij: **Insert** → **Insert row**
4. Wpisz:
   - `user_id`: **[Twój User ID]** (sprawdź w zakładce **Authentication** → **Users**)
   - `role`: **admin**
5. **Save**

### 4.3 Odśwież aplikację
1. Naciśnij **F5**
2. W lewym menu zobaczysz nową opcję: **Panel Admina**

---

## 🚀 GOTOWE!

### Sprawdź czy wszystko działa:
- ✅ Pytania się ładują w sekcji "Nauka"
- ✅ Możesz odpowiadać na pytania
- ✅ Postęp się zapisuje
- ✅ Egzamin próbny działa
- ✅ Panel admina jest dostępny (jeśli nadałeś rolę)

---

## 🆘 Problemy?

### Problem: "Nie widzę żadnych pytań"
**Rozwiązanie:**
- Sprawdź czy wykonałeś KROK 3.2 (import przez narzędzie migracji)
- Otwórz konsolę przeglądarki (F12) i sprawdź błędy
- Sprawdź w Supabase Table Editor czy tabela `questions` ma 1,332 wierszy

### Problem: "Row Level Security" error
**Rozwiązanie:**
- Upewnij się że wykonałeś CAŁY skrypt z KROKU 1
- Sprawdź w **Database** → **Policies** czy są polityki RLS

### Problem: "Failed to fetch"
**Rozwiązanie:**
- Sprawdź plik `.env` - czy ma poprawny URL i klucz
- Sprawdź w Supabase Dashboard → Settings → API czy URL się zgadza

### Problem: "Narzędzie migracji daje błędy"
**Rozwiązanie:**
- Sprawdź czy tabela `questions` jest PUSTA przed migracją
- Jeśli nie jest pusta, usuń wszystkie pytania:
  ```sql
  DELETE FROM questions;
  ```
  I spróbuj ponownie

---

## 📞 Następne Kroki

Po pomyślnej migracji:
1. **Usuń stronę migracji** (opcjonalnie, już nie będzie potrzebna)
2. **Skonfiguruj Edge Functions** (parse-pdf, ai-explain, generate-explanations)
3. **Dodaj LOVABLE_API_KEY** do Supabase Secrets
4. **Testuj aplikację**

---

## 🎉 Gratulacje!

Twoja aplikacja PPLA Academy działa teraz na Twoim własnym Supabase! 🚁✈️

Wszystkie pytania, struktura bazy i funkcjonalności zostały przeniesione.
