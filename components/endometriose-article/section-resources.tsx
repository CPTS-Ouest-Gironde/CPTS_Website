import { ExternalLink } from "lucide-react";
import type { ResourcesSection } from "@/app/data/endometriose-depistage-prise-en-charge.schema";
import { SectionLayout } from "@/components/endometriose-article/section-layout";

interface ResourcesSectionViewProps {
  section: ResourcesSection;
}

export function ResourcesSectionView({ section }: ResourcesSectionViewProps) {
  return (
    <SectionLayout
      id={section.id}
      title={section.title}
      intro={section.intro}
      tone={section.tone}
    >
      <div className="mx-auto max-w-3xl">
        {section.resources.map((resource) => (
          <article
            key={resource.url}
            className="relative overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef] p-6 pl-7 md:p-8 md:pl-9"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
            />
            <h3 className="text-xl font-bold text-[#3d2b2f]">
              {resource.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {resource.description}
            </p>
            <div className="mt-5">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#b85c5c] px-5 py-2.5 text-sm font-semibold text-white"
                aria-label="Ouvrir la ressource complémentaire du Ministère de la Santé dans un nouvel onglet"
              >
                {resource.label}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </SectionLayout>
  );
}
