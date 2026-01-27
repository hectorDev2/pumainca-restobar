"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MenuImageProps {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

export const MenuImage = ({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "",
  priority = false
}: MenuImageProps) => {
  const [imgSrc, setImgSrc] = useState(src || '/no-found.png');

  useEffect(() => {
    setImgSrc(src || '/no-found.png');
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        priority={priority}
        className={cn("object-cover", className)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setImgSrc('/no-found.png')}
      />
    </div>
  );
};
