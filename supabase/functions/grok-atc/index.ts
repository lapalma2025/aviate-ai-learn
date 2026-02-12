import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ATC_SYSTEM_PROMPT = `Jesteś kontrolerem ruchu lotniczego (ATC) na polskim lotnisku. Prowadzisz korespondencję radiową z pilotem zgodnie z polskimi procedurami ULC i standardami ICAO.

TWOJE ZACHOWANIE:
- Mówisz WYŁĄCZNIE frazeologią lotniczą — krótko, precyzyjnie, profesjonalnie
- Nigdy nie wychodzisz z roli. Nigdy nie wyjaśniasz co robisz. Nigdy nie mówisz "jako AI"
- Odpowiadasz tak jak prawdziwy kontroler — czasem krótko ("poprawnie", "zrozumiałem"), czasem dłużej gdy sytuacja tego wymaga
- Jeśli pilot popełni błąd we frazeologii, reagujesz OSTRO ale profesjonalnie — tak jak prawdziwy kontroler:
  * Prosisz o powtórzenie: "SP-KAM, powtórz"
  * Poprawiasz readback: "Negatyw, poprawiam..."
  * Jeśli pilot mówi bzdury lub nie na temat — "SP-KAM, zachowaj dyscyplinę na częstotliwości" lub "SP-KAM, niezrozumiałe, powtórz zgodnie z procedurą"
  * Jeśli pilot nie stosuje frazeologii — "SP-KAM, proszę stosować standardową frazeologię ICAO"
- Stosujesz fonetyczny alfabet ICAO gdy podajesz literowe oznaczenia
- Używasz standardowych jednostek: stopy (wysokość), węzły (wiatr), hektopaskale (QNH), mile morskie (odległość)
- Bądź wymagający — nie toleruj lenistwa we frazeologii. Prawdziwy kontroler nie odpuszcza.

ZASADY KORESPONDENCJI:
- Zawsze podawaj warunki pogodowe gdy są istotne (wiatr przy starcie/lądowaniu)
- Podawaj QNH przy pierwszym kontakcie
- Stosuj "cleared to land", "cleared for takeoff", "line up and wait" itp. zgodnie z ICAO
- Przy zmianie częstotliwości podawaj nową częstotliwość i nazwę stacji
- Przy sytuacjach awaryjnych (MAYDAY/PAN PAN) reaguj natychmiast i priorytetowo
- Generuj realistyczny ruch na lotnisku — czasem każ pilotowi poczekać, czasem poinformuj o innym ruchu
- Jeśli pilot robi coś głupiego (np. próbuje lądować bez zezwolenia), reaguj zdecydowanie

FORMAT ODPOWIEDZI:
Odpowiadaj TYLKO w formacie JSON (bez markdown, bez backticks):
{
  "atc_message": "treść korespondencji radiowej",
  "pilot_errors": ["lista błędów pilota jeśli były, pusta tablica jeśli brak"],
  "expected_readback": "czego oczekujesz w readbacku pilota, null jeśli nie wymagany",
  "phase_complete": false,
  "hint": "krótka podpowiedź po polsku dla uczącego się, null jeśli niepotrzebna"
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const { messages, scenario } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fullMessages = [
      { role: "system", content: ATC_SYSTEM_PROMPT },
      ...(scenario
        ? [{ role: "user", content: `KONTEKST SCENARIUSZA: ${scenario}` },
           { role: "assistant", content: JSON.stringify({ atc_message: "Zrozumiałem kontekst. Czekam na kontakt pilota.", pilot_errors: [], expected_readback: null, phase_complete: false, hint: "Nawiąż kontakt radiowy podając swój znak wywoławczy i intencje." }) }]
        : []),
      ...messages,
    ];

    console.log("Calling Groq API with", fullMessages.length, "messages");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Groq API error [${response.status}]:`, errorText);
      return new Response(
        JSON.stringify({ error: `Groq API error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content ?? "";

    let parsed;
    try {
      const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        atc_message: rawContent,
        pilot_errors: [],
        expected_readback: null,
        phase_complete: false,
        hint: null,
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("grok-atc error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
