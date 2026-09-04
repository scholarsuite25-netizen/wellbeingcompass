import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Badge } from "@/components/ui/Badge";
import { DisclaimerBox } from "@/components/SafetyComponents";
import { FOUNDER, FOUNDER_PHILOSOPHY } from "@/lib/founders";
import { articles } from "@/lib/content";
import type { Metadata } from "next";
import {
  Award, GraduationCap, HeartPulse, Users, Microscope, ShieldCheck,
  Activity, Landmark, ScrollText, Sparkles, ArrowRight, BookOpen, Medal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Christianah Mojirade Adeola Oyinloye, RN, RM, PhD | Founder & Health Professional",
  description:
    "Meet Christianah Oyinloye, RN, RM, PhD — nursing leader, healthcare educator, mental health and public health advocate, and the professional voice behind Wellbeing Compass.",
  openGraph: {
    title: "Christianah Mojirade Adeola Oyinloye, RN, RM, PhD",
    description:
      "Nurse Leader • Mental Health Advocate • Public Health Professional • Healthcare Educator • Researcher. Founder and professional health voice behind Wellbeing Compass.",
    type: "profile",
    images: [{ url: FOUNDER.profilePhoto || "" }],
  },
};

const name = FOUNDER.name;
const creds = FOUNDER.credentials;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: `${name}, ${creds}`,
  alternateName: "Christianah Oyinloye",
  jobTitle: ["Nurse Leader", "Healthcare Educator", "Mental Health Advocate", "Public Health Professional", "Researcher"],
  workLocation: { "@type": "Place", name: FOUNDER.currentPosition },
  worksFor: { "@type": "Organization", name: "Babcock University Teaching Hospital" },
  alumniOf: [FOUNDER.education?.map((e) => e.place).filter(Boolean) || []],
  knowsAbout: FOUNDER.expertise?.map((e) => e.title) || [],
  image: FOUNDER.profilePhoto,
  url: "https://wellbeingcompass-hazel.vercel.app/about-the-founder",
};

