import ProductCard from "@/components/shared/product/ProductCard";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { getAllProducts, getAllCategories } from "@/db/actions/product.action";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { cache } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PRICES = [
  { name: "₱1 to ₱50", value: "1-50" },
  { name: "₱51 to ₱100", value: "51-100" },
  { name: "₱101 to ₱200", value: "101-200" },
  { name: "₱201 to ₱500", value: "201-500" },
  { name: "₱501 to ₱1000", value: "501-1000" },
];

const RATINGS = [4, 3, 2, 1];

const SORT_ORDERS = ["newest", "lowest", "highest", "rating"] as const;
type SortOrder = (typeof SORT_ORDERS)[number];

const VALID_PRICES = new Set(PRICES.map((p) => p.value));
const VALID_RATINGS = new Set(RATINGS.map((r) => r.toString()));

const MAX_QUERY_LENGTH = 100;
const MAX_PAGE = 9999;

// ─── Cached Data Fetchers ─────────────────────────────────────────────────────

const getCachedCategories = cache(getAllCategories);

// ─── Param Parsing & Validation ───────────────────────────────────────────────

type RawSearchParams = Record<string, string | string[] | undefined>;

function parseAndValidateParams(raw: RawSearchParams) {
  const getString = (key: string, fallback = "all") =>
    typeof raw[key] === "string" ? (raw[key] as string) : fallback;

  // Free-text query: sanitize and truncate
  const rawQuery = getString("q");
  const q =
  rawQuery === "all"
    ? "all"
    : rawQuery.slice(0, MAX_QUERY_LENGTH).replace(/[<>"]/g, "");

  // Category: pass through; DB layer is responsible for unknown values,
  // but we strip any HTML-injectable chars.
  const category = getString("category").replace(/[<>"]/g, "");

  // Price: validate against allowlist
  const rawPrice = getString("price");
  const price = VALID_PRICES.has(rawPrice) ? rawPrice : "all";

  // Rating: validate against allowlist
  const rawRating = getString("rating");
  const rating = VALID_RATINGS.has(rawRating) ? rawRating : "all";

  // Sort: validate against allowlist
  const rawSort = getString("sort", "newest");
  const sort: SortOrder = (SORT_ORDERS as readonly string[]).includes(rawSort)
    ? (rawSort as SortOrder)
    : "newest";

  // Page: clamp to a safe integer range
  const rawPage = getString("page", "1");
  const page = Math.max(1, Math.min(parseInt(rawPage, 10) || 1, MAX_PAGE));

  return { q, category, price, rating, sort, page };
}

// ─── Filter URL Builder ───────────────────────────────────────────────────────

function buildFilterUrl(
  base: ReturnType<typeof parseAndValidateParams>,
  overrides: Partial<{
    c: string;
    p: string;
    s: string;
    r: string;
    pg: string;
  }>
) {
  const params = {
    q: base.q,
    category: overrides.c ?? base.category,
    price: overrides.p ?? base.price,
    rating: overrides.r ?? base.rating,
    sort: overrides.s ?? base.sort,
    page: overrides.pg ?? base.page.toString(),
  };
  return `/search?${new URLSearchParams(params).toString()}`;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

type Props = {
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q, category, price, rating } = parseAndValidateParams(await searchParams);

  const parts: string[] = [];
  if (q !== "all" && q !== "") parts.push(`Query: ${q}`);
  if (category !== "all" && category !== "") parts.push(`Category: ${category}`);
  if (price !== "all") parts.push(`Price: ${price}`);
  if (rating !== "all") parts.push(`Rating: ${rating}`);

  return {
    title: parts.length > 0 ? `Search — ${parts.join(", ")}` : "Search Products",
  };
}

// ─── Active Filter Badges ─────────────────────────────────────────────────────

type ActiveFilter = { label: string; value: string };

function getActiveFilters(
  params: ReturnType<typeof parseAndValidateParams>
): ActiveFilter[] {
  const { q, category, price, rating } = params;
  return [
    q !== "all" && q !== "" ? { label: "Query", value: q } : null,
    category !== "all" && category !== "" ? { label: "Category", value: category } : null,
    price !== "all" ? { label: "Price", value: price } : null,
    rating !== "all" ? { label: "Rating", value: `${rating} & up` } : null,
  ].filter((f): f is ActiveFilter => f !== null);
}

// ─── Page Component ───────────────────────────────────────────────────────────

async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = parseAndValidateParams(await searchParams);
  const { q, category, price, rating, sort, page } = params;

  // FIX: Parallel data fetching instead of sequential awaits
  const [productsFromDB, categories] = await Promise.all([
    getAllProducts({
      query: q,
      category,
      page,
      price,
      rating,
      sort,
    }),
    getCachedCategories(),
  ]);

  const products = productsFromDB.data.map((product) => ({
    ...product,
    price: product.price.toString(),
    rating: product.rating.toString(),
  }));

  const totalPages: number = productsFromDB.totalPages ?? 1;
  const activeFilters = getActiveFilters(params);
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      {/* ── Sidebar Filters ── */}
      <aside
        aria-label="Product filters"
        className="filter-links md:sticky md:top-20 md:self-start"
      >
        {/* Category */}
        <div className="text-xl mb-2 mt-3" id="category-filter-label">
          Category
        </div>
        <ul className="space-y-1" aria-labelledby="category-filter-label">
          <li>
            <Link
              href={buildFilterUrl(params, { c: "all" })}
              aria-label="Filter by category: Any"
              aria-current={
                category === "all" || category === "" ? "page" : undefined
              }
              className={cn(
                (category === "all" || category === "") && "font-bold"
              )}
            >
              Any
            </Link>
          </li>
          {categories.map((item) => (
            <li key={item.category}>
              <Link
                href={buildFilterUrl(params, { c: item.category })}
                aria-label={`Filter by category: ${item.category}`}
                aria-current={
                  category === item.category ? "page" : undefined
                }
                className={cn(category === item.category && "font-bold")}
              >
                {item.category}
              </Link>
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="text-xl mb-2 mt-8" id="price-filter-label">
          Price
        </div>
        <ul className="space-y-1" aria-labelledby="price-filter-label">
          <li>
            <Link
              href={buildFilterUrl(params, { p: "all" })}
              aria-label="Filter by price: Any"
              aria-current={price === "all" ? "page" : undefined}
              className={cn(price === "all" && "font-bold")}
            >
              Any
            </Link>
          </li>
          {PRICES.map((item) => (
            <li key={item.value}>
              <Link
                href={buildFilterUrl(params, { p: item.value })}
                aria-label={`Filter by price: ${item.name}`}
                aria-current={price === item.value ? "page" : undefined}
                className={cn(price === item.value && "font-bold")}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Rating */}
        <div className="text-xl mb-2 mt-8" id="rating-filter-label">
          Rating
        </div>
        <ul className="space-y-1" aria-labelledby="rating-filter-label">
          <li>
            <Link
              href={buildFilterUrl(params, { r: "all" })}
              aria-label="Filter by rating: Any"
              aria-current={rating === "all" ? "page" : undefined}
              className={cn(rating === "all" && "font-bold")}
            >
              Any
            </Link>
          </li>
          {RATINGS.map((item) => (
            <li key={item}>
              <Link
                href={buildFilterUrl(params, { r: item.toString() })}
                aria-label={`Filter by rating: ${item} stars and up`}
                aria-current={
                  rating === item.toString() ? "page" : undefined
                }
                className={cn(rating === item.toString() && "font-bold")}
              >
                {item} &amp; up
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* ── Main Results ── */}
      <div className="space-y-4 md:col-span-4">
        {/* Active Filters + Sort Bar */}
        <div className="flex-between flex-col md:flex-row my-4">
          {/* Active filter badges */}
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
              >
                <span className="text-muted-foreground">{f.label}:</span>
                <span className="font-medium">{f.value}</span>
              </span>
            ))}
            {hasActiveFilters && (
              <Button variant="link" asChild className="text-muted-foreground px-1">
                <Link href="/search">Clear all</Link>
              </Button>
            )}
          </div>

          {/* Sort links */}
          <div className="flex items-center gap-1 mt-2 md:mt-0">
            <span className="text-sm text-muted-foreground mr-1">Sort by:</span>
            {SORT_ORDERS.map((item) => (
              <Link
                key={item}
                href={buildFilterUrl(params, { s: item })}
                aria-label={`Sort by ${item}`}
                aria-current={sort === item ? "page" : undefined}
                className={cn(
                  "mx-1 text-sm capitalize",
                  sort === item ? "font-bold" : "text-muted-foreground"
                )}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 3} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium">No products found</p>
            {hasActiveFilters ? (
              <p className="text-muted-foreground mt-1 text-sm">
                Try adjusting or{" "}
                <Link href="/search" className="underline underline-offset-2">
                  clearing your filters
                </Link>
                .
              </p>
            ) : (
              <p className="text-muted-foreground mt-1 text-sm">
                Try a different search term.
              </p>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-center gap-2 pt-4"
            aria-label="Pagination"
          >
            <Link
              href={buildFilterUrl(params, { pg: (page - 1).toString() })}
              aria-label="Previous page"
              aria-disabled={page <= 1}
              className={cn(
                "px-3 py-1 rounded border text-sm",
                page <= 1
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-muted"
              )}
            >
              ← Prev
            </Link>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <Link
                key={pg}
                href={buildFilterUrl(params, { pg: pg.toString() })}
                aria-label={`Page ${pg}`}
                aria-current={pg === page ? "page" : undefined}
                className={cn(
                  "px-3 py-1 rounded border text-sm",
                  pg === page
                    ? "font-bold bg-primary text-primary-foreground border-primary"
                    : "hover:bg-muted"
                )}
              >
                {pg}
              </Link>
            ))}

            <Link
              href={buildFilterUrl(params, { pg: (page + 1).toString() })}
              aria-label="Next page"
              aria-disabled={page >= totalPages}
              className={cn(
                "px-3 py-1 rounded border text-sm",
                page >= totalPages
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-muted"
              )}
            >
              Next →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;