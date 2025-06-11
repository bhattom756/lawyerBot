'use client';

import { Agent } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AgentAvatarProps {
  agent: Agent;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function AgentAvatar({ agent, size = 'md', showName = false }: AgentAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl'
  };

  const roleColors = {
    judge: 'bg-judicial text-white border-gold',
    lawyer_plaintiff: 'bg-blue-500 text-white border-blue-300',
    lawyer_defendant: 'bg-red-500 text-white border-red-300',
    jury: 'bg-amber-500 text-white border-amber-300'
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <Avatar 
        className={cn(
          sizeClasses[size],
          roleColors[agent.role],
          agent.speaking && 'agent-speaking ring-2 ring-accent ring-opacity-75',
          'transition-all duration-300 border-2'
        )}
      >
        <AvatarFallback className={cn(
          'font-semibold',
          roleColors[agent.role]
        )}>
          {agent.avatar}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className="text-xs font-medium text-center">{agent.name}</span>
      )}
      {agent.speaking && (
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-accent rounded-full animate-bounce" />
          <div className="w-1 h-1 bg-accent rounded-full animate-bounce delay-100" />
          <div className="w-1 h-1 bg-accent rounded-full animate-bounce delay-200" />
        </div>
      )}
    </div>
  );
}