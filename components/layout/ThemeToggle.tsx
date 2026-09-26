"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { THEME_KEY, type Theme } from "./theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage blocked: the choice lasts for this visit only */
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="lift grid size-12 shrink-0 place-items-center rounded-full border border-line bg-paper-2 text-ink"
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={20} strokeWidth={1.8} />
    </button>
  );
}
