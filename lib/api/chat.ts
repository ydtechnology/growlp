// growlp-web/lib/api/chat.ts
export type ChatResponse = {
  reply: string;
  source: string;
  reason: string;
  handled: boolean;
};

type ChatRequest = {
  session_id: string;
  message: string;
  lang: string | null;
};

const BASE =
  process.env.NEXT_PUBLIC_GARPCORE_URL || "http://163.44.123.12:8000";

/**
 * /chat にPOSTして応答を返す
 */
export async function postChat(payload: ChatRequest): Promise<ChatResponse> {
  const url = `${BASE}/chat`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // 同一オリジンではないので、必要なら credentials 追加（今は不要）
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`POST /chat ${res.status} ${txt}`);
  }

  return (await res.json()) as ChatResponse;
}