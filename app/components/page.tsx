'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { StatusDot } from '@/components/ui/StatusDot';
import { WorldClocks } from '@/components/WorldClocks';
import { ArrowRight, Mail, Download, Heart, Share2, User } from 'lucide-react';

const AnimatedGlobe = dynamic(
  () => import('@/components/AnimatedGlobe').then((m) => m.AnimatedGlobe),
  { ssr: false }
);

export default function ComponentGallery() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Component Gallery</h1>
              <p className="text-gray-600 mt-1">Visual showcase of all UI components</p>
            </div>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Buttons Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Buttons</h2>
            <p className="text-gray-600">Various button styles, sizes, and states</p>
          </div>

          <div className="space-y-8">
            {/* Variants */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Variants</h3>
              <Card className="p-6">
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
              </Card>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sizes</h3>
              <Card className="p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </Card>
            </div>

            {/* With Icons */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">With Icons</h3>
              <Card className="p-6">
                <div className="flex flex-wrap gap-4">
                  <Button icon={<Mail className="w-4 h-4" />}>
                    Send Email
                  </Button>
                  <Button variant="secondary" icon={<Download className="w-4 h-4" />}>
                    Download
                  </Button>
                  <Button variant="ghost" icon={<Share2 className="w-4 h-4" />}>
                    Share
                  </Button>
                  <Button icon={<ArrowRight className="w-4 h-4" />}>
                    Continue
                  </Button>
                </div>
              </Card>
            </div>

            {/* Combined Examples */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Combinations</h3>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">Small:</span>
                    <Button size="sm" variant="primary">Primary</Button>
                    <Button size="sm" variant="secondary">Secondary</Button>
                    <Button size="sm" variant="ghost">Ghost</Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">Medium:</span>
                    <Button size="md" variant="primary">Primary</Button>
                    <Button size="md" variant="secondary">Secondary</Button>
                    <Button size="md" variant="ghost">Ghost</Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">Large:</span>
                    <Button size="lg" variant="primary">Primary</Button>
                    <Button size="lg" variant="secondary">Secondary</Button>
                    <Button size="lg" variant="ghost">Ghost</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cards</h2>
            <p className="text-gray-600">Container components with various styles</p>
          </div>

          <div className="space-y-8">
            {/* Basic Cards */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Default Card</h4>
                  <p className="text-gray-600 text-sm">
                    A basic card with default shadow and styling.
                  </p>
                </Card>

                <Card className="p-6" hover>
                  <h4 className="font-semibold text-gray-900 mb-2">Hover Card</h4>
                  <p className="text-gray-600 text-sm">
                    Hover over this card to see the shadow effect.
                  </p>
                </Card>

                <Card className="p-6 bg-blue-50 border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Colored Card</h4>
                  <p className="text-blue-700 text-sm">
                    Custom background and border colors.
                  </p>
                </Card>
              </div>
            </div>

            {/* Content Cards */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Examples</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card hover>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar size="lg">JM</Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Article Card</h4>
                        <p className="text-sm text-gray-500 mb-3">Posted 2 hours ago</p>
                        <p className="text-gray-600 text-sm">
                          This is an example of a card with avatar and content. Perfect for articles or blog posts.
                        </p>
                        <div className="flex gap-4 mt-4 text-sm text-gray-500">
                          <button className="hover:text-blue-600 flex items-center gap-1">
                            <Heart className="w-4 h-4" /> 24
                          </button>
                          <button className="hover:text-blue-600">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card hover>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <StatusDot status="in_force" />
                      <span className="text-xs font-medium text-green-700 uppercase">In Force</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">EU AI Act</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      New compliance requirements for large online platforms under Europe&apos;s largest digital regulation.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">European Union</span>
                      <span className="text-gray-500">45 comments</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Avatars Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Avatars</h2>
            <p className="text-gray-600">User profile images and placeholders</p>
          </div>

          <div className="space-y-8">
            {/* Sizes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sizes</h3>
              <Card className="p-6">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar size="sm">S</Avatar>
                    <span className="text-xs text-gray-500">Small</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Avatar size="md">M</Avatar>
                    <span className="text-xs text-gray-500">Medium</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Avatar size="lg">L</Avatar>
                    <span className="text-xs text-gray-500">Large</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Examples</h3>
              <Card className="p-6">
                <div className="flex flex-wrap gap-4">
                  <Avatar size="lg">JM</Avatar>
                  <Avatar size="lg">AB</Avatar>
                  <Avatar size="lg">CD</Avatar>
                  <Avatar size="lg">EF</Avatar>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    GH
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                    IJ
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <User className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </div>

            {/* With Text */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">With User Info</h3>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar size="md">JM</Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">John Murphy</p>
                      <p className="text-sm text-gray-500">Policy Analyst</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar size="md">SC</Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">Sarah Chen</p>
                      <p className="text-sm text-gray-500">Legal Expert</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar size="md">RK</Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">Raj Kumar</p>
                      <p className="text-sm text-gray-500">Data Governance Lead</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Status Dots Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Status Indicators</h2>
            <p className="text-gray-600">Policy status and state indicators</p>
          </div>

          <div className="space-y-8">
            {/* All Statuses */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Statuses</h3>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <StatusDot status="draft" />
                    <span className="font-medium text-gray-900">Draft</span>
                    <span className="text-sm text-gray-500">- Policy is being drafted</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusDot status="adopted" />
                    <span className="font-medium text-gray-900">Adopted</span>
                    <span className="text-sm text-gray-500">- Policy has been adopted but not yet in force</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusDot status="in_force" />
                    <span className="font-medium text-gray-900">In Force</span>
                    <span className="text-sm text-gray-500">- Policy is currently active</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusDot status="repealed" />
                    <span className="font-medium text-gray-900">Repealed</span>
                    <span className="text-sm text-gray-500">- Policy has been repealed</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* In Use */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Examples</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusDot status="in_force" />
                    <span className="text-xs font-medium text-green-700 uppercase">In Force</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">GDPR</h4>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusDot status="draft" />
                    <span className="text-xs font-medium text-yellow-700 uppercase">Draft</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">EU Data Act</h4>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusDot status="adopted" />
                    <span className="text-xs font-medium text-blue-700 uppercase">Adopted</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">AI Act</h4>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusDot status="repealed" />
                    <span className="text-xs font-medium text-gray-700 uppercase">Repealed</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Old Privacy Law</h4>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Color Palette</h2>
            <p className="text-gray-600">Current design system colors</p>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="h-20 bg-blue-600 rounded-lg mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Blue 600</p>
                  <p className="text-xs text-gray-500">#2563eb</p>
                </div>
                <div>
                  <div className="h-20 bg-blue-700 rounded-lg mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Blue 700</p>
                  <p className="text-xs text-gray-500">#1d4ed8</p>
                </div>
                <div>
                  <div className="h-20 bg-blue-50 rounded-lg mb-2 border border-blue-200"></div>
                  <p className="text-sm font-medium text-gray-900">Blue 50</p>
                  <p className="text-xs text-gray-500">#eff6ff</p>
                </div>
                <div>
                  <div className="h-20 bg-blue-100 rounded-lg mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Blue 100</p>
                  <p className="text-xs text-gray-500">#dbeafe</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="h-20 bg-green-500 rounded-lg mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Green (Active)</p>
                  <p className="text-xs text-gray-500">#22c55e</p>
                </div>
                <div>
                  <div className="h-20 bg-yellow-500 rounded-lg mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Yellow (Draft)</p>
                  <p className="text-xs text-gray-500">#eab308</p>
                </div>
                <div>
                  <div className="h-20 bg-blue-500 rounded-lg mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Blue (Adopted)</p>
                  <p className="text-xs text-gray-500">#3b82f6</p>
                </div>
                <div>
                  <div className="h-20 bg-gray-500 rounded-lg mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Gray (Repealed)</p>
                  <p className="text-xs text-gray-500">#6b7280</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Neutral Colors</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {[50, 100, 200, 500, 700, 900].map((shade) => (
                  <div key={shade}>
                    <div className={`h-16 bg-gray-${shade} rounded-lg mb-2 ${shade === 50 ? 'border border-gray-200' : ''}`}></div>
                    <p className="text-sm font-medium text-gray-900">Gray {shade}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Typography</h2>
            <p className="text-gray-600">Font styles and text sizes</p>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Heading 1 - 4xl Bold</h1>
                <code className="text-xs text-gray-500">text-4xl font-bold</code>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Heading 2 - 3xl Bold</h2>
                <code className="text-xs text-gray-500">text-3xl font-bold</code>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Heading 3 - 2xl Bold</h3>
                <code className="text-xs text-gray-500">text-2xl font-bold</code>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Heading 4 - xl Semibold</h4>
                <code className="text-xs text-gray-500">text-xl font-semibold</code>
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-900 mb-2">Heading 5 - lg Semibold</h5>
                <code className="text-xs text-gray-500">text-lg font-semibold</code>
              </div>
              <div>
                <p className="text-base text-gray-900 mb-2">Body text - Base Regular</p>
                <code className="text-xs text-gray-500">text-base</code>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Small text - sm Regular</p>
                <code className="text-xs text-gray-500">text-sm text-gray-600</code>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Extra small text - xs Regular</p>
                <code className="text-xs text-gray-500">text-xs text-gray-500</code>
              </div>
            </div>
          </Card>
        </section>

        {/* World Clocks Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">World Clocks</h2>
            <p className="text-gray-600">Real-time analogue clocks for global jurisdictions</p>
          </div>

          <div className="space-y-8">
            {/* Single Clock Display */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Clock Display</h3>
              <Card className="p-8">
                <div className="flex items-center justify-center">
                  <WorldClocks />
                </div>
              </Card>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2"><strong>Features:</strong></p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Real-time analogue clocks with hour, minute, and second hands</li>
                  <li>• Covers major policy jurisdictions: NYC, LA, London, Brussels, Tokyo, Sydney</li>
                  <li>• Smooth transitions and accurate timezone calculations</li>
                  <li>• Responsive design with clear city labels</li>
                </ul>
              </div>
            </div>

            {/* Usage Example */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">In Context</h3>
              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Global Policy Tracking</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Track policy updates across major global jurisdictions in real-time. Perfect for international policy monitoring and coordination.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">New Updates Today</span>
                        <span className="font-bold text-blue-600">47</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Policies</span>
                        <span className="font-bold text-green-600">156</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <WorldClocks />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            iGRAIL Component Gallery - All components are customizable via Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
