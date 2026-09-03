"use client";
import { useState } from "react";
import { Facebook, Twitter, Linkedin, Instagram, Link2, Check } from "lucide-react";
import { MessageCircle } from "lucide-react";

export function ShareButtons({ title, slug, className = "" }: { title: string; slug: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${base}/articles/${slug}`;
  const enc = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  const wa = `https://wa.me?text=${text}%20${enc}`;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <span className="text-sm font-semibold text-ink mr-1">Share:</span>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="h-9 w-9 grid place-items-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition">
        <Facebook className="h-4 w-4" />
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${enc}&text=${text}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="h-9 w-9 grid place-items-center rounded-full bg-black text-white hover:opacity-90 transition">
        <Twitter className="h-4 w-4" />
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="h-9 w-9 grid place-items-center rounded-full bg-[#0A66C2] text-white hover:opacity-90 transition">
        <Linkedin className="h-4 w-4" />
      </a>
      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="h-9 w-9 grid place-items-center rounded-full bg-[#25D366] text-white hover:opacity-90 transition">
        <MessageCircle className="h-4 w-4" />
      </a>
      <a href={`https://www.instagram.com/?url=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Instagram" className="h-9 w-9 grid place-items-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-90 transition">
        <Instagram className="h-4 w-4" />
      </a>
      <button onClick={copyLink} aria-label="Copy link" className="h-9 w-9 grid place-items-center rounded-full bg-surface border border-border text-ink hover:bg-brand-50 transition">
        {copied ? <Check className="h-4 w-4 text-emerald-600"/> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
