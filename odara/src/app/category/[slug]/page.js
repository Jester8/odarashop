"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronLeft, 
  ChevronRight, 
  Grid3x3, 
  LayoutList, 
  ShoppingCart, 
  Heart, 
  Star,
  Filter,
  X,
  ArrowLeft
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import products from "@/data/products";

const CATEGORIES = {
  electronics: {
    label: "Electronics",
    icon: "📱",
    subcategories: [
      { label: "Smartphones", icon: "📱", slug: "smartphones" },
      { label: "Laptops", icon: "💻", slug: "laptops" },
      { label: "Tablets", icon: "📟", slug: "tablets" },
      { label: "Headphones", icon: "🎧", slug: "headphones" },
      { label: "Smart Watches", icon: "⌚", slug: "smart-watches" },
      { label: "Cameras", icon: "📷", slug: "cameras" },
      { label: "TVs & Monitors", icon: "📺", slug: "tvs" },
      { label: "Gaming", icon: "🎮", slug: "gaming" },
    ],
  },
  fashion: {
    label: "Fashion",
    icon: "👗",
    subcategories: [
      { label: "Men's Clothing", icon: "👔", slug: "mens" },
      { label: "Women's Clothing", icon: "👗", slug: "womens" },
      { label: "Kids Fashion", icon: "🧒", slug: "kids" },
      { label: "Shoes", icon: "👟", slug: "shoes" },
      { label: "Bags & Purses", icon: "👜", slug: "bags" },
      { label: "Watches", icon: "⌚", slug: "watches" },
    ],
  },
  "home-living": {
    label: "Home & Living",
    icon: "🏠",
    subcategories: [
      { label: "Furniture", icon: "🛋️", slug: "furniture" },
      { label: "Bedding", icon: "🛏️", slug: "bedding" },
      { label: "Kitchen", icon: "🍳", slug: "kitchen" },
      { label: "Lighting", icon: "💡", slug: "lighting" },
      { label: "Decor", icon: "🖼️", slug: "decor" },
    ],
  },
  beauty: {
    label: "Beauty",
    icon: "💄",
    subcategories: [
      { label: "Skincare", icon: "🧴", slug: "skincare" },
      { label: "Makeup", icon: "💄", slug: "makeup" },
      { label: "Hair Care", icon: "💇", slug: "hair" },
      { label: "Fragrances", icon: "🌹", slug: "fragrance" },
    ],
  },
  sports: {
    label: "Sports",
    icon: "⚽",
    subcategories: [
      { label: "Football", icon: "⚽", slug: "football" },
      { label: "Basketball", icon: "🏀", slug: "basketball" },
      { label: "Tennis", icon: "🎾", slug: "tennis" },
      { label: "Fitness & Gym", icon: "🏋️", slug: "gym" },
    ],
  },
  groceries: {
    label: "Groceries",
    icon: "🛒",
    subcategories: [
      { label: "Rice & Grains", icon: "🌾", slug: "rice" },
      { label: "Cooking Oil", icon: "🫙", slug: "oil" },
      { label: "Beverages", icon: "☕", slug: "beverages" },
      { label: "Snacks", icon: "🍫", slug: "snacks" },
    ],
  },
  books: {
    label: "Books",
    icon: "📚",
    subcategories: [
      { label: "Fiction", icon: "📖", slug: "fiction" },
      { label: "Non-Fiction", icon: "📘", slug: "non-fiction" },
      { label: "Children's", icon: "🧒", slug: "children" },
      { label: "Textbooks", icon: "📗", slug: "textbooks" },
    ],
  },
  "toys-kids": {
    label: "Toys & Kids",
    icon: "🧸",
    subcategories: [
      { label: "Action Figures", icon: "🦸", slug: "action-figures" },
      { label: "Dolls", icon: "🪆", slug: "dolls" },
      { label: "Board Games", icon: "🎲", slug: "board-games" },
      { label: "Puzzles", icon: "🧩", slug: "puzzles" },
    ],
  },
};

