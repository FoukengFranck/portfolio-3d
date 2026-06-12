// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const syne = Syne({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "FKBF | Foukeng Kemayou — Développeur Web Fullstack",
  description: "Developer web & UI/UX Designer",
  applicationName: "FKBF Portfolio",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FKBF",
  },
};


export const viewport: Viewport = {
  themeColor: "#08091a",
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
      <head>
        {/* Icônes iOS — manifest.json ne suffit pas sur iPhone */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${syne.className} bg-[#08091a]`}>
        <Navbar />
        <main className="ml-0 md:ml-20 pb-20 md:pb-0">{children}</main>
      </body>
    </html>
  );
}
