"use client"

import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type BaseSyntheticEvent,
  type ReactNode,
} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useForm, type FieldPath } from "react-hook-form"
import { submitSatisfactionPs } from "@/app/espace-pro/satisfaction-ps/actions"
import { FormSection } from "@/components/pso/form-section"
import { RadioYesNo } from "@/components/pso/radio-yes-no"
import { PS_SATISFACTION_DRAFT_STORAGE_KEY } from "@/components/satisfaction-ps/satisfaction-ps-draft-storage"
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
import { cn } from "@/lib/utils"
import { satisfactionPsSchema, type SatisfactionPsInput } from "@/lib/validations/satisfaction-ps"

type SatisfactionPsFieldName = keyof SatisfactionPsInput & string
type TextFieldName = Extract<
  SatisfactionPsFieldName,
  | "chartesSuggestionsTexte"
  | "siteRubriquesUtiles"
  | "siteSuggestionsTexte"
  | "vmvSuggestionsTexte"
  | "vmvUtiliteTexte"
>
type DraftPayload = {
  currentStep: number
  savedAt: number
  values: Partial<SatisfactionPsInput>
}

const INITIAL_STATE: FormActionState<SatisfactionPsFieldName> =
  createEmptyFormActionState<SatisfactionPsFieldName>()
const DRAFT_TTL_MS = 365 * 24 * 60 * 60 * 1000
const LAST_STEP_INDEX = 2
const CONTACT_EMAIL = "cptsouestgironde@gmail.com"
const SUBJECT_FIELDS = [
  [
    "chartesConnaissance",
    "chartesSouhaitReception",
    "chartesDispositifsUtilises",
    "chartesSatisfaction",
    "chartesSuggestions",
  ],
  [
    "siteConnaissance",
    "siteConsultation",
    "siteUtilite",
    "outilsConnaissance",
    "outilsUtilisation",
    "accesDistinctPertinent",
    "siteOutilPrevention",
  ],
  ["vmvConnaissance", "vmvUtilise", "vmvSuggestions"],
] as const satisfies ReadonlyArray<ReadonlyArray<FieldPath<SatisfactionPsInput>>>
const SUBJECT_VISIBLE_FIELDS = [
  [...SUBJECT_FIELDS[0], "chartesSuggestionsTexte"],
  [
    ...SUBJECT_FIELDS[1],
    "siteRubriquesUtiles",
    "siteSuggestionsTexte",
  ],
  [...SUBJECT_FIELDS[2], "vmvUtiliteTexte", "vmvSuggestionsTexte"],
] as const satisfies ReadonlyArray<ReadonlyArray<FieldPath<SatisfactionPsInput>>>

function TextareaField({
  form,
  label,
  name,
}: {
  form: ReturnType<typeof useForm<SatisfactionPsInput>>
  label: string
  name: TextFieldName
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{label}</FormLabel>
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
  )
}

function FieldAnchor({
  children,
  name,
}: {
  children: ReactNode
  name: FieldPath<SatisfactionPsInput>
}) {
  return <div data-satisfaction-ps-field={name}>{children}</div>
}

function readDraft() {
  const rawDraft = window.localStorage.getItem(PS_SATISFACTION_DRAFT_STORAGE_KEY)

  if (!rawDraft) {
    return null
  }

  try {
    const draft = JSON.parse(rawDraft) as DraftPayload

    if (!draft.savedAt || Date.now() - draft.savedAt > DRAFT_TTL_MS) {
      window.localStorage.removeItem(PS_SATISFACTION_DRAFT_STORAGE_KEY)
      return null
    }

    return draft
  } catch {
    window.localStorage.removeItem(PS_SATISFACTION_DRAFT_STORAGE_KEY)
    return null
  }
}

