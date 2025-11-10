import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
};

// 🔹 Bezpieczny odczyt treści z odpowiedzi Gemini
function safeExtractText(data: any) {
	try {
		const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
		if (typeof text === "string" && text.trim().length > 0) {
			return text.trim();
		}
		return "";
	} catch {
		return "";
	}
}

// 🔹 Domyślny komunikat błędu
function errorMessage(reason?: string) {
	return (
		reason ||
		"Nie udało się wygenerować odpowiedzi AI. Jeśli pytanie jest poprawne i dotyczy tematu lotnictwa, skontaktuj się z nami."
	);
}

// 🔹 Funkcja z retry i timeoutem — zabezpiecza połączenie z API Gemini
async function callGeminiWithRetry(url: string, body: any, retries = 2) {
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 10000); // ⏱️ timeout 10s

			const res = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
				signal: controller.signal,
			});

			clearTimeout(timeout);

			if (!res.ok) {
				const text = await res.text();
				console.error(
					`❌ Gemini error (try ${attempt + 1}):`,
					res.status,
					text
				);
				if (attempt < retries) {
					await new Promise((r) => setTimeout(r, 1000 * (attempt + 1))); // exponential backoff
					continue;
				}
				return null;
			}

			return await res.json();
		} catch (err) {
			console.error(`⚠️ Gemini connection error (try ${attempt + 1}):`, err);
			if (attempt < retries) {
				await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
				continue;
			}
			return null;
		}
	}
	return null;
}

// 🔹 Główna funkcja serwera
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
Odpowiadasz po polsku, używając prostego i zrozumiałego języka. Twoje wyjaśnienia są konkretne i praktyczne.
Nie używaj formatowania markdown ani znaków specjalnych.
Nie odmawiaj odpowiedzi — jeśli pytanie jest niejasne, wyjaśnij najlepiej jak potrafisz.`;

		const userPrompt = userQuestion
			? `Pytanie egzaminacyjne: "${question}"\nPrawidłowa odpowiedź: "${answer}"\n\nPytanie studenta: ${userQuestion}`
			: `Wyjaśnij dlaczego odpowiedź "${answer}" jest prawidłowa dla pytania: "${question}"`;

		const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

		// 🔹 Wywołanie API Gemini z retry
		const data = await callGeminiWithRetry(
			`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GOOGLE_GEMINI_API_KEY}`,
			{
				contents: [{ parts: [{ text: fullPrompt }] }],
				generationConfig: {
					temperature: 0.7,
					maxOutputTokens: 2048,
				},
			}
		);

		// 🔹 Sprawdź, czy udało się uzyskać odpowiedź
		if (!data) {
			return new Response(
				JSON.stringify({
					explanation: errorMessage("Problem z połączeniem do serwera AI."),
				}),
				{ headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		if (data?.error) {
			console.error("⚠️ Gemini API error:", data.error);
			return new Response(
				JSON.stringify({
					explanation: errorMessage(
						"Problem z serwerem AI. Spróbuj ponownie później."
					),
				}),
				{ headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		if (data?.promptFeedback?.blockReason) {
			console.warn("🚫 Gemini blocked prompt:", data.promptFeedback);
			return new Response(
				JSON.stringify({
					explanation: errorMessage(
						"AI zablokowało odpowiedź, ponieważ treść mogła naruszać zasady bezpieczeństwa lub nie dotyczyła tematu lotnictwa."
					),
				}),
				{ headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		const explanation = safeExtractText(data);
		if (!explanation) {
			console.warn("⚠️ AI zwróciło pustą odpowiedź, fallback...");
			return new Response(
				JSON.stringify({
					explanation: errorMessage(
						"AI nie wygenerowało odpowiedzi. Jeśli pytanie jest poprawne, skontaktuj się z nami."
					),
				}),
				{ headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		console.log(
			`✅ Odpowiedź wygenerowana poprawnie (${explanation.length} znaków)`
		);

		return new Response(JSON.stringify({ explanation }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("💥 Error:", error);
		const message = error instanceof Error ? error.message : String(error);
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}
});
