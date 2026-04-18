import Image from "next/image";
import { Fragment } from "react";
import type { Block, TraitementsSection } from "@/app/data/endometriose-depistage-prise-en-charge.schema";
import { Icon } from "@/components/endometriose-article/icon";
import { SectionLayout } from "@/components/endometriose-article/section-layout";

function BoldText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function ArticleBlocks({
  blocks,
  textClass,
}: {
  blocks: Block[];
  textClass: string;
}) {
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => {
        if (b.type === "paragraph") {
          return (
            <p key={i} className={textClass}>
              <BoldText text={b.text} />
            </p>
          );
        }
        return (
          <ul key={i} className="space-y-2 pl-1">
            {b.items.map((it, j) => (
              <li
                key={j}
                className={`flex items-start gap-2.5 ${textClass}`}
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b85c5c]"
                  aria-hidden="true"
                />
                <span>
                  <BoldText text={it} />
                </span>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

interface TraitementsSectionViewProps {
  section: TraitementsSection;
}

export function TraitementsSectionView({
  section,
}: TraitementsSectionViewProps) {
  const [hormonaux, chirurgie] = section.treatmentCards;

  return (
    <SectionLayout id={section.id} title={section.title} tone={section.tone}>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-[#e5cfc9] border-l-4 border-l-[#b85c5c]/40 bg-[#faf3ef] p-6 md:p-8">
          <p className="text-base leading-relaxed text-[#3d2b2f] md:text-lg">
            {section.careCallout}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            {section.careNote}
          </p>
        </div>

        {/* Ligne 1 — Image + Prise en charge de 1re intention */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <div className="overflow-hidden rounded-3xl border border-[#e5cfc9] shadow-lg">
            <Image
              src={section.image}
              alt={section.imageAlt}
              width={800}
              height={1000}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef]">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
            />
            <div className="px-6 py-6 pl-7 md:px-8 md:py-8 md:pl-9">
              <ArticleBlocks
                blocks={section.intro}
                textClass="text-base md:text-lg text-muted-foreground leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Ligne 2 — Traitements hormonaux */}
        <div className="relative overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef]">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
          />
          <div className="px-6 py-6 pl-7 md:px-8 md:py-8 md:pl-9">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b85c5c]/10">
              <Icon
                name={hormonaux.iconName}
                className="h-5 w-5 text-[#b85c5c]"
              />
            </div>
            <h3 className="mb-4 text-xl font-bold text-[#3d2b2f]">
              {hormonaux.title}
            </h3>
            <ArticleBlocks
              blocks={hormonaux.blocks}
              textClass="text-sm md:text-base text-muted-foreground leading-relaxed"
            />
          </div>
        </div>

        {/* Ligne 3 — Place de la chirurgie */}
        <div className="relative overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef]">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
          />
          <div className="px-6 py-6 pl-7 md:px-8 md:py-8 md:pl-9">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b85c5c]/10">
              <Icon
                name={chirurgie.iconName}
                className="h-5 w-5 text-[#b85c5c]"
              />
            </div>
            <h3 className="mb-4 text-xl font-bold text-[#3d2b2f]">
              {chirurgie.title}
            </h3>
            <ArticleBlocks
              blocks={chirurgie.blocks}
              textClass="text-sm md:text-base text-muted-foreground leading-relaxed"
            />
          </div>
        </div>

        {section.credit && (
          <p className="text-sm italic text-muted-foreground">
            {section.credit}
          </p>
        )}
      </div>
    </SectionLayout>
  );
}
