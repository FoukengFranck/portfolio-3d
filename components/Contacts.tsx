"use client";

// ╔══════════════════════════════════════════════════════════════════╗
//  Contact.tsx — Formulaire de contact fonctionnel avec Resend
//  Stack   : Next.js App Router + Framer Motion + Tailwind CSS
// ╚══════════════════════════════════════════════════════════════════╝

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Interface pour étendre les props SVG standards avec la propriété size
interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const GithubIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    {...props}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.91-1.294 2.75-1.025 2.75-1.025.544 1.376.202 2.393.1 2.646.64.698 1.026 1.591 1.026 2.682 0 3.841-2.338 4.687-4.566 4.934.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10 10 0 0022 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LinkedinIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    {...props}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9.357h3.414v1.521h.049c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.369zM5.337 7.433a2.064 2.064 0 01-2.063-2.065 2.064 2.064 0 012.063-2.063 2.065 2.065 0 012.064 2.063 2.064 2.064 0 01-2.064 2.065zm1.782 13.019H3.555V9.357h3.564v11.095zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.205 24 24 23.226 24 22.271V1.729C24 .774 23.205 0 22.225 0z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
//  1. DONNÉES
// ─────────────────────────────────────────────────────────────────
const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "founkengbavel@gmail.com",
    href: "mailto:founkengbavel@gmail.com",
    color: "#22d3ee",
  },
  {
    icon: MapPin,
    label: "Localisation",
    value: "Douala, Cameroun",
    href: "#",
    color: "#818cf8",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+237 670494508",
    href: "tel:+237670494508",
    color: "#34d399",
  },
];

const SOCIALS = [
  {
    icon: GithubIcon,
    label: "GitHub",
    href: "https://github.com/FoukengFranck",
    color: "#e2e8f0",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bavel-founkeng/",
    color: "#0ea5e9",
  },
];

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
type FieldErr = Partial<Record<keyof FormData, string>>;
type Status = "idle" | "loading" | "success" | "error";

// ─────────────────────────────────────────────────────────────────
//  2. VALIDATION
// ─────────────────────────────────────────────────────────────────
function validate(data: FormData): FieldErr {
  const e: FieldErr = {};
  if (!data.name.trim()) e.name = "Le nom est requis.";
  if (!data.email.trim()) e.email = "L'email est requis.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    e.email = "Format invalide.";
  if (!data.subject.trim()) e.subject = "Le sujet est requis.";
  if (!data.message.trim()) e.message = "Le message est requis.";
  else if (data.message.length < 20) e.message = "Minimum 20 caractères.";
  return e;
}

