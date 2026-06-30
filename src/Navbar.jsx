import { useEffect, useState, useRef } from "react";

/* ─── Inline SVG icons ─────────────────────────────────────────────── */
function SunIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* ─── Navbar component ─────────────────────────────────────────────── */
const LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ theme, onToggleTheme }) {
  const [activeId, setActiveId] = useState("");
  const observerRef = useRef(null);

  /* IntersectionObserver — highlight the link whose section is in view */
  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    // Reset any prior observer (StrictMode double-mount safety)
    if (observerRef.current) observerRef.current.disconnect();

    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the entry whose top is closest to (but past) the navbar offset
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((s) => obs.observe(s));
    observerRef.current = obs;
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{NAVBAR_CSS}</style>
      <nav className="floating-nav" aria-label="Primary">
        <div className="floating-nav__links">
          {LINKS.map((link) => {
            const id = link.href.slice(1);
            const isActive = activeId === id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link${isActive ? " active" : ""}`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="floating-nav__divider" aria-hidden="true" />

        <button
          type="button"
          className="floating-nav__toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>
    </>
  );
}

/* ─── Scoped styles for the floating pill navbar ───────────────────── */
const NAVBAR_CSS = `
  .floating-nav {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;

    display: flex;
    align-items: center;
    gap: 0;

    padding: 6px 6px 6px 18px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.08);

    background: rgba(18, 18, 18, 0.85);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);

    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);

    font-family: 'Almarai', -apple-system, BlinkMacSystemFont, sans-serif;
    white-space: nowrap;

    /* Stay within the viewport with a small gutter on either side */
    max-width: calc(100vw - 24px);
  }

  .floating-nav__links {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .floating-nav .nav-link {
    font-size: 13px;
    font-weight: 400;
    color: rgba(225, 224, 204, 0.75);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  .floating-nav .nav-link:hover,
  .floating-nav .nav-link.active {
    color: #E1E0CC;
  }

  .floating-nav__divider {
    width: 1px;
    height: 18px;
    background: rgba(255, 255, 255, 0.12);
    margin: 0 6px;
  }

  .floating-nav__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: rgba(225, 224, 204, 0.75);
    cursor: pointer;
    flex-shrink: 0;
    transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
  }
  .floating-nav__toggle:hover {
    color: #E1E0CC;
    background: rgba(255, 255, 255, 0.08);
    transform: rotate(15deg);
  }

  /* Tablet & up — restore comfortable spacing */
  @media (min-width: 640px) {
    .floating-nav {
      top: 24px;
      padding: 8px 8px 8px 24px;
      max-width: none;
    }
    .floating-nav__links {
      gap: 32px;
    }
    .floating-nav .nav-link {
      font-size: 14px;
    }
    .floating-nav__divider {
      margin: 0 8px;
    }
    .floating-nav__toggle {
      width: 34px;
      height: 34px;
    }
  }

  /* Very narrow phones (≤ 380px) — tighten further, hide divider */
  @media (max-width: 380px) {
    .floating-nav {
      padding: 5px 5px 5px 14px;
    }
    .floating-nav__links {
      gap: 12px;
    }
    .floating-nav__divider {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .floating-nav,
    .floating-nav .nav-link,
    .floating-nav__toggle {
      transition: none !important;
    }
  }
`;
