import type { Metadata } from "next";
import Image from "next/image";
import {
  AirVent,
  Apple,
  Baby,
  Backpack,
  Ban,
  CalendarClock,
  DoorClosed,
  Droplets,
  ExternalLink,
  Eye,
  Flame,
  Gauge,
  Footprints,
  Glasses,
  Haze,
  Heart,
  HeartPulse,
  House,
  PersonStanding,
  Phone,
  Radio,
  ScanSearch,
  Shield,
  Siren,
  Skull,
  Snowflake,
  Stethoscope,
  TriangleAlert,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackToActualitesLink } from "@/components/back-to-actualites-link";
import data from "@/app/data/feu-du-porge.json";

const iconMap: Record<string, LucideIcon> = {
  AirVent,
  Apple,
  Baby,
  Backpack,
  Ban,
  CalendarClock,
  DoorClosed,
  Droplets,
  Eye,
  Footprints,
  Glasses,
  Heart,
  HeartPulse,
  House,
  PersonStanding,
  Radio,
  ScanSearch,
  Shield,
  Skull,
  Snowflake,
  Stethoscope,
  TriangleAlert,
  Wind,
};

export const metadata: Metadata = {
  title: `${data.alert.title} | CPTS Ouest Gironde`,
  description:
    "Fumées d'incendie : risques pour la santé et les 8 recommandations validées par des médecins pour se protéger.",
};

function ItemIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? TriangleAlert;
  return <Icon className={className} aria-hidden="true" />;
}

