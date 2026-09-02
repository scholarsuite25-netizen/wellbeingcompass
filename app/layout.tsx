import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Providers } from "@/components/Providers";
import { Analytics } from "@/components/Analytics";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: { default: "WellMind Health — Understand. Prevent. Heal. Thrive.", template: "%s — WellMind Health" },
  description: "Trusted education on mental health, general health, prevention, relationships, family, workplace and environmental wellbeing. Evidence-informed, compassionate, accessible.",
  openGraph: {
    type: "website",
    siteName: "WellMind Health",
    title: "WellMind Health — Understand. Prevent. Heal. Thrive.",
    description: "Trusted health education that is evidence-informed and human.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet"/>
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <Analytics />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context":"https://schema.org",
            "@type":"Organization",
            name: env.NEXT_PUBLIC_SITE_NAME,
            slogan:"Understand. Prevent. Heal. Thrive.",
            url: env.NEXT_PUBLIC_SITE_URL,
            logo: `${env.NEXT_PUBLIC_SITE_URL}/logo.png`
          })}} />
          <SiteHeader />
          <main id="main-content" className="min-h-[60vh]">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
