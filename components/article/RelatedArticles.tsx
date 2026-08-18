// components/article/RelatedArticles.tsx — Server Component

import { getRelatedArticles } from "@/lib/api";
import ArticleCard from "@/components/article/ArticleCard";

type Props = {
  categorySlug: string;
  excludeSlug: string;
};

export default async function RelatedArticles({
  categorySlug,
  excludeSlug,
}: Props) {
  const articles = await getRelatedArticles(categorySlug, excludeSlug, 3);

  if (articles.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Artikel Terkait</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
