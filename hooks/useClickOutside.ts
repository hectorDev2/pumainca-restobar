import { useEffect, useRef } from "react";

/**
 * Hook para detectar clicks fuera de un elemento
 * Útil para cerrar modales, dropdowns, popovers
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  enabled: boolean = true,
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [callback, enabled]);

  return ref;
}
