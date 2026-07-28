"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, ZoomIn } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  VisuallyHidden,
} from "@/components/ui/dialog";

interface Poster {
  image: string;
  alt: string;
  downloadLabel: string;
  downloadUrl: string;
}

interface FeuDuPorgePostersProps {
  posters: readonly Poster[];
}

export function FeuDuPorgePosters({
  posters,
}: FeuDuPorgePostersProps) {
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {posters.map((poster) => (
          <article
            key={poster.image}
            className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lg"
          >
            <button
              type="button"
              onClick={() => setSelectedPoster(poster)}
              className="group relative aspect-[707/1000] w-full cursor-zoom-in overflow-hidden bg-white"
              aria-label={`Agrandir l'affiche : ${poster.alt}`}
            >
              <Image
                src={poster.image}
                alt={poster.alt}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <span className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground shadow-md backdrop-blur-sm">
                <ZoomIn className="h-4 w-4" aria-hidden="true" />
                Agrandir
              </span>
            </button>

            <div className="p-5">
              <a
                href={poster.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {poster.downloadLabel}
              </a>
            </div>
          </article>
        ))}
      </div>

      <Dialog
        open={selectedPoster !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedPoster(null);
          }
        }}
      >
        <DialogContent className="aspect-[707/1000] w-[min(95vw,67vh)] max-w-none overflow-hidden rounded-none border-0 bg-transparent p-0 text-white shadow-none [&>button]:top-3 [&>button]:right-3 [&>button]:rounded-full [&>button]:bg-black/75 [&>button]:p-2 [&>button]:text-white [&>button]:opacity-100 [&>button_svg]:size-5">
          <VisuallyHidden>
            <DialogTitle>
              {selectedPoster?.alt ?? "Affiche agrandie"}
            </DialogTitle>
          </VisuallyHidden>
          {selectedPoster && (
            <div className="relative h-full w-full">
              <Image
                src={selectedPoster.image}
                alt={selectedPoster.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
