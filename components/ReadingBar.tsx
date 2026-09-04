"use client";
import { useEffect, useState } from "react";
import { Share2, Type, Printer, Check, Copy, Bookmark } from "lucide-react";

interface ReadingBarProps {
  title: string;
  readingTime: number;
  onFontSizeChange?: (size: "normal" | "large" | "xl") => void;
}

export function ReadingBar({ title, readingTime, onFontSizeChange }: ReadingBarProps) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xl">("normal");

  useEffect(() => {
    function handleScroll() {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function cycleFontSize() {
    const nextSize = fontSize === "normal" ? "large" : fontSize === "large" ? "xl" : "normal";
    setFontSize(nextSize);
    onFontSizeChange?.(nextSize);
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
        return;
      } catch {
        // Fallback to copy
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-border transition-all">
      {/* Scroll Progress Indicator */}
      <div
        className="h-1 bg-gradient-to-r from-brand-500 via-brand-400 to-accent-400 transition-all duration-150"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between text-xs md:text-sm">
        <div className="flex items-center gap-2 truncate pr-4 text-muted">
          <span className="font-semibold text-brand-700 hidden sm:inline">{title}</span>
          <span className="hidden sm:inline">•</span>
          <span>{readingTime} min read</span>
          <span>•</span>
          <span>{Math.round(progress)}% read</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={cycleFontSize}
            title={`Font size: ${fontSize}. Click to toggle.`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border hover:bg-brand-50 text-ink text-xs font-medium transition"
          >
            <Type className="h-3.5 w-3.5 text-brand-600" />
            <span className="uppercase">{fontSize === "normal" ? "A" : fontSize === "large" ? "A+" : "A++"}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border hover:bg-brand-50 text-ink text-xs font-medium transition"
            title="Share or copy article link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Share2 className="h-3.5 w-3.5 text-brand-600" />}
            <span className="hidden md:inline">{copied ? "Copied!" : "Share"}</span>
          </button>

          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border border-border hover:bg-brand-50 text-xs font-medium transition ${
              saved ? "bg-accent-50 text-accent-600 border-accent-300" : "text-ink"
            }`}
            title="Bookmark article"
          >
            <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-current text-accent-600" : "text-brand-600"}`} />
            <span className="hidden md:inline">{saved ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={() => typeof window !== "undefined" && window.print()}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full border border-border hover:bg-brand-50 text-ink text-xs font-medium transition"
            title="Print or save as PDF"
          >
            <Printer className="h-3.5 w-3.5 text-muted" />
          </button>
        </div>
      </div>
    </div>
  );
}
