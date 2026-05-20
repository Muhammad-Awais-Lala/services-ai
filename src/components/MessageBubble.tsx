import React from 'react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  return (
    <div className={cn(
      "flex flex-col max-w-[75%]",
      isMe ? "ml-auto items-end" : "mr-auto items-start"
    )}>
      <div className={cn(
        "px-4 py-2 rounded-2xl text-sm shadow-sm",
        isMe 
          ? "bg-blue-600 text-white rounded-tr-none" 
          : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
      )}>
        {message.text}
      </div>
      <span className="text-[10px] text-gray-400 mt-1 px-1">
        {format(message.timestamp, 'p')}
      </span>
    </div>
  );
}
