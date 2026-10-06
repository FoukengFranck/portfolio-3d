export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fkbf-portfolio.vercel.app",
  name: "FKBF",
  fullName: "Foukeng Kemayou Bavel Franck",

  alternateNames: [
    "FKBF",
    "Foukeng Kemayou",
    "Foukeng Franck",
    "Franck Foukeng",
    "Bavel Foukeng",
    "Founkeng Bavel",
    "Bavel Founkeng",
    "Founkeng Kemayou Bavel Franck",
  ],
  jobTitle: "Développeur Web Fullstack",
  title: "FKBF — Foukeng Kemayou Bavel Franck | Développeur Web Fullstack",
  description:
    "Portfolio de Foukeng Kemayou Bavel Franck (FKBF), développeur web fullstack à Douala, Cameroun. Projets Laravel, React et Next.js, CV et contact.",
  locale: "fr_FR",
  city: "Douala",
  country: "CM",
  github: "https://github.com/FoukengFranck",
  linkedin: "https://www.linkedin.com/in/bavel-founkeng/",
  themeColor: "#08091a",
  updatedAt: "2026-10-06",
} as const;
