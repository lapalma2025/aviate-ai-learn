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

export function parsePdfQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // Try to find table row with question (starts with number followed by | PL)
    const tableMatch = line.match(/^\|?\s*(\d+)\s*\|?\s*(PL\s*[\d\-]+)\s*\|?\s*(.+)/i);
    if (tableMatch) {
      const questionText = tableMatch[3].replace(/\|/g, ' ').trim();
      
      // Look for answer row (next line might contain answers separated by |)
      let answers: string[] = [];
      let j = i + 1;
      while (j < lines.length && answers.length < 4) {
        const nextLine = lines[j].replace(/^\|/, '').replace(/\|$/, '');
        const parts = nextLine.split('|').map(p => p.trim()).filter(p => p.length > 0 && !p.match(/^[\-\s]+$/));
        
        if (parts.length > 0 && !parts[0].match(/^\d+$/) && !parts[0].match(/^PL\s*[\d\-]+$/i)) {
          answers.push(...parts);
        }
        
        if (answers.length >= 4 || nextLine.match(/^\|?\s*\d+\s*\|?\s*PL/i)) break;
        j++;
      }
      
      if (questionText.length > 5 && answers.length >= 4) {
        questions.push({
          question: questionText,
          answer_a: answers[0] || '',
          answer_b: answers[1] || '',
          answer_c: answers[2] || '',
          answer_d: answers[3] || '',
          correct_answer: 'A',
          category: 'operational_procedures'
        });
      }
      
      i = j > i ? j : i + 1;
    }
    // Try to find standalone question (format: # 123 PL010-xxxx Question text)
    else if (line.match(/^#\s*\d+/)) {
      const questionParts: string[] = [];
      let k = i;
      
      // Collect question text until we find answers or next question
      while (k < lines.length) {
        const l = lines[k];
        if (k > i && l.match(/^#\s*\d+/)) break;
        if (!l.match(/^(#|PL\d+\-\d+|Page|\d+|---|###)/i)) {
          questionParts.push(l);
        }
        k++;
        if (k > i + 20) break;
      }
      
      const fullText = questionParts.join(' ').trim();
      
      // Try to extract answers from text
      const answerCandidates: string[] = [];
      const sentencesAndPhrases = fullText.split(/(?:[.;]|\band\b)/);
      
      for (const part of sentencesAndPhrases) {
        const cleaned = part.trim();
        if (cleaned.length > 5 && cleaned.length < 200) {
          answerCandidates.push(cleaned);
        }
      }
      
      // If we have enough text, create a question
      if (fullText.length > 20 && answerCandidates.length >= 4) {
        const questionText = answerCandidates[0];
        questions.push({
          question: questionText,
          answer_a: answerCandidates[1] || answerCandidates[0],
          answer_b: answerCandidates[2] || answerCandidates[1] || answerCandidates[0],
          answer_c: answerCandidates[3] || answerCandidates[2] || answerCandidates[0],
          answer_d: answerCandidates[4] || answerCandidates[3] || answerCandidates[0],
          correct_answer: 'A',
          category: 'operational_procedures'
        });
      }
      
      i = k;
    } else {
      i++;
    }
  }
  
  // Filter out duplicates and invalid questions
  const unique = new Map<string, ParsedQuestion>();
  for (const q of questions) {
    const key = q.question.substring(0, 50).toLowerCase();
    if (!unique.has(key) && q.answer_a !== q.answer_b && q.answer_a.length > 3) {
      unique.set(key, q);
    }
  }
  
  return Array.from(unique.values());
}
