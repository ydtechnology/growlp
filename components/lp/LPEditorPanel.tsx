// growlp-web/components/lp/LPEditorPanel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE } from "../../lib/apiBase"; // ← 階層を2つ戻って lib/apiBase を参照

/* ============================ Types ============================ */
type Section = { heading: string; body: string };
type LPDoc = {
  id: string;
  title: string;
  subtitle: string;
  heroImage: string; // ファーストビュー画像URL
  sections: Section[];
  ctaText: string;
  ctaUrl: string;
  updatedAt: string;
};

type JsonPatchOp = { op: "replace" | "add" | "remove"; path: string; value?: any };

const PATCH_EVENT = "lp:applyPatch";

/* ============================ Utils ============================ */
// LPDoc 形に正規化（欠損補完）
function normalizeDoc(input: any): LPDoc {
  const arr = Array.isArray(input?.sections) ? input.sections : [];
  const now = new Date().toISOString();
  return {
    id: String(input?.id ?? ""),
    title: String(input?.title ?? ""),
    subtitle: String(input?.subtitle ?? ""),
    heroImage: String(input?.heroImage ?? ""),
    sections: arr.map((s: any) => ({
      heading: String(s?.heading ?? ""),
      body: String(s?.body ?? ""),
    })),
    ctaText: String(input?.ctaText ?? ""),
    ctaUrl: String(input?.ctaUrl ?? ""),
    updatedAt: String(input?.updatedAt ?? now),
  };
}

// JSON Pointer 解決
function resolvePointer(root: any, pointer: string): { parent: any; key: string | number } | null {
  if (!pointer || !pointer.startsWith("/")) return null;
  const parts = pointer
    .slice(1)
    .split("/")
    .map((k) => k.replace(/~1/g, "/").replace(/~0/g, "~"));
  let cur = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    const idx = String(+k) === k ? +k : (k as any);
    if (cur == null || !(idx in cur)) return null;
    cur = cur[idx];
  }
  const last = parts[parts.length - 1];
  const lastIdx = String(+last) === last ? +last : (last as any);
  return { parent: cur, key: lastIdx };
}

function applySinglePatch(doc: LPDoc, patch: JsonPatchOp): LPDoc {
  const clone: any = structuredClone(doc);
  const loc = resolvePointer(clone, patch.path);
  if (!loc) return doc;
  const { parent, key } = loc;

  switch (patch.op) {
    case "replace":
      parent[key] = patch.value;
      break;
    case "add":
      if (Array.isArray(parent)) {
        const idx = typeof key === "number" ? key : parent.length;
        parent.splice(idx, 0, patch.value);
      } else {
        parent[key] = patch.value;
      }
      break;
    case "remove":
      if (Array.isArray(parent) && typeof key === "number") {
        parent.splice(key, 1);
      } else if (parent && key in parent) {
        delete (parent as any)[key as any];
      }
      break;
    default:
      return doc;
  }
  clone.updatedAt = new Date().toISOString();
  return normalizeDoc(clone);
}

function applyJsonPatch(doc: LPDoc, patch: JsonPatchOp | JsonPatchOp[] | any): LPDoc {
  if (!patch) return doc;
  const ops: JsonPatchOp[] = Array.isArray(patch)
    ? patch
    : Array.isArray(patch?.ops)
    ? patch.ops
    : Array.isArray(patch?.patches)
    ? patch.patches
    : [patch];
  let next = doc;
  for (const op of ops) {
    if (!op || !op.op || !op.path) continue;
    next = applySinglePatch(next, op);
  }
  return next;
}

