-- ═══════════════════════════════════════════════════════════════════════════
-- THE AGORA — Public Feedback Board
-- A community space where users share ideas, report bugs, and shape the app.
-- ═══════════════════════════════════════════════════════════════════════════

-- Posts table (user_id nullable for system/seed posts)
CREATE TABLE IF NOT EXISTS public.agora_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('idea', 'bug', 'love', 'question')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'heard', 'in_progress', 'done')),
  vote_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
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

-- Comments table
CREATE TABLE IF NOT EXISTS public.agora_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.agora_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agora_comments_post_idx ON public.agora_comments (post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS agora_comments_user_idx ON public.agora_comments (user_id);

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

-- Trigger: auto-update denormalized comment_count on agora_posts
CREATE OR REPLACE FUNCTION public.agora_update_comment_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.agora_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.agora_posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER agora_comments_count_trigger
  AFTER INSERT OR DELETE ON public.agora_comments
  FOR EACH ROW EXECUTE FUNCTION public.agora_update_comment_count();

-- ── RLS ──────────────────────────────────────────────────────────────────

ALTER TABLE public.agora_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agora_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agora_comments ENABLE ROW LEVEL SECURITY;

-- Posts: all authenticated can read; own insert/update/delete (user_id must match)
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

-- Comments: all authenticated can read, own insert/delete
CREATE POLICY agora_comments_select ON public.agora_comments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY agora_comments_insert ON public.agora_comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY agora_comments_delete ON public.agora_comments
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED POSTS — Make the board feel alive from day one.
-- These are real DB rows with user_id = NULL (system posts).
-- Users can vote on and comment on them like any other post.
-- Ideas are given the highest vote counts so they appear first.
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO public.agora_posts (user_id, content, category, status, vote_count, created_at, updated_at) VALUES
  -- Ideas (highest votes — appear at the top)
  (NULL, 'It would be amazing if we could set a daily reminder notification. Some mornings I forget to open the app and break my streak. Even a simple push at 8am would help a lot.', 'idea', 'heard', 34, '2026-03-18T09:22:00Z', '2026-03-18T09:22:00Z'),
  (NULL, 'Would love a way to bookmark or save specific lessons so I can come back to them on tough days. Some of them hit really hard and I want to revisit without scrolling through everything.', 'idea', 'open', 29, '2026-03-17T20:30:00Z', '2026-03-17T20:30:00Z'),
  (NULL, 'A small thing — it would be nice to see how many people are on the same lesson as me. Not names, just a number. Like "47 others reflected on this today." Would make it feel less lonely.', 'idea', 'open', 25, '2026-03-18T15:30:00Z', '2026-03-18T15:30:00Z'),
  (NULL, 'Would it be possible to add a weekly summary or progress email? Something short that reminds me how far I''ve come. Seeing the streak number is nice but a bigger picture would motivate me more.', 'idea', 'in_progress', 21, '2026-03-15T16:00:00Z', '2026-03-15T16:00:00Z'),
  (NULL, 'Can we get a dark mode that''s even darker? The current one is good but on AMOLED screens a true black background would save battery and look cleaner.', 'idea', 'open', 16, '2026-03-19T22:10:00Z', '2026-03-19T22:10:00Z'),

  -- Love
  (NULL, 'Honestly the reflection after each lesson is my favorite part. Putting my thoughts into words makes the lesson stick way more than just reading it. Whoever designed that — thank you.', 'love', 'open', 18, '2026-03-19T14:05:00Z', '2026-03-19T14:05:00Z'),
  (NULL, 'The exercises after lessons feel like actual practice, not homework. That''s rare. Most apps just quiz you. This one makes you think about your own life.', 'love', 'open', 14, '2026-03-20T07:45:00Z', '2026-03-20T07:45:00Z'),
  (NULL, 'I shared a lesson quote with my brother who''s going through a rough patch and he signed up the same day. This app has a way of saying things that land differently.', 'love', 'open', 12, '2026-03-16T11:30:00Z', '2026-03-16T11:30:00Z'),
  (NULL, 'I''ve tried four or five self-improvement apps before. They all felt like they were selling me something. This one feels like it actually wants me to grow. That''s the difference.', 'love', 'open', 11, '2026-03-14T08:15:00Z', '2026-03-14T08:15:00Z'),
  (NULL, 'The stoicism world completely changed how I react to things at work. My coworker noticed I''m calmer. Didn''t tell him it''s an app lol.', 'love', 'open', 9, '2026-03-17T10:55:00Z', '2026-03-17T10:55:00Z'),

  -- Bug
  (NULL, 'Sometimes the spark videos take a while to load on slower connections. Maybe a preload or a lower quality option for people on mobile data?', 'bug', 'heard', 7, '2026-03-20T18:20:00Z', '2026-03-20T18:20:00Z'),

  -- Question
  (NULL, 'Is there a way to practice old exercises again? I want to redo some of the early ones now that I understand the concepts better. Feel like I''d get more out of them now.', 'question', 'open', 11, '2026-03-19T13:40:00Z', '2026-03-19T13:40:00Z');
