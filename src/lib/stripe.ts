import Stripe from 'stripe';

// Server-only Stripe SDK singleton
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    stripeInstance = new Stripe(key, { apiVersion: '2026-02-25.clover' });
  }
  return stripeInstance;
}

export const PRICE_IDS: Record<string, string> = {
  supporter: process.env.STRIPE_SUPPORTER_PRICE_ID ?? '',
  founding_member: process.env.STRIPE_FOUNDER_PRICE_ID ?? '',
};
