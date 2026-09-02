import { AlertTriangle, ShieldCheck, Phone, Info } from "lucide-react";
import { Badge } from "./ui/Badge";

export function DisclaimerBox() {
  return (
    <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed" aria-label="Medical disclaimer">
      <p className="font-semibold flex items-center gap-2"><Info className="h-4 w-4"/> Educational information only</p>
      <p className="text-muted mt-1">Wellbeing Compass articles are for education and awareness. They do not provide clinical diagnosis, replace professional medical advice, or cover all risks. If you have symptoms, concerns, or an emergency, contact a qualified healthcare professional or your local emergency services.</p>
    </aside>
  )
}
export function HelpBox() {
  return (
    <aside className="rounded-2xl border border-red-200 bg-red-50 p-4" aria-label="When to seek help">
      <p className="font-semibold flex items-center gap-2 text-red-800"><Phone className="h-4 w-4"/> When to seek help</p>
      <ul className="list-disc pl-5 text-sm mt-2 space-y-1 text-red-900/80">
        <li>Symptoms are worsening, persistent, or interfering with daily life</li>
        <li>You feel unsafe, or are worried about someone else’s safety</li>
        <li>You need personal medical advice, diagnosis, or treatment</li>
      </ul>
      <p className="text-sm mt-2">If you need urgent help, go to your nearest emergency department or contact your local emergency number. If you can, reach a trusted person for support.</p>
    </aside>
  )
}
export function ReviewBadge({ reviewer, date }: { reviewer: string; date: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs">
      <ShieldCheck className="h-4 w-4 text-green-700"/><span className="font-semibold">Medically reviewed by {reviewer}</span><span className="text-muted">• Last reviewed {date}</span>
    </div>
  )
}
export function ContentWarning({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm flex gap-3"><AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5"/>{children}</div>;
}
