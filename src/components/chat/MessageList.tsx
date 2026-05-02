import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ToolCallIndicator } from "./ToolCallIndicator";
import type { ChatMessage } from "@/types";

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  toolCall: string | null;
}

export function MessageList({
  messages,
  isStreaming,
  toolCall,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming, toolCall]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 min-h-0"
    >
      <div className="flex flex-col gap-3">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {toolCall && <ToolCallIndicator toolName={toolCall} />}
        {isStreaming && !toolCall && messages[messages.length - 1]?.role !== "assistant" && (
          <TypingIndicator />
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
