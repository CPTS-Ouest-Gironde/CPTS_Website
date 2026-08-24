import { ChevronDown, FileText } from "lucide-react";
import { AccordionItem } from "../types";
import { DownloadButton } from "@/components/download-button";

interface AccordionSectionProps {
  items: AccordionItem[];
  openAccordions: string[];
  onToggle: (id: string) => void;
}

export function AccordionSection({
  items,
  openAccordions,
  onToggle,
}: AccordionSectionProps) {
  const formatContent = (paragraph: string) => {
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
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openAccordions.includes(item.id);
        const fileCount = item.files?.length ?? 0;

        return (
          <div
            key={item.id}
            id={item.id}
            className={`rounded-2xl border bg-card overflow-hidden scroll-mt-44 transition-all duration-200 ${
              isOpen
                ? "border-primary/40 shadow-md"
                : "border-border hover:border-primary/40 hover:shadow-sm"
            }`}
          >
            {/* En-tête : neutre au repos, plein vert seulement lorsqu'il est ouvert */}
            <button
              onClick={() => onToggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`${item.id}-panel`}
              className={`w-full px-5 py-4 lg:px-6 lg:py-5 flex items-center justify-between gap-4 text-left transition-colors ${
                isOpen ? "bg-primary" : "bg-card hover:bg-primary/5"
              }`}
            >
              <span
                className={`text-base lg:text-lg font-semibold leading-snug ${
                  isOpen ? "text-white" : "text-foreground"
                }`}
              >
                {item.title}
              </span>

              <span className="flex items-center gap-3 flex-shrink-0">
                {fileCount > 0 && (
                  <span
                    className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      isOpen
                        ? "bg-white/20 text-white"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {fileCount} document{fileCount > 1 ? "s" : ""}
                  </span>
                )}
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-white" : "text-primary"
                  }`}
                />
              </span>
            </button>

            {/* Panneau : grid-rows 0fr→1fr, pas de hauteur maximale qui tronquerait
                les contenus longs comme le parcours insuffisance cardiaque */}
            <div
              id={`${item.id}-panel`}
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 py-6 lg:px-8 lg:py-8 space-y-6 border-t border-border">
                  {item.content && (
                    <div className="space-y-4 max-w-[68ch]">
                      {item.content.split("\n\n").map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-[15px] lg:text-base leading-[1.75] text-foreground/80"
                          dangerouslySetInnerHTML={{
                            __html: formatContent(paragraph),
                          }}
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
