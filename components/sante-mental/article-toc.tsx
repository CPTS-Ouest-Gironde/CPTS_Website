"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; label: string };

// Sommaire de l'article : puces sur mobile, colonne fixe sur desktop.
// La section visible est mise en avant grâce à un IntersectionObserver.
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Sommaire de l'article" className="mb-8 lg:mb-0">
      <ol className="flex flex-wrap lg:flex-col gap-2 lg:gap-0 lg:sticky lg:top-28 lg:border-l lg:border-border">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`block rounded-full lg:rounded-none border lg:border-0 px-4 py-2 lg:py-2.5 text-sm transition-colors lg:border-l-2 lg:-ml-px ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary font-medium lg:bg-transparent lg:border-l-primary"
                    : "border-border bg-background lg:bg-transparent text-foreground/80 hover:text-primary hover:border-primary lg:border-l-transparent lg:hover:border-l-primary/50"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
