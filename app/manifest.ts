import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Manifest de la PWA : c'est ici que l'icône d'installation est déclarée.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${SITE.name} Portfolio — ${SITE.fullName}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "fr",
    background_color: SITE.themeColor,
    theme_color: SITE.themeColor,
    icons: [
      {
        src: "/images/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
