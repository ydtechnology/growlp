"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";

import DashboardPanel from "@/components/panel/DashboardPanel";
import EditorPanel from "@/components/panel/EditorPanel";
import ManagePanel from "@/components/panel/ManagePanel";
import TemplatesPanel from "@/components/panel/TemplatesPanel";
import NewsPanel from "@/components/panel/NewsPanel";
import SettingPanel from "@/components/panel/SettingPanel";

type Props = {
  className?: ComponentProps<"aside">["className"];
};

export default function PanelSwitch({ className }: Props) {
  const sp = useSearchParams();
  const panel = (sp.get("panel") || "dashboard").toLowerCase();

  let node: React.ReactNode;
  switch (panel) {
    case "dashboard":
      node = <DashboardPanel />;
      break;
    case "editor":
      node = <EditorPanel />;
      break;
    case "manage":
      node = <ManagePanel />;
      break;
    case "templates":
      node = <TemplatesPanel />;
      break;
    case "news":
      node = <NewsPanel />;
      break;
    case "settings":
    case "setting":
      node = <SettingPanel />;
      break;
    default:
      node = <DashboardPanel />;
  }

  return (
    <aside className={className}>
      {node}
    </aside>
  );
}