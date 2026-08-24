import { ArrowRight, FileText } from "lucide-react";
import { AccordionItem } from "../types";

interface DispositifCardProps {
  item: AccordionItem;
  groupStep: string;
  groupLabel: string;
  accent: string;
  index: number;
  onOpen: (id: string) => void;
}

export function DispositifCard({
  item,
  groupStep,
  groupLabel,
  accent,
  index,
  onOpen,
}: DispositifCardProps) {
  const fileCount = item.files?.length ?? 0;

  return (
    <button
      type="button"
      onClick={() => onOpen(item.id)}
      style={{ animationDelay: `${Math.min(index, 11) * 35}ms` }}
      className="group relative flex h-full flex-col items-start gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 text-left transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 fill-mode-both hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {/* Filet d'accent qui se déploie au survol */}
      <span
        style={{ backgroundColor: accent }}
        className="absolute inset-x-0 top-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
      />

      <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        <span style={{ color: accent }}>{groupStep}</span>
        {groupLabel}
      </span>

      <span className="flex-1 text-base font-semibold leading-snug text-foreground text-balance transition-colors group-hover:text-primary">
        {item.title}
      </span>

      <span className="flex w-full items-center justify-between pt-1">
        {fileCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
            <FileText className="h-3 w-3" />
            {fileCount} document{fileCount > 1 ? "s" : ""}
          </span>
        ) : (
          <span />
        )}

        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Consulter
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </span>
    </button>
  );
}
