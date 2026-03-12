import { NextResponse } from 'next/server';
import { getFreshRSSClient, type FreshRSSItem } from '@/lib/freshrss';
import Parser from 'rss-parser';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

function logFeedRouteError(message: string, error: unknown) {
  if (process.env.NODE_ENV !== 'test') {
    console.error(message, error);
  }
}

// Categorize feed items based on feed name or content keywords
function categorizeFeedItem(item: FreshRSSItem): 'policy' | 'research' | 'news' | 'analysis' {
  const feedName = item.origin?.title?.toLowerCase() || '';
  const title = item.title.toLowerCase();

  // Policy feeds
  if (feedName.includes('regulation') ||
      feedName.includes('policy') ||
      feedName.includes('government') ||
      feedName.includes('compliance') ||
      title.includes('regulation') ||
      title.includes('compliance')) {
    return 'policy';
  }

  // Research feeds
  if (feedName.includes('research') ||
      feedName.includes('paper') ||
      feedName.includes('journal') ||
      feedName.includes('academic')) {
    return 'research';
  }

  // Analysis feeds
  if (feedName.includes('analysis') ||
      feedName.includes('blog') ||
      feedName.includes('commentary') ||
      feedName.includes('opinion')) {
    return 'analysis';
  }

  // Default to news
  return 'news';
}

// Categorize RSS items
function categorizeRSSItem(title: string, categories?: string[]): 'policy' | 'research' | 'news' | 'analysis' {
  const titleLower = title.toLowerCase();
  const categoryText = categories?.join(' ').toLowerCase() || '';

  if (titleLower.includes('policy') || titleLower.includes('regulation') ||
      titleLower.includes('government') || categoryText.includes('policy')) {
    return 'policy';
  }

  if (titleLower.includes('research') || titleLower.includes('study') ||
      categoryText.includes('research')) {
    return 'research';
  }

  if (titleLower.includes('analysis') || titleLower.includes('opinion') ||
      categoryText.includes('analysis')) {
    return 'analysis';
  }

  return 'news';
}

// Fetch RSS feed directly
async function fetchRSSFeed(count: number, category: string | null): Promise<FeedItem[]> {
  const rssUrl = process.env.FRESHRSS_RSS_URL;

  if (!rssUrl) {
    throw new Error('FRESHRSS_RSS_URL not configured');
  }

  try {
    const parser = new Parser();
    const feed = await parser.parseURL(rssUrl);

    const items: FeedItem[] = (feed.items || []).map((item, index) => ({
      id: item.guid || `rss-${index}`,
      title: item.title || 'Untitled',
      link: item.link || '#',
      description: item.contentSnippet || item.content || '',
      author: item.creator || item.author,
      publishedAt: item.pubDate ? new Date(item.pubDate) : null,
      feedName: feed.title || 'FreshRSS',
      feedUrl: rssUrl,
      category: categorizeRSSItem(item.title || '', item.categories),
    }));

    return items
      .filter(item => !category || item.category === category)
      .slice(0, count);
  } catch (error) {
    logFeedRouteError('RSS parsing error:', error);
    throw error;
  }
}

function getMockFeedItems(count: number, category: string | null): FeedItem[] {
  const mockItems: FeedItem[] = [
    {
      id: 'mock-1',
      title: 'EU AI Act Implementation Guidelines Released',
      link: '#',
      description: 'European Commission publishes detailed guidance for organizations',
      author: 'EU Commission',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      feedName: 'EU Digital Policy',
      feedUrl: '#',
      category: 'policy'
    },
    {
      id: 'mock-2',
      title: 'New Research on AI Governance Frameworks',
      link: '#',
      description: 'Stanford HAI releases comprehensive study on global AI governance',
      author: 'Stanford HAI',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      feedName: 'AI Research',
      feedUrl: '#',
      category: 'research'
    },
    {
      id: 'mock-3',
      title: 'NIST Cybersecurity Framework 2.0 Update',
      link: '#',
      description: 'Major revision includes AI security considerations',
      author: 'NIST',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      feedName: 'NIST Publications',
      feedUrl: '#',
      category: 'policy'
    },
    {
      id: 'mock-4',
      title: 'Analysis: The Future of Digital Identity',
      link: '#',
      description: 'Expert commentary on evolving identity standards',
      author: 'Digital Policy Analyst',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      feedName: 'Policy Analysis',
      feedUrl: '#',
      category: 'analysis'
    },
    {
      id: 'mock-5',
      title: 'Breaking: UK Announces New Data Protection Rules',
      link: '#',
      description: 'Post-Brexit data governance framework unveiled',
      author: 'ICO',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      feedName: 'UK Gov News',
      feedUrl: '#',
      category: 'news'
    }
  ];

  return mockItems
    .filter(item => !category || item.category === category)
    .slice(0, count);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '20');
  const category = searchParams.get('category') || null;

  try {
    const client = getFreshRSSClient();

    if (!client) {
      return NextResponse.json({
        data: getMockFeedItems(count, category),
        source: 'mock',
        count: getMockFeedItems(count, category).length,
      });
    }

    // Authenticate and fetch items
    const items = await client.getItems({ count: count * 2, excludeRead: false });

    // Transform and categorize
    const categorizedItems = items
      .map(item => {
        return {
          id: item.id,
          title: item.title,
          link: item.canonical?.[0]?.href || '',
          description: item.summary?.content || '',
          author: item.author,
          publishedAt: item.published ? new Date(item.published * 1000) : null,
          feedName: item.origin?.title || 'Unknown Feed',
          feedUrl: item.origin?.htmlUrl || '',
          category: categorizeFeedItem(item),
        };
      })
      .filter(item => !category || item.category === category)
      .slice(0, count);

    return NextResponse.json({
      data: categorizedItems,
      source: 'freshrss',
      count: categorizedItems.length,
      unreadCount: await client.getUnreadCount(),
    });
  } catch (error) {
    logFeedRouteError('FreshRSS API error in /api/feeds:', error);

    // Try RSS feed as fallback
    try {
      const rssItems = await fetchRSSFeed(count, category);

      return NextResponse.json({
        data: rssItems,
        source: 'freshrss-rss',
        count: rssItems.length,
      });
    } catch (rssError) {
      logFeedRouteError('RSS feed fallback failed in /api/feeds:', rssError);

      // Final fallback to mock data
      return NextResponse.json({
        data: getMockFeedItems(count, category),
        source: 'mock',
        count: getMockFeedItems(count, category).length,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
