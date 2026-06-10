"use client";

// ╔══════════════════════════════════════════════════════════════════╗
//  Portfolio.tsx — Grille de projets filtrables avec modal détail
//  Stack  : Next.js App Router + Framer Motion + Tailwind CSS
// ╚══════════════════════════════════════════════════════════════════╝

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
  Variants,
} from "framer-motion";
import { ExternalLink, X, ArrowUpRight, Folder, Star, Eye } from "lucide-react";

// On crée une interface qui étend les propriétés SVG de base en ajoutant "size"
interface GithubIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const GithubIcon = ({ size = 24, ...props }: GithubIconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size} // Utilise la prop size pour la largeur
    height={size} // Utilise la prop size pour la hauteur
    {...props}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.91-1.294 2.75-1.025 2.75-1.025.544 1.376.202 2.393.1 2.646.64.698 1.026 1.591 1.026 2.682 0 3.841-2.338 4.687-4.566 4.934.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10 10 0 0022 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
//  1. DONNÉES
// ─────────────────────────────────────────────────────────────────
type Project = {
  id: number;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  featured: boolean;
  demoUrl: string;
  githubUrl: string;
  year: string;
  stars?: number; // Optionnel ou à adapter selon vos besoins
};

const CATEGORIES = ["All", "React.js", "Laravel", "PHP", "JavaScript"];

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "FKBF KamerLink - Plateforme de mise en relation",
    shortDesc:
      "Une application web qui permet de mettre en relation les chercheurs d'emploi, stagiaires et organismes de formation avec les recruteurs au Cameroun.",
    fullDesc:
      "Solution d'insertion professionnelle centralisant les offres d'emploi, de stage et de formation. Intègre un espace recruteur pour la publication d'offres et un espace candidat avec gestion de profils, conçue pour dynamiser le marché local.",
    category: "Laravel",
    tags: ["Laravel", "HTML", "Tailwind", "MySQL", "Docker", "Render"],
    gradient: "from-cyan-500/25 via-blue-600/15 to-transparent",
    accentColor: "#22d3ee",
    featured: true,
    demoUrl: "https://fkbfkamerlink.onrender.com/",
    githubUrl: "https://github.com/FoukengFranck/fkbfkamerlink.git",
    year: "2025 - 2026",
    stars: 0,
  },
  {
    id: 2,
    title: "Dashboard de FCRV Bank",
    shortDesc:
      "Une application web interne de gestion des opérations financières et de suivi pour l'établissement FCRV Bank.",
    fullDesc:
      "Développement d'un tableau de bord d'administration bancaire permettant de suivre les flux, gérer les comptes clients, centraliser les données financières et visualiser l'activité globale via une interface dynamique en JavaScript pur.",
    category: "JavaScript",
    tags: ["HTML5", "CSS3", "JavaScript"],
    gradient: "from-purple-500/20 via-pink-600/10 to-transparent",
    accentColor: "#818cf8",
    featured: false,
    demoUrl: "",
    githubUrl: "https://github.com/FoukengFranck/FRCVBank.git",
    year: "2025",
    stars: 0,
  },
  {
    id: 3,
    title: "Calculatrice",
    shortDesc:
      "Une application web d'outils de calcul dotée d'une interface utilisateur moderne, fluide et responsive.",
    fullDesc:
      "Projet pratique axé sur la logique algorithmique en JavaScript, la manipulation du DOM et la gestion des priorités de calcul, habillé avec une interface graphique soignée en HTML5 et CSS3.",
    category: "JavaScript",
    tags: ["HTML5", "CSS3", "JavaScript"],
    gradient: "from-emerald-500/20 via-teal-600/10 to-transparent",
    accentColor: "#34d399",
    featured: false,
    demoUrl: "",
    githubUrl: "https://github.com/FoukengFranck/Calculatrice.git",
    year: "2025",
    stars: 0,
  },
  {
    id: 4,
    title: "MediLink - Système de Suivi Médical",
    shortDesc:
      "Application web complète pour la gestion des patients, des consultations et des dossiers médicaux.",
    fullDesc:
      "Système d'information médical développé en PHP/MySQL permettant aux structures de santé de numériser le suivi des patients, de sécuriser l'historique des consultations et d'optimiser la gestion des dossiers de manière fluide.",
    category: "PHP",
    tags: ["HTML5", "Tailwind CSS", "PHP", "MySQL"],
    gradient: "from-orange-500/20 via-amber-600/10 to-transparent",
    accentColor: "#fb923c",
    featured: false,
    demoUrl: "",
    githubUrl: "https://github.com/FoukengFranck/Suivie-Medicale.git",
    year: "2025",
    stars: 0,
  },
  {
    id: 5,
    title: "Gestion des Tâches",
    shortDesc:
      "Une application web intuitive de type To-Do list pour organiser et planifier le flux de travail quotidien.",
    fullDesc:
      "Conception d'une interface orientée productivité permettant la création, modification, catégorisation et suppression des tâches, mettant en pratique la gestion d'état et l'organisation de composants Next.js.",
    category: "React.js",
    tags: ["React.js", "TypeScript", "Tailwind CSS"],
    gradient: "from-pink-500/20 via-rose-600/10 to-transparent",
    accentColor: "#f472b6",
    featured: false,
    demoUrl: "https://ornate-donut-a55c0e.netlify.app/",
    githubUrl: "https://github.com/FoukengFranck/Gestion-tache.git",
    year: "2025",
    stars: 0,
  },
  {
    id: 6,
    title: "Génerateur d'avatar alpaga",
    shortDesc: "Mini site web de génerateur aléatoire d'avatar alpaga",
    fullDesc:
      "Conception d'un site web qui vous permet de génerer soit de manier aléatoire ou bien de pésonaliser vous meme et puis de télecharger.",
    category: "JavaScript",
    tags: ["HTML5", "CSS3", "JavaScript"],
    gradient: "from-pink-500/20 via-rose-600/10 to-transparent",
    accentColor: "#cf72cc",
    featured: false,
    demoUrl: "generateur-avatar-alpaca.netlify.app",
    githubUrl: "https://github.com/FoukengFranck/Alpaca-Avatar.git",
    year: "2025",
    stars: 0,
  },
];

