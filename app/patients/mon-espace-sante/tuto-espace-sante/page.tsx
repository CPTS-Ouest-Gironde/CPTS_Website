"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import {
  Play, ChevronLeft, ChevronRight, X, Bell, Heart, Globe, Hospital, ArrowLeft,
  UserPen, FolderLock, Wifi, ShieldCheck, BadgeCheck, FileStack, LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  VisuallyHidden,
} from "@/components/ui/dialog";
import { useState, useCallback } from "react";
import data from "@/app/data/tuto-espace-sante.json";

type Video = { id: string; type: string; title: string };

function VideoCarouselCard({
  title,
  videos,
}: {
  title: string;
  videos: Video[];
}) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = videos[currentIndex];
  const isShort = current?.type === "short";

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, videos.length - 1));
  }, [videos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const openAt = useCallback((index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  }, []);

  return (
    <>
      {/* Grande card d'appel */}
      <Card className="border-primary/20 overflow-hidden">
        <CardContent className="p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Play className="w-7 h-7 text-primary ml-0.5" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {videos.length} vidéos pour vous accompagner pas à pas
              </p>
              <Button size="lg" className="gap-2" onClick={() => openAt(0)}>
                <Play className="w-4 h-4" />
                Commencer le tutoriel
              </Button>
            </div>

            {/* Miniatures des étapes */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {videos.map((video, i) => (
                  <button
                    key={video.id}
                    onClick={() => openAt(i)}
                    className="group text-left"
                  >
                    <div className="relative rounded-lg overflow-hidden mb-2">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-600/90 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                      <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-md">
                        {i + 1}
                      </div>
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                      {video.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog carrousel */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0"
          showCloseButton={false}
        >
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="shrink-0 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-lg">
                  {currentIndex + 1}/{videos.length}
                </span>
                <DialogTitle className="truncate">
                  {current?.title}
                </DialogTitle>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-full p-2 hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <VisuallyHidden>
              <DialogDescription>Vidéo tutoriel étape {currentIndex + 1}</DialogDescription>
            </VisuallyHidden>
          </DialogHeader>

          {/* Vidéo */}
          <div className="px-6">
            <div
              className={`relative w-full ${isShort ? "max-w-sm mx-auto" : ""}`}
            >
              <div
                className="relative overflow-hidden rounded-xl"
                style={{ paddingBottom: isShort ? "177.78%" : "56.25%" }}
              >
                <iframe
                  key={current?.id}
                  src={`https://www.youtube.com/embed/${current?.id}?autoplay=1`}
                  title={current?.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 pt-4">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>

            {/* Points de progression */}
            <div className="hidden sm:flex items-center gap-1.5">
              {videos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-primary scale-125"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant={currentIndex === videos.length - 1 ? "default" : "outline"}
              onClick={
                currentIndex === videos.length - 1
                  ? () => setOpen(false)
                  : goNext
              }
              className="gap-2"
            >
              {currentIndex === videos.length - 1 ? (
                "Terminer"
              ) : (
                <>
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const ContentIconMap: Record<string, LucideIcon> = {
  UserPen,
  FolderLock,
  Wifi,
  ShieldCheck,
  BadgeCheck,
  FileStack,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContentBlock({ block }: { block: any }) {
  switch (block.type) {
    case "feature-grid":
      return (
        <div className="grid sm:grid-cols-3 gap-4 my-6">
          {block.items.map((item: { iconName: string; text: string }, i: number) => {
            const Icon = ContentIconMap[item.iconName];
            return (
              <Card key={i} className="border-primary/15">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    {Icon && <Icon className="w-5 h-5 text-primary" />}
                  </div>
                  <p className="text-muted-foreground">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    case "highlight":
      return (
        <Card className="border-primary/20 bg-primary/5 my-6">
          <CardContent className="p-5 text-center">
            <p className="text-muted-foreground mb-2">{block.text}</p>
            <p className="text-lg font-bold text-foreground">{block.strong}</p>
          </CardContent>
        </Card>
      );
    case "heading":
      return (
        <div className="mt-12 mb-6">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            {block.text}
          </h3>
          <div className="w-10 h-1 bg-primary" />
        </div>
      );
    case "security-grid":
      return (
        <div className="grid sm:grid-cols-2 gap-4 my-6">
          {block.items.map((item: { iconName: string; text: string }, i: number) => {
            const Icon = ContentIconMap[item.iconName];
            return (
              <Card key={i} className="border-primary/15">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    {Icon && <Icon className="w-5 h-5 text-primary" />}
                  </div>
                  <p className="text-muted-foreground">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    case "enrichment":
      return (
        <Card className="border-primary/15 my-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileStack className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium mb-3">{block.text}</p>
                <ul className="space-y-2">
                  {block.items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary mt-1">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    case "notification":
      return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/15 my-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <p className="text-base font-medium text-foreground">
            {block.text}
          </p>
        </div>
      );
    case "bold":
      return (
        <p className="text-lg font-bold text-foreground my-3">
          {block.text}
        </p>
      );
    case "alert":
      return (
        <Card className="border-blue-200 bg-blue-50/50 mt-8">
          <CardContent className="p-6 flex items-start gap-4">
            <span className="text-2xl shrink-0" role="img" aria-label="Drapeau français">🇫🇷</span>
            <p className="text-lg font-semibold text-foreground">
              Vos données sont hébergées en France et ne pourront pas être récupérées à l&apos;étranger.
            </p>
          </CardContent>
        </Card>
      );
    default:
      return (
        <p className="text-lg text-muted-foreground my-3">
          {block.text}
        </p>
      );
  }
}

export default function TutoEspaceSantePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-12 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-background" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Bouton retour */}
            <Link
              href="/patients/mon-espace-sante"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Retour à Mon Espace de Santé</span>
            </Link>

            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {data.title} : <span className="uppercase">{data.subtitle}</span>
            </h1>
            <div className="w-12 h-1 bg-primary mb-8" />

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {data.intro.questions.map((q, i) => {
                const icons = [Heart, Globe, Hospital];
                const Icon = icons[i];
                return (
                  <Card key={i} className="border-primary/15 bg-background/80 backdrop-blur-sm">
                    <CardContent className="p-5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-foreground font-medium">
                        {q.before}<strong className="font-semibold">{q.bold}</strong>{q.after}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-primary/20 bg-primary/5 mb-6">
              <CardContent className="p-5 text-center">
                <p className="text-lg text-foreground font-semibold">
                  {data.intro.callToAction.before}
                  <strong className="text-primary font-bold">{data.intro.callToAction.bold}</strong>
                  {data.intro.callToAction.after}
                </p>
              </CardContent>
            </Card>

            <p className="text-muted-foreground leading-relaxed">
              {data.intro.description}
            </p>
          </div>
        </div>
      </section>

      {/* Section tutoriel - Comment créer */}
      <section className="py-12 lg:py-20 bg-secondary/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {data.tutorialSection.title}
              </h2>
              <p className="text-muted-foreground mb-1">
                {data.tutorialSection.description}
              </p>
              <p className="font-bold text-foreground">
                {data.tutorialSection.motto}
              </p>
            </div>

            <VideoCarouselCard
              title={data.tutorialSection.cardTitle}
              videos={data.tutorialSection.videos}
            />
          </div>
        </div>
      </section>

      {/* Section Pourquoi */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {data.pourquoiSection.title}
              </h2>
            </div>

            <div className="mb-12">
              <VideoCarouselCard
                title={data.pourquoiSection.cardTitle}
                videos={data.pourquoiSection.videos}
              />
            </div>

            <div>
              {data.pourquoiSection.content.map((block, i) => (
                <ContentBlock key={i} block={block} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
