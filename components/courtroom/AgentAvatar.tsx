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
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl'
  };

  const roleColors = {
    judge: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-400',
    lawyer_plaintiff: 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-blue-400',
    lawyer_defendant: 'bg-gradient-to-br from-red-500 to-pink-600 text-white border-red-400',
    jury: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-purple-400'
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar 
        className={cn(
          sizeClasses[size],
          roleColors[agent.role],
          agent.speaking && 'ring-4 ring-white/50 shadow-2xl animate-pulse',
          'transition-all duration-300 border-2 shadow-lg'
        )}
      >
        <AvatarFallback className={cn(
          'font-bold text-white',
          roleColors[agent.role]
        )}>
          {agent.avatar}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className="text-xs font-medium text-center text-white">{agent.name}</span>
      )}
      {agent.speaking && (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
        </div>
      )}
    </div>
  );
}