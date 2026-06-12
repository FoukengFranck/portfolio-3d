// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FKBF | Foukeng Kemayou — Développeur Web Fullstack",
    short_name: "FKBF",
    description: "Developer web & UI/UX Designer",
    start_url: "/",
    display: "standalone",
    background_color: "#08091a",
    theme_color: "#08091a",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable", 
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      // icône "any" séparée pour Android/iOS qui en ont besoin
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
