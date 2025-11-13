interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const ChatInput = ({ value, onChange, onSend, disabled = false }: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="input-container">
      <textarea
        className="message-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
        rows={1}
        disabled={disabled}
      />
      <button 
        className="send-button"
        onClick={onSend}
        disabled={!value.trim() || disabled}
      >
        发送
      </button>
    </div>
  );
};

export default ChatInput;

