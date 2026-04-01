import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArticles, getCategories } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Beranda",
  description: "Baca berita terkini dari berbagai kategori",
};

export default async function HomePage() {
  // Fetch 2 data sekaligus secara paralel
  const [articlesRes, categories] = await Promise.all([
    getArticles(),
    getCategories(),
  ]);

  const articles = articlesRes.data;

  // Pisahkan artikel pertama sebagai "featured"
  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1, 7); // index 1–6

  // Format tanggal helper
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* ── HERO SECTION ───────────────────────────── */}
      {featuredArticle && (
        <section>
          <Link href={`/berita/${featuredArticle.slug}`}>
            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden group">
              {featuredArticle.thumbnail ? (
                <Image
                  src={featuredArticle.thumbnail}
                  alt={featuredArticle.tittle}
                  fill
                  priority
                  sizes="(max-width: 1152px) 100vw, 1152px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-lg">
                  No Image
                </div>
              )}
              {/* Overlay gelap di bawah agar teks terbaca */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Teks di atas gambar */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span
                  className="inline-block bg-blue-600 text-xs font-semibold 
                                 px-3 py-1 rounded-full mb-3"
                >
                  {featuredArticle.category.name}
                </span>
                <h1
                  className="text-2xl md:text-3xl font-bold leading-tight 
                               line-clamp-2 mb-2"
                >
                  {featuredArticle.tittle}
                </h1>
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <span>{featuredArticle.author}</span>
                  <span>•</span>
                  <span>{formatDate(featuredArticle.publishedAt)}</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── FILTER KATEGORI ────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-500 mr-2">
            Kategori:
          </span>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/kategori/${cat.slug}`}
              className="px-4 py-1.5 rounded-full border border-gray-200 text-sm
                         text-gray-600 hover:bg-blue-600 hover:text-white 
                         hover:border-blue-600 transition-all"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── GRID ARTIKEL TERBARU ───────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Artikel Terbaru</h2>
          <span className="text-sm text-gray-400">
            {articlesRes.meta.total} artikel tersedia
          </span>
        </div>

        {gridArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-12">
            Belum ada artikel tersedia.
          </p>
        )}
      </section>
    </div>
  );
}
