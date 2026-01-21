"use client";

import { cn } from "@/lib/utils";

export const NeonGradientCard = ({
  children,
  className,
  borderSize = 2,
  borderRadius = 24,
  neonColor = "#ff2975",
  secondaryColor = "#00FFF1",
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  className?: string;
  borderSize?: number;
  borderRadius?: number;
  neonColor?: string;
  secondaryColor?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <div
      style={
        {
          "--border-size": `${borderSize}px`,
          "--border-radius": `${borderRadius}px`,
          "--neon-color": neonColor,
          "--secondary-color": secondaryColor,
        } as React.CSSProperties
      }
      className={cn(
        "group relative z-10 grid w-full h-full min-h-[300px] items-center justify-center rounded-[var(--border-radius)] bg-zinc-950 p-1 text-center transition-all duration-500 hover:scale-[1.02]",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={cn(
          "relative h-full w-full rounded-[calc(var(--border-radius)-var(--border-size))] bg-[#05030a] p-6",
          "before:absolute before:-inset-[var(--border-size)] before:-z-10 before:block before:rounded-[var(--border-radius)] before:bg-[linear-gradient(0deg,var(--neon-color),var(--secondary-color),var(--neon-color))] before:bg-[length:100%_200%] before:animate-[neon-border_3s_linear_infinite] before:content-['']",
          "after:absolute after:-inset-[var(--border-size)] after:-z-10 after:block after:rounded-[var(--border-radius)] after:bg-[linear-gradient(0deg,var(--neon-color),var(--secondary-color),var(--neon-color))] after:bg-[length:100%_200%] after:animate-[neon-border_3s_linear_infinite] after:blur-[20px] after:opacity-40 after:transition-opacity after:duration-500 after:content-[''] group-hover:after:opacity-100"
        )}
      >
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};
