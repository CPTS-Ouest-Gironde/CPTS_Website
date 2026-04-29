import type { ReactNode } from "react";
import type { Tone } from "@/app/data/endometriose-depistage-prise-en-charge.schema";
import { sectionToneClass } from "@/components/endometriose-article/utils";

interface SectionLayoutProps {
  id: string;
  title: string;
  tone: Tone;
  intro?: string[];
  children: ReactNode;
}

export function SectionLayout({
  id,
  title,
  tone,
  intro = [],
  children,
}: SectionLayoutProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-32 py-16 md:py-24 ${sectionToneClass(tone)}`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
            <h2 className="mb-4 text-3xl font-bold text-foreground text-balance md:text-4xl">
              {title}
            </h2>
            {intro.length > 0 && (
              <div className="space-y-3">
                {intro.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-muted-foreground text-pretty md:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}
