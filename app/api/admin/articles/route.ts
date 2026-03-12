import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { requireAdminRouteAccess } from '@/lib/route-guards';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type ArticleStatus = 'draft' | 'scheduled' | 'published' | 'archived';

interface AdminArticleSummary {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  published_at: string | null;
  scheduled_for: string | null;
  created_at: string;
  updated_at: string;
  author_name: string;
  view_count: number;
  revision_count: number;
}

interface ArticleCreatePayload {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status?: ArticleStatus;
  featured_image_url?: string;
  published_at?: string | null;
  scheduled_for?: string | null;
  seo_description?: string;
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

function isArticleStatus(value: string): value is ArticleStatus {
  return ['draft', 'scheduled', 'published', 'archived'].includes(value);
}

// Mock data for development
const mockAdminArticles: AdminArticleSummary[] = [
  {
    id: '1',
    title: 'Getting Started with Digital Policy Analysis',
    slug: 'getting-started-digital-policy',
    status: 'published' as const,
    published_at: '2025-01-15T10:00:00Z',
    scheduled_for: null,
    created_at: '2025-01-10T09:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
    author_name: 'Admin',
    view_count: 1247,
    revision_count: 3,
  },
  {
    id: '2',
    title: 'Draft: AI Regulation Landscape 2025',
    slug: 'ai-regulation-landscape-2025',
    status: 'draft' as const,
    published_at: null,
    scheduled_for: null,
    created_at: '2025-10-30T14:30:00Z',
    updated_at: '2025-10-31T09:15:00Z',
    author_name: 'Admin',
    view_count: 0,
    revision_count: 7,
  },
  {
    id: '3',
    title: 'Understanding GDPR Compliance in 2025',
    slug: 'gdpr-compliance-2025',
    status: 'scheduled' as const,
    published_at: null,
    scheduled_for: '2025-11-05T08:00:00Z',
    created_at: '2025-10-28T11:00:00Z',
    updated_at: '2025-10-30T16:00:00Z',
    author_name: 'Admin',
    view_count: 0,
    revision_count: 2,
  },
  {
    id: '4',
    title: 'The Future of Data Privacy',
    slug: 'future-of-data-privacy',
    status: 'published' as const,
    published_at: '2025-10-20T12:00:00Z',
    scheduled_for: null,
    created_at: '2025-10-18T10:00:00Z',
    updated_at: '2025-10-20T12:00:00Z',
    author_name: 'Admin',
    view_count: 892,
    revision_count: 5,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get('status');
  const statusFilter = statusParam && isArticleStatus(statusParam) ? statusParam : null;

  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Filter mock data by status if provided
      let filtered = mockAdminArticles;
      if (statusFilter) {
        filtered = mockAdminArticles.filter(a => a.status === statusFilter);
      }

      return NextResponse.json({
        articles: filtered,
        source: 'mock',
        count: filtered.length,
      });
    }

    // Admin APIs must verify the caller before the service-role client is used.
    // Without this check, the route would bypass RLS for anyone who can reach it.
    const adminContext = await requireAdminRouteAccess();
    if (adminContext instanceof NextResponse) {
      return adminContext;
    }

    // Build Supabase query - select all needed columns
    // Use admin client to bypass RLS (we handle permissions in code above)
    let query = supabaseAdmin
      .from('articles')
      .select('id, title, slug, status, published_at, scheduled_for, created_at, updated_at, view_count, revision_count, author_id')
      .order('updated_at', { ascending: false});

    // Simplified for MVP - only admins have access to admin API
    // Apply status filter
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error while loading admin article list:', error);
      throw error;
    }

    // Map to expected format, adding defaults for missing fields
    const articles = (data || []).map(article => ({
      ...article,
      scheduled_for: article.scheduled_for || null,
      // This is a temporary placeholder until the list query joins author/profile
      // data directly. Keeping the fallback explicit is better than returning an
      // empty string and hiding the fact that the data model is incomplete.
      author_name: 'Admin',
      view_count: article.view_count || 0,
      revision_count: article.revision_count || 0,
    }));

    return NextResponse.json({
      articles,
      source: 'supabase',
      count: articles.length,
      role: adminContext.profile.role,
    });
  } catch (error) {
    console.error('Unexpected error while loading admin article list:', error);

    // Fallback to mock data
    let filtered = mockAdminArticles;
    if (statusFilter) {
      filtered = mockAdminArticles.filter(a => a.status === statusFilter);
    }

    return NextResponse.json({
      articles: filtered,
      source: 'mock',
      count: filtered.length,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// POST: Create new article
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ArticleCreatePayload;

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

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Simulate successful save
      const mockId = Math.random().toString(36).substring(2, 11);
      const mockArticle = {
        id: mockId,
        ...body,
        read_time: readTime,
        view_count: 0,
        revision_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_name: 'Admin',
      };

      return NextResponse.json({
        article: mockArticle,
        source: 'mock',
        message: 'Article saved successfully (mock mode)',
      });
    }

    // We repeat the admin check inside POST because API routes are callable directly.
    // Never assume the UI is the only entry point.
    const adminContext = await requireAdminRouteAccess();
    if (adminContext instanceof NextResponse) {
      return adminContext;
    }

    // Get requested status, default to draft
    const requestedStatus = body.status || 'draft';

    // Insert into Supabase - using base schema column names
    // Base schema uses: summary (not excerpt), read_time_minutes (not read_time)
    const articleData: Record<string, unknown> = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      summary: body.excerpt || body.content.substring(0, 200) + '...', // Base schema requires summary
      excerpt: body.excerpt || body.content.substring(0, 200) + '...', // Also save to excerpt
      status: requestedStatus,
      author_id: adminContext.user.id, // Set the authenticated admin as the author
      featured_image_url: body.featured_image_url || null,
      published_at: body.published_at || null,
      scheduled_for: body.scheduled_for || null, // Save scheduled date
      read_time_minutes: readTime,
      word_count: wordCount,
      meta_description: body.seo_description || body.excerpt || null,
    };

    // Use admin client to bypass RLS policies for insert
    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert([articleData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error while creating an article:', error);
      throw error;
    }

    return NextResponse.json({
      article: data,
      source: 'supabase',
      message: 'Article saved successfully',
    });
  } catch (error) {
    console.error('Unexpected error while creating an article:', error);

    const supabaseError = extractSupabaseError(error);
    const fallbackMessage = error instanceof Error ? error.message : 'Failed to create article';

    return NextResponse.json(
      {
        error: supabaseError?.message ?? fallbackMessage,
        details: supabaseError ?? undefined,
      },
      { status: 500 }
    );
  }
}
