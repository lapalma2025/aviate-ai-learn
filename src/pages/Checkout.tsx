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
import { PRICE_AMOUNT, stripePromise } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import {
	CardElement,
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

			const cardElement = elements.getElement(CardElement);
			if (!cardElement) throw new Error("Card element not found");

			// Potwierdź płatność
			const { error: stripeError, paymentIntent } =
				await stripe.confirmCardPayment(paymentIntentData.client_secret, {
					payment_method: {
						card: cardElement,
					},
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
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Płatność</CardTitle>
				<CardDescription>Bezpieczna płatność przez Stripe</CardDescription>
				<div className="pt-4">
					<div className="text-4xl font-bold text-primary">
						{PRICE_AMOUNT} PLN
					</div>
					<p className="text-sm text-muted-foreground mt-2">
						Jednorazowa płatność za dożywotni dostęp
					</p>
				</div>
			</CardHeader>
			<CardContent>
				<form onSubmit={handlePayment} className="space-y-4">
					<div className="space-y-2">
						<Label>Dane karty</Label>
						<div className="p-3 border rounded-md">
							<CardElement
								options={{
									style: {
										base: {
											fontSize: "16px",
											color: "hsl(var(--foreground))",
											"::placeholder": {
												color: "hsl(var(--muted-foreground))",
											},
										},
									},
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

	return (
		<Elements stripe={stripePromise}>
			<CheckoutForm {...props} />
		</Elements>
	);
};

export default Checkout;
