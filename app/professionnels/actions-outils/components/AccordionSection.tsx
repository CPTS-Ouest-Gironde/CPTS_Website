import { ChevronDown } from "lucide-react";
import { AccordionItem } from "../types";
import { DownloadButton } from "@/components/download-button";

interface AccordionSectionProps {
  items: AccordionItem[];
  openAccordion: string | null;
  onToggle: (id: string) => void;
}

export function AccordionSection({
  items,
  openAccordion,
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
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          id={item.id}
          className="border-2 border-gray-200 rounded-2xl overflow-hidden scroll-mt-24"
        >
          {/* Accordion Button */}
          <button
            onClick={() => onToggle(item.id)}
            className="w-full px-6 py-5 lg:px-8 lg:py-6 bg-primary hover:bg-primary/90 transition-colors flex items-center justify-between text-left group"
          >
            <span className="text-lg lg:text-xl font-bold text-white pr-4">
              {item.title}
            </span>
            <ChevronDown
              className={`w-6 h-6 text-white flex-shrink-0 transition-transform duration-300 ${
                openAccordion === item.id ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Accordion Content */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              openAccordion === item.id
                ? "max-h-[5000px] opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="p-6 lg:p-8 bg-white space-y-6">
              {/* Text Content */}
              {item.content && (
                <div className="prose prose-lg max-w-none space-y-4">
                  {item.content.split("\n\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="leading-relaxed text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html: formatContent(paragraph),
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Custom Content */}
              {item.customContent && <div>{item.customContent}</div>}

              {/* Files */}
              {item.files && item.files.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-foreground mb-4">
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
      ))}
    </div>
  );
}
