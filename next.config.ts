import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  trailingSlash: true,
  allowedDevOrigins: ['192.168.0.6'],
};

export default nextConfig;
