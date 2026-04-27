"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Play, ExternalLink, HandHeart } from "lucide-react";
import Image from "next/image";
import venezAideData from "@/app/data/venez-on-vous-aide.json";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
}

const videosParlent: VideoItem[] = [
  {
    id: "parlent1",
    title: "Comprendre la santé mentale",
    description: "Un clip Psycom pour comprendre la santé mentale et ce qui l'influence",
    youtubeId: "LD1hk0OVt8Y",
  },
  {
    id: "parlent2",
    title: "La santé mentale, c'est pas que dans la tête",
    description: "Découvrez comment prendre soin de votre santé mentale au quotidien",
    youtubeId: "e-pfESIBU6s",
  },
  {
    id: "parlent3",
    title: "Parler de santé mentale",
    description: "Briser les tabous autour de la santé mentale",
    youtubeId: "Uit4lwPFTOI",
  },
  {
    id: "parlent4",
    title: "Agir pour sa santé mentale",
    description: "Des conseils pratiques pour améliorer son bien-être mental",
    youtubeId: "PPSzX_NIBJI",
  },
];

const bdSanteMentalePages = [
  {
    src: "/santé-mental/BD-sante-mentale/BD-sante-mentale_page-0001.jpg",
    alt: "BD santé mentale - page 1",
  },
];

const bdSanteMentalePdfUrl =
  "https://drive.google.com/file/d/1pETC-P3t7cEPE2R-lw15Yr0gplB8-AR2/view?usp=sharing";
const bdSanteMentaleSourceUrl = "https://santebd.org/";
const featuredBdPage = bdSanteMentalePages[0];

interface VideosViewProps {
  type: "aide" | "parlent";
}

export function VideosView({ type }: VideosViewProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // Vue "Venez on vous aide" - Texte + lien externe + ressources
  if (type === "aide") {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
      <>
        <div className="max-w-5xl mx-auto">
          {/* En-tête avec icône et description */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HandHeart className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {venezAideData.title}
            </h2>
            <p
              className={`text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto ${
                venezAideData.note ? "mb-4" : "mb-8"
              }`}
            >
              {venezAideData.description}
            </p>
            {venezAideData.note && (
              <p className="text-muted-foreground text-base leading-relaxed mb-8 font-medium">
                {venezAideData.note}
              </p>
            )}
          </div>

          {/* Section ressources */}
          {venezAideData.resources && venezAideData.resources.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">
                Supports et programmes disponibles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {venezAideData.resources.map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => setSelectedImage(resource.imagePath)}
                    className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300 p-6 text-left"
                  >
                    {/* Image miniature */}
                    <div className="relative aspect-[4/3] mb-4 rounded-xl overflow-hidden bg-muted">
                      <Image
                        src={resource.imagePath}
                        alt={resource.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* Contenu */}
                    <div className="space-y-2">
                      {resource.subtitle && (
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                          {resource.subtitle}
                        </p>
                      )}
                      <h4 className="text-base md:text-lg font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                        {resource.title}
                      </h4>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {resource.description}
                        </p>
                      )}
                    </div>
                    {/* Indicateur cliquable */}
                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                      <span>Cliquer pour agrandir</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal pour afficher l'image en grand */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden">
            <DialogHeader className="p-4 pb-2">
              <DialogTitle className="text-lg md:text-xl">
                {venezAideData.resources.find((r) => r.imagePath === selectedImage)?.title}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {venezAideData.resources.find((r) => r.imagePath === selectedImage)?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="relative w-full h-[calc(95vh-120px)] bg-muted">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt="Support programme"
                  fill
                  className="object-contain p-4"
                  sizes="95vw"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Vue "Ils en parlent aussi" - Vidéos
  const videos = videosParlent;

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Ils en parlent aussi
        </h2>
        <p className="text-muted-foreground">Témoignages et partages d'expériences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video: VideoItem) => (
          <button
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 cursor-pointer hover:shadow-2xl transition-all duration-500 aspect-video"
          >
            {/* Miniature YouTube */}
            <div className="absolute inset-0 z-0">
              <Image
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt={video.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

            {/* Play icon */}
            <div className="absolute inset-0 flex items-center justify-center z-15">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 text-left">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                {video.title}
              </h3>
              <p className="text-white/70 text-sm line-clamp-2">
                {video.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 max-w-4xl mx-auto rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-secondary/20 p-4 md:p-6">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            {featuredBdPage ? (
              <a
                href={bdSanteMentalePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-primary/20 overflow-hidden bg-background hover:shadow-lg transition-all duration-300 block"
              >
                <div className="relative aspect-[3/4] bg-muted">
                  <Image
                    src={featuredBdPage.src}
                    alt={featuredBdPage.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 1024px) 100vw, 32vw"
                  />
                </div>
                <div className="p-3 border-t border-border/70">
                  <p className="text-sm font-semibold text-foreground">Aperçu - Page 1</p>
                  <p className="text-xs text-primary mt-1 inline-flex items-center gap-1">
                    Voir la BD <ExternalLink className="w-3 h-3" />
                  </p>
                </div>
              </a>
            ) : (
              <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                Aucune miniature BD disponible pour le moment.
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                BD Santé mentale
              </h3>
              <p className="text-muted-foreground">
                Un format illustré simple à lire pour mieux comprendre la santé mentale.
              </p>
              <div className="mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-secondary" />
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <a
                href={bdSanteMentalePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Visualisez la BD
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={bdSanteMentaleSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                Source de la BD : santebd.org
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Video */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl">{selectedVideo?.title}</DialogTitle>
            <DialogDescription>{selectedVideo?.description}</DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full">
            {selectedVideo && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
