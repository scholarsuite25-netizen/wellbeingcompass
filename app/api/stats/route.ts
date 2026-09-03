import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate()+n); return x; }

export async function GET(req: NextRequest) {
  const period = (req.nextUrl.searchParams.get("period") || "week") as "week" | "month" | "year";
  const now = new Date();

  let start: Date;
  let buckets: string[];
  if (period === "week") {
    start = addDays(startOfDay(now), -6);
    buckets = [];
    for (let i = 0; i < 7; i++) buckets.push(addDays(start, i).toISOString().slice(0,10));
  } else if (period === "month") {
    start = addDays(startOfDay(now), -29);
    buckets = [];
    for (let i = 0; i < 30; i++) buckets.push(addDays(start, i).toISOString().slice(0,10));
  } else {
    start = new Date(now.getFullYear(), 0, 1);
    buckets = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  }

  const rows = await prisma.pageView.findMany({
    where: { createdAt: { gte: start } },
    select: { path: true, createdAt: true },
  });

  const byDay = new Map<string, number>();
  for (const r of rows) {
    const k = startOfDay(r.createdAt).toISOString().slice(0,10);
    byDay.set(k, (byDay.get(k) || 0) + 1);
  }

  let series: { label: string; count: number }[];
  if (period === "year") {
    const byMonth = new Map<string, number>();
    for (const r of rows) {
      const m = r.createdAt.toLocaleString("en-US", { month: "short" });
      byMonth.set(m, (byMonth.get(m) || 0) + 1);
    }
    series = buckets.map(l => ({ label: l, count: byMonth.get(l) || 0 }));
  } else {
    series = buckets.map(l => ({ label: l, count: byDay.get(l) || 0 }));
  }

  // Top pages
  const pageCounts = new Map<string, number>();
  for (const r of rows) {
    const path = r.path || "/";
    pageCounts.set(path, (pageCounts.get(path) || 0) + 1);
  }
  const topPages = [...pageCounts.entries()].map(([path, count]) => ({ path, count })).sort((a,b)=>b.count-a.count).slice(0,10);

  // Article reads: count /articles/* views
  let articleReads = 0;
  for (const r of rows) if (r.path.startsWith("/articles/")) articleReads++;
  const total = rows.length;

  return NextResponse.json({ period, total, articleReads, series, topPages });
}
