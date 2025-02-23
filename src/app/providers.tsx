'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { SupabaseProvider } from './supabase-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <SupabaseProvider>
        {children}
      </SupabaseProvider>
    </ClerkProvider>
  );
} 