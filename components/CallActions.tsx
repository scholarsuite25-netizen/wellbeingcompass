"use client";
import { Phone, MessageCircle } from "lucide-react";
import { CONTACT_PHONE_TEL, CONTACT_WHATSAPP_URL, CONTACT_PHONE_DISPLAY } from "@/lib/contact";

export function CallActions({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? "" : ""}`}>
      <a
        href={CONTACT_PHONE_TEL}
        className="inline-flex items-center gap-2 rounded-full bg-brand-700 text-white px-4 py-2 text-sm font-bold hover:bg-[#0A223C] transition shadow-sm"
      >
        <Phone className="h-4 w-4" /> Call {CONTACT_PHONE_DISPLAY}
      </a>
      <a
        href={CONTACT_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-2 text-sm font-bold hover:bg-[#1fbd5a] transition shadow-sm"
      >
        <MessageCircle className="h-4 w-4" /> WhatsApp
      </a>
    </div>
  );
}
