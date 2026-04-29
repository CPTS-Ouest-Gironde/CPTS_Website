import { ArrowRight } from "lucide-react";

interface TableOfContentsProps {
  items: Array<{
    id: string;
    title: string;
  }>;
}

export function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <nav
      aria-label="Sommaire de l'article"
      className="mt-10 rounded-3xl border border-border/80 bg-muted/30 p-5 md:p-6"
    >
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Sommaire
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="inline-flex items-start gap-2 rounded-2xl px-2 py-1 text-sm text-foreground transition-colors hover:text-primary md:text-base"
          >
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
