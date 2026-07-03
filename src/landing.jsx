import { useRef, useEffect, useState } from "react";
import Dither from "./Dither";
import Navbar from "./Navbar";

/* ─── Image imports ────────────────────────────────────────────────
   These must be ES module imports (not string paths) so Vite bundles
   them correctly for production. Adjust the relative paths below if
   your images actually live in a subfolder (e.g. "./assets/svm.png"). */
import svmImg from "./svm.png";
import spamImg from "./spam.png";
import uplcLogoImg from "./images.jpeg";
import finncrunkLogoImg from "./f_logo.png";

/* ─── Theme tokens ─────────────────────────────────────────────────── */
const THEMES = {
  dark: {
    "--bg": "#0e0e0e",
    "--bg-elev": "#161616",
    "--bg-card": "#1c1c1c",
    "--bg-card-2": "#1c1c1c",
    "--bg-navbar": "#0e0e0e",
    "--navbar-fg": "rgba(225,224,204,0.8)",
    "--navbar-fg-hover": "#E1E0CC",
    "--navbar-toggle-fg": "rgba(225,224,204,0.8)",
    "--navbar-toggle-hover-bg": "rgba(255,255,255,0.08)",
    "--bg-hero": "#141414",
    "--bg-highlight-a": "rgba(222,219,200,0.09)",
    "--bg-highlight-b": "rgba(180,170,140,0.06)",
    "--bg-grid": "rgba(225,224,204,0.04)",
    "--bg-highlight-tile-a": "rgba(222,219,200,0.10)",
    "--bg-highlight-tile-b-1": "#1c1c1c",
    "--bg-highlight-tile-b-2": "#141414",
    "--bg-card-radial-a": "rgba(222,219,200,0.10)",
    "--bg-card-radial-b": "rgba(180,170,140,0.06)",
    "--fg": "#E1E0CC",
    "--fg-soft": "#DEDBC8",
    "--fg-muted": "#8a8880",
    "--fg-dim": "#555555",
    "--fg-faint": "rgba(225,224,204,0.8)",
    "--fg-faint-2": "rgba(222,219,200,0.7)",
    "--fg-faint-3": "rgba(225,224,204,0.9)",
    "--fg-faint-4": "rgba(225,224,204,0.8)",
    "--fg-faint-5": "rgba(225,224,204,0.7)",
    "--cta-bg": "#DEDBC8",
    "--cta-fg": "#0e0e0e",
    "--cta-circle-bg": "#0e0e0e",
    "--cta-circle-fg": "#DEDBC8",
    "--border-subtle": "#272727",
    "--noise-opacity": "0.12",
    "--noise-overlay-opacity": "0.6",
    "--noise-mix": "overlay",
    "--hero-gradient": "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)",
    "--hero-card-bg-1": "#111111",
    "--hero-card-bg-2": "#181818",
    "--hero-card-bg-3": "#111111",
    "--stack-pill-bg": "#242424",
    "--stack-pill-border": "#303030",
    "--stack-pill-fg": "#8a8880",
    "--footer-btn-bg": "#242424",
    "--footer-btn-border": "#333333",
    "--footer-btn-fg": "rgba(222,219,200,0.75)",
    "--footer-btn-hover-bg": "#2e2e2e",
  },
  light: {
    "--bg": "#F4F1E8",
    "--bg-elev": "#EBE6D6",
    "--bg-card": "#E8E3D5",
    "--bg-card-2": "#E8E3D5",
    "--bg-navbar": "#1A1A1A",
    "--navbar-fg": "rgba(225,224,204,0.85)",
    "--navbar-fg-hover": "#F4F1E8",
    "--navbar-toggle-fg": "rgba(225,224,204,0.85)",
    "--navbar-toggle-hover-bg": "rgba(255,255,255,0.10)",
    "--bg-hero": "#E8E3D2",
    "--bg-highlight-a": "rgba(60,55,40,0.06)",
    "--bg-highlight-b": "rgba(60,55,40,0.04)",
    "--bg-grid": "rgba(40,35,25,0.06)",
    "--bg-highlight-tile-a": "rgba(60,55,40,0.08)",
    "--bg-highlight-tile-b-1": "#E8E3D5",
    "--bg-highlight-tile-b-2": "#DDD8C8",
    "--bg-card-radial-a": "rgba(60,55,40,0.06)",
    "--bg-card-radial-b": "rgba(60,55,40,0.04)",
    "--fg": "#1A1A1A",
    "--fg-soft": "#3A3528",
    "--fg-muted": "#5A5448",
    "--fg-dim": "#8A8478",
    "--fg-faint": "rgba(40,35,25,0.75)",
    "--fg-faint-2": "rgba(40,35,25,0.7)",
    "--fg-faint-3": "rgba(40,35,25,0.65)",
    "--fg-faint-4": "rgba(40,35,25,0.55)",
    "--fg-faint-5": "rgba(40,35,25,0.45)",
    "--cta-bg": "#1A1A1A",
    "--cta-fg": "#F4F1E8",
    "--cta-circle-bg": "#F4F1E8",
    "--cta-circle-fg": "#1A1A1A",
    "--border-subtle": "#CCC7B5",
    "--noise-opacity": "0.10",
    "--noise-overlay-opacity": "0.35",
    "--noise-mix": "multiply",
    "--hero-gradient": "linear-gradient(to bottom, rgba(244,241,232,0.1) 0%, transparent 40%, rgba(244,241,232,0.55) 100%)",
    "--hero-card-bg-1": "#EAE4D2",
    "--hero-card-bg-2": "#F2EDDC",
    "--hero-card-bg-3": "#EAE4D2",
    "--stack-pill-bg": "#DDD8C8",
    "--stack-pill-border": "#CCC7B5",
    "--stack-pill-fg": "#5A5448",
    "--footer-btn-bg": "#1A1A1A",
    "--footer-btn-border": "#1A1A1A",
    "--footer-btn-fg": "#F4F1E8",
    "--footer-btn-hover-bg": "#333333",
  },
};

function applyTheme(name) {
  const tokens = THEMES[name] || THEMES.dark;
  const root = document.documentElement;
  root.setAttribute("data-theme", name);
  for (const [k, v] of Object.entries(tokens)) {
    root.style.setProperty(k, v);
  }
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = window.localStorage.getItem("portfolio-theme");
    if (saved === "dark" || saved === "light") return saved;
    return "dark";
  });

  useEffect(() => {
    applyTheme(theme);
    try { window.localStorage.setItem("portfolio-theme", theme); } catch {}
  }, [theme]);

  useEffect(() => {
    applyTheme(theme);
  }, []);

  const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"));
  return [theme, toggle];
}

