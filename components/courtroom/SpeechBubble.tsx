'use client';

import { Message, Agent } from '@/lib/types';
import { AgentAvatar } from './AgentAvatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface SpeechBubbleProps {
  message: Message;
  agent: Agent;
  isLatest?: boolean;
  onSpeakComplete?: () => void;
}

export function SpeechBubble({ message, agent, isLatest = false, onSpeakComplete }: SpeechBubbleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(isLatest);

  useEffect(() => {
    if (isLatest && message.content) {
      setDisplayedText('');
      setIsTyping(true);
      
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex < message.content.length) {
          setDisplayedText(message.content.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
          onSpeakComplete?.();
        }
      }, 30);

      return () => clearInterval(typeInterval);
    } else {
      setDisplayedText(message.content);
      setIsTyping(false);
    }
  }, [message.content, isLatest, onSpeakComplete]);

  const bubbleColors = {
    judge: 'bg-judicial/10 border-judicial/30 text-judicial',
    lawyer_plaintiff: 'bg-blue-50 border-blue-200 text-blue-900',
    lawyer_defendant: 'bg-red-50 border-red-200 text-red-900',
    jury: 'bg-amber-50 border-amber-200 text-amber-900'
  };

  return (
    <div className={cn(
      'flex items-start space-x-3 mb-4',
      agent.role === 'judge' ? 'justify-center' : 
      agent.role === 'lawyer_defendant' ? 'justify-end' : 'justify-start'
    )}>
      {agent.role !== 'lawyer_defendant' && (
        <AgentAvatar agent={agent} size="sm" />
      )}
      
      <Card className={cn(
        'p-4 max-w-md speech-bubble border-2',
        bubbleColors[agent.role],
        isLatest && isTyping && 'shadow-lg'
      )}>
        <div className="flex items-center space-x-2 mb-2">
          <h4 className="font-semibold text-sm">{agent.name}</h4>
          <span className={cn(
            'px-2 py-1 text-xs rounded-full',
            message.type === 'verdict' ? 'bg-gold text-black' :
            message.type === 'ruling' ? 'bg-judicial text-white' :
            'bg-gray-200 text-gray-700'
          )}>
            {message.type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        
        <p className={cn(
          'text-sm leading-relaxed',
          isTyping && 'typewriter'
        )}>
          {displayedText}
          {isTyping && <span className="animate-pulse">|</span>}
        </p>
        
        <time className="text-xs opacity-60 mt-2 block">
          {message.timestamp.toLocaleTimeString()}
        </time>
      </Card>

      {agent.role === 'lawyer_defendant' && (
        <AgentAvatar agent={agent} size="sm" />
      )}
    </div>
  );
}