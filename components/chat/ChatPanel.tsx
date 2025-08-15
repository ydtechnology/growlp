"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE } from "@/lib/apiBase";

/* ============ Types ============ */
type Role = "user" | "assistant";
export type ChatMessage = { id: string; role: Role; content: string };

type HistoryItem = { role: Role; content: string };

export type ChatPanelProps = {
  /** セッションID（固定でOK。callerで決める） */
  sessionId: string;
  /** 初期メッセージ（履歴が空だったときにだけ表示） */
  emptyGreeting?: string;
};

/* ============ Component ============ */
export default function ChatPanel({
  sessionId,
  emptyGreeting = "こんにちは！LPの目的やターゲットを教えてください。",
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // “送信中フラグ”の競合防止（最新値を即時参照できるよう ref も併用）
  const sendingRef = useRef(false);

  // 初期履歴ロードの一度きり実行フラグ
  const didInitRef = useRef(false);

  // スクロール末尾用
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const historyUrl = useMemo(
    () => `${API_BASE}/session/${encodeURIComponent(sessionId)}/history`,
    [sessionId]
  );

  /* ---------- 履歴ロード ---------- */
  const loadHistory = async () => {
    try {
      const res = await fetch(historyUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as HistoryItem[];

      if (data.length > 0) {
        setMessages(data.map((m) => ({ id: uuidv4(), role: m.role, content: m.content })));
      } else {
        setMessages([{ id: uuidv4(), role: "assistant", content: emptyGreeting }]);
      }
    } catch {
      // API落ちてもUIは使えるように、既定の挨拶をセット
      setMessages([{ id: uuidv4(), role: "assistant", content: emptyGreeting }]);
    }
  };

  // 初回だけ履歴ロード
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    void loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // メッセージ更新時に下端へスムーズスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- 送信 ---------- */
  const send = async () => {
    const t = text.trim();
    if (!t || loading || sendingRef.current) return;

    sendingRef.current = true;
    setLoading(true);
    setText("");

    try {
      // 先にユーザー発言を表示（即時反映で体感を上げる）
      setMessages((prev) => [...prev, { id: uuidv4(), role: "user", content: t }]);

      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: t, lang: null }),
      });
      if (!res.ok) throw new Error(await res.text());

      // サーバー側で生成・保存された履歴で再同期
      await loadHistory();
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content: `エラーが発生しました：${e?.message ?? String(e)}`,
        },
      ]);
    } finally {
      setLoading(false);
      sendingRef.current = false;
    }
  };

  /* ---------- Enterで送信（IMEの確定Enterはブラウザ依存で安全・最小：Input=単行） ---------- */
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 単行の <Input> を使うことで、IME確定Enterが挿入改行に化ける経路を排除
    if (e.key === "Enter") {
      e.preventDefault();
      void send();
    }
  };

  /* ---------- UI ---------- */
  return (
    <section className="flex h-[calc(100vh-var(--header-h,56px))] flex-col">
      {/* 本文 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-2xl px-4 py-2 text-sm shadow ${
                  m.role === "user" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-900"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 入力行 */}
      <div className="border-t bg-white p-4">
        <div className="mx-auto flex max-w-2xl gap-2">
          <Input
            placeholder="メッセージを入力…（Enterで送信）"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading}
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
          <Button type="button" onClick={send} disabled={loading || !text.trim()}>
            {loading ? "送信中…" : "送信"}
          </Button>
        </div>
      </div>
    </section>
  );
}