import { getWebsocketUrl, generateFeedback, createAgent, type ConversationConfig } from '@/lib/elevenlabs';
import { NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID) {
  throw new Error('Missing ELEVENLABS_AGENT_ID');
}

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

export async function POST(req: Request) {
  try {
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
          }
        };

        // Create a new agent
        const agentId = await createAgent(config);
        console.log('Created agent with ID:', agentId);

        // Get the WebSocket URL for this agent
        const url = await getWebsocketUrl(agentId);
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

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 