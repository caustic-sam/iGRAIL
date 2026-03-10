'use client';

import React from 'react';
import { ArrowRight, BookOpen, Clock, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ArticlesPage() {
  const upcomingFeatures = [
    {
      icon: BookOpen,
      title: 'Expert Commentary',
      description: 'In-depth analysis from leading policy experts and researchers worldwide'
    },
    {
      icon: TrendingUp,
      title: 'Trending Topics',
      description: 'Real-time coverage of emerging digital policy issues and debates'
    },
    {
      icon: Users,
      title: 'Community Insights',
      description: 'Curated perspectives from practitioners, advocates, and stakeholders'
    },
    {
      icon: Clock,
      title: 'Daily Briefings',
      description: 'Morning summaries of overnight policy developments around the globe'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] border-b border-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Think Tank</h1>
              <p className="text-blue-200">Global policy analysis and commentary</p>
            </div>
            <a
              href="/"
              className="text-blue-200 hover:text-white font-medium transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            Coming Soon
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Daily Source for Policy Intelligence
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We&apos;re building a comprehensive platform for expert analysis, breaking news, and deep dives
            into the policies shaping our digital future. Subscribe to be notified when we launch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Subscribe for Updates
            </Button>
            <Button variant="secondary" size="lg">
              View Sample Articles
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {upcomingFeatures.map((feature, idx) => (
            <Card key={idx} hover className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">What to Expect</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Daily Analysis:</strong> Fresh perspectives on breaking policy news from our network of experts
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Long-Form Investigations:</strong> Deep research into complex policy challenges and their real-world impacts
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Guest Contributors:</strong> Voices from government, industry, civil society, and academia
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Interactive Content:</strong> Polls, debates, and community discussions on critical issues
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            iGRAIL Think Tank - Coming Soon
          </p>
        </div>
      </div>
    </div>
  );
}
