"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../ThemeProvider";
import "./FloatingThemeToggle.css";

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSystem() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    </svg>
  );
}

export default function FloatingThemeToggle() {
  const { themePreference, setThemePreference } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const iconByTheme = useMemo(
    () => ({
      light: <IconSun />,
      dark: <IconMoon />,
      system: <IconSystem />,
    }),
    [],
  );

  const labelByTheme = useMemo(
    () => ({
      light: "Light theme",
      dark: "Dark theme",
      system: "System theme",
    }),
    [],
  );

  const otherOptions = useMemo(
    () => ["light", "dark", "system"].filter((k) => k !== themePreference),
    [themePreference],
  );

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="aim-theme-float"
      role="region"
      aria-label="Theme switcher"
    >
      <button
        type="button"
        className={`aim-theme-float-btn aim-theme-float-main ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${labelByTheme[themePreference]}. Change theme`}
        title={labelByTheme[themePreference]}
      >
        {iconByTheme[themePreference]}
      </button>

      <div className={`aim-theme-float-menu ${open ? "is-open" : ""}`} role="menu">
        {otherOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            className="aim-theme-float-btn"
            onClick={() => {
              setThemePreference(opt);
              setOpen(false);
            }}
            role="menuitem"
            aria-label={labelByTheme[opt]}
            title={labelByTheme[opt]}
          >
            {iconByTheme[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}
