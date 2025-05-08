'use client';

import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import { Zap } from 'lucide-react';
import SituationCard from './SituationCard';
import { socialSituations } from '@/lib/situations/social';

export default function QuickTraining() {
  const router = useRouter();

  const handleSituationClick = (situationId: string) => {
    router.push(`/quick-training/${situationId}`);
  };

  // Check if a situation is locked (has [Coming Soon] in the context)
  const isLocked = (context: string) => context.includes('[Coming Soon]');

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="md:pl-64 transition-all duration-200">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 rounded-full bg-[#F39C12] bg-opacity-10">
              <Zap size={32} className="text-[#F39C12]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50]">Quick Training</h1>
              <p className="text-[#7F8C8D] mt-1">Choose a scenario to start practicing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialSituations.map((situation) => (
              <SituationCard
                key={situation.id}
                situation={situation}
                onClick={() => handleSituationClick(situation.id)}
                isLocked={isLocked(situation.context)}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#7F8C8D] text-sm">
              More scenarios coming soon! We&apos;re carefully crafting each situation to provide the best practice experience.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 