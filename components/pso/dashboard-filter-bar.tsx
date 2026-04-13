"use client"

import { useEffect, useState, useTransition } from "react"
import { Building2, Check, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  dashboardMonthOptions,
  getDashboardHref,
  getDashboardPharmacySummary,
  type DashboardFilters,
  type DashboardPharmacyOption,
} from "@/lib/pso/dashboard-filters"

type DashboardFilterBarProps = {
  filters: DashboardFilters
  pharmacies: DashboardPharmacyOption[]
  yearOptions: number[]
}

export function DashboardFilterBar({ filters, pharmacies, yearOptions }: DashboardFilterBarProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isPharmacyPickerOpen, setIsPharmacyPickerOpen] = useState(false)
  const [year, setYear] = useState(String(filters.year))
  const [startMonth, setStartMonth] = useState(String(filters.startMonth))
  const [endMonth, setEndMonth] = useState(String(filters.endMonth))
  const [selectedPharmacyIds, setSelectedPharmacyIds] = useState<string[]>(filters.pharmacyIds)

  const pharmacySummary = getDashboardPharmacySummary(pharmacies, selectedPharmacyIds)

  useEffect(() => {
    setYear(String(filters.year))
    setStartMonth(String(filters.startMonth))
    setEndMonth(String(filters.endMonth))
    setSelectedPharmacyIds(filters.pharmacyIds)
  }, [filters.endMonth, filters.pharmacyIds, filters.startMonth, filters.year])

  function togglePharmacy(pharmacyId: string) {
    setSelectedPharmacyIds((currentValue) =>
      currentValue.includes(pharmacyId)
        ? currentValue.filter((value) => value !== pharmacyId)
        : [...currentValue, pharmacyId],
    )
  }

  function applyFilters(nextFilters: DashboardFilters) {
    startTransition(() => {
      router.push(getDashboardHref(nextFilters), { scroll: false })
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsedYear = Number(year)
    const parsedStartMonth = Number(startMonth)
    const parsedEndMonth = Number(endMonth)
    const [normalizedStartMonth, normalizedEndMonth] =
      parsedStartMonth <= parsedEndMonth
        ? [parsedStartMonth, parsedEndMonth]
        : [parsedEndMonth, parsedStartMonth]

    applyFilters({
      endMonth: normalizedEndMonth,
      pharmacyIds: selectedPharmacyIds,
      startMonth: normalizedStartMonth,
      year: parsedYear,
    })
  }

  return (
    <form
      className="grid gap-3 lg:grid-cols-[minmax(120px,0.7fr)_minmax(150px,0.8fr)_minmax(150px,0.8fr)_minmax(260px,1.5fr)_auto] lg:items-end"
      onSubmit={handleSubmit}
    >
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

      <label className="space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Mois de début</span>
        <Select onValueChange={setStartMonth} value={startMonth}>
          <SelectTrigger className="h-10 w-full rounded-2xl bg-background">
            <SelectValue placeholder="Début" />
          </SelectTrigger>
          <SelectContent>
            {dashboardMonthOptions.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <label className="space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Mois de fin</span>
        <Select onValueChange={setEndMonth} value={endMonth}>
          <SelectTrigger className="h-10 w-full rounded-2xl bg-background">
            <SelectValue placeholder="Fin" />
          </SelectTrigger>
          <SelectContent>
            {dashboardMonthOptions.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <label className="space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Pharmacies</span>
        <Popover onOpenChange={setIsPharmacyPickerOpen} open={isPharmacyPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              className="h-10 w-full justify-between rounded-2xl border-border/80 bg-background px-4 text-left font-normal text-foreground shadow-xs"
              type="button"
              variant="outline"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Building2 className="h-4 w-4 text-[#0a7a3e]" />
                <span className="truncate">{pharmacySummary}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedPharmacyIds.length === 0 ? "Toutes" : selectedPharmacyIds.length}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[min(26rem,calc(100vw-2rem))] rounded-3xl p-0">
            <Command>
              <CommandInput placeholder="Rechercher une pharmacie" />
              <CommandList className="max-h-72">
                <CommandEmpty>Aucune pharmacie trouvée.</CommandEmpty>
                <CommandGroup>
                  {pharmacies.map((pharmacy) => {
                    const isSelected = selectedPharmacyIds.includes(pharmacy.id)

                    return (
                      <CommandItem key={pharmacy.id} onSelect={() => togglePharmacy(pharmacy.id)} value={pharmacy.nom}>
                        <Checkbox aria-hidden checked={isSelected} className="pointer-events-none" />
                        <span className="flex-1 truncate">{pharmacy.nom}</span>
                        {isSelected ? <Check className="h-4 w-4 text-[#0a7a3e]" /> : null}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
            <div className="flex items-center justify-between gap-2 border-t border-border/70 px-4 py-3">
              <Button
                className="rounded-full"
                onClick={() => setSelectedPharmacyIds([])}
                type="button"
                variant="ghost"
              >
                Tout afficher
              </Button>
              <Button
                className="rounded-full"
                onClick={() => setSelectedPharmacyIds(pharmacies.map((pharmacy) => pharmacy.id))}
                type="button"
                variant="ghost"
              >
                Tout sélectionner
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </label>

      <div className="flex lg:justify-end">
        <Button className="h-10 w-full rounded-full px-5 lg:w-auto" disabled={isPending} type="submit">
          <Filter className="h-4 w-4" />
          {isPending ? "Application..." : "Appliquer"}
        </Button>
      </div>
    </form>
  )
}
