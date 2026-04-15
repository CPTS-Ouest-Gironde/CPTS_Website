"use client"

import type { Control, FieldPath, FieldValues } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SelectOption = {
  label: string
  value: string
}

type SelectFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
  className?: string
  control: Control<TFieldValues>
  description?: string
  label: string
  name: TName
  options: readonly SelectOption[]
  placeholder: string
}

export function SelectField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  className,
  control,
  description,
  label,
  name,
  options,
  placeholder,
}: SelectFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const fieldValue =
          typeof field.value === "string" && field.value.length > 0 ? field.value : undefined

        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            {description ? <FormDescription>{description}</FormDescription> : null}
            <FormControl>
              <Select onValueChange={field.onChange} value={fieldValue}>
                <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
