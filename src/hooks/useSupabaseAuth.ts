import { useEffect, useState } from 'react';
import { useSession } from '@clerk/nextjs';
import { createClerkSupabaseClient } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export const useSupabaseAuth = () => {
  const { session } = useSession();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    const initSupabase = async () => {
      if (!session) {
        setSupabase(null);
        return;
      }

      try {
        const client = await createClerkSupabaseClient(session);
        setSupabase(client);
      } catch (err) {
        console.error('Error initializing Supabase client:', err);
        setSupabase(null);
      }
    };

    initSupabase();
  }, [session]);

  return supabase;
}; 