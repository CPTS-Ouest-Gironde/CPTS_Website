"use client";

import { useState } from "react";
import { Check, Luggage } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
}

interface ChecklistGroup {
  title: string;
  items: ChecklistItem[];
}

interface TravelChecklistProps {
  groups: ChecklistGroup[];
}

/**
 * Checklist interactive "trousse de secours" : l'utilisateur coche ce qu'il a
 * déjà préparé, une jauge de progression se remplit. État local uniquement.
 */
export function TravelChecklist({ groups }: TravelChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const totalCount = groups.reduce((sum, group) => sum + group.items.length, 0);
  const checkedCount = checked.size;
  const percent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Jauge de progression */}
      <div className="bg-stone-900 text-amber-50 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center flex-shrink-0">
          <Luggage className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <p className="text-sm font-bold uppercase tracking-wider">Votre trousse</p>
            <p className="text-xs text-amber-50/70 tabular-nums">
              {checkedCount}/{totalCount} — {percent === 100 ? "Prête au décollage !" : `${percent}%`}
            </p>
          </div>
          <div className="h-2 rounded-full bg-stone-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Groupes d'items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {groups.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border-2 border-dashed border-stone-300 bg-white/70 p-5"
          >
            <h4 className="text-xs font-black uppercase tracking-widest text-stone-500 mb-4">
              {group.title}
            </h4>
            <ul className="space-y-2.5">
              {group.items.map((item) => {
                const isChecked = checked.has(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-pressed={isChecked}
                      className="w-full flex items-start gap-3 text-left group"
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          isChecked
                            ? "bg-amber-400 border-amber-400 text-stone-900 scale-105"
                            : "border-stone-300 bg-white group-hover:border-amber-400"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                      </span>
                      <span
                        className={`text-sm leading-snug transition-colors duration-200 ${
                          isChecked ? "text-stone-400 line-through" : "text-stone-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
