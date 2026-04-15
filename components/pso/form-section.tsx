import { cn } from "@/lib/utils"

type FormSectionProps = {
  className?: string
  description?: string
  eyebrow?: string
  title: string
}

export function FormSection({ className, description, eyebrow, title }: FormSectionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">{eyebrow}</p>
      ) : null}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground text-balance">{title}</h2>
        {description ? <p className="text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  )
}
