// IG-25: Gate this page in production — it exposes session tokens, cookies,
// and user profile data. notFound() renders 404 and leaks nothing.
import { notFound } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function AuthDebugPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const supabase = await getSupabaseServer();
  const { data: { session }, error } = await supabase.auth.getSession();

  let profile = null;
  if (session?.user) {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    profile = data;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Auth Debug Info</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <div className="space-y-2">
            <p><strong>Has Session:</strong> {session ? '✅ Yes' : '❌ No'}</p>
            {session && (
              <>
                <p><strong>User ID:</strong> {session.user.id}</p>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Provider:</strong> {session.user.app_metadata.provider}</p>
              </>
            )}
            {error && (
              <p className="text-red-600"><strong>Error:</strong> {error.message}</p>
            )}
          </div>
        </div>

        {profile && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Profile</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Cookies</h2>
          <div className="space-y-2">
            <p><strong>Total Cookies:</strong> {allCookies.length}</p>
            <p><strong>Supabase Auth Cookies:</strong></p>
            <ul className="list-disc list-inside ml-4">
              {allCookies
                .filter(c => c.name.includes('auth') || c.name.includes('supabase'))
                .map(c => (
                  <li key={c.name}>
                    {c.name}: {c.value.substring(0, 50)}...
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">All Cookies (Names)</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {allCookies.map(c => c.name).join('\n')}
          </pre>
        </div>
      </div>
    </div>
  );
}
