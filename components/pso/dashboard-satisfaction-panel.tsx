import { MessageSquareText, Stethoscope } from "lucide-react"
import { DashboardMetricCard } from "@/components/pso/dashboard-metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type {
  DashboardBreakdownItem,
  DashboardQuestionAverage,
  DashboardSatisfactionStats,
} from "@/lib/pso/dashboard-satisfaction"

type DashboardSatisfactionPanelProps = {
  stats: DashboardSatisfactionStats
}

type BreakdownListProps = {
  emptyMessage: string
  items: DashboardBreakdownItem[]
  note?: string
  title: string
}

type QuestionAverageListProps = {
  items: DashboardQuestionAverage[]
  title: string
}

type TextCollectionCardProps = {
  emptyMessage: string
  icon: typeof MessageSquareText
  items: string[]
  title: string
}

function formatDecimal(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value)
}

function formatPercentage(value: number) {
  return `${formatDecimal(value)} %`
}

function formatCountAndPercentage(count: number, percentage: number) {
  return `${count} (${formatPercentage(percentage)})`
}

function BreakdownList({ emptyMessage, items, note, title }: BreakdownListProps) {
  return (
    <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">{title}</CardTitle>
        {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {items.some((item) => item.count > 0) ? (
          items.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-foreground">{item.label}</span>
                <span className="text-sm font-semibold text-foreground">
                  {item.count} ({formatPercentage(item.pct)})
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#e4ece4]">
                <div
                  className="h-2 rounded-full bg-[#0a7a3e]"
                  style={{ width: `${Math.max(item.pct, item.count > 0 ? 4 : 0)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  )
}

function QuestionAverageList({ items, title }: QuestionAverageListProps) {
  return (
    <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-start justify-between gap-4 rounded-2xl bg-[#f3f6f3] px-4 py-3"
          >
            <p className="text-sm leading-relaxed text-foreground">{item.label}</p>
            <p className="shrink-0 text-sm font-semibold text-foreground">{formatDecimal(item.average)} / 5</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function TextCollectionCard({ emptyMessage, icon: Icon, items, title }: TextCollectionCardProps) {
  return (
    <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-[#0a7a3e]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={`${title}-${index}-${item.slice(0, 24)}`} className="rounded-2xl bg-[#f3f6f3] px-4 py-3">
                <p className="text-sm leading-relaxed text-foreground">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardSatisfactionPanel({ stats }: DashboardSatisfactionPanelProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Retours pharmaciens</h2>
          <p className="text-sm text-muted-foreground">
            Synthèse des questionnaires complétés par les pharmaciens pour l&apos;année {stats.pharmaciens.referenceYear}.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardMetricCard
            eyebrow="Volume"
            helper="Nombre total de questionnaires reçus."
            label="Réponses"
            value={String(stats.pharmaciens.responseCount)}
          />
          <DashboardMetricCard
            eyebrow="Vigilance"
            helper="Total remonté sur l'ensemble des questionnaires."
            label="Effets indésirables graves"
            value={String(stats.pharmaciens.totalSeriousAdverseEffects)}
          />
        </div>

        <QuestionAverageList items={stats.pharmaciens.questionAverages} title="Moyenne par question" />

        <div className="grid gap-6 xl:grid-cols-2">
          <TextCollectionCard
            emptyMessage="Aucun incident notable n'a été signalé."
            icon={Stethoscope}
            items={stats.pharmaciens.incidents}
            title="Incidents signalés"
          />
          <TextCollectionCard
            emptyMessage="Aucun commentaire pharmacien n'a été laissé."
            icon={MessageSquareText}
            items={stats.pharmaciens.comments}
            title="Commentaires"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Retours patients</h2>
          <p className="text-sm text-muted-foreground">
            Données globales du questionnaire patient, indépendantes du filtre annuel pharmacien.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardMetricCard
            eyebrow="Volume"
            helper="Nombre total de questionnaires patients reçus."
            label="Réponses"
            value={String(stats.patients.responseCount)}
          />
          <DashboardMetricCard
            eyebrow="Intention"
            helper="Part des patients souhaitant renouveler cette prise en charge."
            label="Souhait de renouvellement"
            value={formatCountAndPercentage(stats.patients.renewalCount, stats.patients.renewalRate)}
          />
          <DashboardMetricCard
            eyebrow="Parcours"
            helper="Part des patients ayant consulté un médecin après le passage à la pharmacie."
            label="Consultation médecin après"
            value={formatCountAndPercentage(
              stats.patients.consultationAfterCount,
              stats.patients.consultationAfterRate,
            )}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <BreakdownList
            emptyMessage="Aucune raison de venue n'a encore été renseignée."
            items={stats.patients.venueReasons}
            title="Répartition des raisons de venue"
          />
          <QuestionAverageList items={stats.patients.questionAverages} title="Moyenne par question" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <BreakdownList
            emptyMessage="Aucune raison de consultation n'a été renseignée."
            items={stats.patients.consultationReasons}
            note="Répartition calculée parmi les patients ayant renseigné une raison de consultation."
            title="Répartition des raisons de consultation"
          />
          <TextCollectionCard
            emptyMessage="Aucun commentaire patient n'a été laissé."
            icon={MessageSquareText}
            items={stats.patients.comments}
            title="Commentaires"
          />
        </div>
      </section>
    </div>
  )
}
