// app/(console)/layout.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import RightPanel from "@/components/rightpanel/RightPanel";
import PreviewLightbox from "@/components/preview/PreviewLightbox";

export const metadata: Metadata = {
  title: "GrowLp",
  description: "GrowLp dashboard",
};

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div
        className="flex"
        style={{ minHeight: "calc(100vh - var(--header-h, 56px))" }}
      >
        <aside className="w-56 shrink-0 border-r p-4 text-sm space-y-3 bg-white">
          <div>📊 ダッシュボード</div>
          <div>📄 LP管理</div>
          <div>📂 テンプレート一覧</div>
          <div>🔔 お知らせ</div>
        </aside>

        <main className="flex-1 overflow-auto p-6 bg-white">{children}</main>

        <aside className="w-72 shrink-0 border-l bg-white">
          <RightPanel />
        </aside>
      </div>

      {/* ?preview=1&device=... で開く */}
      <PreviewLightbox src="/sample-lp" />
    </>
  );
}