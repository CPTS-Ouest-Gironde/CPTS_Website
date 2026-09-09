import type { CSSProperties } from "react";
import {
  Baby,
  BatteryLow,
  BedDouble,
  Bike,
  BookOpenCheck,
  Hand,
  HeartHandshake,
  HeartPulse,
  House,
  Leaf,
  LockKeyhole,
  MessagesSquare,
  MonitorSmartphone,
  MoonStar,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Timer,
  Tornado,
  TreePine,
  type LucideIcon,
} from "lucide-react";

// Icônes de l'article "Santé mentale et numérique" (questions + repères)
export const numeriqueIconMap: Record<string, LucideIcon> = {
  Baby,
  BatteryLow,
  BedDouble,
  Bike,
  BookOpenCheck,
  Hand,
  HeartHandshake,
  HeartPulse,
  House,
  Leaf,
  LockKeyhole,
  MessagesSquare,
  MonitorSmartphone,
  MoonStar,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Timer,
  Tornado,
  TreePine,
};

export function NumeriqueIcon({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  const I = numeriqueIconMap[name] ?? Leaf;
  return <I className={className} style={style} aria-hidden="true" />;
}
