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
    const GOOGLE_GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');

    const systemPrompt = `Jesteś ekspertem lotniczym pomagającym studentom w nauce do egzaminu PPLA (Private Pilot Licence - Aeroplane). 
Odpowiadasz po polsku, używając prostego i zrozumiałego języka. Twoje wyjaśnienia są konkretne i praktyczne.
WAŻNE: NIE używaj formatowania markdown - nie używaj gwiazdek (**), podkreśleń (_) ani innych znaczników formatowania. Pisz normalnym tekstem bez formatowania.`;

    const userPrompt = userQuestion 
      ? `Pytanie egzaminacyjne: "${question}"\nPrawidłowa odpowiedź: "${answer}"\n\nPytanie studenta: ${userQuestion}`
      : `Wyjaśnij dlaczego odpowiedź "${answer}" jest prawidłowa dla pytania: "${question}"`;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      }),
    });

    const data = await response.json();
    const explanation = data.candidates[0].content.parts[0].text;

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
