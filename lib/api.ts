/**
 * iGRAIL API Layer
 *
 * This module provides a unified API for fetching content from Supabase.
 * All functions automatically fall back to mock data if Supabase is not configured.
 *
 * @module lib/api
 * @author iGRAIL Team
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { mockArticles, mockPolicies, mockVideos, mockThoughts } from './mockData';

// Re-export types for external use
export type { Article, Policy, Video, Thought, RSSItem, Author } from './supabase';

// =====================================================
// POLICIES
// =====================================================

/**
 * Fetch policies with optional filtering
 *
 * @param options - Query options
 * @param options.limit - Maximum number of results (default: 10)
 * @param options.status - Filter by policy status
 * @param options.region - Filter by region
 * @param options.offset - Pagination offset (default: 0)
 * @returns Promise with policies data, count, and error
 *
 * @example
 * const { data, count, error } = await getPolicies({
 *   limit: 20,
 *   status: 'in_force',
 *   region: 'EU'
 * });
 */
export async function getPolicies(options: {
  limit?: number;
  status?: string;
  region?: string;
  offset?: number;
} = {}) {
  const { limit = 10, status, region, offset = 0 } = options;

  if (!isSupabaseConfigured()) {
    console.log('📋 Using mock policy data');
    return {
      data: mockPolicies.slice(offset, offset + limit),
      count: mockPolicies.length,
      error: null,
    };
  }

  let query = supabase
    .from('policies')
    .select('*', { count: 'exact' })
    .eq('is_archived', false)
    .order('published_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  if (region) {
    query = query.eq('region', region);
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  return { data, count, error };
}

/**
 * Fetch a single policy by its slug
 *
 * @param slug - URL-friendly policy identifier
 * @returns Promise with policy data and error
 *
 * @example
 * const { data, error } = await getPolicyBySlug('eu-ai-act');
 */
export async function getPolicyBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    const policy = mockPolicies.find((p) => p.title.toLowerCase().replace(/\s+/g, '-') === slug);
    return { data: policy || null, error: null };
  }

  const { data, error } = await supabase
    .from('policies')
    .select('*')
    .eq('slug', slug)
    .single();

  return { data, error };
}

// =====================================================
// ARTICLES
// =====================================================

/**
 * Fetch articles with optional filtering and author/category data
 *
 * @param options - Query options
 * @param options.limit - Maximum number of results (default: 10)
 * @param options.status - Filter by status: 'draft', 'published', or 'archived' (default: 'published')
 * @param options.category_id - Filter by category UUID
 * @param options.offset - Pagination offset (default: 0)
 * @param options.featured - Filter by featured status
 * @returns Promise with articles data (including author and category), count, and error
 *
 * @example
 * const { data, count, error } = await getArticles({
 *   limit: 10,
 *   status: 'published',
 *   featured: true
 * });
 */
export async function getArticles(options: {
  limit?: number;
  status?: 'draft' | 'published' | 'archived';
  category_id?: string;
  offset?: number;
  featured?: boolean;
} = {}) {
  const { limit = 10, status = 'published', category_id, offset = 0, featured } = options;

  if (!isSupabaseConfigured()) {
    console.log('📰 Using mock article data');
    return {
      data: mockArticles.slice(offset, offset + limit),
      count: mockArticles.length,
      error: null,
    };
  }

  let query = supabase
    .from('articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*)
    `, { count: 'exact' })
    .eq('status', status)
    .order('published_at', { ascending: false });

  if (category_id) {
    query = query.eq('category_id', category_id);
  }

  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  return { data, count, error };
}

export async function getArticleBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    const article = mockArticles.find((a) => a.title.toLowerCase().replace(/\s+/g, '-') === slug);
    return { data: article || null, error: null };
  }

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  return { data, error };
}

// =====================================================
// VIDEOS
// =====================================================

export async function getVideos(options: {
  limit?: number;
  status?: 'draft' | 'published' | 'archived';
  category_id?: string;
  offset?: number;
} = {}) {
  const { limit = 10, status = 'published', category_id, offset = 0 } = options;

  if (!isSupabaseConfigured()) {
    console.log('🎥 Using mock video data');
    return {
      data: mockVideos.slice(offset, offset + limit),
      count: mockVideos.length,
      error: null,
    };
  }

  let query = supabase
    .from('videos')
    .select(`
      *,
      author:authors(*),
      category:categories(*)
    `, { count: 'exact' })
    .eq('status', status)
    .order('published_at', { ascending: false });

  if (category_id) {
    query = query.eq('category_id', category_id);
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  return { data, count, error };
}

export async function getVideoBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    const video = mockVideos.find((v) => v.title.toLowerCase().replace(/\s+/g, '-') === slug);
    return { data: video || null, error: null };
  }

  const { data, error } = await supabase
    .from('videos')
    .select(`
      *,
      author:authors(*),
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  return { data, error };
}

// =====================================================
// THOUGHTS (Policy Pulse)
// =====================================================

export async function getThoughts(options: {
  limit?: number;
  offset?: number;
} = {}) {
  const { limit = 20, offset = 0 } = options;

  if (!isSupabaseConfigured()) {
    console.log('💭 Using mock thought data');
    return {
      data: mockThoughts.slice(offset, offset + limit),
      count: mockThoughts.length,
      error: null,
    };
  }

  const { data, count, error } = await supabase
    .from('thoughts')
    .select(`
      *,
      author:authors(*)
    `, { count: 'exact' })
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, count, error };
}

