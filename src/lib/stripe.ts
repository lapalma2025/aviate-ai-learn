import { loadStripe } from '@stripe/stripe-js';

// Mockowy klucz Stripe - podmień na prawdziwy klucz
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_MOCKKEY_replace_with_real_key';
export const PRICE_AMOUNT = 30; // 30 PLN

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
