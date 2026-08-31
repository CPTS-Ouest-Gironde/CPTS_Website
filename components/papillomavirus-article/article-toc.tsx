"use client";

import { useEffect, useRef, useState } from "react";

type TocItem = { id: string; label: string };

/**
 * Sommaire de l'article : bandeau de puces défilant sur mobile, colonne
 * collante sur grand écran. La question en cours de lecture est surlignée
 * et le bandeau mobile la ramène dans le champ de vision.
 */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // La question active est la dernière dont le haut est passé sous l'en-tête.
      const limit = 160;
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= limit) current = el.id;
      }
      // En bas de page, la dernière question devient active.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        current = elements[elements.length - 1].id;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  // Garde la puce active visible dans le bandeau mobile.
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const active = list.querySelector<HTMLElement>(`[data-toc-id="${activeId}"]`);
    if (!active) return;
    const offset =
      active.offsetLeft - list.clientWidth / 2 + active.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, offset) });
  }, [activeId]);

  return (
    <nav aria-label="Sommaire de l'article" className="lg:sticky lg:top-28">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--sand-600)]">
        Les questions abordées
      </p>
      <ol
        ref={listRef}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {items.map((item, i) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className="flex-shrink-0 lg:flex-shrink">
              <a
                href={`#${item.id}`}
                data-toc-id={item.id}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-baseline gap-2.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm transition-colors lg:whitespace-normal lg:rounded-lg lg:border-0 lg:border-l-2 lg:rounded-l-none lg:py-1.5 lg:pl-3.5 lg:pr-2 ${
                  isActive
                    ? "border-[var(--sand-400)] bg-[var(--sand-200)] font-medium text-[var(--sand-900)] lg:bg-[var(--sand-100)]"
                    : "border-[var(--sand-300)] bg-white/70 text-[var(--sand-900)]/70 hover:text-[var(--sand-900)] lg:border-[var(--sand-200)] lg:bg-transparent lg:hover:border-[var(--sand-400)] lg:hover:bg-[var(--sand-100)]"
                }`}
              >
                <span
                  className={`text-xs font-semibold tabular-nums ${
                    isActive ? "text-[var(--sand-700)]" : "text-[var(--sand-600)]/70"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-snug">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
