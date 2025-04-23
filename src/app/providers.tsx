'use client';

import { ClerkProvider, useUser } from '@clerk/nextjs';
import { SupabaseProvider } from './supabase-provider';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useEffect, useState } from 'react';

function EnsureSupabaseUser({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const supabase = useSupabaseAuth();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!user || !supabase) return;
    let cancelled = false;
    const syncUser = async () => {
      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
      if (!data) {
        await supabase.from('users').insert({
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          first_name: user.firstName,
          last_name: user.lastName,
          avatar_url: user.imageUrl,
        });
      }
      if (!cancelled) setReady(true);
    };
    syncUser();
    return () => { cancelled = true; };
  }, [user, supabase]);
  if (!user || !supabase || !ready) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading your profile...</div>;
  }
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <SupabaseProvider>
        <EnsureSupabaseUser>{children}</EnsureSupabaseUser>
      </SupabaseProvider>
    </ClerkProvider>
  );
} 