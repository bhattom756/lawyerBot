import { NextRequest, NextResponse } from 'next/server';
import { analyzeCase } from '@/lib/openai';
import { createAgents } from '@/lib/agents';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { caseDescription, testCase } = await request.json();

    if (!caseDescription) {
      return NextResponse.json(
        { error: 'Case description is required' },
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

    // Analyze the case to extract key information
    const analysis = await analyzeCase(caseDescription);
    
    // Create a unique case ID
    const caseId = uuidv4();
    
    // Generate agents for this case
    const agents = createAgents(caseId);
    
    // Define trial phases
    const phases = [
      { phase: 'opening', description: 'Opening Statements', completed: false },
      { phase: 'arguments', description: 'Primary Arguments', completed: false },
      { phase: 'cross_examination', description: 'Cross-Examination', completed: false },
      { phase: 'closing', description: 'Closing Arguments', completed: false },
      { phase: 'deliberation', description: 'Jury Deliberation', completed: false },
      { phase: 'verdict', description: 'Final Verdict', completed: false },
    ];

    // Create case object
    const courtCase = {
      id: caseId,
      title: testCase?.title || 'Custom Dispute',
      description: caseDescription,
      plaintiff: analysis.plaintiff,
      defendant: analysis.defendant,
      status: 'in_progress',
      messages: [],
      keyIssues: analysis.keyIssues,
      legalTheory: analysis.legalTheory,
    };

    return NextResponse.json({
      case: courtCase,
      agents,
      phases,
      currentPhase: phases[0],
    });

  } catch (error) {
    console.error('Error starting trial:', error);
    return NextResponse.json(
      { error: 'Failed to start trial' },
      { status: 500 }
    );
  }
}