// components/Sidebar.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

const items = [
  { pane: "",        label: "📊 ダッシュボード" },
  { pane: "manage",  label: "📄 LP管理" },
  { pane: "templates", label: "📂 テンプレート一覧" },
  { pane: "news",    label: "🔔 お知らせ" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const pane = search.get("pane") ?? "";

  const pushPane = (p: string) => {
    const q = p ? `?pane=${p}` : "";
    router.push(`${pathname}${q}`, { scroll: false });
  };

  return (
    <aside className="w-56 shrink-0 border-r p-4 text-sm space-y-2">
      {items.map(it => {
        const active = pane === it.pane;
        return (
          <button
            key={it.pane || "dashboard"}
            onClick={() => pushPane(it.pane)}
            className={clsx(
              "block w-full text-left rounded px-3 py-2 hover:bg-neutral-100",
              active && "bg-neutral-900 text-white hover:bg-neutral-900"
            )}
          >
            {it.label}
          </button>
        );
      })}
    </aside>
  );
}