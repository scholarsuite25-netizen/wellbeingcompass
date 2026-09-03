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

      {/* Line 2: Single premium header - solid navy bg, strong contrast, 2 lines max */}
      <div className="bg-[#0D2A4A] border-b border-white/10 shadow-lg">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center h-[58px] gap-4">
            {/* Premium lockup - white text on navy (15.8:1) */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Wellbeing Compass home">
              <span className="h-7 w-7 rounded-full bg-white text-[#0D2A4A] grid place-items-center shadow-sm">
                <Compass className="h-3.5 w-3.5 stroke-[1.75]" />
              </span>
              <span className="leading-none">
                <span className="block text-[14.5px] tracking-[-0.02em] whitespace-nowrap">
                  <span className="font-[300] text-white/90">Wellbeing</span>
                  <span className="font-extrabold text-white"> Compass</span>
                </span>
              </span>
            </Link>

            {/* Center nav - one word each, white on navy (15.8:1), no wrap */}
            <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5 ml-6 flex-1 justify-center">
              {primaryNav.map(i=>(
                <Link key={i.href} href={i.href} className="px-2.5 xl:px-3 py-1.5 rounded-full text-[13px] font-semibold tracking-wide text-white/95 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D2A4A] transition">
                  {i.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 ml-auto">
              <Link href="/search" aria-label="Search" className="h-8 w-8 grid place-items-center rounded-full bg-white text-[#0D2A4A] hover:text-[#0A223C] hover:bg-white/95 transition">
                <Search className="h-3.5 w-3.5" />
              </Link>
              <Link href="/newsletter" className="hidden md:inline-flex bg-accent-400 text-[#0D2A4A] font-extrabold px-4 py-1.5 rounded-full text-[13px] hover:bg-accent-500 transition">Subscribe</Link>
              {session ? (
                <button onClick={()=>signOut()} className="hidden lg:inline-flex items-center gap-1 text-[13px] font-medium text-white/85 hover:text-white transition">
                  <LogOut className="h-3.5 w-3.5"/>Out
                </button>
              ) : (
                <Link href="/login" className="hidden lg:inline-flex items-center gap-1 bg-white text-[#0D2A4A] px-3.5 py-1.5 rounded-full text-[13px] font-bold hover:bg-white/95 transition">
                  Sign in
                </Link>
              )}
              <button onClick={()=>setOpen(v=>!v)} aria-label="Toggle menu" aria-expanded={open} className="lg:hidden h-8 w-8 grid place-items-center rounded-full bg-white text-[#0D2A4A] hover:bg-white/95 transition">
                {open ? <X className="h-3.5 w-3.5"/> : <Menu className="h-3.5 w-3.5"/>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile dropdown - solid navy, consistent contrast */}
      {open && (
        <nav className="lg:hidden bg-[#0D2A4A] border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="grid grid-cols-4 gap-1.5">
              {primaryNav.map(i=>(
                <Link key={i.href} href={i.href} onClick={()=>setOpen(false)} className="px-2 py-2.5 rounded-xl bg-white text-[#0D2A4A] font-bold text-[13px] text-center hover:bg-accent-400 hover:text-[#0D2A4A] transition">
                  {i.label}
                </Link>
              ))}
            </div>
            <div className="mt-2.5 flex gap-1.5">
              <Link href="/help" onClick={()=>setOpen(false)} className="flex-1 py-2 rounded-full bg-accent-400 text-[#0D2A4A] font-bold text-sm text-center">Help</Link>
              <Link href="/newsletter" onClick={()=>setOpen(false)} className="flex-1 py-2 rounded-full bg-white text-[#0D2A4A] font-semibold text-sm text-center">Subscribe</Link>
              {!session && <Link href="/login" onClick={()=>setOpen(false)} className="flex-1 py-2 rounded-full bg-white/10 text-white text-sm text-center font-medium">Sign in</Link>}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
