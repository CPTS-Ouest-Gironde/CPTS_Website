import type { QuickReply } from "./types"

interface QuickRepliesProps {
  replies: QuickReply[]
  onSelect: (reply: QuickReply) => void
  trailingAction?: {
    label: string
    onClick: () => void
  }
}

export function QuickReplies({ replies, onSelect, trailingAction }: QuickRepliesProps) {
  if (!replies.length && !trailingAction) {
    return null
  }

  return (
    <div className="border-t border-border px-3 py-3" aria-label="Choix rapides">
      <div className="flex flex-wrap gap-2">
        {replies.map((reply) => (
          <button
            key={reply.id}
            type="button"
            onClick={() => onSelect(reply)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {reply.label}
          </button>
        ))}
        {trailingAction ? (
          <button
            type="button"
            onClick={trailingAction.onClick}
            className="rounded-full border border-dashed border-muted-foreground/40 bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {trailingAction.label}
          </button>
        ) : null}
      </div>
    </div>
  )
}
