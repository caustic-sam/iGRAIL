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
  is_featured: boolean;
  author?: {
    name?: string | null;
  } | null;
  featured_image_url: string | null;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    async function fetchArticles() {
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
    fetchArticles();
  }, []);

  const categories = React.useMemo(() => {
    const cats = new Set<string>();
    articles.forEach((a) => {
      if (a.category) cats.add(a.category);
    });
    return ['All', ...Array.from(cats).sort()];
  }, [articles]);

  const filteredArticles = React.useMemo(() => {
    if (activeCategory === 'All') return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

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
    const plainText = article.content.replace(/<[^>]*>/g, '');
    return plainText.substring(0, 150) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="The Observatory"
        subtitle="Deep dives, digests, and expert analysis on AI governance, data protection, and digital identity policy."
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Tabs */}
        {categories.length > 1 && (
          <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {activeCategory === 'All' ? 'No Articles Yet' : `No ${activeCategory} articles`}
            </h2>
            <p className="text-gray-600">
              {activeCategory === 'All'
                ? "We're working on bringing you insightful content. Check back soon!"
                : 'Try selecting a different category above.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <Card hover className="h-full flex flex-col overflow-hidden">
                  {article.featured_image_url ? (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={article.featured_image_url}
                        alt={article.title}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center">
                      <TrendingUp className="w-16 h-16 text-blue-100 opacity-50" />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
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

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {getExcerpt(article)}
                    </p>

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

        {filteredArticles.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
