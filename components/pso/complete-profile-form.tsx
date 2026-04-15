"use client"

import { useActionState, useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { completePharmacienProfile } from "@/app/espace-pro/completer-profil/actions"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
      firstName: initialValues?.firstName ?? "",
      lastName: initialValues?.lastName ?? "",
      pharmacieAdresse: initialValues?.pharmacieAdresse ?? "",
      pharmacieFiness: initialValues?.pharmacieFiness ?? "",
      pharmacieNom: initialValues?.pharmacieNom ?? "",
      rpps: initialValues?.rpps ?? "",
      titulaire: initialValues?.titulaire ?? false,
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
    formData.set("firstName", values.firstName)
    formData.set("lastName", values.lastName)
    formData.set("rpps", values.rpps)
    formData.set("pharmacieNom", values.pharmacieNom)
    formData.set("pharmacieFiness", values.pharmacieFiness)
    formData.set("titulaire", String(values.titulaire))
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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} className="h-11 rounded-xl border-border/70" placeholder="Dupont" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input {...field} className="h-11 rounded-xl border-border/70" placeholder="Marie" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          name="titulaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titulaire</FormLabel>
              <FormControl>
                <label className="flex min-h-11 items-center gap-3 rounded-xl border border-border/70 bg-background px-4 py-2 text-sm text-foreground">
                  <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                  <span>Je suis le titulaire de cette officine</span>
                </label>
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
