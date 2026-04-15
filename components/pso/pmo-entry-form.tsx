"use client"

import { useActionState, useEffect, useState, useTransition, type BaseSyntheticEvent } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2, ShieldCheck } from "lucide-react"
import { createPmoEntry } from "@/app/espace-pro/pmo/nouveau/actions"
import { FloatingFeedbackToast } from "@/components/pso/floating-feedback-toast"
import { PmoDuplicateWarningDialog } from "@/components/pso/pmo-duplicate-warning-dialog"
import type { MedecinDelegantOption } from "@/lib/pso/medecins-delegants"
import { RadioYesNo } from "@/components/pso/radio-yes-no"
import { SelectField } from "@/components/pso/select-field"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  PMO_ENTRY_INITIAL_STATE,
  type PmoEntryActionState,
  type PmoEntrySubmissionMode,
} from "@/lib/pso/pmo-form"
import {
  pmoEntrySchema,
  psoOrientationValues,
  psoPatientAgeValues,
  psoPatientSexeValues,
  psoProductCountValues,
  type PmoEntryInput,
} from "@/lib/validations/pso"

const patientSexeOptions = psoPatientSexeValues.map((value) => ({
  label: value === "homme" ? "Homme" : "Femme",
  value,
}))

const patientAgeOptions = psoPatientAgeValues.map((value) => ({
  label: value,
  value,
}))

const orientationOptions = [
  { label: "Officine", value: "officine" },
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
  medecinsDelegants: readonly MedecinDelegantOption[]
  pendingLabel?: string
  showSaveAndCreateAnotherButton?: boolean
  submitAction?: (previousState: PmoEntryActionState, formData: FormData) => Promise<PmoEntryActionState>
  submitLabel?: string
}

function createDefaultFormValues(): PmoEntryInput {
  return {
    dateRealisation: format(new Date(), "yyyy-MM-dd", { locale: fr }),
    dispensationConseil: false,
    effetIndesirableDescription: "",
    effetIndesirableSignale: false,
    medecinDelegantId: "",
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
    renouvellement: false,
  }
}

