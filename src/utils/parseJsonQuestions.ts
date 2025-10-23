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
  'PL020': 'aircraft_general_knowledge',
  'PL030': 'flight_performance_planning',
  'PL040': 'operational_procedures', // human_performance doesn't exist, using operational_procedures
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

// Old format
interface JsonQuestionOld {
  numer: string;
  pytanie: string;
  odp1: string;
  odp2: string;
  odp3: string;
  odp4: string;
  correct: string;
}

// New format
interface JsonQuestionNew {
  id: string;
  question: string;
  answers: string[];
  correct: string;
}

export function parseJsonQuestions(jsonContent: string): ParsedQuestion[] {
  try {
    const data = JSON.parse(jsonContent);
    
    // Detect format by checking first item
    if (!data.length) return [];
    const firstItem = data[0];
    const isNewFormat = 'answers' in firstItem && Array.isArray(firstItem.answers);
    
    if (isNewFormat) {
      return parseNewFormat(data as JsonQuestionNew[]);
    } else {
      return parseOldFormat(data as JsonQuestionOld[]);
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return [];
  }
}

function parseNewFormat(data: JsonQuestionNew[]): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  
  for (const item of data) {
    if (!item.id || !item.question || !item.answers || item.answers.length !== 4 || !item.correct) {
      continue;
    }
    
    const questionText = item.question.trim();
    const answers = item.answers.map(a => a.trim());
    
    if (!questionText || answers.some(a => !a)) continue;
    
    // Find which answer matches the correct answer text
    const correctIndex = answers.findIndex(a => a === item.correct.trim());
    const correctAnswer = correctIndex >= 0 ? String.fromCharCode(65 + correctIndex) : 'A'; // 65 = 'A'
    
    const category = detectCategory(item.id);
    
    questions.push({
      question: questionText,
      answer_a: answers[0],
      answer_b: answers[1],
      answer_c: answers[2],
      answer_d: answers[3],
      correct_answer: correctAnswer,
      category: category as QuestionCategory,
      question_code: item.id
    });
  }
  
  return removeDuplicates(questions);
}

function parseOldFormat(data: JsonQuestionOld[]): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  
  for (const item of data) {
    if (!item.numer || !item.odp1 || !item.odp2 || !item.odp3 || !item.odp4) {
      continue;
    }
    
    let questionText = item.pytanie?.trim() || '';
    
    if (!questionText && item.odp1 && item.odp1.length < 100) {
      const questionWords = ['Jaki', 'Jak', 'Co', 'Czy', 'Kiedy', 'Gdzie', 'Dlaczego', 'W jakim', 'Kto'];
      const startsWithQuestion = questionWords.some(word => 
        item.odp1.startsWith(word) || item.odp2?.startsWith(word)
      );
      
      if (startsWithQuestion) {
        const fragments = [item.odp1, item.odp2, item.odp3, item.odp4]
          .filter(f => f && f.length < 150);
        questionText = fragments.join(' ').trim();
      }
    }
    
    if (!questionText || questionText.length < 10) {
      continue;
    }
    
    const answers = [
      item.odp1?.trim() || '',
      item.odp2?.trim() || '',
      item.odp3?.trim() || '',
      item.odp4?.trim() || ''
    ];
    
    if (answers.some(a => !a) || new Set(answers).size !== 4) {
      continue;
    }
    
    const correctMap: Record<string, string> = {
      'odp1': 'A',
      'odp2': 'B',
      'odp3': 'C',
      'odp4': 'D'
    };
    const correctAnswer = correctMap[item.correct] || 'A';
    
    const category = detectCategory(item.numer);
    
    questions.push({
      question: questionText,
      answer_a: answers[0],
      answer_b: answers[1],
      answer_c: answers[2],
      answer_d: answers[3],
      correct_answer: correctAnswer,
      category: category as QuestionCategory,
      question_code: item.numer
    });
  }
  
  return removeDuplicates(questions);
}

function removeDuplicates(questions: ParsedQuestion[]): ParsedQuestion[] {
    
  const uniqueMap = new Map<string, ParsedQuestion>();
  for (const q of questions) {
    if (q.question_code && !uniqueMap.has(q.question_code)) {
      uniqueMap.set(q.question_code, q);
    }
  }
  
  return Array.from(uniqueMap.values());
}
