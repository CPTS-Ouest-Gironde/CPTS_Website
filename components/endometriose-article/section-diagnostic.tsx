import type { DiagnosticSection } from "@/app/data/endometriose-depistage-prise-en-charge.schema";
import { SectionLayout } from "@/components/endometriose-article/section-layout";

interface DiagnosticSectionViewProps {
  section: DiagnosticSection;
}

export function DiagnosticSectionView({
  section,
}: DiagnosticSectionViewProps) {
  return (
    <SectionLayout
      id={section.id}
      title={section.title}
      intro={section.intro}
      tone={section.tone}
    >
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef]">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
          />
          <div className="px-6 py-6 pl-7 md:px-8 md:py-8 md:pl-9">
            {section.blocks.map((block, i) =>
              block.type === "list" ? (
                <ul key={i} className="space-y-3">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground md:text-lg"
                    >
                      <span
                        className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#b85c5c]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  key={i}
                  className="text-base leading-relaxed text-muted-foreground md:text-lg"
                >
                  {block.text}
                </p>
              ),
            )}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
