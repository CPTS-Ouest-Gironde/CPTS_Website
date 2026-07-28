import type { ReactNode } from "react";
import { Archivo_Black, Caveat } from "next/font/google";
import { AlertTriangle, Plane } from "lucide-react";

export const displayFont = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
});

export const handFont = Caveat({
  weight: ["600", "700"],
  subsets: ["latin"],
});

export function renderInline(
  text: string,
  strongClass = "font-bold text-stone-900",
) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className={strongClass}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

interface ChapterHeadingProps {
  num: string;
  label: string;
  title: string;
}

export function ChapterHeading({
  num,
  label,
  title,
}: ChapterHeadingProps) {
  return (
    <div className="relative mb-10 lg:mb-14">
      <span
        aria-hidden
        className={`${displayFont.className} pointer-events-none absolute -top-8 -left-2 text-[7rem] leading-none text-amber-400/40 select-none lg:-top-16 lg:text-[12rem]`}
      >
        {num}
      </span>
      <div className="relative pt-10 lg:pt-16">
        <span
          className={`${handFont.className} mb-1 inline-block -rotate-2 text-2xl text-amber-600`}
        >
          {label}
        </span>
        <h2
          className={`${displayFont.className} text-balance text-2xl leading-tight text-stone-900 uppercase sm:text-3xl lg:text-5xl`}
        >
          {title}
        </h2>
        <div className="mt-4 flex items-center gap-2" aria-hidden>
          <span className="h-1 w-16 rounded-full bg-stone-900" />
          <Plane className="h-4 w-4 rotate-45 text-stone-900" />
          <span className="flex-1 border-t-2 border-dashed border-stone-300" />
        </div>
      </div>
    </div>
  );
}

interface AlertBannerProps {
  tone: "danger" | "warning";
  title: string;
  children: ReactNode;
}

export function AlertBanner({
  tone,
  title,
  children,
}: AlertBannerProps) {
  const styles =
    tone === "danger" ? "bg-red-600 text-white" : "bg-stone-900 text-amber-50";

  return (
    <div
      className={`${styles} relative overflow-hidden rounded-2xl p-6 lg:p-8`}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(-45deg,#fbbf24_0_12px,#1c1917_12px_24px)]"
      />
      <div className="flex items-start gap-4 pt-2">
        <AlertTriangle className="mt-0.5 h-7 w-7 flex-shrink-0" />
        <div>
          <p
            className={`${displayFont.className} mb-2 text-sm tracking-widest uppercase`}
          >
            {title}
          </p>
          <div className="text-sm leading-relaxed opacity-95 lg:text-base">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
