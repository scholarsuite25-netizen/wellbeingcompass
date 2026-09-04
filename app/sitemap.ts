import type { MetadataRoute } from "next";
import { articles, authors, reviewers, categories, courses } from "@/lib/content";
import { env } from "@/lib/env";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const now = new Date();
  const staticPaths = [
    "", "/mental-health","/general-health","/prevention","/relationships","/family-parenting","/workplace","/environment","/social","/training","/campaigns","/about","/help","/contact","/search","/authors","/reviewers","/privacy","/terms","/disclaimer","/editorial-policy","/medical-review","/newsletter","/about-the-founder",
  ];
  const articlePaths = articles.map(a=> `/articles/${a.slug}`);
  const authorPaths = authors.map(a=> `/authors/${a.slug}`);
  const reviewerPaths = reviewers.map(r=> `/reviewers/${r.slug}`);
  const coursePaths = courses.map(c=> `/training/${c.slug}`);
  const categoryPaths = categories.map(c=> `/${c.slug}`);
  return [...staticPaths, ...articlePaths, ...authorPaths, ...reviewerPaths, ...coursePaths, ...categoryPaths].map(p=>({ url: `${base}${p || "/"}`, lastModified: now }));
}
