"use client";

import { useSearchParams } from "next/navigation";
import DashboardPanel from "@/components/panel/DashboardPanel";
import EditorPanel from "@/components/panel/EditorPanel";
import ManagePanel from "@/components/panel/ManagePanel";
import TemplatesPanel from "@/components/panel/TemplatesPanel";
import NewsPanel from "@/components/panel/NewsPanel";
import SettingPanel from "@/components/panel/SettingPanel";

export default function RightPanelSwitch() {
  const sp = useSearchParams();
  const panel = (sp.get("panel") || "dashboard").toLowerCase();

  switch (panel) {
    case "dashboard":
      return <DashboardPanel />;
    case "editor":
      return <EditorPanel />;
    case "manage":
      return <ManagePanel />;
    case "templates":
      return <TemplatesPanel />;
    case "news":
      return <NewsPanel />;
    case "settings":
    case "setting":
      return <SettingPanel />;
    default:
      return <DashboardPanel />;
  }
}