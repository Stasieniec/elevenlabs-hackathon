import Navigation from '../components/Navigation';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 rounded-full bg-[#34495E] bg-opacity-10">
            <Settings size={32} className="text-[#34495E]" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Settings</h1>
        </div>

        {/* Placeholder content */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <p className="text-[#34495E] text-lg">
            Settings page is coming soon! Here you&apos;ll be able to customize your learning experience.
          </p>
        </div>
      </div>
    </main>
  );
} 