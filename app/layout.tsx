import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const syne = Syne({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FKBF — Portfolio",
  description: "Developer web & UI/UX Designer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${syne.className} bg-[#08091a]`}>
        <Navbar />
        <main className="ml-0 md:ml-20 pb-20 md:pb-0">{children}</main>
      </body>
    </html>
  );
}
