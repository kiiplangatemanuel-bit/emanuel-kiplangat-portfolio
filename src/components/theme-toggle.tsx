"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const saved = window.localStorage.getItem("ek-theme");
    const preferred = window.matchMedia("(prefers-color-scheme: light)").matches;
    const next = saved ? saved === "light" : preferred;
    setLight(next);
    document.documentElement.dataset.theme = next ? "light" : "dark";
  }, []);
  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.dataset.theme = next ? "light" : "dark";
    window.localStorage.setItem("ek-theme", next ? "light" : "dark");
  }
  return <button className="theme-toggle" type="button" onClick={toggle} aria-label={light ? "Switch to dark mode" : "Switch to light mode"} title={light ? "Dark mode" : "Light mode"}>{light ? <Moon size={16}/> : <Sun size={16}/>}</button>;
}
