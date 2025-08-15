// components/rightpanel/RightPanelEditor.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RightPanelEditor() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [heroUrl, setHeroUrl] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");

  const apply = () => {
    // TODO: ここで左のプレビューへ反映（patch API or context）
    console.log("[apply]", { title, subtitle, heroUrl, ctaText, ctaUrl });
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-neutral-500">
        最終更新: {new Date().toLocaleString()}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rp-title">タイトル</Label>
        <Input
          id="rp-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例）今すぐ成果に直結する○○"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rp-subtitle">サブタイトル</Label>
        <Input
          id="rp-subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="例）最短で△△を実現します"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rp-hero">ファーストビュー画像URL</Label>
        <Input
          id="rp-hero"
          value={heroUrl}
          onChange={(e) => setHeroUrl(e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="rp-cta-text">CTAテキスト</Label>
          <Input
            id="rp-cta-text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="例）無料で相談する"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rp-cta-url">CTAリンク</Label>
          <Input
            id="rp-cta-url"
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            placeholder="#contact"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button className="w-full" onClick={apply}>
          反映する
        </Button>
      </div>
    </div>
  );
}