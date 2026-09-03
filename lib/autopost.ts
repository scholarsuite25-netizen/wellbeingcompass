import { env } from "./env";

// Auto-post new articles to social media. Each platform requires an API token
// configured via env (see .env.example). Returns a per-platform result map.
// No-op (failed) gracefully when tokens are absent so the site never breaks.

type Post = { text: string; url: string; image?: string };

export async function autopost(p: Post): Promise<Record<string, "ok" | "skipped" | "error">> {
  const result: Record<string, "ok" | "skipped" | "error"> = {};
  const mode = env.SOCIAL_AUTOPOST || "none";
  const platforms = ["facebook", "x", "instagram", "linkedin"];
  const active = mode === "all" ? platforms : mode !== "none" ? [mode] : [];

  // --- Facebook / Instagram (Meta Graph API) ---
  if (active.includes("facebook") || active.includes("instagram")) {
    const fbToken = env.FACEBOOK_PAGE_TOKEN;
    if (!fbToken) {
      result.facebook = "skipped"; result.instagram = "skipped";
    } else {
      try {
        const url = `https://graph.facebook.com/v19.0/me/feed?access_token=${fbToken}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: `${p.text}\n\n${p.url}` }),
        });
        result.facebook = res.ok ? "ok" : "error";
      } catch { result.facebook = "error"; }
    }
  }

  // --- X / Twitter ---
  if (active.includes("x")) {
    if (!env.TWITTER_BEARER_TOKEN) {
      result.x = "skipped";
    } else {
      try {
        const res = await fetch("https://api.twitter.com/2/tweets", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.TWITTER_BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: `${p.text}\n\n${p.url}` }),
        });
        result.x = res.ok ? "ok" : "error";
      } catch { result.x = "error"; }
    }
  }

  // --- LinkedIn ---
  if (active.includes("linkedin")) {
    if (!env.LINKEDIN_ACCESS_TOKEN) {
      result.linkedin = "skipped";
    } else {
      try {
        const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ author: "urn:li:person:current", lifecycleState: "PUBLISHED", specificContent: { "com.linkedin.ugc.ShareContent": { shareCommentary: { text: `${p.text}\n\n${p.url}` } }, shareMediaCategory: "NONE" } }),
        });
        result.linkedin = res.ok ? "ok" : "error";
      } catch { result.linkedin = "error"; }
    }
  }

  return result;
};
