'use client';

import { useMemo } from "react";
import DevicePreview from "@/components/preview/DevicePreview";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PreviewPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const src = useMemo(() => sp.get("src") || "/sample-lp", [sp]);

  return (
    <section className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">デバイス別プレビュー</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>× 閉じる</Button>
        </div>
      </div>

      <DevicePreview src={src} height={1000} />
    </section>
  );
}