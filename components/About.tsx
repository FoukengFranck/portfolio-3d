"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  Variants,
} from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Award,
  Download,
  GitCommit,
  Terminal,
  Zap,
  MapPin,
  LucideIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
//  1. DONNÉES
// ─────────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    year: "2024 - 2026",
    type: "education",
    title: "Brevet de Technicien Supérieur (BTS) — Génie Logiciel",
    company: "Institut Universitaire de la Côte (IUC)",
    description:
      "Formation approfondie en développement, architecture logicielle et gestion de projets informatiques. Diplôme en cours d'obtention.",
    icon: GraduationCap,
    color: "#22d3ee",
  },
  {
    year: "2025",
    type: "work",
    title: "Stagiaire Développeur Web (Stage Académique)",
    company: "Innov Cameroon — Douala",
    description:
      "Analyse des besoins et modélisation logicielle. Développement Full-Stack d'interfaces dynamiques (UI/UX et backend). Optimisation de bases de données relationnelles et collaboration technique en équipe via Git/GitHub.",
    icon: Briefcase,
    color: "#818cf8",
  },
  {
    year: "2025",
    type: "award",
    title: "Certifications Introduction à HTML & JavaScript",
    company: "SoloLearn",
    description:
      "Certifications officielles validant les compétences fondamentales en intégration web et logique de programmation JavaScript.",
    icon: Award,
    color: "#f472b6",
  },
  {
    year: "2024",
    type: "education",
    title: "Baccalauréat Scientifique (Série D)",
    company: "Lycée Bilingue de Sodiko",
    description:
      "Diplôme d'études secondaires avec une solide formation en sciences, logique et résolution de problèmes.",
    icon: GraduationCap,
    color: "#fb923c",
  },
];

const STATS = [
  { icon: GitCommit, value: "100+", label: "Commits GitHub", color: "#a78bfa" },
  {
    icon: GraduationCap,
    value: "Bac+2",
    label: "Niveau d'études",
    color: "#f472b6",
  },
  {
    icon: Terminal,
    value: "3+",
    label: "Technos maîtrisées",
    color: "#fb923c",
  },
  { icon: Zap, value: "1+", label: "Ans d'expérience", color: "#818cf8" },
];

const INTERESTS = ["Next js", "Figma", "Photography", "Gaming", "Photoshop"];

// ─────────────────────────────────────────────────────────────────
//  2. VARIANTES D'ANIMATION (Corrigées avec "as const" ou typage explicite)
// ─────────────────────────────────────────────────────────────────
const titleVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const timelineItemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─────────────────────────────────────────────────────────────────
//  3. SUB-COMPOSANT — Stat animée
// ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
}

function StatCard({ icon: Icon, value, label, color }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="group relative flex flex-col items-center gap-3 p-6
                 rounded-2xl bg-white/[0.03] border border-white/[0.06]
                 hover:border-white/[0.12] transition-colors duration-300"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ y: -4 }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                   transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}10, transparent 70%)`,
        }}
      />
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon size={18} style={{ color }} strokeWidth={1.5} />
      </div>
      <p className="text-3xl font-extrabold text-white">{value}</p>
      <p className="text-xs text-slate-500 text-center tracking-wide">
        {label}
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  4. SUB-COMPOSANT — Item de la timeline
// ─────────────────────────────────────────────────────────────────
interface TimelineItemProps {
  item: {
    year: string;
    type: string;
    title: string;
    company: string;
    description: string;
    icon: LucideIcon;
    color: string;
  };
  index: number;
  isLast: boolean;
}

