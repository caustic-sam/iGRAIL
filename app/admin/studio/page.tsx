'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import {
  FileText,
  Image as ImageIcon,
  Layers,
  Plus,
  FolderOpen,
  Palette
} from 'lucide-react';

interface StudioStats {
  publishedArticles: number;
  mediaFiles: number;
  components: number;
  drafts: number;
}

export default function StudioPage() {
  const [stats, setStats] = useState<StudioStats>({
    publishedArticles: 0,
    mediaFiles: 0,
    components: 0,
    drafts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch real article counts
        const articlesResponse = await fetch('/api/admin/articles');
        const articlesData = await articlesResponse.json();
        const articles = articlesData.articles || [];

        const publishedCount = articles.filter((a: any) => a.status === 'published').length;
        const draftCount = articles.filter((a: any) => a.status === 'draft').length;

        // Fetch media files count from Supabase Storage
        let mediaCount = 0;
        try {
          const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
          const supabase = createClientComponentClient();
          const { data: mediaFiles } = await supabase.storage.from('media').list('', { limit: 1000 });
          mediaCount = mediaFiles?.length || 0;
        } catch (err) {
          console.error('Error fetching media count:', err);
        }

        setStats({
          publishedArticles: publishedCount,
          mediaFiles: mediaCount,
          // The component gallery does not have a registry-backed data source yet,
          // so we return `0` explicitly rather than inventing a misleading number.
          components: 0,
          drafts: draftCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  const sections = [
    {
      title: 'Publishing Desk',
      description: 'Create and manage articles, drafts, and scheduled posts',
      icon: FileText,
      color: 'blue',
      actions: [
        { label: 'New Article', href: '/admin/articles/new', icon: Plus },
        { label: 'View All Articles', href: '/admin', icon: FolderOpen }
      ]
    },
    {
      title: 'Media Vault',
      description: 'Upload and manage images, videos, and documents',
      icon: ImageIcon,
      color: 'orange',
      actions: [
        { label: 'Upload Media', href: '/admin/media', icon: Plus },
        { label: 'Browse Library', href: '/admin/media', icon: FolderOpen }
      ]
    },
    {
      title: 'Component Gallery',
      description: 'Browse and manage reusable UI components',
      icon: Layers,
      color: 'purple',
      actions: [
        { label: 'New Component', href: '/components/new', icon: Plus },
        { label: 'View Gallery', href: '/components', icon: Palette }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-[#e8eef5]', // Muted blue background
          icon: 'text-[#4a6fa5]', // Dusty blue
          button: 'bg-[#4a6fa5] hover:bg-[#3d5c8a]' // Muted blue
        };
      case 'orange':
        return {
          bg: 'bg-[#f5ede8]', // Muted orange background
          icon: 'text-[#c17a58]', // Burnt sienna
          button: 'bg-[#c17a58] hover:bg-[#a66547]' // Muted orange
        };
      case 'purple':
        return {
          bg: 'bg-[#f0eef3]', // Muted purple background
          icon: 'text-[#8b7fa8]', // Dusty lavender
          button: 'bg-[#8b7fa8] hover:bg-[#756a8f]' // Muted purple
        };
      default:
        return {
          bg: 'bg-gray-100',
          icon: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] border-b border-blue-900/20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Studio</h1>
            <p className="text-xl text-blue-100">
              Your creative workspace for content, media, and components
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const colors = getColorClasses(section.color);

            return (
              <Card key={section.title} className="overflow-hidden">
                <div className="p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-lg ${colors.bg} flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${colors.icon}`} />
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {section.description}
                  </p>

                  {/* Actions */}
                  <div className="space-y-3">
                    {section.actions.map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <Link
                          key={action.label}
                          href={action.href}
                          className={`flex items-center justify-center gap-2 w-full px-4 py-3 ${colors.button} text-white rounded-lg font-medium transition-colors`}
                        >
                          <ActionIcon className="w-5 h-5" />
                          <span>{action.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '...' : stats.publishedArticles}
            </div>
            <div className="text-sm text-gray-600">Published Articles</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '...' : stats.mediaFiles}
            </div>
            <div className="text-sm text-gray-600">Media Files</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '...' : stats.components}
            </div>
            <div className="text-sm text-gray-600">Components</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '...' : stats.drafts}
            </div>
            <div className="text-sm text-gray-600">Drafts</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
