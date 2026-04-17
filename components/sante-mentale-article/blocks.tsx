import { BoldText } from "./bold-text";

export type Block =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export function Blocks({
  blocks,
  textClass,
  bold = false,
}: {
  blocks: Block[];
  textClass: string;
  bold?: boolean;
}) {
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => {
        if (b.type === "paragraph") {
          return (
            <p key={i} className={textClass}>
              {bold ? <BoldText text={b.text} /> : b.text}
            </p>
          );
        }
        return (
          <ul key={i} className="space-y-2 pl-1">
            {b.items.map((it, j) => (
              <li key={j} className={`flex items-start gap-2.5 ${textClass}`}>
                <span
                  className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                  aria-hidden="true"
                />
                <span>{bold ? <BoldText text={it} /> : it}</span>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
