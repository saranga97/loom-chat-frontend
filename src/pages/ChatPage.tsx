import { useState, useEffect } from "react";
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

  // Auto-open chat window when session is restored
  useEffect(() => {
    if (chat.roomId && !chat.restoring) {
      setChatOpen(true);
    }
  }, [chat.roomId, chat.restoring]);

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
        <div className="fixed bottom-24 right-6 w-[400px] h-[600px] z-50">
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
