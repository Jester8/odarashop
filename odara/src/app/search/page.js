"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search,  SlidersHorizontal, X, ChevronDown } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  // Sync input if URL query changes (e.g. browser back/forward)
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Simulate a search fetch — replace this with your real API call
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      // TODO: replace with real product fetch using `query`
      setResults([]);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    router.push("/search");
  };

  return (
    <div className="min-h-screen bg-[#F7F5FF]">

      {/* Top bar */}
      <div className="bg-white border-b border-[#EDE9FF] sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-[0.85rem] font-bold text-black hover:text-[#2D1B4E] transition-colors group flex-shrink-0"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 relative flex items-center max-w-[640px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4BAD8] w-4 h-4 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products, brands..."
              className="w-full bg-[#F7F5FF] border border-[#DDD5F8] rounded-xl py-2.5 pl-10 pr-20 text-[0.9rem] font-medium text-black outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/10 transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-[#C4BAD8] hover:text-black transition-colors p-1"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 bg-[#2D1B4E] text-white rounded-lg py-1.5 px-3 text-[0.75rem] font-bold hover:bg-[#3d2568] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">

        {/* Query header */}
        {query ? (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-black">
                Results for{" "}
                <span className="text-[#2D1B4E]">"{query}"</span>
              </h1>
              {!isLoading && (
                <p className="text-[0.8rem] text-[#9C8EC1] font-medium mt-1">
                  {results.length === 0
                    ? "No products found"
                    : `${results.length} product${results.length !== 1 ? "s" : ""} found`}
                </p>
              )}
            </div>

            {/* Sort + Filter controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[0.8rem] font-bold transition-all ${
                  showFilters
                    ? "bg-[#2D1B4E] text-white border-[#2D1B4E]"
                    : "bg-white text-black border-[#DDD5F8] hover:border-[#2D1B4E]"
                }`}
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-[#DDD5F8] rounded-xl py-2 pl-3 pr-8 text-[0.8rem] font-bold text-black outline-none focus:border-[#2D1B4E] cursor-pointer hover:border-[#2D1B4E] transition-colors"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9C8EC1] pointer-events-none" />
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-extrabold text-black">Search</h1>
            <p className="text-[0.8rem] text-[#9C8EC1] font-medium mt-1">
              Enter a term above to find products
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#EDE9FF] overflow-hidden animate-pulse">
                <div className="aspect-square bg-[#F0ECFF]" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-[#EDE9FF] rounded-full w-3/4" />
                  <div className="h-3 bg-[#EDE9FF] rounded-full w-1/2" />
                  <div className="h-4 bg-[#EDE9FF] rounded-full w-1/3 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!isLoading && query && results.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EDE9FF]">
            <div className="w-16 h-16 bg-[#F0ECFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-[#9C8EC1]" />
            </div>
            <p className="font-extrabold text-black text-lg mb-2">
              No results for "{query}"
            </p>
            <p className="text-[#9C8EC1] text-sm mb-6 max-w-xs mx-auto">
              Try different keywords, check your spelling, or browse our categories.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 bg-[#2D1B4E] text-white text-[0.85rem] font-bold px-5 py-2.5 rounded-xl hover:bg-[#3d2568] transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        )}

        {/* Empty state — no query at all */}
        {!isLoading && !query && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EDE9FF]">
            <div className="w-16 h-16 bg-[#F0ECFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-[#9C8EC1]" />
            </div>
            <p className="font-extrabold text-black text-lg mb-2">
              What are you looking for?
            </p>
            <p className="text-[#9C8EC1] text-sm">
              Type in the search bar above to find products
            </p>
          </div>
        )}

        {/* Results grid — populate once you wire up real data */}
        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-2xl border border-[#EDE9FF] overflow-hidden hover:border-[#F59E0B]/40 hover:shadow-md transition-all group"
              >
                <div className="aspect-square bg-[#F7F5FF] relative overflow-hidden">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[0.8rem] font-semibold text-[#9C8EC1] mb-0.5 truncate">
                    {product.category}
                  </p>
                  <p className="text-[0.88rem] font-bold text-black line-clamp-2 leading-snug mb-2">
                    {product.name}
                  </p>
                  <p className="text-[0.95rem] font-extrabold text-[#2D1B4E]">
                    ₦{product.price?.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F5FF] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#2D1B4E] border-t-transparent animate-spin" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}