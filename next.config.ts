import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'lh3.googleusercontent.com',
      },
      {
        hostname: 'media.istockphoto.com',
      },
      {
        hostname: 'images.unsplash.com',
      }
    ],
  },
};

export default nextConfig;
