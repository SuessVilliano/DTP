-- DayTraderPorn.com — Full Database Schema
-- Run in Supabase SQL Editor or via: supabase db push

CREATE TABLE IF NOT EXISTS public.users (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT        UNIQUE,
  username      TEXT        UNIQUE NOT NULL,
  display_name  TEXT,
  avatar_url    TEXT,
  role          TEXT        NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'subscriber', 'creator', 'admin')),
  wallet_address TEXT       UNIQUE,
  bio           TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS public.creators (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  banner_url      TEXT,
  subscriber_count INT        NOT NULL DEFAULT 0,
  total_tips_sol  NUMERIC     NOT NULL DEFAULT 0,
  content_count   INT         NOT NULL DEFAULT 0,
  is_live         BOOLEAN     NOT NULL DEFAULT FALSE,
  live_channel    TEXT,
  verified        BOOLEAN     NOT NULL DEFAULT FALSE,
  sextpanther_url TEXT,
  fanvue_url      TEXT,
  loyalfans_url   TEXT,
  manyvids_url    TEXT,
  niteflirt_url   TEXT,
  subscription_tiers JSONB   DEFAULT '[{"label":"Free","price":0},{"label":"Bull","price":9.99},{"label":"Whale","price":19.99}]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view creators" ON public.creators FOR SELECT TO PUBLIC USING (TRUE);
CREATE POLICY "Creators can update own record" ON public.creators FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.content (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id      UUID        NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  title           TEXT        NOT NULL,
  description     TEXT,
  thumbnail_url   TEXT,
  media_url       TEXT,
  media_type      TEXT        CHECK (media_type IN ('video', 'photo', 'audio')),
  duration_secs   INT,
  is_ppv          BOOLEAN     NOT NULL DEFAULT FALSE,
  ppv_price_usd   NUMERIC,
  ppv_price_sol   NUMERIC,
  is_pinned       BOOLEAN     NOT NULL DEFAULT FALSE,
  view_count      INT         NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public content is visible" ON public.content FOR SELECT USING (is_ppv = FALSE);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  creator_id      UUID        NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  tier            TEXT        NOT NULL DEFAULT 'free',
  price_paid_usd  NUMERIC,
  price_paid_sol  NUMERIC,
  active          BOOLEAN     NOT NULL DEFAULT TRUE,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, creator_id)
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  to_creator_id   UUID        NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  body            TEXT        NOT NULL,
  media_url       TEXT,
  price_to_unlock NUMERIC,
  is_unlocked     BOOLEAN     NOT NULL DEFAULT FALSE,
  is_read         BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sender and recipient can view" ON public.messages FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() IN (
    SELECT user_id FROM public.creators WHERE id = to_creator_id
  ));

CREATE TABLE IF NOT EXISTS public.tips (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  to_creator_id   UUID        NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  amount_sol      NUMERIC     NOT NULL,
  amount_usd      NUMERIC,
  tx_signature    TEXT        UNIQUE,
  message         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tips are visible to sender and creator" ON public.tips FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() IN (
    SELECT user_id FROM public.creators WHERE id = to_creator_id
  ));

CREATE TABLE IF NOT EXISTS public.bookings (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  creator_id      UUID        NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  package         TEXT        NOT NULL,
  price_usd       NUMERIC     NOT NULL,
  price_sol       NUMERIC,
  status          TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  whereby_room_url TEXT,
  scheduled_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Booking parties can view" ON public.bookings FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM public.creators WHERE id = creator_id
  ));

CREATE TABLE IF NOT EXISTS public.photos (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id      UUID        NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  title           TEXT,
  thumbnail_url   TEXT,
  full_url        TEXT,
  price_usd       NUMERIC     NOT NULL DEFAULT 4.99,
  price_sol       NUMERIC,
  purchase_count  INT         NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can see photo metadata" ON public.photos FOR SELECT TO PUBLIC USING (TRUE);

CREATE TABLE IF NOT EXISTS public.photo_purchases (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  photo_id        UUID        NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  amount_sol      NUMERIC,
  amount_usd      NUMERIC,
  tx_signature    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, photo_id)
);
ALTER TABLE public.photo_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can see own purchases" ON public.photo_purchases FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.notifications (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type            TEXT        NOT NULL,
  body            TEXT        NOT NULL,
  link            TEXT,
  is_read         BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.user_xp (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  xp              INT         NOT NULL DEFAULT 0,
  level           INT         NOT NULL DEFAULT 0,
  level_name      TEXT        NOT NULL DEFAULT 'Paperhand',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own XP" ON public.user_xp FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_messages_from ON public.messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to ON public.messages(to_creator_id);
CREATE INDEX IF NOT EXISTS idx_tips_creator ON public.tips(to_creator_id);
CREATE INDEX IF NOT EXISTS idx_bookings_creator ON public.bookings(creator_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_content_creator ON public.content(creator_id);
