// Parser for JSON question format
import type { Database } from "@/integrations/supabase/types";

type QuestionCategory = Database['public']['Enums']['question_category'];

export interface ParsedQuestion {
  question: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  correct_answer: string;
  category: QuestionCategory;
  question_code?: string;
}

// Map PL codes to categories
const CATEGORY_MAP: Record<string, QuestionCategory> = {
  'PL010': 'air_law',
  'PL020': 'aircraft_general',
  'PL030': 'flight_performance',
  'PL040': 'human_performance',
  'PL050': 'meteorology',
  'PL060': 'navigation',
  'PL070': 'operational_procedures',
  'PL080': 'principles_of_flight',
  'PL090': 'communications',
  'PL100': 'operational_procedures',
};

function detectCategory(code: string): QuestionCategory {
  const upperCode = code.toUpperCase();
  for (const [prefix, category] of Object.entries(CATEGORY_MAP)) {
    if (upperCode.includes(prefix)) {
      return category;
    }
  }
  return 'operational_procedures';
}

interface JsonQuestion {
  numer: string;
  pytanie: string;
  odp1: string;
  odp2: string;
  odp3: string;
  odp4: string;
  correct: string;
}

export function parseJsonQuestions(jsonContent: string): ParsedQuestion[] {
  try {
    const data: JsonQuestion[] = JSON.parse(jsonContent);
    const questions: ParsedQuestion[] = [];
    
    for (const item of data) {
      // Skip if essential data is missing
      if (!item.numer || !item.odp1 || !item.odp2 || !item.odp3 || !item.odp4) {
        continue;
      }
      
      // Determine question text - if pytanie is empty, try to construct from answers
      let questionText = item.pytanie?.trim() || '';
      
      // If question is empty and answers look like fragments, try to piece together
      // (This is a best-effort attempt for malformed data)
      if (!questionText && item.odp1 && item.odp1.length < 100) {
        // Check if first answer looks like start of question (contains question words)
        const questionWords = ['Jaki', 'Jak', 'Co', 'Czy', 'Kiedy', 'Gdzie', 'Dlaczego', 'W jakim', 'Kto'];
        const startsWithQuestion = questionWords.some(word => 
          item.odp1.startsWith(word) || item.odp2?.startsWith(word)
        );
        
        if (startsWithQuestion) {
          // Try combining answers that look like question fragments
          const fragments = [item.odp1, item.odp2, item.odp3, item.odp4]
            .filter(f => f && f.length < 150); // Assume question parts are shorter
          questionText = fragments.join(' ').trim();
        }
      }
      
      // If still no valid question text, skip this entry
      if (!questionText || questionText.length < 10) {
        continue;
      }
      
      // Clean up answers
      const answers = [
        item.odp1?.trim() || '',
        item.odp2?.trim() || '',
        item.odp3?.trim() || '',
        item.odp4?.trim() || ''
      ];
      
      // Ensure all answers are non-empty and distinct
      if (answers.some(a => !a) || new Set(answers).size !== 4) {
        continue;
      }
      
      // Map correct answer
      const correctMap: Record<string, string> = {
        'odp1': 'A',
        'odp2': 'B',
        'odp3': 'C',
        'odp4': 'D'
      };
      const correctAnswer = correctMap[item.correct] || 'A';
      
      // Detect category
      const category = detectCategory(item.numer);
      
      questions.push({
        question: questionText,
        answer_a: answers[0],
        answer_b: answers[1],
        answer_c: answers[2],
        answer_d: answers[3],
        correct_answer: correctAnswer,
        category: category,
        question_code: item.numer
      });
    }
    
    // Remove duplicates by question code
    const uniqueMap = new Map<string, ParsedQuestion>();
    for (const q of questions) {
      if (q.question_code && !uniqueMap.has(q.question_code)) {
        uniqueMap.set(q.question_code, q);
      }
    }
    
    return Array.from(uniqueMap.values());
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return [];
  }
}
