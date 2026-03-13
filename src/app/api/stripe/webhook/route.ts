import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service role env vars not set');
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const checkoutSessionId = session.id;
    const email = session.customer_email ?? (session as unknown as Record<string, { email?: string }>).customer_details?.email;
    const tier = session.metadata?.tier;
    const customerId = typeof session.customer === 'string' ? session.customer : (session.customer as { id?: string } | null)?.id;
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : (session.subscription as { id?: string } | null)?.id;

    if (!email || !tier) {
      console.error('Webhook missing email or tier:', { email, tier });
      return NextResponse.json({ received: true });
    }

    const supabase = getServiceClient();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, supporter_tier')
      .ilike('email', email)
      .maybeSingle();

    if (existingUser) {
      // User exists — set supporter status + tier directly
      // Only upgrade, never downgrade (founding_member > supporter)
      const shouldUpgrade = tier === 'founding_member' || existingUser.supporter_tier !== 'founding_member';
      await supabase
        .from('users')
        .update({
          is_supporter: true,
          supporter_since: new Date().toISOString(),
          ...(shouldUpgrade ? { supporter_tier: tier } : {}),
        })
        .eq('id', existingUser.id);
    } else {
      // User doesn't exist yet — store as pending entitlement
      // stripe_checkout_session_id unique index ensures idempotency on retries
      const { error } = await supabase.from('pending_entitlements').insert({
        email: email.toLowerCase(),
        tier,
        stripe_customer_id: customerId ?? 'unknown',
        stripe_subscription_id: subscriptionId ?? null,
        stripe_checkout_session_id: checkoutSessionId,
        amount_cents: session.amount_total ?? 0,
        currency: session.currency ?? 'usd',
      });

      if (error && !error.message?.includes('duplicate')) {
        console.error('Failed to insert pending entitlement:', error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
