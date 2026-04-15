"use client"

import { useId } from "react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

type EchelleCinqProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
  compact?: boolean
  control: Control<TFieldValues>
  description?: string
  label: string
  maxLabel?: string
  minLabel?: string
  name: TName
  showLegendLabels?: boolean
}

const SCALE_VALUES = ["1", "2", "3", "4", "5"] as const

const SCALE_SELECTED_STYLES: Record<(typeof SCALE_VALUES)[number], { backgroundColor: string; borderColor: string }> = {
  "1": {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  "2": {
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    borderColor: "rgba(245, 158, 11, 0.4)",
  },
  "3": {
    backgroundColor: "rgba(234, 179, 8, 0.12)",
    borderColor: "rgba(234, 179, 8, 0.4)",
  },
  "4": {
    backgroundColor: "rgba(34, 197, 94, 0.10)",
    borderColor: "rgba(34, 197, 94, 0.4)",
  },
  "5": {
    backgroundColor: "rgba(22, 163, 74, 0.12)",
    borderColor: "rgba(22, 163, 74, 0.4)",
  },
}

export function EchelleCinq<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  compact = false,
  control,
  description,
  label,
  maxLabel = "Tout à fait",
  minLabel = "Pas du tout",
  name,
  showLegendLabels = true,
}: EchelleCinqProps<TFieldValues, TName>) {
  const baseId = useId()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValue = typeof field.value === "number" ? String(field.value) : ""

        return (
          <FormItem className={cn(compact ? "space-y-2" : "space-y-3")}>
            <div className="space-y-1">
              <FormLabel>{label}</FormLabel>
              {description ? <FormDescription>{description}</FormDescription> : null}
            </div>
            <FormControl>
              <RadioGroup
                className={cn("grid", compact ? "gap-2" : "gap-3")}
                onValueChange={(value) => field.onChange(Number(value))}
                value={selectedValue}
              >
                <div className={cn("grid grid-cols-5 gap-2", compact && "max-w-[248px]")}>
                  {SCALE_VALUES.map((value) => {
                    const id = `${baseId}-${value}`
                    const isSelected = selectedValue === value

                    return (
                      <label
                        key={value}
                        className={cn(
                          "flex cursor-pointer items-center justify-center border border-border/70 bg-background text-center transition-colors",
                          compact
                            ? "h-10 w-10 rounded-xl"
                            : "rounded-2xl px-3 py-4",
                        )}
                        htmlFor={id}
                        style={isSelected ? SCALE_SELECTED_STYLES[value] : undefined}
                      >
                        <RadioGroupItem className="sr-only" id={id} value={value} />
                        <span className={cn("font-semibold text-foreground", compact ? "text-sm" : "text-2xl")}>
                          {value}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </RadioGroup>
            </FormControl>
            {showLegendLabels ? (
              <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
              </div>
            ) : null}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
