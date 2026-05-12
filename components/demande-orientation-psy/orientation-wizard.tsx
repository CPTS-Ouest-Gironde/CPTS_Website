"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { FileDown, Loader2, Send, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

export function OrientationWizard() {
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [toxiquesGlobal, setToxiquesGlobal] = useState("");
  const [toxiquesChecked, setToxiquesChecked] = useState<Record<string, boolean>>({});
  const [toxiquesDetail, setToxiquesDetail] = useState<Record<string, string>>({});
  const [sendState, setSendState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [sendMessage, setSendMessage] = useState("");
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "error">("idle");
  const [pdfError, setPdfError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const buildPayload = () => {
    const formElement = formRef.current;
    if (!formElement) return null;

    const raw = new FormData(formElement);
    const data: Record<string, string | string[]> = {};

    for (const [key, value] of raw.entries()) {
      if (typeof value !== "string") continue;
      const cleaned = value.trim();
      if (!cleaned) continue;

      const existing = data[key];
      if (!existing) {
        data[key] = cleaned;
        continue;
      }

      if (Array.isArray(existing)) {
        existing.push(cleaned);
        data[key] = existing;
      } else {
        data[key] = [existing, cleaned];
      }
    }

    return {
      generatedAt: new Date().toISOString(),
      originPath: "/espace-pro/demande-orientation-psy",
      data,
    };
  };

  const handleExportPdf = async () => {
    const payload = buildPayload();
    if (!payload) return;

    setPdfState("loading");
    setPdfError("");

    try {
      const response = await fetch("/api/demande-orientation-psy/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setPdfState("error");
        setPdfError(body?.error || "Erreur lors de la génération du PDF.");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const yyyy = now.getFullYear();
      a.href = url;
      a.download = `demande-orientation-psy-${dd}${mm}${yyyy}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setPdfState("idle");
    } catch {
      setPdfState("error");
      setPdfError("Erreur lors de la génération du PDF. Veuillez réessayer.");
    }
  };

  const handleSend = async () => {
    const payload = buildPayload();
    if (!payload) return;

    setSendState("sending");
    setSendMessage("");

    try {
      const response = await fetch("/api/demande-orientation-psy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setSendState("error");
        setSendMessage(
          body?.error ||
            "Envoi impossible pour le moment. Vous pouvez exporter le formulaire en PDF pour la trace.",
        );
        return;
      }

      setSendState("success");
      setSendMessage(
        "Formulaire envoyé automatiquement par email. Vous pouvez exporter une copie en PDF pour l'archivage du dossier.",
      );
    } catch {
      setSendState("error");
      setSendMessage(
        "Envoi impossible pour le moment. Vous pouvez exporter le formulaire en PDF pour la trace.",
      );
    }
  };

  const handleToxiquesGlobalChange = (val: string) => {
    setToxiquesGlobal(val);
    if (val === "Non") {
      setToxiquesChecked({});
      setToxiquesDetail({});
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    setRgpdConsent(false);
    setToxiquesGlobal("");
    setToxiquesChecked({});
    setToxiquesDetail({});
    setSendState("idle");
    setSendMessage("");
    setPdfState("idle");
    setPdfError("");
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader className="border-b">
          <CardTitle className="text-xl lg:text-2xl">
            Formulaire d&apos;adressage IDE psy (patient adulte)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form ref={formRef} className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <Card className="border-primary/20">
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Adresseur</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid gap-4 md:grid-cols-2">
                <Field label="Nom et prénoms" htmlFor="adresseur-nom">
                  <Input
                    id="adresseur-nom"
                    name="adresseurNom"
                    placeholder="Ex : Dr Marie Dupont"
                  />
                </Field>
                <Field
                  label="RPPS (Répertoire partagé des professionnels de santé)"
                  htmlFor="adresseur-rpps"
                >
                  <Input
                    id="adresseur-rpps"
                    name="adresseurRpps"
                    placeholder="Ex : 10001234567"
                  />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Informations patient</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Prénom" htmlFor="patient-prenom">
                    <Input
                      id="patient-prenom"
                      name="patientPrenom"
                      placeholder="Ex : Camille"
                    />
                  </Field>
                  <Field label="Date de naissance" htmlFor="patient-ddn">
                    <Input id="patient-ddn" name="patientDdn" type="date" />
                  </Field>
                </div>

                <Field label="Adresse" htmlFor="patient-adresse">
                  <Input
                    id="patient-adresse"
                    name="patientAdresse"
                    placeholder="Ex : 12 rue des Lilas"
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Code postal" htmlFor="patient-cp">
                    <Input
                      id="patient-cp"
                      name="patientCp"
                      placeholder="Ex : 33700"
                    />
                  </Field>
                  <Field label="Commune" htmlFor="patient-commune">
                    <Input
                      id="patient-commune"
                      name="patientCommune"
                      placeholder="Ex : Mérignac"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Téléphone patient" htmlFor="patient-telephone">
                    <Input
                      id="patient-telephone"
                      name="patientTelephone"
                      type="tel"
                      placeholder="Ex : 06 12 34 56 78"
                    />
                  </Field>
                  <Field label="Téléphone aidant familial" htmlFor="aidant-telephone">
                    <Input
                      id="aidant-telephone"
                      name="aidantTelephone"
                      type="tel"
                      placeholder="Ex : 06 87 65 43 21"
                    />
                  </Field>
                </div>

                <Field label="Professionnel de santé habituel" htmlFor="professionnel-sante">
                  <Input
                    id="professionnel-sante"
                    name="professionnelSante"
                    placeholder="Ex : Dr Martin (MG), Dr Lemaire (cardio)"
                  />
                </Field>

              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Contexte clinique</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    Antécédents médico-chir-allergie (ATCD)
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {["Gynéco", "Chir", "Allergie", "Neuro", "Douleur chronique"].map(
                      (item) => (
                        <label
                          key={item}
                          className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Checkbox name={`atcd-medical-${item}`} />
                          <span>{item}</span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="ATCD psy - Suivi" htmlFor="atcd-psy-suivi">
                    <Input
                      id="atcd-psy-suivi"
                      name="atcdPsySuivi"
                      placeholder="Ex : suivi psychologue 1 fois/mois"
                    />
                  </Field>
                  <Field
                    label="ATCD psy - Hospitalisation"
                    htmlFor="atcd-psy-hospitalisation"
                  >
                    <Input
                      id="atcd-psy-hospitalisation"
                      name="atcdPsyHospitalisation"
                      placeholder="Ex : HDJ en 2024"
                    />
                  </Field>
                </div>

                <Field
                  label="PAA (TS, scarifications, hétéro-agressivité)"
                  htmlFor="paa"
                >
                  <Textarea
                    id="paa"
                    name="paa"
                    className="min-h-20"
                    placeholder="Ex : TS médicamenteuse en 2023, scarifications ponctuelles..."
                  />
                </Field>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    Avez-vous déjà contacté
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {["Le 3114", "Question psy", "REMED", "Réponse psy"].map((item) => (
                      <label
                        key={item}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Checkbox name={`contact-${item}`} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Field
                  label="Mode de vie (célibataire, couple, enfants, problèmes de santé, travail, relation sociale, conduites à risque, pratique de sport)"
                  htmlFor="mode-vie"
                >
                  <Textarea
                    id="mode-vie"
                    name="modeVie"
                    className="min-h-28"
                    placeholder="Ex : vit seule, 2 enfants, en arrêt de travail, isolement social..."
                  />
                </Field>

                <Field label="TTT (actuel)" htmlFor="ttt-actuel">
                  <Textarea
                    id="ttt-actuel"
                    name="tttActuel"
                    className="min-h-24"
                    placeholder="Ex : Sertraline 50 mg/j, Alprazolam si besoin..."
                  />
                </Field>

                <Field label="Contexte - Motif de la demande" htmlFor="contexte">
                  <Textarea
                    id="contexte"
                    name="contexte"
                    className="min-h-24"
                    placeholder="Ex : aggravation anxio-dépressive avec retentissement professionnel"
                  />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Sommeil</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Difficultés d'endormissement",
                    "Réveils précoces",
                    "Automédication ?",
                  ].map((item) => (
                    <label
                      key={item}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Checkbox name={`sommeil-${item}`} />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <Field label="Thèmes de rumination" htmlFor="rumination-themes">
                  <Textarea
                    id="rumination-themes"
                    name="ruminationThemes"
                    className="min-h-20"
                    placeholder="Ex : ruminations professionnelles, conflits familiaux..."
                  />
                </Field>

                <Field
                  label="Heure de réveil et possibilité de rendormissement"
                  htmlFor="reveils-details"
                >
                  <Input
                    id="reveils-details"
                    name="reveilsDetails"
                    placeholder="Ex : réveil vers 4h, impossible de se rendormir"
                  />
                </Field>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/30">
              <CardHeader className="border-b border-emerald-200/70">
                <CardTitle className="text-xl">Évaluation patient adulte</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-foreground">Alimentation</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      "Changement d'habitude alimentaire ?",
                      "Hyperphagie",
                      "Anorexie",
                    ].map((item) => (
                      <label
                        key={item}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Checkbox name={`alimentation-${item}`} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Field label="Humeur" htmlFor="humeur">
                  <Textarea
                    id="humeur"
                    name="humeur"
                    className="min-h-20"
                    placeholder="Ex : tristesse marquée, irritabilité, anhédonie..."
                  />
                </Field>

                <div className="space-y-4">
                  <p className="text-lg font-semibold text-foreground">Idées suicidaires</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Fréquences" htmlFor="suicidaire-frequences">
                      <Input
                        id="suicidaire-frequences"
                        name="suicidaireFrequences"
                        placeholder="Ex : quotidiennes"
                      />
                    </Field>
                    <Field label="Scénario" htmlFor="suicidaire-scenario">
                      <Input
                        id="suicidaire-scenario"
                        name="suicidaireScenario"
                        placeholder="Ex : idées de prise médicamenteuse"
                      />
                    </Field>
                    <Field
                      label="Date de PAA programmée"
                      htmlFor="suicidaire-paa-date"
                    >
                      <Input
                        id="suicidaire-paa-date"
                        name="suicidairePaaDate"
                        type="date"
                      />
                    </Field>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-lg font-semibold text-foreground">Violences</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {["Intra-familiale", "Travail"].map((item) => (
                      <label
                        key={item}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Checkbox name={`violence-${item}`} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-lg font-semibold text-foreground">
                    Consommation de toxiques
                  </p>
                  <RadioGroup
                    name="toxiquesGlobal"
                    value={toxiquesGlobal}
                    onValueChange={handleToxiquesGlobalChange}
                    className="flex flex-row gap-6"
                  >
                    {["Oui", "Non"].map((item) => (
                      <label
                        key={item}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <RadioGroupItem value={item} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  <div className="flex flex-col gap-3">
                    {["Alcool", "Tabac", "THC", "CBD", "Cocaïne", "Autre"].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <Checkbox
                          name={`toxique-${item}`}
                          id={`toxique-${item}`}
                          checked={toxiquesChecked[item] ?? false}
                          disabled={Boolean(toxiquesGlobal === "Non")}
                          onCheckedChange={(checked) => {
                            const isChecked = checked === true;
                            setToxiquesChecked((prev) => ({ ...prev, [item]: isChecked }));
                            if (!isChecked) {
                              setToxiquesDetail((prev) => ({ ...prev, [item]: "" }));
                            }
                          }}
                        />
                        <label
                          htmlFor={`toxique-${item}`}
                          className="text-sm text-muted-foreground w-20 shrink-0"
                        >
                          {item}
                        </label>
                        <Input
                          name={`toxique-${item}-detail`}
                          placeholder={item === "Alcool" ? "Ex : 2 verres/jour" : item === "Autre" ? "Préciser..." : ""}
                          className="h-8 text-sm"
                          value={toxiquesDetail[item] ?? ""}
                          disabled={Boolean(toxiquesGlobal === "Non" || !toxiquesChecked[item])}
                          onChange={(e) =>
                            setToxiquesDetail((prev) => ({ ...prev, [item]: e.target.value }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="border-b border-primary/20">
                <CardTitle className="text-xl">Quelle est votre problématique principale sur cette PEC&nbsp;?</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      "Ajustement TTT (traitement)",
                      "Demande d'hospitalisation",
                      "Urgence (SECOP / 3114 / 15)",
                      "Non urgente",
                    ].map((item) => (
                      <label
                        key={item}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Checkbox name={`orientation-${item}`} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Textarea
                  id="orientation-proposition"
                  name="orientationProposition"
                  className="min-h-20 bg-background"
                  placeholder="Ex : orientation vers consultation psychiatrique sous 7 jours..."
                />

                <p className="text-sm text-muted-foreground">
                  Pour discuter de cette orientation :{" "}
                  <span className="font-semibold text-foreground">05 57 89 69 20</span>
                  {" "}- demander{" "}
                  <span className="font-semibold text-foreground">Mme Patenere</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-300 bg-amber-50/60">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                  RGPD
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Les informations sont transmises automatiquement par email à
                  l&apos;adresse indiquée. Le site ne stocke pas ces données dans une
                  base de données applicative.
                </p>
                <label className="inline-flex items-start gap-3 text-sm text-foreground">
                  <Checkbox
                    checked={rgpdConsent}
                    onCheckedChange={(value) => setRgpdConsent(Boolean(value))}
                    id="rgpd-consent"
                  />
                  <span>
                    Je confirme avoir informé le patient de ses droits relatifs à la
                    protection de ses données.
                  </span>
                </label>
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleReset}>
                Réinitialiser
              </Button>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExportPdf}
                  disabled={pdfState === "loading"}
                >
                  {pdfState === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      Exporter en PDF (trace dossier)
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleSend}
                  disabled={!rgpdConsent || sendState === "sending"}
                >
                  {sendState === "sending" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer automatiquement par email
                    </>
                  )}
                </Button>
              </div>
            </div>

            {pdfState === "error" && (
              <p className="text-sm text-destructive">{pdfError}</p>
            )}

            {sendState !== "idle" && (
              <p
                className={`text-sm ${
                  sendState === "success"
                    ? "text-emerald-700"
                    : sendState === "error"
                      ? "text-destructive"
                      : "text-muted-foreground"
                }`}
              >
                {sendMessage}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="w-full max-w-[220px]">
              <Image
                src="/logo-cpts.png"
                alt="Logo CPTS Ouest Gironde"
                width={400}
                height={170}
                className="w-full h-auto object-contain"
                sizes="220px"
              />
            </div>
            <p className="text-base leading-relaxed text-foreground">
              Pour toute question relative à la protection de vos données ou pour
              exercer vos droits, vous pouvez vous adresser à la CPTS Ouest Gironde
              par mail :{" "}
              <span className="font-semibold">cptsouestgironde@gmail.com</span> ou en
              téléphonant au <span className="font-semibold">06 51 36 73 45</span>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
