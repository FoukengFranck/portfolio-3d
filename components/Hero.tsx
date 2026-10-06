"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  motion,
  useMotionValue,
  useSpring,
  Variants,
  MotionValue,
} from "framer-motion"
import { ArrowDown, Download, ExternalLink } from "lucide-react"

const ROLES = ["Développeur Web", "UI/UX Designer"]
const BADGES = ["React", "Next.js", "Laravel", "Tailwind", "Figma"]
const START_YEAR = 2024;
const yearsOfExperience = Math.max(1, new Date().getFullYear() - START_YEAR);

const STATS = [
  { value: `${yearsOfExperience}+`, label: "Années exp." },
  { value: "10+", label: "Projets réalisés" },
];


function useTypewriter(words: string[], speed = 85, pause = 1800) {
  const [text, setText] = useState("")
  const [wordIdx, setWordIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    let delay = deleting ? speed / 2 : speed
    if (!deleting && text === current) delay = pause

    const id = setTimeout(() => {
      if (!deleting) {
        if (text === current) {
          setDeleting(true)
          return
        }
        setText(current.slice(0, text.length + 1))
      } else {
        if (text === "") {
          setDeleting(false)
          setWordIdx((i) => (i + 1) % words.length)
          return
        }
        setText(current.slice(0, text.length - 1))
      }
    }, delay)

    return () => clearTimeout(id)
  }, [text, deleting, wordIdx, words, speed, pause])

  return text
}

// Composant séparé : seul ce petit bout se re-rend à chaque lettre,
// et non plus toute la section Hero.
function Typewriter({ words }: { words: string[] }) {
  const text = useTypewriter(words)
  return (
    <span className="text-cyan-400">
      {text}
      <motion.span
        className="inline-block w-[2px] h-5 bg-cyan-400 ml-0.5
                   align-middle rounded-full"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      />
    </span>
  )
}

/* ── Parallaxe souris ───────────────────────────────────────── */
function useMouseParallax(strength = 14) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const x = useSpring(rawX, { stiffness: 55, damping: 18 })
  const y = useSpring(rawY, { stiffness: 55, damping: 18 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * strength * 2)
      rawY.set((e.clientY / window.innerHeight - 0.5) * strength * 2)
    }
    // Pas d'effet de souris sur écran tactile
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", onMove, { passive: true })
    }
    return () => window.removeEventListener("mousemove", onMove)
  }, [rawX, rawY, strength])

  return { x, y }
}

/* ── Variantes d'animation (opacity + transform uniquement) ─── */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const avatarVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/* ── Composant principal ────────────────────────────────────── */
export default function Hero() {
  const mouse = useMouseParallax(14)

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center
                 overflow-hidden bg-[#08091a] px-6 py-20"
    >
      <HeroBackground mouseX={mouse.x} mouseY={mouse.y} />

      <motion.div
        className="relative z-10 max-w-6xl w-full mx-auto
                   grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Bloc texte (colonne gauche) ── */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
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

          <motion.div variants={fadeUpVariants}>
            <h1
              className="text-5xl lg:text-[3.75rem] font-extrabold
                         text-white leading-[1.1]"
            >
              Hi, I&apos;m{" "}
              <span className="relative inline-block">
                <span
                  className="text-transparent bg-clip-text
                             bg-gradient-to-r from-cyan-400 to-blue-500"
                >
                  Foukeng Kemayou Bavel Franck
                </span>
                {/* scaleX (composited) à la place de width */}
                <motion.span
                  className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full
                             bg-gradient-to-r from-cyan-400 to-blue-500"
                  style={{ originX: 0 }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
                />
              </span>
            </h1>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="h-8 flex items-center">
            <p className="text-xl font-medium text-slate-300">
              I&apos;m a <Typewriter words={ROLES} />
            </p>
          </motion.div>

          <motion.p
            variants={fadeUpVariants}
            className="text-slate-400 leading-relaxed max-w-md text-[0.95rem]"
          >
            Développeur web passionné par la création d&apos;expériences
            utilisateur exceptionnelles et responsives. J&apos;utilise des
            technologies modernes pour concevoir des interfaces propres,
            fluides et centrées sur l&apos;utilisateur.
          </motion.p>

          <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-2">
            {BADGES.map((badge, i) => (
              <motion.span
                key={badge}
                className="px-3 py-1 text-xs font-medium rounded-full
                           bg-white/[0.05] border border-white/10 text-slate-400"
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
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

          <motion.div
            variants={fadeUpVariants}
            className="flex flex-wrap gap-3 pt-1"
          >
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

        {/* ── Avatar (colonne droite) ── */}
        <motion.div
          className="flex justify-center order-1 lg:order-2"
          variants={avatarVariants}
          style={{ x: mouse.x, y: mouse.y }}
        >
          <FloatingAvatar />
        </motion.div>
      </motion.div>

      {/* Flèche scroll */}
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
  )
}

/* ── Avatar flottant ────────────────────────────────────────── */
function FloatingAvatar() {
  return (
    <div className="relative select-none">
      <motion.div
        className="absolute inset-[-20px] rounded-full border border-cyan-400/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-2 h-2 rounded-full bg-cyan-400
                     shadow-[0_0_8px_#22d3ee]"
        />
      </motion.div>

      <motion.div
        className="absolute inset-[-38px] rounded-full border border-blue-500/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
                     w-1.5 h-1.5 rounded-full bg-blue-400"
        />
      </motion.div>

      <motion.div
        className="relative w-60 h-60 lg:w-[22rem] lg:h-[22rem] rounded-full
                   overflow-hidden border-2 border-cyan-400/25
                   shadow-[0_0_60px_rgba(34,211,238,0.1)]"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* sizes + priority : évite de télécharger une image de 3840 px */}
        <Image
          src="/images/profil.jpeg"
          alt="Foukeng Kemayou Bavel Franck, développeur web à Douala"
          fill
          priority
          sizes="(min-width: 1024px) 352px, 240px"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        className="absolute -bottom-5 -right-5 bg-[#0d1030]
                   border border-cyan-400/20 rounded-2xl px-4 py-2.5
                   text-center shadow-xl"
        initial={{ opacity: 0, scale: 0, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 280, damping: 18 }}
      >
        <p className="text-cyan-400 font-extrabold text-xl leading-none">
          {yearsOfExperience}+
        </p>
        <p className="text-slate-500 text-[10px] mt-1 tracking-wide">
          Années exp.
        </p>
      </motion.div>
    </div>
  );
}

/* ── Fond décoratif (dégradés au lieu de gros flous coûteux) ── */
function HeroBackground({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
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
      {/* Orbe cyan — suit la souris */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          background:
            "radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)",
        }}
      />
      {/* Orbe bleu — fixe */}
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)",
        }}
      />
      {/* Lignes diagonales */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="100" x2="100" y2="0" stroke="#fff" strokeWidth="0.15" />
        <line x1="0" y1="70" x2="70" y2="0" stroke="#fff" strokeWidth="0.1" />
        <line x1="30" y1="100" x2="100" y2="30" stroke="#fff" strokeWidth="0.1" />
      </svg>
    </div>
  )
}