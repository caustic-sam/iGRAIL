// app/auth-test/page.tsx — dev-only auth test page
// IG-25: Returns 404 in production so the route is invisible to public users.
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AuthTestPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth Status Test</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Client-only Auth Test</h2>
        <p className="text-sm text-blue-800 mb-4">
          This route does not call <code>useAuth()</code> during prerender. To test authentication,
          use the login flow and protected pages wrapped by your <code>AuthProvider</code>.
        </p>
        <a
          href="/login?redirectTo=/admin"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login →
        </a>
      </div>
    </div>
  );
}