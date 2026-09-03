"use client";

import { useEffect, useState } from "react";
import { Printer, Bookmark, Check } from "lucide-react";
import { toggleBookmark } from "./BookmarkDrawer";

type Props = {
  slug: string;
  title: string;
  category: string;
  readingTime: number;
};

export function ArticleActions({ slug, title, category, readingTime }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wb_bookmarks");
      if (raw) {
        const items = JSON.parse(raw);
        setSaved(items.some((i: any) => i.slug === slug));
      }
    } catch {}

    const handler = () => {
      try {
        const raw = localStorage.getItem("wb_bookmarks");
        if (raw) {
          const items = JSON.parse(raw);
          setSaved(items.some((i: any) => i.slug === slug));
        } else {
          setSaved(false);
        }
      } catch {}
    };

    window.addEventListener("wb_bookmark_changed", handler);
    return () => window.removeEventListener("wb_bookmark_changed", handler);
  }, [slug]);

  const handleBookmark = () => {
    const isNowSaved = toggleBookmark({
      slug,
      title,
      category,
      readingTime,
      savedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
    setSaved(isNowSaved);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <button
        type="button"
        onClick={handleBookmark}
        aria-label={saved ? "Saved in reading list" : "Save to reading list"}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-sm border ${
          saved
            ? "bg-accent-400 border-accent-400 text-ink"
            : "bg-surface dark:bg-[#061A33] border-border dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-brand-500"
        }`}
      >
        {saved ? <Check className="h-3.5 w-3.5 text-ink" /> : <Bookmark className="h-3.5 w-3.5" />}
        {saved ? "Saved" : "Save for offline"}
      </button>

      <button
        type="button"
        onClick={handlePrint}
        title="Print clinical handout or save as PDF"
        aria-label="Print patient educational handout"
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-surface dark:bg-[#061A33] border border-border dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-brand-500 transition shadow-sm"
      >
        <Printer className="h-3.5 w-3.5 text-brand-600 dark:text-accent-400" />
        Print Handout / PDF
      </button>
    </div>
  );
}
