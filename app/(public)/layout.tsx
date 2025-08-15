// growlp-web/app/(public)/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ページ",
  description: "LP公開側レイアウト",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white text-neutral-900">
        {/* コンソール用のHeaderやサイドは一切挿入しない */}
        {children}
      </body>
    </html>
  );
}