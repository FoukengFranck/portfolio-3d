"use client"

// ╔══════════════════════════════════════════════════════════════════╗
//  Hero.tsx — Section d'accueil animée
//  Stack  : Next.js App Router + Framer Motion + Tailwind CSS
//  Installe : npm install framer-motion lucide-react
// ╚══════════════════════════════════════════════════════════════════╝

import { useEffect, useState, useRef } from "react"
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  Variants,
} from "framer-motion"
import { ArrowDown, Download, ExternalLink, Sparkles } from "lucide-react"

// ─────────────────────────────────────────────────────────────────
//  1. DONNÉES — modifie ici sans toucher au JSX
// ─────────────────────────────────────────────────────────────────
const ROLES = [
  "Developpeur Web",
  "UI/UX Designer",
];
const BADGES = ["React", "Next.js", "Laravel", "Tailwind", "Figma"]
const STATS = [
  { value: "1+", label: "Années exp." },
  { value: "10+", label: "Projets réalisés" },
//   { value: "20+", label: "Happy clients" },
];

// ─────────────────────────────────────────────────────────────────
//  2. HOOK — Typewriter (machine à écrire)
//
//  Étapes :
//  ① Phase frappe   → ajoute 1 caractère toutes les `speed` ms
//  ② Phase pause    → attend `pause` ms une fois le mot terminé
//  ③ Phase effaçage → retire 1 caractère toutes les `speed/2` ms
//  ④ On passe au mot suivant → retour à ①
// ─────────────────────────────────────────────────────────────────
function useTypewriter(words: string[], speed = 85, pause = 1800) {
  const [displayed, setDisplayed] = useState("")
  const [wordIdx,   setWordIdx]   = useState(0)
  const [charIdx,   setCharIdx]   = useState(0)
  const [deleting,  setDeleting]  = useState(false)

  useEffect(() => {
    const current = words[wordIdx]

    const id = setTimeout(() => {
      if (!deleting) {
        // ── Frappe : on ajoute un caractère ──
        setDisplayed(current.slice(0, charIdx + 1))
        setCharIdx((c) => c + 1)
        // Mot complet → on attend avant d'effacer
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause)
        }
      } else {
        // ── Effaçage : on retire un caractère ──
        setDisplayed(current.slice(0, charIdx - 1))
        setCharIdx((c) => c - 1)
        // Mot effacé → on passe au suivant
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setWordIdx((i) => (i + 1) % words.length)
        }
      }
    }, deleting ? speed / 2 : speed) // effaçage 2× plus rapide

    return () => clearTimeout(id)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return displayed
}

// ─────────────────────────────────────────────────────────────────
//  3. HOOK — Parallax souris
//
//  useMotionValue → valeur Framer Motion SANS re-render React
//  useSpring      → ajoute de l'inertie (mouvement physique naturel)
//  Résultat : l'avatar suit la souris avec du retard → effet 3D
// ─────────────────────────────────────────────────────────────────
function useMouseParallax(strength = 14) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // stiffness = rigidité du ressort, damping = amortissement
  const x = useSpring(rawX, { stiffness: 55, damping: 18 })
  const y = useSpring(rawY, { stiffness: 55, damping: 18 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Normalise la position entre -strength et +strength
      rawX.set(((e.clientX / window.innerWidth)  - 0.5) * strength * 2)
      rawY.set(((e.clientY / window.innerHeight) - 0.5) * strength * 2)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [rawX, rawY, strength])

  return { x, y }
}

// ─────────────────────────────────────────────────────────────────
//  4. VARIANTES FRAMER MOTION
//
//  Une variante = un objet { etatA: {...}, etatB: {...} }
//  On bascule entre les états via animate="etatA" ou animate="etatB"
//  Le parent propage automatiquement ses variantes à ses enfants.
// ─────────────────────────────────────────────────────────────────

// Parent : orchestre le délai entre chaque enfant (stagger)
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11, // 110ms de décalage entre chaque enfant
      delayChildren: 0.2, // attend 200ms avant de démarrer
    },
  },
};

// Enfant générique : monte depuis le bas + fondu + blur
const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 36,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const, // "easeOutExpo" — très fluide
    },
  },
}