/* ─── Layout constants ───────────────────────────────────────────────── */
const MAX_W = 1100;
const SIDE_PAD = "clamp(24px, 5vw, 80px)";

/* ─── Inline styles & Google Fonts ─────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Instrument+Serif:ital@1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body, #root {
    background: var(--bg);
    color: var(--fg);
    font-family: 'Almarai', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow-x: hidden;
    transition: background 0.4s ease, color 0.4s ease;
  }

  .font-serif-italic {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
  }

  .noise-overlay {
    position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: var(--noise-overlay-opacity);
    mix-blend-mode: var(--noise-mix);
  }

  .bg-noise {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  }

  .word-up { display: inline-block; }
  .card-in {}
  .fade-up {}

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--fg-dim); border-radius: 2px; }

  /* Reveal-on-scroll */
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: opacity, transform;
  }
  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-left { transform: translateX(-24px); }
  .reveal-left.is-visible { transform: translateX(0); }
  .reveal-right { transform: translateX(24px); }
  .reveal-right.is-visible { transform: translateX(0); }
  .reveal-scale { transform: scale(0.96); }
  .reveal-scale.is-visible { transform: scale(1); }

  /* Word-by-word reveal inside paragraphs */
  .word-reveal {
    display: inline-block;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.35s ease-out, transform 0.35s ease-out;
  }
  .word-reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Respect users who don't want motion */
  @media (prefers-reduced-motion: reduce) {
    .reveal, .reveal-left, .reveal-right, .reveal-scale, .word-reveal {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }

  /* Projects grid: 2 cols on tablet+, 1 col on phones */
  .projects-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  @media (max-width: 640px) {
    .projects-grid { grid-template-columns: 1fr !important; }
  }

  .nav-link { transition: color 0.2s; }
  nav .nav-link:hover { color: var(--navbar-fg-hover) !important; }
  .nav-link:hover { color: var(--fg) !important; }
  .cta-btn { transition: gap 0.2s, filter 0.2s; }
  .cta-btn:hover { filter: brightness(1.08); }
  .cta-btn:hover .cta-circle { transform: scale(1.1); }
  .cta-circle { transition: transform 0.2s; }
  .learn-more { transition: opacity 0.2s; }
  .learn-more:hover { opacity: 0.7; }

  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: transparent;
    color: var(--navbar-toggle-fg);
    transition: color 0.2s, background 0.2s, transform 0.2s;
  }
  .theme-toggle:hover {
    color: var(--navbar-fg-hover);
    background: var(--navbar-toggle-hover-bg);
    transform: rotate(15deg);
  }
  .theme-toggle:not(.theme-toggle--navbar):hover {
    color: var(--fg);
    background: rgba(0,0,0,0.06);
  }
  [data-theme="dark"] .theme-toggle:not(.theme-toggle--navbar):hover {
    background: rgba(255,255,255,0.06);
  }

  /* Stack pills */
  .stack-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-family: 'Almarai', sans-serif;
    background: var(--stack-pill-bg);
    border: 1px solid var(--stack-pill-border);
    color: var(--stack-pill-fg);
    transition: background 0.3s, border-color 0.3s, color 0.3s;
    white-space: nowrap;
  }

  /* Footer link buttons */
  .footer-link-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 13px;
    font-family: 'Almarai', sans-serif;
    background: var(--footer-btn-bg);
    border: 1px solid var(--footer-btn-border);
    color: var(--footer-btn-fg);
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .footer-link-btn:hover {
    background: var(--footer-btn-hover-bg);
    color: var(--fg);
  }

  /* Light-mode footer buttons: warm white → pure white on hover */
  [data-theme="light"] .footer-link-btn:hover {
    color: #ffffff;
    background: var(--footer-btn-hover-bg);
  }

  /* Project card source/website buttons */
  .proj-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-family: 'Almarai', sans-serif;
    background: transparent;
    border: 1px solid var(--stack-pill-border);
    color: var(--fg-muted);
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .proj-btn:hover {
    background: var(--stack-pill-bg);
    color: var(--fg);
  }
  .proj-btn-primary {
    background: var(--cta-bg);
    color: var(--cta-fg);
    border-color: transparent;
  }
  .proj-btn-primary:hover {
    background: var(--cta-bg);
    color: var(--cta-fg);
    filter: brightness(1.08);
  }

  /* ─── About card — trim padding + heading so the card feels compact ─ */
  .about-card {
    padding: clamp(28px, 4.5vw, 56px) clamp(20px, 4vw, 48px) !important;
    border-radius: 20px !important;
  }
  .about-card > div[style*="marginBottom: 36"] {
    margin-bottom: 24px !important;
  }
  .about-card > div[style*="fontSize: clamp(24px"] {
    font-size: clamp(20px, 3.4vw, 44px) !important;
    line-height: 1.12 !important;
    margin-bottom: 32px !important;
  }

  /* ─── Mobile (≤ 640px) ─────────────────────────────────────────── */
  @media (max-width: 640px) {
    /* Hero: stack the name above the description + CTA, give them room */
    .hero-bottom {
      grid-template-columns: 1fr !important;
      align-items: flex-end !important;
      gap: 16px !important;
      padding: 0 18px 24px !important;
    }
    .hero-bottom h1 {
      font-size: clamp(96px, 28vw, 200px) !important;
      line-height: 0.85 !important;
    }
    .hero-bottom .hero-meta {
      max-width: 100% !important;
      gap: 14px !important;
      padding-bottom: 0 !important;
    }
    .hero-bottom .hero-meta p {
      font-size: 13px !important;
      line-height: 1.45 !important;
    }

    /* Experience card: chevron on its own row top-right, date moves below company */
    .exp-card-header {
      padding: 16px 16px !important;
      gap: 12px !important;
    }
    .exp-card-meta {
      align-items: flex-start !important;
      flex-direction: column !important;
      gap: 6px !important;
    }
    .exp-card-date {
      font-size: 11px !important;
    }
    .exp-card-details {
      margin: 0 16px 16px 60px !important;
      padding-left: 14px !important;
    }
    .exp-card-chevron {
      align-self: flex-start !important;
    }
  }
