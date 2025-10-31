import { loadStripe } from "@stripe/stripe-js";

export const STRIPE_PUBLISHABLE_KEY = import.meta.env
	.VITE_STRIPE_PUBLISHABLE_KEY;
export const PRICE_AMOUNT = 30;

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
