'use client';

import { useCallback, useEffect, useState } from 'react';
import { FileText, BarChart3, Network, Rss, RefreshCw, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHero } from '@/components/PageHero';

interface FeedItem {
  id: string;
  title: string;
  link: string;
  description: string;
  author?: string;
  publishedAt: Date | null;
  feedName: string;
  feedUrl: string;
  category: 'policy' | 'research' | 'news' | 'analysis';
}

interface CategoryData {
  category: 'policy' | 'research' | 'news' | 'analysis';
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  items: FeedItem[];
  loading: boolean;
  count: number;
}

const INITIAL_CATEGORIES: CategoryData[] = [
  {
    category: 'policy',
    title: 'Policy & Regulation',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    items: [],
    loading: true,
    count: 0,
  },
  {
    category: 'research',
    title: 'Research & Studies',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    items: [],
    loading: true,
    count: 0,
  },
  {
    category: 'analysis',
    title: 'Expert Analysis',
    icon: <Network className="w-5 h-5" />,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    items: [],
    loading: true,
    count: 0,
  },
  {
    category: 'news',
    title: 'Industry News',
    icon: <Rss className="w-5 h-5" />,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    items: [],
    loading: true,
    count: 0,
  },
];

function formatRelativeTime(date: Date | null): string {
  if (!date) return '';

  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export default function PolicyPulsePage() {
  const [categories, setCategories] = useState<CategoryData[]>(INITIAL_CATEGORIES);

  const [globalRefreshing, setGlobalRefreshing] = useState(false);

  // We memoize the fetch helper because other callbacks and effects depend on it.
  // Stable function identity keeps the dependency graph honest and predictable.
  const fetchCategoryData = useCallback(async (category: string) => {
    try {
      const response = await fetch(`/api/feeds?category=${category}&count=20`);
      const data = await response.json();
      return {
        items: data.data || [],
        count: data.count || 0,
      };
    } catch (error) {
      console.error(`Error fetching ${category}:`, error);
      return { items: [], count: 0 };
    }
  }, []);

  // This helper converts a category definition list into fully loaded UI state.
  // Keeping it separate makes the initial load path and the refresh path share
  // the exact same behavior instead of drifting apart over time.
  const loadCategoriesFrom = useCallback(async (sourceCategories: CategoryData[]) => {
    const promises = sourceCategories.map(async (cat) => {
      const data = await fetchCategoryData(cat.category);
      return {
        ...cat,
        items: data.items,
        count: data.count,
        loading: false,
      };
    });

    return Promise.all(promises);
  }, [fetchCategoryData]);

  useEffect(() => {
    // The state update happens after the async work completes, not synchronously
    // during the effect setup. That keeps us aligned with the React lint rule.
    let isMounted = true;

    async function loadInitialCategories() {
      const updatedCategories = await loadCategoriesFrom(INITIAL_CATEGORIES);
      if (isMounted) {
        setCategories(updatedCategories);
      }
    }

    void loadInitialCategories();

    return () => {
      isMounted = false;
    };
  }, [loadCategoriesFrom]);

  const handleGlobalRefresh = async () => {
    setGlobalRefreshing(true);
    setCategories(prev => prev.map(cat => ({ ...cat, loading: true })));
    const refreshedCategories = await loadCategoriesFrom(INITIAL_CATEGORIES);
    setCategories(refreshedCategories);
    setGlobalRefreshing(false);
  };

  const handleCategoryRefresh = async (category: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.category === category ? { ...cat, loading: true } : cat
      )
    );

    const data = await fetchCategoryData(category);

    setCategories(prev =>
      prev.map(cat =>
        cat.category === category
          ? { ...cat, items: data.items, count: data.count, loading: false }
          : cat
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <PageHero
        title="Policy Pulse"
        subtitle="Real-time policy intelligence from global sources"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Global Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-600">
              Aggregated from {categories.reduce((sum, cat) => sum + cat.count, 0)} sources across {categories.length} categories
            </p>
          </div>
          <button
            type="button"
            onClick={handleGlobalRefresh}
            disabled={globalRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${globalRefreshing ? 'animate-spin' : ''}`} />
            Refresh All
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Card key={category.category} className={`${category.borderColor} border-2`}>
              <div className="p-6">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${category.bgColor} ${category.color} p-2 rounded-lg`}>
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{category.title}</h2>
                      <p className="text-xs text-gray-500">{category.count} items</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCategoryRefresh(category.category)}
                    disabled={category.loading}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                    aria-label={`Refresh ${category.title}`}
                  >
                    <RefreshCw
                      className={`w-4 h-4 text-gray-600 ${category.loading ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>

                {/* Feed Items */}
                {category.loading && category.items.length === 0 ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : category.items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No items in this category yet</p>
                    <p className="text-xs mt-2">Check back soon or refresh to try again</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {category.items.map((item) => (
                      <a
                        key={item.id}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group hover:bg-gray-50 p-3 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                      >
                        <div className="flex items-start gap-2">
                          <ExternalLink className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="truncate font-medium">{item.feedName}</span>
                              {item.publishedAt && (
                                <>
                                  <span>•</span>
                                  <time>{formatRelativeTime(item.publishedAt)}</time>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {/* View All Link */}
                {category.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={`#${category.category}`}
                      className={`text-sm ${category.color} hover:underline font-medium`}
                    >
                      View all {category.title.toLowerCase()} →
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Coverage Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.category} className="text-center">
                <div className={`${cat.color} text-2xl font-bold mb-1`}>
                  {cat.count}
                </div>
                <div className="text-xs text-gray-600">{cat.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
