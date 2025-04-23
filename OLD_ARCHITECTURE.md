# Oratoria Architecture

## Overview
Oratoria is a conversation practice platform that combines:
- Next.js for the frontend
- Clerk for authentication
- Supabase for user data storage
- ElevenLabs Conversational AI for the conversation engine

## Core Components

### 1. Frontend (Next.js)
- User interface for course navigation
- Conversation interface
- Progress tracking visualization
- User preferences management

### 2. Authentication (Clerk)
- User authentication
- Profile management
- Session handling

### 3. Database (Supabase)
Stores user-specific data:
- User preferences (languages, communication styles)
- Learning progress
- Conversation history and feedback

### 4. Conversation Engine (ElevenLabs)
Using ElevenLabs Conversational AI platform which provides:
- Language model integration (supports Gemini, Claude, GPT-4, etc.)
- Text-to-speech with 5000+ voices across 31 languages
- Turn-taking and interruption detection
- Real-time conversation handling

## Key Features

### Voice Agents
Each situation in our courses uses a customized ElevenLabs voice agent with:
- Predefined personality and context
- Specific voice and language settings
- Custom knowledge base for the scenario

### Conversation Flow
1. User selects a situation to practice
2. System initializes ElevenLabs agent with:
   - Scenario context
   - AI persona details
   - Conversation objectives
3. Real-time voice conversation with:
   - Natural turn-taking
   - Context-aware responses
   - Real-time feedback

### Progress Tracking
- Score calculation based on conversation quality
- Feedback storage in Supabase
- Progress visualization in the UI

## Technical Implementation

### API Integration
```typescript
// Example agent initialization
type AgentConfig = {
  name: string;
  voice_id: string;
  model: "gemini-1.5-pro" | "gpt-4" | "claude-3-sonnet";
  context: string;
  personality: string;
};

// Will be implemented in src/lib/elevenlabs.ts
```

### Pricing Considerations
Based on ElevenLabs pricing:
- Free tier: 15 minutes/month
- Business tier: 13,750 minutes at $0.08/minute
- Additional minutes billed at $0.08-$0.12 depending on tier

## Next Steps
1. Implement ElevenLabs Conversational AI integration
2. Create conversation interface with WebSocket handling
3. Add voice agent configuration for each situation
4. Implement real-time feedback system
5. Add progress tracking and scoring 