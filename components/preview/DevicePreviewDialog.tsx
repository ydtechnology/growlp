// growlp-web/components/preview/DevicePreviewDialog.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DeviceTabs, type Device } from "./DeviceTabs";

const DEVICES = ["Desktop", "Tablet", "Mobile"] as const;
function isDevice(v: unknown): v is Device {
  return typeof v === "string" && (DEVICES as readonly string[]).includes(v as string);
}

const DEVICE_SIZES: Record<Device, { width: number; height: number }> = {
  Desktop: { width: 1280, height: 800 },
  Tablet:  { width: 834,  height: 1112 },
  Mobile:  { width: 390,  height: 844 },
};

export default function DevicePreviewDialog({ src }: { src: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();

  const previewOn = sp.get("preview") === "1";
  const deviceFromQuery = sp.get("device");
  const deviceParam: Device = isDevice(deviceFromQuery) ? (deviceFromQuery as Device) : "Desktop";

  const [open, setOpen] = React.useState(previewOn);
  const [device, setDevice] = React.useState<Device>(deviceParam);

  React.useEffect(() => {
    setOpen(previewOn);
    setDevice(deviceParam);
  }, [previewOn, deviceParam]);

  const replaceQuery = React.useCallback(
    (next: Partial<{ open: boolean; device: Device }>) => {
      const q = new URLSearchParams(sp.toString());

      if (typeof next.open === "boolean") {
        if (next.open) q.set("preview", "1");
        else {
          q.delete("preview");
          q.delete("device");
        }
      }
      if (next.device) {
        q.set("device", next.device);
        if (!q.get("preview")) q.set("preview", "1");
      }

      const search = q.toString();
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    },
    [router, sp, pathname]
  );

  const { width, height } = DEVICE_SIZES[device];

  // iframe 用に embed=1 を必ず付与（プレビュー専用表示）
  const iframeSrc = React.useMemo(() => {
    try {
      const u = new URL(src, typeof window !== "undefined" ? window.location.origin : "http://localhost");
      u.searchParams.set("embed", "1");
      return u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString()}` : "");
    } catch {
      return src + (src.includes("?") ? "&" : "?") + "embed=1";
    }
  }, [src]);

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[1000]"
      onClick={() => replaceQuery({ open: false })}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="absolute left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-[1440px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="閉じる"
          onClick={() => replaceQuery({ open: false })}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 text-neutral-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <span aria-hidden className="text-2xl leading-none">&times;</span>
        </button>

        <div className="mb-4 flex items-center justify-center">
          <DeviceTabs
            value={device}
            onChange={(d) => {
              setDevice(d);
              replaceQuery({ device: d, open: true });
            }}
          />
        </div>

        <div className="max-h-[72vh] w-full overflow-auto rounded border bg-neutral-50 p-4">
          <div className="mx-auto rounded border bg-white shadow" style={{ width }}>
            <iframe src={iframeSrc} width={width} height={height} className="block rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}