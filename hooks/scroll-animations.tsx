"use client";

import { useRef, ReactNode, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  Variants,
} from "framer-motion";

// ════════════════════════════════════════════════════════════════════
//  PATTERN 1 — FadeUp (FONDAMENTAL — le plus utilisé)
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 40, filter: "blur(4px)" }
      }
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PATTERN 2 — SlideIn (entrée latérale)
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

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
// ════════════════════════════════════════════════════════════════════
const staggerItemVariants: Variants = {
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
  const ref = useRef<HTMLUListElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: staggerDelay } },
  };

  return (
    <motion.ul
      ref={ref}
      className={className}
      variants={containerVariants}
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
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-speed * 100}px`, `${speed * 100}px`],
  );

  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y: smoothY }}>{children}</motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PATTERN 5 — ScaleReveal (zoom depuis le centre)
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
  const ref = useRef<HTMLDivElement>(null);
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
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PATTERN 6 — ScrollProgressBar (barre de lecture en haut de page)
// ════════════════════════════════════════════════════════════════════
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left
                 bg-gradient-to-r from-cyan-400 to-blue-500"
      style={{ scaleX }}
    />
  );
}

// ════════════════════════════════════════════════════════════════════
//  PATTERN 7 — ClipReveal (rideau qui se lève)
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

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
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const letters = Array.from(text);

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.03, delayChildren: delay },
    },
  };

  const letter: Variants = {
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
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
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
// ════════════════════════════════════════════════════════════════════

import type { UseInViewOptions } from "framer-motion";

export function useScrollReveal(options?: {
  once?: boolean;
  margin?: UseInViewOptions["margin"]; // <-- Utilise exactement le type attendu par Framer Motion
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: options?.margin ?? "0px 0px -60px 0px",
  });
  return { ref, isInView };
}
