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
    <div className="w-full min-h-full relative">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <Scale className="w-16 h-16 text-amber-400" />
        </div>
        <div className="absolute top-8 right-12">
          <Gavel className="w-12 h-12 text-blue-300" />
        </div>
        <div className="absolute top-8 left-12">
          <Gavel className="w-12 h-12 text-purple-300 scale-x-[-1]" />
        </div>
      </div>

      {/* Case Title and Phase */}
      <div className="absolute top-6 left-8 z-20">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl rounded-2xl">
          <div className="p-6">
            <h2 className="font-bold text-white text-xl mb-3">{caseTitle}</h2>
            <Badge 
              variant={currentPhase.completed ? "secondary" : "default"}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 px-4 py-2 text-sm font-semibold rounded-full"
            >
              {currentPhase.phase.toUpperCase()}: {currentPhase.description}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Judge's Bench - Top Center */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="backdrop-blur-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-400/30 shadow-2xl rounded-3xl">
          <div className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg">
                <Gavel className="w-8 h-8 text-white" />
              </div>
              {judge && <AgentAvatar agent={judge} size="lg" />}
              <div className="text-center">
                <p className="text-lg font-bold text-white">Judge's Bench</p>
                <p className="text-amber-200 text-sm">{judge?.name}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Plaintiff's Table - Left */}
      <div className="absolute top-80 left-12 z-10">
        <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 shadow-2xl rounded-3xl">
          <div className="p-6">
            <div className="flex flex-col items-center space-y-4">
              {plaintiffLawyer && <AgentAvatar agent={plaintiffLawyer} size="md" />}
              <div className="text-center">
                <p className="text-base font-bold text-white">Plaintiff's Counsel</p>
                <p className="text-blue-200 text-sm">{plaintiffLawyer?.name}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Defendant's Table - Right */}
      <div className="absolute top-80 right-12 z-10">
        <Card className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-400/30 shadow-2xl rounded-3xl">
          <div className="p-6">
            <div className="flex flex-col items-center space-y-4">
              {defendantLawyer && <AgentAvatar agent={defendantLawyer} size="md" />}
              <div className="text-center">
                <p className="text-base font-bold text-white">Defense Counsel</p>
                <p className="text-red-200 text-sm">{defendantLawyer?.name}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Jury Box - Bottom Right */}
      <div className="absolute bottom-12 right-12 z-10">
        <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-400/30 shadow-2xl rounded-3xl">
          <div className="p-6">
            <div className="flex flex-col items-center space-y-4">
              {jury && <AgentAvatar agent={jury} size="md" />}
              <div className="text-center">
                <p className="text-base font-bold text-white">Jury Panel</p>
                <p className="text-purple-200 text-sm">12 Members</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Gallery/Audience - Bottom Center */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl rounded-2xl">
          <div className="p-4">
            <p className="text-sm text-white text-center font-medium mb-2">Public Gallery</p>
            <div className="flex justify-center space-x-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-70" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}