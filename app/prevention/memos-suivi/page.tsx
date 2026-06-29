// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { X } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import memosData from "@/app/data/memos-suivi.json";

const colorVariants: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200 hover:border-emerald-400",
    text: "text-emerald-700",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200 hover:border-blue-400",
    text: "text-blue-700",
  },
  pink: {
    bg: "bg-pink-50",
    border: "border-pink-200 hover:border-pink-400",
    text: "text-pink-700",
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-200 hover:border-rose-400",
    text: "text-rose-700",
  },
  slate: {
    bg: "bg-slate-50",
    border: "border-slate-200 hover:border-slate-400",
    text: "text-slate-700",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200 hover:border-amber-400",
    text: "text-amber-700",
  },
};

interface MemoLink {
  label: string;
  url: string;
}

interface TextSegment {
  type: "text" | "bold" | "underline";
  text: string;
}

interface MemoSection {
  title: string;
  points: (string | TextSegment[])[];
  image?: string;
  imageLink?: string;
  imageNoClick?: boolean;
  imageHalfSize?: boolean;
  images?: string[];
}

interface MemoContent {
  intro?: string | TextSegment[];
  points?: string[];
  subtitle?: string;
  images?: string[];
  links?: MemoLink[];
  sections?: MemoSection[];
  pdfEmbed?: string;
}

interface Memo {
  id: string;
  title: string;
  image: string;
  color: string;
  content?: MemoContent;
}

// Helper pour rendre le texte avec formatage
function renderFormattedText(content: string | TextSegment[]) {
  if (typeof content === "string") {
    return content;
  }

  return content.map((segment, index) => {
    if (segment.type === "bold") {
      return (
        <strong
          key={index}
          className="font-extrabold text-foreground tracking-tight"
          style={{ fontWeight: 800 }}
        >
          {segment.text}
        </strong>
      );
    }
    if (segment.type === "underline") {
      return (
        <span
          key={index}
          className="font-medium text-foreground underline decoration-blue-400 decoration-2 underline-offset-2"
        >
          {segment.text}
        </span>
      );
    }
    return (
      <span key={index} className="text-muted-foreground">
        {segment.text}
      </span>
    );
  });
}

