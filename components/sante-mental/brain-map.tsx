type Zone = {
  id: string;
  number: number;
  title: string;
  color: string;
};

// Position de chaque zone dans le viewBox 400x300 (cerveau vu de profil, face à droite)
const zoneShapes: Record<
  string,
  { cx: number; cy: number; rx: number; ry: number; label: [number, number] }
> = {
  attention: { cx: 310, cy: 130, rx: 100, ry: 120, label: [300, 130] },
  sommeil: { cx: 190, cy: 88, rx: 95, ry: 82, label: [190, 82] },
  langage: { cx: 95, cy: 150, rx: 85, ry: 95, label: [100, 140] },
  emotions: { cx: 245, cy: 220, rx: 85, ry: 60, label: [240, 218] },
  memoire: { cx: 145, cy: 230, rx: 85, ry: 62, label: [145, 228] },
};

const outline =
  "M 68 150 C 58 92 108 40 180 45 C 232 18 322 30 352 92 C 382 132 372 192 332 212 C 322 242 282 252 250 236 C 230 262 168 266 140 242 C 100 252 70 230 65 200 C 55 180 60 165 68 150 Z";

export function BrainMap({ zones }: { zones: Zone[] }) {
  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-labelledby="brain-map-title"
      className="w-full h-auto"
    >
      <title id="brain-map-title">
        Schéma du cerveau avec les cinq zones numérotées :{" "}
        {zones.map((z) => `${z.number} ${z.title}`).join(", ")}
      </title>
      <defs>
        <clipPath id="brain-clip">
          <path d={outline} />
        </clipPath>
      </defs>

      {/* Zones colorées, découpées par la silhouette */}
      <g clipPath="url(#brain-clip)">
        <rect width="400" height="300" fill={zones[3]?.color ?? "#C4707E"} />
        {zones.map((z) => {
          const s = zoneShapes[z.id];
          if (!s) return null;
          return (
            <ellipse
              key={z.id}
              cx={s.cx}
              cy={s.cy}
              rx={s.rx}
              ry={s.ry}
              fill={z.color}
              fillOpacity="0.85"
            />
          );
        })}
        {/* Sillons */}
        <g
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.55"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <path d="M 120 70 C 150 95 140 130 170 150" />
          <path d="M 220 50 C 210 90 240 110 230 150" />
          <path d="M 290 70 C 275 110 300 140 285 180" />
          <path d="M 100 190 C 140 175 190 195 230 180" />
          <path d="M 300 200 C 320 180 340 185 350 160" />
        </g>
      </g>

      {/* Silhouette */}
      <path
        d={outline}
        fill="none"
        stroke="#3F3A34"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Tronc cérébral */}
      <path
        d="M 195 258 C 200 275 205 285 215 296"
        fill="none"
        stroke="#3F3A34"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Numéros */}
      {zones.map((z) => {
        const s = zoneShapes[z.id];
        if (!s) return null;
        const [x, y] = s.label;
        return (
          <g key={`n-${z.id}`}>
            <circle cx={x} cy={y} r="15" fill="#FFFFFF" />
            <circle
              cx={x}
              cy={y}
              r="15"
              fill="none"
              stroke={z.color}
              strokeWidth="2.5"
            />
            <text
              x={x}
              y={y + 5.5}
              textAnchor="middle"
              fontSize="16"
              fontWeight="700"
              fill={z.color}
              fontFamily="inherit"
            >
              {z.number}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
