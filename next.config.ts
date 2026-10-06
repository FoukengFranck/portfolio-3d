import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";


const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // désactivé en développement
  register: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
  },
});

// Pas de clé "turbopack" ici : on build avec webpack.
const nextConfig: NextConfig = {};

export default withPWA(nextConfig);
