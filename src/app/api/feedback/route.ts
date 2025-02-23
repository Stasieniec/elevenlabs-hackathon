import { NextResponse, NextRequest } from 'next/server';
import { fal } from "@fal-ai/client";
import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/nextjs/server';

// Initialize Supabase client
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}
if (!process.env.ADMIN_FAL_AI_KEY) {
  throw new Error('Missing ADMIN_FAL_AI_KEY');
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

type Message = {
  source: 'user' | 'ai';
  message: string;
};

type RequestBody = {
  messages: Message[];
  context: string;
  userGoal: string;
  aiRole: string;
};

const SYSTEM_PROMPT = `You are an expert communication coach analyzing conversations. Your task is to provide structured feedback on the user's communication style and effectiveness.

Primary focus - analyze the conversation considering:
- The context of the situation
- The user's goal
- The AI's role
- The actual conversation transcript

Additional context (reference only when naturally relevant):
The user has described their communication style as follows:
- Current professional style: {current_professional_style}
- Desired professional style: {desired_professional_style}
- Current social style: {current_social_style}
- Desired social style: {desired_social_style}

Focus on:
1. How well the user achieved their goal in this specific conversation
2. Their communication effectiveness in this particular situation
3. Specific behaviors and choices they made during the interaction
4. Natural opportunities for improvement (if any align with their style goals, you may reference them)

Provide your analysis in this exact JSON format:
{
  "perception": "A concise 1-2 sentence overall impression of how the user came across in this specific conversation",
  "strongPoints": [
    "Specific example of something they did well in this conversation, with evidence",
    "Another specific strength with example from the interaction"
  ],
  "improvementAreas": [
    "Concrete suggestion for improvement based on this conversation",
    "Another specific area for improvement with actionable advice (if relevant to their goals, you may reference their desired style)"
  ]
}

Remember: Focus primarily on the conversation itself. Only reference their style goals when it's natural and clearly relevant to what happened in the conversation.

Make sure your response is ONLY the JSON object, with no additional text.`;

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: RequestBody = await request.json();
    const { messages, context, userGoal, aiRole } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No conversation messages provided' }, { status: 400 });
    }

    // Fetch user's API keys
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('user_api_keys')
      .select('fal_ai_api_key_encrypted')
      .eq('user_id', userId)
      .single();

    if (apiKeysError && apiKeysError.code !== 'PGRST116') {
      console.error('Error fetching API keys:', apiKeysError);
      return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
    }

    // Use admin key if user doesn't have their own keys
    const falAiKey = apiKeys?.fal_ai_api_key_encrypted || process.env.ADMIN_FAL_AI_KEY;
    if (!falAiKey) {
      return NextResponse.json({ error: 'No valid API key available' }, { status: 500 });
    }

    // Configure fal.ai client
    fal.config({
      credentials: falAiKey
    });

    // Fetch user preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (preferencesError && preferencesError.code !== 'PGRST116') {
      console.error('Error fetching preferences:', preferencesError);
      // Continue without preferences instead of failing
      console.log('Continuing without user preferences');
    }

    // Format conversation for analysis
    const conversation = messages
      .map(msg => `${msg.source.toUpperCase()}: ${msg.message}`)
      .join('\n');

    // Replace placeholders in system prompt
    const filledSystemPrompt = SYSTEM_PROMPT
      .replace('{current_professional_style}', preferences?.current_professional_style || 'Not specified')
      .replace('{desired_professional_style}', preferences?.desired_professional_style || 'Not specified')
      .replace('{current_social_style}', preferences?.current_social_style || 'Not specified')
      .replace('{desired_social_style}', preferences?.desired_social_style || 'Not specified');

    // Prepare the prompt
    const prompt = `
Context: ${context}
User's Goal: ${userGoal}
AI's Role: ${aiRole}

Conversation Transcript:
${conversation}

Analyze this conversation and provide feedback in the specified JSON format.`;

    try {
      // Call fal.ai with Claude 3.5 Sonnet
      const result = await fal.subscribe("fal-ai/any-llm", {
        input: {
          model: "anthropic/claude-3.5-sonnet",
          prompt,
          system_prompt: filledSystemPrompt
        }
      });

      if (!result?.data?.output) {
        throw new Error('No output received from fal.ai');
      }

      const feedback = JSON.parse(result.data.output);
      return NextResponse.json(feedback);
    } catch (falError) {
      console.error('Error calling fal.ai:', falError);
      return NextResponse.json(
        { error: 'Failed to generate feedback from AI service' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Feedback generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to generate feedback: ${errorMessage}` },
      { status: 500 }
    );
  }
} 