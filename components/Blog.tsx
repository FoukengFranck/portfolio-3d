"use client";

// ╔══════════════════════════════════════════════════════════════════╗
//  Blog.tsx — Journal de bord et Partage d'Expériences
//  Stack  : Next.js App Router + Framer Motion + Tailwind CSS
// ╚══════════════════════════════════════════════════════════════════╝

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Clock, BookOpen, Rss } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
//  1. DONNÉES ADAPTÉES À TON STACK & PARCOURS
// ─────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Next.js", "Laravel", "Design", "Expérience"];

const POSTS = [
  {
    id: 1,
    title: "Comment j'ai pensé l'architecture de FKBF KamerLink",
    excerpt:
      "Retour d'expérience complet sur la conception de ma plateforme d'insertion professionnelle : modélisation de la base de données, gestion des rôles et déploiement.",
    category: "Laravel",
    date: "Mai 2026",
    readTime: "8 min",
    featured: true, // Mis en avant
    accentColor: "#22d3ee",
    gradient: "from-cyan-500/20 to-blue-600/15",
    tags: ["Laravel", "MySQL", "SaaS", "Cameroon"],
  },
  {
    id: 2,
    title: "Mon immersion en stage chez Innov Cameroon",
    excerpt:
      "Ce que ces 2 mois de stage académique m'ont appris sur le travail en équipe, la gestion des exigences clients et l'utilisation de Git/GitHub en production.",
    category: "Expérience",
    date: "Sept 2025",
    readTime: "6 min",
    featured: false,
    accentColor: "#818cf8",
    gradient: "from-slate-500/15 to-blue-700/15",
    tags: ["Stage", "Méthodologie", "Professionnel"],
  },
  {
    id: 3,
    title: "Pourquoi je passe mes projets de Laravel à Next.js",
    excerpt:
      "Analyse comparative basée sur mes récents développements (notamment le projet FKBFly). Performances, Server Components et expérience utilisateur.",
    category: "Next.js",
    date: "Avril 2026",
    readTime: "5 min",
    featured: false,
    accentColor: "#f472b6",
    gradient: "from-pink-500/15 to-purple-600/15",
    tags: ["Next.js", "PHP", "Architecture"],
  },
  {
    id: 4,
    title: "Allier Code Propre et Design Premium avec Photoshop & Tailwind",
    excerpt:
      "Mes secrets de workflow pour concevoir des interfaces graphiques haut de gamme et les intégrer fidèlement au pixel près sans alourdir le code.",
    category: "Design",
    date: "Fév 2026",
    readTime: "4 min",
    featured: false,
    accentColor: "#34d399",
    gradient: "from-emerald-500/15 to-cyan-600/15",
    tags: ["UI/UX", "Photoshop", "Tailwind"],
  },
  {
    id: 5,
    title: "Algorithmie : La logique derrière le Dashboard de FCRV Bank",
    excerpt:
      "Comment j'ai structuré la manipulation dynamique du DOM et la sécurisation des flux financiers fictifs de mon application bancaire en JavaScript.",
    category: "Design", // Rattaché au design/interface ou réutilisable
    date: "Nov 2025",
    readTime: "5 min",
    featured: false,
    accentColor: "#fb923c",
    gradient: "from-orange-500/15 to-pink-600/15",
    tags: ["JavaScript", "Algorithmes", "Fintech"],
  },
];

// ─────────────────────────────────────────────────────────────────
//  2. VARIANTES
// ─────────────────────────────────────────────────────────────────
const titleVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

