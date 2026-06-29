"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getSatisfactionPsDashboardHref,
  type SatisfactionPsDashboardFilters,
} from "@/lib/satisfaction-ps/dashboard-filters"

type DashboardYearFilterBarProps = {
  filters: SatisfactionPsDashboardFilters
  yearOptions: number[]
}

export function DashboardYearFilterBar({ filters, yearOptions }: DashboardYearFilterBarProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [year, setYear] = useState(String(filters.year))

  useEffect(() => {
    setYear(String(filters.year))
  }, [filters.year])

  function handleYearChange(value: string) {
    setYear(value)

    startTransition(() => {
      router.push(
        getSatisfactionPsDashboardHref({
          year: Number(value),
        }),
        { scroll: false },
      )
    })
  }

  return (
    <div className="grid gap-2 sm:max-w-xs">
      <label className="space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Année</span>
        <Select disabled={isPending} onValueChange={handleYearChange} value={year}>
          <SelectTrigger className="h-10 w-full rounded-2xl bg-background">
            <SelectValue placeholder="Sélectionner une année" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      {isPending ? (
        <p className="text-xs font-medium text-[#0a7a3e]" role="status">
          Chargement des données...
        </p>
      ) : null}
    </div>
  )
}
