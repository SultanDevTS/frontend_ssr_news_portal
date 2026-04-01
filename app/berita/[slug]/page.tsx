import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, sanitizeContent } from "@/lib/api";
import CategoryBadge from "@/components/CategoryBadge";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artikel Tidak Ditemukan" };

  const plainText = article.content?.replace(/<[^>]*>/g, "").slice(0, 160) ?? "";

  return {
    title: article.tittle,
    description: plainText,
    alternates: {
      canonical: `/berita/${slug}`,
    },
    openGraph: {
      title: article.tittle,
      description: plainText,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      section: article.category.name,
      ...(article.thumbnail && { images: [{ url: article.thumbnail }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: article.tittle,
      description: plainText,
      ...(article.thumbnail && { images: [article.thumbnail] }),
    },
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "id-ID",
    { day: "numeric", month: "long", year: "numeric" },
  );

  // Sanitize HTML content untuk mencegah XSS
  const safeContent = article.content
    ? sanitizeContent(article.content)
    : "";

  // JSON-LD Structured Data untuk Google Rich Results & Google News
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.tittle,
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
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Category + Date */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <CategoryBadge category={article.category} />
          <span className="text-sm text-gray-400">{formattedDate}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {article.tittle}
        </h1>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Oleh</span>
          <span className="font-semibold text-gray-700">{article.author}</span>
        </div>
      </header>

      {/* Thumbnail */}
      {article.thumbnail && (
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
          <Image
            src={article.thumbnail}
            alt={article.tittle}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      {/* Content — Sanitized HTML */}
      <div
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

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