// ─────────────────────────────────────────────────────────────────
//  3. VARIANTES
// ─────────────────────────────────────────────────────────────────
const titleVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─────────────────────────────────────────────────────────────────
//  4. SUB-COMPOSANT — Champ de formulaire animé
// ─────────────────────────────────────────────────────────────────
function Field({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  multiline = false,
}: {
  label: string;
  id: keyof FormData;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  error?: string;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const Tag = multiline ? "textarea" : "input";

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium text-slate-500 uppercase tracking-widest"
      >
        {label}
      </label>
      <div className="relative">
        <AnimatePresence>
          {focused && (
            <motion.div
              className="absolute -inset-px rounded-xl pointer-events-none"
              style={{
                border: error
                  ? "1px solid rgba(248,113,113,0.5)"
                  : "1px solid rgba(34,211,238,0.4)",
                background: error
                  ? "rgba(248,113,113,0.06)"
                  : "rgba(34,211,238,0.06)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>
        <Tag
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={multiline ? 5 : undefined}
          className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3
                      text-sm text-white placeholder:text-slate-700
                      outline-none resize-none transition-colors duration-200
                      ${error ? "border-red-400/35" : "border-white/[0.08] hover:border-white/[0.15]"}
                      ${multiline ? "min-h-[120px]" : ""}`}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="flex items-center gap-1.5 text-xs text-red-400"
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  5. SUB-COMPOSANT — Informations de contact (colonne gauche)
// ─────────────────────────────────────────────────────────────────
function ContactInfo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-8"
      initial={{ opacity: 0, x: -32 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="space-y-4">
        <h3 className="text-2xl font-extrabold text-white">
          Travaillons{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            ensemble
          </span>
        </h3>
        <p className="text-slate-400 leading-relaxed">
          Un projet en tête ? Une mission freelance ? Je suis disponible et prêt
          à en discuter. Réponds généralement sous{" "}
          <span className="text-cyan-400 font-medium">24 heures</span>.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {CONTACT_INFO.map(({ icon: Icon, label, value, href, color }, i) => (
          <motion.a
            key={label}
            href={href}
            className="group flex items-center gap-4 p-4 rounded-2xl
                       bg-white/[0.03] border border-white/[0.06]
                       hover:border-white/[0.12] transition-colors duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
            whileHover={{ x: 4 }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `${color}18`,
                border: `1px solid ${color}30`,
              }}
            >
              <Icon size={16} style={{ color }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest">
                {label}
              </p>
              <p className="text-sm text-slate-300 font-medium mt-0.5 group-hover:text-white transition-colors">
                {value}
              </p>
            </div>
          </motion.a>
        ))}
      </div>

      <div>
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] mb-4">
          Retrouve-moi sur
        </p>
        <div className="flex gap-3">
          {SOCIALS.map(({ icon: Icon, label, href, color }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.07]
               flex items-center justify-center text-slate-500
               hover:border-white/20 transition-colors"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                delay: 0.5 + i * 0.07,
                type: "spring",
                stiffness: 300,
              }}
              whileHover={{ scale: 1.15, color }}
              whileTap={{ scale: 0.92 }}
            >
              <Icon size={19} />
            </motion.a>
          ))}
        </div>
      </div>

      <motion.div
        className="p-5 rounded-2xl bg-cyan-400/[0.06] border border-cyan-400/20"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
          </span>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            Disponible pour missions
          </span>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">
          Ouvert aux projets freelance et aux opportunités remote à temps plein.
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  6. SUB-COMPOSANT — Formulaire fonctionnel
// ─────────────────────────────────────────────────────────────────
function ContactForm() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErr>({});
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormData])
      setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      setStatus("error");
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 32 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.07]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/[0.04] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 p-8">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                className="flex flex-col items-center justify-center gap-5 py-14 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -25 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                >
                  <CheckCircle2
                    size={56}
                    className="text-cyan-400"
                    strokeWidth={1.5}
                  />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Message envoyé !
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                    Je te réponds sous 24h.
                  </p>
                </div>
                <motion.button
                  className="px-5 py-2.5 text-sm rounded-xl border border-white/15 text-slate-300 hover:border-cyan-400/40 transition-colors"
                  onClick={() => setStatus("idle")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Envoyer un autre message
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                className="flex flex-col gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-1">
                  <h3 className="text-xl font-bold text-white">
                    Envoie-moi un message
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Tous les champs sont requis.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field
                    label="Nom complet"
                    id="name"
                    placeholder="Foukeng bavel"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                  <Field
                    label="Adresse email"
                    id="email"
                    placeholder="founkengbavel@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    type="email"
                  />
                </div>
                <Field
                  label="Sujet"
                  id="subject"
                  placeholder="Mission freelance / Question"
                  value={form.subject}
                  onChange={handleChange}
                  error={errors.subject}
                />
                <Field
                  label="Message"
                  id="message"
                  placeholder="Décris ton projet…"
                  value={form.message}
                  onChange={handleChange}
                  error={errors.message}
                  multiline
                />

                <AnimatePresence>
                  {status === "error" && (
                    <motion.p
                      className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <AlertCircle size={14} />
                      Une erreur s'est produite. Réessaie dans un instant.
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className={`relative overflow-hidden flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-cyan-400 text-[#08091a] ${status === "loading" ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                  whileHover={
                    status !== "loading" ? { scale: 1.02, y: -1 } : {}
                  }
                  whileTap={status !== "loading" ? { scale: 0.98 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    aria-hidden
                  >
                    <motion.span
                      className="absolute inset-y-0 w-1/3"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      }}
                      animate={{ left: ["-33%", "133%"] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  </motion.span>

                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Envoi en
                      cours…
                    </>
                  ) : (
                    <>
                      <Send size={15} strokeWidth={2} /> Envoyer le message
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  7. COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────
export default function Contact() {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true });

  return (
    <section
      id="contact"
      className="relative min-h-screen bg-[#08091a] py-28 px-6 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full bg-cyan-500/[0.05] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-500/[0.04] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Titre */}
        <motion.div
          ref={titleRef}
          className="text-center mb-16"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Mail size={14} className="text-cyan-400" />
            <p className="text-[11px] text-cyan-400/70 uppercase tracking-[0.22em]">
              Get in touch
            </p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white">
            Me{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Contacter
            </span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Un projet, une idée, une opportunité — je suis à l'écoute.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>

      {/* Footer */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto mt-20 pt-8 border-t border-white/[0.05] text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-slate-600 text-xs">
          © {new Date().getFullYear()} fkbf — Conçu & développé avec{" "}
          <span className="text-cyan-400/60">Next.js</span> &{" "}
          <span className="text-cyan-400/60">Framer Motion</span>
        </p>
      </motion.div>
    </section>
  );
}
