type RcpTeamCardProps = {
  label: string;
  members: string;
  variant: "complex" | "psy";
};

const variants: Record<RcpTeamCardProps["variant"], string> = {
  complex: "bg-primary/5 p-6 rounded-xl",
  psy: "bg-secondary/60 p-6 rounded-xl",
};

export function RcpTeamCard({ label, members, variant }: RcpTeamCardProps) {
  return (
    <div className={variants[variant]}>
      <p className="text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground">{label}</span> {members}
      </p>
    </div>
  );
}
