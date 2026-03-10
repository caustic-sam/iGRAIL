'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import type { AuthContextType, UserProfile, UserRole } from '@/lib/auth/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  );
  const router = useRouter();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          setLoading(false);
          return;
        }

        console.log('🔐 Auth check - session exists:', !!session);

        if (session?.user) {
          console.log('👤 User ID:', session.user.id);
          console.log('📧 Email:', session.user.email);

          // Fetch user profile with role - with timeout (reduced from 2000ms to 1000ms)
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Profile fetch timeout')), 1000)
          );

          const profilePromise = supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const { data: profile, error } = await Promise.race([
            profilePromise,
            timeoutPromise
          ]) as { data: any; error: any };

          console.log('👤 Profile fetch result:', { profile, error });

          if (error) {
            console.error('❌ Profile fetch error:', error);
            // Still set loading to false even on error
            setLoading(false);
            return;
          }

          if (profile) {
            console.log('✅ User profile loaded:', profile.email, 'Role:', profile.role);
            setUser(profile);
          } else {
            console.warn('⚠️ No profile found for user, but no error returned');
          }
        } else {
          console.log('❌ No active session');
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, 'Session:', !!session);

        if (session?.user) {
          // Fetch fresh profile data
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('❌ Profile fetch error on auth change:', error);
          }

          if (profile) {
            console.log('✅ Profile updated from auth change:', profile.email);
            setUser(profile);
          }
        } else {
          setUser(null);
        }

        setLoading(false);
        router.refresh();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