/* ======================= Debounced Save ======================== */
function useDebounceSave(doc: LPDoc | null, onDirty: (b: boolean) => void) {
  const timerRef = useRef<number | null>(null);
  const latestRef = useRef<LPDoc | null>(doc);

  useEffect(() => {
    latestRef.current = doc;
  }, [doc]);

  // ページ離脱時のベストエフォート保存
  useEffect(() => {
    const onUnload = () => {
      const d = latestRef.current;
      if (!d) return;
      try {
        navigator.sendBeacon?.(
          `${API_BASE}/lp/${d.id}`,
          new Blob(
            [
              JSON.stringify({
                title: d.title,
                subtitle: d.subtitle,
                heroImage: d.heroImage,
                sections: d.sections,
                ctaText: d.ctaText,
                ctaUrl: d.ctaUrl,
              }),
            ],
            { type: "application/json" }
          )
        );
      } catch {
        /* noop */
      }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  function schedule() {
    const d = latestRef.current;
    if (!d) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    onDirty(true);
    timerRef.current = window.setTimeout(async () => {
      try {
        await fetch(`${API_BASE}/lp/${d.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: d.title,
            subtitle: d.subtitle,
            heroImage: d.heroImage,
            sections: d.sections,
            ctaText: d.ctaText,
            ctaUrl: d.ctaUrl,
          }),
        });
      } finally {
        onDirty(false);
      }
    }, 700);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return schedule;
}

/* =========================== Component ========================= */
export default function LPEditorPanel({ lpId }: { lpId?: string }) {
  const [doc, setDoc] = useState<LPDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [fmtUpdatedAt, setFmtUpdatedAt] = useState<string>("");

  const scheduleSave = useDebounceSave(doc, setDirty);

  // 初期ロード（lpId なければ新規作成）
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let id = lpId;
        if (!id) {
          const created = await fetch(`${API_BASE}/lp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }).then((r) => r.json());
          const normalized = normalizeDoc(created);
          id = normalized.id;
          setDoc(normalized);
        }
        if (id && !doc) {
          const fetched = await fetch(`${API_BASE}/lp/${id}`).then((r) => r.json());
          setDoc(normalizeDoc(fetched));
        }
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // updatedAt をクライアントで整形（Hydration差異回避）
  useEffect(() => {
    setFmtUpdatedAt(doc?.updatedAt ? new Date(doc.updatedAt).toLocaleString() : "");
  }, [doc?.updatedAt]);

  // 他パネルへ現在の LP をブロードキャスト
  useEffect(() => {
    if (!doc) return;
    (window as any).__lpDoc = doc;
    try {
      localStorage.setItem("currentLpId", doc.id);
    } catch {}
    window.dispatchEvent(new CustomEvent("lp:docReady", { detail: { id: doc.id } }));
    window.dispatchEvent(new CustomEvent("lp:docUpdated", { detail: { id: doc.id } }));
  }, [doc]);

  // 外部からの JSON Patch の適用
  useEffect(() => {
    const onApply = (ev: Event) => {
      const detail = (ev as CustomEvent).detail;
      if (!detail) return;
      setDoc((prev) => (prev ? applyJsonPatch(prev, detail) : prev));
      setTimeout(scheduleSave, 0);
    };
    window.addEventListener(PATCH_EVENT, onApply as EventListener);
    return () => window.removeEventListener(PATCH_EVENT, onApply as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleSave]);

  // 共通更新（差分があれば保存予約）
  function updateDoc(mutator: (d: LPDoc) => LPDoc) {
    setDoc((prev) => {
      if (!prev) return prev;
      const before = JSON.stringify(prev);
      const next = normalizeDoc(mutator(prev));
      if (JSON.stringify(next) !== before) {
        scheduleSave();
      }
      return next;
    });
  }

  // セクション追加/削除
  function addSection() {
    if (!doc) return;
    updateDoc((d) => ({
      ...d,
      sections: [...d.sections, { heading: "", body: "" }],
      updatedAt: new Date().toISOString(),
    }));
  }
  function removeSection(i: number) {
    if (!doc) return;
    updateDoc((d) => {
      const sections = d.sections.slice();
      sections.splice(i, 1);
      return { ...d, sections, updatedAt: new Date().toISOString() };
    });
  }

  if (loading || !doc) {
    return <div className="p-4 text-sm text-neutral-500">読み込み中…</div>;
  }

  return (
    <div className="h-full flex flex-col gap-3 p-4 border-l">
      {/* ヘッダー（保存状態） */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-600">
          {dirty ? "保存中…" : `最終更新: ${fmtUpdatedAt || "—"}`}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addSection}
            className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50"
            title="セクションを追加"
          >
            セクション追加
          </button>
        </div>
      </div>

      {/* エディタ本体 */}
      <div className="space-y-3 overflow-auto">
        <label className="block">
          <div className="text-xs text-neutral-500 mb-1">タイトル</div>
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={doc.title}
            onChange={(e) =>
              updateDoc((d) => ({ ...d, title: e.target.value, updatedAt: new Date().toISOString() }))
            }
          />
        </label>

        <label className="block">
          <div className="text-xs text-neutral-500 mb-1">サブタイトル</div>
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={doc.subtitle}
            onChange={(e) =>
              updateDoc((d) => ({ ...d, subtitle: e.target.value, updatedAt: new Date().toISOString() }))
            }
          />
        </label>

        <label className="block">
          <div className="text-xs text-neutral-500 mb-1">ファーストビュー画像URL</div>
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={doc.heroImage}
            onChange={(e) =>
              updateDoc((d) => ({ ...d, heroImage: e.target.value, updatedAt: new Date().toISOString() }))
            }
          />
        </label>

        <div>
          <div className="text-xs text-neutral-500 mb-1">セクション</div>
          {doc.sections.map((s, i) => (
            <div key={i} className="mb-2 rounded-md border p-2">
              <div className="flex items-center justify-between gap-2">
                <input
                  className="mb-1 w-full rounded-md border px-2 py-1 text-sm"
                  placeholder="見出し"
                  value={s.heading}
                  onChange={(e) =>
                    updateDoc((d) => {
                      const sections = d.sections.slice();
                      sections[i] = { ...sections[i], heading: e.target.value };
                      return { ...d, sections, updatedAt: new Date().toISOString() };
                    })
                  }
                />
                <button
                  className="shrink-0 rounded-md border px-2 py-1 text-xs hover:bg-neutral-50"
                  onClick={() => removeSection(i)}
                  title="このセクションを削除"
                >
                  削除
                </button>
              </div>
              <textarea
                className="w-full rounded-md border px-2 py-1 text-sm"
                rows={3}
                placeholder="本文"
                value={s.body}
                onChange={(e) =>
                  updateDoc((d) => {
                    const sections = d.sections.slice();
                    sections[i] = { ...sections[i], body: e.target.value };
                    return { ...d, sections, updatedAt: new Date().toISOString() };
                  })
                }
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <div className="text-xs text-neutral-500 mb-1">CTAテキスト</div>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={doc.ctaText}
              onChange={(e) =>
                updateDoc((d) => ({ ...d, ctaText: e.target.value, updatedAt: new Date().toISOString() }))
              }
            />
          </label>
          <label className="block">
            <div className="text-xs text-neutral-500 mb-1">CTAリンク</div>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={doc.ctaUrl}
              onChange={(e) =>
                updateDoc((d) => ({ ...d, ctaUrl: e.target.value, updatedAt: new Date().toISOString() }))
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}