`;

/* ─── useInView hook ────────────────────────────────────────────────── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); if (options.once) obs.disconnect(); }
    }, { rootMargin: options.margin || "0px", threshold: options.threshold || 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─── useScrollProgress hook ─────────────────────────────────────────── */
function useScrollProgress(start = 0.8, end = 0.2) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const topFrac  = 1 - rect.top  / vh;
      const t = Math.min(1, Math.max(0, (topFrac - (1 - start)) / (start - end)));
      setProgress(t);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [start, end]);
  return [ref, progress];
}

/* ─── WordsPullUp ───────────────────────────────────────────────────── */
function WordsPullUp({ text, className = "", showAsterisk = false, baseDelay = 0 }) {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: "inline" }}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <span key={i} style={{ display: "inline-block", marginRight: "0.22em" }}>
            {isLast && showAsterisk ? (
              <>
                {word.slice(0, -1)}
                <span style={{ position: "relative" }}>
                  {word[word.length - 1]}
                  <sup style={{ position: "absolute", top: "0.65em", right: "-0.3em", fontSize: "0.31em", lineHeight: 1 }}>*</sup>
                </span>
              </>
            ) : word}
          </span>
        );
      })}
    </span>
  );
}

/* ─── AnimatedParagraph (words reveal on scroll) ──────────────────── */
function AnimatedParagraph({ text }) {
  const ref = useRef(null);
  const words = text.split(/\s+/);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            el.querySelectorAll(".word-reveal").forEach((w, i) => {
              w.style.transitionDelay = `${i * 25}ms`;
              w.classList.add("is-visible");
            });
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <p ref={ref} style={{ color: "var(--fg-soft)", fontSize: "clamp(12px, 1.4vw, 16px)", lineHeight: 1.7, maxWidth: 720, margin: "0 auto" }}>
      {words.map((w, i) => (
        <span key={i} className="word-reveal" style={{ marginRight: "0.28em" }}>{w}</span>
      ))}
    </p>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────── */
function ArrowRight({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
function Check({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function SunIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  );
}
function MoonIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}
function ExternalLink({ size = 12, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}
function GithubIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}
function LinkedInIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function MailIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

/* ─── Theme toggle button ───────────────────────────────────────────── */
function ThemeToggle({ theme, onToggle, variant = "default" }) {
  const styleOverride = variant === "navbar" ? undefined : { color: "var(--fg-faint)" };
  const hoverClass = variant === "navbar" ? "theme-toggle theme-toggle--navbar" : "theme-toggle";
  return (
    <button
      className={hoverClass}
      onClick={onToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      style={styleOverride}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

/* ─── Hero background ───────────────────────────────────────────────── */
function HeroPlaceholderBg() {
  return (
    <>
      <div style={{
        position: "absolute", inset: 0,
        background:
          "radial-gradient(circle at 20% 30%, var(--bg-highlight-a) 0%, transparent 45%)," +
          "radial-gradient(circle at 80% 70%, var(--bg-highlight-b) 0%, transparent 50%)," +
          "linear-gradient(135deg, var(--hero-card-bg-1) 0%, var(--hero-card-bg-2) 50%, var(--hero-card-bg-3) 100%)",
        transition: "background 0.4s ease",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background:
          "radial-gradient(ellipse 60% 50% at 85% 10%, rgba(222,219,200,0.07) 0%, transparent 70%)," +
          "radial-gradient(ellipse 40% 35% at 15% 85%, rgba(180,165,120,0.05) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(var(--bg-grid) 1px, transparent 1px)," +
          "linear-gradient(90deg, var(--bg-grid) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        opacity: 0.6,
      }} />
    </>
  );
}

/* ─── About heading ─────────────────────────────────────────────────── */
function AboutHeading() {
  const segments = [
    { text: "I am Anula Mishra,", italic: false },
    { text: "building things that matter.", italic: true },
    { text: "I craft ML Models, full-stack apps, and tools that ship.", italic: false },
  ];
  const allWords = segments.flatMap(seg =>
    seg.text.trim().split(/\s+/).map(w => ({ word: w, italic: seg.italic }))
  );
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.querySelectorAll(".word-reveal").forEach((w, i) => {
              w.style.transitionDelay = `${i * 35}ms`;
              w.classList.add("is-visible");
            });
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      display: "flex", flexWrap: "wrap", justifyContent: "center",
      gap: "0 0.22em",
      fontSize: "clamp(24px, 4.5vw, 64px)", lineHeight: 1.1,
      color: "var(--fg)", maxWidth: MAX_W, margin: "0 auto 48px",
    }}>
      {allWords.map((item, i) => (
        <span
          key={i}
          className={`word-reveal ${item.italic ? "font-serif-italic" : ""}`}
          style={{ display: "inline-block", marginRight: "0.22em", paddingBottom: item.italic ? "0.06em" : 0 }}
        >
          {item.word}
        </span>
      ))}
    </div>
  );
}

/* ─── Section header ────────────────────────────────────────────────── */
function SectionHeader({ line1, line2, line1Color = "var(--fg-soft)", line2Color = "var(--fg-muted)" }) {
  const [ref, inView] = useInView({ once: true, margin: "-60px" });
  const renderLine = (words, color, baseDelay) => (
    <div style={{ fontSize: "clamp(18px, 2.8vw, 36px)", fontWeight: 400, color, lineHeight: 1.2, textAlign: "center", marginBottom: 6 }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.22em" }}>
          <span
            className="word-up"
            style={{
              display: "inline-block",
              animationDelay: inView ? `${baseDelay + i * 0.08}s` : "9999s",
              animationPlayState: inView ? "running" : "paused",
              opacity: inView ? undefined : 0,
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: 52 }}>
      {renderLine(line1, line1Color, 0)}
      {renderLine(line2, line2Color, 0.4)}
    </div>
  );
}

/* ─── Section wrapper ───────────────────────────────────────────────── */
function Section({ children, top = "72px", bottom, minHeight = "auto" }) {
  const padBottom = bottom ?? top;
  return (
    <section style={{ minHeight, background: "var(--bg)", padding: `${top} ${SIDE_PAD} ${padBottom} ${SIDE_PAD}`, position: "relative", transition: "background 0.4s ease" }}>
      <div className="bg-noise" style={{ position: "absolute", inset: 0, opacity: "var(--noise-opacity)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ maxWidth: MAX_W, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
}

/* ─── Plain bullet list (Certifications / Achievements) ─────────────── */
function TextListSection({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            background: "var(--bg-card)",
            borderRadius: 14,
            padding: "16px 20px",
            fontSize: 13,
            color: "var(--fg-soft)",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            lineHeight: 1.55,
            border: "1px solid var(--border-subtle)",
            transition: "background 0.4s ease",
          }}
        >
          <span style={{ color: "var(--fg-dim)", marginTop: 2, flexShrink: 0 }}><Check size={13} color="var(--fg-dim)" /></span>
          <span>{it}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Tech SVG logos ─────────────────────────────────────────────────── */
function TechLogo({ name, size = 14 }) {
  const s = size;
  switch (name) {
    case "Spring Boot":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M20.205 16.392c-2.469 3.289-7.741 2.861-11.973 2.461-2.29-.225-4.225-.639-5.35-1.013-.259-.086-.472.097-.374.35.547 1.394 2.179 2.589 4.692 3.072 3.909.737 8.437-.2 10.481-2.386.187-.2.068-.484-.201-.484-.425 0-.916.094-1.345.27-.187.076-.33-.065-.25-.22.494-.96 1.554-1.783 2.77-2.05.176-.038.27-.22.17-.369a.567.567 0 0 0-.62-.161zm.356-5.814c.11-.437.148-.89.1-1.343-.42-3.944-4.476-4.72-6.81-4.72-2.334 0-4.29.723-5.56 2.026-.895.926-1.4 2.14-1.4 3.437 0 2.714 2.168 4.95 4.875 4.95 2.706 0 4.875-2.236 4.875-4.95 0-.655-.129-1.281-.366-1.85-.117-.279.108-.558.394-.451.56.205 1.093.53 1.537.987.16.164.394.13.494-.076.273-.563.434-1.15.5-1.724.033-.29.339-.432.6-.28.782.45 1.369 1.19 1.761 2.094z" fill="#6DB33F"/>
        </svg>
      );
    case "React":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="2.05" fill="#61DAFB"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)"/>
        </svg>
      );
    case "PostgreSQL":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M17.128 0a10.134 10.134 0 0 0-2.755.403l-.063.02A10.922 10.922 0 0 0 12.6.258C11.422.238 10.41.524 9.594 1 8.79.721 7.122.24 5.364.336 4.14.403 2.804.775 1.814 1.82.824 2.865.305 4.48.415 6.682c.03.607.158 1.202.295 1.732.137.53.29 1.05.44 1.504.302.908.967 1.486 1.664 1.575.49.062.98-.094 1.388-.454.255.023.51.04.77.048a4.51 4.51 0 0 0 1.683 1.504c-.024.022-.048.044-.07.068-.459.505-.706 1.2-.706 1.977 0 .842.28 1.614.744 2.162.464.549 1.108.842 1.85.842.55 0 1.05-.168 1.476-.458.426.29.926.458 1.476.458.742 0 1.386-.293 1.85-.842.464-.548.744-1.32.744-2.162 0-.777-.247-1.472-.706-1.977a2.417 2.417 0 0 0-.07-.068 4.51 4.51 0 0 0 1.683-1.504c.26-.008.515-.025.77-.048.407.36.898.516 1.388.454.697-.089 1.362-.667 1.664-1.575.15-.454.303-.974.44-1.504.137-.53.265-1.125.295-1.732.11-2.202-.41-3.817-1.4-4.862C20.195.775 18.86.403 17.636.336A8.976 8.976 0 0 0 17.128 0z" fill="#336791"/>
        </svg>
      );
    case "Python":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.031v-2.869s-.109-3.404 3.347-3.404h5.765s3.24.052 3.24-3.13V3.19S18.304 0 11.914 0zm-3.2 1.848a1.044 1.044 0 1 1 0 2.089 1.044 1.044 0 0 1 0-2.089z" fill="#3776AB"/>
          <path d="M12.087 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.12S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.031v2.869s.109 3.404-3.347 3.404H9.454s-3.24-.052-3.24 3.13V20.81S5.696 24 12.087 24zm3.2-1.848a1.044 1.044 0 1 1 0-2.089 1.044 1.044 0 0 1 0 2.089z" fill="#FFD43B"/>
        </svg>
      );
    case "FastAPI":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#009688"/>
          <path d="M12.593 4.8L7.2 13.333h4.267L10.4 19.2l6.4-8.533h-4.267z" fill="white"/>
        </svg>
      );
    case "Java":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0 .001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-.897.4c-3.619.952-10.615.508-8.603-.473 1.724-.826 1.656-.8 1.656-.8M17.127 17.332c3.678-1.912 1.977-3.748.79-3.499-.291.062-.42.116-.42.116s.108-.169.314-.242c2.343-.824 4.147 2.429-.757 3.717 0-.001.056-.049.073-.092M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c3.527.226 8.938-.125 9.069-1.792 0 0-.246.633-2.916 1.134-3.001.569-6.707.502-8.903.138 0-.001.449.372 2.75.52" fill="#ED8B00"/>
        </svg>
      );
    case "JWT":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M10.2 0h3.6v7.377L12 8.903 10.2 7.377zM10.2 16.623V24h3.6v-7.377L12 15.097zM13.8 9.3l6.189-4.485 2.223 3.044-6.09 4.423zM1.789 7.859l2.223-3.044L10.2 9.3l-2.323 2.982zM19.989 16.141l-2.223 3.044L11.577 14.7l2.323-2.982zM4.234 19.185l-2.223-3.044L8.1 11.718l2.323 2.982z" fill="#FBB03B"/>
        </svg>
      );
    case "FAISS":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#FF6B35"/>
          <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="monospace">FAISS</text>
        </svg>
      );
    case "Anthropic API":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#C97B4B"/>
          <path d="M14.2 6l3.8 12h-2.5l-.8-2.6H9.3L8.5 18H6L9.8 6h4.4zm-1.1 3.2L11.5 13h3.2L13.1 9.2z" fill="white"/>
        </svg>
      );
    case "MinIO":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#C72C48"/>
          <path d="M5 17V7l4 5 3-3.5 3 3.5 4-5v10H5z" fill="white"/>
        </svg>
      );
    case "Apache PDFBox":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#CC2233"/>
          <path d="M7 6h6l3 3v9H7V6zm5.5 0v3.5H16" stroke="white" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
          <path d="M10 13h4M10 15.5h4" stroke="white" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      );
    case "C":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="3" fill="#283593"/>
          <text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" fontFamily="serif" fontStyle="italic">C</text>
        </svg>
      );
    case "C++":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="3" fill="#00599C"/>
          <text x="9" y="16.5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="serif" fontStyle="italic">C</text>
          <text x="16" y="16.5" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="sans-serif">++</text>
        </svg>
      );
    case "SQL":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="6" rx="8" ry="3" fill="#4479A1"/>
          <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="#4479A1" strokeWidth="1.6" fill="none"/>
          <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="#4479A1" strokeWidth="1.6" fill="none"/>
        </svg>
      );
    case "React.js":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="2.05" fill="#61DAFB"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)"/>
        </svg>
      );
    case "Node.js":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2z" fill="#339933"/>
          <text x="12" y="15.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="white" fontFamily="sans-serif">JS</text>
        </svg>
      );
    case "Express.js":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="3" fill="#000"/>
          <text x="12" y="14.5" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="white" fontFamily="sans-serif">Ex</text>
          <text x="12" y="19" textAnchor="middle" fontSize="3.5" fill="#aaa" fontFamily="sans-serif">express</text>
        </svg>
      );
    case "JavaScript":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="3" fill="#F7DF1E"/>
          <text x="12" y="17" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#000" fontFamily="serif">JS</text>
        </svg>
      );
    case "HTML":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M4 3l1.5 17L12 22l6.5-2L20 3H4z" fill="#E44D26"/>
          <path d="M12 4.5v16l5-1.4L18.5 5H12z" fill="#F16529"/>
          <path d="M6.5 8h11l-.4 4.5H8.4l.2 2.5h8l-.5 5L12 21l-4.5-1.2L7 14h2l.1 1.5L12 16l3-.4.3-3.1H6.9L6.5 8z" fill="#EBEBEB"/>
        </svg>
      );
    case "CSS":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M4 3l1.5 17L12 22l6.5-2L20 3H4z" fill="#1572B6"/>
          <path d="M12 4.5v16l5-1.4L18.5 5H12z" fill="#33A9DC"/>
          <path d="M7 8h10l-.3 3.5H9.5l.2 2h6.5l-.5 4.5L12 19l-3.8-1 .3-3.5h2l.1 1.2L12 16.2l2-.5.2-2.2H7.6L7 8z" fill="#EBEBEB"/>
        </svg>
      );
    case "jQuery":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="3" fill="#0769AD"/>
          <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="sans-serif">jQ</text>
        </svg>
      );
    case "Bootstrap":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#7952B3"/>
          <path d="M6 6h6.5c2 0 3.5 1 3.5 2.7 0 1.2-.6 2-1.5 2.4 1.3.4 2 1.4 2 2.8 0 2.1-1.7 3.1-3.9 3.1H6V6zm2.5 4.5h3.7c1 0 1.6-.5 1.6-1.4 0-.8-.6-1.3-1.6-1.3H8.5v2.7zm0 4.7h4c1.1 0 1.7-.6 1.7-1.5s-.6-1.4-1.7-1.4h-4v2.9z" fill="white"/>
        </svg>
      );
    case "REST APIs":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#009688"/>
          <path d="M8 8l-2 4 2 4M16 8l2 4-2 4M14 6l-4 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      );
    case "Git":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M21.62 11.108L12.892 2.38a2.05 2.05 0 0 0-2.9 0L9.83 2.54l3.66 3.66a2.43 2.43 0 0 1 3.08 3.08l3.53 3.53a2.05 2.05 0 0 0 1.52-1.71z" fill="#F05133"/>
          <path d="M21.62 11.108L12.892 2.38a2.05 2.05 0 0 0-2.9 0L9.83 2.54l3.66 3.66a2.43 2.43 0 0 1 3.08 3.08l3.53 3.53a2.05 2.05 0 0 0 1.52-1.71z" fill="#F05133" opacity=".7"/>
          <path d="M14.91 14.91a2.43 2.43 0 0 1-3.44 0 2.43 2.43 0 0 1 0-3.44 2.43 2.43 0 0 1 3.44 0 2.43 2.43 0 0 1 0 3.44z" fill="#F05133"/>
        </svg>
      );
    case "GitHub":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="#181717">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      );
    case "Postman":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FF6C37"/>
          <circle cx="12" cy="11" r="3.5" fill="white"/>
          <circle cx="12" cy="11" r="1.5" fill="#FF6C37"/>
          <circle cx="17.5" cy="17.5" r="1.5" fill="white"/>
        </svg>
      );
    case "Linux":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="8" rx="5" ry="6" fill="#000"/>
          <path d="M7 14c-1.5 1.5-3 4-3 6 0 1 1 2 3 2h10c2 0 3-1 3-2 0-2-1.5-4.5-3-6-1 1-3 1.5-5 1.5s-4-.5-5-1.5z" fill="#000"/>
          <circle cx="10" cy="7" r="0.9" fill="white"/>
          <circle cx="14" cy="7" r="0.9" fill="white"/>
          <path d="M11 10c.5.5 1.5.5 2 0" stroke="white" strokeWidth=".7" fill="none" strokeLinecap="round"/>
          <ellipse cx="12" cy="20" rx="1" ry="1.5" fill="#000"/>
        </svg>
      );
    case "TensorFlow":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M9.5 17.5L4 22l5-2 1.5-2.5zM11 3v6L4 22l1.5-1L17 9.5l-1-1L11 3z" fill="#FF6F00"/>
          <path d="M11 3v6l-7 13 1.5-1L17 9.5 11 3z" fill="#FFA726"/>
        </svg>
      );
    case "Keras":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="3" fill="#D00000"/>
          <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="sans-serif">K</text>
        </svg>
      );
    case "CNN":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="3" fill="#E91E63"/>
          <text x="12" y="15.5" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="white" fontFamily="sans-serif">CNN</text>
        </svg>
      );
    case "SVM":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="3" fill="#9C27B0"/>
          <text x="12" y="15.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" fontFamily="sans-serif">SVM</text>
        </svg>
      );
    case "Scikit-learn":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#F89939"/>
          <path d="M8 8l4 4 4-4M8 16l4-4 4 4" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "NLP":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#4285F4"/>
          <text x="12" y="15.5" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="white" fontFamily="sans-serif">NLP</text>
        </svg>
      );
    case "Streamlit":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="3" fill="#FF4B4B"/>
          <path d="M5 13c2-1 4 0 7-2s4-3 7-3" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <circle cx="6.5" cy="12.5" r="1.2" fill="white"/>
        </svg>
      );
    case "Figma":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" fill="#0ACF83"/>
          <path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" fill="#A259FF"/>
          <path d="M4 4c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" fill="#F24E1E"/>
          <circle cx="16" cy="4" r="4" fill="#FF7262"/>
          <circle cx="16" cy="12" r="4" fill="#1ABCFE"/>
        </svg>
      );
    case "AI":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="3" fill="#000"/>
          <path d="M12 4l1.8 5.2H19l-4.2 3.1 1.6 5.1L12 14.5 7.6 17.4l1.6-5.1L5 9.2h5.2L12 4z" fill="#fff"/>
        </svg>
      );
    case "TypeScript":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="3" fill="#3178C6"/>
          <text x="12" y="17" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" fontFamily="sans-serif">TS</text>
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Tech emoji fallback ────────────────────────────────────────────── */
const TECH_EMOJI = {
  "C": "🔧", "C++": "🔧", "Java": "☕", "Python": "🐍", "SQL": "🗄️",
  "React.js": "⚛️", "Node.js": "🟢", "Express.js": "🚂", "JavaScript": "✨",
  "HTML": "📄", "CSS": "🎨", "jQuery": "💲", "Bootstrap": "🅱️",
  "REST APIs": "🔗", "Git": "🔀", "GitHub": "🐙", "Postman": "📮", "Linux": "🐧",
  "TensorFlow": "🧠", "Keras": "🧬", "CNN": "👁️", "SVM": "📐",
  "Scikit-learn": "🔬", "NLP": "💬", "Streamlit": "🌊",
  "Spring Boot": "🍃", "React": "⚛️", "PostgreSQL": "🐘", "FastAPI": "⚡",
  "JWT": "🔑", "FAISS": "🔍", "Anthropic API": "🤖", "MinIO": "🪣",
  "Apache PDFBox": "📑", "AI": "🤖", "TypeScript": "🔷", "Figma": "🎨",
};

/* ─── Stack pill row ─────────────────────────────────────────────────── */
function StackRow({ techs }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const pills = Array.from(el.querySelectorAll(".stack-pill"));
    pills.forEach((p) => {
      p.style.opacity = "0";
      p.style.transform = "translateY(14px) scale(0.92)";
      p.style.transition = `opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)`;
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pills.forEach((p, i) => {
              const delay = i * 35; // stagger
              setTimeout(() => {
                p.style.opacity = "1";
                p.style.transform = "translateY(0) scale(1)";
              }, delay);
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ margin: 0 }}>
      <Reveal>
        <div style={{
          fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.09em",
          textTransform: "uppercase", marginBottom: 14, fontFamily: "'Almarai', sans-serif"
        }}>
          Stack
        </div>
      </Reveal>
      <div ref={containerRef} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {techs.map((tech, i) => {
          const logo = TechLogo({ name: tech, size: 14 });
          const emoji = TECH_EMOJI[tech];
          return (
            <span key={i} className="stack-pill" style={{ fontSize: 13, padding: "8px 14px", gap: 7 }}>
              {logo || (emoji && <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>)}
              {tech}
            </span>
          );
        })}
      </div>
    </div>
  );
}



/* ─── Project card ──────────────────────────────────────────────────── */
function ProjectCard({ image, imagePlaceholderLabel, title, description, stack, websiteUrl, sourceUrl, delay }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: 18,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        transition: "background 0.4s ease",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Image / placeholder */}
      <div style={{
        width: "100%", aspectRatio: "16/10",
        background: "var(--bg-highlight-tile-b-2)",
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {image ? (
          <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "radial-gradient(circle at 40% 40%, var(--bg-highlight-tile-a) 0%, transparent 60%), var(--bg-highlight-tile-b-2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 13, color: "var(--fg-dim)", fontFamily: "'Almarai', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {imagePlaceholderLabel || title}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "24px 24px 22px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div style={{ fontSize: 19, color: "var(--fg)", fontWeight: 600, lineHeight: 1.25 }}>{title}</div>
        <p style={{ fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.6, flex: 1 }}>{description}</p>

        {/* Stack tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {stack.map((t, i) => (
            <span key={i} style={{
              fontSize: 11, padding: "3px 9px", borderRadius: 999,
              background: "var(--stack-pill-bg)", border: "1px solid var(--stack-pill-border)",
              color: "var(--stack-pill-fg)", fontFamily: "'Almarai', sans-serif",
              transition: "background 0.3s, color 0.3s",
            }}>{t}</span>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {websiteUrl ? (
            <a href={websiteUrl} target="_blank" rel="noreferrer" className="proj-btn proj-btn-primary">
              Website <ExternalLink size={11} color="currentColor" />
            </a>
          ) : (
            <span className="proj-btn" style={{ opacity: 0.4, cursor: "not-allowed" }}>Website</span>
          )}
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noreferrer" className="proj-btn">
              <GithubIcon size={12} color="currentColor" /> Source
            </a>
          ) : (
            <span className="proj-btn" style={{ opacity: 0.4, cursor: "not-allowed" }}>
              <GithubIcon size={12} color="currentColor" /> Source
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function UPLCLogo({ size = 42 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--bg-elev)", // or "#fff"
        border: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <img
        src={uplcLogoImg}
        alt="UPLC Logo"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // fills the circle
        }}
      />
    </div>
  );
}

function FinncrunkLogo({ size = 42 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",      // Makes the image circular
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <img
        src={finncrunkLogoImg}
        alt="Finncrunk Logo"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",    // Fill the circle
        }}
      />
    </div>
  );
}

/* ─── Experience accordion card with logo ────────────────────────────── */
function ExpCard({ logo, company, role, dates, details }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: 16,
      border: "1px solid var(--border-subtle)",
      overflow: "hidden",
      transition: "background 0.4s ease, border-color 0.4s ease",
    }}>
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="exp-card-header"
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "18px 20px",
          display: "flex", alignItems: "center", gap: 14,
          textAlign: "left",
        }}
      >
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>{logo}</div>

        {/* Company + role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="exp-card-meta" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, color: "var(--fg)", fontWeight: 600, fontFamily: "'Almarai', sans-serif" }}>
              {company}
            </span>
            <span className="exp-card-date" style={{ fontSize: 12, color: "var(--fg-dim)", fontFamily: "'Almarai', sans-serif", whiteSpace: "nowrap" }}>
              {dates}
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--fg-soft)", marginTop: 2, fontFamily: "'Almarai', sans-serif" }}>
            {role}
          </div>
        </div>

        {/* Chevron */}
        <span className="exp-card-chevron" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 26, height: 26, borderRadius: "50%",
          border: "1px solid var(--border-subtle)",
          color: "var(--fg-dim)",
          transition: "transform 0.3s ease",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          flexShrink: 0,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>

      {/* Expandable details — left-border accent */}
      <div style={{
        maxHeight: open ? "800px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div className="exp-card-details" style={{
          margin: "0 20px 18px 74px",
          paddingLeft: 16,
          borderLeft: "2px solid var(--border-subtle)",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          {details.map((d, i) => (
            <div key={i} style={{ fontSize: 13, color: "var(--fg-soft)", lineHeight: 1.65 }}>
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Experience section ─────────────────────────────────────────────── */
const STACK = [
  // Languages
  "C", "C++", "Java", "Python", "SQL", "JavaScript",
  // Web & Frameworks
  "React.js", "Node.js", "Express.js", "HTML", "CSS", "jQuery", "Bootstrap", "REST APIs",
  // Tools & Platforms
  "Git", "GitHub", "Postman", "Linux", "Figma",
  // ML & Data
  "TensorFlow", "Keras", "CNN", "SVM", "Scikit-learn", "NLP", "Streamlit",
];

function ExperienceSection() {

  return (
    <div id="experience">
      <div style={{ margin: "0 0 20px" }}>
        <Reveal>
          <div style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "'Almarai', sans-serif" }}>
            Experience
          </div>
        </Reveal>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {/* UPLC — first (most recent, more significant) */}
        <Reveal delay={80}>
          <ExpCard
            logo={<UPLCLogo size={42} />}
            company="U.P. Electronics Corporation Limited (UPLC)"
            role="Software Development Intern · Lucknow, UP"
            dates="June 2026 – July 2026"
            details={[
              "Engineered a full-stack Internal Feedback Management System (FMS) serving 1,000+ employees across departments with JWT auth and role-based access control.",
              "Integrated a sentiment analysis pipeline achieving 95% accuracy on employee feedback data, with a real-time analytics dashboard surfacing trends for management.",
              "Identified and resolved navigation inefficiencies in the OIMS Universal Dashboard used by 500+ employees, delivering a 25% usability improvement.",
            ]}
          />
        </Reveal>

        {/* Finncrunk — second */}
        <Reveal delay={180}>
          <ExpCard
            logo={<FinncrunkLogo size={42} />}
            company="Finncrunk Technologies Private Limited"
            role="Web Development Intern"
            dates="May 2026 – July 2026"
            details={[
              "Built production-grade full-stack web application features using Java, HTML5, CSS3, JavaScript, and Bootstrap, adhering to best coding standards and collaborative version control via Git.",
              "Identified and resolved critical defects across the application lifecycle, improving code quality and ensuring robust, maintainable software delivery.",
            ]}
          />
        </Reveal>
      </div>

      <div id="stack">
        <StackRow techs={STACK} />
      </div>
    </div>
  );
}



/* ─── Reveal-on-scroll hook ─────────────────────────────────────────── */
function useReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px", ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, as: Tag = "div", className = "", style = {}, delay = 0 }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms`, height: "100%", display: "flex", flexDirection: "column", ...style }}
    >
      {children}
    </Tag>
  );
}



