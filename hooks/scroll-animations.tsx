"use client";



import { useRef, ReactNode } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";

// ════════════════════════════════════════════════════════════════════
//  PATTERN 1 — FadeUp (FONDAMENTAL — le plus utilisé)
//
//  L'élément est invisible + décalé vers le bas.
//  Quand il entre dans le viewport → il monte + apparaît.
//
//  Usage :
//  <FadeUp>
//    <h2>Mon titre</h2>
//  </FadeUp>
//
//  <FadeUp delay={0.3} className="my-4">
//    <p>Un paragraphe</p>
//  </FadeUp>
// ════════════════════════════════════════════════════════════════════
export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);

  // useInView retourne true quand `ref` entre dans le viewport
  // once   : true  → l'animation ne rejoue pas au scroll en arrière
  // margin : anticipe 60px avant l'entrée complète dans le viewport
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" } // état final
          : { opacity: 0, y: 40, filter: "blur(4px)" } // état initial
      }
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1], // easeOutExpo — naturel et fluide
      }}
    >
      {children}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PATTERN 2 — SlideIn (entrée latérale)
//
//  L'élément entre depuis la gauche, la droite, le haut ou le bas.
//  Parfait pour les layouts en deux colonnes (texte ↔ image).
//
//  Usage :
//  <SlideIn direction="left">
//    <div>Texte</div>
//  </SlideIn>
//  <SlideIn direction="right" delay={0.15}>
//    <img ... />
//  </SlideIn>
// ════════════════════════════════════════════════════════════════════
export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  // Coordonnées de départ selon la direction
  const offsets = {
    left: { x: -60, y: 0 },
    right: { x: 60, y: 0 },
    up: { x: 0, y: -60 },
    down: { x: 0, y: 60 },
  };
  const { x, y } = offsets[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PATTERN 3 — StaggerList (liste en cascade)
//
//  Les enfants apparaissent l'un après l'autre avec un délai.
//  Idéal pour les cartes de portfolio, menus, listes de projets.
//
//  Usage :
//  <StaggerList
//    items={["React", "Next.js", "Tailwind"]}
//    renderItem={(tech) => <span className="badge">{tech}</span>}
//    className="flex flex-wrap gap-2"
//  />
// ════════════════════════════════════════════════════════════════════
const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1, // 100ms de décalage entre chaque item
      delayChildren: 0.05,
    },
  },
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function StaggerList<T>({
  items,
  renderItem,
  className = "",
  staggerDelay = 0.1,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  return (
    <motion.ul
      ref={ref}
      className={className}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {items.map((item, i) => (
        <motion.li key={i} variants={staggerItemVariants}>
          {renderItem(item, i)}
        </motion.li>
      ))}
    </motion.ul>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PATTERN 4 — Parallax (effet de profondeur au scroll)
//
//  Le contenu se déplace à une vitesse différente du scroll.
//  Crée une sensation de profondeur 3D entre les couches.
//
//  speed :
//   0    = fixe (ne bouge pas)
//   0.3  = bouge à 30% de la vitesse du scroll (standard)
//   -0.3 = bouge dans le sens inverse (scroll vers bas = descend)
//
//  Usage :
//  <Parallax speed={0.25}>
//    <img src="/bg.jpg" className="w-full scale-110" />
//  </Parallax>
// ════════════════════════════════════════════════════════════════════
export function Parallax({
  children,
  speed = 0.3,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef(null);

  // useScroll avec target → mesure le scroll RELATIF à cet élément
  // offset: ["start end", "end start"] = de l'entrée à la sortie du viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // useTransform → mappe [0,1] vers un déplacement en pixels
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-speed * 100}px`, `${speed * 100}px`],
  );

  // useSpring → ajoute de l'inertie pour un mouvement plus doux
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y: smoothY }}>{children}</motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PATTERN 5 — ScaleReveal (zoom depuis le centre)
//
//  L'élément part à 85% de sa taille et grossit en apparaissant.
//  Idéal pour les images, cartes, illustrations.
//
//  Usage :
//  <ScaleReveal delay={0.2}>
//    <div className="card">...</div>
//  </ScaleReveal>
// ════════════════════════════════════════════════════════════════════
export function ScaleReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.34, 1.56, 0.64, 1], // légère élasticité (overshoot)
      }}
    >
      {children}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PATTERN 6 — ScrollProgressBar (barre de lecture en haut de page)
//
//  Barre de progression qui avance au fil du scroll.
//  À placer dans layout.tsx pour qu'elle soit visible partout.
//
//  Usage dans layout.tsx :
//  import { ScrollProgressBar } from "@/hooks/scroll-animations"
//  ...
//  <body>
//    <ScrollProgressBar />   ← avant le <main>
//    <main>...</main>
//  </body>
// ════════════════════════════════════════════════════════════════════
export function ScrollProgressBar() {
  // Sans target → mesure le scroll global de la page entière
  const { scrollYProgress } = useScroll();

  // useSpring → la barre rattrape la valeur avec de l'inertie
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left
                 bg-gradient-to-r from-cyan-400 to-blue-500"
      // scaleX : 0 = non affiché (haut de page), 1 = pleine largeur (bas de page)
      style={{ scaleX }}
    />
  );
}

// ════════════════════════════════════════════════════════════════════
//  PATTERN 7 — ClipReveal (rideau qui se lève)
//
//  L'élément est masqué via clip-path et se révèle de haut en bas
//  (ou de bas en haut selon la direction).
//  Parfait pour les images et les titres de section.
//
//  Usage :
//  <ClipReveal direction="up" delay={0.1}>
//    <img src="/project.jpg" className="w-full" />
//  </ClipReveal>
// ════════════════════════════════════════════════════════════════════
export function ClipReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // clip-path initial selon la direction (masque l'élément)
  const clips = {
    up: { initial: "inset(100% 0 0 0)", final: "inset(0% 0 0 0)" },
    down: { initial: "inset(0 0 100% 0)", final: "inset(0 0 0% 0)" },
    left: { initial: "inset(0 0 0 100%)", final: "inset(0 0 0 0%)" },
    right: { initial: "inset(0 100% 0 0)", final: "inset(0 0% 0 0)" },
  };

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: clips[direction].initial }}
      animate={isInView ? { clipPath: clips[direction].final } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PATTERN 8 — LetterStagger (texte lettre par lettre)
//
//  Chaque lettre apparaît en cascade avec une légère rotation 3D.
//  Idéal pour les titres "hero" à fort impact visuel.
//
//  Usage :
//  <h1>
//    <LetterStagger text="Hi, I'm Adam" className="text-5xl font-bold text-white" />
//  </h1>
// ════════════════════════════════════════════════════════════════════
export function LetterStagger({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const letters = Array.from(text);

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.03, delayChildren: delay },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 18, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ perspective: "800px" }}
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          variants={letter}
          className="inline-block"
          // Les espaces ne doivent pas être supprimés
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PATTERN 9 — CountUp (chiffres qui montent)
//
//  Un compteur qui part de 0 et monte jusqu'à `target`
//  dès que l'élément entre dans le viewport.
//
//  Usage :
//  <p>
//    <CountUp target={92} suffix="%" />    → "92%"
//    <CountUp target={3}  prefix="+" suffix=" ans" />  → "+3 ans"
//  </p>
// ════════════════════════════════════════════════════════════════════
export function CountUp({
  target,
  suffix = "",
  prefix = "",
  durationMs = 1500,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const [display, setDisplay] = [...require("react").useState(0)];

  require("react").useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const fps = 60;
    const frames = (durationMs / 1000) * fps;
    const increment = target / frames;

    const id = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplay(target);
        clearInterval(id);
      } else {
        setDisplay(Math.floor(current));
      }
    }, 1000 / fps);

    return () => clearInterval(id);
  }, [isInView, target, durationMs]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════
//  HOOK — useScrollReveal (hook générique réutilisable)
//
//  Version hook de useInView avec les bonnes options par défaut.
//  À utiliser quand tu veux plus de contrôle qu'avec les composants.
//
//  Usage :
//  function MonComposant() {
//    const { ref, isInView } = useScrollReveal()
//    return (
//      <motion.div
//        ref={ref}
//        initial={{ opacity: 0 }}
//        animate={isInView ? { opacity: 1 } : {}}
//      >
//        Contenu
//      </motion.div>
//    )
//  }
// ════════════════════════════════════════════════════════════════════
export function useScrollReveal(options?: { once?: boolean; margin?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: options?.margin ?? "0px 0px -60px 0px",
  });
  return { ref, isInView };
}

// ════════════════════════════════════════════════════════════════════
//  RÉCAPITULATIF — Quand utiliser quoi ?
//
//  FadeUp          → titre, paragraphe, bloc générique (usage universel)
//  SlideIn         → layout 2 colonnes (texte depuis gauche, image depuis droite)
//  StaggerList     → liste de cartes, badges, items de menu
//  Parallax        → image de fond, illustration décorative
//  ScaleReveal     → carte de projet, avatar, illustration centrale
//  ScrollProgressBar → layout global (lecture de la page)
//  ClipReveal      → image "qui se dévoile" ou titre de grande section
//  LetterStagger   → titre hero à fort impact
//  CountUp         → statistiques, pourcentages, chiffres clés
//  useScrollReveal → quand tu as besoin de logique custom
// ════════════════════════════════════════════════════════════════════
