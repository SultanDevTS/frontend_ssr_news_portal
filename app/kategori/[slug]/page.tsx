import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getArticles } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

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

export default async function KategoriPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const articlesRes = await getArticles({ category: slug });
  const articles = articlesRes.data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          ← Kembali ke Beranda
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Kategori: {category.name}
        </h1>
        <p className="text-gray-500 text-sm">
          {articlesRes.meta.total} artikel ditemukan
        </p>
      </div>

      {/* Article Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-16">
          Belum ada artikel dalam kategori ini.
        </p>
      )}
    </div>
  );
}
