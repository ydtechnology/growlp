// components/preview/DevicePreview.tsx
"use client";

import * as React from "react";

export default function DevicePreview({
  src,
  deviceWidth,
  deviceHeight,
}: {
  src: string;
  deviceWidth: number;
  deviceHeight: number;
}) {
  const outerRef = React.useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    if (!outerRef.current) return;

    const ro = new ResizeObserver(() => {
      const el = outerRef.current!;
      const availH = el.clientHeight; // ※高さだけ見る（横は触らない）
      const sy = availH / deviceHeight;

      // 縦が入らないときだけ縮小。入るなら等倍のまま。
      const next = Math.min(sy, 1);
      setScale(Number.isFinite(next) ? next : 1);
    });

    ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [deviceHeight]);

  return (
    <div
      ref={outerRef}
      className="relative h-[calc(92vh-60px)] w-full overflow-hidden"
    >
      <div
        className="mx-auto"
        style={{
          width: deviceWidth,         // 横はそのまま
          height: deviceHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top center", // 上基準で縮小
        }}
      >
        <div className="rounded-lg border bg-white shadow">
          <iframe
            src={src}
            width={deviceWidth}
            height={deviceHeight}
            className="block rounded-lg"
            style={{ border: 0 }}
          />
        </div>
      </div>
    </div>
  );
}