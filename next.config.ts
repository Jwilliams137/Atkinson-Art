import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Keeping your domain intact
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