// ─────────────────────────────────────────────────────────────────
//  3. SUB-COMPOSANT — Carte featured
// ─────────────────────────────────────────────────────────────────
function FeaturedPost({ post }: { post: (typeof POSTS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <motion.article
      ref={ref}
      className="group relative col-span-full rounded-3xl overflow-hidden cursor-pointer
                 bg-white/[0.03] border border-white/[0.06]
                 hover:border-white/[0.14] transition-colors duration-300"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-60
                       group-hover:opacity-90 transition-opacity duration-500`}
      />

      <div className="relative z-10 p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full"
              style={{
                background: `${post.accentColor}20`,
                color: post.accentColor,
              }}
            >
              À la une
            </span>
            <span
              className="px-3 py-1 text-[10px] font-medium text-slate-500 uppercase
                             tracking-widest rounded-full bg-white/[0.05]"
            >
              {post.category}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            {post.title}
          </h3>
          <p className="text-slate-400 leading-relaxed">{post.excerpt}</p>

          <div className="flex items-center gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock size={11} /> {post.readTime} de lecture
            </span>
            <span>{post.date}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-white/[0.05]
                           border border-white/[0.06] text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          <motion.div
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: post.accentColor }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            Lire l'article <ArrowUpRight size={16} />
          </motion.div>
        </div>

        {/* Illustration */}
        <div className="hidden md:flex items-center justify-center">
          <motion.div
            className="w-52 h-52 rounded-3xl border border-white/[0.08]
                       bg-white/[0.03] flex items-center justify-center"
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpen
              size={64}
              style={{ color: post.accentColor, opacity: 0.2 }}
            />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────────
//  4. SUB-COMPOSANT — Carte article standard
// ─────────────────────────────────────────────────────────────────
function BlogCard({ post }: { post: (typeof POSTS)[number] }) {
  return (
    <motion.article
      layout
      variants={cardVariants}
      className="group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col
                 bg-white/[0.03] border border-white/[0.06]
                 hover:border-white/[0.12] transition-colors duration-300"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                   transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${post.accentColor}0e, transparent 70%)`,
        }}
      />

      {/* Ligne colorée */}
      <div
        className="h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${post.accentColor}60, transparent)`,
        }}
      />

      <div className="relative z-10 p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between">
          <span
            className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-lg"
            style={{
              background: `${post.accentColor}15`,
              color: post.accentColor,
            }}
          >
            {post.category}
          </span>
          <span className="text-[11px] text-slate-600">{post.date}</span>
        </div>

        <h3
          className="text-base font-bold text-white leading-snug
                       group-hover:text-cyan-300 transition-colors duration-300"
        >
          {post.title}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        <div
          className="flex items-center justify-between pt-2 mt-auto
                        border-t border-white/[0.05]"
        >
          <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Clock size={11} /> {post.readTime}
          </span>
          <motion.span
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: post.accentColor }}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            Lire <ArrowUpRight size={13} />
          </motion.span>
        </div>
      </div>
    </motion.article>
  );
}



// ─────────────────────────────────────────────────────────────────
//  5. COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────
export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true });

  const featured = POSTS.find((p) => p.featured)!;
  const filtered = POSTS.filter(
    (p) =>
      !p.featured &&
      (activeCategory === "All" || p.category === activeCategory),
  );

  return (
    <section
      id="blog"
      className="relative min-h-screen bg-[#08091a] py-28 px-6 overflow-hidden"
    >
      <div
        className="absolute top-1/4 left-0 w-96 h-96 rounded-full
                      bg-cyan-500/[0.04] blur-[120px] pointer-events-none"
      />
      <div
        className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full
                      bg-purple-500/[0.04] blur-[120px] pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Titre francisé et personnalisé */}
        <motion.div
          ref={titleRef}
          className="text-center mb-14"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Rss size={14} className="text-cyan-400" />
            <p className="text-[11px] text-cyan-400/70 uppercase tracking-[0.22em]">
              Journal de Bord
            </p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white">
            Mon Spécimen{" "}
            <span
              className="text-transparent bg-clip-text
                             bg-gradient-to-r from-cyan-400 to-blue-500"
            >
              DevLog
            </span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Partage de mes retours d’expérience, coulisses de mes projets SaaS
            et apprentissages en Génie Logiciel.
          </p>
        </motion.div>

        {/* Filtre */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-colors
                          ${
                            activeCategory === cat
                              ? "text-[#08091a]"
                              : "text-slate-500 hover:text-slate-300 bg-white/[0.04] border border-white/[0.06]"
                          }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {activeCategory === cat && (
                <motion.span
                  layoutId="blogFilter"
                  className="absolute inset-0 rounded-xl bg-cyan-400"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10">
                {cat === "All" ? "Tous" : cat}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Featured */}
        {activeCategory === "All" && (
          <div className="mb-5">
            <FeaturedPost post={featured} />
          </div>
        )}

        {/* Grille avec AnimatePresence */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.a
            href="https://github.com/FoukengFranck"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                       border border-white/15 text-white font-semibold text-sm"
            whileHover={{
              scale: 1.04,
              y: -2,
              borderColor: "rgba(34,211,238,0.45)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <BookOpen size={15} />
            Suivre mon activité sur GitHub
            <ArrowUpRight size={15} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
