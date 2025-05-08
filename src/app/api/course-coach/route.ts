import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { promptTemplate, userResponse, lessonId } = body;

    if (!promptTemplate || !userResponse || !lessonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare the prompt for the LLM
    const prompt = `
      ${promptTemplate}
      
      Student's response:
      "${userResponse}"
      
      Please provide helpful, supportive feedback on the student's response.
      Highlight what they did well, and suggest improvements in a constructive way.
      Keep your feedback concise and actionable.
    `;

    // Call the LLM
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an expert coach helping a student learn new skills. Your feedback should be encouraging, specific, and constructive."
        },
        { 
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const feedback = completion.choices[0]?.message?.content || "Sorry, I couldn't generate feedback at this time.";

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error in course coach API:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
} 