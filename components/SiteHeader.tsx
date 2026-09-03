"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, Compass, ShieldAlert, LogOut, LogIn } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const primaryNav = [
  { href: "/mental-health", label: "Mental" },
  { href: "/general-health", label: "Health" },
  { href: "/prevention", label: "Prevent" },
  { href: "/relationships", label: "Relationships" },
  { href: "/family-parenting", label: "Family" },
  { href: "/workplace", label: "Workplace" },
  { href: "/environment", label: "Environment" },
  { href: "/training", label: "Training" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-40">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-accent-400 text-ink px-4 py-2 rounded-full font-bold z-50">Skip to main content</a>
      {/* Line 1: Emergency - thin, professional */}
      <div className="bg-[#061A33] text-white border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 h-7 flex items-center justify-between gap-3 text-[11px] leading-none">
          <span className="flex items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-accent-400 hidden sm:block" />
            <span className="font-medium text-white/90 hidden sm:inline">Educational only — not emergency care.</span>
            <span className="sm:hidden font-medium text-white/90">Educational only</span>
            <span className="hidden md:inline text-white/50">|</span>
            <Link href="/help" className="font-bold text-accent-400 hover:text-white underline decoration-accent-400/40 underline-offset-4 transition">Get help →</Link>
          </span>
          <Link href="/help" className="hidden sm:inline-flex bg-accent-400 text-[#0D2A4A] px-3 py-1 rounded-full font-extrabold text-[11px] hover:bg-accent-500 transition">Get help now</Link>
        </div>
      </div>

      {/* Line 2: Single premium header - logo + nav + actions (max 2 lines total) */}
      <div className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-border">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center h-[58px] gap-4">
            {/* Premium lockup - minimal, no dots, airy */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Wellbeing Compass home">
              <span className="h-7 w-7 rounded-full bg-[#0D2A4A] text-white grid place-items-center shadow-sm">
                <Compass className="h-3.5 w-3.5 stroke-[1.75]" />
              </span>
              <span className="leading-none">
                <span className="block text-[14.5px] tracking-[-0.02em] whitespace-nowrap">
                  <span className="font-[300] text-slate-700">Wellbeing</span>
                  <span className="font-extrabold text-[#0D2A4A]"> Compass</span>
                </span>
                {/* Tagline removed from header for premium minimalism - kept in footer/hero only */}
              </span>
            </Link>

            {/* Center nav - one word each, no wrap, professional */}
            <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5 ml-6 flex-1 justify-center">
              {primaryNav.map(i=>(
                <Link key={i.href} href={i.href} className="px-2.5 xl:px-3 py-1.5 rounded-full text-[13px] font-semibold tracking-wide text-slate-700 hover:text-[#0D2A4A] hover:bg-slate-900/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 transition">
                  {i.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 ml-auto">
              <Link href="/search" aria-label="Search" className="h-8 w-8 grid place-items-center rounded-full border border-border bg-white text-slate-600 hover:text-[#0D2A4A] hover:border-slate-300 hover:bg-slate-50 transition">
                <Search className="h-3.5 w-3.5" />
              </Link>
              <Link href="/newsletter" className="hidden md:inline-flex bg-[#0D2A4A] text-white font-semibold px-4 py-1.5 rounded-full text-[13px] hover:bg-[#0A223C] transition">Subscribe</Link>
              {session ? (
                <>
                  <span className="hidden xl:inline-flex text-[11px] font-bold bg-slate-900 text-white rounded-full px-2.5 py-1">{(session.user as any)?.role}</span>
                  <Link href="/admin" className="hidden lg:inline-flex text-[13px] font-semibold text-slate-700 hover:text-[#0D2A4A] px-2.5">CMS</Link>
                  <button onClick={()=>signOut()} className="hidden lg:inline-flex items-center gap-1 text-[13px] font-medium text-slate-500 hover:text-red-600 transition">
                    <LogOut className="h-3.5 w-3.5"/>Out
                  </button>
                </>
              ) : (
                <Link href="/login" className="hidden lg:inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full text-[13px] font-semibold hover:border-slate-300 hover:text-[#0D2A4A] transition">
                  Sign in
                </Link>
              )}
              <button onClick={()=>setOpen(v=>!v)} aria-label="Toggle menu" aria-expanded={open} className="lg:hidden h-8 w-8 grid place-items-center rounded-full bg-[#0D2A4A] text-white hover:bg-black transition">
                {open ? <X className="h-3.5 w-3.5"/> : <Menu className="h-3.5 w-3.5"/>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile dropdown - still within 2-line header, overlay */}
      {open && (
        <nav className="lg:hidden bg-white border-b border-border shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="grid grid-cols-4 gap-1.5">
              {primaryNav.map(i=>(
                <Link key={i.href} href={i.href} onClick={()=>setOpen(false)} className="px-2 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-[13px] text-center hover:bg-[#0D2A4A] transition">
                  {i.label}
                </Link>
              ))}
            </div>
            <div className="mt-2.5 flex gap-1.5">
              <Link href="/help" onClick={()=>setOpen(false)} className="flex-1 py-2 rounded-full bg-accent-400 text-ink font-bold text-sm text-center">Help</Link>
              <Link href="/newsletter" onClick={()=>setOpen(false)} className="flex-1 py-2 rounded-full bg-[#0D2A4A] text-white font-semibold text-sm text-center">Subscribe</Link>
              {session ? <Link href="/admin" onClick={()=>setOpen(false)} className="flex-1 py-2 rounded-full border border-border text-center font-medium text-sm">CMS</Link> : <Link href="/login" onClick={()=>setOpen(false)} className="flex-1 py-2 rounded-full border border-border text-center font-medium text-sm">Sign in</Link>}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
