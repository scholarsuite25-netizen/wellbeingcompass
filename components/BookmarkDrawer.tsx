"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, X, Trash2, ArrowRight, BookOpen } from "lucide-react";

export type SavedItem = {
  slug: string;
  title: string;
  category: string;
  readingTime: number;
  savedAt: string;
};

export function BookmarkDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SavedItem[]>([]);

  const loadItems = () => {
    try {
      const stored = localStorage.getItem("wb_bookmarks");
      if (stored) setItems(JSON.parse(stored));
      else setItems([]);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    loadItems();
    const handler = () => loadItems();
    window.addEventListener("wb_bookmark_changed", handler);
    return () => window.removeEventListener("wb_bookmark_changed", handler);
  }, []);

  const removeItem = (slug: string) => {
    const updated = items.filter((i) => i.slug !== slug);
    localStorage.setItem("wb_bookmarks", JSON.stringify(updated));
    setItems(updated);
    window.dispatchEvent(new Event("wb_bookmark_changed"));
  };

  const clearAll = () => {
    localStorage.removeItem("wb_bookmarks");
    setItems([]);
    window.dispatchEvent(new Event("wb_bookmark_changed"));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Saved reading list (${items.length} items)`}
        title="Saved reading list"
        className="relative h-8 w-8 grid place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      >
        <Bookmark className="h-3.5 w-3.5 text-white/90" />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-accent-400 text-ink text-[10px] font-extrabold grid place-items-center">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in">
          <div className="bg-white dark:bg-[#0A223C] text-ink dark:text-slate-100 w-full max-w-md h-full shadow-2xl flex flex-col p-6 overflow-hidden border-l border-border dark:border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-border dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-brand-50 dark:bg-white/10 rounded-xl text-brand-600 dark:text-accent-400">
                  <Bookmark className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="font-bold text-base text-brand-700 dark:text-white">Reading List</h2>
                  <p className="text-xs text-muted dark:text-slate-400">{items.length} saved offline {items.length === 1 ? "article" : "articles"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close reading list"
                className="h-8 w-8 grid place-items-center rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-muted dark:text-slate-400">
                  <BookOpen className="h-10 w-10 stroke-[1.25] text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="font-semibold text-sm">Your reading list is empty</p>
                  <p className="text-xs mt-1 max-w-xs">
                    Tap the bookmark icon on any article to save it for offline reading or quick reference.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.slug}
                    className="p-3.5 rounded-2xl bg-surface dark:bg-[#061A33] border border-border dark:border-white/10 flex items-start justify-between gap-3 group hover:border-brand-500 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-accent-400">
                        {item.category} • {item.readingTime} min
                      </span>
                      <Link
                        href={`/articles/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="font-bold text-sm text-brand-700 dark:text-white line-clamp-2 mt-0.5 hover:underline"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[10px] text-muted dark:text-slate-400 mt-1">Saved {item.savedAt}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/articles/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="h-8 w-8 grid place-items-center rounded-full bg-brand-50 dark:bg-white/10 text-brand-600 dark:text-accent-400 hover:bg-brand-500 hover:text-white transition"
                        title="Read now"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug)}
                        className="h-8 w-8 grid place-items-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                        title="Remove from list"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="pt-3 border-t border-border dark:border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                >
                  Clear all saved
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-brand-700 dark:bg-accent-400 text-white dark:text-ink font-bold px-4 py-1.5 rounded-full text-xs hover:opacity-90 transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Helper hook / function for cards and article detail to toggle bookmark state
export function toggleBookmark(item: SavedItem): boolean {
  try {
    const raw = localStorage.getItem("wb_bookmarks");
    const current: SavedItem[] = raw ? JSON.parse(raw) : [];
    const exists = current.some((i) => i.slug === item.slug);
    let updated: SavedItem[];
    if (exists) {
      updated = current.filter((i) => i.slug !== item.slug);
    } else {
      updated = [item, ...current];
    }
    localStorage.setItem("wb_bookmarks", JSON.stringify(updated));
    window.dispatchEvent(new Event("wb_bookmark_changed"));
    return !exists;
  } catch {
    return false;
  }
}
