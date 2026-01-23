"use client";

import { cn } from "@/lib/utils";
import { useState, useCallback, useMemo, useRef, useEffect, useId } from "react";

export const NeonGradientCard = ({
  children,
  className,
  // If true, do not render the built-in inner content wrapper
  noInnerContainer = false,
  borderSize = 2,
  borderRadius = 24,
  neonColor = "#ff2975",
  secondaryColor = "#00FFF1",
  cardId,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  className?: string;
  noInnerContainer?: boolean;
  borderSize?: number;
  borderRadius?: number;
  neonColor?: string;
  secondaryColor?: string;
  cardId?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  // Use ref to ensure each instance has completely isolated state
  const hoverStateRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Use React's useId for consistent server/client ID generation to prevent hydration mismatches
  const generatedId = useId();
  const uniqueId = useMemo(() => cardId || `card-${generatedId.replace(/:/g, '')}`, [cardId, generatedId]);
  const cardIdAttr = `neon-card-${uniqueId}`;

  // Sync ref with state
  useEffect(() => {
    hoverStateRef.current = isHovered;
  }, [isHovered]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Verify this is the correct card element
    if (cardRef.current && (e.currentTarget === cardRef.current || cardRef.current.contains(e.currentTarget as Node))) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      if (!hoverStateRef.current) {
        setIsHovered(true);
        onMouseEnter?.();
      }
    }
  }, [onMouseEnter]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const relatedTarget = e.relatedTarget;
    // Only update if truly leaving this card
    // Check if relatedTarget is a Node to avoid "parameter 1 is not of type 'Node'" error
    if (cardRef.current && (!relatedTarget || !(relatedTarget instanceof Node) || !cardRef.current.contains(relatedTarget))) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      if (hoverStateRef.current) {
        setIsHovered(false);
        onMouseLeave?.();
      }
    }
  }, [onMouseLeave]);

  const cardStyles = useMemo(() => ({
    "--border-size": `${borderSize}px`,
    "--border-radius": `${borderRadius}px`,
    "--neon-color": neonColor,
    "--secondary-color": secondaryColor,
  }), [borderSize, borderRadius, neonColor, secondaryColor]);

  return (
    <div
      ref={cardRef}
      id={cardIdAttr}
      data-card-id={uniqueId}
      data-is-hovered={String(isHovered)}
      style={{
        ...cardStyles,
        position: "relative",
        overflow: "hidden",
        zIndex: isHovered ? 20 : 10,
      } as React.CSSProperties}
      className={cn(
        "neon-card-container relative grid w-full h-full items-center justify-center rounded-[var(--border-radius)] bg-zinc-950 p-1 text-center",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Neon Glow Effect - Behind everything */}
      <div
        id={`${cardIdAttr}-glow`}
        className="absolute inset-0 rounded-[var(--border-radius)]"
        style={{
          background: `linear-gradient(0deg, ${neonColor}, ${secondaryColor}, ${neonColor})`,
          backgroundSize: "100% 200%",
          animation: "neon-border 3s linear infinite",
          opacity: isHovered ? 1 : 0.4,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
          willChange: "opacity",
          filter: "blur(20px)",
          WebkitFilter: "blur(20px)",
          zIndex: 0,
        }}
        data-hovered={String(isHovered)}
        data-card-id={uniqueId}
      />
      
      {/* Neon Border - Visible animated border */}
      <div
        className="absolute inset-0 rounded-[var(--border-radius)]"
        style={{
          background: `linear-gradient(0deg, ${neonColor}, ${secondaryColor}, ${neonColor})`,
          backgroundSize: "100% 200%",
          animation: "neon-border 3s linear infinite",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      
      {/* Inner mask to create border effect */}
      <div
        className="absolute inset-[var(--border-size)] rounded-[calc(var(--border-radius)-var(--border-size))] bg-[#05030a]"
        style={{
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      
      {/* Content Container - can be disabled so callers can provide their own container */}
      {!noInnerContainer ? (
        <div
          className="relative h-full w-full rounded-[calc(var(--border-radius)-var(--border-size))] bg-transparent p-6"
          style={{
            zIndex: 3,
            overflow: "visible",
          }}
        >
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4">
            {children}
          </div>
        </div>
      ) : (
        // Render children directly when caller provides the full inner markup
        <>{children}</>
      )}
    </div>
  );
};
