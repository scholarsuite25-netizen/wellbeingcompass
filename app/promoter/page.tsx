import { CallActions } from "@/components/CallActions";
import { CONTACT_WHATSAPP_URL } from "@/lib/contact";
import { Compass, Phone, MessageCircle, Mail, Globe } from "lucide-react";

export const metadata = { title: "About the Founder & Promoter" };

export default function PromoterPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="bg-gradient-to-br from-brand-700 to-[#0A223C] text-white rounded-3xl p-8 md:p-10">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-white/15 grid place-items-center text-5xl border-2 border-white/25 shrink-0">👤</div>
          <div className="text-center sm:text-left">
            <p className="text-accent-400 font-extrabold text-xs tracking-widest uppercase">Founder & Promoter</p>
            <h1 className="font-display font-extrabold text-3xl mt-1">Wellbeing Compass</h1>
            <p className="text-white/85 mt-2 text-sm max-w-xl">On a mission to make evidence-informed mental and general-health education accessible, compassionate and free — especially for African and Nigerian communities.</p>
          </div>
        </div>
        <div className="mt-6"><CallActions /></div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-brand-700 flex items-center gap-2"><Compass className="h-5 w-5 text-brand-500"/> Vision</h2>
          <p className="text-sm text-muted mt-2 leading-relaxed">A world where anyone, anywhere, can understand, prevent, heal and thrive — guided by trusted health information delivered in plain language.</p>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-brand-700 flex items-center gap-2"><Phone className="h-5 w-5 text-brand-500"/> Why it matters</h2>
          <p className="text-sm text-muted mt-2 leading-relaxed">Too many people struggle in silence with stress, anxiety and depression. We combine awareness, prevention and practical relief with a compassionate companion line — call or WhatsApp +234 814 662 0168.</p>
        </div>
      </div>

      <div className="mt-4 bg-white border border-border rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg text-brand-700 flex items-center gap-2"><Mail className="h-5 w-5 text-brand-500"/> Connect</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-500"/> Call: <a href="tel:+2348146620168" className="text-brand-700 font-semibold hover:underline">+234 814 662 0168</a></li>
          <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-green-600"/> WhatsApp: <a href={CONTACT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-brand-700 font-semibold hover:underline">Chat now</a></li>
          <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-500"/> Email: <a href="mailto:info@wellbeingcompass.org" className="text-brand-700 font-semibold hover:underline">info@wellbeingcompass.org</a></li>
          <li className="flex items-center gap-2"><Globe className="h-4 w-4 text-brand-500"/> Site: <a href="/" className="text-brand-700 font-semibold hover:underline">wellbeingcompass.org</a></li>
        </ul>
      </div>
    </div>
  );
}