function TimelineItem({ item, index, isLast }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-6"
      variants={timelineItemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay: index * 0.08 }}
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          className="relative w-10 h-10 rounded-xl flex items-center justify-center z-10 border"
          style={{
            background: `${item.color}15`,
            borderColor: `${item.color}35`,
          }}
          initial={{ scale: 0, rotate: -20 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{
            delay: index * 0.08 + 0.1,
            type: "spring",
            stiffness: 300,
          }}
        >
          <item.icon
            size={16}
            style={{ color: item.color }}
            strokeWidth={1.5}
          />
        </motion.div>

        {!isLast && (
          <motion.div
            className="w-px flex-1 mt-2"
            style={{
              background: `linear-gradient(to bottom, ${item.color}30, transparent)`,
            }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ delay: index * 0.08 + 0.3, duration: 0.6 }}
          />
        )}
      </div>

      <div className="pb-10 flex-1 min-w-0">
        <span
          className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-md mb-2 uppercase tracking-widest"
          style={{ background: `${item.color}18`, color: item.color }}
        >
          {item.year}
        </span>

        <h4 className="text-base font-bold text-white leading-snug">
          {item.title}
        </h4>
        <p className="text-sm text-slate-500 mt-0.5 mb-2">{item.company}</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  5. SUB-COMPOSANT — Colonne gauche
// ─────────────────────────────────────────────────────────────────
function AboutIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y = useSpring(rawY, { stiffness: 80, damping: 22 });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-8"
      initial={{ opacity: 0, x: -32 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.06]"
        style={{ y }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-900/40 via-[#08091a] to-purple-900/30">
          <motion.div
            className="w-24 h-24 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center"
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-cyan-400 font-extrabold text-[15px]">
              FKBF
            </span>
          </motion.div>
        </div>

        <motion.a
          href="https://maps.app.goo.gl/wjVYfMhqFM3VpgKM6?g_st=aw"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#0d1030]/80 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2.5 text-sm hover:border-cyan-400/30 transition-colors"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.03 }}
        >
          <MapPin size={18} className="text-cyan-400" />
          <span className="text-slate-300 font-medium">Douala, Cameroun</span>
        </motion.a>
      </motion.div>

      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-white">
          Passionné de code &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            de design
          </span>
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Développeur Web basé à Douala, je crée des interfaces qui allient
          performance technique et soin esthétique. Je suis convaincu qu'un bon
          produit se vit autant qu'il se regarde.
        </p>
        <p className="text-slate-500 text-sm leading-relaxed">
          En dehors du code, tu me trouveras à explorer de nouveaux outils de
          design, contribuer à des projets open source, ou tout simplement à
          rater des photos avec mon appareil photo.
        </p>
      </div>

      <div>
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] mb-3">
          Centres d'intérêt
        </p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest, i) => (
            <motion.span
              key={interest}
              className="px-3 py-1 text-xs text-slate-400 rounded-lg bg-white/[0.04] border border-white/[0.06]"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
              whileHover={{
                scale: 1.1,
                color: "#22d3ee",
                borderColor: "rgba(34,211,238,0.3)",
                transition: { duration: 0.12 },
              }}
            >
              {interest}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.a
        href="/docs/FOUKENG-KEMAYOU-BAVEL-FRANCK-DEVELOPPEUR-WEB.pdf"
        download="FOUKENG-KEMAYOU-BAVEL-FRANCK-DEVELOPPEUR-WEB.pdf"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white font-semibold text-sm self-start"
        whileHover={{
          scale: 1.04,
          y: -2,
          borderColor: "rgba(34,211,238,0.45)",
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Download size={15} />
        Télécharger mon CV
      </motion.a>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  6. COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────
export default function About() {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true });
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true });

  return (
    <section
      id="about"
      className="relative min-h-screen bg-[#08091a] py-28 px-6 overflow-hidden"
    >
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-purple-500/[0.04] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-cyan-500/[0.04] blur-[110px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-20">
        {/* Titre */}
        <motion.div
          ref={titleRef}
          className="text-center"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          <p className="text-[11px] text-cyan-400/70 uppercase tracking-[0.22em] mb-3">
            Who I am
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white">
            À{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              propos
            </span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Un peu de contexte sur mon parcours, ma façon de travailler et ce
            qui m'anime.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <AboutIntro />

          {/* Timeline */}
          <div>
            <motion.h3
              className="text-lg font-bold text-white mb-8"
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Mon parcours
            </motion.h3>

            <div className="flex flex-col">
              {TIMELINE.map((item, i) => (
                <TimelineItem
                  key={item.title}
                  item={item}
                  index={i}
                  isLast={i === TIMELINE.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
