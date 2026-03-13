import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PRICE_IDS } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { tier, email } = await req.json();

    if (!tier || !PRICE_IDS[tier]) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const priceId = PRICE_IDS[tier];
    if (!priceId) {
      return NextResponse.json({ error: 'Stripe price not configured' }, { status: 500 });
    }

    const stripe = getStripe();
    const origin = req.headers.get('origin') ?? '';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { tier },
      ...(email ? { customer_email: email } : {}),
      success_url: `${origin}/site?payment=success`,
      cancel_url: `${origin}/site?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
