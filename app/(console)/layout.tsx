// app/(console)/layout.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import RightPanelSwitch from "./right-panel-switch";
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
        className="mx-auto flex w-full max-w-[1400px] gap-0"
        style={{ minHeight: "calc(100vh - var(--header-h, 56px))" }}
      >
        {/* 左：スイッチ可能なパネル（ダッシュボード/エディタなど） */}
        <RightPanelSwitch
          className="
            border-r bg-white
            w-full
            md:w-[60%]   /* md〜lg は 6 : 4 でパネル広め */
            xl:w-[66%]   /* xl〜 は 2/3 をパネルに割り当て（チャット狭め） */
          "
        />

        {/* 右：チャット（常時表示） */}
        <main
          className="
            flex-1 overflow-auto bg-white p-4
          "
        >
          {children}
        </main>
      </div>

      {/* プレビュー */}
      <PreviewLightbox src="/sample-lp" />
    </>
  );
}