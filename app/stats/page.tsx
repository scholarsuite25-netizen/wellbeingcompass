"use client";
import { useEffect, useState } from "react";
import { Link as LinkIcon } from "lucide-react";

type Period = "week" | "month" | "year";
type Stat = { period: Period; total: number; articleReads: number; series: { label: string; count: number }[]; topPages: { path: string; count: number }[] };

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>("week");
  const [data, setData] = useState<Stat | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    setErr("");
    fetch(`/api/stats?period=${period}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => setErr("Could not load stats."));
  }, [period]);

  const max = Math.max(1, ...(data?.series.map(s => s.count) || [0]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display font-extrabold text-3xl text-brand-700">Site Analytics</h1>
      <p className="text-muted mt-1 text-sm">Visits and article reads over time (self-hosted, privacy-conscious).</p>

      <div className="mt-4 flex gap-2">
        {(["week","month","year"] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition ${period===p ? "bg-brand-700 text-white" : "bg-surface border border-border text-ink hover:bg-brand-50"}`}>{p}</button>
        ))}
      </div>

      {err && <p className="text-sm text-red-600 mt-4">{err}</p>}
      {!data && !err && <p className="text-muted mt-6">Loading…</p>}

      {data && (
        <>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-border p-5"><p className="text-xs text-muted uppercase tracking-widest">Total visits</p><p className="text-3xl font-extrabold text-brand-700 mt-1">{data.total}</p></div>
            <div className="rounded-2xl bg-white border border-border p-5"><p className="text-xs text-muted uppercase tracking-widest">Article reads</p><p className="text-3xl font-extrabold text-brand-700 mt-1">{data.articleReads}</p></div>
            <div className="rounded-2xl bg-white border border-border p-5"><p className="text-xs text-muted uppercase tracking-widest">Read rate</p><p className="text-3xl font-extrabold text-brand-700 mt-1">{data.total ? Math.round((data.articleReads/data.total)*100) : 0}%</p></div>
          </div>

          <div className="mt-6 bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-brand-700">Visits by {period}</h2>
            <div className="mt-4 flex items-end gap-1 h-40">
              {data.series.map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted">{s.count > 0 ? s.count : ""}</span>
                  <div className="w-full rounded-t bg-brand-500" style={{ height: `${(s.count/max)*120}px` }} title={`${s.label}: ${s.count}`} />
                  <span className="text-[9px] text-muted whitespace-nowrap">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-brand-700">Most viewed pages</h2>
            {data.topPages.length === 0 ? <p className="text-muted text-sm mt-2">No data yet.</p> : (
              <ul className="mt-3 divide-y divide-border text-sm">
                {data.topPages.map((p, i) => (
                  <li key={i} className="flex items-center justify-between py-2">
                    <span className="flex items-center gap-2 text-slate-700 truncate"><LinkIcon className="h-3.5 w-3.5 text-brand-500 shrink-0"/>{p.path}</span>
                    <span className="font-bold whitespace-nowrap">{p.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
