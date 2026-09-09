type Zone = {
  id: string;
  number: number;
  title: string;
  color: string;
};

// Cerveau vu de profil, face à droite, dans un viewBox 400x300.
// Chaque zone est une ellipse découpée par la silhouette du cerveau.
const zoneShapes: Record<
  string,
  { cx: number; cy: number; rx: number; ry: number; label: [number, number] }
> = {
  attention: { cx: 322, cy: 128, rx: 96, ry: 112, label: [318, 120] },
  sommeil: { cx: 196, cy: 86, rx: 98, ry: 72, label: [196, 82] },
  langage: { cx: 96, cy: 142, rx: 72, ry: 88, label: [100, 140] },
  memoire: { cx: 150, cy: 200, rx: 66, ry: 44, label: [152, 200] },
  emotions: { cx: 256, cy: 204, rx: 86, ry: 42, label: [262, 206] },
};

// Ordre de dessin : les dernières ellipses passent au-dessus
const drawOrder = ["attention", "sommeil", "langage", "memoire", "emotions"];

const cerebrum =
  "M 64 168 C 50 138 60 100 92 82 C 96 62 122 46 148 52 C 160 32 200 24 226 38 C 250 24 292 30 312 56 C 340 62 366 92 362 128 C 378 148 370 184 344 196 C 342 218 314 232 290 220 C 268 236 226 240 198 228 C 172 236 142 228 128 210 C 100 214 72 198 64 168 Z";
const cerebellum =
  "M 108 214 C 84 222 80 252 102 268 C 124 284 172 284 190 266 C 206 250 196 222 174 214 Z";
const brainstem =
  "M 190 226 C 192 250 198 272 212 292 L 236 288 C 226 268 224 246 224 226 Z";

const sulci = [
  "M 128 196 C 170 178 220 172 262 156",
  "M 232 40 C 226 80 236 110 228 150",
  "M 300 70 C 288 96 312 118 296 150",
  "M 330 120 C 322 140 340 160 326 184",
  "M 150 70 C 160 95 146 120 158 148",
  "M 96 110 C 108 128 96 150 110 172",
  "M 180 212 C 200 204 226 206 246 218",
  "M 268 196 C 288 190 304 198 318 206",
  "M 190 108 C 200 126 186 140 200 160",
];

const ink = "#3F3A34";

export function BrainMap({ zones }: { zones: Zone[] }) {
  const byId = Object.fromEntries(zones.map((z) => [z.id, z]));
  const ordered = drawOrder.map((id) => byId[id]).filter(Boolean);
  const title = `Schéma du cerveau avec les cinq zones numérotées : ${zones
    .map((z) => `${z.number} ${z.title}`)
    .join(", ")}`;

  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-labelledby="brain-map-title"
      className="w-full h-auto"
    >
      <title id="brain-map-title">{title}</title>
      <defs>
        <clipPath id="brain-cerebrum-clip">
          <path d={cerebrum} />
        </clipPath>
      </defs>

      {/* Tronc cérébral et cervelet, derrière le cerveau */}
      <path
        d={brainstem}
        fill="#E4DCCF"
        stroke={ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d={cerebellum}
        fill="#E9E2D6"
        stroke={ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <g
        fill="none"
        stroke={ink}
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M 104 236 C 128 230 160 230 184 238" />
        <path d="M 100 250 C 128 244 162 244 188 252" />
        <path d="M 110 264 C 132 258 160 258 180 266" />
      </g>

      {/* Lobes colorés */}
      <g clipPath="url(#brain-cerebrum-clip)">
        <rect
          width="400"
          height="300"
          fill={ordered[ordered.length - 1].color}
        />
        {ordered.map((z) => {
          const s = zoneShapes[z.id];
          return (
            <ellipse
              key={z.id}
              cx={s.cx}
              cy={s.cy}
              rx={s.rx}
              ry={s.ry}
              fill={z.color}
            />
          );
        })}
        <g
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.6"
          strokeWidth="3"
          strokeLinecap="round"
        >
          {sulci.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>

      <path
        d={cerebrum}
        fill="none"
        stroke={ink}
        strokeWidth="3"
        strokeLinejoin="round"
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
