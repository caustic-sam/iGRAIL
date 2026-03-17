'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, ArrowRight, TrendingUp, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHero } from '@/components/PageHero';

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  published_at: string | null;
  created_at: string;
  read_time_minutes: number | null;
  category: string | null;
  author?: {
    name?: string | null;
  } | null;
  featured_image_url: string | null;
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublishedArticles() {
      try {
        const response = await fetch('/api/articles?limit=50');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPublishedArticles();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getExcerpt = (article: Article) => {
    if (article.summary) return article.summary;
    if (!article.content) return 'No content available...';
    // Fallback: extract first 150 characters from content
    const plainText = article.content.replace(/<[^>]*>/g, '');
    return plainText.substring(0, 150) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Think Tank"
        subtitle="In-depth analysis and expert commentary on digital policy, governance, and data protection."
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Articles Yet</h2>
            <p className="text-gray-600">
              We&apos;re working on bringing you insightful content. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <Card hover className="h-full flex flex-col overflow-hidden">
                  {/* Featured Image */}
                  {article.featured_image_url ? (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={article.featured_image_url}
                        alt={article.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        priority={false}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center">
                      <TrendingUp className="w-16 h-16 text-blue-100 opacity-50" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{article.author?.name || 'iGRAIL Editorial'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                      {article.category && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {article.category}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {getExcerpt(article)}
                    </p>
                    {/* Read More */}
                    <div className="flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination (if needed in the future) */}
        {articles.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Showing {articles.length} article{articles.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Informed</h2>
          <p className="text-xl text-blue-100 mb-8">
            Weekly insights on global AI governance — direct from The Observatory.
          </p>
          <a
            href="mailto:editorial@igrail.com"
            className="inline-block px-8 py-3 bg-white text-[#1e3a5f] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            editorial@igrail.com
          </a>
        </div>
      </div>
    </div>
  );
}
