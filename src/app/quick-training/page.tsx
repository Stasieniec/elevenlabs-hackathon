import Navigation from '../components/Navigation';
import { Zap } from 'lucide-react';

export default function QuickTraining() {
  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 rounded-full bg-[#F39C12] bg-opacity-10">
            <Zap size={32} className="text-[#F39C12]" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Quick Training</h1>
        </div>

        {/* Placeholder content */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <p className="text-[#34495E] text-lg">
            Quick Training feature is coming soon! Here you'll be able to practice with random conversation scenarios.
          </p>
        </div>
      </div>
    </main>
  );
} 