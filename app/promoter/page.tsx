import { permanentRedirect } from "next/navigation";

// Legacy URL — superseded by the richer founder profile page (301 for SEO).
export default function PromoterPage() {
  permanentRedirect("/about-the-founder");
}