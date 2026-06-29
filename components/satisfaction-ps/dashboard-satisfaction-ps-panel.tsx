"use client"

import { useState } from "react"
import { MessageSquareText } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"
import { DashboardExportButton } from "@/components/satisfaction-ps/dashboard-export-button"
import { DashboardYearFilterBar } from "@/components/satisfaction-ps/dashboard-year-filter-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SatisfactionPsDashboardFilters } from "@/lib/satisfaction-ps/dashboard-filters"
import type {
  SatisfactionPsBooleanStat,
  SatisfactionPsDashboardStats,
  SatisfactionPsSectionStats,
  SatisfactionPsTextGroup,
} from "@/lib/satisfaction-ps/dashboard-stats"

type DashboardSatisfactionPsPanelProps = {
  exportHref: string
  filters: SatisfactionPsDashboardFilters
  stats: SatisfactionPsDashboardStats
  yearOptions: number[]
}

type BooleanStatCardProps = {
  item: SatisfactionPsBooleanStat
}

type TextResponsesCardProps = {
  group: SatisfactionPsTextGroup
}

type ThematicSectionProps = {
  knowledgeLabel: string
  section: SatisfactionPsSectionStats
  title: string
}

type SubjectTabValue = "chartes" | "site" | "vmv"

const PAGE_SIZE = 10
const SUBJECT_TABS: Array<{ label: string; value: SubjectTabValue }> = [
  {
    label: "Chartes radiologie et biologie",
    value: "chartes",
  },
  {
    label: "Site web et communication",
    value: "site",
  },
  {
    label: "Vis ma vie",
    value: "vmv",
  },
]
const chartConfig = {
  yesPct: {
    color: "#0a7a3e",
    label: "Oui",
  },
}

function formatDecimal(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))
}

