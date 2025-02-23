'use client';

import { useState } from 'react';
import { ArrowLeft, MessageCircle, Target, UserCircle2, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { QuickTrainingSituation } from '@/lib/types/situations';
import { difficultyColors } from '@/lib/constants/colors';

interface SituationConversationTemplateProps {
  situation: QuickTrainingSituation;
  onStartPractice?: () => void;
  onEndPractice?: () => void;
  isSpeaking?: boolean;
  isConnected?: boolean;
  children?: React.ReactNode;
}

export default function SituationConversationTemplate({
  situation,
  isSpeaking = false,
  isConnected = false,
  children
}: SituationConversationTemplateProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const difficultyStyle = difficultyColors[situation.difficulty];

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        {/* Header with back button */}
        <div className="mb-8">
          <Link 
            href="/quick-training"
            className="inline-flex items-center text-[#7F8C8D] hover:text-[#2C3E50] transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Quick Training
          </Link>
        </div>

        {/* Situation Context Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-[#2C3E50]">{situation.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                ${difficultyStyle.bg} ${difficultyStyle.text}`}
              >
                {situation.difficulty}
              </span>
            </div>
            <p className="text-[#7F8C8D]">{situation.description}</p>
          </div>

          {/* Expandable Context Section */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#2C3E50]">Situation Details</span>
                <span className="text-[#7F8C8D] text-sm">
                  {isExpanded ? 'Hide' : 'Show'}
                </span>
              </div>
            </button>
            
            {isExpanded && (
              <div className="px-6 pb-4 space-y-4">
                {/* Context */}
                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-[#3498DB] mt-1" />
                  <div>
                    <h3 className="font-medium text-[#2C3E50] mb-1">Context</h3>
                    <p className="text-[#7F8C8D]">{situation.context}</p>
                  </div>
                </div>

                {/* User Goal */}
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-[#27AE60] mt-1" />
                  <div>
                    <h3 className="font-medium text-[#2C3E50] mb-1">Your Goal</h3>
                    <p className="text-[#7F8C8D]">{situation.userGoal}</p>
                  </div>
                </div>

                {/* AI Role */}
                <div className="flex items-start space-x-3">
                  <UserCircle2 className="w-5 h-5 text-[#9B59B6] mt-1" />
                  <div>
                    <h3 className="font-medium text-[#2C3E50] mb-1">AI Partner&apos;s Role</h3>
                    <p className="text-[#7F8C8D]">{situation.aiRole}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          {isConnected && (
            <div className="px-6 py-3 bg-[#F8FAFC] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-[#27AE60] animate-pulse' : 'bg-[#3498DB]'}`} />
                <span className="text-sm text-[#7F8C8D]">
                  {isSpeaking ? 'AI is speaking...' : 'AI is listening...'}
                </span>
              </div>
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-[#27AE60]' : 'text-[#3498DB]'}`} />
            </div>
          )}
        </div>

        {/* Conversation Area */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {children}
        </div>
      </div>
    </main>
  );
} 