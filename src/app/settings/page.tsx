'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Navigation from '../components/Navigation';
import { Loader2 } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function SettingsPage() {
  const { user } = useUser();
  const supabase = useSupabaseAuth();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetOnboarding = async () => {
    if (!user || !supabase || isResetting) return;

    setIsResetting(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ onboarding_completed: false })
        .eq('id', user.id);
      if (error) throw error;
      window.location.reload();
    } catch {
      alert('Failed to reset onboarding. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      <div className="md:pl-64 transition-all duration-200">
        <div className="container mx-auto px-4 py-8 space-y-12">
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-dark mb-4">Settings</h2>
            <button
              onClick={handleResetOnboarding}
              className="bg-secondary text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
              disabled={isResetting}
            >
              {isResetting ? <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" /> : null}
              Reset Onboarding
            </button>
          </section>
        </div>
      </div>
    </main>
  );
} 