-- ═══════════════════════════════════════════════════════════════════════════
-- STRIPE ENTITLEMENTS + MARKETING ANALYTICS
-- Supports pre-account purchases: pay first, claim on signup
-- ═══════════════════════════════════════════════════════════════════════════

-- Add supporter_tier to users (distinct from is_supporter boolean)
-- 'supporter' = $4.99/mo, 'founding_member' = $9.99/mo
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS supporter_tier text
  CHECK (supporter_tier IS NULL OR supporter_tier IN ('supporter', 'founding_member'));

-- Pending entitlements: stores unclaimed Stripe purchases
CREATE TABLE IF NOT EXISTS public.pending_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('supporter', 'founding_member')),
  stripe_customer_id text NOT NULL,
  stripe_subscription_id text,
  stripe_checkout_session_id text,
  amount_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  created_at timestamptz NOT NULL DEFAULT now(),
  claimed_at timestamptz,
  claimed_by uuid REFERENCES public.users(id)
);

-- Idempotency: prevent duplicate rows from Stripe webhook retries
CREATE UNIQUE INDEX IF NOT EXISTS idx_pending_checkout_session
  ON public.pending_entitlements(stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pending_email
  ON public.pending_entitlements(email)
  WHERE claimed_at IS NULL;

-- Auto-claim trigger: fires when a new user row is created
-- Matches pending entitlements by email, sets is_supporter + supporter_tier
CREATE OR REPLACE FUNCTION public.claim_pending_entitlements()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_email text;
  v_best_tier text;
BEGIN
  SELECT email INTO v_email FROM auth.users WHERE id = NEW.id;

  UPDATE public.pending_entitlements
  SET claimed_at = now(), claimed_by = NEW.id
  WHERE lower(email) = lower(v_email)
    AND claimed_at IS NULL;

  IF FOUND THEN
    -- Pick the highest tier purchased (founding_member > supporter)
    SELECT tier INTO v_best_tier
    FROM public.pending_entitlements
    WHERE claimed_by = NEW.id
    ORDER BY CASE tier WHEN 'founding_member' THEN 2 WHEN 'supporter' THEN 1 ELSE 0 END DESC
    LIMIT 1;

    UPDATE public.users
    SET is_supporter = true,
        supporter_since = now(),
        supporter_tier = v_best_tier
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_claim_entitlements ON public.users;
CREATE TRIGGER trg_claim_entitlements
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.claim_pending_entitlements();

-- Marketing analytics: lightweight event tracking for /site
CREATE TABLE IF NOT EXISTS public.marketing_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb,
  page text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: pending_entitlements is only accessible via service role (webhooks)
ALTER TABLE public.pending_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_events ENABLE ROW LEVEL SECURITY;
