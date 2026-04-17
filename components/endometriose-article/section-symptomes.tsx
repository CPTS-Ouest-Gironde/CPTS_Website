import { Blocks } from "@/components/sante-mentale-article/blocks";
import type { SymptomesSection } from "@/app/data/endometriose-depistage-prise-en-charge.schema";
import { Icon } from "@/components/endometriose-article/icon";
import { SectionLayout } from "@/components/endometriose-article/section-layout";

interface SymptomesSectionViewProps {
  section: SymptomesSection;
}

export function SymptomesSectionView({
  section,
}: SymptomesSectionViewProps) {
  return (
    <SectionLayout
      id={section.id}
      title={section.title}
      intro={section.intro}
      tone={section.tone}
    >
      <div className="space-y-8">
        <div className="overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef]">
          {section.symptoms.map((symptom, i) => (
            <div
              key={symptom.text}
              className={`flex items-start gap-4 px-6 py-5 md:px-8 md:py-6${i < section.symptoms.length - 1 ? " border-b border-[#e5cfc9]/60" : ""}`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#b85c5c]/10">
                <Icon
                  name={symptom.iconName}
                  className="h-5 w-5 text-[#b85c5c]"
                />
              </div>
              <p className="pt-2 text-sm leading-relaxed text-[#3d2b2f]/80 md:text-base">
                {symptom.text}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef]">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
            />
            <div className="px-6 py-6 pl-7 md:px-8 md:py-8 md:pl-9">
              <h3 className="mb-4 text-xl font-bold text-[#3d2b2f]">
                {section.painTitle}
              </h3>
              <Blocks
                blocks={section.painBlocks}
                textClass="text-base text-muted-foreground leading-relaxed"
                bold
              />
            </div>
          </div>

          <div className="rounded-3xl border border-[#e5cfc9] bg-[#f5e1dc] p-6 md:p-8">
            <h3 className="text-xl font-bold text-[#3d2b2f]">
              {section.redFlagsTitle}
            </h3>
            <ul className="mt-4 space-y-3">
              {section.redFlags.map((flag) => (
                <li
                  key={flag}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[#3d2b2f] md:text-base"
                >
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#b85c5c]"
                    aria-hidden="true"
                  />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
