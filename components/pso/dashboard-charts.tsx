"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { DashboardStats } from "@/lib/pso/dashboard-stats"

type DashboardChartsProps = {
  stats: DashboardStats
}

const ageChartConfig = {
  patients: {
    color: "#0a7a3e",
    label: "Patients",
  },
}

const sexChartConfig = {
  femmes: {
    color: "#0a7a3e",
    label: "Femmes",
  },
  hommes: {
    color: "#8fbf9e",
    label: "Hommes",
  },
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const ageData = [
    { age: "<15", patients: stats.repartitionAge["<15"] },
    { age: "15-20", patients: stats.repartitionAge["15-20"] },
    { age: "21-30", patients: stats.repartitionAge["21-30"] },
    { age: "31-40", patients: stats.repartitionAge["31-40"] },
    { age: "41-50", patients: stats.repartitionAge["41-50"] },
    { age: ">50", patients: stats.repartitionAge[">50"] },
  ]

  const sexData = [
    { fill: "#0a7a3e", key: "femmes", label: "Femmes", value: stats.repartitionSexe.femmes.n },
    { fill: "#8fbf9e", key: "hommes", label: "Hommes", value: stats.repartitionSexe.hommes.n },
  ]

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="rounded-3xl border-border/80 bg-card shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">Répartition par tranche d'âge</CardTitle>
          <p className="text-sm text-muted-foreground">Nombre de patients pris en charge sur la période.</p>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer className="h-[260px] w-full" config={ageChartConfig}>
            <BarChart accessibilityLayer data={ageData} margin={{ left: 4, right: 4, top: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis axisLine={false} dataKey="age" tickLine={false} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
              <Bar dataKey="patients" fill="var(--color-patients)" radius={[14, 14, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/80 bg-card shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">Répartition par sexe</CardTitle>
          <p className="text-sm text-muted-foreground">Vue d'ensemble de la patientèle PSO.</p>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer className="h-[260px] w-full" config={sexChartConfig}>
            <PieChart accessibilityLayer>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span>{name}</span>
                        <span className="font-mono">{value}</span>
                      </div>
                    )}
                  />
                }
              />
              <Pie data={sexData} dataKey="value" innerRadius={58} nameKey="label" outerRadius={88} paddingAngle={3}>
                {sexData.map((item) => (
                  <Cell key={item.key} fill={item.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="key" />} verticalAlign="bottom" />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
