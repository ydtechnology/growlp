"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type LayoutType = "one" | "two-left" | "two-right" | "three" | "four";

const OPTIONS: { key: LayoutType; label: string; hint: string }[] = [
  { key: "one",       label: "A. 1カラム",             hint: "シンプルで縦に読みやすい" },
  { key: "two-left",  label: "B. 2カラム（左サイド）", hint: "メニュー固定＋本文" },
  { key: "two-right", label: "C. 2カラム（右サイド）", hint: "本文＋補助情報" },
  { key: "three",     label: "D. 3カラム",             hint: "情報量が多いページ向け" },
  { key: "four",      label: "E. 4カラム",             hint: "カード系・ギャラリー向け" },
];

type Props = {
  defaultValue?: LayoutType;
  onChange?: (value: LayoutType) => void;
  onConfirm?: (value: LayoutType) => void;
};

export default function LayoutPicker({
  defaultValue = "one",
  onChange,
  onConfirm,
}: Props) {
  const [value, setValue] = React.useState<LayoutType>(defaultValue);

  const select = (v: LayoutType) => {
    setValue(v);
    onChange?.(v);
  };

  return (
    <section className="mx-auto w-full max-w-5xl p-4">
      <h2 className="mb-2 text-xl font-semibold">まず、ランディングページの見た目を決めましょう</h2>
      <p className="mb-6 text-sm text-neutral-600">
        下の5つのパターンからお好きなレイアウトを選んでください。
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OPTIONS.map((opt) => {
          const active = value === opt.key;
          return (
            <Card
              key={opt.key}
              className={[
                "border transition",
                active ? "border-neutral-900 ring-2 ring-neutral-900" : "hover:border-neutral-400",
              ].join(" ")}
            >
              {/* 実際の操作対象は button。Enter/Space はブラウザ標準に任せる */}
              <button
                type="button"
                aria-pressed={active}
                onClick={() => select(opt.key)}
                className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded"
              >
                <div className="p-4">
                  <div className="mb-3 text-sm font-medium">{opt.label}</div>
                  <Thumbnail kind={opt.key} />
                  <p className="mt-3 text-xs text-neutral-500">{opt.hint}</p>
                </div>
              </button>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={() => select(defaultValue)}>リセット</Button>
        <Button onClick={() => onConfirm?.(value)}>このレイアウトでプレビュー</Button>
      </div>
    </section>
  );
}

/** レイアウト・サムネイル（軽量SVG代わりにTailwindのボックスで表現） */
function Thumbnail({ kind }: { kind: LayoutType }) {
  const base = "rounded border bg-white shadow-inner";
  const block = "h-3 rounded bg-neutral-200";
  return (
    <div className={`${base} p-3`}>
      {kind === "one" && (
        <div className="space-y-2">
          <div className={block}></div>
          <div className={`${block} h-20`}></div>
          <div className={block}></div>
        </div>
      )}

      {kind === "two-left" && (
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-1 space-y-2">
            <div className={block}></div>
            <div className={block}></div>
            <div className={block}></div>
          </div>
          <div className="col-span-3 space-y-2">
            <div className={block}></div>
            <div className={`${block} h-16`}></div>
            <div className={block}></div>
          </div>
        </div>
      )}

      {kind === "two-right" && (
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3 space-y-2">
            <div className={block}></div>
            <div className={`${block} h-16`}></div>
            <div className={block}></div>
          </div>
          <div className="col-span-1 space-y-2">
            <div className={block}></div>
            <div className={block}></div>
            <div className={block}></div>
          </div>
        </div>
      )}

      {kind === "three" && (
        <div className="space-y-2">
          <div className={block}></div>
          <div className="grid grid-cols-3 gap-2">
            <div className={`${block} h-16`}></div>
            <div className={`${block} h-16`}></div>
            <div className={`${block} h-16`}></div>
          </div>
          <div className={block}></div>
        </div>
      )}

      {kind === "four" && (
        <div className="space-y-2">
          <div className={block}></div>
          <div className="grid grid-cols-4 gap-2">
            <div className={`${block} h-14`}></div>
            <div className={`${block} h-14`}></div>
            <div className={`${block} h-14`}></div>
            <div className={`${block} h-14`}></div>
          </div>
          <div className={block}></div>
        </div>
      )}
    </div>
  );
}