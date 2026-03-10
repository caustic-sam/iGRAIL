'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  Globe, Mail, Twitter, Linkedin, Rss, ArrowRight,
  MessageCircle, Clock, Heart, Play, Send,
  ThumbsUp, FileStack, BarChart3, Network, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { StatusDot } from '@/components/ui/StatusDot';
import { mockPolicies, mockArticles, mockThoughts, mockVideos, quickStats } from '@/lib/mockData';
import { TermOfDay } from '@/components/widgets/TermOfDay';
import { NISTAssistant } from '@/components/widgets/NISTAssistant';
import { DataBoxes } from '@/components/widgets/DataBoxes';
import { FeedCard } from '@/components/FeedCard';
import { GlobalFeedStream } from '@/components/GlobalFeedStream';

import { ComingSoonModal } from '@/components/ui/ComingSoonModal';
import { useComingSoon } from '@/hooks/useComingSoon';

const AnimatedGlobe = dynamic(
  () => import('@/components/AnimatedGlobe').then((m) => ({ default: m.AnimatedGlobe })),
  { ssr: false }
);

export default function HomePage() {
  const { isOpen, feature, showComingSoon, closeModal } = useComingSoon();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<'All Updates' | 'Data' | 'Digital ID'>('All Updates');
  const [featuredArticle, setFeaturedArticle] = React.useState<any>(null);
  const [loadingArticle, setLoadingArticle] = React.useState(true);
  const [videos, setVideos] = React.useState<any[]>([]);
  const [loadingVideos, setLoadingVideos] = React.useState(true);
  const [stats, setStats] = React.useState<any[]>(quickStats);
  const [loadingStats, setLoadingStats] = React.useState(true);

  const filteredPolicies = React.useMemo(() => {
    return mockPolicies.filter(p => (activeTab === 'All Updates' ? true : p.category === activeTab));
  }, [activeTab]);

  // Fetch featured article from database
  React.useEffect(() => {
    async function fetchFeaturedArticle() {
      try {
        const res = await fetch('/api/articles?featured=true&limit=1');
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setFeaturedArticle(data.articles[0]);
        } else {
          // Fallback to mock data if no featured articles
          setFeaturedArticle(mockArticles[0]);
        }
      } catch (error) {
        console.error('Error fetching featured article:', error);
        // Fallback to mock data on error
        setFeaturedArticle(mockArticles[0]);
      } finally {
        setLoadingArticle(false);
      }
    }
    fetchFeaturedArticle();
  }, []);

  // Fetch video insights
  React.useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/videos?limit=4');
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos);
        } else {
          // Fallback to mock videos
          setVideos(mockVideos);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        // Fallback to mock data on error
        setVideos(mockVideos);
      } finally {
        setLoadingVideos(false);
      }
    }
    fetchVideos();
  }, []);

  // Fetch stats
  React.useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.stats && data.stats.length > 0) {
          setStats(data.stats);
        } else {
          // Fallback to mock stats
          setStats(quickStats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to mock data on error
        setStats(quickStats);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  const handleRefreshAll = () => {
    router.refresh();
  };

  const resourceCards = [
    {
      icon: FileStack,
      title: "Policy Templates",
      subtitle: "Policy Templates",
      description: "Ready-to-use frameworks for digital governance, privacy impact assessments, and compliance audits.",
      link: "Explore Templates"
    },
    {
      icon: BarChart3,
      title: "Research Reports",
      subtitle: "Research Reports",
      description: "In-depth analysis of global policy trends, comparative studies, and impact assessments.",
      link: "Access Reports"
    },
    {
      icon: Network,
      title: "Expert Network",
      subtitle: "Expert Network",
      description: "Connect with policy experts, legal professionals, and government officials worldwide.",
      link: "Join Network"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] text-white relative overflow-hidden">
        {/* Globe as backdrop - absolute positioning behind content */}
        <div className="absolute inset-0 flex items-center justify-center lg:justify-start pointer-events-none">
          <div className="transform scale-[2.5] opacity-40 lg:ml-[393px]">
            <AnimatedGlobe />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 min-h-[280px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Content */}
            <div className="relative z-10">
              <div className="text-sm font-semibold text-blue-300 uppercase tracking-widest mb-3">iGRAIL</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-gray-100 via-gray-50 to-gray-200 bg-clip-text text-transparent drop-shadow-sm">
                Navigating the Future of<br />Digital Policy
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl">
                Your trusted source for comprehensive analysis, expert insights, and real-time updates on global digital governance, data protection, and identity policies.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/blog">
                  <Button size="lg" variant="accent">Explore Insights</Button>
                </Link>
                <Button size="lg" variant="coming-soon" onClick={() => showComingSoon('Community Features')}>
                  Join Community
                </Button>
                <button
                  onClick={handleRefreshAll}
                  aria-label="Refresh all live feeds"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all flex items-center gap-2 border border-white/20"
                >
                  <RefreshCw className="w-5 h-5" />
                  Refresh Feeds
                </button>
              </div>
            </div>

            {/* Right: Data Boxes - Now visible on all screens */}
            <div className="relative z-10 mt-8 lg:mt-0">
              <DataBoxes />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Three Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">

          {/* Left Column - Policy Intelligence Feed */}
          <div className="md:col-span-1 lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Policy Intelligence Feed</h2>
                <Link href="/policy-updates" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  View All
                </Link>
              </div>
              <p className="text-sm text-gray-600 mb-4">Latest updates from global regulatory bodies</p>
              
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-4 border-b border-gray-200">
                {(['All Updates', 'Data', 'Digital ID'] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      aria-pressed={isActive}
                      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                        isActive
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {filteredPolicies.map(policy => (
                <a
                  key={policy.id}
                  href={policy.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left cursor-pointer"
                >
                  <Card hover className="p-4 hover:bg-orange-50 transition-all">
                    <div className="flex items-start gap-3">
                      <StatusDot status={policy.status} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 hover:text-orange-600 cursor-pointer">
                          {policy.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {policy.summary}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{policy.date}</span>
                          <span>•</span>
                          <span>{policy.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {policy.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>

            <Link href="/policy-updates">
              <button className="w-full mt-6 text-center text-blue-600 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                View All Updates <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            {/* Quick Insights */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Insights</h3>
              <div className="space-y-3">
                {loadingStats ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))
                ) : (
                  stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">{stat.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                        {stat.trend !== 'active' && (
                          <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Community Chat Preview */}
            <Card className="p-5 mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Community Chat</h3>
                  <p className="text-xs text-gray-600">23 online</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar size="sm">PE</Avatar>
                    <span className="font-semibold text-gray-900">PolicyExpert_EU</span>
                    <span className="text-gray-500">3m</span>
                  </div>
                  <p className="text-gray-700 ml-8">Has anyone analyzed the impact of the new UK data transparency directive?</p>
                </div>

                <div className="text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar size="sm">DA</Avatar>
                    <span className="font-semibold text-gray-900">DataPolicy_Analyst</span>
                    <span className="text-gray-500">1m</span>
                  </div>
                  <p className="text-gray-700 ml-8">Working on a comprehensive analysis. Should be published next week!</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Join the discussion..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => showComingSoon('Community Chat')}
                  aria-label="Send chat message (coming soon)"
                  className="w-10 h-10 rounded-lg bg-orange-500 border-2 border-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </div>

          {/* Center Column - Expert Analysis */}
          <div className="md:col-span-1 lg:col-span-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Expert Analysis</h2>
                <Link href="/blog" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  View All Posts
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              {loadingArticle ? (
                <Card className="overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </Card>
              ) : featuredArticle ? (
                <Link href={`/blog/${featuredArticle.slug}`} key={featuredArticle.id}>
                  <Card hover className="overflow-hidden">
                    {featuredArticle.featured_image_url ? (
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={featuredArticle.featured_image_url}
                          alt={featuredArticle.featured_image_alt || featuredArticle.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center text-blue-100 text-sm">
                        Article Image Placeholder
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar size="md">
                          {featuredArticle.author?.name?.split(' ').map((n: string) => n[0]).join('') ||
                           featuredArticle.author?.avatar || 'A'}
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">
                            {featuredArticle.author?.name || 'Author'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {featuredArticle.author?.title || 'Author'}
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600">
                        {featuredArticle.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {featuredArticle.summary || featuredArticle.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {featuredArticle.read_time_minutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {featuredArticle.read_time_minutes} min
                            </span>
                          )}
                          <span>
                            {new Date(featuredArticle.published_at || featuredArticle.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          {featuredArticle.category && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                              {featuredArticle.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ) : null}
            </div>

            {/* Global Feed Stream */}
            <div className="mt-6">
              <GlobalFeedStream />
            </div>

            {/* Video Insights */}
            <Card className="p-5 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Video Insights</h3>
              <p className="text-sm text-gray-600 mb-4">Expert video commentary</p>

              {loadingVideos ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-36 bg-gray-200 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map(video => (
                    <a
                      key={video.id}
                      href={video.url || video.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group cursor-pointer"
                    >
                      <div className="relative rounded-lg overflow-hidden mb-2 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] h-36 flex items-center justify-center">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="w-6 h-6 text-blue-600 ml-1" />
                          </div>
                        </div>
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-white text-xs font-medium">
                            {video.duration}
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-blue-600">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-1 line-clamp-2">{video.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {video.views && <span>{video.views}</span>}
                        {video.views && video.date && <span>•</span>}
                        {video.date && <span>{video.date}</span>}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </Card>

            {/* NIST Assistant */}
            <div className="mt-6">
              <NISTAssistant />
            </div>
          </div>

          {/* Right Column - Policy Pulse, Videos, Community */}
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            
            {/* Policy Pulse */}
            <Card className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Policy Pulse</h3>
              <p className="text-sm text-gray-600 mb-4">Quick insights and observations</p>
              
              <div className="space-y-4">
                {mockThoughts.map(thought => (
                  <div key={thought.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-start gap-2 mb-2">
                      <Avatar size="sm">{thought.author.avatar}</Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">{thought.author.name}</span>
                          <span className="text-xs text-gray-500">{thought.time}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {thought.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => showComingSoon('Social Features')}
                            className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 border border-orange-500 px-2 py-0.5 rounded"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            Like
                          </button>
                          <button
                            onClick={() => showComingSoon('Social Features')}
                            className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 border border-orange-500 px-2 py-0.5 rounded"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => showComingSoon('Policy Pulse Contributions')}
                className="w-full mt-4 text-center text-orange-600 font-medium text-sm py-2 hover:bg-orange-50 rounded-lg transition-colors border-2 border-orange-500"
              >
                Share a quick policy insight...
              </button>
            </Card>

            {/* Live FreshRSS Feed */}
            <FeedCard
              title="Live Policy Feed"
              icon={<Rss className="w-5 h-5 text-blue-600" />}
              category="policy"
              itemCount={5}
              refreshInterval={300000}
            />

            {/* Term of the Day */}
            <TermOfDay />
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-blue-200" />
          <h2 className="text-3xl font-bold mb-3">Get weekly insights, analysis, and updates delivered to your inbox</h2>
          <p className="text-blue-100 mb-8">Join 15,000+ policy professionals worldwide</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Button variant="coming-soon" size="lg" onClick={() => showComingSoon('Newsletter Subscription')}>
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Resource Library */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Policy Resource Library</h2>
            <p className="text-gray-600">Comprehensive collection of frameworks, templates, and research tools for policy professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resourceCards.map((resource, idx) => (
              <Card key={idx} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <resource.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                <h4 className="text-sm font-semibold text-blue-600 mb-3">{resource.subtitle}</h4>
                <p className="text-sm text-gray-600 mb-6">{resource.description}</p>
                <button
                  onClick={() => showComingSoon(resource.title)}
                  className="text-orange-600 font-medium text-sm hover:text-orange-700 inline-flex items-center gap-2 border-2 border-orange-500 px-4 py-2 rounded-lg"
                >
                  {resource.link} <ArrowRight className="w-4 h-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a2332] text-gray-300 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold">iGRAIL</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your trusted source for comprehensive digital policy intelligence, expert analysis, and professional insights.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/policy-updates" className="hover:text-white transition-colors">Policy Updates</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Expert Analysis</Link></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('Live Hub'); }} className="hover:text-white transition-colors cursor-pointer">Live Hub</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('Resources Library'); }} className="hover:text-white transition-colors cursor-pointer">Resources Library</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Research</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('Policy Database'); }} className="hover:text-white transition-colors cursor-pointer">Policy Database</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('Glossary'); }} className="hover:text-white transition-colors cursor-pointer">Digital Identity</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('AI Governance'); }} className="hover:text-white transition-colors cursor-pointer">AI Governance</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('Cross-Border Data'); }} className="hover:text-white transition-colors cursor-pointer">Cross-Border Data</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Connect</h3>
              <ul className="space-y-2 text-sm mb-4">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('Newsletter'); }} className="hover:text-white transition-colors cursor-pointer">Newsletter</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('Privacy Policy'); }} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a></li>
              </ul>
              <div className="flex gap-3">
                <a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('Social Media'); }} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('Social Media'); }} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('RSS Feed'); }} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <Rss className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div>© 2025 iGRAIL. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('Terms of Service'); }} className="hover:text-gray-300 transition-colors cursor-pointer">Terms of Service</a>
              <a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('Privacy Policy'); }} className="hover:text-gray-300 transition-colors cursor-pointer">Privacy Policy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); showComingSoon('Cookie Settings'); }} className="hover:text-gray-300 transition-colors cursor-pointer">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Coming Soon Modal */}
      <ComingSoonModal isOpen={isOpen} onClose={closeModal} feature={feature} />
    </div>
  );
}