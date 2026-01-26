import React from 'react';
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  text?: string;
}

export const Loader = ({ className, text = "Cargando..." }: LoaderProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <span className="loader"></span>
      {text && <p className="text-zinc-500 text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );
};
