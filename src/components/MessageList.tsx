import { useRef, useEffect } from 'react';
import type { Message } from '../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  formatTime: (timestamp: number) => string;
}

const MessageList = ({ messages, formatTime }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="messages-container">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} formatTime={formatTime} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

