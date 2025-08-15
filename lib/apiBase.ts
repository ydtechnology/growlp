// lib/apiBase.ts
export const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000").replace(/\/+$/, "");

// デバッグ用：ブラウザで window.__API_BASE を確認できるように
if (typeof window !== "undefined") {
  (window as any).__API_BASE = API_BASE;
  console.log("[API_BASE]", API_BASE);
}