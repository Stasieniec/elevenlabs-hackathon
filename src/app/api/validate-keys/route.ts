import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { fal } from "@fal-ai/client";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { elevenLabsKey, falAiKey } = await request.json();
    const validationResults = { elevenlabs: false, falai: false };

    // Validate ElevenLabs key if provided
    if (elevenLabsKey) {
      try {
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
          headers: {
            'xi-api-key': elevenLabsKey
          }
        });
        validationResults.elevenlabs = response.ok;
      } catch (err) {
        console.error('Error validating ElevenLabs key:', err);
      }
    }

    // Validate fal.ai key if provided
    if (falAiKey) {
      try {
        fal.config({
          credentials: falAiKey
        });
        const result = await fal.subscribe("fal-ai/any-llm", {
          input: {
            prompt: "test",
            model: "google/gemini-flash-1.5"
          }
        });
        validationResults.falai = !!result;
      } catch (err) {
        console.error('Error validating fal.ai key:', err);
      }
    }

    return NextResponse.json(validationResults);
  } catch (error) {
    console.error('Error in key validation:', error);
    return NextResponse.json(
      { error: 'Failed to validate keys' },
      { status: 500 }
    );
  }
} 