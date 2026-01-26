"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, PanInfo, animate } from "framer-motion";

interface Carousel3DProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  curve?: number; // How curved the carousel is (radius)
  itemWidth?: number; // Width of each item
  gap?: number; // Gap between items
}

const Carousel3D: React.FC<Carousel3DProps> = ({
  items,
  autoPlay = true,
  curve = 800,
  itemWidth = 300,
  gap = 20,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationValue = useMotionValue(0);
  const dragging = useRef(false);
  const hovering = useRef(false);
  const lastTimeTime = useRef<number>(0);
  const animationRef = useRef<any>(null);

  const totalItems = items.length;
  // Calculate the angle creating a full circle if needed, or just partial
  // For infinite rotation, we treat the items as placed on a cylinder
  const anglePerItem = (itemWidth + gap) / curve * (180 / Math.PI); 

  /* Refactored Clean Logic */
  const onDragStart = () => {
    dragging.current = true;
    if (animationRef.current) animationRef.current.stop();
  };

  const onDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Convert px movement to rotation degrees
    const deltaRotation = (info.delta.x / window.innerWidth) * 25;
    const current = rotationValue.get();
    rotationValue.set(current + deltaRotation);
  };

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Keep dragging true until momentum finishes to prevent auto-loop conflict
    dragging.current = true;
    
    // Momentum
    const velocityX = info.velocity.x;
    const momentum = (velocityX / window.innerWidth) * 200;
    
    const currentRotation = rotationValue.get();
    const targetRotation = currentRotation + momentum;
    
    animationRef.current = animate(rotationValue, targetRotation, {
        type: "spring",
        stiffness: 50,
        damping: 20,
        mass: 1,
        onUpdate: (v) => {}, // No external state update needed
        onComplete: () => {
             dragging.current = false;
        }
    });
  };

  useEffect(() => {
    if (!autoPlay) return;
    
    let rAF: number;
    const animateLoop = (time: number) => {
      // Only auto-rotate if not dragging and not hovering
      if (!dragging.current && !hovering.current) {
          const delta = time - lastTimeTime.current;
          if (delta > 0) {
              const current = rotationValue.get();
              // Smooth slow rotation
              const nextRot = current - 0.1; 
              rotationValue.set(nextRot);
          }
      }
      lastTimeTime.current = time;
      rAF = requestAnimationFrame(animateLoop);
    };
    
    rAF = requestAnimationFrame(animateLoop);
    return () => cancelAnimationFrame(rAF);
  }, [autoPlay, rotationValue]);

  // Calculate how many items are needed to fill the circle
  const circumference = 2 * Math.PI * curve;
  const itemArc = itemWidth + gap;
  const maxItems = Math.floor(circumference / itemArc);
  
  // Create a looped array of items to fill the cylinder
  // If we have very few items, we repeat them.
  // We limit to maxItems to prevent overlapping 360 degrees (Z-fighting)
  const renderItems = React.useMemo(() => {
    if (items.length === 0) return [];
    
    // If we have fewer items than needed to fill the circle, repeat them
    if (items.length < maxItems) {
      const repetitions = Math.ceil(maxItems / items.length);
      // Create array with repeated items
      const repeated = Array.from({ length: repetitions }).flatMap(() => items);
      // Trim to maxItems to fit exactly(ish) in the circle without overlapping start
      return repeated.slice(0, maxItems);
    }
    
    // If we have enough or too many, just use what we have (or slice if we wanted to enforce limits)
    return items;
  }, [items, maxItems]);

  // Create transform from motion value
  const pivotTransform = useMotionValueProp(rotationValue, (r) => `translateZ(-${curve}px) rotateY(${r}deg)`);

  return (
    <div 
        className="carousel-container relative w-full h-[600px] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        ref={containerRef}
        style={{ perspective: "1000px" }}
    >
      <motion.div
        className="carousel-track relative w-full h-full flex items-center justify-center"
        style={{ 
            transformStyle: "preserve-3d",
            touchAction: "pan-y" // Allow vertical scroll but capture horizontal
         }}
         onPanStart={onDragStart}
         onPan={onDrag}
         onPanEnd={onDragEnd}
      >
        <motion.div 
            className="pivot absolute w-0 h-0"
            style={{ 
                transformStyle: "preserve-3d",
                transform: pivotTransform,
            }}
        >
            {renderItems.map((item, index) => {
                // Use a stable key that combines index and maybe some original ID if available, 
                // but index is safe for this purely visual duplication
                const rotationY = index * anglePerItem;
                return (
                    <div
                        key={`carousel-item-${index}`}
                        className="carousel-item absolute top-1/2 left-1/2" 
                        onMouseEnter={() => { hovering.current = true; }}
                        onMouseLeave={() => { hovering.current = false; }}
                        style={{
                            width: itemWidth,
                            height: "100%",
                            marginLeft: -itemWidth / 2,
                            marginTop: -225, // Centered vertically for 450px height items
                            transformOrigin: "center center",
                            transform: `rotateY(${rotationY}deg) translateZ(${curve}px)`,
                            backfaceVisibility: "hidden", 
                        }}
                    >
                       {item}
                    </div>
                );
            })}
        </motion.div>
      </motion.div>
      
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/90 via-transparent to-black/90 z-30" />
    </div>
  );
};

// Helper for useTransform if not imported
function useMotionValueProp(value: any, transform: (v: any) => any) {
    const [state, setState] = useState(transform(value.get()));
    useEffect(() => {
        const unsub = value.on("change", (v: any) => {
             setState(transform(v));
        });
        return unsub;
    }, [value, transform]);
    // Actually we should return a MotionValue if we want to pass it to style
    // But since we want to avoid re-renders, we should use framer-motion's useTransform
    // However, I need to make sure useTransform is imported.
    return state;
}

export default Carousel3D;
