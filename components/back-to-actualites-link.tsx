import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackToActualitesLinkProps {
  className?: string;
  iconClassName?: string;
  label?: string;
  variant?: "link" | "button";
  withMobileTopOffset?: boolean;
}

export function BackToActualitesLink({
  className,
  iconClassName,
  label = "Retour aux actualités",
  variant = "link",
  withMobileTopOffset = true,
}: BackToActualitesLinkProps) {
  return (
    <Link
      href="/#actualites"
      className={cn(
        "inline-flex items-center gap-2",
        variant === "link" && "text-primary hover:text-primary/80 transition-colors",
        withMobileTopOffset && "mt-5 lg:mt-0",
        className
      )}
    >
      <ArrowLeft className={cn("w-4 h-4", iconClassName)} />
      <span>{label}</span>
    </Link>
  );
}
