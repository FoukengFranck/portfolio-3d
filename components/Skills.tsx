"use client";

// ╔══════════════════════════════════════════════════════════════════╗
//  Skills.tsx — Barres de compétences animées au scroll
//  Stack  : Next.js App Router + Framer Motion + Tailwind CSS
// ╚══════════════════════════════════════════════════════════════════╝

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  Code2,
  Palette,
  Database,
  Globe,
  Layers,
  Cpu,
  Server,
  Brush,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
//  1. DONNÉES
// ─────────────────────────────────────────────────────────────────
const SKILLS = [
  { name: "Laravel / PHP", level: 55, color: "#f43f5e", icon: Server },
  { name: "React / Next.js", level: 45, color: "#22d3ee", icon: Code2 },
  { name: "Tailwind CSS", level: 70, color: "#38bdf8", icon: Palette },
  { name: "Adobe Photoshop", level: 65, color: "#00c8ff", icon: Brush },
  { name: "Figma", level: 55, color: "#F24E1E", icon: Brush },
];

const TOOLS = [
  "VS Code",
  "Git / GitHub",
  "MySQL / PostgreSQL",
  "Figma",
  "XAMPP",
  "Vercel",
  "Vite",
];

// ─────────────────────────────────────────────────────────────────
//  2. VARIANTES D'ANIMATION
// ─────────────────────────────────────────────────────────────────

// Parent → délai en cascade entre ses enfants
const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

// Enfant → entre depuis la gauche avec blur
const cardVariants = {
  hidden: { opacity: 0, x: -28, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// Titre de section
const titleVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─────────────────────────────────────────────────────────────────
//  3. HOOK — Compteur animé de 0 → target
//
//  Principe :
//  • Ne démarre que lorsque `active` (= isInView) devient true
//  • setInterval incrémente un compteur à ~60fps
//  • S'arrête une fois `target` atteint
//  • La durée correspond à celle de la barre (synchronisé)
// ─────────────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let current = 0;
    const fps = 60;
    const frames = (durationMs / 1000) * fps; // nb total de frames
    const increment = target / frames; // valeur ajoutée par frame

    const id = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(id);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / fps); // ~16ms

    return () => clearInterval(id);
  }, [active, target, durationMs]);

  return count;
}

