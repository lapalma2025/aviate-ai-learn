# 📝 Jak zaimportować wszystkie pytania

Masz **2 opcje** importu pytań do Twojego Supabase:

---

## ✅ OPCJA 1: Automatyczny import przez aplikację (ZALECANE)

To najprostszy sposób - aplikacja sama pobierze i zaimportuje wszystkie pytania.

### Kroki:

1. **Wykonaj skrypt struktury**
   - Otwórz: `KOMPLETNA-MIGRACJA-SUPABASE.sql`
   - Skopiuj całą zawartość
   - Wklej w Supabase SQL Editor
   - Kliknij **RUN**

2. **Odśwież aplikację**
   - Naciśnij **F5** w przeglądarce

3. **Uruchom migrację**
   - Wejdź na: `http://localhost:5173/data-migration`
   - Kliknij: **"Rozpocznij Migrację"**
   - Poczekaj 1-2 minuty

4. **Gotowe!**
   - Sprawdź w sekcji "Nauka" czy pytania się ładują

---

## ✅ OPCJA 2: Ręczny import przez plik SQL

Jeśli automatyczna migracja nie działa, możesz wygenerować plik SQL i wykonać go ręcznie.

### Kroki:

1. **Wygeneruj plik SQL z pytaniami**
   ```bash
   node generate-questions-export.js
   ```
   - Zostanie utworzony plik: `IMPORT-PYTAN.sql` (~5-10 MB)
   - Zawiera on INSERT statements dla wszystkich 1,332 pytań

2. **Wykonaj skrypt struktury** (jeśli jeszcze nie wykonałeś)
   - Otwórz: `KOMPLETNA-MIGRACJA-SUPABASE.sql`
   - Wykonaj w Supabase SQL Editor

3. **Wykonaj skrypt z pytaniami**
   - Otwórz: `IMPORT-PYTAN.sql` (wygenerowany w kroku 1)
   - Skopiuj całą zawartość (UWAGA: plik jest duży!)
   - Wklej w Supabase SQL Editor
   - Kliknij **RUN**
   - Poczekaj 1-2 minuty

4. **Sprawdź rezultat**
   - **Table Editor** → **questions**
   - Powinieneś zobaczyć **1,332 wierszy**

---

## 🆘 Problemy?

### "Nie mogę uruchomić node generate-questions-export.js"
- Upewnij się że masz zainstalowany Node.js
- Zainstaluj zależności: `npm install` (jeśli potrzebne)
- Użyj **OPCJI 1** (automatyczny import przez aplikację)

### "Plik IMPORT-PYTAN.sql jest za duży dla SQL Editor"
- Użyj **OPCJI 1** (automatyczny import przez aplikację)
- Lub podziel plik na mniejsze części (co 300 pytań)

### "Automatyczna migracja nie działa"
- Sprawdź plik `.env` - czy ma poprawny URL i klucz do NOWEGO Supabase
- Sprawdź konsolę przeglądarki (F12) - czy są błędy
- Użyj **OPCJI 2** (ręczny import przez SQL)

---

## ℹ️ Która opcja jest lepsza?

- **OPCJA 1** - lepsza dla większości użytkowników, prostsza, bez konieczności generowania dużych plików
- **OPCJA 2** - lepsza jeśli masz problemy z połączeniem lub chcesz mieć backup pytań w pliku SQL
