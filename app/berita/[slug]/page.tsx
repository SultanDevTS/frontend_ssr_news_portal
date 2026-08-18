import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/api";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleContent from "@/components/article/ArticleContent";
import ShareButton from "@/components/article/ShareButton.client";
import LikeButton from "@/components/article/LikeButton.client";
import RelatedArticles from "@/components/article/RelatedArticles";
import CommentSection from "@/components/comment/CommentSection";
import JsonLd from "@/components/ui/JsonLd";
import Skeleton from "@/components/ui/Skeleton";
import AdArticleMid from "@/components/ads/AdArticleMid.client";
import AdStickyFooter from "@/components/ads/AdStickyFooter.client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artikel Tidak Ditemukan" };

  const plainText =
    article.content?.replace(/<[^>]*>/g, "").slice(0, 160) ?? "";

  return {
    title: article.title,
    description: plainText,
    alternates: {
      canonical: `/berita/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: plainText,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      section: article.category.name,
      ...(article.thumbnail && { images: [{ url: article.thumbnail }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: plainText,
      ...(article.thumbnail && { images: [article.thumbnail] }),
    },
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  // JSON-LD Structured Data untuk Google Rich Results & Google News
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    ...(article.thumbnail && {
      image: [article.thumbnail],
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/berita/${slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "PortalNews",
    },
    articleSection: article.category.name,
  };

  return (
    <>
      {/* JSON-LD Structured Data — Server Component */}
      <JsonLd data={jsonLdData} />

      {/* Sticky Footer Ad — Client Component (mobile only, delayed 2s) */}
      <AdStickyFooter />

      <article className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Article Header — Server Component */}
        <ArticleHeader article={article} />

        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* ── MID-ARTICLE AD (antara thumbnail dan konten) ── */}
        <AdArticleMid />

        {/* Article Content — Server Component */}
        {article.content && <ArticleContent content={article.content} />}

        {/* Interactive buttons — Client Components (pushed to leaves) */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <LikeButton
            articleId={article.id}
            initialLikes={article.likes ?? 0}
          />
          <ShareButton title={article.title} slug={article.slug} />
        </div>

        {/* Related Articles — Server Component */}
        <RelatedArticles
          categorySlug={article.category.slug}
          excludeSlug={article.slug}
        />

        {/* Comment Section — Server Component wrapper with Suspense */}
        <Suspense
          fallback={
            <div className="space-y-4 animate-pulse">
              <Skeleton height={24} width={200} />
              <Skeleton height={100} className="w-full rounded-xl" />
              <Skeleton height={60} className="w-full rounded-xl" />
              <Skeleton height={60} className="w-full rounded-xl" />
            </div>
          }
        >
          <CommentSection articleId={article.id} />
        </Suspense>

        {/* Back link */}
        <div className="pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </article>
    </>
  );
}
