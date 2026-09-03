import { Sparkles } from "lucide-react";

const TIPS: { title: string; body: string }[] = [
  { title: "Breathe to reset", body: "Inhale for 4, hold for 2, exhale for 6. Repeat 4 times — it calms your nervous system and lowers stress." },
  { title: "Move your body", body: "Even 10 minutes of walking or stretching daily improves mood, energy and heart health." },
  { title: "Sleep anchor", body: "Keep one fixed wake time for a week and step into daylight within an hour — it resets your body clock." },
  { title: "Hydrate first", body: "Start your day with a glass of water. Mild dehydration can cause fatigue and irritability." },
  { title: "Connect daily", body: "Send a sincere check-in to one person. Social connection is a protective factor for health." },
  { title: "Limit screens", body: "Take a 15-minute screen break every 90 minutes to reduce eye strain and mental fatigue." },
  { title: "Gratitude note", body: "Write down three things you're grateful for. It shifts focus to the positive and eases worry." },
  { title: "Mindful meal", body: "Eat slowly without your phone. Mindfulness during meals supports digestion and healthier choices." },
];

// Deterministic pick by day so the tip changes daily
export function HealthTipOfTheDay() {
  const day = Math.floor(Date.now() / 86_400_000);
  const tip = TIPS[day % TIPS.length];
  return (
    <div className="bg-gradient-to-br from-brand-700 to-[#0A223C] text-white rounded-2xl p-5">
      <p className="inline-flex items-center gap-1.5 text-accent-400 font-extrabold text-xs tracking-widest uppercase">
        <Sparkles className="h-4 w-4" /> Health Tip of the Day
      </p>
      <h3 className="font-display font-bold text-lg mt-2 leading-tight">{tip.title}</h3>
      <p className="text-sm text-white/85 mt-1.5 leading-relaxed">{tip.body}</p>
    </div>
  );
}