function BooleanStatCard({ item }: BooleanStatCardProps) {
  return (
    <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base leading-snug">{item.label}</CardTitle>
        <p className="text-sm text-muted-foreground">{item.total} répondant(s)</p>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-foreground">Oui</span>
            <span className="text-sm font-semibold text-foreground">
              {item.yesCount} ({formatDecimal(item.yesPct)} %)
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#e4ece4]">
            <div
              className="h-2 rounded-full bg-[#0a7a3e]"
              style={{ width: `${Math.max(item.yesPct, item.yesCount > 0 ? 4 : 0)}%` }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-foreground">Non</span>
            <span className="text-sm font-semibold text-foreground">
              {item.noCount} ({formatDecimal(item.noPct)} %)
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#e4ece4]">
            <div
              className="h-2 rounded-full bg-muted-foreground/50"
              style={{ width: `${Math.max(item.noPct, item.noCount > 0 ? 4 : 0)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatPercentage(value: number) {
  return `${formatDecimal(value)} %`
}

function MetricCard({ value }: { value: string }) {
  return (
    <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
      <CardContent className="space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a7a3e]">Volume</p>
        <p className="text-sm font-medium text-muted-foreground">Réponses</p>
        <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">Nombre total de questionnaires reçus.</p>
      </CardContent>
    </Card>
  )
}

function KnowledgeOverviewChart({ stats }: { stats: SatisfactionPsDashboardStats }) {
  const data = [
    {
      dispositif: "Chartes",
      yesPct: stats.chartesSection.tauxConnaissance.pct,
    },
    {
      dispositif: "Site",
      yesPct: stats.siteSection.tauxConnaissance.pct,
    },
    {
      dispositif: "Vis ma vie",
      yesPct: stats.vmvSection.tauxConnaissance.pct,
    },
  ]

  return (
    <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">Taux de connaissance par dispositif</CardTitle>
        <p className="text-sm text-muted-foreground">Part des répondants ayant connaissance de chaque dispositif.</p>
      </CardHeader>
      <CardContent className="min-w-0 pt-0">
        <ChartContainer className="h-[280px] w-full min-w-0 aspect-auto" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ bottom: 8, left: -8, right: 8, top: 24 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="dispositif"
              interval={0}
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${formatDecimal(Number(value))} %`} />} />
            <Bar dataKey="yesPct" fill="var(--color-yesPct)" radius={[14, 14, 0, 0]}>
              <LabelList
                dataKey="yesPct"
                formatter={(value: number) => formatPercentage(value)}
                position="top"
                className="fill-foreground text-xs font-semibold"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function TextResponsesCard({ group }: TextResponsesCardProps) {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(group.responses.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const visibleResponses = group.responses.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquareText className="h-4 w-4 text-[#0a7a3e]" />
          {group.label}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{group.responses.length} réponse(s)</p>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {visibleResponses.length > 0 ? (
          <div className="space-y-3">
            {visibleResponses.map((response, index) => (
              <div
                key={`${group.field}-${response.submittedDate}-${index}`}
                className="space-y-2 rounded-2xl bg-[#f3f6f3] px-4 py-3"
              >
                <p className="text-xs font-medium text-muted-foreground">{formatDate(response.submittedDate)}</p>
                <p className="text-sm leading-relaxed text-foreground">{response.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucune réponse non vide.</p>
        )}

        {pageCount > 1 ? (
          <div className="flex items-center justify-between gap-3">
            <Button
              className="rounded-full"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              type="button"
              variant="outline"
            >
              Précédent
            </Button>
            <p className="text-sm text-muted-foreground">
              Page {currentPage} / {pageCount}
            </p>
            <Button
              className="rounded-full"
              disabled={currentPage === pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
              type="button"
              variant="outline"
            >
              Suivant
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function ThematicSection({ knowledgeLabel, section, title }: ThematicSectionProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="sr-only">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {section.tauxConnaissance.yesCount} / {section.tauxConnaissance.total} répondants {knowledgeLabel}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {section.booleanStats.map((item) => (
          <BooleanStatCard key={item.field} item={item} />
        ))}
      </div>

      {section.textGroups.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Réponses libres</h3>
          <div className="grid gap-6 xl:grid-cols-2">
            {section.textGroups.map((group) => (
              <TextResponsesCard key={group.field} group={group} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export function DashboardSatisfactionPsPanel({
  exportHref,
  filters,
  stats,
  yearOptions,
}: DashboardSatisfactionPsPanelProps) {
  const [activeSubject, setActiveSubject] = useState<SubjectTabValue>("chartes")

  return (
    <div className="space-y-8">
      <DashboardYearFilterBar filters={filters} yearOptions={yearOptions} />

      {!stats.hasData ? (
        <Card className="rounded-[2rem] border border-dashed border-border bg-card shadow-sm">
          <CardContent className="space-y-3 p-8">
            <h2 className="text-xl font-semibold text-foreground">
              Aucune réponse pour l&apos;année {stats.referenceYear}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Aucune réponse pour l&apos;année {stats.referenceYear}. Sélectionnez une autre année.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Synthèse globale</h2>
          <p className="text-sm text-muted-foreground">
            Synthèse des questionnaires anonymes professionnels de santé pour l&apos;année {stats.referenceYear}.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          <MetricCard value={String(stats.responseCount)} />
          <KnowledgeOverviewChart stats={stats} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Détails par sujet</h2>
          <p className="text-sm text-muted-foreground">
            Consultez les résultats par thème du questionnaire, avec les réponses libres associées.
          </p>
        </div>

        <Tabs
          className="space-y-6"
          onValueChange={(value) => setActiveSubject(value as SubjectTabValue)}
          value={activeSubject}
        >
          <div className="space-y-1.5 md:hidden">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Sujet</span>
            <Select onValueChange={(value) => setActiveSubject(value as SubjectTabValue)} value={activeSubject}>
              <SelectTrigger className="h-11 w-full rounded-2xl bg-background">
                <SelectValue placeholder="Sélectionner un sujet" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_TABS.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TabsList className="hidden h-auto w-fit justify-start rounded-[1.2rem] bg-[#e4ece4] p-1 md:inline-flex">
            {SUBJECT_TABS.map((tab) => (
              <TabsTrigger
                className="min-h-10 rounded-[1rem] px-4 text-sm data-[state=active]:bg-white data-[state=active]:text-[#0a7a3e]"
                key={tab.value}
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="chartes">
            <ThematicSection
              knowledgeLabel="connaissent ces chartes"
              section={stats.chartesSection}
              title="Chartes radiologie et biologie"
            />
          </TabsContent>
          <TabsContent value="site">
            <ThematicSection
              knowledgeLabel="connaissent le site"
              section={stats.siteSection}
              title="Site web et communication"
            />
          </TabsContent>
          <TabsContent value="vmv">
            <ThematicSection
              knowledgeLabel="connaissent Vis ma vie"
              section={stats.vmvSection}
              title="Vis ma vie"
            />
          </TabsContent>
        </Tabs>
      </section>

      <div className="flex justify-end">
        <DashboardExportButton disabled={!stats.hasData} href={exportHref} />
      </div>
        </>
      )}
    </div>
  )
}
