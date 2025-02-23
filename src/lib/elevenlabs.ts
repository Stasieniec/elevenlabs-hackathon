import { Message } from './conversation';

export type ConversationConfig = {
  agent: {
    prompt: {
      prompt: string;
    };
    first_message: string;
    language: string;
  };
  apiKey: string;
};

export type ConversationInitMetadata = {
  conversation_id: string;
  agent_output_audio_format: string;
  user_input_audio_format: string;
};

export type WebSocketMessage = {
  type: string;
  data: Record<string, unknown>;
};

export async function createAgent(config: ConversationConfig): Promise<string> {
  const response = await fetch('https://api.elevenlabs.io/v1/agent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': config.apiKey
    },
    body: JSON.stringify({
      agent: config.agent
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create agent');
  }

  const data = await response.json();
  return data.agent_id;
}

export async function getWebsocketUrl(agentId: string, apiKey: string): Promise<string> {
  const response = await fetch(`https://api.elevenlabs.io/v1/agent/${agentId}/websocket`, {
    headers: {
      'xi-api-key': apiKey
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get websocket URL');
  }

  const data = await response.json();
  return data.url;
}

export type ConversationFeedback = {
  perception: string;
  strongPoints: string[];
  improvementAreas: string[];
};

export async function generateFeedback(
  context: string,
  userGoal: string,
  aiRole: string,
  transcript: Message[]
): Promise<ConversationFeedback> {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      context,
      userGoal,
      aiRole,
      messages: transcript,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate feedback');
  }

  return response.json();
} 