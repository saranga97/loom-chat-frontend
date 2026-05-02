import type { TenantConfig, StartChatResponse, ChatHistoryResponse } from "@/types";

const BASE = "/api/v1";

export async function getTenant(tenantName: string): Promise<TenantConfig> {
  const res = await fetch(`${BASE}/tenants/${tenantName}`);
  if (!res.ok) throw new Error(`Tenant not found: ${tenantName}`);
  return res.json();
}

export async function startChat(
  tenantName: string,
  username: string
): Promise<StartChatResponse> {
  const res = await fetch(`${BASE}/chat/${tenantName}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error("Failed to start chat");
  return res.json();
}

export async function getHistory(
  tenantName: string,
  roomId: string
): Promise<ChatHistoryResponse> {
  const res = await fetch(`${BASE}/chat/${tenantName}/${roomId}/history`);
  if (!res.ok) throw new Error("Failed to get history");
  return res.json();
}
