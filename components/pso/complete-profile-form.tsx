"use client"

import { useActionState, useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { completePharmacienProfile } from "@/app/espace-pro/completer-profil/actions"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createEmptyFormActionState, type FormActionState } from "@/lib/pso/form-action-state"
import { completeProfileSchema, type CompleteProfileInput } from "@/lib/validations/pso"

type CompleteProfileFieldName = keyof CompleteProfileInput & string
type CompleteProfileFormProps = {
  initialValues?: Partial<CompleteProfileInput>
}

const INITIAL_STATE: FormActionState<CompleteProfileFieldName> = createEmptyFormActionState<CompleteProfileFieldName>()

export function CompleteProfileForm({ initialValues }: CompleteProfileFormProps) {
  const [state, formAction, isPending] = useActionState(completePharmacienProfile, INITIAL_STATE)
  const [isSubmitting, startTransition] = useTransition()
  const form = useForm<CompleteProfileInput>({
    defaultValues: {
      pharmacieAdresse: initialValues?.pharmacieAdresse ?? "",
      pharmacieFiness: initialValues?.pharmacieFiness ?? "",
      pharmacieNom: initialValues?.pharmacieNom ?? "",
      rpps: initialValues?.rpps ?? "",
    },
    resolver: zodResolver(completeProfileSchema),
  })

  useEffect(() => {
    form.clearErrors()

    for (const [fieldName, messages] of Object.entries(state.fieldErrors)) {
      const message = messages?.[0]

      if (!message) {
        continue
      }

      form.setError(fieldName as CompleteProfileFieldName, {
        message,
        type: "server",
      })
    }
  }, [form, state.fieldErrors])

  function onSubmit(values: CompleteProfileInput) {
    const formData = new FormData()
    formData.set("rpps", values.rpps)
    formData.set("pharmacieNom", values.pharmacieNom)
    formData.set("pharmacieFiness", values.pharmacieFiness)
    formData.set("pharmacieAdresse", values.pharmacieAdresse ?? "")

    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        {state.formError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {state.formError}
          </div>
        ) : null}

        <FormField
          control={form.control}
          name="rpps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RPPS</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  className="h-11 rounded-xl border-border/70"
                  inputMode="numeric"
                  placeholder="10 ou 11 chiffres"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pharmacieNom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la pharmacie</FormLabel>
              <FormControl>
                <Input {...field} className="h-11 rounded-xl border-border/70" placeholder="Pharmacie des Pins" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pharmacieFiness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro FINESS</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  className="h-11 rounded-xl border-border/70"
                  inputMode="numeric"
                  placeholder="9 chiffres"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pharmacieAdresse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-11 rounded-xl border-border/70"
                  placeholder="Optionnel"
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="h-11 w-full rounded-full font-semibold"
          disabled={isPending || isSubmitting}
          type="submit"
        >
          {isPending || isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Validation en cours...
            </>
          ) : (
            "Valider mon profil"
          )}
        </Button>
      </form>
    </Form>
  )
}
