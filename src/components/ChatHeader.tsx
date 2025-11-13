interface ChatHeaderProps {
  title: string;
  subtitle: string;
}

const ChatHeader = ({ title, subtitle }: ChatHeaderProps) => {
  return (
    <div className="chat-header">
      <h1 className="chat-title">{title}</h1>
      <p className="chat-subtitle">{subtitle}</p>
    </div>
  );
};

export default ChatHeader;

