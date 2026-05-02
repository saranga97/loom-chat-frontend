import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { TenantProvider, useTenant } from "@/providers/TenantProvider";
import { useChat } from "@/hooks/useChat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { UsernameDialog } from "@/components/layout/UsernameDialog";
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
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(e.target as Node)
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

  // No room yet — show floating icon + username dialog
  if (!chat.roomId) {
    return (
      <>
        <UsernameDialog
          open={chatOpen}
          onSubmit={(name) => {
            chat.handleStartChat(name);
          }}
        />
        <FloatingChatIcon onClick={() => setChatOpen(true)} />
      </>
    );
  }

  // Room exists — toggle between floating icon and chat window
  return (
    <>
      {chatOpen && (
        <div
          ref={chatWindowRef}
          className="fixed bottom-24 right-6 w-[400px] h-[600px] z-50"
        >
          <ChatWindow
            messages={chat.messages}
            isStreaming={chat.isStreaming}
            toolCall={chat.toolCall}
            onSend={chat.handleSend}
            onClose={() => setChatOpen(false)}
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
