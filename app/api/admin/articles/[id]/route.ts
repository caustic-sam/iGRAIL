import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { requireAdminRouteAccess } from '@/lib/route-guards';

type ArticleStatus = 'draft' | 'scheduled' | 'published';

interface ArticleUpdatePayload {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  featured_image_url?: string;
  seo_title?: string;
  seo_description?: string;
  status: ArticleStatus;
  scheduled_for?: string;
  published_at?: string | null;
}

interface SupabaseErrorDetails {
  message: string;
  code?: string;
  details?: unknown;
  hint?: unknown;
}

function extractSupabaseError(error: unknown): SupabaseErrorDetails | null {
  if (error && typeof error === 'object' && 'message' in error) {
    const err = error as { message: string; code?: string | number; details?: unknown; hint?: unknown };
    return {
      message: err.message,
      code: err.code ? String(err.code) : undefined,
      details: err.details,
      hint: err.hint,
    };
  }
  return null;
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: Fetch single article by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    void request;
    const { id } = await params;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    // This is the critical security boundary for the route.
    // We must authenticate the caller *before* using the service-role client.
    const adminContext = await requireAdminRouteAccess();
    if (adminContext instanceof NextResponse) {
      return adminContext;
    }

    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Supabase error while fetching article "${id}":`, error);
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      article: data,
      source: 'supabase',
    });
  } catch (error) {
    console.error('Unexpected error while fetching an admin article:', error);

    const supabaseError = extractSupabaseError(error);
    const fallbackMessage = error instanceof Error ? error.message : 'Failed to fetch article';

    return NextResponse.json(
      {
        error: supabaseError?.message ?? fallbackMessage,
        details: supabaseError ?? undefined,
      },
      { status: 500 }
    );
  }
}

// PUT: Update existing article
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = (await request.json()) as ArticleUpdatePayload;

    // Service-role queries bypass RLS, so this guard must come before the update.
    const adminContext = await requireAdminRouteAccess();
    if (adminContext instanceof NextResponse) {
      return adminContext;
    }

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 }
      );
    }

    // Calculate read time
    const wordsPerMinute = 200;
    const wordCount = body.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        article: {
          id,
          ...body,
          read_time: readTime,
          updated_at: new Date().toISOString(),
        },
        source: 'mock',
        message: 'Article updated successfully (mock mode)',
      });
    }

    // Update in Supabase - using base schema column names
    const articleData: Record<string, unknown> = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      summary: body.excerpt || body.content.substring(0, 200) + '...',
      status: body.status === 'scheduled' ? 'draft' : body.status || 'draft',
      featured_image_url: body.featured_image_url || null,
      published_at: body.published_at || null,
      read_time_minutes: readTime,
      word_count: wordCount,
      meta_description: body.seo_description || body.excerpt || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('articles')
      .update(articleData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Supabase error while updating article "${id}":`, error);
      throw error;
    }

    return NextResponse.json({
      article: data,
      source: 'supabase',
      message: 'Article updated successfully',
    });
  } catch (error) {
    console.error('Unexpected error while updating an admin article:', error);

    const supabaseError = extractSupabaseError(error);
    const fallbackMessage = error instanceof Error ? error.message : 'Failed to update article';

    return NextResponse.json(
      {
        error: supabaseError?.message ?? fallbackMessage,
        details: supabaseError ?? undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete article by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    void request;
    const { id } = await params;

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'Article deleted successfully (mock mode)',
        source: 'mock',
      });
    }

    // Deletion is the highest-risk path, so we keep the permission check explicit.
    const adminContext = await requireAdminRouteAccess();
    if (adminContext instanceof NextResponse) {
      return adminContext;
    }

    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Supabase error while deleting article "${id}":`, error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
      source: 'supabase',
    });
  } catch (error) {
    console.error('Unexpected error while deleting an admin article:', error);

    const supabaseError = extractSupabaseError(error);
    const fallbackMessage = error instanceof Error ? error.message : 'Failed to delete article';

    return NextResponse.json(
      {
        error: supabaseError?.message ?? fallbackMessage,
        details: supabaseError ?? undefined,
      },
      { status: 500 }
    );
  }
}