// Avatar : zoom depuis 65% + légère rotation
const avatarVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.65, rotate: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
}

// ─────────────────────────────────────────────────────────────────
//  5. COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────
export default function Hero() {
  const role  = useTypewriter(ROLES)
  const mouse = useMouseParallax(14)

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center
                 overflow-hidden bg-[#08091a] px-6 py-20"
    >
      {/* Fond décoratif */}
      <HeroBackground mouseX={mouse.x} mouseY={mouse.y} />

      {/* ── Contenu principal ──────────────────────────────────
          motion.div avec variants + initial + animate :
          → démarre en "hidden", passe en "visible" au montage
          → staggerChildren fait apparaître les blocs en cascade
      ─────────────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 max-w-6xl w-full mx-auto
                   grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Bloc texte (colonne gauche) ──────────────────── */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          {/* Badge "disponible" avec point clignotant (Tailwind animate-ping) */}
          <motion.div
            variants={fadeUpVariants}
            className="flex items-center gap-2.5"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full
                               rounded-full bg-cyan-400 opacity-60"
              />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
            </span>
            <span
              className="text-[11px] font-medium text-cyan-400/80
                             tracking-[0.2em] uppercase"
            >
              Available for work
            </span>
          </motion.div>

          {/* Titre */}
          <motion.div variants={fadeUpVariants}>
            <h1
              className="text-5xl lg:text-[3.75rem] font-extrabold
                           text-white leading-[1.1]"
            >
              Hi, I'm{" "}
              <span className="relative inline-block">
                <span
                  className="text-transparent bg-clip-text
                                 bg-gradient-to-r from-cyan-400 to-blue-500"
                >
                  Foukeng Kemayou Bavel Franck
                </span>
                {/* Soulignement qui s'étire progressivement */}
                <motion.span
                  className="absolute -bottom-1 left-0 h-[2px] rounded-full
                             bg-gradient-to-r from-cyan-400 to-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.1, duration: 0.7, ease: "easeOut" }}
                />
              </span>
            </h1>
          </motion.div>

          {/* Typewriter */}
          <motion.div
            variants={fadeUpVariants}
            className="h-8 flex items-center"
          >
            <p className="text-xl font-medium text-slate-300">
              I'm a{" "}
              <span className="text-cyan-400">
                {role}
                {/* Curseur | clignotant via Framer Motion */}
                <motion.span
                  className="inline-block w-[2px] h-5 bg-cyan-400 ml-0.5
                             align-middle rounded-full"
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </span>
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUpVariants}
            className="text-slate-400 leading-relaxed max-w-md text-[0.95rem]"
          >
            Développeur web passionné par la création d'expériences utilisateur
            exceptionnelles et responsives. J'utilise des technologies modernes
            pour concevoir des interfaces propres, fluides et centrées sur
            l'utilisateur.
          </motion.p>

          {/* Badges technos — animation individuelle avec délai custom */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-wrap gap-2"
          >
            {BADGES.map((badge, i) => (
              <motion.span
                key={badge}
                className="px-3 py-1 text-xs font-medium rounded-full
                           bg-white/[0.05] border border-white/10 text-slate-400"
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.85 + i * 0.06, duration: 0.35 }}
                whileHover={{
                  scale: 1.1,
                  color: "#22d3ee",
                  borderColor: "rgba(34,211,238,0.4)",
                  transition: { duration: 0.15 },
                }}
              >
                {badge}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Boutons */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-wrap gap-3 pt-1"
          >
            {/* Primaire */}
            <motion.a
              href="#portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                         bg-cyan-400 text-[#08091a] font-bold text-sm"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <ExternalLink size={15} strokeWidth={2.5} />
              Voir mon travail
            </motion.a>

            {/* Secondaire */}
            <motion.a
              href="/docs/FOUKENG-KEMAYOU-BAVEL-FRANCK-DEVELOPPEUR-WEB.pdf"
              download="FOUKENG-KEMAYOU-BAVEL-FRANCK-DEVELOPPEUR-WEB.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                         border border-white/15 text-white font-semibold text-sm"
              whileHover={{
                scale: 1.04,
                y: -2,
                borderColor: "rgba(34,211,238,0.45)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Download size={15} />
              Download CV
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUpVariants} className="flex gap-10 pt-2">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 tracking-wide">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Avatar (colonne droite) ─────────────────────────
            style={{ x, y }} → applique le parallax souris :
            l'avatar se décale légèrement quand la souris bouge
            → crée une sensation de profondeur 3D
        ─────────────────────────────────────────────────────── */}
        <motion.div
          className="flex justify-center order-1 lg:order-2"
          variants={avatarVariants}
          style={{ x: mouse.x, y: mouse.y }}
        >
          <FloatingAvatar />
        </motion.div>
      </motion.div>

      {/* Flèche scroll en bas — rebond infini */}
      <motion.a
        href="#about"
        aria-label="Scroll vers la section suivante"
        className="absolute bottom-8 left-1/2 -translate-x-1/2
                   text-slate-600 hover:text-cyan-400 transition-colors"
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={22} strokeWidth={1.5} />
      </motion.a>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
//  SUB-COMPOSANT — Avatar avec halos orbitants + flottement
// ─────────────────────────────────────────────────────────────────
function FloatingAvatar() {
  return (
    <div className="relative select-none">
      {/* Halo 1 : rotation lente clockwise */}
      <motion.div
        className="absolute inset-[-20px] rounded-full border border-cyan-400/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                         w-2 h-2 rounded-full bg-cyan-400
                         shadow-[0_0_8px_#22d3ee]" />
      </motion.div>

      {/* Halo 2 : rotation lente counter-clockwise */}
      <motion.div
        className="absolute inset-[-38px] rounded-full border border-blue-500/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
                         w-1.5 h-1.5 rounded-full bg-blue-400" />
      </motion.div>

      {/* Photo avatar — flotte en haut/bas */}
      <motion.div
        className="relative w-60 h-60 lg:w-[22rem] lg:h-[22rem] rounded-full
                   overflow-hidden border-2 border-cyan-400/25
                   shadow-[0_0_60px_rgba(34,211,238,0.1)]"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
          <Image src="/images/profil.jpeg" alt="FKBF" fill className="object-cover" />
        
        <div className="w-full h-full bg-gradient-to-br
                        from-cyan-900/60 via-[#08091a] to-purple-900/40
                        flex items-center justify-center">
          <Sparkles className="text-cyan-400/40 w-20 h-20" />
        </div>
      </motion.div>

      {/* Badge "3+ ans" — pop depuis l'angle avec spring */}
      <motion.div
        className="absolute -bottom-5 -right-5 bg-[#0d1030]
                   border border-cyan-400/20 rounded-2xl px-4 py-2.5
                   text-center shadow-xl"
        initial={{ opacity: 0, scale: 0, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1.3, type: "spring", stiffness: 280, damping: 18 }}
      >
        <p className="text-cyan-400 font-extrabold text-xl leading-none">1+</p>
        <p className="text-slate-500 text-[10px] mt-1 tracking-wide">Années exp.</p>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
//  SUB-COMPOSANT — Fond décoratif (grille + orbes)
// ─────────────────────────────────────────────────────────────────
function HeroBackground({
  mouseX,
  mouseY,
}: {
  mouseX: ReturnType<typeof useSpring>
  mouseY: ReturnType<typeof useSpring>
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grille de points */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* Orbe cyan — réagit à la position de la souris */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px]
                   rounded-full bg-cyan-500/7 blur-[120px]"
        style={{ x: mouseX, y: mouseY }}
      />
      {/* Orbe bleu — fixe */}
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96
                      rounded-full bg-blue-600/5 blur-[100px]" />
      {/* Lignes diagonales décoratives */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="100" x2="100" y2="0"   stroke="#fff" strokeWidth="0.15" />
        <line x1="0" y1="70"  x2="70"  y2="0"   stroke="#fff" strokeWidth="0.1"  />
        <line x1="30" y1="100" x2="100" y2="30"  stroke="#fff" strokeWidth="0.1"  />
      </svg>
    </div>
  )
}