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

		const { data: questions, error: fetchError } = await supabase
			.from("questions")
			.select("*")
			.is("explanation", null)
			.limit(20);

		if (fetchError) throw fetchError;

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
Odpowiadasz po polsku, używając prostego i zrozumiałego języka. 
Nie używaj formatowania markdown ani znaków specjalnych.
Nie odmawiaj odpowiedzi — jeśli pytanie jest niejasne, wyjaśnij najlepiej jak potrafisz.`;

		let processed = 0;
		let failed = 0;

		// ✅ Helper do bezpiecznego odczytu tekstu z Gemini
		function safeExtractText(obj: any): string {
			if (
				!obj ||
				!obj.candidates ||
				!Array.isArray(obj.candidates) ||
				obj.candidates.length === 0
			) {
				return "";
			}
			const firstCandidate = obj.candidates[0];
			if (!firstCandidate?.content?.parts?.length) return "";
			const text = firstCandidate.content.parts[0]?.text;
			return typeof text === "string" ? text.trim() : "";
		}

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

				const raw = await response.text();
				let data: any = {};
				try {
					data = JSON.parse(raw);
				} catch {
					console.error("⚠️ Invalid JSON from Gemini:", raw);
					return "Nie udało się uzyskać odpowiedzi od AI (błąd JSON).";
				}

				if (data?.error) {
					console.error("❌ Gemini API error:", data.error);
					return "Problem z serwerem AI. Spróbuj ponownie później.";
				}

				if (data?.promptFeedback?.blockReason) {
					console.warn("🚫 Prompt blocked:", data.promptFeedback.blockReason);
					return "AI zablokowało odpowiedź, ponieważ treść mogła naruszać zasady bezpieczeństwa lub nie dotyczyła tematu lotnictwa. Jeśli uważasz, że pytanie jest poprawne, skontaktuj się z nami.";
				}

				const explanation = safeExtractText(data);
				if (explanation) return explanation;

				// Fallback
				const fallbackPrompt = `Odpowiedz krótko i edukacyjnie, nawet jeśli pytanie jest niejasne. ${prompt}`;
				const fallbackResp = await fetch(
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

				const fallbackRaw = await fallbackResp.text();
				let fallbackData: any = {};
				try {
					fallbackData = JSON.parse(fallbackRaw);
				} catch {
					console.error("⚠️ Invalid fallback JSON:", fallbackRaw);
					return "Nie udało się uzyskać odpowiedzi od AI (fallback).";
				}

				const fallbackExplanation = safeExtractText(fallbackData);
				return (
					fallbackExplanation ||
					"AI nie wygenerowało odpowiedzi. Spróbuj ponownie."
				);
			} catch (err) {
				console.error("🔥 Gemini fetch error:", err);
				return "Wystąpił błąd podczas generowania odpowiedzi AI.";
			}
		}

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
						`❌ Failed to update question ${question.id}:`,
						updateError
					);
					failed++;
				} else {
					processed++;
					console.log(`✅ Processed ${processed}/${questions.length}`);
				}

				await new Promise((r) => setTimeout(r, 300));
			} catch (err) {
				console.error(`❌ Error processing question ${question.id}:`, err);
				failed++;
			}
		}

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
		console.error("💥 Error:", error);
		const message = error instanceof Error ? error.message : String(error);
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}
});
