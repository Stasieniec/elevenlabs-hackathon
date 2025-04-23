'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { courses } from '@/lib/courses';
import SituationConversationTemplate from '@/app/components/SituationConversationTemplate';
import { useConversationManager, Message } from '@/lib/conversation';
import ConversationFeedback from '@/app/components/ConversationFeedback';
import { generateFeedback } from '@/lib/elevenlabs';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import { useUser } from '@clerk/nextjs';
import { useSupabase } from '../../../../../../supabase-provider';

type ConversationState = 'initial' | 'conversation' | 'feedback' | 'analyzing';

export default function SituationPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const chapterId = params.chapterId as string;
  const situationId = params.situationId as string;
  const { user } = useUser();
  const supabase = useSupabase().supabase;
  
  const [conversationState, setConversationState] = useState<ConversationState>('initial');
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedback, setFeedback] = useState<{
    perception: string;
    strongPoints: string[];
    improvementAreas: string[];
  } | null>(null);
  const isGeneratingFeedback = useRef(false);
  const conversationRef = useRef<ReturnType<typeof useConversationManager>>(undefined);

  const course = courses.find(c => c.id === courseId);
  const chapter = course?.chapters.find(ch => ch.id === chapterId);
  const situation = chapter?.situations.find(s => s.id === situationId);

  const handleMessage = useCallback((newMessage: Message) => {
    const messageToAdd: Message = {
      source: newMessage.source,
      message: newMessage.message,
      timestamp: newMessage.timestamp
    };
    setMessages(prev => [...prev, messageToAdd]);
  }, []);

  const handleEndPractice = useCallback(async () => {
    if (messages.length === 0 || isGeneratingFeedback.current) return;
    
    try {
      isGeneratingFeedback.current = true;
      await conversationRef.current?.stop();
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
      
      // Mark lesson as completed in Supabase
      if (user && supabase && situationId) {
        await supabase
          .from('lesson_progress')
          .upsert({
            user_id: user.id,
            lesson_id: situationId,
            completed: true
          }, { onConflict: 'user_id,lesson_id' });
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
      isGeneratingFeedback.current = false;
    }
  }, [messages, situation?.context, situation?.userGoal, situation?.aiRole, user, supabase, situationId]);

  const handleStartPractice = async () => {
    setMessages([]);
    setConversationState('conversation');
    isGeneratingFeedback.current = false;
    await conversationRef.current?.start();
  };

  const handleTryAgain = () => {
    setMessages([]);
    setFeedback(null);
    setConversationState('initial');
    isGeneratingFeedback.current = false;
  };

  // Initialize conversation manager
  const config = {
    context: situation?.context || '',
    userGoal: situation?.userGoal || '',
    aiRole: situation?.aiRole || '',
    voice: situation?.voice || 'male',
    onMessage: handleMessage,
    onDisconnect: handleEndPractice
  };
  
  const conversation = useConversationManager(config);
  conversationRef.current = conversation;

  // Handle automatic conversation end
  useEffect(() => {
    if (conversation.status === 'disconnected' && conversationState === 'conversation') {
      handleEndPractice();
    }
  }, [conversation.status, conversationState, handleEndPractice]);

  if (!course || !chapter || !situation) {
    return (
      <div className="min-h-screen bg-[#ECF0F1] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-4">Situation not found</h1>
          <Link 
            href={`/courses/${courseId}/chapters/${chapterId}`}
            className="text-[#27AE60] hover:underline"
          >
            Return to chapter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="md:pl-64 transition-all duration-200">
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
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
      </div>
    </main>
  );
} 