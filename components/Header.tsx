'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X, Settings, User, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { ComingSoonModal } from '@/components/ui/ComingSoonModal';
import { useComingSoon } from '@/hooks/useComingSoon';

const navItems = [
  { id: 'home', label: 'Policy Updates', href: '/policy-updates' },
  { id: 'analysis', label: 'Think Tank', href: '/blog' },
  { id: 'videos', label: 'Global Service Announcement', href: '/videos' },
  { id: 'policy-pulse', label: 'Policy Pulse', href: '/policy-pulse' },
  { id: 'policies', label: 'Policies', href: '/policies' },
  { id: 'about', label: 'About', href: '/about' }
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  // Remote avatars can fail for plenty of boring reasons: expired URLs, provider
  // changes, or missing domains in Next.js image config. We keep one explicit flag
  // so the UI can fall back to the generic icon after the first failure.
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const { isOpen, feature, showComingSoon, closeModal } = useComingSoon();
  // This derived value keeps the JSX simpler: either we have a usable avatar URL,
  // or we intentionally render the fallback icon.
  const avatarUrl = user?.avatar_url && !avatarLoadFailed ? user.avatar_url : null;

  return (
    <header className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] border-b border-blue-900/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-base leading-tight">iGRAIL</div>
              <div className="text-blue-200 text-xs">Global Policy Intelligence</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-white bg-white/10'
                    : 'text-blue-100 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-20 bg-white/10" />
                <Skeleton className="h-9 w-24 bg-white/10 rounded-full" />
              </div>
            ) : user ? (
              <>
                <Link
                  href="/admin/studio"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-blue-100 hover:text-white hover:bg-white/10"
                >
                  <Settings className="w-4 h-4" />
                  <span>Studio</span>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-blue-100 hover:text-white hover:bg-white/10"
                  >
                    {avatarUrl ? (
                      // `unoptimized` is intentional here because avatar URLs may come
                      // from user-controlled providers that are not worth routing through
                      // the image optimizer just to render a 24px menu icon.
                      <Image
                        src={avatarUrl}
                        alt={user.email?.split('@')[0] || 'User'}
                        width={24}
                        height={24}
                        unoptimized
                        className="w-6 h-6 rounded-full"
                        onError={() => {
                          console.error('Avatar failed to load:', avatarUrl);
                          setAvatarLoadFailed(true);
                        }}
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span>{user.email?.split('@')[0]}</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : !loading ? (
              <>
                <Link href="/login">
                  <Button variant="secondary" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Button variant="coming-soon" size="sm" onClick={() => showComingSoon('Newsletter Subscription')}>
                  Subscribe
                </Button>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-blue-900/20 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f]">
          <div className="px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-white bg-white/10'
                    : 'text-blue-100 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/studio"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-blue-100 hover:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="w-4 h-4" />
              <span>Studio</span>
            </Link>
            <div className="pt-2">
              <Button variant="coming-soon" size="sm" className="w-full" onClick={() => showComingSoon('Newsletter Subscription')}>
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      <ComingSoonModal isOpen={isOpen} onClose={closeModal} feature={feature} />
    </header>
  );
}
