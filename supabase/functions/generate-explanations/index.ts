import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all questions without explanations
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('*')
      .is('explanation', null);

    if (fetchError) throw fetchError;

    console.log(`Found ${questions?.length || 0} questions without explanations`);

    if (!questions || questions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'All questions already have explanations', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Jesteś ekspertem lotniczym pomagającym studentom w nauce do egzaminu PPLA (Private Pilot Licence - Aeroplane). 
Odpowiadasz po polsku, używając prostego i zrozumiałego języka. Twoje wyjaśnienia są konkretne i praktyczne.
WAŻNE: NIE używaj formatowania markdown - nie używaj gwiazdek (**), podkreśleń (_) ani innych znaczników formatowania. Pisz normalnym tekstem bez formatowania.`;

    let processed = 0;
    let failed = 0;

    // Process questions in batches to avoid rate limits
    for (const question of questions) {
      try {
        const correctAnswerKey = `answer_${question.correct_answer.toLowerCase()}`;
        const correctAnswerText = question[correctAnswerKey];

        const userPrompt = `Wyjaśnij dlaczego odpowiedź "${correctAnswerText}" jest prawidłowa dla pytania: "${question.question}"`;

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI API error for question ${question.id}:`, response.status, errorText);
          failed++;
          continue;
        }

        const data = await response.json();
        const explanation = data.choices[0].message.content;

        // Update question with explanation
        const { error: updateError } = await supabase
          .from('questions')
          .update({ explanation })
          .eq('id', question.id);

        if (updateError) {
          console.error(`Failed to update question ${question.id}:`, updateError);
          failed++;
        } else {
          processed++;
          console.log(`Processed question ${processed}/${questions.length}`);
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing question ${question.id}:`, error);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Explanations generated successfully', 
        processed, 
        failed,
        total: questions.length 
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
