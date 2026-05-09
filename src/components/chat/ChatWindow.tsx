import { Header } from "@/components/layout/Header";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { UsernameForm } from "./UsernameForm";
import { useTenant } from "@/providers/TenantProvider";
import type { ChatMessage } from "@/types";

interface ChatWindowProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  isLoadingGreeting: boolean;
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
  isLoadingGreeting,
  toolCall,
  hasRoom,
  onSend,
  onClose,
  onStartChat,
  onRestart,
}: ChatWindowProps) {
  const { tenant } = useTenant();
  const bgColor = tenant?.theme_colors?.background || "#FFFFFF";
  const textColor = tenant?.theme_colors?.text || "#0F172A";

  return (
    <div
      className="flex flex-col h-full rounded-2xl shadow-2xl overflow-hidden border border-gray-200 ring-1 ring-black/5"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <Header onClose={onClose} onRestart={hasRoom ? onRestart : undefined} />
      {hasRoom ? (
        <>
          <MessageList
            messages={messages}
            isStreaming={isStreaming}
            isLoadingGreeting={isLoadingGreeting}
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
