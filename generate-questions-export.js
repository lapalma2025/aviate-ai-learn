// Skrypt do generowania kompletnego pliku SQL z pytaniami
// Pobiera pytania z obecnego Supabase i generuje plik IMPORT-PYTAN.sql

const fs = require('fs');

// Dane do połączenia z OBECNYM Supabase (źródło danych)
const SUPABASE_URL = 'https://exkmhzdwgiovivncdmtp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4a21oemR3Z2lvdml2bmNkbXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNTgzNzUsImV4cCI6MjA3NjYzNDM3NX0.By2dpO-vlwxXEbzJOKCXhh6rzsvkqnPDhR5-Xw6X84Q';

async function generateSQL() {
  console.log('🚀 Pobieranie pytań z bazy danych...');
  
  try {
    // Pobieranie pytań z bazy (z paginacją - Supabase domyślnie ma limit 1000)
    let allQuestions = [];
    let offset = 0;
    const limit = 1000;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/questions?select=*&order=created_at&limit=${limit}&offset=${offset}`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const questions = await response.json();
      allQuestions = allQuestions.concat(questions);
      
      console.log(`   📦 Pobrano ${questions.length} pytań (razem: ${allQuestions.length})...`);
      
      if (questions.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    const questions = allQuestions;
    console.log(`📊 Pobrano łącznie ${questions.length} pytań`);

    // Funkcja do escapowania stringów SQL
    function escapeSql(str) {
      if (!str) return '';
      return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
    }

    // Generowanie INSERT statements
    let sqlContent = `-- =====================================================
-- IMPORT PYTAŃ - ${questions.length} pytań
-- =====================================================
-- Ten plik został wygenerowany automatycznie
-- Data: ${new Date().toISOString()}
-- 
-- INSTRUKCJE:
-- 1. Najpierw wykonaj: KOMPLETNA-MIGRACJA-SUPABASE.sql
-- 2. Następnie wykonaj TEN plik w Supabase SQL Editor
-- 3. Kliknij RUN i poczekaj 1-2 minuty
-- =====================================================

`;

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
      sqlContent += `INSERT INTO public.questions (question, answer_a, answer_b, answer_c, answer_d, correct_answer, category, question_code, explanation, image_url)\n`;
      sqlContent += `VALUES (\n`;
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
        console.log(`✏️  Wygenerowano ${index + 1}/${questions.length} pytań...`);
      }
    });

    // Dodanie podsumowania na końcu
    sqlContent += `-- =====================================================
-- KONIEC IMPORTU PYTAŃ
-- =====================================================
-- ✅ Zaimportowano: ${questions.length} pytań
-- 
-- SPRAWDŹ:
-- 1. Przejdź do Table Editor → questions
-- 2. Powinieneś zobaczyć ${questions.length} wierszy
-- 3. Możesz już korzystać z aplikacji!
-- =====================================================\n`;

    // Zapisanie do pliku
    const outputFile = 'IMPORT-PYTAN.sql';
    fs.writeFileSync(outputFile, sqlContent, 'utf8');
    
    const fileSizeMB = (fs.statSync(outputFile).size / 1024 / 1024).toFixed(2);
    
    console.log(`\n✅ Plik ${outputFile} został wygenerowany!`);
    console.log(`📦 Rozmiar pliku: ${fileSizeMB} MB`);
    console.log(`\n📋 NASTĘPNE KROKI:`);
    console.log(`1. Otwórz Supabase SQL Editor`);
    console.log(`2. Skopiuj i wklej zawartość pliku ${outputFile}`);
    console.log(`3. Kliknij RUN`);
    console.log(`4. Poczekaj 1-2 minuty`);
    console.log(`5. Gotowe! Sprawdź w Table Editor czy masz ${questions.length} pytań\n`);

  } catch (error) {
    console.error('❌ Błąd:', error.message);
    console.error('\n💡 Upewnij się że:');
    console.error('   - Masz dostęp do internetu');
    console.error('   - URL Supabase jest poprawny');
    console.error('   - Klucz API jest aktywny\n');
  }
}

// Uruchom generator
generateSQL();
