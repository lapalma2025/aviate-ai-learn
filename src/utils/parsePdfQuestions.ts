// Helper to parse questions from PDF text
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
}

// Category keyword mappings - using 'as any' because types file hasn't regenerated yet
const CATEGORY_KEYWORDS: Record<string, any> = {
  'PL010': 'air_law',
  'PL020': 'aircraft_general_knowledge',
  'PL030': 'flight_performance_planning',
  'PL040': 'meteorology',
  'PL050': 'navigation',
  'PL060': 'operational_procedures',
  'PL070': 'principles_of_flight',
  'PL080': 'communications',
};

function detectCategory(code: string): QuestionCategory {
  const upperCode = code.toUpperCase();
  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (upperCode.includes(keyword)) {
      return category as any;
    }
  }
  return 'operational_procedures' as any;
}

export function parsePdfQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // Pattern 1: Table format with question number | Code | Question
    // Example: | 1 | PL010-0001 | What is the question? |
    const tableMatch = line.match(/^\|?\s*(\d+)\s*\|?\s*(PL\s*\d+[\-\d]*)\s*\|?\s*(.+)/i);
    if (tableMatch) {
      const questionNum = tableMatch[1];
      const code = tableMatch[2];
      let questionText = tableMatch[3].replace(/\|+$/, '').trim();
      
      // Continue reading if question spans multiple lines
      let j = i + 1;
      while (j < lines.length && !lines[j].match(/^\|?\s*\d+\s*\|?\s*PL/i) && !lines[j].match(/^[A-D]\)/i)) {
        const nextLine = lines[j].replace(/^\|/, '').replace(/\|$/, '').trim();
        if (nextLine && !nextLine.match(/^[\-\s\|]+$/)) {
          questionText += ' ' + nextLine;
        }
        j++;
        if (j - i > 5) break; // Don't read too far
      }
      
      // Look for answers in format: A) answer, B) answer, C) answer, D) answer
      const answers: { [key: string]: string } = {};
      let correctAnswer = 'A';
      
      while (j < lines.length && Object.keys(answers).length < 4) {
        const answerLine = lines[j];
        
        // Stop if we hit the next question
        if (answerLine.match(/^\|?\s*\d+\s*\|?\s*PL/i)) break;
        
        // Match answer format: A) text or A. text or just A text
        const answerMatch = answerLine.match(/^([A-D])[)\.]?\s*(.+)/i);
        if (answerMatch) {
          const letter = answerMatch[1].toUpperCase();
          let answerText = answerMatch[2].trim();
          
          // Check if answer has a correct indicator
          if (answerText.includes('*') || answerText.includes('✓') || answerText.includes('(correct)')) {
            correctAnswer = letter;
            answerText = answerText.replace(/[\*✓]/g, '').replace(/\(correct\)/i, '').trim();
          }
          
          answers[letter] = answerText;
        }
        
        j++;
        if (j - i > 20) break; // Safety limit
      }
      
      // Create question if we have all answers
      if (questionText.length > 10 && Object.keys(answers).length >= 4) {
        questions.push({
          question: questionText,
          answer_a: answers['A'] || '',
          answer_b: answers['B'] || '',
          answer_c: answers['C'] || '',
          answer_d: answers['D'] || '',
          correct_answer: correctAnswer,
          category: detectCategory(code) as any
        });
      }
      
      i = j;
      continue;
    }
    
    // Pattern 2: Standalone question format
    // Example: 123. Question text?
    const standaloneMatch = line.match(/^(\d+)[\.\)]\s+(.+)/);
    if (standaloneMatch) {
      const questionNum = standaloneMatch[1];
      let questionText = standaloneMatch[2].trim();
      
      // Check for category code in the question
      let category: any = 'operational_procedures';
      const codeMatch = questionText.match(/PL\s*\d+[\-\d]*/i);
      if (codeMatch) {
        category = detectCategory(codeMatch[0]);
      }
      
      // Continue reading question text
      let j = i + 1;
      while (j < lines.length && !lines[j].match(/^[A-D][)\.]/) && !lines[j].match(/^\d+[\.\)]/)) {
        const nextLine = lines[j].trim();
        if (nextLine && nextLine.length > 0) {
          questionText += ' ' + nextLine;
        }
        j++;
        if (j - i > 5) break;
      }
      
      // Look for answers
      const answers: { [key: string]: string } = {};
      let correctAnswer = 'A';
      
      while (j < lines.length && Object.keys(answers).length < 4) {
        const answerLine = lines[j];
        
        // Stop if we hit the next question
        if (answerLine.match(/^\d+[\.\)]\s+/)) break;
        
        const answerMatch = answerLine.match(/^([A-D])[)\.]?\s*(.+)/i);
        if (answerMatch) {
          const letter = answerMatch[1].toUpperCase();
          let answerText = answerMatch[2].trim();
          
          // Check for correct answer indicators
          if (answerText.includes('*') || answerText.includes('✓') || answerText.includes('(correct)')) {
            correctAnswer = letter;
            answerText = answerText.replace(/[\*✓]/g, '').replace(/\(correct\)/i, '').trim();
          }
          
          answers[letter] = answerText;
        }
        
        j++;
        if (j - i > 20) break;
      }
      
      // Create question if valid
      if (questionText.length > 10 && Object.keys(answers).length >= 4) {
        questions.push({
          question: questionText,
          answer_a: answers['A'] || '',
          answer_b: answers['B'] || '',
          answer_c: answers['C'] || '',
          answer_d: answers['D'] || '',
          correct_answer: correctAnswer,
          category: category
        });
      }
      
      i = j;
      continue;
    }
    
    i++;
  }
  
  // Filter out duplicates and invalid questions
  const unique = new Map<string, ParsedQuestion>();
  for (const q of questions) {
    const key = q.question.substring(0, 50).toLowerCase();
    if (!unique.has(key) && 
        q.answer_a !== q.answer_b && 
        q.answer_a.length > 2 &&
        q.question.length > 10) {
      unique.set(key, q);
    }
  }
  
  return Array.from(unique.values());
}
