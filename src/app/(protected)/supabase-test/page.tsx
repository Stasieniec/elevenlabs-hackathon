'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSupabase } from '../../supabase-provider'; // Adjust path if necessary
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../lib/database.types'; // Adjust path if necessary

export default function SupabaseTestPage() {
  const { user } = useUser();
  const { supabase } = useSupabase(); // Destructure to get the client directly

  const [envUrl, setEnvUrl] = useState<string | undefined>(undefined);
  const [envKey, setEnvKey] = useState<string | undefined>(undefined);
  const [clientStatus, setClientStatus] = useState<string>('Checking...');
  const [testData, setTestData] = useState<unknown[] | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  // Log environment variables as seen by this component
  useEffect(() => {
    console.log('[SupabaseTestPage] Mounted');
    setEnvUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
    setEnvKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('[SupabaseTestPage] NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('[SupabaseTestPage] NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  // Check Supabase client and perform a test query
  useEffect(() => {
    console.log('[SupabaseTestPage] Supabase client from context:', supabase);
    if (supabase) {
      setClientStatus('Client instance received from context. Performing test query...');
      const performTestQuery = async (sbClient: SupabaseClient<Database>) => {
        try {
          console.log('[SupabaseTestPage] Attempting to fetch from \'categories\' table...');
          const { data, error } = await sbClient.from('categories').select('*').limit(5);
          console.log('[SupabaseTestPage] Query result - Data:', data, 'Error:', error);
          if (error) {
            throw error;
          }
          setTestData(data);
          setTestError(null);
          setClientStatus('Test query successful!');
        } catch (e: unknown) {
          console.error('[SupabaseTestPage] Test query error:', e);
          if (e instanceof Error) {
            setTestError(`Query failed: ${e.message}`);
          } else {
            setTestError('Query failed: Unknown error');
          }
          setTestData(null);
          setClientStatus('Test query FAILED.');
        }
      };
      performTestQuery(supabase);
    } else {
      setClientStatus('Supabase client from context is NULL.');
      console.log('[SupabaseTestPage] Supabase client is null, cannot query.');
    }
  }, [supabase]); // Re-run when supabase client instance changes

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Supabase Connection Test Page</h1>

        <div className="mb-6 p-4 border border-gray-200 rounded-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Clerk User Status</h2>
          {user ? (
            <div>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
            </div>
          ) : (
            <p className="text-red-500">User not loaded or not signed in.</p>
          )}
        </div>

        <div className="mb-6 p-4 border border-gray-200 rounded-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Environment Variables (Client-Side)</h2>
          <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> <span className={envUrl ? 'text-green-600' : 'text-red-500'}>{envUrl || 'NOT FOUND'}</span></p>
          <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> <span className={envKey ? 'text-green-600' : 'text-red-500'}>{envKey?.substring(0, 20) + '...' || 'NOT FOUND'}</span></p>
        </div>

        <div className="mb-6 p-4 border border-gray-200 rounded-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Supabase Client Status</h2>
          <p className={supabase ? 'text-green-600' : 'text-red-500'}>{clientStatus}</p>
        </div>

        {supabase && (
          <div className="mb-6 p-4 border border-gray-200 rounded-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Test Query Data (&apos;categories&apos; table, limit 5)</h2>
            {testError && <p className="text-red-500 mb-2"><strong>Error:</strong> {testError}</p>}
            {testData ? (
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(testData, null, 2)}
              </pre>
            ) : (
              <p>No data returned from test query or query not run.</p>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>

      </div>
    </div>
  );
} 