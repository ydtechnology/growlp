// app/(console)/right-panel-switch.tsx
"use client";

import { useSearchParams } from "next/navigation";
import RightPanel from "@/components/RightPanel";
import RightPanelManage from "@/components/RightPanelManage";
import RightPanelTemplates from "@/components/RightPanelTemplates";
import RightPanelNews from "@/components/RightPanelNews";

export function QueryRightPanel() {
  const pane = (useSearchParams().get("pane") ?? "") as
    | "" | "manage" | "templates" | "news";

  const Comp =
    pane === "manage"    ? RightPanelManage :
    pane === "templates" ? RightPanelTemplates :
    pane === "news"      ? RightPanelNews :
    RightPanel; // デフォはエディター

  return (
    <aside className="w-72 shrink-0 border-l">
      <Comp />
    </aside>
  );
}