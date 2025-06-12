'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX,
  RotateCcw,
  FileText
} from 'lucide-react';
import { TrialPhase } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TrialControlsProps {
  isPlaying: boolean;
  currentPhase: TrialPhase;
  phases: TrialPhase[];
  voiceEnabled: boolean;
  onPlayPause: () => void;
  onNextPhase: () => void;
  onToggleVoice: () => void;
  onNewTrial: () => void;
  onExportTranscript: () => void;
}

export function TrialControls({
  isPlaying,
  currentPhase,
  phases,
  voiceEnabled,
  onPlayPause,
  onNextPhase,
  onToggleVoice,
  onNewTrial,
  onExportTranscript
}: TrialControlsProps) {
  const currentPhaseIndex = phases.findIndex(p => p.phase === currentPhase.phase);
  const progress = phases.length > 0 ? ((currentPhaseIndex + 1) / phases.length) * 100 : 0;

  return (
    <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl rounded-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button
              onClick={onPlayPause}
              variant={isPlaying ? "secondary" : "default"}
              size="sm"
              className={cn(
                "rounded-xl px-4 py-2 font-semibold transition-all duration-300",
                isPlaying 
                  ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white" 
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              )}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={onNextPhase}
              variant="outline"
              size="sm"
              disabled={currentPhase.phase === 'verdict'}
              className="rounded-xl border-white/30 text-white hover:bg-white/10 disabled:opacity-50"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={onToggleVoice}
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-xl transition-all duration-300",
                voiceEnabled 
                  ? 'text-amber-400 hover:bg-amber-400/20' 
                  : 'text-white/60 hover:bg-white/10'
              )}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={onExportTranscript}
              variant="ghost"
              size="sm"
              className="rounded-xl text-white hover:bg-white/10"
            >
              <FileText className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={onNewTrial}
              variant="outline"
              size="sm"
              className="rounded-xl border-white/30 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Trial
            </Button>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-white">
            <span className="font-medium">Trial Progress</span>
            <span className="font-bold">{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {phases.map((phase, index) => (
              <Badge
                key={phase.phase}
                variant="outline"
                className={cn(
                  "text-xs font-medium px-3 py-1 rounded-full border transition-all duration-300",
                  phase.completed 
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400" :
                  phase.phase === currentPhase.phase 
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-amber-400" : 
                    "border-white/30 text-white/70 hover:border-white/50"
                )}
              >
                {phase.phase.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}