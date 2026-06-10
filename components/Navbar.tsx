"use client";

// ╔══════════════════════════════════════════════════════════════╗
//  Navbar.tsx — Sidebar desktop (≥ md) + Toolbar mobile (< md)
//  Design & animations Framer Motion : 100% inchangés
//  Fix : scrollIntoView() remplace <Link href="#id"> → plus de #home#home
// ╚══════════════════════════════════════════════════════════════╝

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  Code2,
  FolderOpen,
  PenLine,
  Mail,
  ChevronRight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
//  1. DONNÉES
//     href supprimé : la navigation se fait via scrollIntoView()
//     et non plus via des ancres URL (#id) — fix du bug #home#home
// ─────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: "home", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "skills", label: "Skills", Icon: Code2 },
  { id: "portfolio", label: "Portfolio", Icon: FolderOpen },
  { id: "blog", label: "Blog", Icon: PenLine },
  { id: "contact", label: "Contact", Icon: Mail },
] as const;

type SectionId = (typeof NAV_LINKS)[number]["id"];

// ─────────────────────────────────────────────────────────────────
//  2. VARIANTES FRAMER MOTION — strictement identiques à l'original
// ─────────────────────────────────────────────────────────────────

const navVariants = {
  collapsed: { width: 64 },
  expanded: { width: 200 },
};