// ─────────────────────────────────────────────────────────────────
//  4. SUB-COMPOSANT — Barre de compétence individuelle
// ─────────────────────────────────────────────────────────────────
function SkillBar({ name, level, color, icon: Icon }: (typeof SKILLS)[number]) {
  const ref = useRef<HTMLDivElement>(null);

  // ┌───────────────────────────────────────────────────────────┐
  // │  useInView — LE SCROLL TRIGGER DE FRAMER MOTION           │
  // │                                                           │
  // │  Retourne true dès que l'élément `ref` entre dans         │
  // │  le viewport. C'est ce booléen qui déclenche l'animation. │
  // │                                                           │
  // │  once: true  → ne repasse pas à false en scrollant        │
  // │  margin      → anticipe de 60px avant l'entrée complète   │
  // └───────────────────────────────────────────────────────────┘
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const count = useCountUp(level, isInView);

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      className="group relative bg-white/[0.03] border border-white/[0.06]
                 rounded-2xl p-5 hover:border-white/[0.12]
                 transition-colors duration-300"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Halo coloré subtil au survol */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                   transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${color}10, transparent 70%)`,
        }}
      />

      {/* En-tête : icône + nom + compteur */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Badge icône coloré */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}18`, border: `1px solid ${color}30` }}
          >
            <Icon size={16} style={{ color }} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-semibold text-slate-300">{name}</span>
        </div>
        {/* Compteur qui monte en même temps que la barre */}
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {count}%
        </span>
      </div>

      {/* ── Barre de progression ──────────────────────────────
          ★ C'est ici le scroll animation principal ★
          
          initial={{ width: "0%" }}   → part de zéro
          animate={{ width: isInView  → se remplit quand visible
            ? `${level}%`
            : "0%" }}
          
          Quand useInView passe à true → Framer Motion lance
          l'animation de 0% vers level% automatiquement.
      ────────────────────────────────────────────────────────── */}
      <div className="relative h-[5px] bg-white/[0.06] rounded-full overflow-hidden">
        {/* Barre principale */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
          initial={{ width: "0%" }}
          animate={{ width: isInView ? `${level}%` : "0%" }}
          transition={{
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1], // expo out : rapide puis ralentit
            delay: 0.15,
          }}
        />

        {/* Shimmer : reflet lumineux qui glisse sur la barre */}
        <motion.div
          className="absolute inset-y-0 w-1/4 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
          }}
          initial={{ left: "-25%" }}
          animate={{ left: isInView ? "110%" : "-25%" }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.4 }}
        />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  5. SUB-COMPOSANT — Colonne droite (intro + illustration parallax)
// ─────────────────────────────────────────────────────────────────
function SkillsIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // de "entré" à "sorti" du viewport
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const parallaxY = useSpring(rawY, { stiffness: 80, damping: 22 });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-7"
      initial={{ opacity: 0, x: 32 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Illustration avec parallax vertical */}
      <motion.div
        className="relative aspect-square max-w-xs mx-auto w-full
                   rounded-3xl overflow-hidden bg-white/[0.02]
                   border border-white/[0.06] flex items-center justify-center"
        style={{ y: parallaxY }} // ← l'illustration bouge à une vitesse différente
      >
        {/* Grille décorative */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <OrbitingIcons />
      </motion.div>

      {/* Description */}
      <div className="space-y-3">
        <p className="text-slate-400 leading-relaxed text-[0.95rem]">
          Développeur Full-Stack passionné, je combine mes compétences en{" "}
          <span className="text-slate-200 font-medium">Génie Logiciel</span> et
          en{" "}
          <span className="text-slate-200 font-medium">Design Graphique</span>{" "}
          pour créer des applications web modernes, fluides et entièrement
          responsives.
        </p>
        <p className="text-slate-500 text-sm leading-relaxed">
          Mon quotidien ? Allier la robustesse d'une architecture propre à
          l'élégance d'interfaces soignées, afin de livrer des produits aussi
          performants que visuels.
        </p>
      </div>

      {/* Outils — badges avec apparition décalée */}
      <div>
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] mb-3">
          Tools & Ecosystem
        </p>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((tool, i) => (
            <motion.span
              key={tool}
              className="px-3 py-1 text-xs text-slate-400 rounded-lg
                         bg-white/[0.04] border border-white/[0.06]"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.045, duration: 0.3 }}
              whileHover={{
                scale: 1.1,
                color: "#22d3ee",
                borderColor: "rgba(34,211,238,0.3)",
                transition: { duration: 0.12 },
              }}
            >
              {tool}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  6. SUB-COMPOSANT — Icônes qui orbitent (décoratif)
// ─────────────────────────────────────────────────────────────────
function OrbitingIcons() {
  const icons = [Code2, Palette, Database, Globe, Layers, Cpu];
  const radius = 88;

  return (
    <div className="relative w-48 h-48">
      {/* Le conteneur tourne */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {icons.map((Icon, i) => {
          const angle = (i / icons.length) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <motion.div
              key={i}
              className="absolute w-9 h-9 rounded-xl bg-white/[0.05]
                         border border-white/[0.08] flex items-center justify-center"
              style={{
                left: `calc(50% + ${x}px - 18px)`,
                top: `calc(50% + ${y}px - 18px)`,
              }}
              // Contre-rotation : les icônes restent droites
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <Icon size={14} className="text-slate-500" strokeWidth={1.5} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Centre de l'orbite */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/20
                        flex items-center justify-center"
        >
          <span className="text-cyan-400 font-extrabold text-[10px]">FKBF</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  7. COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────
export default function Skills() {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true });

  return (
    <section
      id="skills"
      className="relative min-h-screen bg-[#08091a] py-28 px-6 overflow-hidden"
    >
      {/* Fonds lumineux */}
      <div
        className="absolute top-0 right-0 w-[28rem] h-[28rem]
                      rounded-full bg-blue-600/[0.04] blur-[130px] pointer-events-none"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96
                      rounded-full bg-cyan-500/[0.04] blur-[110px] pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Titre ──────────────────────────────────────────── */}
        <motion.div
          ref={titleRef}
          className="text-center mb-16"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          <p className="text-[11px] text-cyan-400/70 uppercase tracking-[0.22em] mb-3">
            What I know
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white">
            My{" "}
            <span
              className="text-transparent bg-clip-text
                             bg-gradient-to-r from-cyan-400 to-blue-500"
            >
              Skills
            </span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-md mx-auto text-sm leading-relaxed">
            A constantly evolving toolkit — here's what I'm currently proficient
            in.
          </p>
        </motion.div>

        {/* ── Grid ─────────────────────────────────────────────
            whileInView = raccourci pour animer dès que l'élément
            entre dans le viewport (équivalent à isInView + animate)
            viewport.once = ne rejoue pas si on scroll en arrière
        ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Colonne gauche : barres de compétences */}
          <motion.div
            className="flex flex-col gap-4"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          >
            {SKILLS.map((skill) => (
              <SkillBar key={skill.name} {...skill} />
            ))}
          </motion.div>

          {/* Colonne droite : description + illustration */}
          <SkillsIntro />
        </div>
      </div>
    </section>
  );
}
