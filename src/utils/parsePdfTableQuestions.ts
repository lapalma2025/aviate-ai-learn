// Enhanced parser for table-based and numbered question formats
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
const CATEGORY_MAP: Record<string, any> = {
  'PL010': 'air_law',
  'PL020': 'aircraft_general_knowledge',
  'PL030': 'flight_performance_planning',
  'PL040': 'meteorology',
  'PL050': 'navigation',
  'PL060': 'operational_procedures',
  'PL070': 'principles_of_flight',
  'PL080': 'communications',
  'PL100': 'operational_procedures', // fallback
};

function detectCategory(code: string): any {
  const upperCode = code.toUpperCase();
  for (const [prefix, category] of Object.entries(CATEGORY_MAP)) {
    if (upperCode.includes(prefix)) {
      return category;
    }
  }
  return 'operational_procedures';
}

export function parsePdfTableQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const lines = text.split('\n');
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Pattern 1: Numbered question with code (# 10 PL010-0003)
    const numberedMatch = line.match(/^#?\s*(\d+)\s+(PL\s*\d+[\-\d]+)/i);
    if (numberedMatch) {
      const questionNum = numberedMatch[1];
      const code = numberedMatch[2].replace(/\s+/g, '');
      const category = detectCategory(code);
      
      // Collect question text (next non-empty lines until we hit answers or next question)
      let questionText = '';
      let j = i + 1;
      const answerLines: string[] = [];
      
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        
        // Stop if we hit the next question
        if (nextLine.match(/^#?\s*\d+\s+PL\s*\d+[\-\d]+/i)) break;
        
        // Check if this is an answer line (contains multiple options separated by |)
        if (nextLine.includes('|') && !nextLine.match(/^[\-\s\|]+$/)) {
          answerLines.push(nextLine);
        } else if (nextLine && !nextLine.match(/^[\-\s\|]+$/) && !nextLine.match(/^###/) && !nextLine.match(/^Page \d+/)) {
          if (!questionText) {
            questionText = nextLine;
          } else if (answerLines.length === 0) {
            questionText += ' ' + nextLine;
          } else {
            answerLines.push(nextLine);
          }
        }
        
        j++;
        if (j - i > 30) break; // Safety limit
      }
      
      // Parse answers from collected lines
      const answers: string[] = [];
      for (const ansLine of answerLines) {
        const parts = ansLine.split('|').map(p => p.trim()).filter(p => p && !p.match(/^[\-\s]+$/));
        answers.push(...parts);
      }
      
      // Create question if we have enough data
      if (questionText.length > 10 && answers.length >= 4) {
        questions.push({
          question: questionText,
          answer_a: answers[0] || '',
          answer_b: answers[1] || '',
          answer_c: answers[2] || '',
          answer_d: answers[3] || '',
          correct_answer: 'A', // Default - needs manual correction
          category: category,
          question_code: code
        });
      }
      
      i = j;
      continue;
    }
    
    // Pattern 2: Table row format (| 1 | PL100-0126 | Question | Answer1 | Answer2 | Answer3 | Answer4 |)
    const tableMatch = line.match(/^\|?\s*(\d+)\s*\|?\s*(PL\s*\d+[\-\d]+)\s*\|?\s*(.+)/i);
    if (tableMatch) {
      const questionNum = tableMatch[1];
      const code = tableMatch[2].replace(/\s+/g, '');
      const restOfLine = tableMatch[3];
      const category = detectCategory(code);
      
      // Split remaining line by |
      const parts = restOfLine.split('|').map(p => p.trim()).filter(p => p);
      
      // First part might be question, rest might be answers
      let questionText = parts[0] || '';
      let answers: string[] = [];
      
      // Check next lines for continuation or answers
      let j = i + 1;
      while (j < lines.length && answers.length < 4) {
        const nextLine = lines[j].trim();
        
        // Stop at next question
        if (nextLine.match(/^\|?\s*\d+\s*\|?\s*PL\s*\d+[\-\d]+/i)) break;
        
        if (nextLine.includes('|') && !nextLine.match(/^[\-\s\|]+$/)) {
          const lineParts = nextLine.split('|').map(p => p.trim()).filter(p => p && !p.match(/^[\-\s]+$/));
          
          // If this looks like it continues the question (no clear 4 answers yet)
          if (answers.length === 0 && lineParts.length < 4 && !nextLine.match(/^\|/)) {
            questionText += ' ' + lineParts.join(' ');
          } else {
            answers.push(...lineParts);
          }
        } else if (nextLine && !nextLine.match(/^[\-\s\|]+$/) && !nextLine.match(/^###/) && !nextLine.match(/^Page/)) {
          if (answers.length === 0) {
            questionText += ' ' + nextLine;
          } else if (answers.length < 4) {
            answers.push(nextLine);
          }
        }
        
        j++;
        if (j - i > 20) break;
      }
      
      // Add remaining parts from first line as answers if we don't have enough
      if (answers.length < 4) {
        answers.push(...parts.slice(1));
      }
      
      // Create question if valid
      if (questionText.length > 10 && answers.length >= 4) {
        questions.push({
          question: questionText,
          answer_a: answers[0] || '',
          answer_b: answers[1] || '',
          answer_c: answers[2] || '',
          answer_d: answers[3] || '',
          correct_answer: 'A',
          category: category,
          question_code: code
        });
      }
      
      i = j;
      continue;
    }
    
    i++;
  }
  
  // Remove duplicates based on question code
  const uniqueMap = new Map<string, ParsedQuestion>();
  for (const q of questions) {
    if (q.question_code && !uniqueMap.has(q.question_code)) {
      // Clean up the question and answers
      q.question = q.question.replace(/\s+/g, ' ').trim();
      q.answer_a = q.answer_a.replace(/\s+/g, ' ').trim();
      q.answer_b = q.answer_b.replace(/\s+/g, ' ').trim();
      q.answer_c = q.answer_c.replace(/\s+/g, ' ').trim();
      q.answer_d = q.answer_d.replace(/\s+/g, ' ').trim();
      
      // Only add if all answers are distinct and non-empty
      if (q.answer_a && q.answer_b && q.answer_c && q.answer_d &&
          q.answer_a !== q.answer_b && q.answer_a !== q.answer_c && 
          q.answer_a !== q.answer_d && q.question.length > 15) {
        uniqueMap.set(q.question_code, q);
      }
    }
  }
  
  return Array.from(uniqueMap.values());
}
