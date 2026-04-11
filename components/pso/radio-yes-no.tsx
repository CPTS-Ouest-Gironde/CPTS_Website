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

type RadioYesNoProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
  className?: string
  control: Control<TFieldValues>
  description?: string
  falseLabel?: string
  label: string
  layout?: "cards" | "inline"
  name: TName
  trueLabel?: string
}

const RADIO_OPTIONS = [
  { label: "Oui", value: "true" },
  { label: "Non", value: "false" },
] as const

export function RadioYesNo<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  className,
  control,
  description,
  falseLabel = "Non",
  label,
  layout = "cards",
  name,
  trueLabel = "Oui",
}: RadioYesNoProps<TFieldValues, TName>) {
  const baseId = useId()
  const options = [
    { label: trueLabel, value: RADIO_OPTIONS[0].value },
    { label: falseLabel, value: RADIO_OPTIONS[1].value },
  ] as const

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValue =
          typeof field.value === "boolean" ? (field.value ? RADIO_OPTIONS[0].value : RADIO_OPTIONS[1].value) : ""

        return (
          <FormItem className={cn(layout === "inline" ? "space-y-2" : "space-y-3", className)}>
            <div className="space-y-1">
              <FormLabel>{label}</FormLabel>
              {description ? <FormDescription>{description}</FormDescription> : null}
            </div>
            <FormControl>
              <RadioGroup
                className={cn(layout === "inline" ? "flex flex-wrap gap-2.5" : "grid gap-3 sm:grid-cols-2")}
                onValueChange={(value) => field.onChange(value === RADIO_OPTIONS[0].value)}
                value={selectedValue}
              >
                {options.map((option) => {
                  const id = `${baseId}-${option.value}`
                  const isSelected = selectedValue === option.value

                  return (
                    <label
                      key={option.value}
                      className={cn(
                        layout === "inline"
                          ? "inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-2 text-sm transition-colors"
                          : "flex cursor-pointer items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3 transition-colors",
                        isSelected && "border-primary/50 bg-primary/5",
                      )}
                      htmlFor={id}
                    >
                      <RadioGroupItem id={id} value={option.value} />
                      <span className="text-sm font-medium text-foreground">{option.label}</span>
                    </label>
                  )
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
