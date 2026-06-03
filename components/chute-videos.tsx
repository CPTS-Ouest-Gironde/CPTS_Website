"use client";

import { useState } from "react";
import { Video, Play, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type VideoItem = { title: string; id: string };

interface ChuteVideosProps {
  title: string;
  intro?: string;
  items: VideoItem[];
}

const previewUrl = (id: string) => `https://drive.google.com/file/d/${id}/preview`;
const thumbnailUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w640`;

export function ChuteVideos({ title, intro, items }: ChuteVideosProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Video className="w-5 h-5 text-amber-600" />
        <h2 className="text-xl font-bold text-foreground uppercase tracking-wide">{title}</h2>
      </div>
      {intro && <p className="text-sm text-muted-foreground mb-6">{intro}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((v, i) => (
          <div key={v.id} className="space-y-2">
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Lire la ${v.title}`}
              className="group relative block w-full rounded-2xl overflow-hidden shadow-lg border border-amber-100 bg-black"
            >
              <div className="relative w-full aspect-video bg-black">
                {/* Miniature Drive (image statique, sans bouton play) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailUrl(v.id)}
                  alt={v.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlay cliquable + bouton lecture */}
                <span className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg group-hover:scale-105 transition-transform">
                    <Play className="h-6 w-6 fill-amber-600 text-amber-600 translate-x-0.5" />
                  </span>
                </span>
              </div>
            </button>
            <p className="text-sm font-medium text-foreground text-center">{v.title}</p>
          </div>
        ))}
      </div>

      <Dialog
        open={activeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setActiveIndex(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-3xl gap-0 p-0 overflow-hidden border-0 bg-black"
        >
          <DialogTitle className="sr-only">{active?.title ?? "Vidéo"}</DialogTitle>
          <DialogClose className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors">
            <X className="h-5 w-5" />
            <span className="sr-only">Fermer</span>
          </DialogClose>
          <div className="relative w-full aspect-video">
            {active && (
              <iframe
                src={previewUrl(active.id)}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                title={active.title}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
