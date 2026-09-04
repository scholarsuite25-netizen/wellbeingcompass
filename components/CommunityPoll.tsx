"use client";

import { useEffect, useState } from "react";
import { BarChart3, CheckCircle2, Sparkles } from "lucide-react";

type PollOption = {
  id: string;
  label: string;
  votes: number;
};

const INITIAL_OPTIONS: PollOption[] = [
  { id: "stress", label: "Managing Stress & Busy Mind", votes: 412 },
  { id: "sleep", label: "Getting Consistent Restful Sleep", votes: 298 },
  { id: "habits", label: "Nutrition & Physical Movement Habits", votes: 184 },
  { id: "boundaries", label: "Relationship Boundaries & Balance", votes: 146 },
];

export function CommunityPoll() {
  const [votedId, setVotedId] = useState<string | null>(null);
  const [options, setOptions] = useState<PollOption[]>(INITIAL_OPTIONS);

  useEffect(() => {
    const saved = localStorage.getItem("wb_poll_voted");
    if (saved) setVotedId(saved);

    const storedVotes = localStorage.getItem("wb_poll_options");
    if (storedVotes) {
      try {
        setOptions(JSON.parse(storedVotes));
      } catch {
        // use default
      }
    }
  }, []);

  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

  const handleVote = (id: string) => {
    if (votedId) return;
    const updated = options.map((opt) => (opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt));
    setOptions(updated);
    setVotedId(id);
    localStorage.setItem("wb_poll_voted", id);
    localStorage.setItem("wb_poll_options", JSON.stringify(updated));
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-brand-800 to-[#0A223C] text-white rounded-3xl p-6 md:p-8 shadow-elevated border border-white/10 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-accent-400 text-ink dark:text-[#17212B] rounded-xl font-bold">
            <BarChart3 className="h-4 w-4" />
          </span>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-accent-400">
              Community Health Pulse
            </span>
            <h2 className="font-display font-extrabold text-xl md:text-2xl text-white">
              What area of wellbeing needs the most care in your life right now?
            </h2>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/80">
          {totalVotes.toLocaleString()} Votes Recorded
        </span>
      </div>

      <p className="text-xs text-white/70 mt-3">
        {votedId
          ? "Thank you for contributing to our community health snapshot. Results update in real-time."
          : "Tap an option to cast your vote and see how other readers in the community are feeling."}
      </p>

      <div className="mt-5 space-y-3">
        {options.map((option) => {
          const percentage = Math.round((option.votes / totalVotes) * 100);
          const isSelected = votedId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={Boolean(votedId)}
              onClick={() => handleVote(option.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${
                isSelected
                  ? "border-accent-400 bg-white/15 ring-2 ring-accent-400/40"
                  : votedId
                  ? "border-white/10 bg-white/5 cursor-default"
                  : "border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 cursor-pointer"
              }`}
            >
              {votedId && (
                <div
                  className="absolute inset-y-0 left-0 bg-brand-500/30 transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative flex items-center justify-between gap-3 text-sm md:text-base">
                <span className="font-semibold text-white/95 flex items-center gap-2">
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-accent-400 shrink-0" />}
                  {option.label}
                </span>

                {votedId && (
                  <span className="font-extrabold text-accent-300 text-sm shrink-0">
                    {percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {votedId && (
        <div className="mt-4 pt-3 flex items-center justify-between text-xs text-white/70 border-t border-white/10">
          <span className="flex items-center gap-1.5 text-accent-300">
            <Sparkles className="h-3.5 w-3.5" /> Your anonymous vote is recorded
          </span>
          <span className="text-[11px] text-white/50">Poll refreshes weekly</span>
        </div>
      )}
    </div>
  );
}
