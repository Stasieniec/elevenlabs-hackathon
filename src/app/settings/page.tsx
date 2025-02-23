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
  const [isSavingKeys, setIsSavingKeys] = useState(false);
  const [showElevenLabsKey, setShowElevenLabsKey] = useState(false);
  const [showFalAiKey, setShowFalAiKey] = useState(false);
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [falAiKey, setFalAiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load existing API keys
  useEffect(() => {
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
        }
      } catch (err) {
        console.error('Error loading API keys:', err);
      }
    };

    loadApiKeys();
  }, [user?.id, supabase]);

  const handleSaveApiKeys = async () => {
    if (!user?.id || !supabase || isSavingKeys) return;

    setIsSavingKeys(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Check if at least one key is being updated
      const isUpdatingElevenLabs = elevenLabsKey !== '' && elevenLabsKey !== '••••••••';
      const isUpdatingFalAi = falAiKey !== '' && falAiKey !== '••••••••';

      if (!isUpdatingElevenLabs && !isUpdatingFalAi) {
        throw new Error('Please provide at least one API key');
      }

      // Simple format validation for keys being updated
      if (isUpdatingElevenLabs && elevenLabsKey.length < 32) {
        throw new Error('ElevenLabs API key appears to be invalid');
      }
      if (isUpdatingFalAi && falAiKey.length < 32) {
        throw new Error('fal.ai API key appears to be invalid');
      }

      // Only validate keys that are being updated (not masked)
      const keysToValidate = {
        elevenLabsKey: isUpdatingElevenLabs ? elevenLabsKey : undefined,
        falAiKey: isUpdatingFalAi ? falAiKey : undefined
      };

      // If there are keys to validate, validate them
      if (keysToValidate.elevenLabsKey || keysToValidate.falAiKey) {
        const validationResponse = await fetch('/api/validate-keys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(keysToValidate),
        });

        if (!validationResponse.ok) {
          throw new Error('Failed to validate API keys');
        }

        const validationResults = await validationResponse.json();

        // Check validation results
        if (keysToValidate.elevenLabsKey && !validationResults.elevenlabs) {
          throw new Error('Invalid ElevenLabs API key');
        }
        if (keysToValidate.falAiKey && !validationResults.falai) {
          throw new Error('Invalid fal.ai API key');
        }
      }

      // Update or insert the API keys
      const { error: upsertError } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: user.id,
          elevenlabs_api_key_encrypted: isUpdatingElevenLabs ? elevenLabsKey : undefined,
          fal_ai_api_key_encrypted: isUpdatingFalAi ? falAiKey : undefined
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;

      setSuccessMessage('API keys saved successfully');
      
      // Mask the keys after saving
      if (isUpdatingElevenLabs) setElevenLabsKey('••••••••');
      if (isUpdatingFalAi) setFalAiKey('••••••••');
      
      setShowElevenLabsKey(false);
      setShowFalAiKey(false);
    } catch (err) {
      console.error('Error saving API keys:', err);
      setError(err instanceof Error ? err.message : 'Failed to save API keys');
    } finally {
      setIsSavingKeys(false);
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
    if (!user?.id || !supabase || isSavingKeys) return;

    if (!confirm('Are you sure you want to delete your API keys? This cannot be undone.')) {
      return;
    }

    setIsSavingKeys(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error: deleteError } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setElevenLabsKey('');
      setFalAiKey('');
      setSuccessMessage('API keys deleted successfully');
    } catch (err) {
      console.error('Error deleting API keys:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete API keys');
    } finally {
      setIsSavingKeys(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      <div className="container mx-auto mt-8 px-4 space-y-12 pb-12">
        <section>
          <h2 className="text-3xl font-bold text-neutral-dark mb-6">Settings</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Information About API Keys</h3>
            <p className="text-blue-700 mb-4">
              To use the conversation practice features, you'll need to provide your own API keys for ElevenLabs and fal.ai. 
              Since these services can be expensive to run, I have to ask users to use their own API keys.
            </p>
            <p className="text-blue-700 mb-4">
              For security, I recommend:
              1. Creating new API keys specifically for this app
              2. Deleting the keys after you're done practicing
              3. Setting usage limits in both platforms
            </p>
            <p className="text-blue-700">
              Your API keys are encrypted at rest in the database and are only accessible by you. I used encryption and Supabase's Row Level Security (RLS) 
              to ensure each user can only access their own keys. Still, if it ends up getting stolen, I'm not responsible - I warned you and I dont have the money to go to court!
            </p>
          </div>
        </section>

        {/* API Keys Section */}
        <section>
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-dark">API Keys</h3>
                <p className="text-sm text-neutral">Manage your API keys for ElevenLabs and fal.ai</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {successMessage}
              </div>
            )}

            <div className="space-y-6">
              {/* ElevenLabs API Key */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  ElevenLabs API Key
                </label>
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
                <p className="mt-1 text-xs text-neutral">
                  Get your API key from <a href="https://elevenlabs.io/subscription" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">ElevenLabs Dashboard</a>
                </p>
              </div>

              {/* fal.ai API Key */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  fal.ai API Key
                </label>
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
                <p className="mt-1 text-xs text-neutral">
                  Get your API key from <a href="https://fal.ai/dashboard/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">fal.ai Dashboard</a>
                </p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleDeleteKeys}
                  disabled={isSavingKeys || (!elevenLabsKey && !falAiKey)}
                  className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Keys
                </button>

                <button
                  onClick={handleSaveApiKeys}
                  disabled={isSavingKeys || (elevenLabsKey === '' && falAiKey === '')}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSavingKeys ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save API Keys'
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white rounded-xl p-6">
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
          </div>
        </section>
      </div>
    </main>
  );
} 