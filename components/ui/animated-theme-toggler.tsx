"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnimatedThemeToggler() {
  const [theme, setTheme] = useState("dark"); // Default to dark since app is currently dark-first

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-xl bg-surface-dark border border-zinc-800 transition-colors hover:bg-surface-hover text-text-primary",
      )}
    >
        <div className="relative size-5">
            <Sun className={cn(
                "absolute inset-0 size-full transition-all duration-300 rotate-0 scale-100", 
                theme === "dark" && "rotate-90 scale-0"
            )} />
            <Moon className={cn(
                "absolute inset-0 size-full transition-all duration-300 rotate-90 scale-0", 
                 theme === "dark" && "rotate-0 scale-100"
            )} />
        </div>
        <span className="sr-only">Toggle theme</span>
    </button>
  );
}
