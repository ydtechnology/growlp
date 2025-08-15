// components/rightpanel/RightPanel.tsx
"use client";

import React from "react";
import LPEditorPanel from "@/components/lp/LPEditorPanel"; // パスは実ファイル構成に合わせて

type Props = {
  className?: string;
};

export default function RightPanel({ className }: Props) {
  return (
    <div className={className ?? "right-panel h-full w-full"}>
      <LPEditorPanel />
    </div>
  );
}