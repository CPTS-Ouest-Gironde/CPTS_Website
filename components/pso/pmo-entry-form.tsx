"use client"

import { useActionState, useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2, ShieldCheck } from "lucide-react"
import { createPmoEntry } from "@/app/espace-pro/pmo/nouveau/actions"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PMO_ENTRY_INITIAL_STATE, type PmoEntryActionState } from "@/lib/pso/pmo-form"
import {
  pmoEntrySchema,
  psoOrientationValues,
  psoPatientAgeValues,
  psoPatientSexeValues,
  psoProductCountValues,
  type PmoEntryInput,
} from "@/lib/validations/pso"

const TODAY = format(new Date(), "yyyy-MM-dd", { locale: fr })

const patientSexeOptions = psoPatientSexeValues.map((value) => ({
  label: value === "homme" ? "Homme" : "Femme",
  value,
}))

const patientAgeOptions = psoPatientAgeValues.map((value) => ({
  label: value,
  value,
}))

const orientationOptions = [
  { label: "Retour officine", value: "officine" },
  { label: "Médecin délégant", value: "medecin_delegant" },
  { label: "Médecin traitant", value: "medecin_traitant" },
  { label: "Urgences", value: "urgences" },
] as const

const productCountOptions = psoProductCountValues.map((value) => ({
  label: value,
  value,
}))

type PmoEntryFormProps = {
  defaultValues?: PmoEntryInput
  pendingLabel?: string
  submitAction?: (previousState: PmoEntryActionState, formData: FormData) => Promise<PmoEntryActionState>
  submitLabel?: string
}

const defaultFormValues: PmoEntryInput = {
  dateRealisation: TODAY,
  dispensationConseil: false,
  effetIndesirable: "",
  medecinDelegantNom: "",
  medecinDelegantRpps: "",
  nbProduitsConseil: "0",
  nbProduitsPmo: "0",
  orientation: psoOrientationValues[0],
  patientAge: psoPatientAgeValues[0],
  patientMedecinTraitant: true,
  patientSexe: psoPatientSexeValues[0],
  prescriptionAntiH1: false,
  prescriptionAntiallergiqueNasal: false,
  prescriptionCollyre: false,
  prescriptionCorticoideNasal: false,
}

