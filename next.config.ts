import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// 1. Initialisation du plugin PWA avec ses options
const withPWA = withPWAInit({
  dest: "public", // Où le Service Worker sera généré
  disable: process.env.NODE_ENV === "development", // Désactivé en développement
  register: true,
  // skipWaiting est déplacé dans les options de workbox pour corriger l'erreur TypeScript
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true, // Fortement recommandé avec skipWaiting
  },
});

// 2. Vos options de configuration Next.js classiques
const nextConfig: NextConfig = {
  /* config options here (ex: reactStrictMode: true, etc.) */
};

// 3. Application du wrapper PWA sur la configuration Next.js
export default withPWA(nextConfig);
