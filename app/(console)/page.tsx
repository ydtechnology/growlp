// app/(console)/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Role = "user" | "assistant";
type Msg = { id: string; role: Role; content: string };

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") ||
  "http://163.44.123.12:8000";
const SESSION_ID = "test-session-1";

export default function DashboardChatCenter() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const didInitRef = useRef(false);
  const sendingRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // IME/Enter ガード
  const isComposingRef = useRef(false);
  const blockEnterUntilKeyUpRef = useRef(false);

  /* -------- 履歴ロード -------- */
  async function loadHistory() {
    try {
      const res = await fetch(
        `${API_BASE}/session/${encodeURIComponent(SESSION_ID)}/history`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as {
        role: Role;
        content: string;
      }[];
      setMessages(
        (data?.length
          ? data
          : [{ role: "assistant", content: "こんにちは！LPの目的やターゲットを教えてください。" }]
        ).map((m) => ({ id: uuidv4(), role: m.role, content: m.content }))
      );
    } catch {
      setMessages([
        {
          id: uuidv4(),
          role: "assistant",
          content: "こんにちは！LPの目的やターゲットを教えてください。",
        },
      ]);
    }
  }

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    void loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------- 送信 -------- */
  const send = async () => {
    const t = text.trim();
    if (!t || loading || sendingRef.current) return;

    sendingRef.current = true;
    setLoading(true);
    setText("");

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: SESSION_ID, message: t, lang: null }),
      });
      if (!res.ok) throw new Error(await res.text());
      await loadHistory();
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { id: uuidv4(), role: "user", content: t },
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

  /* -------- 入力欄のキー制御（Enter=送信 / Shift+Enter=改行 / IME確定は送らない） -------- */
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;

    // Shift+Enter は改行許可
    if (e.shiftKey) return;

    // IME確定中 or 確定直後の押しっぱ Enter は完全ブロック
    const ne = e.nativeEvent as any;
    const composing =
      isComposingRef.current ||
      ne?.isComposing === true ||
      ne?.keyCode === 229 ||
      ne?.key === "Process" ||
      ne?.code === "Process" ||
      blockEnterUntilKeyUpRef.current;

    if (composing) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // ここまで来たら Enter 送信
    e.preventDefault();
    e.stopPropagation();
    void send();
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      // IME確定直後の押しっぱ Enter ブロック解除
      blockEnterUntilKeyUpRef.current = false;
    }
  };

  return (
    <section className="flex h-[calc(100vh-var(--header-h,56px))] flex-col">
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 text-sm shadow ${
                  m.role === "user"
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-900"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t bg-white p-4">
        <div className="mx-auto flex max-w-2xl gap-2 items-end">
          <div className="flex-1">
            <textarea
              className="w-full min-h-[44px] max-h-40 resize-y rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
              placeholder="メッセージを入力…（Enterで送信 / Shift+Enterで改行）"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onCompositionStart={() => {
                isComposingRef.current = true;
              }}
              onCompositionEnd={() => {
                // 確定直後の押しっぱ Enter を KeyUp までブロック
                isComposingRef.current = false;
                blockEnterUntilKeyUpRef.current = true;
              }}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              enterKeyHint="send"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              autoComplete="off"
              rows={2}
              disabled={loading}
            />
          </div>

          <Button type="button" onClick={send} disabled={loading || !text.trim()}>
            {loading ? "送信中…" : "送信"}
          </Button>
        </div>
      </div>
    </section>
  );
}