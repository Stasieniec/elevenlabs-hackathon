'use client';

import { useParams } from 'next/navigation';
import Navigation from '../../components/Navigation';
import { mockSituations } from '../mockSituations';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function QuickTrainingSession() {
  const params = useParams();
  const situationId = params.situationId as string;
  
  const situation = mockSituations.find(s => s.id === situationId);
  
  if (!situation) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 pt-20">
          <p className="text-[#2C3E50] text-lg">Situation not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <Link 
            href="/quick-training"
            className="inline-flex items-center text-[#7F8C8D] hover:text-[#2C3E50] transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Quick Training
          </Link>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-4">{situation.title}</h1>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[#2C3E50] mb-2">Context</h2>
              <p className="text-[#34495E]">{situation.context}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#2C3E50] mb-2">Your Goal</h2>
              <p className="text-[#34495E]">{situation.userGoal}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#2C3E50] mb-2">AI Role</h2>
              <p className="text-[#34495E]">{situation.aiRole}</p>
            </div>
          </div>
        </div>

        {/* TODO: Add chat interface here */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <p className="text-[#34495E] text-center">
            Chat interface coming soon...
          </p>
        </div>
      </div>
    </main>
  );
} 