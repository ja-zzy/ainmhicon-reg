import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/reg',
        destination: '/reg/select-day',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
