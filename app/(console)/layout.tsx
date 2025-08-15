import type { Metadata } from "next";
import Header from "@/components/Header";
import PanelSwitch from "./panel-switch";
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
        {/* 左：チャット（常時表示） */}
        <main className="flex-1 overflow-auto bg-white p-4">
          {children}
        </main>

        {/* 右：スイッチ可能なパネル（Dashboard / Editor / …） */}
        <PanelSwitch
          className="
            border-l bg-white
            w-full
            md:w-[46%]   /* md〜xl: 4:6 程度 */
            xl:w-[58%]   /* xl以上: 5:7 程度 */
          "
        />
      </div>

      {/* ?preview=1&device=... で開く */}
      <PreviewLightbox src="/sample-lp" />
    </>
  );
}