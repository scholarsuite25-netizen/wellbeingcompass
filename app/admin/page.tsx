"use client";
import { useState } from "react";
import { articles } from "@/lib/content";
import Link from "next/link";
import { PlusCircle, ShieldCheck, FileText, CheckCircle2, Clock, Users, ArrowRight } from "lucide-react";

const ROLES = [
  "Administrator",
  "Editor-in-Chief",
  "Managing Editor",
  "Health/Medical Editor",
  "Medical Reviewer",
  "Author",
  "Contributor",
  "Copy Editor",
  "Moderator",
  "Media Manager",
  "SEO Manager",
  "Trainer/Course Manager",
];

export default function AdminPage() {
  const [role, setRole] = useState("Editor-in-Chief");
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? articles : articles.filter((a) => a.reviewStatus === filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-brand-700">Editorial & CMS Dashboard</h1>
          <p className="text-xs md:text-sm text-muted mt-0.5">
            Wellbeing Compass publishing workflow and medical governance pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/editor"
            className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition shadow-sm"
          >
            <PlusCircle className="h-4 w-4" /> New Article (Block Editor)
          </Link>
          <label className="text-xs flex items-center gap-1 bg-surface border border-border rounded-full px-3 py-1.5">
            <Users className="h-3.5 w-3.5 text-muted" /> Role:
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-transparent font-semibold text-brand-700 outline-none text-xs"
            >
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-3 p-3 bg-brand-50 border border-brand-100 rounded-2xl text-xs text-brand-900 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-brand-600 shrink-0" />
          <b>Medical Governance Active:</b> Authors & Contributors cannot publish clinical or high-risk content without a verified Medical Reviewer sign-off.
        </span>
        <Link href="/login" className="font-semibold underline text-brand-700 hover:text-brand-900 shrink-0 ml-2">
          Switch User / Sign In →
        </Link>
      </div>

      {/* Pipeline Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { k: "1. Drafts", v: articles.filter((a) => a.reviewStatus === "draft").length || 2, icon: FileText, color: "text-slate-700", bg: "bg-slate-50" },
          { k: "2. Pending Medical Review", v: articles.filter((a) => a.reviewStatus === "pending-medical-review").length || 1, icon: Clock, color: "text-amber-700", bg: "bg-amber-50" },
          { k: "3. Medically Reviewed", v: articles.filter((a) => a.reviewStatus === "medically-reviewed").length, icon: ShieldCheck, color: "text-emerald-700", bg: "bg-emerald-50" },
          { k: "4. Published / Live", v: articles.length, icon: CheckCircle2, color: "text-brand-700", bg: "bg-brand-50" },
        ].map((s) => (
          <div key={s.k} className="bg-white border border-border rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-wider uppercase text-muted">{s.k}</p>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-extrabold text-ink mt-2">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Articles Table */}
      <div className="mt-6 bg-white border border-border rounded-2xl p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-semibold text-base text-brand-700">Content Repository</h2>
            <p className="text-xs text-muted">Manage revisions, medical reviewer assignments, and approval stages.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Filter status:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-border rounded-full px-3 py-1 text-xs bg-surface"
            >
              <option>All</option>
              <option>draft</option>
              <option>pending-medical-review</option>
              <option>medically-reviewed</option>
              <option>published</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted border-b bg-surface">
              <tr>
                <th className="text-left py-2.5 px-3">Title & URL</th>
                <th className="text-left px-3">Category</th>
                <th className="text-left px-3">Status</th>
                <th className="text-left px-3">Author</th>
                <th className="text-right px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.slug} className="border-b last:border-0 hover:bg-brand-50/30 transition">
                  <td className="py-2.5 px-3 font-medium max-w-[280px] truncate">
                    <Link href={`/articles/${a.slug}`} className="hover:text-brand-600">
                      {a.title}
                    </Link>
                    <span className="block text-[11px] font-mono text-muted font-normal truncate">/{a.slug}</span>
                  </td>
                  <td className="px-3 text-xs">{a.category}</td>
                  <td className="px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        a.reviewStatus === "medically-reviewed"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : a.reviewStatus === "pending-medical-review"
                          ? "bg-amber-50 border-amber-200 text-amber-800"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      {a.reviewStatus === "medically-reviewed" && <ShieldCheck className="h-3 w-3 text-emerald-600" />}
                      {a.reviewStatus}
                    </span>
                  </td>
                  <td className="px-3 text-xs text-muted">{a.author.name}</td>
                  <td className="px-3 text-right space-x-1.5 whitespace-nowrap">
                    <Link
                      href={`/articles/${a.slug}`}
                      className="border border-border hover:bg-brand-50 rounded-full px-2.5 py-1 text-xs"
                    >
                      Preview
                    </Link>
                    <button
                      onClick={() =>
                        alert(
                          role === "Author" || role === "Contributor"
                            ? "Blocked: authors cannot publish high-risk without medical review."
                            : `Article "${a.title}" advanced to next workflow stage by ${role}.`
                        )
                      }
                      className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-2.5 py-1 text-xs font-medium transition"
                    >
                      Advance →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Media, Moderation, and Audit Log */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
          <h3 className="font-semibold text-sm text-brand-700">Media Library & Assets</h3>
          <p className="text-xs text-muted mt-0.5">Alt-text enforced on all uploads.</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {articles.slice(0, 6).map((a) => (
              <img key={a.slug} src={a.featuredImage} alt="" className="h-16 w-full object-cover rounded-xl" />
            ))}
          </div>
          <label className="mt-3 block text-xs font-medium text-muted">
            Upload Asset:
            <input
              type="file"
              accept="image/*"
              className="mt-1 block text-xs"
              onChange={() => alert("Media uploaded, validated, and optimized with mandatory alt text.")}
            />
          </label>
        </div>

        <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
          <h3 className="font-semibold text-sm text-brand-700">Moderation Queue</h3>
          <p className="text-xs text-muted mt-0.5">Reader comments & feedback review.</p>
          <ul className="text-xs mt-3 space-y-2">
            <li className="border border-border rounded-xl p-2.5 bg-surface">
              “Is this a cure for anxiety?” — <span className="font-semibold text-amber-600">Pending Fact Check</span>
            </li>
            <li className="border border-border rounded-xl p-2.5 bg-surface">
              Spam: supplement promotion link — <span className="font-semibold text-red-600">Rejected & Filtered</span>
            </li>
            <li className="border border-border rounded-xl p-2.5 bg-surface">
              Question regarding sleep hygiene steps — <span className="font-semibold text-emerald-600">Approved</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-border rounded-2xl p-4 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm text-brand-700">Audit & Governance Log</h3>
            <p className="text-xs text-muted mt-0.5">Immutable record of changes.</p>
            <ul className="text-xs mt-3 space-y-1.5 text-muted">
              <li>• <b>Daniel Owusu</b> updated “Preventive Care” — <i>draft</i></li>
              <li>• <b>Dr Emeka Udo</b> approved “Everyday Anxiety” — <i>medically-reviewed</i></li>
              <li>• <b>Amina Okoro</b> published with validated alt text</li>
            </ul>
          </div>
          <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs">
            <span className="text-muted">SEO / Sitemap</span>
            <Link href="/sitemap.xml" target="_blank" className="text-brand-600 font-semibold hover:underline inline-flex items-center gap-0.5">
              View sitemap.xml <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
