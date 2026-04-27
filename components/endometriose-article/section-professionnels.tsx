import Image from "next/image";
import { Blocks } from "@/components/sante-mentale-article/blocks";
import type { ProfessionnelsSection } from "@/app/data/endometriose-depistage-prise-en-charge.schema";
import { Icon } from "@/components/endometriose-article/icon";
import { SectionLayout } from "@/components/endometriose-article/section-layout";

interface ProfessionnelsSectionViewProps {
  section: ProfessionnelsSection;
}

export function ProfessionnelsSectionView({
  section,
}: ProfessionnelsSectionViewProps) {
  const [sageFemme, ...others] = section.professionals;

  return (
    <SectionLayout
      id={section.id}
      title={section.title}
      intro={section.intro}
      tone={section.tone}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
          <div className="relative mx-auto aspect-square w-full max-w-[380px] overflow-hidden rounded-3xl border border-[#e5cfc9] shadow-lg">
            <Image
              src={section.image}
              alt={section.imageAlt}
              fill
              className="object-cover"
              sizes="380px"
            />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef]">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
            />
            <div className="px-6 py-6 pl-7 md:px-8 md:py-8 md:pl-9">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#b85c5c]/10">
                  <Icon
                    name={sageFemme.iconName}
                    className="h-5 w-5 text-[#b85c5c]"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#3d2b2f]">
                  {sageFemme.title}
                </h3>
              </div>
              <Blocks
                blocks={sageFemme.blocks}
                textClass="text-base md:text-lg text-muted-foreground leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {others.map((professional) => (
            <div
              key={professional.title}
              className="relative overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
              />
              <div className="flex min-h-[160px] items-center gap-4 px-6 py-8 pl-7 md:px-8 md:pl-9">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#b85c5c]/10">
                  <Icon
                    name={professional.iconName}
                    className="h-5 w-5 text-[#b85c5c]"
                  />
                </div>
                <p className="text-base font-bold leading-snug text-[#3d2b2f] md:text-lg">
                  {professional.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
