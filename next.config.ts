// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 外部IPでの開発アクセスを許可
    allowedDevOrigins: [
      "http://163.44.99.81:3000",
      "http://0.0.0.0:3000",
      "http://localhost:3000",
    ],
  },
};

export default nextConfig;