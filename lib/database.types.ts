export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string; wallet_address: string | null; tier: 'free' | 'bull' | 'whale'; dtp_token_balance: number; role: 'user' | 'creator' | 'admin'; created_at: string; updated_at: string }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      creators: {
        Row: { id: string; user_id: string; display_name: string; username: string; bio: string | null; avatar_url: string | null; banner_url: string | null; sextpanther_url: string | null; sextpanther_live: boolean; verified: boolean; approved_at: string | null; approved_by: string | null; suspended: boolean; total_earnings_usd: number; total_tips_sol: number; subscriber_count: number; created_at: string }
        Insert: Omit<Database['public']['Tables']['creators']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['creators']['Insert']>
      }
      creator_applications: {
        Row: { id: string; email: string; name: string; phone: string | null; social_links: Json; content_categories: string[]; id_front_url: string | null; id_back_url: string | null; selfie_url: string | null; solana_wallet: string | null; tiplink_email: string | null; agreed_to_terms: boolean; agreed_to_2257: boolean; status: 'pending' | 'approved' | 'rejected'; applied_at: string; reviewed_at: string | null; reviewed_by: string | null; reject_reason: string | null; invite_token: string | null; invite_sent_at: string | null; invite_expires_at: string | null }
        Insert: Omit<Database['public']['Tables']['creator_applications']['Row'], 'id' | 'applied_at'>
        Update: Partial<Database['public']['Tables']['creator_applications']['Insert']>
      }
      content: {
        Row: { id: string; creator_id: string; title: string; description: string | null; thumbnail_url: string | null; video_url: string | null; hls_url: string | null; price_usd: number; price_dtp: number | null; is_ppv: boolean; required_tier: 'free' | 'bull' | 'whale'; category: string; tags: string[]; views: number; likes: number; duration_seconds: number | null; status: 'draft' | 'active' | 'flagged' | 'removed'; created_at: string }
        Insert: Omit<Database['public']['Tables']['content']['Row'], 'id' | 'created_at' | 'views' | 'likes'>
        Update: Partial<Database['public']['Tables']['content']['Insert']>
      }
      purchases: {
        Row: { id: string; user_id: string; content_id: string; amount_usd: number; currency: string; tx_hash: string | null; payment_method: 'nowpayments' | 'tiplink' | 'x402' | 'dtp_token'; created_at: string }
        Insert: Omit<Database['public']['Tables']['purchases']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['purchases']['Insert']>
      }
      tips: {
        Row: { id: string; user_id: string; creator_id: string; amount_sol: number; amount_usd: number | null; tx_hash: string | null; message: string | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['tips']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tips']['Insert']>
      }
      subscriptions: {
        Row: { id: string; user_id: string; creator_id: string | null; tier: 'bull' | 'whale'; expires_at: string; payment_method: string; tx_hash: string | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
      sextpanther_clicks: {
        Row: { id: string; creator_id: string; user_id: string | null; click_type: 'call' | 'text'; referrer: string | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['sextpanther_clicks']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['sextpanther_clicks']['Insert']>
      }
    }
  }
}
