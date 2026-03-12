import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../lib/supabase/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const provider = url.searchParams.get('provider') as 'github' | 'google' | null;
  const requestedRedirect = url.searchParams.get('redirectTo');

  // OAuth providers must redirect back to a full absolute URL.
  // We intentionally build that URL from the current request origin so local,
  // preview, and production environments all behave the same way.
  const callbackUrl = new URL('/auth/callback', url.origin);

  // Only allow app-internal redirect targets. This prevents open redirects and
  // keeps the callback route logic simple for future maintainers.
  if (requestedRedirect?.startsWith('/')) {
    callbackUrl.searchParams.set('redirectTo', requestedRedirect);
  }

  if (!provider) return NextResponse.redirect(new URL('/login', url));

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: callbackUrl.toString() }
  });
  if (error || !data?.url) return NextResponse.redirect(new URL('/login?err=oauth', url));
  return NextResponse.redirect(data.url);
}
