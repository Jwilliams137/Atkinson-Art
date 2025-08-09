import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 768, 1000, 1200],
    imageSizes: [60, 120, 320, 600],
  },
  async redirects() {
    return [
      { source: "/index.php", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
