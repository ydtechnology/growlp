// components/panel/DashboardPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Stat = { label: string; value: string };
type QuickItem = { label: string; href?: string; onClick?: () => void };

export default function DashboardPanel() {
  // ここはダミー統計。実データに差し替え予定なら API 連携してOK
  const [stats, setStats] = useState<Stat[]>([
    { label: "本日の対話", value: "12" },
    { label: "生成したLP", value: "3" },
    { label: "下書き", value: "5" },
  ]);

  useEffect(() => {
    // TODO: /api から取得するならここで fetch
    setStats((s) => s);
  }, []);

  const quick: QuickItem[] = [
    { label: "新規LPを作成", href: "/?panel=editor" },
    { label: "テンプレを探す", href: "/?panel=templates" },
    { label: "最近の変更", href: "/?panel=manage" },
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="text-xs text-neutral-500">
        ダッシュボード（右パネル）
      </div>

      {/* サマリ統計 */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="border">
            <CardContent className="p-3">
              <div className="text-[11px] text-neutral-500">{s.label}</div>
              <div className="text-xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* クイックアクション */}
      <Card className="border">
        <CardContent className="p-3 space-y-2">
          <div className="text-sm font-medium">クイックアクション</div>
          <div className="flex flex-col gap-2">
            {quick.map((q) =>
              q.href ? (
                <Button key={q.label} asChild variant="secondary">
                  <a href={q.href}>{q.label}</a>
                </Button>
              ) : (
                <Button key={q.label} onClick={q.onClick}>
                  {q.label}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* お知らせ / 最近の更新（ダミー） */}
      <Card className="border">
        <CardContent className="p-3 space-y-2">
          <div className="text-sm font-medium">最近の更新</div>
          <ul className="text-xs list-disc pl-4 space-y-1 text-neutral-600">
            <li>多言語チャットの応答速度を改善しました</li>
            <li>テンプレ「シンプルLP」を追加しました</li>
            <li>プレビューの表示安定性を改善しました</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}