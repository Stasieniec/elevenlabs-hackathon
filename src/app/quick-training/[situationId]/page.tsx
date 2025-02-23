'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { getSituationById } from '@/lib/situations';
import SituationConversationTemplate from '@/app/components/SituationConversationTemplate';
import { useConversationManager } from '@/lib/conversation';

export default function QuickTrainingSession() {
  const params = useParams();
  const situationId = params.situationId as string;
  const situation = getSituationById(situationId);
  
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Array<{ source: string; message: string }>>([]);
  
  const handleMessage = (message: { source: string; message: string }) => {
    setMessages(prev => [...prev, message]);
  };

  const config = {
    context: situation?.context || '',
    userGoal: situation?.userGoal || '',
    aiRole: situation?.aiRole || '',
    onMessage: handleMessage,
    onDisconnect: () => setIsStarted(false)
  };

  const conversation = useConversationManager(config);

  const handleStartPractice = async () => {
    setMessages([]);
    setIsStarted(true);
    await conversation.start();
  };

  const handleEndPractice = async () => {
    await conversation.stop();
    setIsStarted(false);
  };

  if (!situation) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <div className="max-w-4xl mx-auto px-4 pt-20">
          <p className="text-[#2C3E50] text-lg">Situation not found.</p>
        </div>
      </main>
    );
  }

  return (
    <SituationConversationTemplate
      situation={situation}
      onStartPractice={handleStartPractice}
      onEndPractice={handleEndPractice}
      isSpeaking={conversation.isSpeaking}
      isConnected={isStarted}
    >
      <div className="space-y-6">
        {!isStarted ? (
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
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.source === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.source === 'user'
                        ? 'bg-[#3498DB] text-white'
                        : 'bg-gray-100 text-[#2C3E50]'
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleEndPractice}
                className="px-6 py-3 bg-[#E74C3C] text-white rounded-lg font-medium 
                  hover:bg-[#E74C3C]/90 transition-all duration-300 
                  hover:transform hover:scale-105 active:scale-95 shadow-sm"
              >
                End Practice
              </button>
            </div>
          </>
        )}
      </div>
    </SituationConversationTemplate>
  );
} 