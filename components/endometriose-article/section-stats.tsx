import { Card, CardContent } from "@/components/ui/card";
import type { StatsSection } from "@/app/data/endometriose-depistage-prise-en-charge.schema";
import { SectionLayout } from "@/components/endometriose-article/section-layout";

interface StatsSectionViewProps {
  section: StatsSection;
}

export function StatsSectionView({ section }: StatsSectionViewProps) {
  return (
    <SectionLayout
      id={section.id}
      title={section.title}
      intro={section.intro}
      tone={section.tone}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {section.stats.map((stat) => (
            <Card
              key={`${stat.value}-${stat.label}`}
              className="relative overflow-hidden rounded-3xl border-[#e5cfc9] bg-[#faf3ef] py-0"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
              />
              <CardContent className="px-6 py-6 pl-7">
                <p className="text-2xl font-bold text-[#b85c5c] md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-3xl border border-[#e5cfc9] bg-[#f5e1dc] p-6 md:p-8">
          <p className="text-base leading-relaxed text-[#3d2b2f] md:text-lg">
            {section.note}
          </p>
        </div>
      </div>
    </SectionLayout>
  );
}
