import Navigation from '../components/Navigation';
import { PlusCircle } from 'lucide-react';

export default function CustomSituation() {
  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 rounded-full bg-[#27AE60] bg-opacity-10">
            <PlusCircle size={32} className="text-[#27AE60]" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Custom Situation</h1>
        </div>

        {/* Placeholder content */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <p className="text-[#34495E] text-lg">
            Custom Situation feature is coming soon! Here you&apos;ll be able to create and practice your own conversation scenarios.
          </p>
        </div>
      </div>
    </main>
  );
} 