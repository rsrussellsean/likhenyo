import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aiurxjluzmgqfoeuzaov.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Google OAuth avatars
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        // Facebook OAuth avatars
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
    ],
  },
};

export default nextConfig;
