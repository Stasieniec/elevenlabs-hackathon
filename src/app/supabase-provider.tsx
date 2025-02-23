'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';
import { Database } from '../lib/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type SupabaseContextType = {
  supabase: SupabaseClient<Database> | null;
  isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  isLoading: true,
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSupabase = async () => {
      try {
        if (!session) {
          // If no session, use anonymous client
          const anonClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
          setSupabase(anonClient);
        } else {
          // Get Supabase token from Clerk session
          const token = await session.getToken({ template: 'supabase' });
          if (!token) {
            throw new Error('Failed to get Supabase token from Clerk session');
          }

          // Create authenticated client
          const authClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
            global: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          });
          setSupabase(authClient);
        }
      } catch (error) {
        console.error('Error initializing Supabase client:', error);
        // Fallback to anonymous client on error
        const anonClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
        setSupabase(anonClient);
      } finally {
        setIsLoading(false);
      }
    };

    initSupabase();
  }, [session]);

  return (
    <SupabaseContext.Provider value={{ supabase, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  return useContext(SupabaseContext);
}; 