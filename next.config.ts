import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only allows quality=75 unless listed here; the login background photo asks for 90.
    qualities: [75, 90],
  },
};

export default nextConfig;