export default function FounderProfilePage() {
  const herArticles = articles.filter((a) => a.author.slug === FOUNDER.slug);
  const byline = `${name}, ${creds}`;
  const bioParagraphs = (FOUNDER.fullBio || "").split("\n\n").filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="text-sm text-muted">
              <Link href="/" className="hover:text-brand-600">Home</Link> <span aria-hidden>›</span>
              <span className="text-ink font-medium">Meet the Founder</span>
            </nav>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="accent">{creds}</Badge>
              <Badge variant="default">Founder & Health Professional</Badge>
              <Badge variant="success">PhD in Nursing</Badge>
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl leading-tight text-brand-700 mt-4">
              {name},<br />{creds}
            </h1>
            <p className="text-lg text-brand-600 font-semibold mt-3">
              Nurse Leader • Mental Health Advocate • Public Health Professional • Healthcare Educator • Researcher
            </p>
            <p className="text-muted mt-4 text-base leading-relaxed max-w-2xl">{FOUNDER.shortBio}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="#read-her-articles" className="inline-flex items-center gap-2 bg-brand-700 hover:bg-[#0A223C] text-white font-semibold px-5 py-2.5 rounded-full transition">
                Read Her Articles <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#credentials" className="inline-flex items-center gap-2 bg-white border border-border text-brand-700 hover:bg-brand-50 font-semibold px-5 py-2.5 rounded-full transition">
                View Credentials
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-border shadow-elevated bg-white">
              <img
                src={FOUNDER.profilePhoto}
                alt={`Official portrait of ${name}, ${creds}`}
                width={880}
                height={1000}
                className="w-full h-auto object-cover object-top aspect-[4/5]"
              />
            </div>
            <p className="text-xs text-muted mt-2 text-center">{byline}</p>
            {FOUNDER.currentPosition && (
              <p className="text-xs text-muted mt-1 text-center">{FOUNDER.professionalTitle} • {FOUNDER.currentPosition}</p>
            )}
          </div>
        </section>

        {/* ── FULL BIO + PHILOSOPHY ─────────────────────────── */}
        <section className="mt-12 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white border border-border rounded-3xl p-6 md:p-8">
              <h2 className="font-display font-bold text-2xl text-brand-700">The Professional Voice Behind This Platform</h2>
              <div className="prose-wellmind mt-4 space-y-4 text-justify hyphens-auto">
                {bioParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-brand-700 to-[#0A223C] text-white rounded-3xl p-7 md:p-8 sticky top-24">
              <p className="text-accent-400 font-extrabold text-xs tracking-widest uppercase">Guiding Philosophy</p>
              <div className="mt-4 space-y-2">
                {FOUNDER_PHILOSOPHY.map((w) => (
                  <p key={w} className="font-display font-extrabold text-3xl md:text-4xl leading-none">{w}</p>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/15">
                <p className="text-sm text-white/85 leading-relaxed">
                  Credible, practical and accessible health education that helps you understand health, recognise concerns early, make responsible choices and seek appropriate professional care when necessary.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CREDENTIALS ───────────────────────────────────── */}
        <section id="credentials" className="mt-12">
          <h2 className="font-display font-bold text-2xl text-brand-700 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-accent-500" /> Professional Credentials
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            <div className="bg-brand-700 text-white rounded-2xl p-5">
              <p className="font-display font-bold text-lg">PhD in Nursing</p>
              <p className="text-accent-300 text-sm mt-1">Babcock University</p>
              <p className="text-[11px] text-white/70 mt-2 uppercase tracking-widest">Highest academic qualification</p>
            </div>
            <div className="bg-accent-400 text-[#17212B] rounded-2xl p-5">
              <p className="font-display font-bold text-lg">Fellow</p>
              <p className="text-sm mt-1 font-semibold">African Institute of Public Health Professionals</p>
            </div>
            <div className="bg-accent-400 text-[#17212B] rounded-2xl p-5">
              <p className="font-display font-bold text-lg">Fellow</p>
              <p className="text-sm mt-1 font-semibold">Academy of Oncology Nursing</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {(FOUNDER.education || []).map((e) => (
              <div key={e.title} className="bg-white border border-border rounded-2xl p-4">
                <p className="font-semibold text-sm text-brand-700">{e.title}</p>
                {e.place && <p className="text-xs text-muted mt-1">{e.place}</p>}
              </div>
            ))}
            {(FOUNDER.fellowships || []).filter((f) => !f.includes("African") && !f.includes("Oncology")).map((f) => (
              <div key={f} className="bg-white border border-border rounded-2xl p-4">
                <p className="font-semibold text-sm text-brand-700">{f}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-3">Dates of qualification are presented only where documented.</p>
        </section>

        {/* ── EXPERTISE ─────────────────────────────────────── */}
        <section className="mt-12">
          <h2 className="font-display font-bold text-2xl text-brand-700 flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-accent-500" /> Areas of Professional Expertise
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
            {(FOUNDER.expertise || []).map((e, i) => (
              <div key={e.title} className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3">
                <span className="grid place-items-center h-9 w-9 rounded-lg bg-brand-700 text-white shrink-0">
                  {i % 7 === 0 ? <ShieldCheck className="h-4 w-4" /> : i % 7 === 1 ? <Users className="h-4 w-4" /> : i % 7 === 2 ? <Activity className="h-4 w-4" /> : i % 7 === 3 ? <Landmark className="h-4 w-4" /> : i % 7 === 4 ? <ScrollText className="h-4 w-4" /> : i % 7 === 5 ? <Microscope className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </span>
                <p className="font-medium text-sm text-brand-700 leading-snug">{e.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── LEADERSHIP & RECOGNITION ──────────────────────── */}
        <section className="mt-12">
          <h2 className="font-display font-bold text-2xl text-brand-700 flex items-center gap-2">
            <Medal className="h-6 w-6 text-accent-500" /> Leadership & Professional Recognition
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {(FOUNDER.awards || []).map((a) => (
              <div key={a} className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3">
                <Award className="h-5 w-5 text-accent-500 shrink-0" />
                <p className="font-medium text-sm text-brand-700">{a}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-3">Recognition is presented as documented on the professional record, without embellishment.</p>
        </section>

        {/* ── RESEARCH ──────────────────────────────────────── */}
        <section className="mt-12">
          <h2 className="font-display font-bold text-2xl text-brand-700 flex items-center gap-2">
            <Microscope className="h-6 w-6 text-accent-500" /> Research & Areas of Academic Interest
          </h2>
          <div className="flex flex-wrap gap-2 mt-5">
            {(FOUNDER.researchInterests || []).map((r) => (
              <span key={r} className="text-sm bg-surface border border-border px-3 py-1.5 rounded-full">{r}</span>
            ))}
          </div>
          <p className="text-xs text-muted mt-4">Research and teaching interests are grounded in her academic and clinical record.</p>
        </section>

        {/* ── READ HER ARTICLES ─────────────────────────────── */}
        <section id="read-her-articles" className="mt-12">
          <h2 className="font-display font-bold text-2xl text-brand-700 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-accent-500" /> Read Her Articles
          </h2>
          <p className="text-muted mt-1 text-sm max-w-2xl">Evidence-informed health education focused on mental wellbeing, preventive care, healthy relationships, family and social wellbeing, adolescent health and everyday factors that influence health.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
            {herArticles.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </section>

        {/* ── DISCLAIMER ────────────────────────────────────── */}
        <section className="mt-10">
          <DisclaimerBox />
        </section>
      </div>
    </>
  );
}
