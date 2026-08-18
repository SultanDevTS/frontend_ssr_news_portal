import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategoryBySlug, getArticles } from "@/lib/api";
import type { Article } from "@/lib/api";
import ArticleCard from "@/components/article/ArticleCard";
import CategoryHeader from "@/components/category/CategoryHeader";
import FilterBar from "@/components/category/FilterBar.client";
import Pagination from "@/components/category/Pagination";
import AdBillboard from "@/components/ads/AdBillboard.client";
import AdMediumRect from "@/components/ads/AdMediumRect.client";
import AdInFeed from "@/components/ads/AdInFeed.client";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
};

function buildFeedItems(articles: Article[], every: number = 3) {
  const items: Array<
    | { kind: "article"; data: Article }
    | { kind: "ad" }
  > = [];

  articles.forEach((article, index) => {
    items.push({ kind: "article", data: article });
    if ((index + 1) % every === 0 && index + 1 < articles.length) {
      items.push({ kind: "ad" });
    }
  });

  return items;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Kategori Tidak Ditemukan" };

  return {
    title: `Kategori: ${category.name}`,
    description: `Baca berita terbaru dalam kategori ${category.name}`,
    openGraph: {
      title: `Kategori: ${category.name} | PortalNews`,
      description: `Baca berita terbaru dalam kategori ${category.name}`,
    },
  };
}

export default async function KategoriPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page, sort } = await searchParams;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const currentPage = Math.max(1, Number(page) || 1);
  const articlesRes = await getArticles({
    category: slug,
    page: currentPage,
    sort: sort || "newest",
  });
  const articles = articlesRes.data;

  const feedItems = buildFeedItems(articles, 3);

  // Preserve search params for pagination links (tanpa page)
  const paginationParams: Record<string, string> = {};
  if (sort) paginationParams.sort = sort;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      {/* Header — Server Component */}
      <CategoryHeader
        category={category}
        totalArticles={articlesRes.meta.total}
      />

      {/* Billboard Ad — di bawah header kategori */}
      <AdBillboard />

      {/* Filter — Client Component */}
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>

      {/* ── MAIN CONTENT + SIDEBAR (2 kolom) ─────── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* LEFT: Article Grid with in-feed ads */}
        <div className="flex-1 min-w-0 space-y-6">
          {feedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {feedItems.map((item, index) =>
                item.kind === "article" ? (
                  <ArticleCard key={item.data.id} article={item.data} />
                ) : (
                  <AdInFeed key={`ad-infeed-${index}`} />
                )
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-16">
              Belum ada artikel dalam kategori ini.
            </p>
          )}

          {/* Pagination — Server Component (Link-based) */}
          <Pagination
            currentPage={currentPage}
            totalPages={articlesRes.meta.totalPages}
            basePath={`/kategori/${slug}`}
            searchParams={paginationParams}
          />
        </div>

        <aside className="w-full lg:w-[300px] shrink-0 space-y-6">
          <AdMediumRect />
          <AdMediumRect />
        </aside>
      </div>
    </div>
  );
}
