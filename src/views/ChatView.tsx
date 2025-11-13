import { useState } from 'react';
import type { Message } from '../types';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import { sendGraphQLMessage } from '../services/graphqlClient';
import '../components/AIAgent.css';

const ChatView = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是 AI 助手，有什么可以帮助你的吗？',
      timestamp: Date.now(),
      status: 'sent',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState<string>(() => `conv_${Date.now()}`);

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
      status: 'sent',
    };

    const messageContent = inputValue;
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 调用 GraphQL API
    try {
      const response = await sendGraphQLMessage({
        message: messageContent,
        conversationId: conversationId,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response || '抱歉，我没有收到有效的回复。',
        timestamp: response.timestamp || Date.now(),
        status: 'sent',
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI响应错误:', error);

      // 显示错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，服务暂时不可用。请稍后再试。',
        timestamp: Date.now(),
        status: 'sent',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <ChatHeader 
          title="DiabloGPT AI Assistant" 
          subtitle="AI 智能助手" 
        />
        <MessageList 
          messages={messages} 
          formatTime={formatTime} 
        />
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatView;

