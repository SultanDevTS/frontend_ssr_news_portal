// components/Navbar.tsx — Server Component

import Link from "next/link";
import { getCategories } from "@/lib/api";
import NavbarClient from "@/components/NavbarClient";

// Maximum categories shown directly in the desktop navbar
const MAX_VISIBLE_CATEGORIES = 6;

export default async function Navbar() {
  const categories = await getCategories();

  // Deduplicate categories by slug
  const uniqueCategories = categories.filter(
    (cat, index, self) => self.findIndex((c) => c.slug === cat.slug) === index,
  );

  const visibleCategories = uniqueCategories.slice(0, MAX_VISIBLE_CATEGORIES);
  const overflowCategories = uniqueCategories.slice(MAX_VISIBLE_CATEGORIES);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/60">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main navbar row */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="text-2xl font-extrabold tracking-tight text-blue-600">
              Portal
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              News
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg
                         hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              Beranda
            </Link>

            <span className="w-px h-5 bg-gray-200 mx-1" />

            {visibleCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="px-3 py-2 text-sm font-medium text-gray-500 rounded-lg whitespace-nowrap
                           hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                {cat.name}
              </Link>
            ))}

            {overflowCategories.length > 0 && (
              <div className="relative group">
                <button
                  className="px-3 py-2 text-sm font-medium text-gray-500 rounded-lg
                             hover:bg-blue-50 hover:text-blue-600 transition-all duration-200
                             flex items-center gap-1"
                >
                  Lainnya
                  <svg
                    className="w-3.5 h-3.5 transition-transform group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                <div
                  className="absolute right-0 top-full pt-2 opacity-0 invisible
                              group-hover:opacity-100 group-hover:visible
                              transition-all duration-200"
                >
                  <div
                    className="bg-white rounded-xl shadow-lg border border-gray-100
                                py-2 min-w-[180px]"
                  >
                    {overflowCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/kategori/${cat.slug}`}
                        className="block px-4 py-2.5 text-sm text-gray-600
                                   hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Right side: Search + Mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Search icon (desktop) */}
            <button
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full
                         text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Mobile menu — Client Component */}
            <NavbarClient categories={uniqueCategories} />
          </div>
        </div>
      </div>
    </header>
  );
}
