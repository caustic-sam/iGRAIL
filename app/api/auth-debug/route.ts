import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { blockProductionDiagnostics } from '@/lib/route-guards';

export async function GET() {
  try {
    const blockedResponse = blockProductionDiagnostics('/api/auth-debug');
    if (blockedResponse) {
      return blockedResponse;
    }

    // We use the same server helper as the rest of the app so the auth flow is
    // consistent across route handlers.
    const supabase = await getSupabaseServer();

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return NextResponse.json({
        authenticated: false,
        error: sessionError.message,
        sessionError: sessionError,
      });
    }

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        message: 'No active session',
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return NextResponse.json({
      authenticated: true,
      session: {
        user: {
          id: session.user.id,
          email: session.user.email,
        },
        expires_at: session.expires_at,
      },
      profile: profile,
      profileError: profileError?.message,
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
