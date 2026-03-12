'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Filter, Database, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusDot } from '@/components/ui/StatusDot';

export default function PoliciesPage() {
  const upcomingFeatures = [
    {
      icon: Database,
      title: 'Comprehensive Database',
      description: 'Searchable repository of digital policies from 150+ countries and jurisdictions'
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Filter by region, status, topic, and regulatory body with full-text search'
    },
    {
      icon: Filter,
      title: 'Smart Comparisons',
      description: 'Side-by-side analysis of similar policies across different jurisdictions'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Track policy development from draft to implementation worldwide'
    }
  ];

  const samplePolicies = [
    { region: 'European Union', title: 'Digital Services Act', status: 'in_force' },
    { region: 'United States', title: 'AI Executive Order', status: 'adopted' },
    { region: 'United Kingdom', title: 'Online Safety Bill', status: 'draft' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] border-b border-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Research</h1>
              <p className="text-blue-200">Global policy database and analysis</p>
            </div>
            <Link href="/" className="text-blue-200 hover:text-white font-medium transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
            Coming Soon
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The World&apos;s Digital Policy Library
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Access the most comprehensive database of digital policies, regulations, and frameworks
            from around the globe. Track changes, compare approaches, and conduct deep research.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Request Early Access
            </Button>
            <Button variant="secondary" size="lg">
              Explore Sample Database
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {upcomingFeatures.map((feature, idx) => (
            <Card key={idx} hover className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Database Preview */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Database Preview</h3>

          {/* Search Bar Mockup */}
          <Card className="p-4 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Search policies, regulations, and frameworks...</span>
              </div>
              <Button variant="primary">Search</Button>
            </div>
          </Card>

          {/* Sample Results */}
          <div className="space-y-4">
            {samplePolicies.map((policy, idx) => (
              <Card key={idx} hover className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <StatusDot status={policy.status as 'draft' | 'in_force' | 'adopted'} />
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {policy.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{policy.region}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{policy.title}</h4>
                    <p className="text-sm text-gray-600">
                      Comprehensive framework for digital regulation and governance
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Research Tools Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Powerful Research Tools</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Version Tracking:</strong> Follow policy evolution from draft to final implementation
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Impact Analysis:</strong> Understand how policies affect different sectors and stakeholders
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Citation Export:</strong> Generate citations in multiple academic formats
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>API Access:</strong> Integrate policy data into your own research workflows
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
            iGRAIL Research Database - Coming Soon
          </p>
        </div>
      </div>
    </div>
  );
}
