"use client"

import { useActionState, useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { submitSatisfactionPharmacien } from "@/app/espace-pro/satisfaction/actions"
import { EchelleCinq } from "@/components/pso/echelle-cinq"
import { RadioYesNo } from "@/components/pso/radio-yes-no"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createEmptyFormActionState, type FormActionState } from "@/lib/pso/form-action-state"
import { satisfactionPharmacienSchema, type SatisfactionPharmacienInput } from "@/lib/validations/pso"

type SatisfactionPharmacienFieldName = keyof SatisfactionPharmacienInput & string

const INITIAL_STATE: FormActionState<SatisfactionPharmacienFieldName> =
  createEmptyFormActionState<SatisfactionPharmacienFieldName>()

export function SatisfactionPharmacienForm() {
  const [state, formAction, isPending] = useActionState(submitSatisfactionPharmacien, INITIAL_STATE)
  const [isSubmitting, startTransition] = useTransition()
  const form = useForm<SatisfactionPharmacienInput>({
    defaultValues: {
      commentaire: "",
      incidentsDescription: "",
      nbEffetsIndesirablesGraves: 0,
    },
    resolver: zodResolver(satisfactionPharmacienSchema),
  })

  const autresIncidents = form.watch("autresIncidents")

  useEffect(() => {
    if (autresIncidents !== true) {
      form.setValue("incidentsDescription", "")
    }
  }, [autresIncidents, form])

  useEffect(() => {
    form.clearErrors()

    for (const [fieldName, messages] of Object.entries(state.fieldErrors)) {
      const message = messages?.[0]

      if (!message) {
        continue
      }

      form.setError(fieldName as keyof SatisfactionPharmacienInput, {
        message,
        type: "server",
      })
    }
  }, [form, state.fieldErrors])

  function onSubmit(values: SatisfactionPharmacienInput) {
    const formData = new FormData()

    formData.set("satisfactionGlobale", String(values.satisfactionGlobale ?? ""))
    formData.set("faciliteMiseEnPlace", String(values.faciliteMiseEnPlace ?? ""))
    formData.set("beneficePratique", String(values.beneficePratique ?? ""))
    formData.set("accesSoins", String(values.accesSoins ?? ""))
    formData.set("appreciationPatients", String(values.appreciationPatients ?? ""))
    formData.set("nbEffetsIndesirablesGraves", String(values.nbEffetsIndesirablesGraves ?? ""))
    formData.set("autresIncidents", String(values.autresIncidents))
    formData.set("incidentsDescription", values.incidentsDescription ?? "")
    formData.set("commentaire", values.commentaire ?? "")

    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        {state.formError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {state.formError}
          </div>
        ) : null}

        <Card className="rounded-3xl border border-border/80 bg-card shadow-sm">
          <CardContent className="space-y-4 p-5 sm:p-6">
            <p className="text-sm italic text-muted-foreground">
              *sur une échelle de 1 à 5 : 1 pas du tout - 5 tout à fait
            </p>

            <div className="grid gap-4">
              <EchelleCinq
                compact
                control={form.control}
                label="Êtes-vous globalement satisfait du protocole sur la rhinite allergique/rhinoconjonctivite allergique ?"
                name="satisfactionGlobale"
                showLegendLabels={false}
              />
              <EchelleCinq
                compact
                control={form.control}
                label="Vous a-t-il paru facile à mettre en place ?"
                name="faciliteMiseEnPlace"
                showLegendLabels={false}
              />
              <EchelleCinq
                compact
                control={form.control}
                label="Ce protocole vous a-t-il apporté un bénéfice (service médical rendu) dans votre pratique quotidienne ?"
                name="beneficePratique"
                showLegendLabels={false}
              />
              <EchelleCinq
                compact
                control={form.control}
                label="A votre avis, a-t-il contribué à améliorer l'accès aux soins pour vos patients ?"
                name="accesSoins"
                showLegendLabels={false}
              />
              <EchelleCinq
                compact
                control={form.control}
                label="Vos patients ont-ils apprécié ce service ?"
                name="appreciationPatients"
                showLegendLabels={false}
              />

              <FormField
                control={form.control}
                name="nbEffetsIndesirablesGraves"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>
                      Combien d&apos;effets indésirables graves vous ont été remontés chez les patients ayant bénéficié
                      du protocole ?
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 max-w-40 rounded-xl border-border/70"
                        min={0}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                        type="number"
                        value={typeof field.value === "number" ? field.value : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <RadioYesNo
                control={form.control}
                label="Y-a-t-il eu d'autres incidents notables en lien avec le protocole ?"
                layout="inline"
                name="autresIncidents"
              />

              {autresIncidents ? (
                <FormField
                  control={form.control}
                  name="incidentsDescription"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Si oui, lesquels ?</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-20 rounded-2xl border-border/70"
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <FormField
                control={form.control}
                name="commentaire"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Ajouter un commentaire si vous le souhaitez</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-20 rounded-2xl border-border/70"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                className="h-11 rounded-full px-6 font-semibold"
                disabled={isPending || isSubmitting}
                type="submit"
              >
                {isPending || isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer mon questionnaire"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
