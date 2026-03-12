/**
 * Supabase Client Configuration
 *
 * This module sets up the Supabase client and exports TypeScript types
 * for all database tables. It safely handles missing environment variables
 * by warning instead of throwing errors, allowing the app to fall back to mock data.
 *
 * @module lib/supabase
 * @author iGRAIL Team
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://placeholder.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'placeholder-anon-key';

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Supabase configuration — fall back to placeholders if env vars are missing or malformed
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const hasValidPublicSupabaseConfig = isValidHttpUrl(rawUrl) && Boolean(rawAnonKey);

const supabaseUrl = isValidHttpUrl(rawUrl) ? rawUrl : FALLBACK_SUPABASE_URL;
const supabaseAnonKey = rawAnonKey || FALLBACK_SUPABASE_ANON_KEY;

if (!rawUrl || !rawAnonKey) {
  console.warn('⚠️ Supabase environment variables are not set. Using mock data mode.');
} else if (supabaseUrl === FALLBACK_SUPABASE_URL) {
  console.warn(`⚠️ NEXT_PUBLIC_SUPABASE_URL "${rawUrl}" is not a valid URL. Using mock data mode.`);
}

// Create Supabase client for public/authenticated users (respects RLS)
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Create Supabase admin client for server-side operations (bypasses RLS)
// This should ONLY be used in API routes, never in client components
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl || FALLBACK_SUPABASE_URL, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase; // Fallback to regular client if service key not available

// Type definitions for database tables
export type Database = {
  authors: Author;
  categories: Category;
  tags: Tag;
  policies: Policy;
  articles: Article;
  rss_feeds: RSSFeed;
  rss_items: RSSItem;
  videos: Video;
  thoughts: Thought;
  comments: Comment;
  newsletter_subscribers: NewsletterSubscriber;
};

export interface Author {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  title?: string;
  bio?: string;
  organization?: string;
  social_twitter?: string;
  social_linkedin?: string;
  social_website?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  color?: string;
  icon?: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Policy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  status: 'draft' | 'adopted' | 'in_force' | 'repealed';
  category: string;
  region: string;
  country: string;
  jurisdiction_level?: string;
  policy_date?: string;
  effective_date?: string;
  source_url?: string;
  official_document_url?: string;
  views_count: number;
  comments_count: number;
  bookmarks_count: number;
  meta_description?: string;
  meta_keywords?: string[];
  published_at?: string;
  is_featured: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  excerpt?: string;
  author_id?: string;
  author?: Author; // Joined data
  featured_image_url?: string;
  featured_image_alt?: string;
  category_id?: string;
  category?: Category; // Joined data
  read_time_minutes?: number;
  word_count?: number;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  meta_description?: string;
  meta_keywords?: string[];
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  is_featured: boolean;
  is_pinned: boolean;
  wordpress_id?: number;
  wordpress_url?: string;
  created_at: string;
  updated_at: string;
}

export interface RSSFeed {
  id: string;
  name: string;
  feed_url: string;
  site_url?: string;
  description?: string;
  freshrss_feed_id?: string;
  is_active: boolean;
  display_in_feed: boolean;
  category_id?: string;
  category?: Category;
  last_fetched_at?: string;
  last_build_date?: string;
  created_at: string;
  updated_at: string;
}

export interface RSSItem {
  id: string;
  feed_id: string;
  feed?: RSSFeed; // Joined data
  title: string;
  link: string;
  description?: string;
  content?: string;
  guid?: string;
  author?: string;
  published_at?: string;
  is_read: boolean;
  is_starred: boolean;
  views_count: number;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string;
  video_url: string;
  video_provider?: string;
  video_id?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  author_id?: string;
  author?: Author;
  category_id?: string;
  category?: Category;
  views_count: number;
  likes_count: number;
  comments_count: number;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Thought {
  id: string;
  author_id: string;
  author?: Author;
  content: string;
  image_url?: string;
  likes_count: number;
  replies_count: number;
  is_approved: boolean;
  is_pinned: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  commentable_type: 'article' | 'policy' | 'video';
  commentable_id: string;
  author_id: string;
  author?: Author;
  content: string;
  parent_id?: string;
  likes_count: number;
  is_approved: boolean;
  is_flagged: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  is_active: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  topics?: string[];
  is_verified: boolean;
  verification_token?: string;
  verification_sent_at?: string;
  verified_at?: string;
  unsubscribe_token?: string;
  unsubscribed_at?: string;
  created_at: string;
  updated_at: string;
}

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  // We intentionally check the *raw* environment variables here.
  //
  // Why this matters:
  // - `supabaseUrl` and `supabaseAnonKey` can contain placeholder fallback values
  // - placeholder values are useful for avoiding crashes during imports
  // - placeholder values should NOT be treated as "real configuration"
  //
  // In other words, "client can be constructed" is not the same thing as
  // "the application is actually configured to talk to a real Supabase project."
  return hasValidPublicSupabaseConfig;
};