function FlipCard({ memo, onClick }: { memo: Memo; onClick: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const colors = colorVariants[memo.color] || colorVariants.emerald;

  const handleClick = () => {
    setIsFlipped(true);
    setTimeout(() => {
      onClick();
      setIsFlipped(false);
    }, 300);
  };

  return (
    <div
      className="perspective-1000 cursor-pointer group"
      onClick={handleClick}
    >
      <div
        className={`relative w-full aspect-[3/4] transition-transform duration-300 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl border-2 ${colors.border} ${colors.bg} p-3 lg:p-5 flex flex-col items-center shadow-md group-hover:shadow-xl transition-shadow duration-300`}
        >
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={memo.image}
              alt={memo.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className="flex-1 flex items-center justify-center pt-3">
            <h3
              className={`text-xs lg:text-sm font-bold text-center ${colors.text} uppercase tracking-wide leading-tight`}
            >
              {memo.title}
            </h3>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl ${colors.bg} border-2 ${colors.border} p-4 lg:p-6 flex items-center justify-center shadow-xl`}
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/80 flex items-center justify-center">
              <span className="text-2xl">👆</span>
            </div>
            <p className={`text-xs lg:text-sm font-medium ${colors.text}`}>
              Cliquez pour voir le mémo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher une image cliquable qui s'ouvre en plein écran
function ClickableImage({
  src,
  alt,
  onImageClick,
  thumbnail = false,
}: {
  src: string;
  alt: string;
  onImageClick: (src: string) => void;
  thumbnail?: boolean;
}) {
  // Pour les images en miniature (grandes infographies), on affiche à 50% de la taille dans une card centrée
  if (thumbnail) {
    return (
      <div className="flex justify-center">
        <button
          onClick={() => onImageClick(src)}
          className="relative cursor-zoom-in hover:scale-[1.01] transition-all duration-200 rounded-2xl border-2 border-pink-200 hover:border-pink-400 shadow-md hover:shadow-xl overflow-hidden bg-gradient-to-br from-pink-50 to-white p-4"
        >
          <Image
            src={src}
            alt={alt}
            width={400}
            height={800}
            className="w-auto h-auto max-w-[50%] mx-auto"
            style={{ maxWidth: "50%" }}
            sizes="400px"
          />
          <div className="mt-3 flex justify-center">
            <span className="bg-pink-600 text-white text-xs px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-md">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
              Cliquer pour voir en grand
            </span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => onImageClick(src)}
      className="relative w-full cursor-zoom-in hover:opacity-90 transition-opacity"
    >
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        className="w-full h-auto"
        sizes="(max-width: 768px) 100vw, 800px"
      />
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
        Cliquer pour agrandir
      </div>
    </button>
  );
}

// Lightbox pour afficher l'image en plein écran
function ImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string | null;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        aria-label="Fermer"
      >
        <X className="w-6 h-6 text-white" />
      </button>
      <div className="relative w-full h-full p-4 flex items-center justify-center">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}

function MemoModal({
  memo,
  isOpen,
  onClose,
}: {
  memo: Memo | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!isOpen || !memo) return null;

  const colors = colorVariants[memo.color] || colorVariants.emerald;

  const handleImageClick = (src: string) => {
    setLightboxImage(src);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border ${colors.border} shadow-2xl animate-in zoom-in-95 duration-200`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>

          <div className="p-6 lg:p-10">
            <div
              className={`inline-block px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-xs font-semibold uppercase tracking-wide mb-4`}
            >
              Mémo de suivi
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 pr-10">
              {memo.title}
            </h2>

            {/* Contenu du mémo */}
            <div className="space-y-8 border-t-2 border-gray-100 pt-8">
              {memo.content ? (
                <>
                  {/* Affichage du PDF si pdfEmbed est présent */}
                  {memo.content.pdfEmbed && (
                    <div className="w-full">
                      <iframe
                        src={memo.content.pdfEmbed}
                        className="w-full h-[70vh] rounded-xl border border-gray-200"
                        allow="autoplay"
                        title={`PDF - ${memo.title}`}
                      />
                    </div>
                  )}
                  {memo.content.intro && (
                    <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl p-6 border border-blue-100/50">
                      <p className="text-base leading-loose tracking-wide">
                        {renderFormattedText(memo.content.intro)}
                      </p>
                    </div>
                  )}
                  {memo.content.points && memo.content.points.length > 0 && (
                    <ul className="space-y-2">
                      {memo.content.points.map((point, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className={`${colors.text} opacity-40`}>•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {memo.content.subtitle && (
                    <p className="text-base font-bold text-foreground pt-2">
                      {memo.content.subtitle}
                    </p>
                  )}
                  {memo.content.images &&
                    memo.content.images.length > 0 &&
                    !memo.content.sections && (
                      <div className="space-y-4 pt-4">
                        {memo.content.images.map((img, index) => (
                          <ClickableImage
                            key={index}
                            src={img}
                            alt={`${memo.title} - Image ${index + 1}`}
                            onImageClick={handleImageClick}
                          />
                        ))}
                      </div>
                    )}
                  {memo.content.sections &&
                    memo.content.sections.length > 0 && (
                      <div className="space-y-10">
                        {memo.content.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="group">
                            <div className="relative mb-6">
                              <h4
                                className={`text-base font-black ${colors.text} uppercase tracking-wider mb-1 flex items-center gap-3`}
                              >
                                <span
                                  className={`w-1.5 h-8 ${colors.bg.replace("50", "600")} rounded-full`}
                                />
                                {section.title}
                              </h4>
                              <div
                                className={`h-[2px] w-full ${colors.bg} rounded-full mt-3`}
                              />
                            </div>
                            <ul className="space-y-5 pl-6">
                              {section.points.map((point, pointIndex) => (
                                <li
                                  key={pointIndex}
                                  className="relative flex items-start gap-4 group/item"
                                >
                                  <span
                                    className={`${colors.text} opacity-40 text-lg leading-none`}
                                  >
                                    •
                                  </span>
                                  <span className="text-[15px] leading-loose tracking-wide flex-1">
                                    {renderFormattedText(point)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            {/* Image après la section */}
                            {section.image && (
                              <div className="mt-6">
                                {section.imageLink ? (
                                  <a
                                    href={section.imageLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block relative w-full max-w-xs mx-auto cursor-pointer hover:scale-[1.02] transition-all duration-200 rounded-2xl border-2 border-rose-200 hover:border-rose-400 shadow-md hover:shadow-xl overflow-hidden"
                                  >
                                    <Image
                                      src={section.image}
                                      alt={`${memo.title} - ${section.title}`}
                                      width={300}
                                      height={300}
                                      className="w-full h-auto"
                                      sizes="300px"
                                    />
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap flex items-center gap-1.5">
                                      <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                      </svg>
                                      En savoir plus
                                    </div>
                                  </a>
                                ) : section.imageNoClick ? (
                                  <div
                                    className={`${section.imageHalfSize ? "max-w-[25%] mx-auto" : "w-full"}`}
                                  >
                                    <Image
                                      src={section.image}
                                      alt={`${memo.title} - ${section.title}`}
                                      width={800}
                                      height={600}
                                      className="w-full h-auto rounded-xl"
                                      sizes={
                                        section.imageHalfSize
                                          ? "280px"
                                          : "(max-width: 768px) 100vw, 800px"
                                      }
                                    />
                                  </div>
                                ) : (
                                  <ClickableImage
                                    src={section.image}
                                    alt={`${memo.title} - ${section.title}`}
                                    onImageClick={handleImageClick}
                                  />
                                )}
                              </div>
                            )}
                            {/* Images multiples après la section */}
                            {section.images && section.images.length > 0 && (
                              <div className="mt-6 space-y-4">
                                {section.images.map((img, imgIndex) => (
                                  <ClickableImage
                                    key={imgIndex}
                                    src={img}
                                    alt={`${memo.title} - ${section.title} - Image ${imgIndex + 1}`}
                                    onImageClick={handleImageClick}
                                    thumbnail={
                                      img === "/grossesse/2-grossesse.png"
                                    }
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  {memo.content.links && memo.content.links.length > 0 && (
                    <div className="flex flex-wrap gap-4 pt-4">
                      {memo.content.links.map((link, index) => {
                        const isInternal = link.url.startsWith("/");
                        return (
                          <a
                            key={index}
                            href={link.url}
                            {...(!isInternal && {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            })}
                            className={`group inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-700 text-white text-sm font-semibold hover:from-pink-700 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-pink-500/20`}
                          >
                            <svg
                              className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            <span className="tracking-wide">{link.label}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center py-8 text-sm italic">
                  Contenu du mémo à venir...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox pour voir l'image en grand */}
      <ImageLightbox
        src={lightboxImage}
        alt={memo.title}
        isOpen={!!lightboxImage}
        onClose={closeLightbox}
      />
    </>
  );
}

export default function MemosSuiviPage() {
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const openMemoId = searchParams.get("openMemo");

  useEffect(() => {
    if (!openMemoId) {
      return;
    }

    const memo = (memosData.memos as Memo[]).find((entry) => entry.id === openMemoId);

    if (!memo) {
      return;
    }

    setSelectedMemo(memo);
    setIsModalOpen(true);
  }, [openMemoId]);

  const handleCardClick = (memo: Memo) => {
    setSelectedMemo(memo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMemo(null), 200);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Full screen height */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-emerald-50/50 via-background to-teal-50/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-6xl mx-auto">
            {/* Texte */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                <div className="w-12 lg:w-16 h-1 bg-primary rounded-full" />
                <span className="text-xs lg:text-sm font-semibold text-primary uppercase tracking-widest">
                  Prévention
                </span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
                {memosData.hero.title}
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                {memosData.hero.subtitle}
              </p>
            </div>

            {/* Illustration */}
            <div className="flex-1 relative w-full max-w-sm lg:max-w-xl h-[280px] lg:h-[500px]">
              <Image
                src="/prevention/memo-suivi/memo-suivi-hero.svg"
                alt="Les fiches de suivi illustration"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 600px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-10 lg:py-14 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg lg:text-xl font-bold text-foreground mb-2 uppercase tracking-wide">
              Les fiches de suivi
            </h2>
            <div className="w-14 h-1 bg-primary rounded-full mb-6" />

            <div className="space-y-4 text-base lg:text-lg text-muted-foreground leading-relaxed">
              <p>
                Si vous êtes porteur{" "}
                <strong className="text-foreground">
                  d'une maladie chronique
                </strong>{" "}
                (Diabète, Hypertension, Insuffisance Cardiaque…) vous justifiez
                d'un{" "}
                <span className="text-primary font-semibold">
                  suivi régulier
                </span>{" "}
                auprès de votre médecin référent et de vos spécialistes.
              </p>
              <p>
                Il en est de même au moment de{" "}
                <strong className="text-foreground">votre grossesse</strong> ou{" "}
                <strong className="text-foreground">
                  à certains âges clefs
                </strong>{" "}
                (petite enfance, adolescence, âge senior). Un mémo vous est
                proposé pour résumer ces suivis et ainsi les faciliter.
              </p>
              <p>
                <strong className="text-foreground">
                  Soyez acteur de votre soin
                </strong>{" "}
                : un suivi rapproché permet de{" "}
                <strong className="text-foreground">
                  mieux contrôler votre maladie
                </strong>{" "}
                ou votre état clinique et évite, voire repousse, ses
                complications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
              {memosData.memos.map((memo) => (
                <FlipCard
                  key={memo.id}
                  memo={memo}
                  onClick={() => handleCardClick(memo)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modal */}
      <MemoModal
        memo={selectedMemo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* CSS pour l'animation 3D flip */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </main>
  );
}