function ProductCard({ product, onClick }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div
      onClick={() => onClick(product.id)}
      className="group rounded-2xl p-2 md:p-3 bg-white transition-all duration-300 ease-out cursor-pointer md:hover:-translate-y-2 md:hover:scale-[1.03] md:hover:shadow-[0_12px_40px_rgba(0,0,0,0.13)] md:hover:z-10 relative"
    >
      <div className="relative w-full h-32 md:h-44 bg-gray-100 rounded-xl overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition duration-500"
        />
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-1.5 right-1.5 w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition"
        >
          <Heart size={13} className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>

      <div className="pt-2">
        <h4 className="text-[11px] md:text-sm font-semibold text-black line-clamp-1 mb-0.5">
          {product.name}
        </h4>
        <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2 mb-1.5">
          Premium quality product
        </p>
        <div className="flex items-center gap-1 mb-1.5">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-medium text-gray-600">{product.rating || 4.5}</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          <p className="text-black font-bold text-[11px] md:text-sm">
            ₦{product.price.toLocaleString()}
          </p>
          <button
            onClick={handleAddToCart}
            className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center active:scale-95 transition"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.slug;
  const subcategorySlug = params.subslug;

  const [viewMode, setViewMode] = useState("grid");
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = CATEGORIES[categorySlug];

  useEffect(() => {
    // Simulate loading products based on category
    const loadProducts = () => {
      setLoading(true);
      setTimeout(() => {
        // Filter products by category (in a real app, this would come from an API)
        const categoryProducts = products.filter(product => 
          product.category?.toLowerCase().includes(categorySlug?.toLowerCase())
        );
        
        // Further filter by subcategory if selected
        let filtered = categoryProducts;
        if (subcategorySlug) {
          filtered = categoryProducts.filter(product =>
            product.subcategory?.toLowerCase().replace(/ /g, '-') === subcategorySlug
          );
          const subcat = category?.subcategories.find(s => s.slug === subcategorySlug);
          setSelectedSubcategory(subcat || null);
        } else {
          setSelectedSubcategory(null);
        }
        
        setFilteredProducts(filtered);
        setLoading(false);
      }, 300);
    };

    loadProducts();
  }, [categorySlug, subcategorySlug, products]);

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h1 className="text-xl font-bold text-black mb-2">Category Not Found</h1>
          <p className="text-gray-500 text-sm mb-5">The category you're looking for doesn't exist.</p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-[#2D1B4E] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3d2568] transition"
          >
            <ArrowLeft size={16} /> Browse Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5FF]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#EDE9FF] sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[0.85rem] font-bold text-black hover:text-[#2D1B4E] transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <h1 className="text-sm font-bold text-black">{category.label}</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Category Hero */}
      <div className="bg-gradient-to-r from-[#2D1B4E] to-[#4B3B72] text-white pt-8 pb-6">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl md:text-4xl">{category.icon}</span>
            <h1 className="text-2xl md:text-3xl font-extrabold">{category.label}</h1>
          </div>
          {selectedSubcategory ? (
            <div className="flex items-center gap-2 text-sm text-[#DDD5F8]">
              <Link href={`/category/${categorySlug}`} className="hover:text-white transition">
                {category.label}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white font-semibold">{selectedSubcategory.label}</span>
            </div>
          ) : (
            <p className="text-[#DDD5F8] text-sm">
              {category.subcategories.length} subcategories • {filteredProducts.length} products
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex gap-6">
          {/* Sidebar - Subcategories */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-[#EDE9FF] p-4 sticky top-20">
              <h3 className="font-extrabold text-black text-sm mb-3">Subcategories</h3>
              <div className="space-y-1">
                <Link
                  href={`/categories/${categorySlug}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !selectedSubcategory
                      ? "bg-[#2D1B4E] text-white"
                      : "text-black hover:bg-[#F7F5FF]"
                  }`}
                >
                  All {category.label}
                </Link>
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/categories/${categorySlug}/${sub.slug}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSubcategory?.slug === sub.slug
                        ? "bg-[#2D1B4E] text-white"
                        : "text-black hover:bg-[#F7F5FF]"
                    }`}
                  >
                    <span>{sub.icon}</span>
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-[0.75rem] font-semibold text-[#9C8EC1]">
                {filteredProducts.length} products found
              </div>
              <div className="flex items-center gap-2 bg-[#F7F5FF] rounded-xl p-1 border border-[#EDE9FF]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.8rem] font-bold transition-all ${
                    viewMode === "grid" 
                      ? "bg-white text-black shadow-sm" 
                      : "text-[#9C8EC1] hover:text-black"
                  }`}
                >
                  <Grid3x3 size={14} />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.8rem] font-bold transition-all ${
                    viewMode === "list" 
                      ? "bg-white text-black shadow-sm" 
                      : "text-[#9C8EC1] hover:text-black"
                  }`}
                >
                  <LayoutList size={14} />
                  List
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-3 animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-32 md:h-44" />
                    <div className="mt-2 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-2 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
                  : "flex flex-col gap-3"
              }>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={(id) => router.push(`/product/${id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16 bg-white rounded-2xl border border-[#EDE9FF]">
                <div className="w-16 h-16 bg-[#F0ECFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package size={28} className="text-[#9C8EC1]" />
                </div>
                <p className="font-extrabold text-black text-lg mb-2">No products found</p>
                <p className="text-[#9C8EC1] text-sm mb-4">
                  {selectedSubcategory 
                    ? `No products in ${selectedSubcategory.label} yet` 
                    : "No products in this category yet"}
                </p>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 text-[0.85rem] font-bold text-[#F59E0B] hover:underline"
                >
                  Browse other categories
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}