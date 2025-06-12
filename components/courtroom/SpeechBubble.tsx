'use client';

import { Message, Agent } from '@/lib/types';
import { AgentAvatar } from './AgentAvatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SpeechBubbleProps {
  message: Message;
  agent: Agent;
  isLatest?: boolean;
  onSpeakComplete?: () => void;
  voiceEnabled?: boolean;
}

export function SpeechBubble({ 
  message, 
  agent, 
  isLatest = false, 
  onSpeakComplete,
  voiceEnabled = false 
}: SpeechBubbleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(isLatest);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Text-to-speech functionality
  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice based on agent role
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      switch (agent.role) {
        case 'judge':
          utterance.voice = voices.find(v => v.name.includes('Male') || v.name.includes('Daniel')) || voices[0];
          utterance.pitch = 0.8;
          utterance.rate = 0.9;
          break;
        case 'lawyer_plaintiff':
          utterance.voice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha')) || voices[1] || voices[0];
          utterance.pitch = 1.1;
          utterance.rate = 1.0;
          break;
        case 'lawyer_defendant':
          utterance.voice = voices.find(v => v.name.includes('Male') || v.name.includes('Alex')) || voices[2] || voices[0];
          utterance.pitch = 0.9;
          utterance.rate = 0.95;
          break;
        case 'jury':
          utterance.voice = voices.find(v => v.name.includes('Female') || v.name.includes('Victoria')) || voices[3] || voices[0];
          utterance.pitch = 1.0;
          utterance.rate = 0.85;
          break;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeakComplete?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onSpeakComplete?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

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
          
          // Start speaking when typing is complete
          if (voiceEnabled) {
            setTimeout(() => speakText(message.content), 500);
          } else {
            onSpeakComplete?.();
          }
        }
      }, 30);

      return () => clearInterval(typeInterval);
    } else {
      setDisplayedText(message.content);
      setIsTyping(false);
    }
  }, [message.content, isLatest, voiceEnabled, onSpeakComplete]);

  const bubbleColors = {
    judge: 'from-amber-500/20 to-orange-600/20 border-amber-400/30',
    lawyer_plaintiff: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30',
    lawyer_defendant: 'from-red-500/20 to-pink-500/20 border-red-400/30',
    jury: 'from-purple-500/20 to-indigo-500/20 border-purple-400/30'
  };

  const textColors = {
    judge: 'text-amber-100',
    lawyer_plaintiff: 'text-blue-100',
    lawyer_defendant: 'text-red-100',
    jury: 'text-purple-100'
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
        'p-4 max-w-md backdrop-blur-xl bg-gradient-to-br border shadow-xl rounded-2xl relative',
        bubbleColors[agent.role],
        (isLatest && isTyping) || isSpeaking ? 'shadow-2xl ring-2 ring-white/20' : ''
      )}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-white text-sm">{agent.name}</h4>
            <span className={cn(
              'px-3 py-1 text-xs rounded-full font-medium',
              message.type === 'verdict' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' :
              message.type === 'ruling' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' :
              'bg-white/20 text-white'
            )}>
              {message.type.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          {voiceEnabled && !isTyping && (
            <Button
              variant="ghost"
              size="sm"
              onClick={isSpeaking ? stopSpeaking : () => speakText(message.content)}
              className="h-8 w-8 p-0 hover:bg-white/20"
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </Button>
          )}
        </div>
        
        <p className={cn(
          'text-sm leading-relaxed',
          textColors[agent.role],
          isTyping && 'border-r-2 border-white animate-pulse'
        )}>
          {displayedText}
          {isTyping && <span className="animate-pulse text-white">|</span>}
        </p>
        
        <time className="text-xs opacity-60 mt-3 block text-white">
          {message.timestamp.toLocaleTimeString()}
        </time>

        {isSpeaking && (
          <div className="absolute -top-2 -right-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
      </Card>

      {agent.role === 'lawyer_defendant' && (
        <AgentAvatar agent={agent} size="sm" />
      )}
    </div>
  );
}