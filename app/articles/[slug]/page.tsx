'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Clock, Calendar } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  published_at: string;
  created_at: string;
  read_time_minutes?: number;
  word_count?: number;
  featured_image_url?: string;
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/articles/${slug}`);
        const data = await response.json();

        if (response.ok) {
          setArticle(data.article);
        } else {
          setError(data.error || 'Article not found');
        }
      } catch (err) {
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600">{error || 'This article does not exist or has been removed.'}</p>
          <Link href="/articles" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            View all articles
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          {article.featured_image_url && (
            <Image
              src={article.featured_image_url}
              alt={article.title}
              width={1200}
              height={384}
              className="w-full h-96 object-cover rounded-lg mb-8"
              unoptimized
            />
          )}

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(article.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>

            {article.read_time_minutes && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.read_time_minutes} min read
              </div>
            )}

            {article.word_count && (
              <div>{article.word_count.toLocaleString()} words</div>
            )}
          </div>
        </header>

        {/* Content */}
        <Card className="p-8">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
          />
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a
            href="/blog"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to articles
          </a>
        </div>
      </article>
    </div>
  );
}
