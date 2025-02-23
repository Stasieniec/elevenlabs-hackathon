const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
const ELEVENLABS_WS_URL = 'wss://api.elevenlabs.io/v1/convai/conversation';

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
  [key: string]: any;
};

export async function createAgent(config: ConversationConfig) {
  try {
    const response = await fetch(
      `${ELEVENLABS_API_URL}/convai/agents/create`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_config: config
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to create agent: ${response.statusText}${
          errorData.detail ? ` - ${errorData.detail}` : ''
        }`
      );
    }

    const data = await response.json();
    return data.agent_id;
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
}

export async function getWebsocketUrl(agentId: string) {
  try {
    // First verify the agent exists
    const agentResponse = await fetch(
      `${ELEVENLABS_API_URL}/convai/agents/${agentId}`,
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        },
      }
    );

    if (!agentResponse.ok) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    // Then get the signed URL
    const response = await fetch(
      `${ELEVENLABS_API_URL}/convai/conversations/get-signed-url?agent_id=${agentId}`,
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to get WebSocket URL: ${response.statusText}${
          errorData.detail ? ` - ${errorData.detail}` : ''
        }`
      );
    }

    const data = await response.json();
    return data.signed_url;
  } catch (error) {
    console.error('Error getting WebSocket URL:', error);
    throw error;
  }
}

export type ConversationFeedback = {
  perception: string;
  strongPoints: string[];
  improvementAreas: string[];
};

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${ELEVENLABS_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.statusText}`);
  }

  return response;
}

export async function generateFeedback(
  context: string,
  userGoal: string,
  aiRole: string,
  transcript: string[]
): Promise<ConversationFeedback> {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: transcript.map(message => ({
          source: 'user', // You might want to add proper source detection here
          message
        })),
        context,
        userGoal,
        aiRole
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate feedback');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating feedback:', error);
    return {
      perception: 'Unable to generate detailed feedback',
      strongPoints: ['Participated in the conversation'],
      improvementAreas: ['Technical error in feedback generation'],
    };
  }
} 