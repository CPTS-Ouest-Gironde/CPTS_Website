import { Card, CardContent } from "@/components/ui/card"

type DashboardMetricCardProps = {
  eyebrow?: string
  helper?: string
  label: string
  value: string
}

export function DashboardMetricCard({ eyebrow, helper, label, value }: DashboardMetricCardProps) {
  return (
    <Card className="rounded-3xl border-border/80 bg-card shadow-sm">
      <CardContent className="space-y-3 p-5">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0a7a3e]">{eyebrow}</p> : null}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold text-foreground">{value}</p>
        </div>
        {helper ? <p className="text-sm text-muted-foreground">{helper}</p> : null}
      </CardContent>
    </Card>
  )
}
