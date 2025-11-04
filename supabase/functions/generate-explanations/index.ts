import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

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
		const GOOGLE_GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
		const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
		const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

		if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GOOGLE_GEMINI_API_KEY) {
			throw new Error("Missing Supabase or Gemini configuration");
		}

		const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

		// Pobierz pytania bez wyjaśnień (do 20 na raz, by uniknąć timeoutu)
		const { data: questions, error: fetchError } = await supabase
			.from("questions")
			.select("*")
			.is("explanation", null)
			.limit(20);

		if (fetchError) throw fetchError;

		console.log(
			`Found ${questions?.length || 0} questions without explanations`
		);

		if (!questions || questions.length === 0) {
			const { count } = await supabase
				.from("questions")
				.select("*", { count: "exact", head: true })
				.is("explanation", null);

			return new Response(
				JSON.stringify({
					message: "All questions already have explanations",
					processed: 0,
					remaining: count || 0,
				}),
				{ headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		const systemPrompt = `Jesteś ekspertem lotniczym pomagającym studentom w nauce do egzaminu PPLA (Private Pilot Licence - Aeroplane). 
Odpowiadasz po polsku, używając prostego i zrozumiałego języka. Twoje wyjaśnienia są konkretne, praktyczne i edukacyjne.
Nigdy nie odmawiaj odpowiedzi — jeśli pytanie jest niejasne, wyjaśnij najlepiej jak potrafisz.
Nie używaj formatowania markdown ani znaków specjalnych.`;

		let processed = 0;
		let failed = 0;

		// Pomocnicza funkcja — bezpieczne wywołanie Gemini
		// Pomocnicza funkcja — bezpieczne wywołanie Gemini
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

				if (!response.ok) {
					const text = await response.text();
					console.error("Gemini API error:", response.status, text);
					return "Nie udało się uzyskać odpowiedzi od AI (błąd API).";
				}

				let data: any;
				try {
					data = await response.json();
				} catch {
					const text = await response.text();
					console.error("Invalid JSON from Gemini:", text);
					return "Nie udało się uzyskać odpowiedzi od AI (błąd JSON).";
				}

				const explanation =
					data?.candidates?.[0]?.content?.parts?.[0]?.text ||
					"Brak odpowiedzi od AI.";

				// Jeśli Gemini nic nie zwrócił – fallback
				if (explanation === "Brak odpowiedzi od AI.") {
					const fallbackPrompt = `Odpowiedz krótko i edukacyjnie, nawet jeśli pytanie jest niejasne. ${prompt}`;
					const fallback = await fetch(
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
						fallbackData = await fallback.json();
					} catch {
						const fallbackText = await fallback.text();
						console.error("Invalid fallback JSON:", fallbackText);
						return "Nie udało się uzyskać odpowiedzi od AI (fallback JSON).";
					}

					return (
						fallbackData?.candidates?.[0]?.content?.parts?.[0]?.text ||
						"Nie udało się uzyskać odpowiedzi od AI (fallback)."
					);
				}

				return explanation;
			} catch (err) {
				console.error("Gemini fetch error:", err);
				return "Wystąpił błąd podczas generowania odpowiedzi AI.";
			}
		}

		// Przetwarzaj każde pytanie
		for (const question of questions) {
			try {
				const correctAnswerKey = `answer_${question.correct_answer.toLowerCase()}`;
				const correctAnswerText = question[correctAnswerKey];
				const userPrompt = `Wyjaśnij dlaczego odpowiedź "${correctAnswerText}" jest prawidłowa dla pytania: "${question.question}"`;
				const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

				const explanation = await queryGemini(fullPrompt);

				const { error: updateError } = await supabase
					.from("questions")
					.update({ explanation })
					.eq("id", question.id);

				if (updateError) {
					console.error(
						`Failed to update question ${question.id}:`,
						updateError
					);
					failed++;
				} else {
					processed++;
					console.log(`Processed ${processed}/${questions.length}`);
				}

				await new Promise((r) => setTimeout(r, 250)); // mały delay dla bezpieczeństwa
			} catch (err) {
				console.error(`Error processing question ${question.id}:`, err);
				failed++;
			}
		}

		// Policz, ile jeszcze brakuje
		const { count: remainingCount } = await supabase
			.from("questions")
			.select("*", { count: "exact", head: true })
			.is("explanation", null);

		return new Response(
			JSON.stringify({
				message:
					processed > 0
						? "Batch completed successfully"
						: "No questions processed",
				processed,
				failed,
				batchSize: questions.length,
				remaining: remainingCount || 0,
			}),
			{ headers: { ...corsHeaders, "Content-Type": "application/json" } }
		);
	} catch (error) {
		console.error("Error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}
});
