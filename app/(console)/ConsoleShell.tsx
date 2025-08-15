"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PanelSwitch from "./panel-switch";

export default function ConsoleShell({ children }: { children: React.ReactNode }) {
  const sp = useSearchParams();
  const sideFromQuery = sp.get("side"); // "left" | "right" | null

  const [side, setSide] = useState<"left" | "right">("right");

  useEffect(() => {
    if (sideFromQuery === "left" || sideFromQuery === "right") {
      setSide(sideFromQuery);
      try { localStorage.setItem("consoleSide", sideFromQuery); } catch {}
    } else {
      try {
        const saved = localStorage.getItem("consoleSide");
        if (saved === "left" || saved === "right") setSide(saved);
      } catch {}
    }
  }, [sideFromQuery]);

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
              <PanelSwitch />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}