const labelVariants = {
  hidden: { opacity: 0, x: -8, width: 0 },
  visible: { opacity: 1, x: 0, width: "auto" },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

// ─────────────────────────────────────────────────────────────────
//  3. FIX #home#home — explication
//
//  Problème :  <Link href="#home"> met à jour window.location.
//              Si l'URL est déjà  /#home  →  elle devient  /#home#home.
//
//  Solution :  scrollIntoView() fait défiler la page vers l'élément
//              cible SANS jamais modifier l'URL.
//              Zéro ancre dupliquée, même comportement visuel.
// ─────────────────────────────────────────────────────────────────
function useScrollTo() {
  return useCallback((id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
}

// ─────────────────────────────────────────────────────────────────
//  4. COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [active, setActive] = useState<SectionId>("home");
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();

  // ── 4a. Détection de la section visible — inchangé ────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const topVisible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (topVisible) setActive(topVisible.target.id as SectionId);
      },
      { threshold: [0.3, 0.6], rootMargin: "-10% 0px -10% 0px" },
    );
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // ── 4b. Fermer sidebar desktop si clic en dehors — inchangé ───
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── 4c. Handler commun desktop + mobile ───────────────────────
  const handleNav = (id: SectionId) => {
    setActive(id);
    setExpanded(false);
    scrollTo(id);
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          DESKTOP SIDEBAR — visible uniquement sur ≥ md (768px)
          "hidden md:flex" remplace l'ancien display inline.
          Tous les styles, variantes et animations sont identiques.
      ══════════════════════════════════════════════════════════ */}
      <motion.nav
        ref={navRef}
        className="
          hidden md:flex
          fixed left-4 top-1/2 -translate-y-1/2 z-50
          flex-col items-start
          bg-[#0c0e24]/90 backdrop-blur-md
          border border-white/[0.06]
          rounded-2xl py-5 px-3
          overflow-hidden
        "
        variants={navVariants}
        animate={expanded ? "expanded" : "collapsed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
      >
        {/* Logo — inchangé */}
        <motion.div
          className="
            w-9 h-9 rounded-xl mb-4 flex-shrink-0
            bg-cyan-400/10 border border-cyan-400/20
            flex items-center justify-center self-center
          "
          animate={{ rotate: expanded ? 360 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <span className="text-cyan-400 font-bold text-[10px]">FKBF</span>
        </motion.div>

        <div className="w-full h-px bg-white/[0.05] mb-3" />

        {/* Liens desktop — inchangés sauf <Link> → <button> */}
        <motion.ul
          className="flex flex-col gap-1 w-full"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {NAV_LINKS.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <motion.li key={id} variants={itemVariants}>
                {/*
                  <Link href="#id"> → <button onClick={handleNav}>
                  Seul changement fonctionnel : plus d'ancre dans l'URL.
                  Le rendu et les animations sont strictement identiques.
                */}
                <button
                  type="button"
                  onClick={() => handleNav(id)}
                  className="block w-full text-left"
                >
                  <motion.div
                    className={`
                      relative flex items-center gap-3
                      rounded-xl px-2 py-2.5 w-full cursor-pointer select-none
                      ${isActive ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"}
                    `}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* Fond SharedLayout — inchangé */}
                    {isActive && (
                      <motion.div
                        layoutId="activeBackground"
                        className="absolute inset-0 rounded-xl bg-cyan-400/10 border border-cyan-400/15"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />
                    )}

                    {/* Pill latérale — inchangée */}
                    {isActive && (
                      <motion.span
                        layoutId="activePill"
                        className="absolute -left-3 w-[3px] h-5 bg-cyan-400 rounded-r-full"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />
                    )}

                    {/* Icône — inchangée */}
                    <span className="relative flex-shrink-0 z-10">
                      <Icon size={19} strokeWidth={isActive ? 2 : 1.5} />
                    </span>

                    {/* Label animé — inchangé */}
                    <AnimatePresence>
                      {expanded && (
                        <motion.span
                          className="relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden"
                          variants={labelVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ duration: 0.18, ease: "easeOut" }}
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Flèche — inchangée */}
                    <AnimatePresence>
                      {expanded && isActive && (
                        <motion.span
                          className="relative z-10 ml-auto text-cyan-400/60"
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <ChevronRight size={13} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Indicateur de section — inchangé */}
        <div className="w-full h-px bg-white/[0.05] mt-3 mb-3" />
        <AnimatePresence mode="wait">
          {expanded && (
            <motion.div
              key={active}
              className="px-2 w-full overflow-hidden"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-[10px] text-slate-600 uppercase tracking-widest">
                Section
              </p>
              <p className="text-xs text-cyan-400/70 font-medium mt-0.5 capitalize">
                {active}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════════
          MOBILE TOOLBAR — visible uniquement sur < md (768px)

          • Position : fixed bottom-0, pleine largeur
          • Fond     : bg-[#0c0e24]/90 + backdrop-blur-md
                       (même glassmorphism que la sidebar)
          • Bordure  : border-t border-white/[0.06]
                       (symétrique au border de la sidebar)
          • Icônes   : identiques, même taille (size=20)
          • Actif    : fond SharedLayout (layoutId mobile isolé
                       pour ne pas interférer avec la sidebar)
          • Animation: whileTap scale + layoutId spring — identiques
          • Safe area: env(safe-area-inset-bottom) pour iPhone
      ══════════════════════════════════════════════════════════ */}
      <nav
        className="
          flex md:hidden
          fixed bottom-0 left-0 right-0 z-50
          bg-[#0c0e24]/90 backdrop-blur-md
          border-t border-white/[0.06]
          px-1
        "
        style={{
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
          paddingTop: "8px",
        }}
      >
        <ul className="flex items-center justify-around w-full">
          {NAV_LINKS.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <motion.button
                  type="button"
                  onClick={() => handleNav(id)}
                  aria-label={label}
                  className={`
                    relative flex flex-col items-center gap-[3px]
                    px-3 py-1 rounded-xl min-w-[48px]
                    ${isActive ? "text-cyan-400" : "text-slate-500"}
                  `}
                  whileTap={{ scale: 0.85 }}
                  transition={{ duration: 0.12 }}
                >
                  {/*
                    Fond actif : même SharedLayout que la sidebar
                    MAIS avec un layoutId différent ("mobileBg" vs "activeBackground")
                    pour que Framer Motion ne les confonde pas entre les deux navs.
                  */}
                  {isActive && (
                    <motion.div
                      layoutId="mobileBg"
                      className="absolute inset-0 rounded-xl bg-cyan-400/10 border border-cyan-400/15"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                    />
                  )}

                  {/* Icône */}
                  <span className="relative z-10">
                    <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  </span>

                  {/* Label court */}
                  <span
                    className={`
                    relative z-10 text-[10px] font-medium leading-none tracking-wide
                    ${isActive ? "text-cyan-400" : "text-slate-600"}
                  `}
                  >
                    {label}
                  </span>

                  {/* Point actif — symétrique à la pill de la sidebar */}
                  {isActive && (
                    <motion.span
                      layoutId="mobileDot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2
                                 w-1 h-1 rounded-full bg-cyan-400"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                    />
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
