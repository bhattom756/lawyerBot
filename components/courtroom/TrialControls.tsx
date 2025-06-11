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
    <Card className="p-4 bg-white/95 backdrop-blur-sm border-judicial/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button
            onClick={onPlayPause}
            variant={isPlaying ? "secondary" : "default"}
            size="sm"
            className="bg-judicial hover:bg-judicial/90 text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            onClick={onNextPhase}
            variant="outline"
            size="sm"
            disabled={currentPhase.phase === 'verdict'}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onToggleVoice}
            variant="ghost"
            size="sm"
            className={voiceEnabled ? 'text-accent' : 'text-muted-foreground'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={onExportTranscript}
            variant="ghost"
            size="sm"
          >
            <FileText className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onNewTrial}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="w-4 h-4" />
            New Trial
          </Button>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Trial Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-judicial h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {phases.map((phase, index) => (
            <Badge
              key={phase.phase}
              variant={
                phase.completed ? "default" : 
                phase.phase === currentPhase.phase ? "secondary" : 
                "outline"
              }
              className={cn(
                "text-xs",
                phase.completed && "bg-judicial text-white",
                phase.phase === currentPhase.phase && "bg-accent text-black"
              )}
            >
              {phase.phase.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}