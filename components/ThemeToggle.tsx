"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("wb_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggle = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("wb_theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("wb_theme", "dark");
      setIsDark(true);
    }
  };

  if (!mounted) {
    return <span className="h-8 w-8 inline-block" aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to daylight mode" : "Switch to calming night mode"}
      title={isDark ? "Daylight mode" : "Night mode"}
      className="h-8 w-8 grid place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 text-accent-400" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-white/90" />
      )}
    </button>
  );
}
