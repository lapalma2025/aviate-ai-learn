# 🎯 NAJPROSTSZA INSTRUKCJA - 3 KROKI

## Krok 1: Wygeneruj kompletny plik SQL

W terminalu uruchom:

```bash
node generate-complete-migration.js
```

**Co się stanie?**
- Skrypt pobierze wszystkie 1,332 pytania z obecnej bazy
- Wygeneruje plik: `KOMPLETNA-MIGRACJA-Z-PYTANIAMI.sql` (~5-10 MB)
- Plik będzie zawierał:
  - ✅ Strukturę bazy (6 tabel)
  - ✅ Wszystkie 1,332 pytania
  - ✅ RLS policies
  - ✅ Triggery i indeksy
  - ✅ Wszystko w jednym pliku!

---

## Krok 2: Wykonaj plik w Supabase

1. **Otwórz Supabase Dashboard**
   - https://supabase.com/dashboard
   - Wybierz swój projekt

2. **Przejdź do SQL Editor**
   - Kliknij ikonę `</>` w lewym menu
   - Kliknij: **New query**

3. **Wklej i uruchom**
   - Otwórz plik: `KOMPLETNA-MIGRACJA-Z-PYTANIAMI.sql`
   - **Skopiuj CAŁĄ zawartość** (może być duża!)
   - Wklej w SQL Editor
   - Kliknij: **RUN** (lub Ctrl+Enter)
   - ⏳ Poczekaj 1-2 minuty

4. **Sprawdź rezultat**
   - **Table Editor** → powinieneś zobaczyć 6 tabel
   - **questions** → powinno być 1,332 wierszy
   - ✅ Gotowe!

---

## Krok 3: Konfiguracja aplikacji

### 3.1 Wyłącz Email Confirmation
1. **Authentication** → **Providers** → **Email**
2. **Confirm email** → WYŁĄCZ (toggle off)
3. **Save**

### 3.2 Dodaj Redirect URLs
1. **Authentication** → **URL Configuration**
2. **Redirect URLs** → dodaj:
   ```
   http://localhost:5173/**
   https://*.lovable.app/**
   ```
3. **Save**

### 3.3 Zarejestruj się i nadaj rolę admin
1. W aplikacji kliknij: **Zarejestruj się**
2. Wpisz email i hasło
3. Zaloguj się
4. W Supabase Dashboard:
   - **Table Editor** → **user_roles**
   - **Insert row**
   - `user_id`: [Twój ID z zakładki Authentication → Users]
   - `role`: `admin`
   - **Save**
5. Odśwież aplikację (F5)
6. W menu zobaczysz: **Panel Admina**

---

## 🎉 GOTOWE!

Wszystko powinno działać:
- ✅ 1,332 pytań w bazie
- ✅ Pytania ładują się w sekcji "Nauka"
- ✅ Możesz odpowiadać i zapisywać postęp
- ✅ Egzaminy działają
- ✅ Panel admina dostępny

---

## 🆘 Problemy?

### "Cannot read property of undefined"
- Upewnij się że wykonałeś CAŁY plik SQL
- Sprawdź czy wszystkie 6 tabel zostały utworzone

### "Row Level Security" error
- Sprawdź w **Database** → **Policies** czy są polityki RLS
- Wykonaj plik SQL ponownie

### "Nie widzę pytań"
- Sprawdź w **Table Editor** → **questions** ile masz wierszy
- Powinno być dokładnie 1,332

### "Skrypt node nie działa"
- Upewnij się że masz zainstalowany Node.js
- Sprawdź połączenie internetowe
- Sprawdź czy dane do Supabase są poprawne

---

## 📝 Podsumowanie

**Jeden plik SQL = Wszystko**

Nie musisz:
- ❌ Ręcznie tworzyć tabel
- ❌ Osobno importować pytań
- ❌ Konfigurować RLS przez dashboard
- ❌ Używać żadnych narzędzi w aplikacji

Wystarczy:
- ✅ Uruchomić skrypt: `node generate-complete-migration.js`
- ✅ Wkleić plik w Supabase SQL Editor
- ✅ Kliknąć RUN
- ✅ Gotowe! 🚀
