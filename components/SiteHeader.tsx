"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, HeartPulse, ShieldAlert, LogOut, LogIn } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/Button";

const primaryNav = [
  { href: "/mental-health", label: "Mental Health" },
  { href: "/general-health", label: "General Health" },
  { href: "/prevention", label: "Prevention" },
  { href: "/relationships", label: "Relationships" },
  { href: "/family-parenting", label: "Family & Parenting" },
  { href: "/workplace", label: "Workplace" },
  { href: "/environment", label: "Environment" },
  { href: "/training", label: "Training" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-brand-700 text-white px-3 py-1 rounded">Skip to main content</a>
      {/* Emergency strip */}
      <div className="bg-brand-700 text-white text-xs md:text-sm">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-accent-400" /> This is educational information, not emergency care. If you need urgent help, visit our <Link href="/help" className="underline decoration-accent-400 underline-offset-2 font-semibold">Help & Emergency page</Link>.</span>
          <Link href="/help" className="hidden md:inline-flex bg-accent-400 text-ink px-3 py-1 rounded-full font-semibold text-xs">Get help now</Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="WellMind Health home">
            <span className="h-9 w-9 rounded-xl bg-brand-500 text-white grid place-items-center"><HeartPulse className="h-5 w-5" /></span>
            <span className="leading-none">
              <span className="block font-display font-extrabold text-[1.35rem] tracking-tight text-brand-700">WellMind<span className="text-brand-500"> Health</span></span>
              <span className="block text-[10px] tracking-[0.18em] uppercase text-muted font-semibold -mt-0.5">Understand • Prevent • Heal • Thrive</span>
            </span>
          </Link>
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {primaryNav.map(i=>(
              <Link key={i.href} href={i.href} className="px-2.5 py-1.5 rounded-full hover:bg-brand-50 text-ink/80 hover:text-brand-700 transition">{i.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/search" aria-label="Search" className="h-9 w-9 grid place-items-center rounded-full border border-border hover:bg-brand-50"><Search className="h-4 w-4" /></Link>
            <Link href="/newsletter" className="hidden md:inline-flex bg-accent-400 hover:bg-accent-500 text-ink font-semibold px-4 py-2 rounded-full text-sm transition">Subscribe</Link>
            {session ? (
              <>
                <span className="hidden md:inline text-xs bg-brand-50 border border-brand-200 rounded-full px-2 py-1">{(session.user as any)?.role}</span>
                <Link href="/admin" className="hidden md:inline-flex border border-border px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-50">CMS</Link>
                <button onClick={()=>signOut()} className="hidden md:inline-flex items-center gap-1 text-xs border border-border px-2 py-1.5 rounded-full hover:bg-red-50"><LogOut className="h-3 w-3"/>Sign out</button>
              </>
            ) : (
              <Link href="/login" className="hidden md:inline-flex items-center gap-1 bg-brand-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-brand-600"><LogIn className="h-3 w-3"/>Sign in</Link>
            )}
            <button onClick={()=>setOpen(v=>!v)} aria-label="Toggle menu" aria-expanded={open} className="lg:hidden h-9 w-9 grid place-items-center rounded-full border border-border">
              {open ? <X className="h-4 w-4"/> : <Menu className="h-4 w-4"/>}
            </button>
          </div>
        </div>
        {open && (
          <nav className="lg:hidden pb-4 grid grid-cols-2 gap-1 text-sm border-t border-border pt-3">
            {primaryNav.map(i=>(<Link key={i.href} href={i.href} onClick={()=>setOpen(false)} className="px-3 py-2 rounded-xl bg-surface border border-border hover:bg-brand-50">{i.label}</Link>))}
            <Link href="/help" onClick={()=>setOpen(false)} className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-800">Help & Emergency</Link>
            <Link href="/about" onClick={()=>setOpen(false)} className="px-3 py-2 rounded-xl bg-surface border">About</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
