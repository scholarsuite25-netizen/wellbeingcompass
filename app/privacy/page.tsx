export const metadata = { title: "Privacy Policy" };
export default function Page(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 prose-wellmind text-sm">
      <h1>Privacy Policy</h1>
      <p>We collect only what we need to operate Wellbeing Compass. We minimize personal data, do not sell reader data, and avoid tracking sensitive health searches.</p>
      <h2>What we store</h2><ul><li>Newsletter emails (with consent)</li><li>Contact messages</li><li>Aggregated, privacy-conscious analytics</li></ul>
      <h2>What we don&apos;t do</h2><ul><li>We do not store private health histories in URLs or analytics</li><li>We do not expose health queries in public profiles</li></ul>
      <p className="text-xs text-muted">Sample policy — replace with counsel-approved version before launch.</p>
    </div>
  )
}
