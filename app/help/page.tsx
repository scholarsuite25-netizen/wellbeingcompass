export const metadata = { title: "Help & Emergency Information" };
export default function Page(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display font-extrabold text-3xl text-brand-700">Help & Emergency Information</h1>
      <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-5">
        <p className="font-semibold text-red-800">If you need urgent help</p>
        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
          <li>Contact your local emergency number (for example, 112, 911, 999 or 767 where available) or go to your nearest emergency department.</li>
          <li>Reach a trusted person — family, friend, teacher, colleague or community leader — and stay with someone you trust.</li>
          <li>If you are worried about someone else, encourage them to seek professional help and stay with them where safe.</li>
        </ul>
        <p className="text-xs text-muted mt-2">WellMind Health does not provide emergency services, diagnosis, or real-time crisis support.</p>
      </div>
      <section className="mt-6 prose-wellmind text-sm">
        <h2>Support options</h2>
        <ul>
          <li>Primary-care clinic or family doctor</li>
          <li>Local hospital or urgent-care facility</li>
          <li>School or workplace counselling resources</li>
          <li>Trusted community or faith-based support networks</li>
          <li>National or local helplines listed by government health agencies</li>
        </ul>
        <h2>What to do while waiting for help</h2>
        <p>Stay in a safe location, avoid being alone if possible, and let a trusted person know how you feel. If you can, write down what you are experiencing to share with a professional.</p>
        <p className="text-xs text-muted">Page is educational and does not replace professional triage.</p>
      </section>
    </div>
  )
}
