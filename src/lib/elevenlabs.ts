import { Message } from './conversation';

if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error('Missing ELEVENLABS_API_KEY');
}

export type ConversationConfig = {
  agent: {
    prompt: {
      prompt: string;
    };
    first_message: string;
    language: string;
  };
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

type ApiResponse<T> = {
  data: T;
  error?: string;
};

type AgentResponse = {
  agent_id: string;
};

type WebsocketResponse = {
  url: string;
};

export async function createAgent(config: ConversationConfig): Promise<string> {
  const response = await fetch('/api/conversation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'start',
      data: config
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create agent');
  }

  const data: ApiResponse<AgentResponse> = await response.json();
  return data.data.agent_id;
}

export async function getWebsocketUrl(agentId: string): Promise<string> {
  const response = await fetch(`/api/conversation/${agentId}/websocket`);
  if (!response.ok) {
    throw new Error('Failed to get websocket URL');
  }

  const data: ApiResponse<WebsocketResponse> = await response.json();
  return data.data.url;
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