import { NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { getSupabaseServer } from '@/lib/supabase/server';
import type { UserProfile } from '@/lib/auth/types';

type AdminProfile = Pick<UserProfile, 'id' | 'email' | 'role'>;

export interface AdminRouteContext {
  supabase: Awaited<ReturnType<typeof getSupabaseServer>>;
  user: User;
  profile: AdminProfile;
}

/**
 * Route handlers do not automatically know who the current user is.
 *
 * For junior developers:
 * - `proxy.ts` protects page navigation like `/admin`
 * - API routes such as `/api/admin/*` still need their own checks
 * - using the service-role client without a guard would bypass RLS entirely
 *
 * This helper centralizes that check so each admin route follows the same flow.
 */
export async function requireAdminRouteAccess(): Promise<AdminRouteContext | NextResponse> {
  const supabase = await getSupabaseServer();

  // Step 1: read the session that belongs to the incoming request cookies.
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('❌ Unable to read session for admin route:', sessionError);
    return NextResponse.json(
      { error: 'Unable to verify the current session.' },
      { status: 401 }
    );
  }

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized - Please sign in.' },
      { status: 401 }
    );
  }

  // Step 2: load the application profile that stores the user's role.
  // Supabase Auth knows the identity; our own table knows the permissions.
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, email, role')
    .eq('id', session.user.id)
    .single();

  if (profileError) {
    console.error('❌ Unable to load user profile for admin route:', profileError);
    return NextResponse.json(
      { error: 'User profile could not be loaded.' },
      { status: 403 }
    );
  }

  if (!profile) {
    return NextResponse.json(
      { error: 'User profile not found.' },
      { status: 403 }
    );
  }

  // Step 3: enforce the role boundary before any service-role query runs.
  if (profile.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - Admin access is required.' },
      { status: 403 }
    );
  }

  return {
    supabase,
    user: session.user,
    profile,
  };
}

/**
 * These routes exist only to help debug integrations during development.
 *
 * Returning a 404 in production is deliberate:
 * - it keeps the route from advertising itself
 * - it avoids leaking environment details or session information
 * - it makes the production surface area smaller and easier to reason about
 */
export function blockProductionDiagnostics(routeName: string): NextResponse | null {
  void routeName;
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return null;
}
