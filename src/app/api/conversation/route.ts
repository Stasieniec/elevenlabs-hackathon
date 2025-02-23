import { getWebsocketUrl, generateFeedback, createAgent, type ConversationConfig } from '@/lib/elevenlabs';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's API keys
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('user_api_keys')
      .select('elevenlabs_api_key_encrypted')
      .eq('user_id', userId)
      .single();

    if (apiKeysError) {
      console.error('Error fetching API keys:', apiKeysError);
      return NextResponse.json(
        { error: 'Please set up your API keys in settings first' },
        { status: 400 }
      );
    }

    if (!apiKeys?.elevenlabs_api_key_encrypted) {
      return NextResponse.json(
        { error: 'Please set up your ElevenLabs API key in settings first' },
        { status: 400 }
      );
    }

    const { type, data } = await req.json();

    if (type === 'start') {
      try {
        // Create a new agent for this conversation
        const config: ConversationConfig = {
          agent: {
            prompt: {
              prompt: `You are a conversation practice partner. Your role is to help users improve their communication skills.
                      
                      CURRENT SCENARIO:
                      ${data.context}
                      
                      USER'S GOAL:
                      ${data.userGoal}
                      
                      YOUR ROLE AND BEHAVIOR:
                      ${data.aiGoal}`,
            },
            first_message: "Hello! I understand the scenario and my role. I'll help you practice this specific situation. Shall we begin?",
            language: "en"
          },
          apiKey: apiKeys.elevenlabs_api_key_encrypted
        };

        // Create a new agent
        const agentId = await createAgent(config);
        console.log('Created agent with ID:', agentId);

        // Get the WebSocket URL for this agent
        const url = await getWebsocketUrl(agentId, apiKeys.elevenlabs_api_key_encrypted);
        return NextResponse.json({ url, agentId });
      } catch (error) {
        console.error('Error starting conversation:', error);
        return NextResponse.json(
          { error: 'Failed to start conversation' },
          { status: 500 }
        );
      }
    }

    if (type === 'feedback') {
      const { context, userGoal, aiRole, transcript } = data;
      const feedback = await generateFeedback(context, userGoal, aiRole, transcript);
      return NextResponse.json(feedback);
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in conversation endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 