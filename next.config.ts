import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16: новая модель кэширования (заменяет experimental.ppr)
  // Включено false, чтобы динамические данные Prisma могли нормально отрендериться.
  cacheComponents: false,

  // React Compiler — автоматическая мемоизация
  reactCompiler: true,

  // Оптимизация изображений: разрешаем домены Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    // Next.js 16: новые дефолты (4h TTL, quality: [75])
    minimumCacheTTL: 14400,
    formats: ["image/avif", "image/webp"],
  },

  // Заголовки безопасности
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Редиректы
  async redirects() {
    return [
      {
        source: "/ogloszenia",
        destination: "/ads",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
