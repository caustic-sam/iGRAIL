// IG-25: Dev-only rendering test — 404 in production.
import { notFound } from 'next/navigation';

export default function TestPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">✅ Rendering Test</h1>
        <p className="text-gray-700 mb-4">If you can see this page with styling, React is working!</p>

        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <strong>Tailwind CSS:</strong> Working ✓
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <strong>Next.js:</strong> Working ✓
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded">
            <strong>TypeScript:</strong> Working ✓
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <a
            href="/admin/articles/new"
            className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Article Editor →
          </a>
        </div>
      </div>
    </div>
  );
}
