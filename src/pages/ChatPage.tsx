import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { TenantProvider, useTenant } from "@/providers/TenantProvider";
import { useChat } from "@/hooks/useChat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { FloatingChatIcon } from "@/components/layout/FloatingChatIcon";

function ChatPageInner({ tenantName }: { tenantName: string }) {
  const { tenant, loading, error } = useTenant();
  const chat = useChat({ tenantName });
  const [chatOpen, setChatOpen] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Auto-open chat window when room becomes available
  const prevRoomId = useRef<string | null>(null);
  if (chat.roomId && chat.roomId !== prevRoomId.current) {
    prevRoomId.current = chat.roomId;
    if (!chatOpen) {
      setChatOpen(true);
    }
  }

  // Close on outside click
  useEffect(() => {
    if (!chatOpen) return;

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      // Ignore clicks inside portalled popover/tooltip content
      if (target.closest("[data-slot='popover-content']") || target.closest("[data-slot='tooltip-content']")) {
        return;
      }
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(target)
      ) {
        setChatOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [chatOpen]);

  if (loading || chat.restoring) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="flex items-center justify-center h-screen text-destructive">
        {error ?? "Tenant not found"}
      </div>
    );
  }

  return (
    <>
      {chatOpen && (
        <div
          ref={chatWindowRef}
          className="fixed bottom-24 right-6 w-[400px] h-[600px] z-50 animate-slide-up-fade"
        >
          <ChatWindow
            messages={chat.messages}
            isStreaming={chat.isStreaming}
            toolCall={chat.toolCall}
            hasRoom={!!chat.roomId}
            onSend={chat.handleSend}
            onClose={() => setChatOpen(false)}
            onStartChat={chat.handleStartChat}
            onRestart={chat.handleRestart}
          />
        </div>
      )}
      <FloatingChatIcon onClick={() => setChatOpen(true)} />
    </>
  );
}

export function ChatPage() {
  const { tenantName } = useParams<{ tenantName: string }>();

  if (!tenantName) {
    return (
      <div className="flex items-center justify-center h-screen text-destructive">
        Missing tenant name
      </div>
    );
  }

  return (
    <TenantProvider tenantName={tenantName}>
      <ChatPageInner tenantName={tenantName} />
    </TenantProvider>
  );
}
