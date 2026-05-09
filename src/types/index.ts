export interface ThemeColors {
  primary: string;
  secondary: string;
  text: string;
  background: string;
  mode: string;
  position: string;
  floating_icon: string;
  header_icon: string;
  animation: string;
}

export interface TenantConfig {
  tenant_name: string;
  chatbot_name: string;
  logo_url: string | null;
  theme_colors: ThemeColors;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface StartChatResponse {
  room_id: string;
  username: string;
  greeting: string;
}

export interface ChatHistoryResponse {
  room_id: string;
  username: string;
  messages: ChatMessage[];
}

export type WSEventType = "token" | "tool_call" | "tool_result" | "done" | "error";

export interface WSEvent {
  event: WSEventType;
  data: Record<string, unknown>;
}
