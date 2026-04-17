import { cn } from "@/lib/utils";

interface YouTubeShortEmbedProps {
  url: string;
  title: string;
  className?: string;
}

function getEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    if (parsedUrl.hostname.includes("youtu.be") && pathSegments[0]) {
      return `https://www.youtube-nocookie.com/embed/${pathSegments[0]}?rel=0&modestbranding=1`;
    }

    if (pathSegments[0] === "shorts" && pathSegments[1]) {
      return `https://www.youtube-nocookie.com/embed/${pathSegments[1]}?rel=0&modestbranding=1`;
    }

    const videoId = parsedUrl.searchParams.get("v");

    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
  } catch {
    return null;
  }

  return null;
}

export function YouTubeShortEmbed({
  url,
  title,
  className,
}: YouTubeShortEmbedProps) {
  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return null;
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="aspect-[9/16] w-full bg-black">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