export function PmoEntryForm({
  defaultValues = defaultFormValues,
  pendingLabel = "Enregistrement...",
  submitAction = createPmoEntry,
  submitLabel = "Enregistrer",
}: PmoEntryFormProps) {
  const [state, formAction, isPending] = useActionState(submitAction, PMO_ENTRY_INITIAL_STATE)
  const [isSubmitting, startTransition] = useTransition()
  const form = useForm<PmoEntryInput>({
    defaultValues,
    resolver: zodResolver(pmoEntrySchema),
  })

  useEffect(() => {
    form.clearErrors()

    for (const [fieldName, messages] of Object.entries(state.fieldErrors)) {
      const message = messages?.[0]

      if (!message) {
        continue
      }

      form.setError(fieldName as keyof PmoEntryInput, {
        message,
        type: "server",
      })
    }
  }, [form, state.fieldErrors])

  function onSubmit(values: PmoEntryInput) {
    const formData = new FormData()

    formData.set("dateRealisation", values.dateRealisation)
    formData.set("medecinDelegantNom", values.medecinDelegantNom)
    formData.set("medecinDelegantRpps", values.medecinDelegantRpps)
    formData.set("patientSexe", values.patientSexe)
    formData.set("patientAge", values.patientAge)
    formData.set("patientMedecinTraitant", String(values.patientMedecinTraitant))
    formData.set("orientation", values.orientation)
    formData.set("prescriptionAntiH1", String(values.prescriptionAntiH1))
    formData.set("prescriptionCollyre", String(values.prescriptionCollyre))
    formData.set("prescriptionAntiallergiqueNasal", String(values.prescriptionAntiallergiqueNasal))
    formData.set("prescriptionCorticoideNasal", String(values.prescriptionCorticoideNasal))
    formData.set("nbProduitsPmo", values.nbProduitsPmo)
    formData.set("dispensationConseil", String(values.dispensationConseil))
    formData.set("nbProduitsConseil", values.nbProduitsConseil)
    formData.set("effetIndesirable", values.effetIndesirable ?? "")

    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
        <p>Rappel : seules les données agrégées du protocole sont collectées ici.</p>
      </div>

      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          {state.formError ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {state.formError}
            </div>
          ) : null}

          <Card className="rounded-3xl border border-border/80 bg-card shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2 xl:grid-cols-4">
                <FormField
                  control={form.control}
                  name="dateRealisation"
                  render={({ field }) => (
                    <FormItem className="xl:col-span-2">
                      <FormLabel>Date de réalisation</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-11 rounded-xl border-border/70" type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SelectField
                  className="xl:col-span-2"
                  control={form.control}
                  label="Orientation"
                  name="orientation"
                  options={orientationOptions}
                  placeholder="Sélectionnez une orientation"
                />
                <FormField
                  control={form.control}
                  name="medecinDelegantNom"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 xl:col-span-3">
                      <FormLabel>Nom médecin délégant</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-11 rounded-xl border-border/70" placeholder="Nom du médecin" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medecinDelegantRpps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RPPS médecin délégant</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11 rounded-xl border-border/70"
                          inputMode="numeric"
                          placeholder="10 ou 11 chiffres"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="h-px bg-border/60 md:col-span-2 xl:col-span-4" />

                <SelectField
                  control={form.control}
                  className="xl:col-span-1"
                  label="Sexe"
                  name="patientSexe"
                  options={patientSexeOptions}
                  placeholder="Sélectionnez"
                />

                <SelectField
                  control={form.control}
                  className="xl:col-span-1"
                  label="Tranche d'âge"
                  name="patientAge"
                  options={patientAgeOptions}
                  placeholder="Sélectionnez"
                />

                <RadioYesNo
                  className="min-w-0 xl:col-span-2"
                  control={form.control}
                  label="Médecin traitant"
                  layout="inline"
                  name="patientMedecinTraitant"
                />

                <div className="h-px bg-border/60 md:col-span-2 xl:col-span-4" />

                <RadioYesNo
                  className="xl:col-span-1"
                  control={form.control}
                  label="Prescription anti-H1"
                  layout="inline"
                  name="prescriptionAntiH1"
                />
                <RadioYesNo
                  className="xl:col-span-1"
                  control={form.control}
                  label="Prescription collyre"
                  layout="inline"
                  name="prescriptionCollyre"
                />
                <RadioYesNo
                  className="xl:col-span-1"
                  control={form.control}
                  label="Prescription antiallergique nasal"
                  layout="inline"
                  name="prescriptionAntiallergiqueNasal"
                />
                <RadioYesNo
                  className="xl:col-span-1"
                  control={form.control}
                  label="Prescription corticoïde nasal"
                  layout="inline"
                  name="prescriptionCorticoideNasal"
                />

                <SelectField
                  className="xl:col-span-1"
                  control={form.control}
                  label="Nombre de produits PMO"
                  name="nbProduitsPmo"
                  options={productCountOptions}
                  placeholder="Sélectionnez"
                />

                <RadioYesNo
                  className="xl:col-span-1"
                  control={form.control}
                  label="Dispensation conseil"
                  layout="inline"
                  name="dispensationConseil"
                />

                <SelectField
                  className="xl:col-span-1"
                  control={form.control}
                  label="Nombre de produits conseil"
                  name="nbProduitsConseil"
                  options={productCountOptions}
                  placeholder="Sélectionnez"
                />

                <div aria-hidden="true" className="hidden xl:block" />

                <FormField
                  control={form.control}
                  name="effetIndesirable"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 xl:col-span-4">
                      <FormLabel>Effet indésirable</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-16 rounded-2xl border-border/70"
                          placeholder="Optionnel"
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end md:col-span-2 xl:col-span-4">
                  <Button
                    className="h-11 rounded-full px-6 font-semibold"
                    disabled={isPending || isSubmitting}
                    type="submit"
                  >
                    {isPending || isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {pendingLabel}
                      </>
                    ) : (
                      submitLabel
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
