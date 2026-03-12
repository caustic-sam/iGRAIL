import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface QuickPostPayload {
  content: string;
  media_url?: string;
  author_id?: string; // Optional - can be derived from token or default user
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validate authentication token
    const token = request.headers.get('x-quick-post-token') ||
                  request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token required' },
        { status: 401 }
      );
    }

    if (token !== process.env.QUICK_POST_SECRET) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body: QuickPostPayload = await request.json();

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // 3. Extract hashtags from content
    const hashtagMatches = body.content.match(/#[\w]+/g);
    const hashtags = hashtagMatches ? hashtagMatches.map(tag => tag.substring(1)) : [];

    // 4. Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // 5. Get author_id (use provided or default to first admin user)
    let authorId = body.author_id;

    if (!authorId) {
      // Get the first admin/publisher user as default author
      const { data: defaultAuthor } = await supabase
        .from('user_profiles')
        .select('id')
        .or('role.eq.admin,role.eq.publisher')
        .limit(1)
        .single();

      if (defaultAuthor) {
        authorId = defaultAuthor.id;
      } else {
        return NextResponse.json(
          { error: 'No author found for post' },
          { status: 500 }
        );
      }
    }

    // 6. Insert quick post into database
    const { data: post, error } = await supabase
      .from('quick_posts')
      .insert({
        author_id: authorId,
        content: body.content.trim(),
        media_url: body.media_url || null,
        hashtags,
        source: 'drafts',
        status: 'draft', // Requires manual publish for review
      })
      .select()
      .single();

    if (error) {
      console.error('Database error while creating a quick post:', error);
      return NextResponse.json(
        { error: 'Failed to create post', details: error.message },
        { status: 500 }
      );
    }

    // 7. Return success response
    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        content: post.content,
        hashtags: post.hashtags,
        status: post.status,
        created_at: post.created_at,
      },
      message: 'Quick post created successfully! Review and publish in admin dashboard.',
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected quick post webhook error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to test webhook is working
export async function GET(request: NextRequest) {
  const token = request.headers.get('x-quick-post-token') ||
                request.nextUrl.searchParams.get('token');

  if (token !== process.env.QUICK_POST_SECRET) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/webhooks/quick-post',
    message: 'Quick Post webhook is ready',
    methods: ['POST'],
    authentication: 'Token-based (header: x-quick-post-token or query: ?token=XXX)',
  });
}
