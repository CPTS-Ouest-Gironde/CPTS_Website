"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  VisuallyHidden,
} from "@/components/ui/dialog";

type ZoomableImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
};

export function ZoomableImage({
  src,
  alt,
  width,
  height,
  sizes,
}: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Agrandir l'image : ${alt}`}
        className="relative block w-full cursor-zoom-in border border-primary/15 bg-white lg:pointer-events-none lg:cursor-default"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className="h-auto w-full"
        />
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm lg:hidden"
        >
          <ZoomIn className="h-4 w-4 text-foreground" />
        </span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] max-w-[1024px] p-2 rounded-none overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>{alt}</DialogTitle>
          </VisuallyHidden>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 1024px"
            className="h-auto w-full"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
