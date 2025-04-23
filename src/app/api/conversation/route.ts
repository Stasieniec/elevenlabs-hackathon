import { getWebsocketUrl, generateFeedback, createAgent, type ConversationConfig } from '@/lib/elevenlabs';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const authRequest = await auth();
    if (!authRequest.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, data } = await req.json();

    if (type === 'start') {
      try {
        const apiKey = process.env.ELEVENLABS_API_KEY as string;
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
          apiKey
        };

        const agentId = await createAgent(config);
        const url = await getWebsocketUrl(agentId, apiKey);
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