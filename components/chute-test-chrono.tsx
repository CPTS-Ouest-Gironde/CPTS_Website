"use client";

import { useRef, useState } from "react";
import { Play, Square, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";

const THRESHOLD_SECONDS = 14;

export function ChuteTestChrono() {
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const start = () => {
    clear();
    setFinished(false);
    setElapsedMs(0);
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startRef.current);
    }, 50);
    setRunning(true);
  };

  const stop = () => {
    clear();
    setElapsedMs(Date.now() - startRef.current);
    setRunning(false);
    setFinished(true);
  };

  const reset = () => {
    clear();
    setElapsedMs(0);
    setRunning(false);
    setFinished(false);
  };

  const seconds = elapsedMs / 1000;
  const atRisk = seconds > THRESHOLD_SECONDS;

  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-5 lg:p-6">
      {/* Consigne */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        Appuyez sur <span className="font-semibold text-foreground">« Lancer »</span> pour démarrer le
        chronomètre, effectuez vos <span className="font-semibold text-foreground">5 relevés de chaise</span>{" "}
        aussi vite que possible sans vous aider de vos bras, puis appuyez sur{" "}
        <span className="font-semibold text-foreground">« Arrêter »</span>.
      </p>

      {/* Affichage chrono */}
      <div className="flex flex-col items-center gap-5">
        <div
          className={`font-mono text-5xl lg:text-6xl font-black tabular-nums tracking-tight ${
            finished ? (atRisk ? "text-amber-600" : "text-emerald-600") : "text-foreground"
          }`}
          aria-live="polite"
        >
          {seconds.toFixed(1)}
          <span className="text-2xl lg:text-3xl font-bold text-muted-foreground"> s</span>
        </div>

        {/* Bouton principal */}
        {!running ? (
          <button
            onClick={start}
            className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-amber-700 transition-colors"
          >
            <Play className="h-5 w-5 fill-current" />
            {finished ? "Relancer le chrono" : "Lancer le chrono"}
          </button>
        ) : (
          <button
            onClick={stop}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-red-700 transition-colors animate-pulse"
          >
            <Square className="h-5 w-5 fill-current" />
            Arrêter
          </button>
        )}

        {finished && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Résultat */}
      {finished && (
        <div
          className={`mt-5 flex items-start gap-3 rounded-xl p-4 ${
            atRisk ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"
          }`}
        >
          {atRisk ? (
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
          )}
          <p className="text-sm font-semibold leading-relaxed">
            {atRisk ? (
              <>
                Votre temps dépasse 14 secondes : cela indique un risque de chute réel. Parlez-en à votre
                médecin ou à votre équipe soignante.
              </>
            ) : (
              <>
                Votre temps est inférieur à 14 secondes : ce test ne détecte pas de risque de chute
                particulier. Continuez à entretenir votre équilibre et votre activité physique.
              </>
            )}
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground italic">
        Cet auto-test est indicatif : pour une évaluation fiable, faites-le réaliser par votre équipe
        soignante.
      </p>
    </div>
  );
}
