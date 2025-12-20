import "https://deno.land/std@0.168.0/dotenv/load.ts";
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
		const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

		const { amount, currency = "pln" } = await req.json();

		console.log("Creating payment intent for amount:", amount);

		const params = new URLSearchParams({
			amount: (amount * 100).toString(), // Stripe używa najmniejszej jednostki waluty (grosze)
			currency: currency,
		});

		// Tylko metody, które masz włączone (bez dodawania nowych)
		params.append("payment_method_types[]", "card");
		params.append("payment_method_types[]", "blik");

		const response = await fetch("https://api.stripe.com/v1/payment_intents", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params,
		});

		const paymentIntent = await response.json();

		console.log("Payment intent created:", paymentIntent.id);

		return new Response(JSON.stringify(paymentIntent), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
			status: 200,
		});
	} catch (error) {
		console.error("Error creating payment intent:", error);
		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				headers: { ...corsHeaders, "Content-Type": "application/json" },
				status: 400,
			}
		);
	}
});
