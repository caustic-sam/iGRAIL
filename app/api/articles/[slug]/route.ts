import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockArticles } from '@/lib/mockData';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: Fetch a single article by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      const article = mockArticles.find(a => a.slug === slug);

      if (!article) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        article,
        source: 'mock',
      });
    }

    // Fetch article from Supabase
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      article: data,
      source: 'supabase',
    });
  } catch (error) {
    console.error(`Unexpected error while fetching article "${slug}":`, error);

    // Try mock data as fallback
    const article = mockArticles.find(a => a.slug === slug);

    if (article) {
      return NextResponse.json({
        article,
        source: 'mock-fallback',
      });
    }

    return NextResponse.json(
      { error: 'Article not found' },
      { status: 404 }
    );
  }
}
