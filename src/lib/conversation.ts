import { useConversation } from '@11labs/react';

export type ConversationConfig = {
  context: string;
  userGoal: string;
  aiRole: string;
  systemPrompt?: string;
  voiceId?: string; // Optional: if you want to specify a voice
  onMessage?: (message: Message) => void;
  onDisconnect?: () => void; // Add disconnect callback
};

export type Message = {
  source: 'user' | 'ai';
  message: string;
};

export function useConversationManager(config: ConversationConfig) {
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected with config:', config);
    },
    onDisconnect: () => {
      console.log('Disconnected by agent');
      // The agent has disconnected, trigger feedback generation
      if (config.onDisconnect) {
        console.log('Calling onDisconnect callback');
        config.onDisconnect();
      }
    },
    onMessage: (message: any) => {
      console.log('Raw message:', message);
      const messageText = typeof message === 'string' ? message : message.message;
      const messageSource = typeof message === 'string' ? 'ai' : message.source || 'user';
      
      const formattedMessage = {
        source: messageSource,
        message: messageText
      };

      // Call the onMessage callback if provided
      if (config.onMessage && messageText) {
        config.onMessage(formattedMessage);
      }
    }
  });

  const start = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with dynamic variables
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_AGENT_ID!,
        dynamicVariables: {
          situation_context: config.context,
          user_goal: config.userGoal,
          ai_role: config.aiRole
        },
        ...(config.voiceId && { voiceId: config.voiceId })
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      throw error;
    }
  };

  const stop = async () => {
    try {
      console.log('Stopping conversation manually');
      await conversation.endSession();
      if (config.onDisconnect) {
        console.log('Calling onDisconnect callback after manual stop');
        config.onDisconnect();
      }
    } catch (error) {
      console.error('Error stopping conversation:', error);
      // Still try to call onDisconnect even if endSession fails
      if (config.onDisconnect) {
        config.onDisconnect();
      }
    }
  };

  return {
    start,
    stop,
    status: conversation.status,
    isSpeaking: conversation.isSpeaking
  };
} 