export function PmoEntryForm({
  defaultValues = createDefaultFormValues(),
  medecinsDelegants,
  pendingLabel = "Enregistrement...",
  showSaveAndCreateAnotherButton = false,
  submitAction = createPmoEntry,
  submitLabel = "Enregistrer",
}: PmoEntryFormProps) {
  const [state, formAction, isPending] = useActionState(submitAction, PMO_ENTRY_INITIAL_STATE)
  const [isSubmitting, startTransition] = useTransition()
  const [activeSubmitMode, setActiveSubmitMode] = useState<PmoEntrySubmissionMode | null>(null)
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const form = useForm<PmoEntryInput>({
    defaultValues,
    resolver: zodResolver(pmoEntrySchema),
  })
  const medecinDelegantOptions = medecinsDelegants.map((medecinDelegant) => ({
    label: medecinDelegant.label,
    value: medecinDelegant.id,
  }))
  const selectedMedecinDelegantId = form.watch("medecinDelegantId")
  const effetIndesirableSignale = form.watch("effetIndesirableSignale")
  const selectedMedecinDelegant =
    medecinsDelegants.find((medecinDelegant) => medecinDelegant.id === selectedMedecinDelegantId) ?? null

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

    setActiveSubmitMode(null)
    setIsDuplicateDialogOpen(false)
  }, [form, state.fieldErrors, state.formError])

  useEffect(() => {
    if (effetIndesirableSignale !== true) {
      form.setValue("effetIndesirableDescription", "")
    }
  }, [effetIndesirableSignale, form])

  useEffect(() => {
    if (!state.didCreateAnother || !state.successKey || !state.successMessage) {
      return
    }

    const medecinDelegantId = form.getValues("medecinDelegantId")

    form.reset({
      ...createDefaultFormValues(),
      medecinDelegantId,
    })
    setActiveSubmitMode(null)
    setIsDuplicateDialogOpen(false)
    setToastMessage(state.successMessage)
  }, [form, state.didCreateAnother, state.successKey, state.successMessage])

  useEffect(() => {
    if (state.warningType !== "duplicate_warning" || !state.warningKey || !state.warningMessage) {
      return
    }

    setIsDuplicateDialogOpen(true)
  }, [state.warningKey, state.warningMessage, state.warningType])

  useEffect(() => {
    if (!toastMessage) {
      return
    }

    const timeout = window.setTimeout(() => {
      setToastMessage(null)
    }, 4000)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [toastMessage])

  function submitValues(values: PmoEntryInput, submissionMode: PmoEntrySubmissionMode, forceCreate = false) {
    const formData = new FormData()

    setActiveSubmitMode(submissionMode)
    formData.set("dateRealisation", values.dateRealisation)
    formData.set("effetIndesirableDescription", values.effetIndesirableDescription ?? "")
    formData.set("effetIndesirableSignale", String(values.effetIndesirableSignale))
    formData.set("medecinDelegantId", values.medecinDelegantId)
    formData.set("patientSexe", values.patientSexe)
    formData.set("patientAge", values.patientAge)
    formData.set("patientMedecinTraitant", String(values.patientMedecinTraitant))
    formData.set("orientation", values.orientation)
    formData.set("prescriptionAntiH1", String(values.prescriptionAntiH1))
    formData.set("prescriptionCollyre", String(values.prescriptionCollyre))
    formData.set("prescriptionAntiallergiqueNasal", String(values.prescriptionAntiallergiqueNasal))
    formData.set("prescriptionCorticoideNasal", String(values.prescriptionCorticoideNasal))
    formData.set("renouvellement", String(values.renouvellement))
    formData.set("nbProduitsPmo", values.nbProduitsPmo)
    formData.set("dispensationConseil", String(values.dispensationConseil))
    formData.set("nbProduitsConseil", values.nbProduitsConseil)
    formData.set("forceCreate", String(forceCreate))
    formData.set("submissionMode", submissionMode)

    startTransition(() => {
      formAction(formData)
    })
  }

  function onSubmit(values: PmoEntryInput, event?: BaseSyntheticEvent) {
    const nativeEvent = event?.nativeEvent
    const submitter =
      typeof SubmitEvent !== "undefined" && nativeEvent instanceof SubmitEvent
        ? nativeEvent.submitter
        : null
    const submissionMode =
      submitter instanceof HTMLButtonElement && submitter.value === "create_another"
        ? "create_another"
        : "default"

    submitValues(values, submissionMode)
  }

  function handleDuplicateWarningConfirm() {
    setIsDuplicateDialogOpen(false)
    submitValues(form.getValues(), activeSubmitMode ?? "default", true)
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
                  label="Prise en charge"
                  name="orientation"
                  options={orientationOptions}
                  placeholder="Sélectionnez une prise en charge"
                />
                <FormField
                  control={form.control}
                  name="renouvellement"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1 xl:col-span-2">
                      <FormLabel>Renouvellement</FormLabel>
                      <FormControl>
                        <label className="flex min-h-11 items-center gap-3 rounded-xl border border-border/70 bg-background px-4 py-2 text-sm text-foreground">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked === true)}
                          />
                          <span>Renouvellement de prise en charge</span>
                        </label>
                      </FormControl>
                      <FormDescription>À cocher s&apos;il s&apos;agit d&apos;un renouvellement.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div aria-hidden="true" className="hidden xl:block" />
                <SelectField
                  className="md:col-span-1 xl:col-span-2"
                  control={form.control}
                  label="Médecin délégant"
                  name="medecinDelegantId"
                  options={medecinDelegantOptions}
                  placeholder="Sélectionnez un médecin"
                />
                {selectedMedecinDelegant ? (
                  <div className="md:col-span-1 xl:col-span-1">
                    <p className="text-sm font-medium text-foreground">RPPS</p>
                    <div className="mt-2 flex h-11 items-center rounded-xl border border-border/70 bg-muted/35 px-4 text-sm text-muted-foreground">
                      RPPS : {selectedMedecinDelegant.rpps}
                    </div>
                  </div>
                ) : null}
                <div aria-hidden="true" className="hidden xl:block" />

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

                <RadioYesNo
                  className="md:col-span-2 xl:col-span-4"
                  control={form.control}
                  label="Effet indésirable signalé ?"
                  layout="inline"
                  name="effetIndesirableSignale"
                />

                {effetIndesirableSignale ? (
                  <FormField
                    control={form.control}
                    name="effetIndesirableDescription"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2 xl:col-span-4">
                        <FormLabel>Décrire l'effet indésirable</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-16 rounded-2xl border-border/70"
                            placeholder="Décrivez brièvement l'effet indésirable signalé"
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}

                <div className="flex flex-col justify-end gap-3 sm:flex-row md:col-span-2 xl:col-span-4">
                  <Button
                    className="h-11 rounded-full px-6 font-semibold"
                    disabled={isPending || isSubmitting}
                    name="submissionMode"
                    type="submit"
                    value="default"
                  >
                    {activeSubmitMode !== "create_another" && (isPending || isSubmitting) ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {pendingLabel}
                      </>
                    ) : (
                      submitLabel
                    )}
                  </Button>
                  {showSaveAndCreateAnotherButton ? (
                    <Button
                      className="h-11 rounded-full px-6 font-semibold"
                      disabled={isPending || isSubmitting}
                      name="submissionMode"
                      type="submit"
                      value="create_another"
                      variant="outline"
                    >
                      {activeSubmitMode === "create_another" && (isPending || isSubmitting) ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {pendingLabel}
                        </>
                      ) : (
                        "Enregistrer et nouvelle entrée"
                      )}
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {toastMessage ? <FloatingFeedbackToast message={toastMessage} onDismiss={() => setToastMessage(null)} /> : null}
      <PmoDuplicateWarningDialog
        isPending={isPending || isSubmitting}
        onConfirm={handleDuplicateWarningConfirm}
        onOpenChange={setIsDuplicateDialogOpen}
        open={isDuplicateDialogOpen}
      />
    </div>
  )
}
