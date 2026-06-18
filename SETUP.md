# DTP — Day Trader Porn
## Production Deployment Guide · daytraderporn.com

> "Where the market never closes."

---

## Stack

- **Frontend/Backend**: Next.js 14 App Router (TypeScript)
- **Hosting**: Vercel (serverless, one-command deploy)
- **Database + Auth + Storage**: Supabase
- **Payments**: TipLink (SOL) · NOWPayments (100+ crypto) · x402 (USDC/Base)
- **Video CDN**: Supabase Storage or Cloudflare R2
- **Market Data**: Binance WebSocket (live) · Alpha Vantage (NQ/stocks)
- **Adult Ads**: ExoClick (free tier only)
- **Creator CRM**: CreatorCommand.club (Base44)

---

## 1. Prerequisites

```bash
node --version  # 20+
npm --version   # 10+
vercel --version || npm i -g vercel
```

---

## 2. Clone & Install

```bash
git clone https://github.com/SuessVilliano/DTP.git
cd DTP
npm ci
cp .env.example .env.local
```

---

## 3. Supabase Setup

### 3a. Create project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `dtp`, choose a strong DB password
3. Region: **US East (N. Virginia)** — closest to Vercel's `iad1`

### 3b. Run database schema

In the Supabase SQL Editor, run:

```sql
-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  wallet_address text,
  tier text not null default 'free' check (tier in ('free','bull','whale')),
  dtp_token_balance numeric default 0,
  role text not null default 'user' check (role in ('user','creator','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Creators
create table creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  display_name text not null,
  username text unique not null,
  bio text,
  avatar_url text,
  banner_url text,
  sextpanther_url text,
  sextpanther_live boolean default false,
  verified boolean default false,
  approved_at timestamptz,
  approved_by uuid references users(id),
  suspended boolean default false,
  total_earnings_usd numeric default 0,
  total_tips_sol numeric default 0,
  subscriber_count int default 0,
  created_at timestamptz default now()
);

-- Creator Applications
create table creator_applications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  phone text,
  social_links jsonb default '{}',
  content_categories text[] default '{}',
  id_front_url text,
  id_back_url text,
  selfie_url text,
  solana_wallet text,
  tiplink_email text,
  agreed_to_terms boolean not null default false,
  agreed_to_2257 boolean not null default false,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  applied_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references users(id),
  reject_reason text,
  invite_token text unique,
  invite_sent_at timestamptz,
  invite_expires_at timestamptz
);

-- Content
create table content (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id) on delete cascade,
  title text not null,
  description text,
  thumbnail_url text,
  video_url text,
  hls_url text,
  price_usd numeric default 0,
  price_dtp numeric,
  is_ppv boolean default false,
  required_tier text default 'free' check (required_tier in ('free','bull','whale')),
  category text not null,
  tags text[] default '{}',
  views int default 0,
  likes int default 0,
  duration_seconds int,
  status text default 'active' check (status in ('draft','active','flagged','removed')),
  created_at timestamptz default now()
);

-- Purchases
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  content_id uuid references content(id),
  amount_usd numeric not null,
  currency text not null,
  tx_hash text,
  payment_method text not null,
  created_at timestamptz default now()
);

-- Tips
create table tips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  creator_id uuid references creators(id),
  amount_sol numeric not null,
  amount_usd numeric,
  tx_hash text,
  message text,
  created_at timestamptz default now()
);

-- Subscriptions
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  creator_id uuid references creators(id),
  tier text not null check (tier in ('bull','whale')),
  expires_at timestamptz not null,
  payment_method text,
  tx_hash text,
  created_at timestamptz default now()
);

-- SextPanther click tracking
create table sextpanther_clicks (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id),
  user_id uuid references users(id),
  click_type text check (click_type in ('call','text')),
  referrer text,
  created_at timestamptz default now()
);

-- RLS: Enable on all tables
alter table users enable row level security;
alter table creators enable row level security;
alter table creator_applications enable row level security;
alter table content enable row level security;
alter table purchases enable row level security;
alter table tips enable row level security;
alter table subscriptions enable row level security;

-- Basic RLS: users can read their own data; creators table is public read
create policy "Users can read own profile" on users for select using (auth.uid() = id);
create policy "Creators are publicly readable" on creators for select using (true);
create policy "Active content is publicly readable" on content for select using (status = 'active');
-- Admin bypass: use service role key in API routes
```

