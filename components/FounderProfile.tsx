import Link from "next/link";
import { Badge } from "./ui/Badge";
import { FOUNDER, FOUNDER_ABOUT_AUTHOR } from "@/lib/founders";
import type { Author } from "@/lib/content";

export function AboutTheAuthor({ author, compact }: { author?: Author; compact?: boolean }) {
  const a = author?.isFounder ? author : FOUNDER;
  const byline = a.credentials ? `${a.name}, ${a.credentials}` : a.name;
  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <img src={a.profilePhoto || a.avatar} alt={a.name} width={72} height={72} className={`rounded-full object-cover object-top shrink-0 ${compact ? "h-14 w-14" : "h-16 w-16 md:h-20 md:w-20"}`} />
        <div className="min-w-0">
          <p className="font-display font-bold text-base leading-tight text-brand-700">{byline}</p>
          <p className="text-xs text-brand-600 font-semibold mt-0.5">{a.professionalTitle || a.role}</p>
          {a.currentPosition && <p className="text-xs text-muted">{a.currentPosition}</p>}
        </div>
      </div>
      <p className="text-sm text-muted mt-3 leading-relaxed">{a.isFounder ? FOUNDER_ABOUT_AUTHOR : a.bio}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        <Link href="/about-the-founder" className="inline-flex bg-brand-700 hover:bg-[#0A223C] text-white text-xs font-bold px-4 py-2 rounded-full transition">
          View Full Profile
        </Link>
        <Link href="/authors/christianah-oyinloye" className="inline-flex bg-surface border border-border text-brand-700 hover:bg-brand-50 text-xs font-bold px-4 py-2 rounded-full transition">
          Read Her Articles
        </Link>
      </div>
    </div>
  );
}

export function FounderHeroBadge() {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="accent">{FOUNDER.credentials}</Badge>
      <Badge variant="default">Founder & Health Professional</Badge>
    </div>
  );
}
