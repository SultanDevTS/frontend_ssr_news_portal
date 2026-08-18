// components/comment/CommentSection.tsx — Server Component (wrapper)

import { getComments } from "@/lib/api";
import CommentList from "@/components/comment/CommentList";
import CommentForm from "@/components/comment/CommentForm.client";

type Props = {
  articleId: number;
};

export default async function CommentSection({ articleId }: Props) {
  const comments = await getComments(articleId);

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        Komentar ({comments.length})
      </h2>

      <CommentForm articleId={articleId} />
      <CommentList comments={comments} />
    </section>
  );
}
