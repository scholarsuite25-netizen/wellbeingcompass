import Link from "next/link";
import { articles } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/lib/content";

export const metadata = { title: "Article Archives" };

// Group a list of articles into buckets by a keying function
function groupBy<T>(arr: T[], key: (x: T) => string): { key: string; items: T[] }[] {
  const map = new Map<string, T[]>();
  for (const it of arr) {
    const k = key(it);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(it);
  }
  return [...map.entries()].map(([key, items]) => ({ key, items })).sort((a, b) => (a.key < b.key ? 1 : -1));
}

export default function ArchivesPage() {
  const sorted = [...articles].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  const years = groupBy(sorted, (a) => new Date(a.publishedAt).getFullYear().toString());
  const months = groupBy(sorted, (a) => {
    const d = new Date(a.publishedAt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const weeks = groupBy(sorted, (a) => {
    const d = new Date(a.publishedAt);
    // ISO week number
    const tmp = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayNum = (tmp.getDay() + 6) % 7;
    tmp.setDate(tmp.getDate() - dayNum + 3);
    const firstThu = new Date(tmp.getFullYear(), 0, 4);
    const week = 1 + Math.round(((tmp.getTime() - firstThu.getTime()) / 86400000 - 3 + ((firstThu.getDay() + 6) % 7)) / 7);
    return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display font-extrabold text-3xl text-brand-700">Article Archives</h1>
      <p className="text-muted mt-2">Browse past articles grouped by week, month and year.</p>

      {[ {title: "By Year", groups: years}, {title: "By Month", groups: months}, {title: "By Week", groups: weeks} ].map(sec => (
        <section key={sec.title} className="mt-8">
          <h2 className="font-display font-bold text-xl text-brand-700">{sec.title}</h2>
          <div className="mt-3 grid md:grid-cols-2 gap-4">
            {sec.groups.map(g => (
              <details key={g.key} className="bg-white border border-border rounded-2xl p-4 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-ink">
                  {g.key} <span className="text-brand-500 group-open:rotate-180 transition">⌄</span>
                </summary>
                <ul className="mt-3 space-y-2">
                  {g.items.map(a => (
                    <li key={a.slug}>
                      <Link href={`/articles/${a.slug}`} className="text-sm text-brand-700 hover:underline line-clamp-2">{a.title}</Link>
                      <p className="text-xs text-muted">{formatDate(a.publishedAt)} • {a.readingTime} min</p>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
