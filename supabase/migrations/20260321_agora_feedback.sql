-- ═══════════════════════════════════════════════════════════════════════════
-- THE AGORA — Public Feedback Board
-- A community space where users share ideas, report bugs, and shape the app.
-- ═══════════════════════════════════════════════════════════════════════════

-- Posts table
CREATE TABLE IF NOT EXISTS public.agora_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('idea', 'bug', 'love', 'question')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'heard', 'in_progress', 'done')),
  vote_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agora_posts_vote_idx ON public.agora_posts (vote_count DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS agora_posts_user_idx ON public.agora_posts (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS agora_posts_category_idx ON public.agora_posts (category);

CREATE TRIGGER agora_posts_updated_at
  BEFORE UPDATE ON public.agora_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Votes table (one vote per user per post)
CREATE TABLE IF NOT EXISTS public.agora_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.agora_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX IF NOT EXISTS agora_votes_post_idx ON public.agora_votes (post_id);
CREATE INDEX IF NOT EXISTS agora_votes_user_idx ON public.agora_votes (user_id);

-- Trigger: auto-update denormalized vote_count on agora_posts
CREATE OR REPLACE FUNCTION public.agora_update_vote_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.agora_posts SET vote_count = vote_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.agora_posts SET vote_count = vote_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER agora_votes_count_trigger
  AFTER INSERT OR DELETE ON public.agora_votes
  FOR EACH ROW EXECUTE FUNCTION public.agora_update_vote_count();

-- RLS
ALTER TABLE public.agora_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agora_votes ENABLE ROW LEVEL SECURITY;

-- Posts: all authenticated can read, own insert/update/delete
CREATE POLICY agora_posts_select ON public.agora_posts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY agora_posts_insert ON public.agora_posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY agora_posts_update ON public.agora_posts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY agora_posts_delete ON public.agora_posts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Votes: all authenticated can read, own insert/delete
CREATE POLICY agora_votes_select ON public.agora_votes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY agora_votes_insert ON public.agora_votes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY agora_votes_delete ON public.agora_votes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
