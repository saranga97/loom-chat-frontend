import { useState, useCallback, useRef, useEffect } from "react";
import { useWebSocket } from "./useWebSocket";
import { startChat as apiStartChat, getHistory } from "@/api/tenant";
import type { ChatMessage, WSEvent } from "@/types";

interface UseChatOptions {
  tenantName: string;
}

const STORAGE_KEY_PREFIX = "loom_chat_";

function getSessionKey(tenantName: string) {
  return `${STORAGE_KEY_PREFIX}${tenantName}`;
}

function saveSession(tenantName: string, roomId: string, username: string) {
  sessionStorage.setItem(
    getSessionKey(tenantName),
    JSON.stringify({ roomId, username })
  );
}

function loadSession(tenantName: string): { roomId: string; username: string } | null {
  try {
    const raw = sessionStorage.getItem(getSessionKey(tenantName));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.roomId && parsed.username) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function useChat({ tenantName }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [toolCall, setToolCall] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(true);
  const bufferRef = useRef("");

  const handleEvent = useCallback((event: WSEvent) => {
    switch (event.event) {
      case "token": {
        const content = (event.data as { content?: string }).content ?? "";
        bufferRef.current += content;
        const accumulated = bufferRef.current;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return [...prev.slice(0, -1), { ...last, content: accumulated }];
          }
          return [...prev, { role: "assistant", content: accumulated }];
        });
        break;
      }
      case "tool_call": {
        const tool = (event.data as { tool?: string }).tool ?? "Processing";
        setToolCall(tool);
        break;
      }
      case "tool_result": {
        setToolCall(null);
        break;
      }
      case "done": {
        setIsStreaming(false);
        setToolCall(null);
        bufferRef.current = "";
        break;
      }
      case "error": {
        setIsStreaming(false);
        setToolCall(null);
        bufferRef.current = "";
        const errorMsg =
          (event.data as { error?: string }).error ?? "An error occurred";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${errorMsg}` },
        ]);
        break;
      }
    }
  }, []);

  const { connect, send, disconnect } = useWebSocket({
    onEvent: handleEvent,
    onOpen: () => setIsConnected(true),
    onClose: () => setIsConnected(false),
  });

  // Restore session on mount
  useEffect(() => {
    const session = loadSession(tenantName);
    if (session) {
      setRoomId(session.roomId);
      setUsername(session.username);
      getHistory(tenantName, session.roomId)
        .then((history) => {
          if (history.messages.length > 0) {
            setMessages(history.messages);
          }
          connect(tenantName, session.roomId);
        })
        .catch(() => {
          // Session expired or room deleted — clear and show fresh start
          sessionStorage.removeItem(getSessionKey(tenantName));
          setRoomId(null);
          setUsername(null);
        })
        .finally(() => setRestoring(false));
    } else {
      setRestoring(false);
    }
  }, [tenantName, connect]);

  const handleStartChat = useCallback(
    async (name: string) => {
      const result = await apiStartChat(tenantName, name);
      setRoomId(result.room_id);
      setUsername(name);
      setMessages([{ role: "assistant", content: result.greeting }]);
      saveSession(tenantName, result.room_id, name);
      connect(tenantName, result.room_id);
    },
    [tenantName, connect]
  );

  const handleSend = useCallback(
    (content: string) => {
      if (!content.trim() || isStreaming) return;
      setMessages((prev) => [...prev, { role: "user", content }]);
      setIsStreaming(true);
      bufferRef.current = "";
      send(content);
    },
    [send, isStreaming]
  );

  const handleRestart = useCallback(async () => {
    if (!username) return;
    disconnect();
    const result = await apiStartChat(tenantName, username);
    setRoomId(result.room_id);
    setMessages([{ role: "assistant", content: result.greeting }]);
    setIsStreaming(false);
    setToolCall(null);
    bufferRef.current = "";
    saveSession(tenantName, result.room_id, username);
    connect(tenantName, result.room_id);
  }, [tenantName, username, disconnect, connect]);

  return {
    messages,
    isStreaming,
    isConnected,
    toolCall,
    roomId,
    username,
    restoring,
    handleStartChat,
    handleSend,
    handleRestart,
  };
}
