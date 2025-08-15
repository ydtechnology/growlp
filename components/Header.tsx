// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DeviceTabs, type Device } from "@/components/preview/DeviceTabs";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const current = (sp.get("device") as Device) || "Desktop";

  const openPreview = (d: Device) => {
    const q = new URLSearchParams(sp.toString());
    q.set("preview", "1");
    q.set("device", d);
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  };

  const goPanel = (panel: string) => {
    const q = new URLSearchParams(sp.toString());
    q.set("panel", panel);
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4">
        {/* 左：ロゴ + ダッシュボード */}
        <div className="flex items-center gap-2">
          <Link href="/(console)" className="font-bold text-lg" aria-label="トップへ">
            GrowLp
          </Link>
          <span className="text-sm text-gray-500">コンソール</span>

          {/* ← これが動くように修正 */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="ml-3"
            onClick={() => goPanel("dashboard")}
            title="右パネルをダッシュボードに切り替え"
          >
            ダッシュボード
          </Button>
        </div>

        {/* 右：デバイス切替（押すとプレビューが開く） */}
        <DeviceTabs value={current} onChange={openPreview} />
      </div>
    </header>
  );
}