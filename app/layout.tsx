// app/layout.tsx
import "../styles/globals.css";   // ← ここを修正（元: "./styles/globals.css"）

import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}