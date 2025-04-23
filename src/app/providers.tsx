'use client';

import { useUser } from '@clerk/nextjs';
import { SupabaseProvider, useSupabase } from './supabase-provider';
import { useEffect, useState } from 'react';

function EnsureSupabaseUser({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const supabase = useSupabase().supabase;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!user || !supabase) return;
    let cancelled = false;
    let timeoutId: NodeJS.Timeout;
    const syncUser = async () => {
      try {
        console.log('[EnsureSupabaseUser] Starting user sync');
        console.log('[EnsureSupabaseUser] Clerk user:', user);
        console.log('[EnsureSupabaseUser] Supabase client:', supabase);
        const userId = user.id;
        // Timeout fallback
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            setError('Provisioning your profile is taking too long. Please refresh or contact support.');
            console.error('[EnsureSupabaseUser] Timeout: stuck on user provisioning');
          }
        }, 10000); // 10 seconds
        // Check if user exists in Supabase
        console.log('[EnsureSupabaseUser] Checking if user exists in Supabase:', userId);
        const { data, error: selectError } = await supabase
          .from('users')
          .select('id')
          .eq('id', userId)
          .single();
        console.log('[EnsureSupabaseUser] Supabase select result:', { data, selectError });
        if (selectError && selectError.code !== 'PGRST116') {
          setError('Error checking user: ' + selectError.message);
          console.error('[EnsureSupabaseUser] Error checking user:', selectError);
          clearTimeout(timeoutId);
          return;
        }
        if (!data) {
          // Insert user row
          console.log('[EnsureSupabaseUser] User not found, inserting...');
          const { error: insertError } = await supabase.from('users').insert({
            id: userId,
            email: user.emailAddresses[0]?.emailAddress,
            first_name: user.firstName,
            last_name: user.lastName,
            avatar_url: user.imageUrl,
          });
          if (insertError) {
            setError('Error creating user: ' + insertError.message);
            console.error('[EnsureSupabaseUser] Error creating user:', insertError);
            clearTimeout(timeoutId);
            return;
          } else {
            console.log('[EnsureSupabaseUser] User row created in Supabase:', userId);
          }
        } else {
          console.log('[EnsureSupabaseUser] User row already exists in Supabase:', userId);
        }
        if (!cancelled) setReady(true);
        clearTimeout(timeoutId);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError('Unexpected error: ' + e.message);
          console.error('[EnsureSupabaseUser] Unexpected error:', e);
        } else {
          setError('Unexpected error');
          console.error('[EnsureSupabaseUser] Unexpected error:', e);
        }
      }
    };
    syncUser();
    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, [user, supabase]);
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-red-600">{error}</div>;
  }
  if (!user || !supabase || !ready) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading your profile...</div>;
  }
  return <>{children}</>;
}

export default function ProtectedPageProviders({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <EnsureSupabaseUser>{children}</EnsureSupabaseUser>
    </SupabaseProvider>
  );
} 