import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // URLs de imagens são fornecidas pelos usuários (presentes, capas).
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
