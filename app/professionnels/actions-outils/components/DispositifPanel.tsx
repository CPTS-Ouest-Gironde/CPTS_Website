import { AccordionItem } from "../types";
import { DownloadButton } from "@/components/download-button";

interface DispositifPanelProps {
  item: AccordionItem;
  groupLabel: string;
}

/* Mise en forme héritée : liens mailto/tel automatiques et mise en gras des étapes.
   Le texte source n'est pas modifié. */
function formatContent(paragraph: string) {
  let formatted = paragraph.replace(
    /([\w\.-]+@[\w\.-]+\.\w+)/g,
    '<a href="mailto:$1" class="text-primary hover:text-primary/80 font-semibold underline transition-colors">$1</a>'
  );
  formatted = formatted.replace(
    /(\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2})/g,
    '<a href="tel:+33$1" class="text-primary hover:text-primary/80 font-semibold underline transition-colors">$1</a>'
  );
  formatted = formatted.replace(
    /(Étape \d+ :)/g,
    '<strong class="font-bold text-foreground">$1</strong>'
  );
  return formatted;
}

export function DispositifPanel({ item, groupLabel }: DispositifPanelProps) {
  return (
    <article
      id={item.id}
      className="rounded-2xl border border-border bg-card p-5 lg:p-8 scroll-mt-32"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
        {groupLabel}
      </p>

      <h2 className="text-2xl lg:text-3xl font-bold text-foreground text-balance mb-6">
        {item.title}
      </h2>

      <div className="space-y-6">
        {item.content && (
          <div className="space-y-4 max-w-[68ch]">
            {item.content.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className="text-[15px] lg:text-base leading-[1.75] text-foreground/80"
                dangerouslySetInnerHTML={{ __html: formatContent(paragraph) }}
              />
            ))}
          </div>
        )}

        {item.customContent && <div>{item.customContent}</div>}

        {item.files && item.files.length > 0 && (
          <div className="pt-6 border-t border-border">
            <h3 className="text-base font-bold text-foreground mb-4">
              Documents à télécharger
            </h3>
            <div className="space-y-3">
              {item.files.map((file, index) => (
                <DownloadButton
                  key={index}
                  fileName={file.name}
                  fileUrl={file.url}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
