import { FileText } from "lucide-react";
import { AccordionItem } from "../types";

export interface DispositifGroup {
  id: string;
  step: string;
  title: string;
  navLabel: string;
  items: AccordionItem[];
}

interface DispositifNavProps {
  groups: DispositifGroup[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function DispositifNav({ groups, activeId, onSelect }: DispositifNavProps) {
  return (
    <nav aria-label="Liste des dispositifs" className="space-y-6">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="flex items-center gap-2 px-3 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span className="text-primary">{group.step}</span>
            {group.navLabel}
          </p>

          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = item.id === activeId;
              const fileCount = item.files?.length ?? 0;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`w-full flex items-start gap-2 rounded-xl px-3 py-2.5 text-left text-sm leading-snug transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground/75 hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    <span className="flex-1">{item.title}</span>
                    {fileCount > 0 && (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium flex-shrink-0 mt-0.5 ${
                          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                        title={`${fileCount} document${fileCount > 1 ? "s" : ""}`}
                      >
                        <FileText className="w-3 h-3" />
                        {fileCount}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
