import { env } from "@/lib/env";

// Privacy-conscious analytics — only injected when env enables
// Plausible (recommended) or GA, else nothing. Respects DNT via provider config.

export function Analytics() {
  const provider = env.ANALYTICS_PROVIDER;
  const domain = env.ANALYTICS_DOMAIN || env.NEXT_PUBLIC_ANALYTICS_DOMAIN;

  if (provider === "plausible" && domain) {
    // Plausible cloud — lightweight, no cookies
    return (
      <script
        defer
        data-domain={domain}
        src="https://plausible.io/js/script.js"
      />
    );
  }
  if (provider === "ga" && domain) {
    // domain holds GA measurement ID e.g. G-XXXX
    return (
      <>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${domain}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${domain}',{anonymize_ip:true});`,
          }}
        />
      </>
    );
  }
  return null;
}
