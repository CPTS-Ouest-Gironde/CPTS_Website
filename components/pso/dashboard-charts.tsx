"use client"

import { useEffect, useState } from "react"
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

function formatPercentage(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value)
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)")
    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches)
    }

    updateIsMobile()
    mediaQuery.addEventListener("change", updateIsMobile)

    return () => {
      mediaQuery.removeEventListener("change", updateIsMobile)
    }
  }, [])

  const ageData = [
    { age: "<15", patients: stats.repartitionAge["<15"] },
    { age: "15-20", patients: stats.repartitionAge["15-20"] },
    { age: "21-30", patients: stats.repartitionAge["21-30"] },
    { age: "31-40", patients: stats.repartitionAge["31-40"] },
    { age: "41-50", patients: stats.repartitionAge["41-50"] },
    { age: ">50", patients: stats.repartitionAge[">50"] },
  ]

  const sexData = [
    {
      fill: "#0a7a3e",
      key: "femmes",
      label: "Femmes",
      pct: stats.repartitionSexe.femmes.pct,
      value: stats.repartitionSexe.femmes.n,
    },
    {
      fill: "#8fbf9e",
      key: "hommes",
      label: "Hommes",
      pct: stats.repartitionSexe.hommes.pct,
      value: stats.repartitionSexe.hommes.n,
    },
  ]

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-2">
      <Card className="rounded-3xl border-border/80 bg-card shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">Répartition par tranche d'âge</CardTitle>
          <p className="text-sm text-muted-foreground">Nombre de patients pris en charge sur la période.</p>
        </CardHeader>
        <CardContent className="min-w-0 pt-0">
          <ChartContainer className="h-[300px] w-full min-w-0 aspect-auto" config={ageChartConfig}>
            <BarChart
              accessibilityLayer
              data={ageData}
              margin={{ bottom: isMobile ? 24 : 0, left: isMobile ? -8 : 4, right: isMobile ? 0 : 4, top: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                angle={isMobile ? -28 : 0}
                axisLine={false}
                dataKey="age"
                height={isMobile ? 56 : 30}
                interval={0}
                textAnchor={isMobile ? "end" : "middle"}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickLine={false}
                width={isMobile ? 28 : 32}
              />
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
        <CardContent className="min-w-0 space-y-4 pt-0">
          <ChartContainer className="h-[300px] w-full min-w-0 aspect-auto" config={sexChartConfig}>
            <PieChart accessibilityLayer>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span>{name}</span>
                        <span className="font-mono">
                          {value} ({formatPercentage(Number(item.payload?.pct ?? 0))} %)
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={sexData}
                dataKey="value"
                innerRadius={isMobile ? 42 : 58}
                nameKey="label"
                outerRadius={isMobile ? 64 : 88}
                paddingAngle={3}
              >
                {sexData.map((item) => (
                  <Cell key={item.key} fill={item.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="grid gap-2 sm:grid-cols-2">
            {sexData.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 rounded-2xl bg-[#f3f6f3] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {item.value} ({formatPercentage(item.pct)} %)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
