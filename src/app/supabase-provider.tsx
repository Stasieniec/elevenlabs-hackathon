'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';
import { Database } from '../lib/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type SupabaseContextType = {
  supabase: SupabaseClient<Database> | null;
};

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null);

  useEffect(() => {
    const initSupabase = async () => {
      try {
        if (!session) {
          const anonClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
          setSupabase(anonClient);
        } else {
          const token = await session.getToken({ template: 'supabase' });
          if (!token) {
            throw new Error('Failed to get Supabase token from Clerk session');
          }
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
        const anonClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
        setSupabase(anonClient);
      }
    };
    initSupabase();
  }, [session]);

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  return useContext(SupabaseContext);
}; 