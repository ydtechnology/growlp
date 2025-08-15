// growlp-web/lib/api.ts
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang?: string,
  tone?: string,
  formal?: boolean
) {
  const res = await fetch("http://<garpcore-server-ip>:8000/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      target_lang: targetLang,
      source_lang: sourceLang,
      tone,
      formal
    })
  });

  if (!res.ok) {
    throw new Error(`Translate API error: ${res.status}`);
  }
  const data = await res.json();
  return data.translated_text as string;
}