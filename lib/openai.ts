import OpenAI from 'openai';

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function generateAgentResponse(
  prompt: string,
  context: string,
  temperature: number = 0.7
): Promise<string> {
  if (!openai) {
    return 'I apologize, but the AI service is not properly configured. Please check the OpenAI API key configuration.';
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: context
        }
      ],
      temperature,
      max_tokens: 300,
    });

    return response.choices[0]?.message?.content || 'I need more time to formulate my response.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'I apologize, but I am having technical difficulties. Please proceed without my input for now.';
  }
}

export async function analyzeCase(caseDescription: string): Promise<{
  plaintiff: string;
  defendant: string;
  keyIssues: string[];
  legalTheory: string;
}> {
  if (!openai) {
    return {
      plaintiff: 'Complainant',
      defendant: 'Respondent',
      keyIssues: ['Disputed facts', 'Conflicting accounts', 'Resolution needed'],
      legalTheory: 'General dispute resolution principles apply'
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a legal analyst. Analyze the following dispute and extract key information in JSON format:
          {
            "plaintiff": "brief description of the person bringing the complaint",
            "defendant": "brief description of the person being accused",
            "keyIssues": ["issue1", "issue2", "issue3"],
            "legalTheory": "brief explanation of the legal principles at stake"
          }`
        },
        {
          role: 'user',
          content: caseDescription
        }
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
    
    throw new Error('No response from OpenAI');
  } catch (error) {
    console.error('Case analysis error:', error);
    return {
      plaintiff: 'Complainant',
      defendant: 'Respondent',
      keyIssues: ['Disputed facts', 'Conflicting accounts', 'Resolution needed'],
      legalTheory: 'General dispute resolution principles apply'
    };
  }
}

export { openai };