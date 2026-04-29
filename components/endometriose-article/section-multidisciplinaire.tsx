import { Fragment } from "react";
import { ExternalLink } from "lucide-react";
import type { MultidisciplinaireSection } from "@/app/data/endometriose-depistage-prise-en-charge.schema";
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

interface MultidisciplinaireSectionViewProps {
  section: MultidisciplinaireSection;
}

export function MultidisciplinaireSectionView({
  section,
}: MultidisciplinaireSectionViewProps) {
  return (
    <SectionLayout
      id={section.id}
      title={section.title}
      intro={section.intro}
      tone={section.tone}
    >
      <div className="mx-auto max-w-5xl">
        {section.transitionText && (
          <p className="mb-6 hidden text-center text-base leading-relaxed text-muted-foreground md:text-lg lg:block">
            {section.transitionText}
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {section.cards.map((card) => (
            <div
              key={card.title}
              className="relative overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
              />
              <div className="px-6 py-6 pl-7 md:px-8 md:py-8 md:pl-9">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b85c5c]/10">
                  <Icon
                    name={card.iconName}
                    className="h-5 w-5 text-[#b85c5c]"
                  />
                </div>
                <h3 className="mb-4 text-xl font-bold text-[#3d2b2f]">
                  {card.title}
                </h3>
                <ul className="space-y-2 pl-1">
                  {card.blocks
                    .filter((b) => b.type === "list")
                    .flatMap((b) => (b.type === "list" ? b.items : []))
                    .map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground md:text-base"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b85c5c]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}

          {section.transitionText && (
            <p className="text-center text-base leading-relaxed text-muted-foreground md:text-lg lg:hidden">
              {section.transitionText}
            </p>
          )}

          <article className="relative overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef] p-6 pl-7 md:p-8 md:pl-9">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
            />
            <h3 className="text-xl font-bold text-[#3d2b2f]">
              {section.association.title}
            </h3>
            <div className="mt-4 space-y-5">
              <div className="space-y-3">
                {section.association.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-muted-foreground md:text-lg"
                  >
                    <BoldText text={paragraph} />
                  </p>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={section.association.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b85c5c] px-5 py-2.5 text-sm font-semibold text-white"
                  aria-label="Ouvrir le site de l'association DisDameDonc dans un nouvel onglet"
                >
                  {section.association.siteLabel}
                  <ExternalLink className="h-4 w-4" />
                </a>

                <a
                  href={section.association.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b85c5c] px-5 py-2.5 text-sm font-semibold text-[#b85c5c]"
                  aria-label="Télécharger la plaquette PDF de DisDameDonc"
                >
                  {section.association.pdfLabel}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </SectionLayout>
  );
}
