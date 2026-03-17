import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockArticles } from '@/lib/mockData';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: Fetch published articles for public display
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const featured = searchParams.get('featured') === 'true';
  const category = searchParams.get('category');

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      articles: mockArticles.slice(0, limit),
      source: 'mock',
      count: mockArticles.length,
    });
  }

  // Try with author join first, fall back to plain query if the join fails
  for (const selectClause of [
    'id, title, slug, summary, content, published_at, created_at, read_time_minutes, word_count, featured_image_url, featured_image_alt, is_featured, category, author:authors!articles_author_id_fkey(name, avatar_url)',
    'id, title, slug, summary, content, published_at, created_at, read_time_minutes, word_count, featured_image_url, featured_image_alt, is_featured, category',
  ]) {
    let query = supabase
      .from('articles')
      .select(selectClause)
      .eq('status', 'published')
      .not('published_at', 'is', null);

    if (featured) {
      query = query.eq('is_featured', true);
    }
    if (category) {
      query = query.ilike('category', category);
    }

    const { data, error } = await query
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase articles query failed:', JSON.stringify(error));
      continue; // try next select clause
    }

    return NextResponse.json({
      articles: data || [],
      source: 'supabase',
      count: data?.length || 0,
    });
  }

  // Both queries failed — fall back to mock
  console.error('All Supabase article queries failed, returning mock data');
  return NextResponse.json({
    articles: mockArticles.slice(0, limit),
    source: 'mock',
    count: mockArticles.length,
  });
}
