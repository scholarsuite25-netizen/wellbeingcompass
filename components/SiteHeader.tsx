"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, Compass, ShieldAlert, LogOut, Phone, MessageCircle } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import { BookmarkDrawer } from "./BookmarkDrawer";

const primaryNav = [
  { href: "/mental-health", label: "Mind" },
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
            <a href="tel:+2348146620168" className="font-bold text-accent-400 hover:text-white underline decoration-accent-400/40 underline-offset-4 transition">Crisis hotline: +234 814 662 0168</a>
          </span>
          <a href="https://wa.me/2348146620168" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex bg-accent-400 text-[#0D2A4A] px-3 py-1 rounded-full font-extrabold text-[11px] hover:bg-accent-500 transition">Get help now</a>
        </div>
      </div>

      {/* Line 2: Single premium header - solid navy bg, strong contrast, 2 lines max */}
      <div className="bg-[#0D2A4A] border-b border-white/10 shadow-lg">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center h-[64px] gap-4">
            {/* Premium lockup - white text on navy (15.8:1), larger */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Wellbeing Compass home">
              <span className="h-9 w-9 rounded-full bg-white text-[#0D2A4A] grid place-items-center shadow-sm">
                <Compass className="h-4.5 w-4.5 stroke-[1.75]" />
              </span>
              <span className="leading-none">
                <span className="block text-[18px] tracking-[-0.02em] whitespace-nowrap">
                  <span className="font-[300] text-white/90">Wellbeing</span>
                  <span className="font-extrabold text-white"> Compass</span>
                </span>
              </span>
            </Link>

            {/* Center nav - one word each, white on navy (15.8:1), no wrap */}
            <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5 ml-4 flex-1 justify-center">
              {primaryNav.map(i=>(
                <Link key={i.href} href={i.href} className="px-3 xl:px-3.5 py-2 rounded-full text-[15px] font-semibold tracking-wide text-white/95 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D2A4A] transition">
                  {i.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 ml-auto">
              <a href="tel:+2348146620168" aria-label="Call" className="hidden md:inline-flex items-center gap-1.5 bg-white text-[#0D2A4A] px-3 py-2 rounded-full text-[13px] font-bold hover:bg-white/95 transition">
                <Phone className="h-3.5 w-3.5"/> Call
              </a>
              <a href="https://wa.me/2348146620168" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hidden md:inline-flex items-center gap-1.5 bg-[#25D366] text-white px-3 py-2 rounded-full text-[13px] font-bold hover:bg-[#1fbd5a] transition">
                <MessageCircle className="h-3.5 w-3.5"/> WhatsApp
              </a>
              <Link href="/search" aria-label="Search" className="h-8 w-8 grid place-items-center rounded-full bg-white text-[#0D2A4A] hover:text-[#0A223C] hover:bg-white/95 transition">
                <Search className="h-3.5 w-3.5" />
              </Link>
              <BookmarkDrawer />
              <ThemeToggle />
              <Link href="/newsletter" className="hidden lg:inline-flex bg-accent-400 text-[#0D2A4A] font-extrabold px-4 py-2 rounded-full text-sm hover:bg-accent-500 transition">Subscribe</Link>
              {session ? (
                <button onClick={()=>signOut()} className="hidden lg:inline-flex items-center gap-1 text-[13px] font-medium text-white/85 hover:text-white transition">
                  <LogOut className="h-3.5 w-3.5"/>Out
                </button>
              ) : (
                <Link href="/login" className="hidden lg:inline-flex items-center gap-1 bg-white text-[#0D2A4A] px-3.5 py-2 rounded-full text-[13px] font-bold hover:bg-white/95 transition">
                  Sign in
                </Link>
              )}
              <button onClick={()=>setOpen(v=>!v)} aria-label="Toggle menu" aria-expanded={open} className="lg:hidden h-9 w-9 grid place-items-center rounded-full bg-white text-[#0D2A4A] hover:bg-white/95 transition">
                {open ? <X className="h-4 w-4"/> : <Menu className="h-4 w-4"/>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile dropdown - solid navy, consistent contrast */}
      {open && (
        <nav className="lg:hidden bg-[#0D2A4A] border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              {primaryNav.map(i=>(
                <Link key={i.href} href={i.href} onClick={()=>setOpen(false)} className="px-3 py-3 rounded-2xl bg-white text-[#0D2A4A] font-bold text-base text-center hover:bg-accent-400 transition">
                  {i.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href="tel:+2348146620168" className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-accent-400 text-[#0D2A4A] font-bold text-sm">📞 Call</a>
              <a href="https://wa.me/2348146620168" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-sm">💬 WhatsApp</a>
              <Link href="/help" onClick={()=>setOpen(false)} className="flex items-center justify-center py-2.5 rounded-full bg-white/15 text-white font-semibold text-sm">Help & Crises</Link>
              <Link href="/newsletter" onClick={()=>setOpen(false)} className="flex items-center justify-center py-2.5 rounded-full bg-white text-[#0D2A4A] font-semibold text-sm">Subscribe</Link>
            </div>
            {!session && (
              <div className="mt-2">
                <Link href="/login" onClick={()=>setOpen(false)} className="flex justify-center py-2.5 rounded-full bg-white/10 border border-white/25 text-white font-semibold text-sm">Sign in</Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
