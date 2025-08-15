"use client";

import { useEffect, useMemo, useState } from "react";
import RightPanelSwitch from "./right-panel-switch";

export default function ConsoleShell({ children }: { children: React.ReactNode }) {
  // 設定画面からのみ変更される
  const [side, setSide] = useState<"left" | "right">("right");

  useEffect(() => {
    // 初期値は localStorage
    try {
      const saved = localStorage.getItem("consoleSide");
      if (saved === "left" || saved === "right") setSide(saved);
    } catch {}

    // 設定画面からのカスタムイベントで反映
    const onSideChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as "left" | "right" | undefined;
      if (detail === "left" || detail === "right") setSide(detail);
    };
    window.addEventListener("console:side-change", onSideChange);
    return () => window.removeEventListener("console:side-change", onSideChange);
  }, []);

  const orders = useMemo(() => {
    if (side === "left") {
      return { chat: "order-2 md:order-2", right: "order-1 md:order-1" };
    }
    return { chat: "order-1 md:order-1", right: "order-2 md:order-2" };
  }, [side]);

  return (
    <div
      className="flex w-full"
      style={{ minHeight: "calc(100vh - var(--header-h, 56px))" }}
    >
      <main className="flex-1 overflow-hidden bg-white">
        <div className="mx-auto h-full w-full max-w-[1400px] px-4">
          <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-12">
            {/* チャット側：5/12 */}
            <section
              className={`col-span-12 md:col-span-5 xl:col-span-5 ${orders.chat} overflow-auto`}
            >
              {children}
            </section>

            {/* 右パネル：7/12 */}
            <aside
              className={`col-span-12 md:col-span-7 xl:col-span-7 ${orders.right} border-l bg-white`}
            >
              <RightPanelSwitch />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}