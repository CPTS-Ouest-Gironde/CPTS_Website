import type { AnnuaireSection } from "@/app/data/endometriose-depistage-prise-en-charge.schema";
import { Icon } from "@/components/endometriose-article/icon";
import { SectionLayout } from "@/components/endometriose-article/section-layout";

interface AnnuaireSectionViewProps {
  section: AnnuaireSection;
}

export function AnnuaireSectionView({ section }: AnnuaireSectionViewProps) {
  return (
    <SectionLayout
      id={section.id}
      title={section.title}
      intro={section.intro}
      tone={section.tone}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {section.centers.map((center) => (
          <div
            key={center.name}
            className="relative h-full overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
            />
            <div className="px-6 py-6 pl-7 md:px-8 md:py-8 md:pl-9">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b85c5c]/10">
                <Icon name="MapPinned" className="h-5 w-5 text-[#b85c5c]" />
              </div>
              <h3 className="mb-2 text-lg font-bold leading-tight text-[#3d2b2f] md:text-xl">
                {center.name}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {center.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
