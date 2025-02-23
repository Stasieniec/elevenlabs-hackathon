'use client';

import { useState, useRef } from 'react';
import { ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';
import { useConversationManager, type Message } from '@/lib/conversation';

type ConversationInterfaceProps = {
  context: string;
  userGoal: string;
  aiGoal: string;
  voiceId?: string;
  onConversationEnd: (feedback: ConversationFeedback) => void;
};

type ConversationFeedback = {
  perception: string;
  strongPoints: string[];
  improvementAreas: string[];
};

export default function ConversationInterface({ 
  context, 
  userGoal, 
  aiGoal,
  voiceId,
  onConversationEnd 
}: ConversationInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedback, setFeedback] = useState<ConversationFeedback | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const messagesRef = useRef<Message[]>([]);

  const handleMessage = (message: Message) => {
    console.log('Received message:', message);
    setMessages(prev => {
      const newMessages = [...prev, message];
      console.log('Updating messages, current count:', newMessages.length);
      messagesRef.current = newMessages;
      return newMessages;
    });
  };

  const handleStartConversation = async () => {
    const emptyMessages: Message[] = [];
    setMessages(emptyMessages);
    messagesRef.current = emptyMessages;
    await conversation.start();
  };

  const handleStop = async () => {
    const currentMessages = messagesRef.current;
    console.log('Handling stop/disconnect, messages:', currentMessages);
    if (isGeneratingFeedback) {
      console.log('Already generating feedback, skipping');
      return;
    }
    
    if (currentMessages.length === 0) {
      console.log('No messages to generate feedback from, skipping');
      return;
    }
    
    try {
      setIsTransitioning(true);
      setIsGeneratingFeedback(true);
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentMessages,
          context,
          userGoal,
          aiRole: aiGoal
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Feedback API error:', errorText);
        throw new Error('Failed to generate feedback: ' + errorText);
      }
      
      const feedbackData = await response.json();
      console.log('Received feedback:', feedbackData);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setFeedback(feedbackData);
      onConversationEnd(feedbackData);
    } catch (error) {
      console.error('Failed to generate feedback:', error);
    } finally {
      setIsGeneratingFeedback(false);
      setIsTransitioning(false);
    }
  };

  const config = {
    context,
    userGoal,
    aiRole: aiGoal,
    voiceId,
    onMessage: handleMessage,
    onDisconnect: handleStop
  };
  
  const conversation = useConversationManager(config);

  const handleManualStop = async () => {
    console.log('Manual stop requested');
    await conversation.stop();
  };

  const handleNextStep = () => {
    if (feedback) {
      onConversationEnd(feedback);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 p-4">
        <h2 className="text-lg font-semibold text-[#2C3E50]">Conversation Practice</h2>
        <p className="text-neutral-dark mb-4">
          You&apos;re about to start a conversation with an AI partner. The AI will help you practice this specific situation:
        </p>

        <p className="text-neutral mb-4">
          &ldquo;{context}&rdquo;
        </p>
        <div className="mt-2 text-xs text-gray-500">
          <p>Your goal: {userGoal}</p>
          <p>AI&apos;s role: {aiGoal}</p>
        </div>
      </div>

      <div className="h-[500px] relative bg-white flex flex-col items-center justify-center p-8">
        {!feedback ? (
          <>
            <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="flex gap-2 mb-8">
                <button
                  onClick={handleStartConversation}
                  disabled={conversation.status === 'connected'}
                  className="px-6 py-3 bg-[#27AE60] text-white rounded-lg font-medium hover:bg-[#27AE60]/90 transition-all duration-300 disabled:bg-gray-300 disabled:transform-none hover:transform hover:scale-105 active:scale-95 shadow-sm"
                >
                  Start Conversation
                </button>
                <button
                  onClick={handleManualStop}
                  disabled={conversation.status !== 'connected' || isGeneratingFeedback}
                  className="px-6 py-3 bg-[#2C3E50] text-white rounded-lg font-medium hover:bg-[#2C3E50]/90 transition-all duration-300 disabled:bg-gray-300 disabled:transform-none hover:transform hover:scale-105 active:scale-95 shadow-sm"
                >
                  {isGeneratingFeedback ? 'Generating Feedback...' : 'Stop Conversation'}
                </button>
              </div>

              <div className="flex flex-col items-center">
                {conversation.status === 'connected' && (
                  <>
                    <div className="relative w-20 h-20 mb-6">
                      <div className={`absolute inset-0 bg-[#27AE60] rounded-full opacity-75 ${
                        conversation.isSpeaking ? 'animate-ping' : ''
                      }`}></div>
                      <div className={`relative bg-[#27AE60] w-20 h-20 rounded-full flex items-center justify-center transform transition-transform duration-300 ${
                        conversation.isSpeaking ? 'scale-110' : 'scale-100'
                      }`}>
                        <span className="text-white text-3xl">
                          {conversation.isSpeaking ? '🗣️' : '👂'}
                        </span>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-[#2C3E50]">
                        Agent is <span className="font-medium">{conversation.isSpeaking ? 'speaking' : 'listening'}</span>
                      </p>
                      <p className="text-sm text-gray-500">Messages exchanged: {messages.length}</p>
                    </div>
                  </>
                )}
                {conversation.status === 'disconnected' && (
                  <p className="text-center text-gray-500 mt-4">
                    Click "Start Conversation" to begin practicing
                  </p>
                )}
              </div>
            </div>

            {isTransitioning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 backdrop-blur-sm transition-all duration-500">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#27AE60]/20 border-t-[#27AE60] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                  </div>
                </div>
                <p className="text-[#2C3E50] mt-4 font-medium animate-pulse">
                  Analyzing your conversation...
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="w-full max-w-2xl mx-auto animate-fadeIn space-y-6 bg-white rounded-xl p-6 shadow-sm">
            <div>
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-3">Conversation Feedback</h3>
              <p className="text-[#34495E] leading-relaxed">{feedback.perception}</p>
            </div>

            <div>
              <h4 className="flex items-center text-[#27AE60] font-medium mb-3">
                <ThumbsUp className="w-5 h-5 mr-2" />
                Strong Points
              </h4>
              <ul className="space-y-2">
                {feedback.strongPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2 text-[#34495E]">
                    <span className="text-[#27AE60] mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="flex items-center text-[#F39C12] font-medium mb-3">
                <ThumbsDown className="w-5 h-5 mr-2" />
                Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {feedback.improvementAreas.map((area, index) => (
                  <li key={index} className="flex items-start space-x-2 text-[#34495E]">
                    <span className="text-[#F39C12] mt-1">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full mt-8 px-6 py-4 bg-[#27AE60] text-white rounded-lg font-medium hover:bg-[#27AE60]/90 transition-all duration-300 hover:transform hover:scale-102 active:scale-98 shadow-sm flex items-center justify-center group"
            >
              Continue to Next Step
              <ArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 