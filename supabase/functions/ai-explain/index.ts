import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, answer, userQuestion } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const systemPrompt = `Jesteś ekspertem lotniczym pomagającym studentom w nauce do egzaminu PPLA (Private Pilot Licence - Aeroplane). 
Odpowiadasz po polsku, używając prostego i zrozumiałego języka. Twoje wyjaśnienia są konkretne i praktyczne.`;

    const userPrompt = userQuestion 
      ? `Pytanie egzaminacyjne: "${question}"\nPrawidłowa odpowiedź: "${answer}"\n\nPytanie studenta: ${userQuestion}`
      : `Wyjaśnij dlaczego odpowiedź "${answer}" jest prawidłowa dla pytania: "${question}"`;

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

    const data = await response.json();
    const explanation = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ explanation }),
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
