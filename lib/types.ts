export interface Agent {
  id: string;
  name: string;
  role: 'judge' | 'lawyer_plaintiff' | 'lawyer_defendant' | 'jury';
  personality: string;
  avatar: string;
  speaking: boolean;
}

export interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  type: 'argument' | 'question' | 'verdict' | 'ruling';
}

export interface Case {
  id: string;
  title: string;
  description: string;
  plaintiff: string;
  defendant: string;
  status: 'pending' | 'in_progress' | 'completed';
  messages: Message[];
  verdict?: {
    decision: 'plaintiff' | 'defendant';
    reasoning: string;
    damages?: number;
  };
}

export interface TrialPhase {
  phase: 'opening' | 'arguments' | 'cross_examination' | 'closing' | 'deliberation' | 'verdict';
  description: string;
  completed: boolean;
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  category: string;
  plaintiff: string;
  defendant: string;
  context: string;
  expectedOutcome?: string;
}