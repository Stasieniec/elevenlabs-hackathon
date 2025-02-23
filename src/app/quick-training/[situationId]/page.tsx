'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getSituationById } from '@/lib/situations';
import SituationConversationTemplate from '@/app/components/SituationConversationTemplate';
import { useConversationManager } from '@/lib/conversation';
import ConversationFeedback from '@/app/components/ConversationFeedback';
import { generateFeedback } from '@/lib/elevenlabs';

type ConversationState = 'initial' | 'conversation' | 'feedback' | 'analyzing';
type Message = {
  source: 'user' | 'ai';
  message: string;
};

export default function QuickTrainingSession() {
  const params = useParams();
  const situationId = params.situationId as string;
  const situation = getSituationById(situationId);
  
  const [conversationState, setConversationState] = useState<ConversationState>('initial');
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedback, setFeedback] = useState<{
    perception: string;
    strongPoints: string[];
    improvementAreas: string[];
  } | null>(null);
  const isGeneratingFeedback = useRef(false);
  
  const handleMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleStartPractice = async () => {
    setMessages([]);
    setConversationState('conversation');
    isGeneratingFeedback.current = false;
    await conversation.start();
  };

  const handleEndPractice = async () => {
    if (messages.length === 0 || isGeneratingFeedback.current) return;
    
    try {
      isGeneratingFeedback.current = true;
      await conversation.stop();
      setConversationState('analyzing');
      
      // Generate feedback using fal.ai
      const feedbackData = await generateFeedback(
        situation?.context || '',
        situation?.userGoal || '',
        situation?.aiRole || '',
        messages
      );
      
      setFeedback(feedbackData);
      setConversationState('feedback');
    } catch (error) {
      console.error('Error generating feedback:', error);
      isGeneratingFeedback.current = false;
    }
  };

  const handleTryAgain = () => {
    setMessages([]);
    setFeedback(null);
    setConversationState('initial');
    isGeneratingFeedback.current = false;
  };

  const config = {
    context: situation?.context || '',
    userGoal: situation?.userGoal || '',
    aiRole: situation?.aiRole || '',
    voice: situation?.voice || 'male',
    onMessage: handleMessage,
    onDisconnect: handleEndPractice
  };

  const conversation = useConversationManager(config);

  // Handle automatic conversation end
  useEffect(() => {
    if (conversation.status === 'disconnected' && conversationState === 'conversation') {
      handleEndPractice();
    }
  }, [conversation.status]);

  if (!situation) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <div className="md:pl-64 transition-all duration-200">
          <div className="max-w-4xl mx-auto px-4 pt-20">
            <p className="text-[#2C3E50] text-lg">Situation not found.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <div className="md:pl-64 transition-all duration-200">
        <SituationConversationTemplate
          situation={situation}
          onStartPractice={handleStartPractice}
          onEndPractice={handleEndPractice}
          isSpeaking={conversation.isSpeaking}
          isConnected={conversationState === 'conversation'}
        >
          <div className="space-y-6">
            {conversationState === 'initial' && (
              <div className="text-center">
                <button
                  onClick={handleStartPractice}
                  className="px-6 py-3 bg-[#27AE60] text-white rounded-lg font-medium 
                    hover:bg-[#27AE60]/90 transition-all duration-300 
                    hover:transform hover:scale-105 active:scale-95 shadow-sm"
                >
                  Start Practice
                </button>
                <p className="mt-4 text-sm text-[#7F8C8D]">
                  Click to start the conversation. You can speak naturally with the AI.
                </p>
              </div>
            )}

            {conversationState === 'conversation' && (
              <div>
                <div className="flex justify-center mb-6">
                  <button
                    onClick={handleEndPractice}
                    className="px-6 py-3 bg-[#E74C3C] text-white rounded-lg font-medium 
                      hover:bg-[#E74C3C]/90 transition-all duration-300 
                      hover:transform hover:scale-105 active:scale-95 shadow-sm"
                  >
                    End Practice
                  </button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto px-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.source === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm
                          ${msg.source === 'user'
                            ? 'bg-[#3498DB] text-white ml-12'
                            : 'bg-white border border-gray-100 text-[#2C3E50] mr-12'
                          }`}
                      >
                        <p className="text-[15px] leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {conversationState === 'analyzing' && (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl p-8 shadow-sm">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-[#27AE60]/20 border-t-[#27AE60] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#2C3E50] mb-3">
                  Analyzing Your Conversation
                </h3>
                <p className="text-[#7F8C8D] text-center max-w-md">
                  Our AI is carefully reviewing your interaction to provide personalized feedback on your communication style and effectiveness.
                </p>
                <div className="mt-6 flex items-center space-x-2">
                  <div className="h-2 w-2 bg-[#27AE60] rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-[#27AE60] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="h-2 w-2 bg-[#27AE60] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}

            {conversationState === 'feedback' && feedback && (
              <ConversationFeedback
                perception={feedback.perception}
                strongPoints={feedback.strongPoints}
                improvementAreas={feedback.improvementAreas}
                onClose={handleTryAgain}
              />
            )}
          </div>
        </SituationConversationTemplate>
      </div>
    </main>
  );
} 