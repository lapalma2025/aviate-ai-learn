import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Convert buffer to text and parse questions
    const text = new TextDecoder('utf-8').decode(buffer);
    
    // Parse pattern: Question number, text, A. B. C. D. answers
    const questionPattern = /(\d+)\.\s*([^A-D]+?)(?=A\.)/gs;
    const questions = [];
    
    let match;
    const textLines = text.split('\n');
    let currentQuestion = null;
    let questionNumber = 0;
    
    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i].trim();
      
      // Detect question number (e.g., "1.", "2.", etc.)
      const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
      if (questionMatch && !line.startsWith('A.') && !line.startsWith('B.') && !line.startsWith('C.') && !line.startsWith('D.')) {
        if (currentQuestion && currentQuestion.answer_a && currentQuestion.answer_b && currentQuestion.answer_c && currentQuestion.answer_d) {
          questions.push(currentQuestion);
        }
        
        questionNumber = parseInt(questionMatch[1]);
        currentQuestion = {
          question: questionMatch[2].trim(),
          answer_a: '',
          answer_b: '',
          answer_c: '',
          answer_d: '',
          correct_answer: 'A',
          category: 'operational_procedures'
        };
      }
      // Detect answers
      else if (currentQuestion) {
        if (line.startsWith('A.')) {
          currentQuestion.answer_a = line.substring(2).trim();
        } else if (line.startsWith('B.')) {
          currentQuestion.answer_b = line.substring(2).trim();
        } else if (line.startsWith('C.')) {
          currentQuestion.answer_c = line.substring(2).trim();
        } else if (line.startsWith('D.')) {
          currentQuestion.answer_d = line.substring(2).trim();
        } else if (currentQuestion.answer_a && !currentQuestion.answer_b) {
          currentQuestion.answer_a += ' ' + line;
        } else if (currentQuestion.answer_b && !currentQuestion.answer_c) {
          currentQuestion.answer_b += ' ' + line;
        } else if (currentQuestion.answer_c && !currentQuestion.answer_d) {
          currentQuestion.answer_c += ' ' + line;
        } else if (currentQuestion.answer_d) {
          currentQuestion.answer_d += ' ' + line;
        } else if (!currentQuestion.answer_a) {
          currentQuestion.question += ' ' + line;
        }
      }
    }
    
    // Add last question
    if (currentQuestion && currentQuestion.answer_a && currentQuestion.answer_b && currentQuestion.answer_c && currentQuestion.answer_d) {
      questions.push(currentQuestion);
    }

    console.log(`Parsed ${questions.length} questions`);

    // Insert into database
    const { data, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: questions.length,
        questions: data 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
