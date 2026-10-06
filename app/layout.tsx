// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";

const syne = Syne({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: `${SITE.name} Portfolio`,
  authors: [{ name: SITE.fullName, url: SITE.url }],
  creator: SITE.fullName,
  publisher: SITE.fullName,
  category: "technology",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: SITE.locale,
    // l'image vient automatiquement de app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  // Ton logo : onglet du navigateur, résultats Google, écran d'accueil iOS
  icons: {
    icon: [
      {
        url: "/images/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/images/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: ["/images/icons/icon-192x192.png"],
    apple: [
      {
        url: "/images/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE.name,
  },
  // Vérification Google Search Console (balise HTML)
  verification: {
    google: "1G6fB7NrtApYp7VLZqcgc0ImvVi2C9a8g5xm8vAN7Dc",
  },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover", // iPhones avec encoche
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${syne.className} bg-[#08091a]`}>
        <JsonLd />
        <Navbar />
        <main className="ml-0 md:ml-20 pb-20 md:pb-0">{children}</main>
      </body>
    </html>
  );
}
