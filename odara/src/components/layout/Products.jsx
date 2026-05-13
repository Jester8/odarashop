"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import products from "@/data/products";

// ─── Category Themes ──────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  orange: {
    header: "bg-orange-500",
    star: "fill-amber-400 text-amber-400",
  },
  purple: {
    header: "bg-purple-700",
    star: "fill-amber-400 text-amber-400",
  },
};

const CATEGORY_ORDER = [
  "New Arrivals",
  "Electronics",
  "Fashion",
  "Home",
  "Accessories",
  "Beauty",
  "Sports",
  "Groceries",
];

function getCategoryTheme(category) {
  const idx = CATEGORY_ORDER.indexOf(category);
  const key = idx % 2 === 0 ? "orange" : "purple";
  return CATEGORY_COLORS[key];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DISCOUNTS = [10, 15, 20, 30];

function getDiscount(product) {
  const discountPercent = DISCOUNTS[product.id % 4];
  const hasDiscount = product.id % 2 === 0;
  const oldPrice = hasDiscount
    ? Math.floor(product.price / (1 - discountPercent / 100))
    : null;
  return { discountPercent, hasDiscount, oldPrice };
}

function groupByCategory(productList) {
  return productList.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});
}

// ─── Skeleton Components ──────────────────────────────────────────────────────
function CardSkeleton({ isMobile }) {
  return (
    <div
      className={`rounded-2xl p-2 md:p-3 bg-transparent
        ${isMobile ? "min-w-[44vw] shrink-0" : ""}
      `}
    >
      <div className="w-full h-32 md:h-44 rounded-xl bg-gray-200 animate-pulse" />
      <div className="pt-2 space-y-2">
        <div className="h-3 w-3/4 rounded-md bg-gray-200 animate-pulse" />
        <div className="h-2.5 w-full rounded-md bg-gray-200 animate-pulse" />
        <div className="h-2.5 w-2/3 rounded-md bg-gray-200 animate-pulse" />
        <div className="h-2.5 w-1/2 rounded-md bg-gray-200 animate-pulse" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 w-1/3 rounded-md bg-gray-200 animate-pulse" />
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function CategorySkeleton({ colorKey = "orange" }) {
  const headerBg = colorKey === "orange" ? "bg-orange-400" : "bg-purple-600";
  return (
    <div className="mb-10">
      <div className={`flex items-center justify-between ${headerBg} opacity-40 px-4 py-2.5 md:rounded-t-2xl`}>
        <div className="h-4 w-28 rounded bg-white/70 animate-pulse" />
        <div className="h-3 w-12 rounded bg-white/70 animate-pulse" />
      </div>
      <div className="bg-white md:rounded-b-2xl p-3 md:p-4">
        <div className="md:hidden flex gap-2 overflow-hidden pb-2">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} isMobile={true} />
          ))}
        </div>
        <div className="hidden md:grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <CardSkeleton key={i} isMobile={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, size, starClass }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= full
              ? starClass
              : star === full + 1 && hasHalf
              ? `${starClass} opacity-50`
              : "fill-gray-300 text-gray-300"
          }
        />
      ))}
      <span className="text-[9px] md:text-[11px] text-gray-500 ml-0.5">
        ({rating})
      </span>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, isMobile, theme }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { discountPercent, hasDiscount, oldPrice } = getDiscount(product);
  const inWishlist = isInWishlist(product.id);

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    router.push(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        group rounded-2xl p-2 md:p-3 bg-white
        transition-all duration-300 ease-out cursor-pointer
        md:hover:-translate-y-2 md:hover:scale-[1.03]
        md:hover:shadow-[0_12px_40px_rgba(0,0,0,0.13)]
        md:hover:z-10 md:relative
        ${isMobile ? "min-w-[44vw] snap-start shrink-0" : ""}
      `}
    >
      <div className="relative w-full h-32 md:h-44 bg-gray-100 rounded-xl overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition duration-500"
        />
        {hasDiscount && (
          <span className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[9px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-md font-semibold">
            -{discountPercent}%
          </span>
        )}
        {product.stock <= 5 && (
          <span className="absolute bottom-1.5 left-1.5 bg-red-500 text-white text-[8px] md:text-[10px] px-1.5 py-0.5 rounded-md font-semibold">
            Only {product.stock} left!
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-1.5 right-1.5 w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition"
          aria-label="Toggle wishlist"
        >
          <Heart
            size={isMobile ? 10 : 13}
            className={
              inWishlist
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
            }
          />
        </button>
      </div>

      <div className="pt-2">
        <h4 className="text-[11px] md:text-sm font-semibold text-black line-clamp-1 mb-0.5">
          {product.name}
        </h4>
        <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2 mb-1.5">
          Premium quality product built for everyday use.
        </p>
        <div className="mb-1.5">
          <StarRating
            rating={parseFloat(product.rating)}
            size={isMobile ? 9 : 11}
            starClass={theme.star}
          />
        </div>
        <div className="flex items-center justify-between gap-1">
          <div className="min-w-0">
            <p className="text-black font-bold text-[11px] md:text-sm truncate">
              ₦{product.price.toLocaleString()}
            </p>
            {hasDiscount && (
              <p className="text-[9px] md:text-xs text-gray-400 line-through">
                ₦{oldPrice.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center active:scale-95 transition"
            aria-label="Add to cart"
          >
            <ShoppingCart size={isMobile ? 11 : 14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── More Coming Card ─────────────────────────────────────────────────────────
function MoreComingCard() {
  return (
    <div className="mx-3 md:mx-0 mb-6 rounded-2xl bg-gray-100 px-6 py-10 flex flex-col items-center justify-center text-center gap-3">
      <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
        <ShoppingCart size={26} className="text-gray-400" />
      </div>
      <h3 className="text-sm md:text-base font-bold text-gray-600">
        More products coming soon
      </h3>
      <p className="text-xs md:text-sm text-gray-400 max-w-xs leading-relaxed">
        We&apos;re adding new categories and products every week. Check back soon for fresh arrivals from across Africa.
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Products() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const groupedProducts = groupByCategory(products);

  if (!loaded) {
    return (
      <section className="w-full px-0 md:px-8 py-10 bg-white">
        <div className="max-w-7xl mx-auto">
          {CATEGORY_ORDER.map((cat, i) => (
            <CategorySkeleton key={cat} colorKey={i % 2 === 0 ? "orange" : "purple"} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-0 md:px-8 py-10 bg-white">
      <div className="max-w-7xl mx-auto">
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => {
          const theme = getCategoryTheme(category);

          return (
            <div key={category} className="mb-10">
              <div
                className={`
                  flex items-center justify-between
                  ${theme.header}
                  px-4 py-2.5
                  md:rounded-t-2xl
                `}
              >
                <h3 className="text-sm md:text-xl font-bold text-white tracking-tight">
                  {category}
                </h3>
                <button className="text-xs md:text-sm font-medium text-white/90 hover:text-white hover:underline transition">
                  View All
                </button>
              </div>

              <div className="bg-white md:rounded-b-2xl p-3 md:p-4 overflow-visible">
                <div className="md:hidden flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={`mobile-${product.id}`}
                      product={product}
                      isMobile={true}
                      theme={theme}
                    />
                  ))}
                </div>

                <div className="hidden md:grid grid-cols-5 gap-3 py-3">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={`desktop-${product.id}`}
                      product={product}
                      isMobile={false}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
          <MoreComingCard />
      </div>
    </section>
  );
}