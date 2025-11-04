import { loadStripe } from "@stripe/stripe-js";

export const STRIPE_PUBLISHABLE_KEY =
	import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
	"pk_test_YOUR_PUBLISHABLE_KEY_HERE";
export const PRICE_AMOUNT = 30;

export const stripePromise = STRIPE_PUBLISHABLE_KEY.startsWith("pk_")
	? loadStripe(STRIPE_PUBLISHABLE_KEY)
	: null;
