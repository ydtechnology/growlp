// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  // どこをクラス探索するか（増やしたらここに追記）
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
  ],

  // v4 でも theme 拡張は使えます
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        lg: "2rem",
      },
      // Canva っぽく 1400px で止める
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // globals.css の CSS変数と連動
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // ちょい落ち着いたブランド色（必要なら調整）
        brand: {
          DEFAULT: "#6C5CE7",
          foreground: "#ffffff",
          50: "#f2f1ff",
          100: "#e7e4ff",
          200: "#cbc4ff",
          300: "#ad9eff",
          400: "#8e78ff",
          500: "#6C5CE7",
          600: "#5a4dcc",
          700: "#4a3fb0",
          800: "#3a3194",
          900: "#2b2478",
        },
      },
      fontFamily: {
        // next/font でセットしている CSS 変数と揃える
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular"],
      },
      // Canva みたいな柔らかい影
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,.06), 0 10px 20px rgba(0,0,0,.06)",
        floating: "0 8px 24px rgba(0,0,0,.12)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.2rem",
      },
      // 滑らかなトランジションをデフォ寄りに
      transitionTimingFunction: {
        smooth: "cubic-bezier(.22,.61,.36,1)",
      },
    },
  },

  // v4 は JS プラグイン不要でもOK。shadcn のアニメ使うなら
  // globals.css に `@plugin "tailwindcss-animate";` を追加してね。
  plugins: [],
} satisfies Config;