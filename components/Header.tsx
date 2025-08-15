// components/Header.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DeviceTabs, type Device } from "@/components/preview/DeviceTabs";

export default function Header() {
  const router = useRouter();
  const sp = useSearchParams();

  const current = (sp.get("device") as Device) || "Desktop";

  const openPreview = (d: Device) => {
    const q = new URLSearchParams(sp.toString());
    q.set("preview", "1");
    q.set("device", d);
    router.replace(`?${q.toString()}`, { scroll: false });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4">
        {/* 左：ロゴ */}
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-lg" aria-label="トップへ">
            GrowLp
          </Link>
          <span className="text-sm text-gray-500">コンソール</span>
        </div>

        {/* 右：デバイス切替（押すとプレビューダイアログが開く） */}
        <DeviceTabs value={current} onChange={openPreview} />
      </div>
    </header>
  );
}