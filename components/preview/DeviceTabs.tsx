// components/preview/DeviceTabs.tsx
"use client";
import { Button } from "@/components/ui/button";

export type Device = "Desktop" | "Tablet" | "Mobile";

export function DeviceTabs({
  value,
  onChange,
}: {
  value: Device;
  onChange: (d: Device) => void;
}) {
  const tabs: Device[] = ["Desktop", "Tablet", "Mobile"];
  return (
    <div className="flex items-center gap-2">
      {tabs.map((t) => (
        <Button
          key={t}
          size="sm"
          variant={value === t ? "default" : "outline"}
          onClick={() => onChange(t)}
        >
          {t}
        </Button>
      ))}
    </div>
  );
}