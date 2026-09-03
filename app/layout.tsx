import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Providers } from "@/components/Providers";
import { Analytics } from "@/components/Analytics";
import { PwaRegister } from "@/components/PwaRegister";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: { default: "Wellbeing Compass — Understand. Prevent. Heal. Thrive.", template: "%s — Wellbeing Compass" },
  description: "Your trusted guide to mental health, general health, prevention, relationships, family, workplace and environmental wellbeing. Evidence-informed, compassionate, accessible.",
  openGraph: {
    type: "website",
    siteName: "Wellbeing Compass",
    title: "Wellbeing Compass — Understand. Prevent. Heal. Thrive.",
    description: "Your trusted health and wellbeing guide — evidence-informed, human, and accessible.",
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
        <link rel="manifest" href="/manifest.webmanifest"/>
        <meta name="theme-color" content="#0D2A4A"/>
        <link rel="icon" href="/icons/icon-192.png"/>
        <link rel="apple-touch-icon" href="/icons/icon-192.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-title" content="Wellbeing"/>
        <meta name="mobile-web-app-capable" content="yes"/>
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
          <PwaRegister />
        </Providers>
      </body>
    </html>
  );
}