// =====================================================
// RSS ITEMS (FreshRSS Integration)
// =====================================================

export async function getRSSItems(options: {
  limit?: number;
  feed_id?: string;
  offset?: number;
} = {}) {
  const { limit = 20, feed_id, offset = 0 } = options;

  if (!isSupabaseConfigured()) {
    console.log('📡 Supabase not configured for RSS items');
    return {
      data: [],
      count: 0,
      error: null,
    };
  }

  let query = supabase
    .from('rss_items')
    .select(`
      *,
      feed:rss_feeds(*)
    `, { count: 'exact' })
    .order('published_at', { ascending: false });

  if (feed_id) {
    query = query.eq('feed_id', feed_id);
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  return { data, count, error };
}

export async function getRSSFeeds(options: {
  active_only?: boolean;
} = {}) {
  const { active_only = true } = options;

  if (!isSupabaseConfigured()) {
    console.log('📡 Supabase not configured for RSS feeds');
    return {
      data: [],
      error: null,
    };
  }

  let query = supabase
    .from('rss_feeds')
    .select('*')
    .order('name');

  if (active_only) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;

  return { data, error };
}

// =====================================================
// AUTHORS
// =====================================================

export async function getAuthors(options: {
  limit?: number;
  offset?: number;
} = {}) {
  const { limit = 50, offset = 0 } = options;

  if (!isSupabaseConfigured()) {
    console.log('👤 Supabase not configured for authors');
    return {
      data: [],
      count: 0,
      error: null,
    };
  }

  const { data, count, error } = await supabase
    .from('authors')
    .select('*', { count: 'exact' })
    .order('name')
    .range(offset, offset + limit - 1);

  return { data, count, error };
}

export async function getAuthorById(id: string) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

// =====================================================
// NEWSLETTER
// =====================================================

export async function subscribeToNewsletter(email: string, name?: string) {
  if (!isSupabaseConfigured()) {
    console.log('📧 Supabase not configured for newsletter');
    return {
      data: null,
      error: { message: 'Database not configured' },
    };
  }

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert({
      email,
      name,
      is_verified: false,
      verification_token: generateToken(),
    })
    .select()
    .single();

  return { data, error };
}

// =====================================================
// SEARCH
// =====================================================

export async function searchContent(query: string, options: {
  types?: ('article' | 'policy' | 'video')[];
  limit?: number;
} = {}) {
  const { types = ['article', 'policy', 'video'], limit = 20 } = options;

  if (!isSupabaseConfigured()) {
    console.log('🔍 Using mock data for search');
    const results = [];

    if (types.includes('article')) {
      results.push(...mockArticles.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.summary.toLowerCase().includes(query.toLowerCase())
      ));
    }

    if (types.includes('policy')) {
      results.push(...mockPolicies.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.summary.toLowerCase().includes(query.toLowerCase())
      ));
    }

    return {
      data: results.slice(0, limit),
      error: null,
    };
  }

  // Full-text search using Postgres
  const results = [];

  if (types.includes('article')) {
    const { data } = await supabase
      .from('articles')
      .select('*, author:authors(*)')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
      .eq('status', 'published')
      .limit(limit);

    if (data) results.push(...data.map(d => ({ ...d, type: 'article' })));
  }

  if (types.includes('policy')) {
    const { data } = await supabase
      .from('policies')
      .select('*')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(limit);

    if (data) results.push(...data.map(d => ({ ...d, type: 'policy' })));
  }

  if (types.includes('video')) {
    const { data } = await supabase
      .from('videos')
      .select('*, author:authors(*)')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('status', 'published')
      .limit(limit);

    if (data) results.push(...data.map(d => ({ ...d, type: 'video' })));
  }

  return {
    data: results.slice(0, limit),
    error: null,
  };
}

// =====================================================
// UTILITIES
// =====================================================

function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Increment view count
export async function incrementViewCount(
  table: 'articles' | 'policies' | 'videos',
  id: string
) {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  const { error } = await supabase.rpc('increment_views', {
    table_name: table,
    row_id: id,
  });

  return { error };
}
