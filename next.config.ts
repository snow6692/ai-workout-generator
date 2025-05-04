import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "randomuser.me",
      },
    ],
  },
};

export default nextConfig;