### 3c. Create Storage bucket for creator IDs

In Supabase → Storage → New Bucket:
- Name: `creator-ids`
- **Private** (no public access)
- Policy: service role only (for admin ID review)

### 3d. Get Supabase credentials

In Supabase → Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (**server-side only, never expose to client**)

---

## 4. API Keys to Configure

### Auth (NextAuth)
```
NEXTAUTH_SECRET=openssl rand -base64 32
GOOGLE_CLIENT_ID=from Google Cloud Console
GOOGLE_CLIENT_SECRET=from Google Cloud Console
```
Set authorized redirect URI: `https://daytraderporn.com/api/auth/callback/google`

### Market Data
```
ALPHA_VANTAGE_API_KEY=free at alphavantage.co
# Binance WebSocket is public — no key needed
```

### Payments
```
# NOWPayments — nowpayments.io
NOWPAYMENTS_API_KEY=
NOWPAYMENTS_IPN_SECRET=

# TipLink — tiplink.io
TIPLINK_API_KEY=

# x402/USDC — coinbase Base network
X402_RECEIVING_ADDRESS=0x...
X402_FACILITATOR_URL=https://x402.org/facilitator
```

### Solana / DTP Token
```
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# For production, use Helius: https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
NEXT_PUBLIC_DTP_TOKEN_MINT=<mint address after token deploy>
```

### ExoClick (Adult Ads)
```
NEXT_PUBLIC_EXOCLICK_PUBLISHER_ID=
NEXT_PUBLIC_EXOCLICK_ZONE_300x250=
NEXT_PUBLIC_EXOCLICK_ZONE_728x90=
NEXT_PUBLIC_EXOCLICK_ZONE_NATIVE=
```

### CreatorCommand.club
```
CC_WEBHOOK_SECRET=generate-with-openssl-rand-hex-32
CC_API_URL=https://app.creatorcommand.club
CC_API_KEY=your-cc-api-key
```

### SextPanther Affiliate
```
NEXT_PUBLIC_SEXTPANTHER_AFFILIATE_ID=your-affiliate-id
```

### Legal / Compliance
```
COMPLIANCE_CUSTODIAN_NAME="Legal Custodian Name"
COMPLIANCE_CUSTODIAN_ADDRESS="Address on file"
DMCA_AGENT_EMAIL=dmca@daytraderporn.com
```

---

## 5. Deploy to Vercel — Production (daytraderporn.com)

### 5a. First deploy

```bash
vercel login
vercel --prod
```

