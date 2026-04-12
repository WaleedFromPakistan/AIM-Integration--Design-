"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext({
  themePreference: "system",
  resolvedTheme: "dark",
  setThemePreference: () => {},
});

const STORAGE_KEY = "aim-theme-pref";

function getSystemDark() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolvePreference(pref, systemIsDark) {
  if (pref === "light" || pref === "dark") return pref;
  return systemIsDark ? "dark" : "light";
}

export function ThemeProvider({ children, defaultTheme = "system" }) {
  const [themePreference, setThemePreferenceState] = useState(() =>
    defaultTheme === "light" || defaultTheme === "dark" || defaultTheme === "system"
      ? defaultTheme
      : "system",
  );
  const [resolvedTheme, setResolvedTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      let stored = window.localStorage.getItem(STORAGE_KEY);
      const legacy = window.localStorage.getItem("aim-theme");
      if (
        (stored !== "light" && stored !== "dark" && stored !== "system") &&
        (legacy === "light" || legacy === "dark")
      ) {
        stored = legacy;
        window.localStorage.removeItem("aim-theme");
        window.localStorage.setItem(STORAGE_KEY, legacy);
      }
      const pref =
        stored === "light" || stored === "dark" || stored === "system"
          ? stored
          : defaultTheme === "light" || defaultTheme === "dark"
            ? defaultTheme
            : "system";
      setThemePreferenceState(pref);
      const resolved = resolvePreference(pref, getSystemDark());
      setResolvedTheme(resolved);
      document.documentElement.setAttribute("data-theme", resolved);
    } catch {
      const resolved = resolvePreference(defaultTheme, getSystemDark());
      setResolvedTheme(resolved);
      document.documentElement.setAttribute("data-theme", resolved);
    }
  }, [defaultTheme]);

  useEffect(() => {
    if (!mounted || themePreference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = resolvePreference("system", mq.matches);
      setResolvedTheme(resolved);
      document.documentElement.setAttribute("data-theme", resolved);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mounted, themePreference]);

  useEffect(() => {
    if (!mounted) return;
    const resolved = resolvePreference(themePreference, getSystemDark());
    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
    try {
      window.localStorage.setItem(STORAGE_KEY, themePreference);
    } catch {
      /* ignore */
    }
  }, [themePreference, mounted]);

  const setThemePreference = useCallback((next) => {
    if (next === "light" || next === "dark" || next === "system") {
      setThemePreferenceState(next);
    }
  }, []);

  const value = useMemo(
    () => ({ themePreference, resolvedTheme, setThemePreference }),
    [themePreference, resolvedTheme, setThemePreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
