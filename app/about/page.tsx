export const metadata = { title: "About WellMind Health" };
export default function Page(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display font-extrabold text-3xl text-brand-700">About WellMind Health</h1>
      <p className="text-muted mt-2 leading-relaxed">WellMind Health is an education and awareness platform. We translate credible health knowledge into plain, compassionate language — covering mental health, general health, prevention, relationships, family, workplace, social and environmental wellbeing.</p>
      <div className="mt-6 bg-brand-50 border border-brand-100 rounded-2xl p-5">
        <p className="font-semibold">Our principles</p>
        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
          <li>Evidence-informed, not sensational</li>
          <li>Person-first, non-stigmatizing language</li>
          <li>Medical review for high-risk topics</li>
          <li>Clear authorship, references and dates</li>
          <li>Privacy-conscious and accessible</li>
        </ul>
      </div>
      <section className="prose-wellmind text-sm mt-6">
        <h2>What we are not</h2>
        <p>We do not diagnose, prescribe, or replace professional care. For personal medical decisions, speak with a qualified healthcare professional.</p>
      </section>
    </div>
  )
}
