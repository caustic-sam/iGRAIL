'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Eye, EyeOff, Save, RotateCcw } from 'lucide-react';
import { getFeatureFlags, setFeatureFlags, resetFeatureFlags, FeatureFlags } from '@/lib/feature-flags';

export default function SettingsPage() {
  // We read the initial flag state lazily so React only touches localStorage once
  // during the first render on the client.
  const [flags, setFlags] = useState<FeatureFlags>(() => getFeatureFlags());
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof FeatureFlags) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    setFeatureFlags(flags);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // Trigger a page reload to update navigation
    window.location.reload();
  };

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      resetFeatureFlags();
      setFlags(getFeatureFlags());
      setSaved(false);
      window.location.reload();
    }
  };

  const navigationSections = [
    { key: 'showPolicyPulse' as keyof FeatureFlags, label: 'Policy Pulse', description: 'Live policy monitoring dashboard' },
    { key: 'showVideos' as keyof FeatureFlags, label: 'Videos', description: 'Video content library' },
    { key: 'showArticles' as keyof FeatureFlags, label: 'Articles', description: 'Articles archive' },
    { key: 'showPolicies' as keyof FeatureFlags, label: 'Policies', description: 'Policy documentation' },
    { key: 'showBlog' as keyof FeatureFlags, label: 'Think Tank', description: 'Expert analysis and commentary' },
  ];

  const homepageSections = [
    { key: 'showHeroSection' as keyof FeatureFlags, label: 'Hero Section', description: 'Main banner with tagline and CTA buttons' },
    { key: 'showDataBoxes' as keyof FeatureFlags, label: 'Data Boxes', description: 'Rotating statistics cards (247, 89, 156)' },
    { key: 'showPolicyFeed' as keyof FeatureFlags, label: 'Policy Intelligence Feed', description: 'Left column policy updates' },
    { key: 'showFeaturedArticle' as keyof FeatureFlags, label: 'Featured Article', description: 'Center column highlighted article' },
    { key: 'showVideoInsights' as keyof FeatureFlags, label: 'Video Insights', description: 'Right column video feed' },
    { key: 'showNewsletter' as keyof FeatureFlags, label: 'Newsletter Signup', description: 'Bottom newsletter subscription form' },
    { key: 'showResourceLibrary' as keyof FeatureFlags, label: 'Resource Library', description: 'Bottom resource cards section' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] border-b border-blue-900/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-xl text-blue-100">Manage site visibility and preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation Visibility */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Navigation Visibility</h2>
              <p className="text-gray-600">
                Control which sections appear in the top navigation menu
              </p>
            </div>
            {saved && (
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                Saved!
              </div>
            )}
          </div>

          <div className="space-y-4">
            {navigationSections.map(section => (
              <div
                key={section.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {flags[section.key] ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <h3 className="font-semibold text-gray-900">{section.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(section.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    flags[section.key] ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={flags[section.key]}
                  aria-label={`Toggle ${section.label}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      flags[section.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Homepage Visibility */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Homepage Sections</h2>
              <p className="text-gray-600">
                Control which sections appear on the homepage
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {homepageSections.map(section => (
              <div
                key={section.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {flags[section.key] ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <h3 className="font-semibold text-gray-900">{section.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(section.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    flags[section.key] ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={flags[section.key]}
                  aria-label={`Toggle ${section.label}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      flags[section.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#4a6fa5] text-white rounded-lg hover:bg-[#3d5c8a] transition-colors font-medium"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Defaults
          </button>
        </div>

        {/* Info Card */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Hidden sections won&apos;t appear in the navigation menu</li>
            <li>• Pages remain accessible via direct URL</li>
            <li>• Changes apply to all unauthenticated users</li>
            <li>• Admin users will always see all sections</li>
            <li>• Settings are stored in browser local storage</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