// ─────────────────────────────────────────────────────────────────
//  2. VARIANTES D'ANIMATION (Typées explicitement avec 'Variants')
// ─────────────────────────────────────────────────────────────────
const titleVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25 } },
};

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

// ─────────────────────────────────────────────────────────────────
//  3. SUB-COMPOSANT — Modal de détail d'un projet
// ─────────────────────────────────────────────────────────────────
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#08091a]/85 backdrop-blur-md" />

      <motion.div
        className="relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden
                   bg-[#0d1030] border border-white/[0.08] shadow-2xl"
        initial={{ opacity: 0, scale: 0.92, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 32 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60`}
        />
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${project.accentColor}, transparent)`,
          }}
        />

        <div className="relative z-10 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full"
                  style={{
                    background: `${project.accentColor}20`,
                    color: project.accentColor,
                  }}
                >
                  {project.category}
                </span>
                <span className="text-[11px] text-slate-600">
                  {project.year}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                {project.title}
              </h3>
            </div>
            <motion.button
              className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10
                         flex items-center justify-center text-slate-400
                         hover:text-white hover:bg-white/10 transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>
          </div>

          <p className="text-slate-300 leading-relaxed mb-6">
            {project.fullDesc}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-lg bg-white/[0.05]
                           border border-white/[0.08] text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            {project.demoUrl && (
              <motion.a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm
                         text-[#08091a]"
                style={{ background: project.accentColor }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <ExternalLink size={14} strokeWidth={2.5} />
                Voir la démo
              </motion.a>
            )}
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
                         border border-white/15 text-white"
              whileHover={{
                scale: 1.04,
                y: -1,
                borderColor: "rgba(255,255,255,0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <GithubIcon size={14} />
              Code source
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  4. SUB-COMPOSANT — Carte projet featured (grande)
// ─────────────────────────────────────────────────────────────────
function FeaturedProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <motion.div
      ref={ref}
      className="col-span-full"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.article
        className="group relative rounded-3xl overflow-hidden cursor-pointer
                   bg-white/[0.03] border border-white/[0.06]
                   hover:border-white/[0.14] transition-colors duration-300"
        whileHover={{ y: -4 }}
        onClick={() => onOpen(project)}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient}
                       group-hover:opacity-[1.3] transition-opacity duration-500`}
        />

        <div className="relative z-10 p-8 md:p-10 grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full"
                style={{
                  background: `${project.accentColor}20`,
                  color: project.accentColor,
                }}
              >
                Featured
              </span>
              <span className="text-[11px] text-slate-500">{project.year}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">
              {project.title}
            </h3>
            <p className="text-slate-400 leading-relaxed">
              {project.shortDesc}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-white/[0.05]
                             border border-white/[0.06] text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              {project.demoUrl && (
                <motion.a
                  href={project.demoUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                             font-bold text-xs text-[#08091a]"
                  style={{ background: project.accentColor }}
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ExternalLink size={12} /> Demo
                </motion.a>
              )}
              <motion.a
                href={project.githubUrl}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                           font-semibold text-xs border border-white/15 text-white"
                onClick={(e) => e.stopPropagation()}
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <GithubIcon size={12} /> Code
              </motion.a>
            </div>
          </div>

          <motion.div
            className="hidden md:flex md:col-span-2 items-center justify-center"
            style={{ y }}
          >
            <div
              className="w-48 h-48 rounded-3xl border border-white/[0.08] flex items-center
                         justify-center bg-white/[0.03]"
            >
              <Folder
                size={64}
                style={{ color: project.accentColor, opacity: 0.25 }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-6 right-8 flex items-center gap-1.5
                     text-xs font-semibold opacity-0 group-hover:opacity-100
                     transition-opacity duration-300"
          style={{ color: project.accentColor }}
        >
          Voir le détail <ArrowUpRight size={13} />
        </motion.div>
      </motion.article>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  5. SUB-COMPOSANT — Carte projet standard
// ─────────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  return (
    <motion.article
      layout
      variants={cardVariants}
      className="group relative rounded-2xl overflow-hidden cursor-pointer
                 bg-white/[0.03] border border-white/[0.06] flex flex-col
                 hover:border-white/[0.14] transition-colors duration-300"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => onOpen(project)}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                   transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${project.accentColor}0d, transparent 70%)`,
        }}
      />

      <div
        className="h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${project.accentColor}60, transparent)`,
        }}
      />

      <div className="relative z-10 p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between">
          <span
            className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-lg"
            style={{
              background: `${project.accentColor}15`,
              color: project.accentColor,
            }}
          >
            {project.category}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] text-slate-600">
              <Star size={10} className="text-yellow-400" fill="currentColor" />
              {project.stars ?? 0}
            </span>
            <span className="text-[11px] text-slate-600">{project.year}</span>
          </div>
        </div>

        <h3
          className="text-base font-bold text-white leading-snug
                     group-hover:text-cyan-300 transition-colors duration-300"
        >
          {project.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-1">
          {project.shortDesc}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] rounded-md bg-white/[0.04]
                         border border-white/[0.06] text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="flex items-center justify-between pt-2 mt-auto
                         border-t border-white/[0.05]"
        >
          <div className="flex gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label="Demo"
              >
                <ExternalLink size={14} />
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="GitHub"
            >
              <GithubIcon size={14} />
            </a>
          </div>
          <motion.span
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: project.accentColor }}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            Détails <ArrowUpRight size={12} />
          </motion.span>
        </div>
      </div>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────────
