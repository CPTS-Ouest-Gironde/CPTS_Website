import { ExternalLink } from "lucide-react";
import { YouTubeShortEmbed } from "@/components/youtube-short-embed";
import type { VideosSection } from "@/app/data/endometriose-depistage-prise-en-charge.schema";
import { SectionLayout } from "@/components/endometriose-article/section-layout";

interface VideosSectionViewProps {
  section: VideosSection;
}

export function VideosSectionView({ section }: VideosSectionViewProps) {
  return (
    <SectionLayout
      id={section.id}
      title={section.title}
      intro={section.intro}
      tone={section.tone}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {section.videos.map((video) => (
          <article
            key={video.url}
            className="relative overflow-hidden rounded-3xl border border-[#e5cfc9] bg-[#faf3ef] p-4 pl-5 md:p-6 md:pl-7"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-[#b85c5c]/40"
            />
            <h3 className="mb-4 text-xl font-bold text-[#3d2b2f]">
              {video.title}
            </h3>
            <YouTubeShortEmbed
              url={video.url}
              title={video.title}
              className="mx-auto max-w-[320px]"
            />
            <div className="mt-4 flex justify-center">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#b85c5c] px-5 py-2.5 text-sm font-semibold text-[#b85c5c]"
                aria-label={`Ouvrir la vidéo ${video.title} sur YouTube`}
              >
                Voir sur YouTube
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </SectionLayout>
  );
}
