import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ToolCallIndicator } from "./ToolCallIndicator";
import type { ChatMessage } from "@/types";

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  isLoadingGreeting: boolean;
  toolCall: string | null;
}

export function MessageList({
  messages,
  isStreaming,
  isLoadingGreeting,
  toolCall,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming, toolCall]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
      {/* Date separator */}
      <div className="text-center mb-4">
        <span className="text-xs text-muted-foreground">Today</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {messages.map((msg, i) => {
          const next = messages[i + 1];
          const isLastInGroup = !next || next.role !== msg.role;

          return (
            <MessageBubble
              key={i}
              message={msg}
              showAvatar={isLastInGroup}
            />
          );
        })}
        {isLoadingGreeting && <TypingIndicator />}
        {toolCall && <ToolCallIndicator toolName={toolCall} />}
        {isStreaming && !toolCall && messages[messages.length - 1]?.role !== "assistant" && (
          <TypingIndicator />
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
