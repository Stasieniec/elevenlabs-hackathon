'use client';

import Navigation from '../components/Navigation';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import ConversationInterface from '../components/ConversationInterface';
import ConversationFeedback from '../components/ConversationFeedback';

type ConversationState = 'form' | 'conversation' | 'feedback';

type FeedbackData = {
  perception: string;
  strongPoints: string[];
  improvementAreas: string[];
};

export default function CustomSituation() {
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState('');
  const [userGoal, setUserGoal] = useState('');
  const [aiGoal, setAiGoal] = useState('');
  const [conversationState, setConversationState] = useState<ConversationState>('form');
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Transition to conversation interface
    setConversationState('conversation');
    setIsLoading(false);
  };

  const handleConversationEnd = (feedback: FeedbackData) => {
    setFeedback(feedback);
    setConversationState('feedback');
  };

  const handleTryAnother = () => {
    setContext('');
    setUserGoal('');
    setAiGoal('');
    setFeedback(null);
    setConversationState('form');
  };

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="md:pl-64 transition-all duration-200">
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 rounded-full bg-[#27AE60] bg-opacity-10">
              <PlusCircle size={32} className="text-[#27AE60]" />
            </div>
            <h1 className="text-3xl font-bold text-[#2C3E50]">Custom Situation</h1>
          </div>

          <p className="text-neutral mb-4">
            Let&apos;s create a custom conversation scenario for you to practice.
          </p>

          {conversationState === 'form' && (
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <form onSubmit={handleStartConversation} className="space-y-6">
                <div>
                  <label htmlFor="context" className="block text-[#2C3E50] font-medium mb-2">
                    Situation Context
                  </label>
                  <textarea
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Describe the situation (e.g., &apos;You&apos;re at a networking event in a tech conference...&apos;)"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] text-[#34495E]"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="userGoal" className="block text-[#2C3E50] font-medium mb-2">
                    Your Goal
                  </label>
                  <textarea
                    id="userGoal"
                    value={userGoal}
                    onChange={(e) => setUserGoal(e.target.value)}
                    placeholder="What do you want to achieve in this conversation? (e.g., 'Make a good first impression and get their contact for future collaboration')"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] text-[#34495E]"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="aiGoal" className="block text-[#2C3E50] font-medium mb-2">
                    AI Character&apos;s Goal
                  </label>
                  <textarea
                    id="aiGoal"
                    value={aiGoal}
                    onChange={(e) => setAiGoal(e.target.value)}
                    placeholder="What is the AI character's motivation? (e.g., 'A busy tech executive who is interested in new opportunities but values their time')"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] text-[#34495E]"
                    rows={3}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !context || !userGoal || !aiGoal}
                  className="w-full bg-[#27AE60] text-white py-3 rounded-lg font-medium hover:bg-[#27AE60]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Setting up conversation...' : 'Start Conversation'}
                </button>
              </form>
            </div>
          )}

          {conversationState === 'conversation' && (
            <ConversationInterface
              context={context}
              userGoal={userGoal}
              aiGoal={aiGoal}
              onConversationEnd={handleConversationEnd}
            />
          )}

          {conversationState === 'feedback' && feedback && (
            <ConversationFeedback
              perception={feedback.perception}
              strongPoints={feedback.strongPoints}
              improvementAreas={feedback.improvementAreas}
              onClose={handleTryAnother}
            />
          )}
        </div>
      </div>
    </main>
  );
} 