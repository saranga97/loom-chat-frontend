import { Header } from "@/components/layout/Header";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import type { ChatMessage } from "@/types";

interface ChatWindowProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  toolCall: string | null;
  onSend: (message: string) => void;
  onClose: () => void;
}

export function ChatWindow({
  messages,
  isStreaming,
  toolCall,
  onSend,
  onClose,
}: ChatWindowProps) {
  return (
    <div className="flex flex-col h-full bg-background rounded-lg shadow-xl overflow-hidden border border-border">
      <Header onClose={onClose} />
      <MessageList
        messages={messages}
        isStreaming={isStreaming}
        toolCall={toolCall}
      />
      <MessageInput onSend={onSend} disabled={isStreaming} />
    </div>
  );
}