Or connect via GitHub:
1. [vercel.com/new](https://vercel.com/new) → Import `SuessVilliano/DTP`
2. Framework: **Next.js** (auto-detected)
3. Build command: `npm run build`
4. Output: `.next` (auto-detected)
5. Add **all environment variables** from `.env.local`
6. Click **Deploy**

### 5b. Add all environment variables in Vercel

Go to: Vercel Dashboard → DTP project → Settings → Environment Variables

Add every key from `.env.local`. Mark as **Production** environment. For secrets, also enable **Preview** if needed.

---

## 6. Custom Domain: daytraderporn.com

### 6a. Add domain in Vercel

1. Vercel Dashboard → DTP project → Settings → **Domains**
2. Click **Add Domain**
3. Enter: `daytraderporn.com`
4. Also add: `www.daytraderporn.com` (Vercel will auto-redirect to apex)
5. Click **Add**

Vercel will show you the required DNS records.

### 6b. DNS configuration at your registrar

Log in to wherever you registered `daytraderporn.com` and add:

**Apex domain (daytraderporn.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto / 3600
```

**WWW subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto / 3600
```

> **Using Cloudflare?** Set DNS records to **DNS only** (gray cloud, not orange) for the A record. Vercel handles SSL — don't proxy through Cloudflare or SSL will break.

### 6c. SSL — automatic

Vercel auto-provisions a **Let's Encrypt SSL certificate**. No configuration needed.

### 6d. Verify

```bash
dig daytraderporn.com A        # Should return 76.76.21.21
curl -I https://daytraderporn.com  # Should return 200 with valid cert
```

---

## 7. Subsequent Deploys

Every push to `main` auto-deploys to production (if GitHub is connected to Vercel).

---

## 8. Post-Deploy Checklist

- [ ] Age gate at `daytraderporn.com` working
- [ ] `/home` — homepage loads, animations work, ticker tape live
- [ ] BTC candlestick chart streaming via Binance WebSocket
- [ ] `/become-a-creator` — recruitment page displaying
- [ ] `/creator/apply` — 5-step application form submits to Supabase
- [ ] `/admin` — applications queue populating from Supabase
- [ ] Creator APPROVE/REJECT buttons working
- [ ] NOWPayments webhook: `https://daytraderporn.com/api/payments/nowpayments/webhook`
- [ ] ExoClick publisher ID set
- [ ] DTP token deployed on Solana — update `NEXT_PUBLIC_DTP_TOKEN_MINT`
- [ ] 2257 custodian details in Vercel env vars
- [ ] DMCA agent registered
- [ ] SSL certificate active (green lock)

---

## 9. Architecture

```
daytraderporn.com (Vercel Serverless)
├── Frontend (Next.js 14 App Router)
│   ├── / → Age Gate
│   ├── /home → Conversion-optimized landing
│   ├── /watch/[id] → Video player + PPV
│   ├── /creator/[username] → Creator profile
│   ├── /become-a-creator → Recruitment landing
│   ├── /creator/apply → 5-step application form
│   ├── /dashboard → Creator dashboard
│   ├── /join → Membership/pricing
│   ├── /markets → Trading Room
│   ├── /admin → Applications queue + management
│   └── /2257, /terms, /privacy, /dmca → Compliance
│
├── API Routes
│   ├── /api/auth → NextAuth
│   ├── /api/market/binance → Kline proxy
│   ├── /api/market/alphavantage → NQ/stocks proxy
│   ├── /api/payments/nowpayments → Invoice + status
│   ├── /api/payments/tiplink → SOL payments
│   ├── /api/payments/x402 → USDC/Base
│   ├── /api/token/balance → DTP token check
│   ├── /api/creators/apply → Application → Supabase
│   ├── /api/creators/approve → APPROVE/REJECT
│   ├── /api/creators/cc-sync → CreatorCommand webhook
│   └── /api/health → Health check
│
└── Services
    ├── Supabase (Postgres + Auth + Storage)
    ├── Binance WebSocket (live prices)
    ├── Solana RPC (DTP token gating)
    ├── NOWPayments / TipLink / x402
    ├── ExoClick (adult ads)
    └── CreatorCommand.club (creator CRM)
```

---

## 10. Compliance

### 18 U.S.C. § 2257
- Set `COMPLIANCE_CUSTODIAN_NAME` and `COMPLIANCE_CUSTODIAN_ADDRESS` in Vercel env vars
- All performers must have age verification on file before content goes live
- Admin must verify ID docs before approving any creator application
- `/2257` page auto-generates from env vars

### Age Gate
- Cookie: `dtp_age_verified=1; max-age=86400; SameSite=Strict; Secure`

### DMCA
- Register at: https://www.copyright.gov/dmca-directory/
- Set `DMCA_AGENT_EMAIL` in env vars
