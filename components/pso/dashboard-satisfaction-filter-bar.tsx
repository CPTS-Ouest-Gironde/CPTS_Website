"use client"

import { useEffect, useState, useTransition } from "react"
import { Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getDashboardHref, type DashboardFilters } from "@/lib/pso/dashboard-filters"

type DashboardSatisfactionFilterBarProps = {
  filters: DashboardFilters
  yearOptions: number[]
}

export function DashboardSatisfactionFilterBar({
  filters,
  yearOptions,
}: DashboardSatisfactionFilterBarProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [year, setYear] = useState(String(filters.year))

  useEffect(() => {
    setYear(String(filters.year))
  }, [filters.year])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransition(() => {
      router.push(
        getDashboardHref(
          {
            ...filters,
            year: Number(year),
          },
          "satisfaction",
        ),
        { scroll: false },
      )
    })
  }

  return (
    <form className="grid gap-3 sm:grid-cols-[minmax(140px,0.7fr)_auto] sm:items-end" onSubmit={handleSubmit}>
      <label className="space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Année</span>
        <Select onValueChange={setYear} value={year}>
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

      <div className="flex justify-start sm:justify-end">
        <Button className="h-10 w-full rounded-full px-5 sm:w-auto" disabled={isPending} type="submit">
          <Filter className="h-4 w-4" />
          {isPending ? "Application..." : "Appliquer"}
        </Button>
      </div>
    </form>
  )
}
