"use client";

import { useReactions, useToggleReaction } from "@/hooks/useReactions";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";

const REACTIONS = [
  { type: "LIKE",  emoji: "👍", label: "Me gusta" },
  { type: "HEART", emoji: "❤️", label: "Me encanta" },
  { type: "FIRE",  emoji: "🔥", label: "Increíble" },
  { type: "CLAP",  emoji: "👏", label: "Aplausos" },
];

interface Props { readonly eventId: string }

export default function ReactionBar({ eventId }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { data } = useReactions(eventId);
  const toggleMutation = useToggleReaction(eventId);

  const handleReact = (type: string) => {
    if (!user) { router.push("/login"); return; }
    toggleMutation.mutate(type);
  };

  const counts = data?.counts ?? { LIKE: 0, HEART: 0, FIRE: 0, CLAP: 0 };
  const userReaction = data?.userReaction ?? null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {REACTIONS.map(({ type, emoji, label }) => {
        const count  = counts[type] ?? 0;
        const active = userReaction === type;
        return (
          <button
            key={type}
            onClick={() => handleReact(type)}
            title={label}
            disabled={toggleMutation.isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              active
                ? "bg-blue-50 border-blue-300 text-blue-700 scale-105"
                : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <span>{emoji}</span>
            {count > 0 && <span className="text-xs">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
