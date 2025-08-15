// components/preview/PreviewLightbox.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Device } from "./DeviceTabs";

type Props = { src: string };

const DEV_ORDER: Device[] = ["Desktop", "Tablet", "Mobile"];
const VIEW: Record<Device, { w: number; h: number }> = {
  Desktop: { w: 1280, h: 800 },
  Tablet:  { w: 834,  h: 1112 },
  Mobile:  { w: 390,  h: 844 },
};

export default function PreviewLightbox({ src }: Props) {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const open = sp.get("preview") === "1";
  const deviceParam = sp.get("device") as Device | null;
  const device: Device = deviceParam && DEV_ORDER.includes(deviceParam) ? deviceParam : "Desktop";

  const { w, h } = VIEW[device];

  const close = () => {
    const q = new URLSearchParams(sp.toString());
    q.delete("preview");
    q.delete("device");
    router.replace(q.size ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const setDevice = (d: Device) => {
    const q = new URLSearchParams(sp.toString());
    q.set("preview", "1");
    q.set("device", d);
    router.replace(`${pathname}?${q}`, { scroll: false });
  };

  // ★ Hooks は常に同じ順序で呼ぶ: open を見て振る舞いだけ分岐
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 p-6" aria-modal="true" role="dialog">
      <div className="relative w-full max-w-[92vw] rounded-2xl bg-white shadow-xl" style={{ maxHeight: "88vh" }}>
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="text-sm text-neutral-500">プレビュー</span>
            <div className="flex gap-6">
              {DEV_ORDER.map((d) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={`text-sm ${d === device ? "font-semibold" : "text-neutral-500 hover:text-neutral-800"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button onClick={close} aria-label="閉じる" className="grid h-8 w-8 place-items-center rounded-full border text-neutral-600 hover:bg-neutral-50">×</button>
        </div>

        <div className="overflow-auto p-4" style={{ maxHeight: "calc(88vh - 48px)" }}>
          <div className="mx-auto rounded-xl border bg-white" style={{ width: w + 2 }}>
            <iframe title="LP preview" src={src} width={w} height={h} className="block rounded-[10px]" style={{ border: 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
}