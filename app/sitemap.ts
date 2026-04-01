import type { MetadataRoute } from "next";
import { getArticles, getCategories } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Fetch semua data untuk sitemap
  const [articlesRes, categories] = await Promise.all([
    getArticles({ limit: 1000 }),
    getCategories(),
  ]);

  // Halaman statis
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Halaman kategori
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/kategori/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Halaman artikel
  const articlePages: MetadataRoute.Sitemap = articlesRes.data.map(
    (article) => ({
      url: `${siteUrl}/berita/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  );

  return [...staticPages, ...categoryPages, ...articlePages];
}
