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
      {/* Emergency strip - high contrast amber on deep blue */}
      <div className="bg-[#061A33] text-white text-xs md:text-sm border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5">
            <span className="hidden sm:grid h-6 w-6 place-items-center rounded-full bg-accent-400 text-ink shrink-0">
              <ShieldAlert className="h-3.5 w-3.5" />
            </span>
            <span className="leading-tight">
              <span className="font-semibold text-white">Educational only</span>
              <span className="hidden sm:inline text-white/80"> — not emergency care. Need help now? </span>
              <Link href="/help" className="underline decoration-accent-400 decoration-2 underline-offset-2 font-bold text-accent-400 hover:text-white transition">Get help →</Link>
            </span>
          </span>
          <Link href="/help" className="hidden md:inline-flex bg-accent-400 text-[#0D2A4A] px-4 py-1.5 rounded-full font-extrabold text-xs hover:bg-accent-500 transition shadow-sm">Get help now</Link>
        </div>
      </div>

      {/* Logo row - white for brand trust - compact */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-[56px] gap-4">
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Wellbeing Compass home">
              <span className="h-8 w-8 rounded-lg bg-brand-700 text-white grid place-items-center shadow-sm ring-1 ring-brand-700/10">
                <Compass className="h-4 w-4" />
              </span>
              <span className="leading-none">
                <span className="block font-display font-extrabold text-[1.05rem] tracking-tight text-[#0D2A4A]">Wellbeing<span className="text-brand-500"> Compass</span></span>
                <span className="block text-[9px] tracking-[0.16em] uppercase text-[#384B5C] font-bold -mt-0.5">Understand • Prevent • Heal • Thrive</span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link href="/search" aria-label="Search" className="h-10 w-10 grid place-items-center rounded-full bg-surface border border-border text-ink hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition">
                <Search className="h-4 w-4" />
              </Link>
              <Link href="/newsletter" className="hidden md:inline-flex bg-accent-400 hover:bg-accent-500 text-ink font-extrabold px-5 py-2.5 rounded-full text-sm transition shadow-sm">Subscribe</Link>
              {session ? (
                <>
                  <span className="hidden lg:inline-flex text-xs font-bold bg-brand-700 text-white border border-brand-700 rounded-full px-3 py-1.5">{(session.user as any)?.role}</span>
                  <Link href="/admin" className="hidden lg:inline-flex bg-white text-brand-700 border-2 border-brand-700 px-3.5 py-1.5 rounded-full text-sm font-extrabold hover:bg-brand-50 transition">CMS</Link>
                  <button onClick={()=>signOut()} className="hidden lg:inline-flex items-center gap-1.5 text-sm font-bold bg-white text-red-700 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50 transition">
                    <LogOut className="h-3.5 w-3.5"/>Sign out
                  </button>
                </>
              ) : (
                <Link href="/login" className="hidden lg:inline-flex items-center gap-1.5 bg-brand-700 text-white px-4 py-2 rounded-full text-sm font-extrabold hover:bg-[#0A223C] transition shadow-sm">
                  <LogIn className="h-3.5 w-3.5"/>Sign in
                </Link>
              )}
              <button onClick={()=>setOpen(v=>!v)} aria-label="Toggle menu" aria-expanded={open} className="lg:hidden h-10 w-10 grid place-items-center rounded-full bg-brand-700 text-white hover:bg-[#0A223C] transition shadow-sm">
                {open ? <X className="h-4 w-4"/> : <Menu className="h-4 w-4"/>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary nav - deep navy for WCAG AAA contrast (white 15.8:1 on #0D2A4A) */}
      <nav aria-label="Primary" className="hidden lg:block bg-[#0D2A4A] border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-11">
            <div className="flex items-center gap-1">
              {primaryNav.map(i=>(
                <Link key={i.href} href={i.href} className="px-4 py-1.5 rounded-full text-sm font-extrabold tracking-wide text-white/95 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D2A4A] transition">
                  {i.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="hidden xl:inline-flex items-center gap-1.5 text-accent-400">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" aria-hidden />
                Trusted • Evidence-informed
              </span>
              <Link href="/help" className="hidden xl:inline-flex text-white/70 hover:text-white transition">Emergency →</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile nav - high contrast, one-word grid */}
      {open && (
        <nav className="lg:hidden bg-[#0D2A4A] border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="grid grid-cols-4 gap-2">
              {primaryNav.map(i=>(
                <Link key={i.href} href={i.href} onClick={()=>setOpen(false)} className="px-2 py-3 rounded-2xl bg-white text-[#0D2A4A] font-extrabold text-sm text-center hover:bg-accent-400 hover:text-ink transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400">
                  {i.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <Link href="/help" onClick={()=>setOpen(false)} className="px-3 py-2.5 rounded-xl bg-accent-400 text-ink font-extrabold text-center hover:bg-accent-500 transition">Help & Emergency</Link>
              <Link href="/about" onClick={()=>setOpen(false)} className="px-3 py-2.5 rounded-xl bg-white/10 text-white font-bold text-center border border-white/20 hover:bg-white/15 transition">About</Link>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 lg:hidden">
              {session ? (
                <>
                  <Link href="/admin" onClick={()=>setOpen(false)} className="flex-1 text-center bg-white text-[#0D2A4A] px-3 py-2 rounded-full font-extrabold">CMS</Link>
                  <button onClick={()=>{ setOpen(false); signOut(); }} className="flex-1 bg-red-500 text-white px-3 py-2 rounded-full font-bold">Sign out</button>
                </>
              ) : (
                <Link href="/login" onClick={()=>setOpen(false)} className="flex-1 text-center bg-white text-[#0D2A4A] px-3 py-2 rounded-full font-extrabold">Sign in</Link>
              )}
              <Link href="/newsletter" onClick={()=>setOpen(false)} className="flex-1 text-center bg-accent-400 text-ink px-3 py-2 rounded-full font-extrabold">Subscribe</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