//  6. COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true });

  const featured = PROJECTS.find((p) => p.featured)!;
  const filtered = PROJECTS.filter(
    (p) =>
      !p.featured &&
      (activeCategory === "All" || p.category === activeCategory),
  );

  return (
    <section
      id="portfolio"
      className="relative min-h-screen bg-[#08091a] py-28 px-6 overflow-hidden"
    >
      <div
        className="absolute top-0 right-1/4 w-96 h-96
                      rounded-full bg-blue-500/[0.04] blur-[130px] pointer-events-none"
      />
      <div
        className="absolute bottom-1/4 left-0 w-80 h-80
                      rounded-full bg-cyan-500/[0.04] blur-[110px] pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          ref={titleRef}
          className="text-center mb-14"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          <p className="text-[11px] text-cyan-400/70 uppercase tracking-[0.22em] mb-3">
            My work
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white">
            Mon{" "}
            <span
              className="text-transparent bg-clip-text
                             bg-gradient-to-r from-cyan-400 to-blue-500"
            >
              Portfolio
            </span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Une sélection de mes projets récents — du frontend au full-stack.
          </p>
        </motion.div>

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
              className={`relative px-4 py-2 text-sm font-medium rounded-xl
                          transition-colors duration-200
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
                  layoutId="portfolioFilter"
                  className="absolute inset-0 rounded-xl bg-cyan-400"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </motion.button>
          ))}
        </motion.div>

        {activeCategory === "All" && (
          <div className="mb-5">
            <FeaturedProjectCard
              project={featured}
              onOpen={setSelectedProject}
            />
          </div>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={setSelectedProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>

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
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 text-white font-semibold text-sm"
            whileHover={{
              scale: 1.04,
              y: -2,
              borderColor: "rgba(34,211,238,0.45)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <GithubIcon size={15} />
            Voir tous mes projets sur GitHub
            <ArrowUpRight size={15} />
          </motion.a>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
