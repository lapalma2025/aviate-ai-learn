import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ---------------------- KONFIGURACJA I LIMITY ----------------------

const OVERALL_DEADLINE_MS = 14000;
const GEMINI_TIMEOUT_MS = 6500;
const HF_TIMEOUT_MS = 7500;
const GEMINI_RETRIES = 1;
const HF_RETRIES = 1;

const STYLE_SENTENCES_HINT =
	"Napisz odpowiedź w 15 zdaniach, po polsku, jasno i rzeczowo.";

// ---------------------------- CORS ----------------------------

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
};

// ------------------------- POMOCNICZE FUNKCJE ------------------------

function cleanMarkdown(text: string): string {
	if (!text) return "";
	return text
		.replace(/\r/g, "")
		.replace(/\*\*(.*?)\*\*/g, "$1")
		.replace(/\*(.*?)\*/g, "$1")
		.replace(/^[\s\-•]+/gm, "")
		.replace(/#+\s?/g, "")
		.replace(/`/g, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function clampSentences(text: string, min = 3, max = 6): string {
	const parts = text
		.replace(/\s+/g, " ")
		.split(/(?<=[\.\!\?])\s+/)
		.filter(Boolean);
	if (parts.length <= max) return text.trim();
	return parts.slice(0, max).join(" ").trim();
}

function errorMessage(reason?: string) {
	return (
		reason ||
		"Nie udało się wygenerować odpowiedzi AI. Spróbuj ponownie za chwilę."
	);
}

async function fetchWithTimeout(
	input: Request | string,
	init: RequestInit & { timeoutMs: number }
) {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), init.timeoutMs);
	try {
		const res = await fetch(input, { ...init, signal: controller.signal });
		return res;
	} finally {
		clearTimeout(id);
	}
}

function safeExtractTextFromGemini(data: any): string {
	try {
		const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
		return typeof text === "string" ? text.trim() : "";
	} catch {
		return "";
	}
}

// ----------------------------- GEMINI -----------------------------

async function callGemini(
	prompt: string,
	apiKey: string,
	retries = GEMINI_RETRIES,
	perAttemptTimeoutMs = GEMINI_TIMEOUT_MS
): Promise<{ text: string; tookMs: number }> {
	const url =
		"https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" +
		apiKey;

	const body = {
		contents: [{ parts: [{ text: prompt }] }],
		generationConfig: {
			temperature: 0.6,
			maxOutputTokens: 800,
			topP: 0.9,
			topK: 40,
		},
	};

	const start = Date.now();

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const res = await fetchWithTimeout(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
				timeoutMs: perAttemptTimeoutMs,
			});

			// jeśli Gemini zwróci jakikolwiek błąd — natychmiast fallback
			if (!res.ok) {
				const text = await res.text();
				console.warn(`❌ Gemini HTTP ${res.status}:`, text);
				return { text: "", tookMs: Date.now() - start };
			}

			const data = await res.json();
			const text = safeExtractTextFromGemini(data);
			if (text) return { text, tookMs: Date.now() - start };
		} catch (e) {
			console.warn(`⚠️ Gemini attempt ${attempt + 1} error:`, String(e));
			return { text: "", tookMs: Date.now() - start };
		}
	}

	return { text: "", tookMs: Date.now() - start };
}

// -------------------------- HUGGING FACE --------------------------

async function callHuggingFace(
	prompt: string,
	token: string,
	retries = HF_RETRIES,
	perAttemptTimeoutMs = HF_TIMEOUT_MS
): Promise<{ text: string; tookMs: number }> {
	const url =
		"https://api-inference.huggingface.co/models/Orzanna/Polish-Llama-2-7b";
	const start = Date.now();

	const payload = {
		inputs: prompt,
		parameters: {
			max_new_tokens: 320,
			do_sample: true,
			temperature: 0.65,
			top_p: 0.9,
			repetition_penalty: 1.08,
			return_full_text: false,
		},
	};

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const res = await fetchWithTimeout(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
				timeoutMs: perAttemptTimeoutMs,
			});

			if (!res.ok) {
				const t = await res.text();
				console.warn(`⚠️ HF HTTP ${res.status} (try ${attempt + 1}):`, t);
				continue;
			}

			const data = await res.json();
			const raw =
				data?.[0]?.generated_text ?? data?.generated_text ?? data?.text ?? "";
			const text = typeof raw === "string" ? raw.trim() : "";
			if (text) return { text, tookMs: Date.now() - start };
		} catch (e) {
			console.warn(`⚠️ HF attempt ${attempt + 1} error:`, String(e));
		}
	}
	return { text: "", tookMs: Date.now() - start };
}

// ------------------------------ PROMPT ------------------------------

const SYSTEM_PROMPT = `Jesteś ekspertem lotniczym pomagającym studentom w nauce do egzaminu PPLA (Private Pilot Licence - Aeroplane).
Odpowiadasz po polsku, prostym i zrozumiałym językiem. Unikaj żargonu bez wyjaśnienia.
${STYLE_SENTENCES_HINT}
Nie używaj formatowania markdown, symboli specjalnych ani emotikonów.`;

function buildPrompt(question: string, answer?: string, userQuestion?: string) {
	if (userQuestion) {
		return `${SYSTEM_PROMPT}

Pytanie egzaminacyjne: "${question}"
Prawidłowa odpowiedź: "${answer ?? ""}"

Pytanie studenta: ${userQuestion}

Wytłumacz zagadnienie tak, by uczeń rozumiał sens odpowiedzi i kontekst praktyczny (operacje lotnicze, przykłady). ${STYLE_SENTENCES_HINT}`;
	}
	return `${SYSTEM_PROMPT}

Wyjaśnij dlaczego odpowiedź "${
		answer ?? ""
	}" jest prawidłowa dla pytania: "${question}".
Podaj najważniejszą ideę, prosty przykład i typowy błąd, którego należy unikać. ${STYLE_SENTENCES_HINT}`;
}

// --------------------------- EDGE FUNCTION ---------------------------

serve(async (req) => {
	if (req.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders });
	}

	const overallStart = Date.now();
	const deadlineTimer = setTimeout(() => {
		console.warn("⏰ Zbliża się ogólny deadline funkcji.");
	}, OVERALL_DEADLINE_MS - 500);

	try {
		const { question, answer, userQuestion } = await req.json();

		if (!question || typeof question !== "string" || !question.trim()) {
			return new Response(JSON.stringify({ error: "Brak pytania." }), {
				status: 400,
				headers: corsHeaders,
			});
		}

		const geminiKey = Deno.env.get("GOOGLE_GEMINI_API_KEY");
		const hfToken = Deno.env.get("HUGGINGFACE_TOKEN");
		const prompt = buildPrompt(question, answer, userQuestion);

		let explanation = "";
		let source: "Gemini" | "HuggingFace" | "none" = "none";
		let timings: Record<string, number> = {};

		// najpierw próbujemy Gemini
		if (geminiKey) {
			const g = await callGemini(prompt, geminiKey);
			if (g.text) {
				explanation = g.text;
				source = "Gemini";
				timings.geminiMs = g.tookMs;
			}
		}

		// jeśli Gemini zawiedzie lub zwróci pusty tekst → od razu fallback
		if (!explanation && hfToken) {
			console.log("⚙️ Gemini zawiodło — przełączam na Hugging Face...");
			const h = await callHuggingFace(prompt, hfToken);
			if (h.text) {
				explanation = h.text;
				source = "HuggingFace";
				timings.hfMs = h.tookMs;
			}
		}

		// ostatecznie — brak odpowiedzi
		if (!explanation) {
			return new Response(
				JSON.stringify({
					explanation: errorMessage(),
					source: "none",
					timings: { totalMs: Date.now() - overallStart },
				}),
				{ headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		// czyszczenie i skracanie odpowiedzi
		explanation = cleanMarkdown(explanation);
		explanation = clampSentences(explanation, 8, 12);

		timings.totalMs = Date.now() - overallStart;

		return new Response(JSON.stringify({ explanation, source, timings }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("💥 Error:", error);
		const message = error instanceof Error ? error.message : String(error);
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	} finally {
		clearTimeout(deadlineTimer);
	}
});
