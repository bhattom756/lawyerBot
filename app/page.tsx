'use client';

import { useState, useEffect, useCallback } from 'react';
import { CaseForm } from '@/components/case-input/CaseForm';
import { CourtRoomLayout } from '@/components/courtroom/CourtRoomLayout';
import { SpeechBubble } from '@/components/courtroom/SpeechBubble';
import { TrialControls } from '@/components/courtroom/TrialControls';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Agent, Case, Message, TrialPhase, TestCase } from '@/lib/types';

export default function Home() {
  // State management
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [phases, setPhases] = useState<TrialPhase[]>([]);
  const [currentPhase, setCurrentPhase] = useState<TrialPhase | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

  // Initialize trial
  const startTrial = async (caseDescription: string, testCase?: TestCase) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/trial/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseDescription, testCase }),
      });

      if (!response.ok) throw new Error('Failed to start trial');

      const data = await response.json();
      setCurrentCase(data.case);
      setAgents(data.agents);
      setPhases(data.phases);
      setCurrentPhase(data.currentPhase);
      setMessages([]);
      setIsPlaying(true);
      
      toast.success('Trial has begun!');
    } catch (error) {
      console.error('Error starting trial:', error);
      toast.error('Failed to start trial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate next message
  const generateNextMessage = useCallback(async () => {
    if (!currentCase || !currentPhase || !agents.length) return;

    const phaseOrder = ['judge', 'lawyer_plaintiff', 'lawyer_defendant', 'jury'];
    const currentPhaseIndex = phases.findIndex(p => p.phase === currentPhase.phase);
    
    // Determine speaking order based on phase
    let speakerRole: string;
    const messageCount = messages.filter(m => 
      m.type === getMessageType(currentPhase.phase)
    ).length;

    if (currentPhase.phase === 'opening' || currentPhase.phase === 'closing') {
      speakerRole = messageCount === 0 ? 'judge' : 
                   messageCount === 1 ? 'lawyer_plaintiff' :
                   messageCount === 2 ? 'lawyer_defendant' : '';
    } else if (currentPhase.phase === 'arguments' || currentPhase.phase === 'cross_examination') {
      const cyclePosition = messageCount % 3;
      speakerRole = cyclePosition === 0 ? 'lawyer_plaintiff' :
                   cyclePosition === 1 ? 'lawyer_defendant' : 'judge';
    } else if (currentPhase.phase === 'deliberation') {
      speakerRole = 'jury';
    } else if (currentPhase.phase === 'verdict') {
      speakerRole = messageCount === 0 ? 'jury' : 'judge';
    } else {
      return;
    }

    const speaker = agents.find(a => a.role === speakerRole);
    if (!speaker) return;

    // Update speaking status
    setAgents(prev => prev.map(a => ({ ...a, speaking: a.id === speaker.id })));
    setCurrentSpeaker(speaker.id);

    try {
      const response = await fetch('/api/trial/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: speaker,
          caseContext: currentCase.description,
          currentPhase,
          previousMessages: messages.slice(-5),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate message');

      const data = await response.json();
      const newMessage = { ...data.message, timestamp: new Date() };
      
      setMessages(prev => [...prev, newMessage]);

    } catch (error) {
      console.error('Error generating message:', error);
      toast.error('Failed to generate response');
    }
  }, [currentCase, currentPhase, agents, messages, phases]);

  // Handle message completion
  const handleSpeakComplete = useCallback(() => {
    setAgents(prev => prev.map(a => ({ ...a, speaking: false })));
    setCurrentSpeaker(null);
    
    // Auto-advance after a short delay
    setTimeout(() => {
      if (isPlaying) {
        const phaseMessages = messages.filter(m => 
          m.type === getMessageType(currentPhase?.phase || '')
        );
        
        // Check if phase should advance
        if (shouldAdvancePhase(currentPhase?.phase || '', phaseMessages.length + 1)) {
          handleNextPhase();
        } else {
          generateNextMessage();
        }
      }
    }, 1500);
  }, [isPlaying, messages, currentPhase, generateNextMessage]);

  // Phase management
  const handleNextPhase = () => {
    if (!currentPhase || !phases) return;
    
    const currentIndex = phases.findIndex(p => p.phase === currentPhase.phase);
    if (currentIndex < phases.length - 1) {
      const updatedPhases = [...phases];
      updatedPhases[currentIndex].completed = true;
      
      setPhases(updatedPhases);
      setCurrentPhase(updatedPhases[currentIndex + 1]);
      
      if (isPlaying) {
        setTimeout(generateNextMessage, 1000);
      }
    }
  };

  // Start message generation when trial begins
  useEffect(() => {
    if (isPlaying && currentCase && currentPhase && !currentSpeaker) {
      const timer = setTimeout(generateNextMessage, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentCase, currentPhase, currentSpeaker, generateNextMessage]);

  // Control handlers
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && !currentSpeaker) {
      setTimeout(generateNextMessage, 500);
    }
  };

  const handleNewTrial = () => {
    setCurrentCase(null);
    setAgents([]);
    setMessages([]);
    setPhases([]);
    setCurrentPhase(null);
    setIsPlaying(false);
    setCurrentSpeaker(null);
  };

  const handleExportTranscript = () => {
    if (!messages.length) return;
    
    const transcript = messages.map(m => {
      const agent = agents.find(a => a.id === m.agentId);
      return `[${m.timestamp.toLocaleTimeString()}] ${agent?.name}: ${m.content}`;
    }).join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCase?.title || 'trial'}-transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render
  if (!currentCase) {
    return <CaseForm onSubmit={startTrial} isLoading={isLoading} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="flex-none p-4 bg-white border-b border-slate-200">
        <TrialControls
          isPlaying={isPlaying}
          currentPhase={currentPhase!}
          phases={phases}
          voiceEnabled={voiceEnabled}
          onPlayPause={handlePlayPause}
          onNextPhase={handleNextPhase}
          onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
          onNewTrial={handleNewTrial}
          onExportTranscript={handleExportTranscript}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Courtroom Layout */}
        <div className="flex-1 relative">
          <CourtRoomLayout
            agents={agents}
            currentPhase={currentPhase!}
            caseTitle={currentCase.title}
          />
        </div>

        {/* Messages Panel */}
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
          <div className="p-4 border-b bg-slate-50">
            <h3 className="font-semibold text-slate-700">Trial Proceedings</h3>
            <p className="text-sm text-slate-500">
              {messages.length} statements recorded
            </p>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => {
                const agent = agents.find(a => a.id === message.agentId);
                if (!agent) return null;
                
                return (
                  <SpeechBubble
                    key={message.id}
                    message={message}
                    agent={agent}
                    isLatest={index === messages.length - 1}
                    onSpeakComplete={handleSpeakComplete}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getMessageType(phase: string) {
  if (phase === 'verdict') return 'verdict';
  if (phase === 'cross_examination') return 'question';
  return 'argument';
}

function shouldAdvancePhase(phase: string, messageCount: number): boolean {
  switch (phase) {
    case 'opening':
    case 'closing':
      return messageCount >= 3; // Judge + both lawyers
    case 'arguments':
    case 'cross_examination':
      return messageCount >= 6; // 2 rounds of all three
    case 'deliberation':
      return messageCount >= 1; // Jury deliberation
    case 'verdict':
      return messageCount >= 2; // Jury verdict + judge ruling
    default:
      return false;
  }
}