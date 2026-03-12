import { redirect } from 'next/navigation';
import { getSupabaseServer } from '../../lib/supabase/server';
import { Shield, Lock, Globe, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  // In Next.js 16 App Router, `searchParams` is delivered as a Promise.
  // We type it explicitly and await it so the page matches the framework's
  // generated `PageProps` contract during production builds.
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (session) redirect('/');

  // We resolve the query parameters once and keep them in a named variable so
  // the rest of the page logic reads like normal application code.
  const resolvedSearchParams = await searchParams;
  const returnTo = resolvedSearchParams.redirectTo || '/admin';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-6xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">iGRAIL</h1>
                <p className="text-sm text-gray-600">Global Policy Intelligence</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to iGRAIL
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your comprehensive platform for AI policy analysis, regulatory tracking, and expert insights.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Real-time Policy Updates</h3>
                  <p className="text-sm text-gray-600">Track regulatory changes across 14 global jurisdictions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#8b7fa8]" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Expert Analysis</h3>
                  <p className="text-sm text-gray-600">In-depth commentary from policy professionals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-[#c17a58]" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Secure Access</h3>
                  <p className="text-sm text-gray-600">Enterprise-grade security for your data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h3>
              <p className="text-gray-600">
                Access your dashboard and start monitoring global AI policy developments
              </p>
            </div>

            <div className="space-y-4">
              <a
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg font-medium w-full"
                // We pass only the final in-app destination here.
                // The route handler can see the real request host, so it is the
                // safest place to assemble the absolute OAuth callback URL.
                href={`/api/auth/oauth?provider=github&redirectTo=${encodeURIComponent(returnTo)}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Sign in with GitHub
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
