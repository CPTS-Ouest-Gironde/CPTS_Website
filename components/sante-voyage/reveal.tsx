"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Direction d'entrée de l'animation */
  from?: "up" | "left" | "right" | "zoom";
  /** Délai en ms avant le déclenchement (effet cascade) */
  delay?: number;
  className?: string;
}

const hiddenStyles: Record<NonNullable<RevealProps["from"]>, string> = {
  up: "translate-y-10 opacity-0",
  left: "-translate-x-10 opacity-0",
  right: "translate-x-10 opacity-0",
  zoom: "scale-95 opacity-0",
};

export function Reveal({ children, from = "up", delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hiddenStyles[from]
      } ${className}`}
    >
      {children}
    </div>
  );
}
