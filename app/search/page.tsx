"use client";
import { useState, useMemo, Suspense } from "react";
import { searchArticles, categories, EvidenceLevel } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, Filter, X, ShieldCheck, Sparkles } from "lucide-react";

const EVIDENCE_OPTIONS: ("All" | EvidenceLevel)[] = [
  "All",
  "Expert reviewed",
  "Evidence-informed",
  "General education",
  "Research summary",
];

function SearchInner() {
  const params = useSearchParams();
  const initial = params.get("q") || "";
  const [q, setQ] = useState(initial);
  const [cat, setCat] = useState("All");
  const [evidence, setEvidence] = useState<"All" | EvidenceLevel>("All");
  const [onlyReviewed, setOnlyReviewed] = useState(false);

  const filtered = useMemo(() => {
    let res = searchArticles(q);
    if (cat !== "All") res = res.filter((a) => a.category === cat);
    if (evidence !== "All") res = res.filter((a) => a.evidenceLevel === evidence);
    if (onlyReviewed) res = res.filter((a) => a.reviewStatus === "medically-reviewed");
    return res;
  }, [q, cat, evidence, onlyReviewed]);

  const hasActiveFilters = q || cat !== "All" || evidence !== "All" || onlyReviewed;

  function clearAll() {
    setQ("");
    setCat("All");
    setEvidence("All");
    setOnlyReviewed(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display font-bold text-3xl text-brand-700">Search & Explore Library</h1>
          <p className="text-muted mt-1 text-sm">
            Discover evidence-informed articles, clinical explainers, and wellbeing guidance.
          </p>
        </div>
        <span className="text-xs bg-brand-50 border border-brand-200 text-brand-700 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-500" /> Medically Verified Content
        </span>
      </div>

      {/* Main Search Input */}
      <div className="mt-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-3.5 h-4 w-4 text-muted pointer-events-none" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search topics (e.g. anxiety, sleep hygiene, boundaries, preventive care)..."
            className="w-full rounded-full border border-border pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-3 top-3 p-1 text-muted hover:text-ink"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-full border border-border px-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="All">All Health Areas</option>
          {categories.map((c) => (
            <option key={c.label} value={c.label}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Chips & Quick Suggestions */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted font-medium flex items-center gap-1">
          <Filter className="h-3 w-3" /> Quick filters:
        </span>
        {["anxiety", "sleep", "relationships", "burnout", "parenting", "screening"].map((s) => (
          <button
            key={s}
            onClick={() => setQ(s)}
            className={`px-3 py-1 rounded-full border transition ${
              q.toLowerCase() === s
                ? "bg-brand-500 text-white border-brand-500 font-semibold"
                : "bg-surface border-border hover:bg-brand-50 text-ink"
            }`}
          >
            #{s}
          </button>
        ))}

        <div className="h-4 w-px bg-border hidden sm:block mx-1" />

        <button
          onClick={() => setOnlyReviewed(!onlyReviewed)}
          className={`px-3 py-1 rounded-full border transition flex items-center gap-1 ${
            onlyReviewed
              ? "bg-emerald-600 text-white border-emerald-600 font-semibold"
              : "bg-surface border-border hover:bg-emerald-50 text-ink"
          }`}
        >
          <ShieldCheck className="h-3 w-3" /> Medically Reviewed Only
        </button>

        <select
          value={evidence}
          onChange={(e) => setEvidence(e.target.value as any)}
          className="px-2.5 py-1 rounded-full border border-border bg-surface text-xs"
        >
          {EVIDENCE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              Evidence: {opt}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-brand-600 hover:text-brand-800 font-medium underline ml-auto text-xs"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Results Header */}
      <div className="mt-6 flex items-center justify-between text-sm text-muted border-b border-border pb-2">
        <p role="status">
          Showing <b>{filtered.length}</b> result{filtered.length !== 1 ? "s" : ""}{" "}
          {q && <span>for “<span className="text-ink font-semibold">{q}</span>”</span>}
        </p>
        <span className="text-xs">Evidence-Informed Publishing</span>
      </div>

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="mt-8 bg-white border border-border rounded-3xl p-10 text-center shadow-card max-w-xl mx-auto">
          <div className="h-12 w-12 rounded-full bg-brand-50 text-brand-500 grid place-items-center mx-auto mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-brand-700">No articles match your criteria</h3>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            Try adjusting your search terms, clearing specific filters, or browsing by category above.
          </p>
          <button
            onClick={clearAll}
            className="mt-4 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition"
          >
            Reset filters & view all articles
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8">Loading search…</div>}>
      <SearchInner />
    </Suspense>
  );
}
