import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { quickStats } from '@/lib/mockData';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache for 5 minutes

interface Stats {
  policyUpdates: number;
  policyUpdatesTrend: string;
  countriesMonitored: number;
  countriesTrend: string;
  expertContributors: number;
  expertsTrend: string;
  weeklyUpdates: number;
}

async function calculateTrend(currentCount: number, tableName: string, dateColumn: string): Promise<string> {
  try {
    // Get count from 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: oldCount } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .lt(dateColumn, sevenDaysAgo.toISOString());

    const previousCount = oldCount || 0;
    const diff = currentCount - previousCount;

    if (diff > 0) return `+${diff}`;
    if (diff < 0) return `${diff}`;
    return '0';
  } catch (error) {
    console.error(`Error calculating trend for ${tableName}:`, error);
    return '+0';
  }
}

async function getStats(): Promise<Stats> {
  if (!isSupabaseConfigured()) {
    return {
      policyUpdates: 247,
      policyUpdatesTrend: '+23',
      countriesMonitored: 89,
      countriesTrend: '+5',
      expertContributors: 156,
      expertsTrend: '+12',
      weeklyUpdates: 23,
    };
  }

  try {
    // Get total published articles (proxy for policy updates)
    const { count: articlesCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    // Get articles from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: weeklyCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .gte('published_at', sevenDaysAgo.toISOString());

    // Get total number of authors (expert contributors)
    const { count: authorsCount } = await supabase
      .from('authors')
      .select('*', { count: 'exact', head: true });

    // Calculate trends
    const articleTrend = await calculateTrend(articlesCount || 0, 'articles', 'published_at');
    const authorTrend = await calculateTrend(authorsCount || 0, 'authors', 'created_at');

    // Countries monitored is a static number for now (could be derived from article metadata later)
    const countriesMonitored = 89;

    return {
      policyUpdates: articlesCount || 0,
      policyUpdatesTrend: articleTrend,
      countriesMonitored,
      countriesTrend: '+0', // Static for now
      expertContributors: authorsCount || 0,
      expertsTrend: authorTrend,
      weeklyUpdates: weeklyCount || 0,
    };
  } catch (error) {
    console.error('Error fetching site statistics:', error);

    // Return mock data on error
    return {
      policyUpdates: 247,
      policyUpdatesTrend: '+23',
      countriesMonitored: 89,
      countriesTrend: '+5',
      expertContributors: 156,
      expertsTrend: '+12',
      weeklyUpdates: 23,
    };
  }
}

export async function GET() {
  try {
    const stats = await getStats();

    // Format for frontend consumption
    const formattedStats = [
      {
        label: 'Policy Updates',
        value: stats.policyUpdates.toString(),
        trend: stats.policyUpdatesTrend,
      },
      {
        label: 'Countries Monitored',
        value: stats.countriesMonitored.toString(),
        trend: stats.countriesTrend,
      },
      {
        label: 'Expert Contributors',
        value: stats.expertContributors.toString(),
        trend: stats.expertsTrend,
      },
      {
        label: "This Week's Updates",
        value: `+${stats.weeklyUpdates}`,
        trend: 'active',
      },
    ];

    return NextResponse.json({
      stats: formattedStats,
      source: isSupabaseConfigured() ? 'database' : 'mock',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unexpected error in stats API route:', error);

    // Return mock data on error
    return NextResponse.json({
      stats: quickStats,
      source: 'mock',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
