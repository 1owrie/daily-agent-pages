import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  formatTime: (timestamp: number) => string;
}

const MessageBubble = ({ message, formatTime }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`message-wrapper ${isUser ? 'user-message' : 'assistant-message'}`}>
      {/* AI消息 */}
      {!isUser && (
        <>
          <div className="avatar assistant-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="white"/>
            </svg>
          </div>
          <div className="message-content-wrapper">
            <div className="message-bubble assistant-bubble">
              {message.content}
            </div>
            <div className="message-time">{formatTime(message.timestamp)}</div>
          </div>
        </>
      )}

      {/* 用户消息 */}
      {isUser && (
        <>
          <div className="message-content-wrapper">
            <div className="message-bubble user-bubble">
              {message.content}
            </div>
            <div className="message-time right">{formatTime(message.timestamp)}</div>
          </div>
          <div className="avatar user-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="white"/>
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageBubble;

