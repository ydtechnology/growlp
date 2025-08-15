"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function RightPanelSettings() {
  const [side, setSide] = useState<"left" | "right">("right");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("consoleSide");
      if (saved === "left" || saved === "right") setSide(saved);
    } catch {}
  }, []);

  const apply = (next: "left" | "right") => {
    setSide(next);
    try {
      localStorage.setItem("consoleSide", next);
    } catch {}
    // ConsoleShell に反映（同タブでも反応させるためにカスタムイベント）
    window.dispatchEvent(new CustomEvent("console:side-change", { detail: next }));
  };

  return (
    <div className="h-full overflow-auto">
      <div className="border-b p-3">
        <h2 className="text-sm font-semibold">設定</h2>
        <p className="text-xs text-neutral-500">レイアウトや表示を変更できます。</p>
      </div>

      <div className="p-3 space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">レイアウト（左右入れ替え）</Label>
              <p className="text-xs text-neutral-500">チャットと右パネルの配置を選択</p>
            </div>

            <ToggleGroup
              type="single"
              value={side}
              onValueChange={(v) => v && apply(v as "left" | "right")}
              className="gap-1"
            >
              <ToggleGroupItem value="left" className="px-3 py-1 text-xs">
                右→左（パネルが左）
              </ToggleGroupItem>
              <ToggleGroupItem value="right" className="px-3 py-1 text-xs">
                左→右（パネルが右）
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Card>
      </div>
    </div>
  );
}