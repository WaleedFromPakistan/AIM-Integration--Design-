"use client";

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

  return (
    <div
      className="aim-theme-float"
      role="group"
      aria-label="Theme: light, dark, or system"
    >
      <button
        type="button"
        className={`aim-theme-float-btn ${themePreference === "light" ? "is-active" : ""}`}
        onClick={() => setThemePreference("light")}
        aria-pressed={themePreference === "light"}
        aria-label="Light theme"
        title="Light"
      >
        <IconSun />
      </button>
      <button
        type="button"
        className={`aim-theme-float-btn ${themePreference === "dark" ? "is-active" : ""}`}
        onClick={() => setThemePreference("dark")}
        aria-pressed={themePreference === "dark"}
        aria-label="Dark theme"
        title="Dark"
      >
        <IconMoon />
      </button>
      <button
        type="button"
        className={`aim-theme-float-btn ${themePreference === "system" ? "is-active" : ""}`}
        onClick={() => setThemePreference("system")}
        aria-pressed={themePreference === "system"}
        aria-label="Use system theme"
        title="System"
      >
        <IconSystem />
      </button>
    </div>
  );
}
