import sanitize from "sanitize-html";

// Server-side only env var — tidak terekspos ke client bundle
const BASE_URL = process.env.API_URL || "http://localhost:3008/api";

// ── Types ──────────────────────────────────────────────────

export type Category = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
};

export type ArticleCategory = {
  name: string;
  slug: string;
};

export type Article = {
  id: number;
  tittle: string;
  author: string;
  slug: string;
  content?: string;
  thumbnail: string;
  category: ArticleCategory;
  publishedAt: string;
};

export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// ── Sanitize HTML (mencegah XSS) ──────────────────────────

const SANITIZE_OPTIONS: sanitize.IOptions = {
  allowedTags: sanitize.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "h3",
    "figure",
    "figcaption",
    "iframe",
  ]),
  allowedAttributes: {
    ...sanitize.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height", "loading"],
    iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
  },
  allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
};

export function sanitizeContent(html: string): string {
  return sanitize(html, SANITIZE_OPTIONS);
}

// ── API Functions ─────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Gagal mengambil kategori");
  const json: ApiResponse<Category[]> = await res.json();
  return json.data;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const res = await fetch(`${BASE_URL}/categories/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Gagal mengambil data kategori");
  const json: ApiResponse<Category> = await res.json();
  return json.data;
}

// Article
type ArticleParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

export async function getArticles(
  params: ArticleParams = {},
): Promise<PaginatedResponse<Article>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", String(params.search));
  if (params.category) query.set("category", String(params.category));

  const queryString = query.toString();
  const url = `${BASE_URL}/articles${queryString ? `?${queryString}` : ""}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Gagal mengambil data Article");
  return res.json();
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const res = await fetch(`${BASE_URL}/articles/${slug}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Gagal mengambil detail artikel");
  const json: ApiResponse<Article> = await res.json();
  return json.data;
}

