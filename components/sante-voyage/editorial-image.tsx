import Image from "next/image";

interface EditorialImageProps {
  src: string;
  alt: string;
  label: string;
  portrait?: boolean;
  responsivePortrait?: boolean;
  desktopFill?: boolean;
  objectPosition?: string;
  priority?: boolean;
  sizes?: string;
}

export function EditorialImage({
  src,
  alt,
  label,
  portrait = false,
  responsivePortrait = false,
  desktopFill = false,
  objectPosition = "center",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 960px",
}: EditorialImageProps) {
  const aspectClass = desktopFill
    ? "aspect-[16/10] lg:h-full lg:aspect-auto"
    : portrait
      ? "aspect-[4/5]"
      : responsivePortrait
        ? "aspect-[16/10] lg:aspect-[4/5]"
        : "aspect-[16/9] lg:aspect-[2/1]";

  return (
    <figure
      className={`relative isolate overflow-hidden rounded-[2rem] bg-stone-900 shadow-[0_24px_70px_-32px_rgba(28,25,23,0.65)] ${
        desktopFill ? "lg:h-full" : ""
      }`}
    >
      <div className={`relative w-full ${aspectClass}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ objectPosition }}
          sizes={sizes}
          priority={priority}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-stone-950/15"
        />
        <div
          aria-hidden
          className="absolute inset-3 rounded-[1.4rem] border border-white/25"
        />

        <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
          <figcaption className="max-w-[85%] text-sm font-bold uppercase tracking-[0.16em] text-white lg:text-base">
            {label}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