/* ─── Projects data ─────────────────────────────────────────────────── */
const PERSONAL_PROJECTS = [
  {
    title: "RealityCheck AI",
    description: "CNN-based deepfake detector — ResNet Transfer Learning, custom Sequential CNN, 90%+ validation accuracy on 10,000+ images. Deployed as a real-time Streamlit web app.",
    stack: ["Python", "TensorFlow", "ResNet", "Streamlit", "CNN"],
    websiteUrl: "https://svm-image-classifier-leth.onrender.com/",
    sourceUrl: "https://github.com/anula-codes/RealityCheck",
    image: svmImg,
    imagePlaceholderLabel: "RealityCheck AI",
  },
  {
    title: "Spam SMS Detector",
    description: "End-to-end NLP pipeline across 5,500+ SMS samples — EDA, TF-IDF, Multinomial Naive Bayes. 97.09% accuracy, 100% precision. Live at spamornot-01.streamlit.app.",
    stack: ["Python", "Scikit-learn", "NLP", "TF-IDF", "Streamlit"],
    websiteUrl: "https://spam-or-not-rdiy.onrender.com/",
    sourceUrl: "https://github.com/anula-codes/Spam_or_not",
    image: spamImg,
    imagePlaceholderLabel: "Spam SMS Detector",
  },
  {
    title: "SpendLens",
    description: "Full-stack AI spend audit tool with an editorial newspaper aesthetic. Next.js frontend, AI-powered spend categorisation and insights dashboard.",
    stack: ["Next.js", "React", "AI", "TypeScript"],
    websiteUrl: null,
    sourceUrl: "https://github.com/anula-codes",
    image:null,
    imagePlaceholderLabel: "SpendLens",
  },
  {
    title: "Secure Chat Application",
    description: "Client–server chat in Python using Socket Programming with XOR cipher encryption, hex encoding, and key-based data integrity validation.",
    stack: ["Python", "Sockets", "Cryptography"],
    websiteUrl: null,
    sourceUrl: "https://github.com/anula-codes",
    // Not under /src/, so this string path is fine IF the file actually lives at public/projects/securechat.png.
    // If it's actually inside src/ somewhere, replace with an import like the others above.
    image: "/projects/securechat.png",
    imagePlaceholderLabel: "Secure Chat",
  },
];

