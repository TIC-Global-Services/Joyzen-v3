import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    domains: ["ik.imagekit.io"],
    unoptimized: true,
  },
  trailingSlash: true,
  allowedDevOrigins: ['192.168.0.3'],
};

export default nextConfig;
