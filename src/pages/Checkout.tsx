import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { PRICE_AMOUNT, REGULAR_PRICE, stripePromise } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import {
	PaymentElement,
	Elements,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";

interface CheckoutProps {
	email: string;
	password: string;
}

const CheckoutForm = ({ email, password }: CheckoutProps) => {
	const [loading, setLoading] = useState(false);
	const stripe = useStripe();
	const elements = useElements();
	const navigate = useNavigate();
	const { toast } = useToast();

	const handlePayment = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setLoading(true);

		try {
			// Utwórz Payment Intent przez Edge Function
			const { data: paymentIntentData, error: functionError } =
				await supabase.functions.invoke("create-payment-intent", {
					body: { amount: PRICE_AMOUNT, currency: "pln" },
				});

			if (functionError) throw functionError;

			// Potwierdź płatność
			const { error: stripeError, paymentIntent } =
				await stripe.confirmPayment({
					elements,
					confirmParams: {
						return_url: window.location.origin,
					},
					redirect: "if_required",
				});

			if (stripeError) throw stripeError;

			if (paymentIntent?.status === "succeeded") {
				// Po udanej płatności - zarejestruj użytkownika
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: `${window.location.origin}/`,
					},
				});

				if (error) throw error;

				if (data.user) {
					toast({
						title: "Płatność zatwierdzona!",
						description:
							"Twoje konto zostało utworzone. Możesz się teraz zalogować.",
					});
					navigate("/auth");
				}
			}
		} catch (error: any) {
			toast({
				title: "Błąd płatności",
				description: error.message || "Nie udało się przetworzyć płatności",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center relative">
				<div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
					🎉 -50%
				</div>
				<CardTitle className="text-2xl">Płatność</CardTitle>
				<CardDescription>Bezpieczna płatność przez Stripe</CardDescription>
				<div className="pt-4">
					<div className="flex items-center justify-center gap-3 mb-2">
						<span className="text-2xl text-muted-foreground line-through opacity-60">
							{REGULAR_PRICE} PLN
						</span>
						<span className="text-4xl font-bold text-primary">
							{PRICE_AMOUNT} PLN
						</span>
					</div>
					<p className="text-sm text-muted-foreground">
						Jednorazowa płatność za dożywotni dostęp
					</p>
					<p className="text-xs text-accent font-medium mt-1">
						Promocja dla pierwszych 100 użytkowników
					</p>
				</div>
			</CardHeader>
			<CardContent>
				<form onSubmit={handlePayment} className="space-y-4">
					<div className="space-y-2">
						<Label>Metoda płatności</Label>
						<div className="p-3 border rounded-md">
							<PaymentElement
								options={{
									layout: "tabs",
								}}
							/>
						</div>
					</div>

					<div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
						<Lock className="h-4 w-4" />
						<span>Płatność zabezpieczona przez Stripe</span>
					</div>

					<Button
						type="submit"
						className="w-full"
						size="lg"
						disabled={loading || !stripe}
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Przetwarzanie...
							</>
						) : (
							`Zapłać ${PRICE_AMOUNT} PLN`
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

const Checkout = (props: CheckoutProps) => {
	const [clientSecret, setClientSecret] = useState<string | null>(null);

	useEffect(() => {
		const createPaymentIntent = async () => {
			const { data, error } = await supabase.functions.invoke(
				"create-payment-intent",
				{
					body: { amount: PRICE_AMOUNT, currency: "pln" },
				}
			);
			if (!error && data?.client_secret) {
				setClientSecret(data.client_secret);
			}
		};
		createPaymentIntent();
	}, []);

	if (!stripePromise) {
		return (
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Konfiguracja wymagana</CardTitle>
					<CardDescription>
						Skonfiguruj klucze Stripe w pliku src/lib/stripe.ts
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	if (!clientSecret) {
		return (
			<Card className="w-full max-w-md">
				<CardContent className="flex items-center justify-center py-8">
					<Loader2 className="h-8 w-8 animate-spin" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Elements
			stripe={stripePromise}
			options={{
				clientSecret,
				appearance: {
					theme: "stripe",
				},
			}}
		>
			<CheckoutForm {...props} />
		</Elements>
	);
};

export default Checkout;
