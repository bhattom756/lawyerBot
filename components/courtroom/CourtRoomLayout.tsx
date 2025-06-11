'use client';

import { Agent, TrialPhase } from '@/lib/types';
import { AgentAvatar } from './AgentAvatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gavel, Scale } from 'lucide-react';

interface CourtRoomLayoutProps {
  agents: Agent[];
  currentPhase: TrialPhase;
  caseTitle: string;
}

export function CourtRoomLayout({ agents, currentPhase, caseTitle }: CourtRoomLayoutProps) {
  const judge = agents.find(a => a.role === 'judge');
  const plaintiffLawyer = agents.find(a => a.role === 'lawyer_plaintiff');
  const defendantLawyer = agents.find(a => a.role === 'lawyer_defendant');
  const jury = agents.find(a => a.role === 'jury');

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-100 to-slate-200 relative overflow-hidden">
      {/* Courtroom Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <Scale className="w-12 h-12 text-judicial" />
        </div>
        <div className="absolute top-4 right-8">
          <Gavel className="w-8 h-8 text-judicial" />
        </div>
      </div>

      {/* Case Title and Phase */}
      <div className="absolute top-4 left-8 z-10">
        <Card className="p-4 bg-white/90 backdrop-blur-sm border-judicial/20">
          <h2 className="font-bold text-judicial text-lg">{caseTitle}</h2>
          <Badge 
            variant={currentPhase.completed ? "secondary" : "default"}
            className="mt-2 bg-judicial text-white"
          >
            {currentPhase.phase.toUpperCase()}: {currentPhase.description}
          </Badge>
        </Card>
      </div>

      {/* Judge's Bench - Top Center */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
        <Card className="p-6 bg-judicial text-white courtroom-gradient">
          <div className="flex flex-col items-center space-y-2">
            <Gavel className="w-6 h-6 mb-2" />
            {judge && <AgentAvatar agent={judge} size="lg" />}
            <p className="text-sm font-medium text-center">Judge's Bench</p>
          </div>
        </Card>
      </div>

      {/* Plaintiff's Table - Left */}
      <div className="absolute top-48 left-8">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex flex-col items-center space-y-3">
            {plaintiffLawyer && <AgentAvatar agent={plaintiffLawyer} size="md" />}
            <div className="text-center">
              <p className="text-sm font-medium text-blue-800">Plaintiff's Counsel</p>
              <p className="text-xs text-blue-600">{plaintiffLawyer?.name}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Defendant's Table - Right */}
      <div className="absolute top-48 right-8">
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex flex-col items-center space-y-3">
            {defendantLawyer && <AgentAvatar agent={defendantLawyer} size="md" />}
            <div className="text-center">
              <p className="text-sm font-medium text-red-800">Defense Counsel</p>
              <p className="text-xs text-red-600">{defendantLawyer?.name}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Jury Box - Bottom Right */}
      <div className="absolute bottom-8 right-8">
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex flex-col items-center space-y-3">
            {jury && <AgentAvatar agent={jury} size="md" />}
            <div className="text-center">
              <p className="text-sm font-medium text-amber-800">Jury Panel</p>
              <p className="text-xs text-amber-600">12 Members</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gallery/Audience - Bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Card className="p-3 bg-gray-100 border-gray-300">
          <p className="text-xs text-gray-600 text-center">Public Gallery</p>
          <div className="flex justify-center space-x-1 mt-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-400 rounded-full opacity-60" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}