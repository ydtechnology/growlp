// app/(public)/sample-lp/page.tsx
export default function SampleLp() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">GrowLp</h1>
      <p className="text-sm text-neutral-500 mb-8">サンプルLP</p>

      <section className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-2 font-semibold">ヒーローセクション</h2>
        <p className="text-neutral-600">ここにキャッチコピーが入ります。</p>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">機能/特徴</h2>
        <ul className="list-disc space-y-1 pl-6 text-neutral-700">
          <li>ポイント1</li>
          <li>ポイント2</li>
          <li>ポイント3</li>
        </ul>
      </section>
    </main>
  );
}