export default function FeuDuPorgePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-24 lg:pt-28 pb-10 lg:pb-14">
        <div className="container mx-auto px-4 lg:px-8">
          <BackToActualitesLink className="mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-14 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-600/10 px-4 py-1.5 mb-5">
                <Flame className="w-4 h-4 text-red-600" aria-hidden="true" />
                <span className="text-sm font-semibold uppercase tracking-wider text-red-600">
                  Fumées d&apos;incendie
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] lg:leading-[1.15] font-bold text-balance mb-5 text-foreground">
                {data.alert.title}
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                Les fumées présentent des risques réels pour la santé. Voici les
                recommandations de vos médecins pour vous protéger, vous et vos
                proches.
              </p>
            </div>
            <div className="relative w-full max-w-sm lg:max-w-md mx-auto aspect-square rounded-3xl overflow-hidden shadow-lg border border-border">
              <Image
                src={data.alert.image}
                alt={data.alert.imageAlt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Numéros d'urgence */}
      <section className="bg-red-600 text-white">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.emergencyNumbers.map((entry) => (
              <div
                key={entry.number}
                className="flex items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-sm p-4"
              >
                <div className="flex items-center justify-center shrink-0 min-w-14 h-14 px-3 rounded-xl bg-white text-red-700 text-xl font-extrabold">
                  {entry.number}
                </div>
                <div>
                  <p className="font-bold">{entry.label}</p>
                  <p className="text-sm text-white/80 leading-snug">
                    {entry.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risques */}
      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shrink-0">
              <TriangleAlert className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground uppercase">
              {data.risks.title}
            </h2>
          </div>

          <div className="rounded-3xl border-2 border-red-500/30 bg-red-500/5 p-6 lg:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <ItemIcon
                name={data.risks.lungsHeart.iconName}
                className="w-7 h-7 text-red-600"
              />
              <h3 className="text-xl lg:text-2xl font-bold text-foreground">
                {data.risks.lungsHeart.title}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.risks.lungsHeart.items.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-background border border-red-500/20 p-5"
                >
                  <ItemIcon
                    name={item.iconName}
                    className="w-6 h-6 text-red-600 mb-3"
                  />
                  <p className="font-bold text-foreground mb-2">{item.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.risks.other.map((risk) => (
              <div
                key={risk.title}
                className="rounded-3xl border-2 border-orange-500/30 bg-orange-500/5 p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <ItemIcon
                    name={risk.iconName}
                    className="w-7 h-7 text-orange-600"
                  />
                  <h3 className="text-xl font-bold text-foreground">
                    {risk.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {risk.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 recommandations */}
      <section className="py-14 lg:py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground uppercase">
              {data.recommendations.title}
            </h2>
          </div>

          {[data.recommendations.home, data.recommendations.outside].map(
            (group) => (
              <div key={group.title} className="mb-10 last:mb-0">
                <div className="flex items-center gap-3 mb-6">
                  <ItemIcon
                    name={group.iconName}
                    className="w-6 h-6 text-red-600"
                  />
                  <h3 className="text-lg lg:text-xl font-bold text-foreground uppercase tracking-wide">
                    {group.title}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl bg-background border border-border p-6 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <ItemIcon
                          name={item.iconName}
                          className="w-6 h-6 text-red-600 shrink-0"
                        />
                        <p className="font-bold text-foreground">
                          {item.label}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Personnes vigilantes */}
      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="rounded-3xl border-2 border-red-600 overflow-hidden">
            <div className="bg-red-600 text-white p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-7 h-7" aria-hidden="true" />
                <h2 className="text-xl md:text-2xl font-bold uppercase">
                  {data.vigilance.title}
                </h2>
              </div>
              <p className="text-lg font-semibold leading-relaxed">
                {data.vigilance.callTo}
              </p>
            </div>
            <div className="p-6 lg:p-8 bg-red-500/5">
              <p className="font-semibold text-foreground mb-5">
                {data.vigilance.intro}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.vigilance.profiles.map((profile) => (
                  <div
                    key={profile.label}
                    className="flex items-center gap-4 rounded-2xl bg-background border border-red-500/20 p-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0">
                      <ItemIcon
                        name={profile.iconName}
                        className="w-6 h-6 text-red-600"
                      />
                    </div>
                    <p className="font-medium text-foreground">
                      {profile.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ozone */}
      <section className="py-14 lg:py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0">
              <Haze className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground uppercase">
              {data.ozone.title}
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {data.ozone.intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="rounded-3xl border-2 border-amber-500/30 bg-amber-500/5 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <ItemIcon
                  name={data.ozone.recognize.iconName}
                  className="w-7 h-7 text-amber-600"
                />
                <h3 className="text-xl font-bold text-foreground">
                  {data.ozone.recognize.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {data.ozone.recognize.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-muted-foreground leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border-2 border-amber-500/30 bg-amber-500/5 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <ItemIcon
                  name={data.ozone.danger.iconName}
                  className="w-7 h-7 text-amber-600"
                />
                <h3 className="text-xl font-bold text-foreground">
                  {data.ozone.danger.title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {data.ozone.danger.text}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background p-6 lg:p-8">
            <h3 className="text-lg lg:text-xl font-bold text-foreground uppercase tracking-wide mb-1">
              {data.ozone.protection.title}
            </h3>
            <p className="text-muted-foreground mb-6">
              {data.ozone.protection.subtitle}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.ozone.protection.items.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5"
                >
                  <ItemIcon
                    name={item.iconName}
                    className="w-6 h-6 text-amber-600 mb-3"
                  />
                  <p className="font-bold text-foreground mb-2">{item.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Après l'incendie */}
      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shrink-0">
              <Wind className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground uppercase">
              {data.aftermath.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.aftermath.items.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-3">
                  <ItemIcon
                    name={item.iconName}
                    className="w-7 h-7 text-emerald-600"
                  />
                  <h3 className="text-xl font-bold text-foreground">
                    {item.label}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualité de l'air */}
      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="rounded-3xl border-2 border-sky-500/30 bg-sky-500/5 p-6 lg:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-16 h-16 rounded-2xl bg-sky-600 flex items-center justify-center shrink-0">
              <Gauge className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                {data.airQuality.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {data.airQuality.text}
              </p>
            </div>
            <a
              href={data.airQuality.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 text-white px-6 py-3 text-sm font-semibold hover:bg-sky-700 transition-colors shrink-0"
            >
              {data.airQuality.linkLabel}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Règle d'or */}
      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-br from-red-700 to-red-600 text-white p-8 lg:p-12 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-6">
              <Siren className="w-8 h-8" aria-hidden="true" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase mb-4">
              {data.goldenRule.title}
            </h2>
            <p className="text-lg lg:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
              {data.goldenRule.text}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
