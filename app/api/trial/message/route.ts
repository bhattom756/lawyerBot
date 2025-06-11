import { NextRequest, NextResponse } from 'next/server';
import { generateAgentResponse, getAgentPrompt } from '@/lib/openai';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { agent, caseContext, currentPhase, previousMessages } = await request.json();

    if (!agent || !caseContext || !currentPhase) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Build context from previous messages
    const conversationContext = previousMessages
      ?.slice(-5) // Last 5 messages for context
      ?.map((msg: any) => `${msg.agentName}: ${msg.content}`)
      ?.join('\n') || '';

    // Get agent-specific prompt
    const prompt = getAgentPrompt(agent, caseContext, currentPhase.phase);
    
    // Generate response
    const fullContext = `${caseContext}\n\nPrevious conversation:\n${conversationContext}\n\nPlease provide your ${currentPhase.phase} response.`;
    const response = await generateAgentResponse(prompt, fullContext);

    // Create message object
    const message = {
      id: uuidv4(),
      agentId: agent.id,
      agentName: agent.name,
      content: response,
      timestamp: new Date(),
      type: getMessageType(currentPhase.phase, agent.role),
    };

    return NextResponse.json({ message });

  } catch (error) {
    console.error('Error generating agent message:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

function getMessageType(phase: string, role: string) {
  if (phase === 'verdict' && role === 'jury') return 'verdict';
  if (phase === 'verdict' && role === 'judge') return 'ruling';
  if (phase === 'cross_examination') return 'question';
  return 'argument';
}