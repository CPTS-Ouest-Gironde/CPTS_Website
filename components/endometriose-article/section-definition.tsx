import { Blocks } from "@/components/sante-mentale-article/blocks";
import type { DefinitionSection } from "@/app/data/endometriose-depistage-prise-en-charge.schema";
import { SectionLayout } from "@/components/endometriose-article/section-layout";

interface DefinitionSectionViewProps {
  section: DefinitionSection;
  articleIntro?: string[];
}

export function DefinitionSectionView({
  section,
  articleIntro,
}: DefinitionSectionViewProps) {
  return (
    <SectionLayout
      id={section.id}
      title={section.title}
      intro={section.intro}
      tone={section.tone}
    >
      <div className="space-y-6">
        {articleIntro && articleIntro.length > 0 && (
          <div className="rounded-3xl border border-[#e5cfc9] bg-[#faf3ef] p-6 md:p-8">
            <div className="space-y-4">
              {articleIntro.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-relaxed text-[#3d2b2f]/70 md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-[#e5cfc9] bg-[#f5e1dc] p-6 md:p-8">
          <Blocks
            blocks={section.blocks}
            textClass="text-base md:text-lg text-[#3d2b2f] leading-relaxed"
            bold
          />
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef]">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
          />
          <div className="px-6 py-6 pl-7 md:px-8 md:py-8 md:pl-9">
            <h3 className="mb-4 text-xl font-bold text-[#3d2b2f]">
              {section.factorsTitle}
            </h3>
            <ul className="space-y-3">
              {section.factors.map((factor) => (
                <li
                  key={factor}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground md:text-base"
                >
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#b85c5c]"
                    aria-hidden="true"
                  />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
