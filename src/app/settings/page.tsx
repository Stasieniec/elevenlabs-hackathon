'use client';

import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Navigation from '../components/Navigation';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useUser();
  const clerk = useClerk();
  const [isResetting, setIsResetting] = useState(false);

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

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      <div className="container mx-auto mt-8 px-4 space-y-12 pb-12">
        <section>
          <h2 className="text-3xl font-bold text-neutral-dark mb-6">Settings</h2>
          <p className="text-neutral text-lg mb-8">
            Manage your account settings and preferences.
          </p>
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