function scrollToFormTop() {
  window.requestAnimationFrame(() => {
    document.getElementById("satisfaction-ps-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  })
}

function ProgressHeader({
  progressValue,
  subjectLabel,
}: {
  progressValue: number
  subjectLabel: string
}) {
  return (
    <div className="space-y-3 rounded-2xl bg-[#f5f8f5] p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-foreground">{subjectLabel}</p>
      </div>
      <div className="h-2 rounded-full bg-[#e4ece4]">
        <div
          className="h-2 rounded-full bg-[#0a7a3e] transition-all"
          style={{ width: `${progressValue}%` }}
        />
      </div>
    </div>
  )
}

function SubmissionErrorAlert({ message }: { message: string }) {
  const [beforeEmail, afterEmail = ""] = message.split(CONTACT_EMAIL)

  return (
    <div
      className="flex gap-3 rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-destructive"
      role="alert"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        {beforeEmail}
        {message.includes(CONTACT_EMAIL) ? (
          <a className="font-semibold underline underline-offset-2" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        ) : null}
        {afterEmail}
      </p>
    </div>
  )
}

function DevResetButton() {
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  function resetLocalFormState() {
    window.localStorage.removeItem(PS_SATISFACTION_DRAFT_STORAGE_KEY)
    window.location.reload()
  }

  return (
    <div className="flex justify-center pt-2">
      <Button
        className="h-9 rounded-full px-4 text-xs"
        onClick={resetLocalFormState}
        type="button"
        variant="ghost"
      >
        Réinitialiser le formulaire
      </Button>
    </div>
  )
}

export function SatisfactionPsForm() {
  const [state, formAction, isPending] = useActionState(submitSatisfactionPs, INITIAL_STATE)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasHydrated, setHasHydrated] = useState(false)
  const [validationWarningStep, setValidationWarningStep] = useState<number | null>(null)
  const [validationErrorFields, setValidationErrorFields] = useState<
    ReadonlyArray<FieldPath<SatisfactionPsInput>>
  >([])
  const [isSubmitting, startTransition] = useTransition()
  const form = useForm<SatisfactionPsInput>({
    defaultValues: {
      chartesSuggestionsTexte: "",
      siteRubriquesUtiles: "",
      siteSuggestionsTexte: "",
      vmvSuggestionsTexte: "",
      vmvUtiliteTexte: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(satisfactionPsSchema),
  })
  const watchedValues = form.watch()
  const progressValue = ((currentStep + 1) / (LAST_STEP_INDEX + 1)) * 100
  const subjectLabel = `Sujet ${currentStep + 1} sur ${LAST_STEP_INDEX + 1}`
  const showSubmissionError = Boolean(state.formError) && !isPending && !isSubmitting
  const subjectTitles = useMemo(
    () => [
      "Chartes radiologie et biologie",
      "Site web et communication",
      "Vis ma vie",
    ],
    [],
  )
  const resetNavigationState = useCallback(() => {
    form.clearErrors()
    setValidationWarningStep(null)
    setValidationErrorFields([])
    form.reset(form.getValues(), {
      keepDefaultValues: true,
      keepDirty: true,
      keepErrors: false,
      keepIsSubmitted: false,
      keepSubmitCount: false,
      keepTouched: false,
    })
  }, [form])

  const scrollToFirstError = useCallback(
    (fieldNames: ReadonlyArray<FieldPath<SatisfactionPsInput>>) => {
      window.requestAnimationFrame(() => {
        const firstErrorField = fieldNames.find(
          (fieldName) => form.getFieldState(fieldName).invalid,
        )

        if (!firstErrorField) {
          return
        }

        const fieldElement = document.querySelector(
          `[data-satisfaction-ps-field="${firstErrorField}"]`,
        )

        fieldElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      })
    },
    [form],
  )

  const showValidationWarning = useCallback(
    (fieldNames: ReadonlyArray<FieldPath<SatisfactionPsInput>>) => {
      const invalidFields = fieldNames.filter(
        (fieldName) => form.getFieldState(fieldName).invalid,
      )

      setValidationWarningStep(currentStep)
      setValidationErrorFields(invalidFields.length > 0 ? invalidFields : fieldNames)
      scrollToFirstError(fieldNames)
    },
    [currentStep, form, scrollToFirstError],
  )

  useEffect(() => {
    const draft = readDraft()

    if (draft) {
      form.reset({
        chartesSuggestionsTexte: "",
        siteRubriquesUtiles: "",
        siteSuggestionsTexte: "",
        vmvSuggestionsTexte: "",
        vmvUtiliteTexte: "",
        ...draft.values,
      })
      setCurrentStep(Math.min(Math.max(draft.currentStep, 0), LAST_STEP_INDEX))
    }

    setHasHydrated(true)
  }, [form])

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    const draft: DraftPayload = {
      currentStep,
      savedAt: Date.now(),
      values: watchedValues,
    }

    window.localStorage.setItem(PS_SATISFACTION_DRAFT_STORAGE_KEY, JSON.stringify(draft))
  }, [currentStep, hasHydrated, watchedValues])

  useEffect(() => {
    form.clearErrors()

    for (const [fieldName, messages] of Object.entries(state.fieldErrors)) {
      const message = messages?.[0]

      if (!message) {
        continue
      }

      form.setError(fieldName as keyof SatisfactionPsInput, {
        message,
        type: "server",
      })
    }
  }, [form, state.fieldErrors])

  useEffect(() => {
    resetNavigationState()
    window.requestAnimationFrame(resetNavigationState)
  }, [currentStep, resetNavigationState])

  useEffect(() => {
    if (validationWarningStep === null || validationErrorFields.length === 0) {
      return
    }

    const hasAnsweredAnErroredField = validationErrorFields.some(
      (fieldName) => typeof watchedValues[fieldName] === "boolean",
    )

    if (hasAnsweredAnErroredField) {
      setValidationWarningStep(null)
      setValidationErrorFields([])
    }
  }, [validationErrorFields, validationWarningStep, watchedValues])

  async function handleNext() {
    const isSubjectValid = await form.trigger(SUBJECT_FIELDS[currentStep], {
      shouldFocus: true,
    })

    if (!isSubjectValid) {
      showValidationWarning(SUBJECT_FIELDS[currentStep])
      return
    }

    resetNavigationState()
    setCurrentStep((value) => Math.min(value + 1, LAST_STEP_INDEX))
    window.requestAnimationFrame(resetNavigationState)
    scrollToFormTop()
  }

  function onInvalidSubmit() {
    showValidationWarning(SUBJECT_VISIBLE_FIELDS[currentStep])
  }

  function handlePrevious() {
    resetNavigationState()
    setCurrentStep((value) => Math.max(value - 1, 0))
    window.requestAnimationFrame(resetNavigationState)
    scrollToFormTop()
  }

  function onSubmit(values: SatisfactionPsInput, event?: BaseSyntheticEvent) {
    const target = event?.currentTarget
    const formData = target instanceof HTMLFormElement ? new FormData(target) : new FormData()

    formData.set("accesDistinctPertinent", String(values.accesDistinctPertinent))
    formData.set("chartesConnaissance", String(values.chartesConnaissance))
    formData.set("chartesDispositifsUtilises", String(values.chartesDispositifsUtilises))
    formData.set("chartesSatisfaction", String(values.chartesSatisfaction))
    formData.set("chartesSouhaitReception", String(values.chartesSouhaitReception))
    formData.set("chartesSuggestions", String(values.chartesSuggestions))
    formData.set("chartesSuggestionsTexte", values.chartesSuggestionsTexte ?? "")
    formData.set("outilsConnaissance", String(values.outilsConnaissance))
    formData.set("outilsUtilisation", String(values.outilsUtilisation))
    formData.set("siteConnaissance", String(values.siteConnaissance))
    formData.set("siteConsultation", String(values.siteConsultation))
    formData.set("siteOutilPrevention", String(values.siteOutilPrevention))
    formData.set("siteRubriquesUtiles", values.siteRubriquesUtiles ?? "")
    formData.set("siteSuggestionsTexte", values.siteSuggestionsTexte ?? "")
    formData.set("siteUtilite", String(values.siteUtilite))
    formData.set("vmvConnaissance", String(values.vmvConnaissance))
    formData.set("vmvSuggestions", String(values.vmvSuggestions))
    formData.set("vmvSuggestionsTexte", values.vmvSuggestionsTexte ?? "")
    formData.set("vmvUtilise", String(values.vmvUtilise))
    formData.set("vmvUtiliteTexte", values.vmvUtiliteTexte ?? "")

    startTransition(() => {
      formAction(formData)
    })
  }

  if (!hasHydrated) {
    return null
  }

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        id="satisfaction-ps-form"
        onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
      >
        <Card className={cn("rounded-3xl border border-border/80 bg-card shadow-sm", currentStep !== 0 && "hidden")}>
          <CardContent className="space-y-5 p-5 sm:p-6">
            {showSubmissionError && state.formError ? <SubmissionErrorAlert message={state.formError} /> : null}
            <ProgressHeader progressValue={progressValue} subjectLabel={subjectLabel} />
            <FormSection
              description="Pour fluidifier le parcours patient, des chartes ont été signées en 2025 avec nos partenaires cabinets de radiologie et laboratoires de biologie du territoire."
              eyebrow="Sujet 1"
              title={subjectTitles[0]}
            />
            <FieldAnchor name="chartesConnaissance">
              <RadioYesNo
                control={form.control}
                label="Avez-vous eu connaissance de ces chartes ?"
                layout="inline"
                name="chartesConnaissance"
              />
            </FieldAnchor>
            <FieldAnchor name="chartesSouhaitReception">
              <RadioYesNo
                control={form.control}
                label="Souhaitez-vous les recevoir ?"
                layout="inline"
                name="chartesSouhaitReception"
              />
            </FieldAnchor>
            <FieldAnchor name="chartesDispositifsUtilises">
              <RadioYesNo
                control={form.control}
                label="Avez-vous utilisé les dispositifs proposés (numéro d'urgence, cartographie) ?"
                layout="inline"
                name="chartesDispositifsUtilises"
              />
            </FieldAnchor>
            <FieldAnchor name="chartesSatisfaction">
              <RadioYesNo
                control={form.control}
                label="Êtes-vous satisfait(e) de ces dispositifs ?"
                layout="inline"
                name="chartesSatisfaction"
              />
            </FieldAnchor>
            <FieldAnchor name="chartesSuggestions">
              <RadioYesNo
                control={form.control}
                label="Avez-vous des suggestions à nous proposer ?"
                layout="inline"
                name="chartesSuggestions"
              />
            </FieldAnchor>
            <FieldAnchor name="chartesSuggestionsTexte">
              <TextareaField form={form} label="Précisez :" name="chartesSuggestionsTexte" />
            </FieldAnchor>
          </CardContent>
        </Card>

        <Card className={cn("rounded-3xl border border-border/80 bg-card shadow-sm", currentStep !== 1 && "hidden")}>
          <CardContent className="space-y-5 p-5 sm:p-6">
            {showSubmissionError && state.formError ? <SubmissionErrorAlert message={state.formError} /> : null}
            <ProgressHeader progressValue={progressValue} subjectLabel={subjectLabel} />
            <FormSection
              description="Pour améliorer notre communication auprès des patients et des professionnels de santé de notre territoire, la CPTS a créé un nouveau site internet ainsi que la diffusion d'informations via les réseaux sociaux."
              eyebrow="Sujet 2"
              title={subjectTitles[1]}
            />
            <FieldAnchor name="siteConnaissance">
              <RadioYesNo
                control={form.control}
                label="En avez-vous connaissance ?"
                layout="inline"
                name="siteConnaissance"
              />
            </FieldAnchor>
            <FieldAnchor name="siteConsultation">
              <RadioYesNo
                control={form.control}
                label="Le consultez-vous ?"
                layout="inline"
                name="siteConsultation"
              />
            </FieldAnchor>
            <FieldAnchor name="siteUtilite">
              <RadioYesNo
                control={form.control}
                label="Vous est-il utile dans votre pratique quotidienne ?"
                layout="inline"
                name="siteUtilite"
              />
            </FieldAnchor>
            <FieldAnchor name="siteRubriquesUtiles">
              <TextareaField
                form={form}
                label="Quelles sont les rubriques qui vous semblent les plus utiles ?"
                name="siteRubriquesUtiles"
              />
            </FieldAnchor>
            <FieldAnchor name="outilsConnaissance">
              <RadioYesNo
                control={form.control}
                label="Savez-vous qu'un certain nombre d'outils et de supports en communication sont mis à disposition et accessibles en commande (envoyée aux adhérents) ?"
                layout="inline"
                name="outilsConnaissance"
              />
            </FieldAnchor>
            <FieldAnchor name="outilsUtilisation">
              <RadioYesNo
                control={form.control}
                label="Utilisez-vous certains des outils proposés ?"
                layout="inline"
                name="outilsUtilisation"
              />
            </FieldAnchor>
            <FieldAnchor name="accesDistinctPertinent">
              <RadioYesNo
                control={form.control}
                label="Le fait d'avoir un accès distinct professionnels de santé / patients vous semble-t-il pertinent ?"
                layout="inline"
                name="accesDistinctPertinent"
              />
            </FieldAnchor>
            <FieldAnchor name="siteOutilPrevention">
              <RadioYesNo
                control={form.control}
                label="Utilisez-vous le site comme outil de prévention auprès de vos patients (articles, ressources locales et fiches de suivi) ?"
                layout="inline"
                name="siteOutilPrevention"
              />
            </FieldAnchor>
            <FieldAnchor name="siteSuggestionsTexte">
              <TextareaField
                form={form}
                label="Avez-vous des suggestions ou propositions ?"
                name="siteSuggestionsTexte"
              />
            </FieldAnchor>
          </CardContent>
        </Card>

        <Card className={cn("rounded-3xl border border-border/80 bg-card shadow-sm", currentStep !== 2 && "hidden")}>
          <CardContent className="space-y-5 p-5 sm:p-6">
            {showSubmissionError && state.formError ? <SubmissionErrorAlert message={state.formError} /> : null}
            <ProgressHeader progressValue={progressValue} subjectLabel={subjectLabel} />
            <FormSection
              description="Pour mieux se connaître entre professionnels de santé, la CPTS Ouest Gironde propose un dispositif intitulé Vis ma vie (découverte sur une demi-journée de l'exercice d'un professionnel de santé)."
              eyebrow="Sujet 3"
              title={subjectTitles[2]}
            />
            <FieldAnchor name="vmvConnaissance">
              <RadioYesNo
                control={form.control}
                label="En avez-vous eu connaissance ?"
                layout="inline"
                name="vmvConnaissance"
              />
            </FieldAnchor>
            <FieldAnchor name="vmvUtilise">
              <RadioYesNo
                control={form.control}
                label="L'avez-vous déjà utilisé ?"
                layout="inline"
                name="vmvUtilise"
              />
            </FieldAnchor>
            <FieldAnchor name="vmvUtiliteTexte">
              <TextareaField
                form={form}
                label="En quoi est-ce utile dans votre pratique professionnelle quotidienne ?"
                name="vmvUtiliteTexte"
              />
            </FieldAnchor>
            <FieldAnchor name="vmvSuggestions">
              <RadioYesNo
                control={form.control}
                label="Avez-vous des suggestions à nous proposer ?"
                layout="inline"
                name="vmvSuggestions"
              />
            </FieldAnchor>
            <FieldAnchor name="vmvSuggestionsTexte">
              <TextareaField form={form} label="Précisez :" name="vmvSuggestionsTexte" />
            </FieldAnchor>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {validationWarningStep === currentStep ? (
            <p className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              Veuillez répondre à toutes les questions avant de continuer.
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              className="h-11 rounded-full px-6 font-semibold"
              disabled={currentStep === 0 || isPending || isSubmitting}
              onClick={handlePrevious}
              type="button"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4" />
              Précédent
            </Button>

            {currentStep < LAST_STEP_INDEX ? (
              <Button
                className="h-11 rounded-full px-6 font-semibold"
                disabled={isPending || isSubmitting}
                onClick={handleNext}
                type="button"
              >
                Suivant
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
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
                  "Envoyer mes réponses"
                )}
              </Button>
            )}
          </div>
        </div>
        <DevResetButton />
      </form>
    </Form>
  )
}
