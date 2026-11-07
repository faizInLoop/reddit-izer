"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return <button className="icon-button theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${next} theme`} aria-pressed={theme === "light"} title={`Switch to ${next} theme`}>
    {theme === "dark" ? <Sun size={15} aria-hidden="true"/> : <Moon size={15} aria-hidden="true"/>}
    <span>{theme === "dark" ? "Light" : "Dark"}</span>
  </button>;
}
