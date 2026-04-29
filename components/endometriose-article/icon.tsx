import {
  Activity,
  BadgeAlert,
  HeartHandshake,
  HeartPulse,
  Info,
  Layers,
  MapPinned,
  Microscope,
  Pill,
  ScanSearch,
  Stethoscope,
  Syringe,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Activity,
  BadgeAlert,
  HeartHandshake,
  HeartPulse,
  Layers,
  MapPinned,
  Microscope,
  Pill,
  ScanSearch,
  Stethoscope,
  Syringe,
  Users,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const CurrentIcon = iconMap[name] ?? Info;

  return <CurrentIcon className={className} aria-hidden="true" />;
}