/* ─── Projects section ───────────────────────────────────────────────── */
function ProjectsSection() {
  return (
    <div id="projects">
      <div style={{ margin: "0 0 20px" }}>
        <Reveal>
          <div style={{
            fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.09em",
            textTransform: "uppercase", fontFamily: "'Almarai', sans-serif",
          }}>
            Projects
          </div>
        </Reveal>
      </div>
      <div className="projects-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        alignItems: "stretch",
        gap: 20,
      }}>
        {PERSONAL_PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 120}>
            <ProjectCard {...p} delay={i * 0.1} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────────────── */
export default function App() {
  const [theme, toggleTheme] = useTheme();

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <div style={{ background: "var(--bg)", minHeight: "100vh", transition: "background 0.4s ease" }}>

        {/* HERO */}

        <section style={{ height: "100dvh", padding: "14px" }}>
          <div style={{ height: "100%", borderRadius: "1.5rem", overflow: "hidden", position: "relative", background: "var(--bg-hero)", transition: "background 0.4s ease" }}>
            <HeroPlaceholderBg />
            <div className="noise-overlay" />
            <div style={{ position: "absolute", inset: 0 }}>
  <Dither
    theme={theme}
    disableAnimation={false}
    enableMouseInteraction={true}
    mouseRadius={0.3}
    colorNum={8}
    waveAmplitude={0.3}
    waveFrequency={3}
    waveSpeed={0.05}
    waveColor={theme === "dark" ? [0.56, 0.55, 0.55] : [0.78, 0.74, 0.62]}
    bgColor={theme === "dark" ? [0.08, 0.08, 0.09] : [0.94, 0.93, 0.9]}
  />
</div>
<div className="noise-overlay" />
            <div style={{ position: "absolute", inset: 0, background: "var(--hero-gradient)", pointerEvents: "none" }} />

            {/* Hero content */}
            <div className="hero-bottom" style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              display: "grid", gridTemplateColumns: "2fr 1fr",
              alignItems: "flex-end",
              padding: "0 clamp(16px, 3vw, 32px) clamp(20px, 3vw, 28px)",
              gap: 20, zIndex: 5,
            }}>
              <h1 style={{ fontSize: "clamp(72px, 19vw, 22vw)", fontWeight: 500, lineHeight: 0.85, letterSpacing: "-0.07em", color: "var(--fg)" }}>
                <WordsPullUp text="Anula" baseDelay={0} />
              </h1>
              <div className="hero-meta" style={{ display: "flex", flexDirection: "column", gap: 18, paddingBottom: 6 }}>
                <p style={{ color: "var(--fg-faint-2)", fontSize: "clamp(11px, 1vw, 14px)", lineHeight: 1.3 }}>
                  I approach development with a design-first mindset, focusing on creating intuitive, polished interfaces before bringing them to life through clean, efficient code.
                </p>
                <a href="#projects" className="cta-btn" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "var(--cta-bg)", border: "none", borderRadius: 9999,
                  padding: "8px 8px 8px 20px", cursor: "pointer", alignSelf: "flex-start",
                  animationDelay: "0s", textDecoration: "none",
                  transition: "background 0.4s ease",
                }}>
                  <span style={{ color: "var(--cta-fg)", fontWeight: 500, fontSize: "clamp(12px, 1.1vw, 15px)", fontFamily: "'Almarai', sans-serif", whiteSpace: "nowrap" }}>View projects</span>
                  <span className="cta-circle" style={{ background: "var(--cta-circle-bg)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.4s ease" }}>
                    <ArrowRight size={15} color="var(--cta-circle-fg)" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ background: "var(--bg)", padding: `72px ${SIDE_PAD}`, transition: "background 0.4s ease" }}>
          <div className="about-card" style={{
            background: "var(--bg-elev)", borderRadius: 24,
            padding: "clamp(36px, 6vw, 80px) clamp(20px, 5vw, 64px)",
            maxWidth: MAX_W, margin: "0 auto", textAlign: "center",
            transition: "background 0.4s ease",
          }}>
            <div style={{ fontSize: 11, color: "var(--fg-soft)", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 36, opacity: 0.6, fontFamily: "'Almarai', sans-serif" }}>
              About
            </div>
            <AboutHeading />
            <AnimatedParagraph text="I'm a final-year CS undergrad at KIIT, building full-stack applications with Java, Python, React, and Node.js. As a Software Development Intern, I've engineered systems serving 1,000+ users and shipped AI/ML projects hitting 90%+ accuracy. I care about writing clean, reliable code that actually solves the problem in front of me." />
          </div>
        </section>

        {/* EXPERIENCE */}
        <Section>
          <ExperienceSection />
        </Section>

        {/* PROJECTS */}
        <Section>
          <ProjectsSection />
        </Section>

        {/* CERTIFICATIONS & ACHIEVEMENTS */}
        <Section>
          <div>
            <div style={{ margin: "0 0 8px" }}>
              <Reveal>
                <div style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "'Almarai', sans-serif" }}>
                  Certifications
                </div>
              </Reveal>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10, marginBottom: 40 }}>
              {[
                { emoji: "📜", title: "JavaScript: From Beginner to Expert", sub: "Udemy — Completed" },
                { emoji: "🧠", title: "Mastering Data Structures & Algorithms using C and C++", sub: "Udemy — Completed" },
                { emoji: "🌐", title: "The Complete Full-Stack Web Development Bootcamp", sub: "Udemy — Completed" },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 14,
                    padding: "18px 20px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    transition: "background 0.4s ease",
                  }}>
                    <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.2, marginTop: 1 }}>{item.emoji}</span>
                    <div>
                      <div style={{ fontSize: 14, color: "var(--fg)", fontWeight: 600, lineHeight: 1.35, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "var(--fg-dim)" }}>{item.sub}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div style={{ margin: "0 0 8px" }}>
              <Reveal>
                <div style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "'Almarai', sans-serif" }}>
                  Achievements
                </div>
              </Reveal>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
              {[
                { emoji: "🏆", title: "Smart India Hackathon 2025", body: "Shortlisted in the Internal Hackathon among top 50 teams for an innovative tech solution." },
                { emoji: "📊", title: "Competitive Programming", body: "Solved 250+ problems across multiple platforms demonstrating strong proficiency in Data Structures and Algorithms." },
                { emoji: "🎨", title: "Design Team Lead — GDG KIIT", body: "Led the Design Team of Google Developer Group KIIT; UI/UX & Design teams at GeeksforGeeks KIIT." },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 14,
                    padding: "18px 20px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    transition: "background 0.4s ease",
                  }}>
                    <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.2, marginTop: 1 }}>{item.emoji}</span>
                    <div>
                      <div style={{ fontSize: 14, color: "var(--fg)", fontWeight: 600, lineHeight: 1.35, marginBottom: 4 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--fg-soft)", lineHeight: 1.55 }}>{item.body}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        {/* CONTACT / FOOTER */}
        <footer id="contact" style={{
          background: "var(--bg)",
          borderTop: "1px solid var(--border-subtle)",
          padding: `80px ${SIDE_PAD} 40px`,
          position: "relative",
          overflow: "hidden",
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}>
          {/* Dither background */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Dither
              theme={theme}
              disableAnimation={false}
              enableMouseInteraction={true}
              mouseRadius={0.25}
              colorNum={8}
              waveAmplitude={0.25}
              waveFrequency={2.5}
              waveSpeed={0.04}
              waveColor={theme === "dark" ? [0.56, 0.55, 0.55] : [0.78, 0.74, 0.62]}
              bgColor={theme === "dark" ? [0.08, 0.08, 0.09] : [0.94, 0.93, 0.9]}
            />
          </div>
          <div className="noise-overlay" />
          <div style={{ position: "relative", zIndex: 1, maxWidth: MAX_W, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24, pointerEvents: "none" }}>
            <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20, pointerEvents: "auto" }}>
              <div>
                <span style={{ fontFamily: "'Almarai', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--fg)", letterSpacing: "-0.03em" }}>Anula</span>
                <div style={{ fontSize: 13, color: "var(--fg-faint-3)", marginTop: 6 }}>
                  anulamishra92@gmail.com
                </div>
                <div style={{ fontSize: 13, color: "var(--fg-faint-4)", marginTop: 2 }}>
                  Uttar Pradesh, India
                  
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <a href="https://linkedin.com/in/anula-mishra" target="_blank" rel="noreferrer" className="footer-link-btn">
                  <LinkedInIcon size={14} color="currentColor" />
                  LinkedIn
                </a>
                <a href="https://github.com/anula-codes" target="_blank" rel="noreferrer" className="footer-link-btn">
                  <GithubIcon size={14} color="currentColor" />
                  GitHub
                </a>
                <a href="mailto:anulamishra92@gmail.com" className="footer-link-btn">
                  <MailIcon size={14} color="currentColor" />
                  Email
                </a>
                <a href="/resume.pdf" target="_blank" rel="noreferrer" className="footer-link-btn" style={{ borderColor: "var(--fg-dim)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                  Resume
                </a>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>
            </div>
            </Reveal>
            <Reveal delay={150}>
              <div style={{ fontSize: 12, color: "var(--fg-faint-5)", fontFamily: "'Almarai', sans-serif", pointerEvents: "auto" }}>
                © 2026 Anula Mishra. All rights reserved.
              </div>
            </Reveal>
          </div>
        </footer>
      </div>
    </>
  );
}
