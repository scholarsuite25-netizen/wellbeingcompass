import Link from "next/link";
import { articles } from "@/lib/content";
import { waShareLink } from "@/lib/contact";
import { env } from "@/lib/env";
import { MessageCircle, Megaphone } from "lucide-react";

export const metadata = { title: "Promoter Broadcast" };

export default function BroadcastPage() {
  const sorted = [...articles].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  const origin = env.NEXT_PUBLIC_SITE_URL;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="bg-gradient-to-br from-brand-700 to-[#0A223C] text-white rounded-3xl p-8">
        <p className="inline-flex items-center gap-2 text-accent-400 font-extrabold text-xs tracking-widest uppercase">
          <Megaphone className="h-4 w-4" /> Promoter — Zero-Cost WhatsApp Broadcast
        </p>
        <h1 className="font-display font-extrabold text-3xl mt-2">Share new articles on WhatsApp</h1>
        <p className="text-white/85 mt-2 text-sm max-w-2xl">
          Tap <b>“Share on WhatsApp”</b> below for any article. It opens WhatsApp with a ready message —
          just choose who to send it to (contacts or a group). No API, no cost, no code. This is how new
          articles reach your members automatically on your side.
        </p>
        <p className="text-accent-200 text-xs mt-3">Tip: create a WhatsApp broadcast list for all registered members and add them in one go.</p>
      </div>

      <div className="mt-6 space-y-3">
        {sorted.map(a => {
          const msg = `🆕 Wellbeing Compass\n\n${a.title}\n\n${a.deck}\n\nRead the full article here 👇\n${origin}/articles/${a.slug}`;
          return (
            <div key={a.slug} className="bg-white border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted uppercase tracking-widest">{a.category} • {a.readingTime} min</p>
                <Link href={`/articles/${a.slug}`} className="font-semibold text-brand-700 hover:underline line-clamp-2 block mt-0.5">{a.title}</Link>
              </div>
              <a
                href={waShareLink(msg)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#1fbd5a] transition shadow-sm"
              >
                <MessageCircle className="h-4 w-4" /> Share on WhatsApp
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
