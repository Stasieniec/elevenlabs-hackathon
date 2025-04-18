'use client';

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Navigation from '../components/Navigation';
import { Loader2, Key, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function SettingsPage() {
  const { user } = useUser();
  const clerk = useClerk();
  const supabase = useSupabaseAuth();
  const [isResetting, setIsResetting] = useState(false);
  const [isDeletingKeys, setIsDeletingKeys] = useState(false);
  const [isSavingElevenLabsKey, setIsSavingElevenLabsKey] = useState(false);
  const [isSavingFalAiKey, setIsSavingFalAiKey] = useState(false);
  const [showElevenLabsKey, setShowElevenLabsKey] = useState(false);
  const [showFalAiKey, setShowFalAiKey] = useState(false);
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [falAiKey, setFalAiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [elevenLabsError, setElevenLabsError] = useState<string | null>(null);
  const [falAiError, setFalAiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [elevenLabsSuccess, setElevenLabsSuccess] = useState<string | null>(null);
  const [falAiSuccess, setFalAiSuccess] = useState<string | null>(null);

  // Load existing API keys
  const loadApiKeys = async () => {
    if (!user?.id || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('elevenlabs_api_key_encrypted, fal_ai_api_key_encrypted')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        if (data.elevenlabs_api_key_encrypted) setElevenLabsKey('••••••••');
        if (data.fal_ai_api_key_encrypted) setFalAiKey('••••••••');
      } else {
        // No keys found, reset the input fields
        setElevenLabsKey('');
        setFalAiKey('');
      }
    } catch (err) {
      console.error('Error loading API keys:', err);
    }
  };

  // Initial load of API keys
  useEffect(() => {
    loadApiKeys();
  }, [user?.id, supabase]);

  const handleSaveElevenLabsKey = async () => {
    if (!user?.id || !supabase || isSavingElevenLabsKey || elevenLabsKey === '') return;

    setIsSavingElevenLabsKey(true);
    setElevenLabsError(null);
    setElevenLabsSuccess(null);

    try {
      // Check if the key is being updated
      const isUpdatingElevenLabs = elevenLabsKey !== '' && elevenLabsKey !== '••••••••';

      if (!isUpdatingElevenLabs) {
        throw new Error('Please provide an ElevenLabs API key');
      }

      // Simple format validation
      if (elevenLabsKey.length < 32) {
        throw new Error('ElevenLabs API key appears to be invalid');
      }

      // Validate the key
      const validationResponse = await fetch('/api/validate-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ elevenLabsKey }),
      });

      if (!validationResponse.ok) {
        throw new Error('Failed to validate ElevenLabs API key');
      }

      const validationResults = await validationResponse.json();

      if (!validationResults.elevenlabs) {
        throw new Error('Invalid ElevenLabs API key');
      }

      // Update or insert the API key
      const { error: upsertError } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: user.id,
          elevenlabs_api_key_encrypted: elevenLabsKey
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;

      setElevenLabsSuccess('ElevenLabs API key saved successfully');
      
      // Mask the key after saving
      setElevenLabsKey('••••••••');
      setShowElevenLabsKey(false);
    } catch (err) {
      console.error('Error saving ElevenLabs API key:', err);
      setElevenLabsError(err instanceof Error ? err.message : 'Failed to save ElevenLabs API key');
    } finally {
      setIsSavingElevenLabsKey(false);
    }
  };

  const handleSaveFalAiKey = async () => {
    if (!user?.id || !supabase || isSavingFalAiKey || falAiKey === '') return;

    setIsSavingFalAiKey(true);
    setFalAiError(null);
    setFalAiSuccess(null);

    try {
      // Check if the key is being updated
      const isUpdatingFalAi = falAiKey !== '' && falAiKey !== '••••••••';

      if (!isUpdatingFalAi) {
        throw new Error('Please provide a fal.ai API key');
      }

      // Simple format validation
      if (falAiKey.length < 32) {
        throw new Error('fal.ai API key appears to be invalid');
      }

      // Validate the key
      const validationResponse = await fetch('/api/validate-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ falAiKey }),
      });

      if (!validationResponse.ok) {
        throw new Error('Failed to validate fal.ai API key');
      }

      const validationResults = await validationResponse.json();

      if (!validationResults.falai) {
        throw new Error('Invalid fal.ai API key');
      }

      // Update or insert the API key
      const { error: upsertError } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: user.id,
          fal_ai_api_key_encrypted: falAiKey
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;

      setFalAiSuccess('fal.ai API key saved successfully');
      
      // Mask the key after saving
      setFalAiKey('••••••••');
      setShowFalAiKey(false);
    } catch (err) {
      console.error('Error saving fal.ai API key:', err);
      setFalAiError(err instanceof Error ? err.message : 'Failed to save fal.ai API key');
    } finally {
      setIsSavingFalAiKey(false);
    }
  };

  const handleResetOnboarding = async () => {
    if (!user || isResetting) return;

    setIsResetting(true);
    try {
      console.log('Current metadata:', user.unsafeMetadata);
      
      // First, set the metadata using the Clerk API
      await clerk.user?.update({
        unsafeMetadata: {
          onboardingComplete: false
        }
      });

      // Get the updated user to verify
      const updatedUser = await clerk.user?.reload();
      console.log('Updated metadata:', updatedUser?.unsafeMetadata);

      // Get a fresh session
      if (clerk.session) {
        await clerk.session.touch();
        console.log('Session touched');
      }

      // Reload the page to reflect changes
      window.location.reload();
    } catch (err) {
      console.error('Error resetting onboarding:', err);
      alert('Failed to reset onboarding. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteKeys = async () => {
    if (!user?.id || !supabase || isDeletingKeys) {
      console.log('Early return conditions:', { 
        hasUserId: !!user?.id, 
        hasSupabase: !!supabase, 
        isDeletingKeys 
      });
      return;
    }

    if (!confirm('Are you sure you want to delete your API keys? This cannot be undone.')) {
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsDeletingKeys(true);

    try {
      console.log('Attempting to delete API keys for user:', user.id);
      
      // First, check if keys exist
      const { data: existingKeys, error: checkError } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (checkError) {
        console.error('Error checking existing keys:', checkError);
        throw new Error('Failed to check existing keys');
      }

      if (!existingKeys) {
        console.log('No keys found to delete');
        throw new Error('No API keys found to delete');
      }

      console.log('Found existing keys:', existingKeys);

      // Delete the API keys from Supabase
      const { error: deleteError } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error deleting keys:', deleteError);
        throw deleteError;
      }

      // Verify deletion
      const { data: verifyKeys, error: verifyError } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (verifyError && verifyError.code !== 'PGRST116') {
        console.error('Error verifying deletion:', verifyError);
        throw new Error('Failed to verify key deletion');
      }

      if (verifyKeys) {
        console.error('Keys still exist after deletion!');
        throw new Error('Failed to delete API keys - they still exist in the database');
      }

      console.log('Successfully verified keys are deleted');

      // Reset all key-related states
      setElevenLabsKey('');
      setFalAiKey('');
      setShowElevenLabsKey(false);
      setShowFalAiKey(false);
      setElevenLabsError(null);
      setFalAiError(null);
      setElevenLabsSuccess(null);
      setFalAiSuccess(null);
      
      // Show success message
      setSuccessMessage('API keys deleted successfully');

      // Update Clerk metadata to indicate no API keys and reset free conversations
      await clerk.user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          hasApiKeys: false,
          freeConversationsLeft: 3
        }
      });

      // Force a session refresh
      await user.reload();
      if (clerk.session) {
        await clerk.session.touch();
      }

      // Force reload all data
      await loadApiKeys();
      
      // Hard redirect to dashboard with cache busting
      window.location.href = `/dashboard?t=${Date.now()}`;
    } catch (err) {
      console.error('Error in handleDeleteKeys:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete API keys');
    } finally {
      setIsDeletingKeys(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      <div className="md:pl-64 transition-all duration-200">
        <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <p className="text-green-800">{successMessage}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <section>
            <h2 className="text-3xl font-bold text-neutral-dark mb-6">Settings</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Information About API Keys</h3>
              <p className="text-blue-700 mb-4">
                To use the conversation practice features, you&apos;ll need to provide your own API keys for ElevenLabs and fal.ai. 
                Since these services can be expensive to run, I have to ask users to use their own API keys.
              </p>
              <div className="space-y-2 text-blue-700">
                <p className="mb-4">For security, I recommend:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Creating new API keys specifically for this app</li>
                  <li>Deleting the keys after you&apos;re done practicing</li>
                  <li>Setting usage limits in both platforms</li>
                </ul>
              </div>
              <p className="text-blue-700 mt-4">
                Your API keys are encrypted at rest in the database and are only accessible by you. I used encryption and Supabase&apos;s Row Level Security (RLS) 
                to ensure each user can only access their own keys. Still, if it ends up getting stolen, I&apos;m not responsible - I warned you and I dont have the money to deal with lawsuits!
              </p>
            </div>
          </section>

          {/* API Keys Section */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-dark">API Keys</h3>
                <p className="text-sm text-neutral">Manage your API keys for ElevenLabs and fal.ai</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* ElevenLabs API Key */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  ElevenLabs API Key
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type={showElevenLabsKey ? "text" : "password"}
                      value={elevenLabsKey}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        // Only update if the value is empty or not masked
                        if (newValue === '' || elevenLabsKey === '' || elevenLabsKey === '••••••••') {
                          setElevenLabsKey(newValue);
                        }
                      }}
                      placeholder="Enter your ElevenLabs API key"
                      className="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        // Only toggle visibility if there's a value and it's not masked
                        if (elevenLabsKey && elevenLabsKey !== '••••••••') {
                          setShowElevenLabsKey(!showElevenLabsKey);
                        }
                      }}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        elevenLabsKey && elevenLabsKey !== '••••••••'
                          ? 'text-neutral hover:text-neutral-dark cursor-pointer'
                          : 'text-neutral/50 cursor-not-allowed'
                      }`}
                    >
                      {showElevenLabsKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {elevenLabsError && (
                    <div className="text-sm text-red-600">{elevenLabsError}</div>
                  )}
                  {elevenLabsSuccess && (
                    <div className="text-sm text-green-600">{elevenLabsSuccess}</div>
                  )}
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-neutral">
                      Get your API key from <a href="https://elevenlabs.io/subscription" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">ElevenLabs Dashboard</a>
                    </p>
                    <button
                      onClick={handleSaveElevenLabsKey}
                      disabled={isSavingElevenLabsKey || elevenLabsKey === ''}
                      className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSavingElevenLabsKey ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save ElevenLabs Key'
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* fal.ai API Key */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  fal.ai API Key
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type={showFalAiKey ? "text" : "password"}
                      value={falAiKey}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        // Only update if the value is empty or not masked
                        if (newValue === '' || falAiKey === '' || falAiKey === '••••••••') {
                          setFalAiKey(newValue);
                        }
                      }}
                      placeholder="Enter your fal.ai API key"
                      className="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        // Only toggle visibility if there's a value and it's not masked
                        if (falAiKey && falAiKey !== '••••••••') {
                          setShowFalAiKey(!showFalAiKey);
                        }
                      }}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        falAiKey && falAiKey !== '••••••••'
                          ? 'text-neutral hover:text-neutral-dark cursor-pointer'
                          : 'text-neutral/50 cursor-not-allowed'
                      }`}
                    >
                      {showFalAiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {falAiError && (
                    <div className="text-sm text-red-600">{falAiError}</div>
                  )}
                  {falAiSuccess && (
                    <div className="text-sm text-green-600">{falAiSuccess}</div>
                  )}
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-neutral">
                      Get your API key from <a href="https://fal.ai/dashboard/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">fal.ai Dashboard</a>
                    </p>
                    <button
                      onClick={handleSaveFalAiKey}
                      disabled={isSavingFalAiKey || falAiKey === ''}
                      className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSavingFalAiKey ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save fal.ai Key'
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={handleDeleteKeys}
                  disabled={isDeletingKeys}
                  className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeletingKeys ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete Keys
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-neutral-dark mb-4">Developer Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-neutral-dark">Onboarding Status</h4>
                  <p className="text-sm text-neutral">Reset your onboarding status to test the onboarding flow.</p>
                </div>
                <button
                  onClick={handleResetOnboarding}
                  disabled={isResetting}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Onboarding'
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 