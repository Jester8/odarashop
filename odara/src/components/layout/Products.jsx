"use client";

import Image from "next/image";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { create } from "zustand";
import products from "@/data/products";

// ─── Store ────────────────────────────────────────────────────────────────────
const useStore = create((set) => ({
  wishlist: [],
  cart: [],
  toggleWishlist: (id) =>
    set((state) => ({
      wishlist: state.wishlist.includes(id)
        ? state.wishlist.filter((item) => item !== id)
        : [...state.wishlist, id],
    })),
  addToCart: (product) =>
    set((state) => ({
      cart: [...state.cart, product],
    })),
}));

// ─── Shared constants ─────────────────────────────────────────────────────────
const SHARED_BODY = "bg-white";
const SHARED_HEADER = "bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400";

// ─── Category Themes ──────────────────────────────────────────────────────────
const CATEGORY_THEMES = {
  "New Arrivals": {
    header: SHARED_HEADER,
    body: SHARED_BODY,
    star: "fill-orange-400 text-orange-400",
  },
  Electronics: {
    header: SHARED_HEADER,
    body: SHARED_BODY,
    star: "fill-orange-400 text-orange-400",
  },
  Fashion: {
    header: SHARED_HEADER,
    body: SHARED_BODY,
    star: "fill-orange-400 text-orange-400",
  },
  Home: {
    header: SHARED_HEADER,
    body: SHARED_BODY,
    star: "fill-orange-400 text-orange-400",
  },
  Accessories: {
    header: SHARED_HEADER,
    body: SHARED_BODY,
    star: "fill-orange-400 text-orange-400",
  },
  Beauty: {
    header: SHARED_HEADER,
    body: SHARED_BODY,
    star: "fill-orange-400 text-orange-400",
  },
  Sports: {
    header: SHARED_HEADER,
    body: SHARED_BODY,
    star: "fill-orange-400 text-orange-400",
  },
  Groceries: {
    header: SHARED_HEADER,
    body: SHARED_BODY,
    star: "fill-orange-400 text-orange-400",
  },
};

const DEFAULT_THEME = {
  header: SHARED_HEADER,
  body: SHARED_BODY,
  star: "fill-orange-400 text-orange-400",
};

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

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, size }) {
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
              ? "fill-orange-400 text-orange-400"
              : star === full + 1 && hasHalf
              ? "fill-orange-400 text-orange-400 opacity-50"
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
function ProductCard({ product, isMobile, wishlist, toggleWishlist, addToCart, theme }) {
  const { discountPercent, hasDiscount, oldPrice } = getDiscount(product);

  return (
    <div
      className={`
        rounded-2xl p-2 md:p-3 hover:-translate-y-1 transition duration-300 bg-transparent
        ${isMobile ? "min-w-[44vw] snap-start shrink-0" : ""}
      `}
    >
      {/* Image */}
      <div className="relative w-full h-32 md:h-48 bg-gray-100 rounded-xl overflow-hidden group">
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

        {/* Stock badge */}
        {product.stock <= 5 && (
          <span className="absolute bottom-1.5 left-1.5 bg-red-500 text-white text-[8px] md:text-[10px] px-1.5 py-0.5 rounded-md font-semibold">
            Only {product.stock} left!
          </span>
        )}

        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-1.5 right-1.5 w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition"
          aria-label="Toggle wishlist"
        >
          <Heart
            size={isMobile ? 10 : 13}
            className={
              wishlist.includes(product.id)
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
            }
          />
        </button>
      </div>

      {/* Details */}
      <div className="pt-2">
        <h4 className="text-[11px] md:text-sm font-semibold text-black line-clamp-1 mb-0.5">
          {product.name}
        </h4>

        <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2 mb-1.5">
          Premium quality product built for everyday use.
        </p>

        {/* Stars */}
        <div className="mb-1.5">
          <StarRating
            rating={parseFloat(product.rating)}
            size={isMobile ? 9 : 11}
          />
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between gap-1">
          <div className="min-w-0">
            <p className="text-black font-bold text-[11px] md:text-base truncate">
              ₦{product.price.toLocaleString()}
            </p>
            {hasDiscount && (
              <p className="text-[9px] md:text-xs text-gray-400 line-through">
                ₦{oldPrice.toLocaleString()}
              </p>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Products() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const groupedProducts = groupByCategory(products);

  return (
    <section className="w-full px-3 md:px-8 py-10 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
          Shop Products
        </h2> */}

        {Object.entries(groupedProducts).map(([category, categoryProducts]) => {
          const theme = CATEGORY_THEMES[category] ?? DEFAULT_THEME;

          return (
            <div key={category} className="mb-10">
              {/* Category Header */}
              <div
                className={`flex items-center justify-between ${theme.header} px-5 py-3 rounded-t-2xl`}
              >
                <h3 className="text-lg md:text-xl font-bold text-white">
                  {category}
                </h3>
                <button className="text-sm font-medium text-white hover:underline">
                  View All
                </button>
              </div>

              <div className={`${theme.body} rounded-b-2xl p-3 md:p-4`}>
                {/* Mobile: Horizontal Carousel */}
                <div className="md:hidden flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={`mobile-${product.id}`}
                      product={product}
                      isMobile={true}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                      addToCart={addToCart}
                      theme={theme}
                    />
                  ))}
                </div>

                {/* Desktop: Grid */}
                <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={`desktop-${product.id}`}
                      product={product}
                      isMobile={false}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                      addToCart={addToCart}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}