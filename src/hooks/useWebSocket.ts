import { useRef, useCallback, useEffect } from "react";
import type { WSEvent } from "@/types";

interface UseWebSocketOptions {
  onEvent: (event: WSEvent) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const connect = useCallback((tenantName: string, roomId: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const url = `${protocol}//${window.location.host}/api/v1/chat/${tenantName}/${roomId}/ws`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      optionsRef.current.onOpen?.();
    };

    ws.onmessage = (e) => {
      try {
        const event: WSEvent = JSON.parse(e.data);
        optionsRef.current.onEvent(event);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      optionsRef.current.onClose?.();
    };

    wsRef.current = ws;
  }, []);

  const send = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "message", content }));
    }
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return { connect, send, disconnect };
}
