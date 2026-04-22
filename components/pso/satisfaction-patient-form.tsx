"use client"

import { useActionState, useEffect, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { submitSatisfactionPatient } from "@/app/satisfaction-patient/actions"
import { EchelleCinq } from "@/components/pso/echelle-cinq"
import { RadioYesNo } from "@/components/pso/radio-yes-no"
import { SelectField } from "@/components/pso/select-field"
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
import { Textarea } from "@/components/ui/textarea"
import { createEmptyFormActionState, type FormActionState } from "@/lib/pso/form-action-state"
import { PATIENT_SATISFACTION_SUBMITTED_STORAGE_KEY } from "@/lib/pso/satisfaction"
import {
  satisfactionPatientRaisonConsultationValues,
  satisfactionPatientRaisonVenueValues,
  satisfactionPatientSchema,
  type SatisfactionPatientInput,
} from "@/lib/validations/pso"

type SatisfactionPatientFieldName = keyof SatisfactionPatientInput & string

const INITIAL_STATE: FormActionState<SatisfactionPatientFieldName> =
  createEmptyFormActionState<SatisfactionPatientFieldName>()

const raisonVenueOptions = [
  { label: "Affiche sur la rhinite allergique à la pharmacie", value: "affiche_saison" },
  { label: "Gêne liée aux symptômes", value: "gene_symptomes" },
  { label: "Pas d'accès rapide à un médecin", value: "pas_acces_medecin" },
  { label: "Autres", value: "autres" },
] as const satisfies ReadonlyArray<{ label: string; value: (typeof satisfactionPatientRaisonVenueValues)[number] }>

const raisonConsultationOptions = [
  { label: "Effets indésirables", value: "effets_indesirables" },
  { label: "Pas d'amélioration", value: "pas_amelioration" },
  { label: "Aggravation", value: "aggravation" },
  { label: "Bilan allergologique", value: "bilan_allergologique" },
] as const satisfies ReadonlyArray<{
  label: string
  value: (typeof satisfactionPatientRaisonConsultationValues)[number]
}>

export function SatisfactionPatientForm() {
  const [state, formAction, isPending] = useActionState(submitSatisfactionPatient, INITIAL_STATE)
  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false)
  const [hasHydrated, setHasHydrated] = useState(false)
  const [isSubmitting, startTransition] = useTransition()
  const form = useForm<SatisfactionPatientInput>({
    defaultValues: {
      commentaire: "",
      raisonVenueAutre: "",
    },
    resolver: zodResolver(satisfactionPatientSchema),
  })

  const raisonVenue = form.watch("raisonVenue")
  const consultationMedecinApres = form.watch("consultationMedecinApres")

  useEffect(() => {
    const storedSubmission = window.localStorage.getItem(PATIENT_SATISFACTION_SUBMITTED_STORAGE_KEY)
    setHasAlreadySubmitted(Boolean(storedSubmission))
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (raisonVenue !== "autres") {
      form.setValue("raisonVenueAutre", "")
    }
  }, [form, raisonVenue])

  useEffect(() => {
    if (consultationMedecinApres !== true) {
      form.setValue("raisonConsultation", undefined)
    }
  }, [consultationMedecinApres, form])

  useEffect(() => {
    form.clearErrors()

    for (const [fieldName, messages] of Object.entries(state.fieldErrors)) {
      const message = messages?.[0]

      if (!message) {
        continue
      }

      form.setError(fieldName as keyof SatisfactionPatientInput, {
        message,
        type: "server",
      })
    }
  }, [form, state.fieldErrors])

  function onSubmit(values: SatisfactionPatientInput) {
    const formData = new FormData()

    formData.set("raisonVenue", values.raisonVenue ?? "")
    formData.set("raisonVenueAutre", values.raisonVenueAutre ?? "")
    formData.set("satisfactionPriseEnCharge", String(values.satisfactionPriseEnCharge ?? ""))
    formData.set("conseilsAide", String(values.conseilsAide ?? ""))
    formData.set("faciliteVie", String(values.faciliteVie ?? ""))
    formData.set("souhaitRenouvellement", String(values.souhaitRenouvellement))
    formData.set("consultationMedecinApres", String(values.consultationMedecinApres))
    formData.set("raisonConsultation", values.raisonConsultation ?? "")
    formData.set("commentaire", values.commentaire ?? "")

    startTransition(() => {
      formAction(formData)
    })
  }

  if (!hasHydrated) {
    return null
  }

  if (hasAlreadySubmitted) {
    return (
      <Card className="rounded-3xl border border-border/80 bg-card shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Vous avez déjà répondu à ce questionnaire. Merci pour votre participation.
          </p>
        </CardContent>
      </Card>
    )
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
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-[9999px] top-auto opacity-0"
            >
              <label htmlFor="website">Site web</label>
              <input
                autoComplete="off"
                id="website"
                name="website"
                tabIndex={-1}
                type="text"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Sur une échelle de 1 à 5 (1 étant « non, pas du tout » et 5 étant « oui, tout à fait »)
            </p>

            <SelectField
              control={form.control}
              label="Pour quelle raison êtes-vous venu aujourd'hui ?"
              name="raisonVenue"
              options={raisonVenueOptions}
              placeholder="Sélectionnez une réponse"
            />

            {raisonVenue === "autres" ? (
              <FormField
                control={form.control}
                name="raisonVenueAutre"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Si autres, précisez</FormLabel>
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

            <EchelleCinq
              compact
              control={form.control}
              label="Dans quelle mesure êtes-vous satisfait de la prise en charge proposée ?"
              name="satisfactionPriseEnCharge"
              showLegendLabels={false}
            />
            <EchelleCinq
              compact
              control={form.control}
              label="Les conseils vous ont-ils aidé ?"
              name="conseilsAide"
              showLegendLabels={false}
            />
            <EchelleCinq
              compact
              control={form.control}
              label="Cette prise en charge vous a-t-elle facilité la vie ?"
              name="faciliteVie"
              showLegendLabels={false}
            />

            <RadioYesNo
              control={form.control}
              label="Souhaiteriez-vous renouveler cette prise en charge si besoin ?"
              layout="inline"
              name="souhaitRenouvellement"
            />
            <RadioYesNo
              control={form.control}
              label="Avez-vous consulté un médecin après votre passage à la pharmacie ?"
              layout="inline"
              name="consultationMedecinApres"
            />

            {consultationMedecinApres ? (
              <SelectField
                control={form.control}
                label="Si oui, pour quelle raison ?"
                name="raisonConsultation"
                options={raisonConsultationOptions}
                placeholder="Sélectionnez une réponse"
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
