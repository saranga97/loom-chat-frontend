import { Header } from "@/components/layout/Header";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { UsernameForm } from "./UsernameForm";
import type { ChatMessage } from "@/types";

interface ChatWindowProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  toolCall: string | null;
  hasRoom: boolean;
  onSend: (message: string) => void;
  onClose: () => void;
  onStartChat: (username: string) => void;
  onRestart?: () => void;
}

export function ChatWindow({
  messages,
  isStreaming,
  toolCall,
  hasRoom,
  onSend,
  onClose,
  onStartChat,
  onRestart,
}: ChatWindowProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 ring-1 ring-black/5">
      <Header onClose={onClose} onRestart={hasRoom ? onRestart : undefined} />
      {hasRoom ? (
        <>
          <MessageList
            messages={messages}
            isStreaming={isStreaming}
            toolCall={toolCall}
          />
          <MessageInput onSend={onSend} disabled={isStreaming} />
        </>
      ) : (
        <UsernameForm onSubmit={onStartChat} />
      )}
    </div>
  );
}
