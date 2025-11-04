import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
	if (req.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders });
	}

	try {
		const { question, answer, userQuestion } = await req.json();
		const GOOGLE_GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");

		if (!GOOGLE_GEMINI_API_KEY) {
			throw new Error("Brak klucza GOOGLE_GEMINI_API_KEY w konfiguracji.");
		}

		const systemPrompt = `Jesteś ekspertem lotniczym pomagającym studentom w nauce do egzaminu PPLA (Private Pilot Licence - Aeroplane).
Odpowiadasz po polsku, w prosty i zrozumiały sposób, jak nauczyciel.
Twoje wyjaśnienia są konkretne i edukacyjne. 
Nie używaj formatowania markdown ani znaków specjalnych.
Nie odmawiaj odpowiedzi — jeśli pytanie jest niejasne, wyjaśnij najlepiej jak potrafisz.`;

		const userPrompt = userQuestion
			? `Pytanie egzaminacyjne: "${question}"\nPrawidłowa odpowiedź: "${answer}"\n\nPytanie studenta: ${userQuestion}`
			: `Wyjaśnij dlaczego odpowiedź "${answer}" jest prawidłowa dla pytania: "${question}"`;

		const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

		async function queryGemini(prompt: string): Promise<string> {
			try {
				const response = await fetch(
					`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_GEMINI_API_KEY}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							contents: [{ parts: [{ text: prompt }] }],
							generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
						}),
					}
				);

				let data: any;
				try {
					data = await response.json();
				} catch {
					const txt = await response.text();
					console.error("Niepoprawny JSON z Gemini:", txt);
					return errorMessage();
				}

				// ✅ Sprawdź, czy Gemini nie zablokował prompta
				if (data?.promptFeedback?.blockReason) {
					console.warn("Gemini blocked the prompt:", data.promptFeedback);
					return errorMessage(
						"Filtry bezpieczeństwa AI zablokowały odpowiedź."
					);
				}

				// ✅ Bezpieczne pobranie treści
				const explanation =
					data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

				if (explanation.length > 0) {
					return explanation;
				}

				// 🔁 Fallback – druga próba, łagodniejszy prompt
				const fallbackPrompt = `Odpowiedz krótko i edukacyjnie, nawet jeśli pytanie jest niejasne lub niezrozumiałe. ${prompt}`;
				const fallbackResponse = await fetch(
					`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_GEMINI_API_KEY}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							contents: [{ parts: [{ text: fallbackPrompt }] }],
							generationConfig: { temperature: 0.5, maxOutputTokens: 512 },
						}),
					}
				);

				let fallbackData: any;
				try {
					fallbackData = await fallbackResponse.json();
				} catch {
					const fallbackText = await fallbackResponse.text();
					console.error("Niepoprawny fallback JSON:", fallbackText);
					return errorMessage(
						"Nie udało się uzyskać odpowiedzi od AI (fallback)."
					);
				}

				const fallbackExplanation =
					fallbackData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
					"";

				return fallbackExplanation.length > 0
					? fallbackExplanation
					: errorMessage();
			} catch (err) {
				console.error("Błąd połączenia z Gemini:", err);
				return errorMessage("Problem z serwerem lub połączeniem z AI.");
			}
		}

		// 🧩 Wiadomość zwrotna dla użytkownika
		function errorMessage(reason?: string): string {
			return (
				reason ||
				"Nie udało się wygenerować odpowiedzi AI. Jeśli uważasz, że pytanie jest poprawne i dotyczy tematu lotnictwa, skontaktuj się z nami."
			);
		}

		const explanation = await queryGemini(fullPrompt);

		return new Response(JSON.stringify({ explanation }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error:", error);
		const msg = error instanceof Error ? error.message : String(error);
		return new Response(JSON.stringify({ error: msg }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}
});
