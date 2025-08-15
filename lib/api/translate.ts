// growlp-web/lib/api/translate.ts
export type Lang = "ja" | "en" | "th" | "zh-CN" | "zh-TW" | "hi";

type TranslateRequest = {
  text: string;
  target_lang: Lang;
  source_lang?: Lang | null;
  tone?: string | null;
  formal?: boolean | null;
};

type TranslateResponse = {
  translated_text: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function translate(req: TranslateRequest): Promise<string> {
  const res = await fetch(`${API_BASE}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Translate failed: ${res.status} ${t}`);
  }
  const data: TranslateResponse = await res.json();
  return data.translated_text;
}