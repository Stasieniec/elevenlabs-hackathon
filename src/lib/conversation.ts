import { useConversation } from '@11labs/react';
import { useRef } from 'react';

export type Message = {
  source: 'user' | 'ai';
  message: string;
  timestamp?: number;
};

export type ConversationConfig = {
  context: string;
  userGoal: string;
  aiRole: string;
  voiceId?: string;
  voice?: 'male' | 'female';
  onMessage?: (message: Message) => void;
  onDisconnect?: () => void;
  agent?: {
    prompt: {
      prompt: string;
    };
    first_message: string;
    language: string;
  };
};

type RawMessage = {
  message: string;
  source?: 'user' | 'ai';
} | string;

export type ConversationManager = {
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  onMessage: (callback: (message: Message) => void) => void;
  onError: (callback: (error: Error) => void) => void;
  onClose: (callback: () => void) => void;
};

export type ConversationError = {
  message: string;
  code?: string;
  details?: unknown;
};

export function useConversationManager(config: ConversationConfig) {
  const messagesRef = useRef<Message[]>([]);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected with config:', config);
      messagesRef.current = [];
    },
    onDisconnect: () => {
      console.log('Disconnected by agent');
      // Only trigger feedback generation if there are messages
      if (config.onDisconnect && messagesRef.current.length > 0) {
        console.log('Calling onDisconnect callback');
        config.onDisconnect();
      }
    },
    onMessage: (message: RawMessage) => {
      console.log('Raw message:', message);
      const messageText = typeof message === 'string' ? message : message.message;
      const messageSource = typeof message === 'string' ? 'ai' : message.source || 'user';
      
      const formattedMessage = {
        source: messageSource,
        message: messageText
      };

      // Store message in ref
      if (messageText) {
        messagesRef.current = [...messagesRef.current, formattedMessage];
      }

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

      // Select the appropriate agent ID based on voice preference
      const agentId = config.voice === 'female' 
        ? process.env.NEXT_PUBLIC_AGENT_ID_FEMALE_VOICE!
        : process.env.NEXT_PUBLIC_AGENT_ID!;

      // Start the conversation with dynamic variables
      await conversation.startSession({
        agentId,
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