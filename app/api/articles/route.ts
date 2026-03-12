import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockArticles } from '@/lib/mockData';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: Fetch published articles for public display
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const featured = searchParams.get('featured') === 'true';

  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        articles: mockArticles.slice(0, limit),
        source: 'mock',
        count: mockArticles.length,
      });
    }

    // Build query for published articles
    let query = supabase
      .from('articles')
      .select('id, title, slug, summary, content, published_at, created_at, read_time_minutes, word_count, featured_image_url, featured_image_alt, is_featured, category, author:authors!articles_author_id_fkey(name, avatar_url)')
      .eq('status', 'published')
      .not('published_at', 'is', null);

    // Filter by featured if requested
    if (featured) {
      query = query.eq('is_featured', true);
    }

    // Execute query
    const { data, error } = await query
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase error while fetching published articles:', error);
      throw error;
    }

    return NextResponse.json({
      articles: data || [],
      source: 'supabase',
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Unexpected error while fetching published articles:', error);

    // Fallback to mock data
    return NextResponse.json({
      articles: mockArticles.slice(0, limit),
      source: 'mock',
      count: mockArticles.length,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
