'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { BookOpen, Search } from 'lucide-react';
import { glossaryTerms, getCategories } from '@/data/glossary-terms';
import { PageHero } from '@/components/PageHero';

export default function GlossaryPage() {
  const categories = getCategories();

  // Group terms by category
  const termsByCategory = categories.map(category => ({
    category,
    terms: glossaryTerms.filter(term => term.category === category)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero title="Digital Policy Glossary">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Digital Policy Glossary</h1>
            <p className="text-blue-100 text-lg">
              {glossaryTerms.length} terms covering digital identity, blockchain, cybersecurity, and compliance
            </p>
          </div>
        </div>
      </PageHero>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Info */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-3 text-gray-600">
            <Search className="w-5 h-5" />
            <p className="text-sm">
              Browse {glossaryTerms.length} terms across {categories.length} categories. Use your browser&apos;s search (Cmd+F / Ctrl+F) to find specific terms.
            </p>
          </div>
        </Card>

        {/* Categories Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {termsByCategory.map(({ category, terms }) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
              >
                <div className="font-semibold text-gray-900 text-sm">{category}</div>
                <div className="text-xs text-gray-500 mt-1">{terms.length} terms</div>
              </a>
            ))}
          </div>
        </div>

        {/* Terms by Category */}
        {termsByCategory.map(({ category, terms }) => (
          <div key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              {category}
            </h2>
            <div className="space-y-6">
              {terms.map((term) => (
                <Card key={term.term} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{term.term}</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">{term.definition}</p>

                  {/* Related Terms */}
                  {term.relatedTerms && term.relatedTerms.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-500 mb-2">Related Terms:</div>
                      <div className="flex flex-wrap gap-2">
                        {term.relatedTerms.map((relatedTerm) => (
                          <span
                            key={relatedTerm}
                            className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                          >
                            {relatedTerm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Source */}
                  {term.source && (
                    <div className="text-xs text-gray-500 pt-3 border-t border-gray-200">
                      Source: <span className="font-medium text-gray-700">{term.source}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Footer CTA */}
        <Card className="p-8 text-center bg-white border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Want to contribute?</h3>
          <p className="text-gray-600 mb-4">
            Help us expand this glossary by suggesting new terms or improvements.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] hover:opacity-90 text-white font-medium rounded-lg transition-opacity"
          >
            Back to Home
          </Link>
        </Card>
      </div>
    </div>
  );
}
