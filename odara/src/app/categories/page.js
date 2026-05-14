"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, ChevronLeft, Grid3x3, LayoutList, Home, ArrowLeft, Package } from "lucide-react";

const CATEGORIES = [
  {
    label: 'Electronics', icon: '📱', href: '/category/electronics',
    subcategories: [
      { label: 'Smartphones', icon: '📱', href: '/category/electronics/smartphones' },
      { label: 'Laptops', icon: '💻', href: '/category/electronics/laptops' },
      { label: 'Tablets', icon: '📟', href: '/category/electronics/tablets' },
      { label: 'Headphones', icon: '🎧', href: '/category/electronics/headphones' },
      { label: 'Smart Watches', icon: '⌚', href: '/category/electronics/smart-watches' },
      { label: 'Cameras', icon: '📷', href: '/category/electronics/cameras' },
      { label: 'TVs & Monitors', icon: '📺', href: '/category/electronics/tvs' },
      { label: 'Gaming', icon: '🎮', href: '/category/electronics/gaming' },
      { label: 'Speakers', icon: '🔊', href: '/category/electronics/speakers' },
      { label: 'Accessories', icon: '🔌', href: '/category/electronics/accessories' },
    ],
  },
  {
    label: 'Fashion', icon: '👗', href: '/category/fashion',
    subcategories: [
      { label: "Men's Clothing", icon: '👔', href: '/category/fashion/mens' },
      { label: "Women's Clothing", icon: '👗', href: '/category/fashion/womens' },
      { label: 'Kids Fashion', icon: '🧒', href: '/category/fashion/kids' },
      { label: 'Shoes', icon: '👟', href: '/category/fashion/shoes' },
      { label: 'Bags & Purses', icon: '👜', href: '/category/fashion/bags' },
      { label: 'Watches', icon: '⌚', href: '/category/fashion/watches' },
      { label: 'Sunglasses', icon: '🕶️', href: '/category/fashion/sunglasses' },
      { label: 'Jewellery', icon: '💎', href: '/category/fashion/jewellery' },
    ],
  },
  {
    label: 'Home & Living', icon: '🏠', href: '/category/home-living',
    subcategories: [
      { label: 'Furniture', icon: '🛋️', href: '/category/home/furniture' },
      { label: 'Bedding', icon: '🛏️', href: '/category/home/bedding' },
      { label: 'Kitchen', icon: '🍳', href: '/category/home/kitchen' },
      { label: 'Lighting', icon: '💡', href: '/category/home/lighting' },
      { label: 'Decor', icon: '🖼️', href: '/category/home/decor' },
      { label: 'Storage', icon: '📦', href: '/category/home/storage' },
      { label: 'Garden & Outdoor', icon: '🌿', href: '/category/home/garden' },
    ],
  },
  {
    label: 'Beauty', icon: '💄', href: '/category/beauty',
    subcategories: [
      { label: 'Skincare', icon: '🧴', href: '/category/beauty/skincare' },
      { label: 'Makeup', icon: '💄', href: '/category/beauty/makeup' },
      { label: 'Hair Care', icon: '💇', href: '/category/beauty/hair' },
      { label: 'Fragrances', icon: '🌹', href: '/category/beauty/fragrance' },
      { label: 'Nail Care', icon: '💅', href: '/category/beauty/nails' },
    ],
  },
  {
    label: 'Sports', icon: '⚽', href: '/category/sports',
    subcategories: [
      { label: 'Football', icon: '⚽', href: '/category/sports/football' },
      { label: 'Basketball', icon: '🏀', href: '/category/sports/basketball' },
      { label: 'Tennis', icon: '🎾', href: '/category/sports/tennis' },
      { label: 'Fitness & Gym', icon: '🏋️', href: '/category/sports/gym' },
      { label: 'Cycling', icon: '🚴', href: '/category/sports/cycling' },
    ],
  },
  {
    label: 'Groceries', icon: '🛒', href: '/category/groceries',
    subcategories: [
      { label: 'Rice & Grains', icon: '🌾', href: '/category/groceries/rice' },
      { label: 'Cooking Oil', icon: '🫙', href: '/category/groceries/oil' },
      { label: 'Beverages', icon: '☕', href: '/category/groceries/beverages' },
      { label: 'Snacks', icon: '🍫', href: '/category/groceries/snacks' },
      { label: 'Dairy & Eggs', icon: '🥚', href: '/category/groceries/dairy' },
    ],
  },
  {
    label: 'Books', icon: '📚', href: '/category/books',
    subcategories: [
      { label: 'Fiction', icon: '📖', href: '/category/books/fiction' },
      { label: 'Non-Fiction', icon: '📘', href: '/category/books/non-fiction' },
      { label: "Children's", icon: '🧒', href: '/category/books/children' },
      { label: 'Textbooks', icon: '📗', href: '/category/books/textbooks' },
    ],
  },
  {
    label: 'Toys & Kids', icon: '🧸', href: '/category/toys-kids',
    subcategories: [
      { label: 'Action Figures', icon: '🦸', href: '/category/toys/action-figures' },
      { label: 'Dolls', icon: '🪆', href: '/category/toys/dolls' },
      { label: 'Board Games', icon: '🎲', href: '/category/toys/board-games' },
      { label: 'Puzzles', icon: '🧩', href: '/category/toys/puzzles' },
    ],
  },
];

export default function CategoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.subcategories.some(sub => sub.label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCategoryClick = (cat) => {
    if (isMobileView) {
      setSelectedCategory(cat);
    } else {
      router.push(`/category/${cat.label.toLowerCase()}`);
    }
  };

  const closeSubcategoryDrawer = () => {
    setSelectedCategory(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-[#F7F5FF]">
      {/* Back to Home Button - Top Bar */}
      <div className="bg-white border-b border-[#EDE9FF] sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[0.85rem] font-bold text-black hover:text-[#2D1B4E] transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#2D1B4E] to-[#4B3B72] text-white pt-10 pb-8 md:pt-14 md:pb-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-4xl font-extrabold mb-3 md:mb-4 tracking-tight">
            Shop by Category
          </h1>
          <p className="text-[#DDD5F8] text-sm md:text-base max-w-[500px]">
            Discover thousands of products across our curated categories
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4BAD8] w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories or subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#DDD5F8] rounded-xl py-2.5 pl-10 pr-10 text-[0.9rem] font-medium text-black outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/10 transition-all"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4BAD8] hover:text-black transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* View Toggle */}
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

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[0.75rem] font-semibold text-[#9C8EC1]">
            {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} found
          </div>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="text-[0.7rem] font-bold text-[#F59E0B] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Categories Grid/List */}
        {filteredCategories.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" 
              : "flex flex-col gap-3"
          }>
            {filteredCategories.map((category) => (
              <div
                key={category.label}
                className={`
                  bg-white border border-[#EDE9FF] rounded-2xl overflow-hidden transition-all hover:border-[#F59E0B]/40
                  ${viewMode === "grid" ? "hover:shadow-md" : ""}
                  ${viewMode === "list" ? "flex items-start" : ""}
                `}
              >
                {/* Category Header */}
                <div
                  onClick={() => handleCategoryClick(category)}
                  className={`
                    flex items-center justify-between p-4 md:p-5 bg-[#FAFAFC] border-b border-[#EDE9FF] group cursor-pointer
                    ${viewMode === "list" ? "flex-1 border-b-0" : ""}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#F0ECFF] flex items-center justify-center text-xl md:text-2xl">
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="font-extrabold text-black text-[0.95rem] md:text-[1rem]">
                        {category.label}
                      </h2>
                      <p className="text-[0.7rem] text-[#9C8EC1] font-medium">
                        {category.subcategories.length} subcategories
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-[#C4BAD8] group-hover:text-[#F59E0B] transition-colors w-4 h-4 md:w-5 md:h-5" />
                </div>

                {/* Subcategories - Show in grid view only */}
                {viewMode === "grid" && (
                  <div className="p-4 md:p-5">
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.slice(0, 8).map((sub) => (
                        <Link
                          key={sub.href}
                          href={`/category/${category.label.toLowerCase()}/${sub.label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F7F5FF] rounded-lg text-[0.7rem] font-semibold text-black hover:bg-[#EDE9FF] hover:text-[#2D1B4E] transition-colors"
                        >
                          <span className="text-[0.8rem]">{sub.icon}</span>
                          {sub.label}
                        </Link>
                      ))}
                      {category.subcategories.length > 8 && (
                        <Link
                          href={`/category/${category.label.toLowerCase()}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.7rem] font-bold text-[#F59E0B] hover:underline transition-colors"
                        >
                          +{category.subcategories.length - 8} more
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16 bg-white rounded-2xl border border-[#EDE9FF]">
            <div className="w-16 h-16 bg-[#F0ECFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-[#9C8EC1]" />
            </div>
            <p className="font-extrabold text-black text-lg mb-2">No categories found</p>
            <p className="text-[#9C8EC1] text-sm mb-4">Try searching with different keywords</p>
            <button
              onClick={clearSearch}
              className="text-[0.85rem] font-bold text-[#F59E0B] hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Mobile Subcategory Drawer */}
      {isMobileView && selectedCategory && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[350] animate-[fadeIn_0.2s_ease] backdrop-blur-[2px]" 
            onClick={closeSubcategoryDrawer} 
          />
          <div className="fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white z-[351] flex flex-col overflow-y-auto animate-[slideInRight_0.26s_cubic-bezier(.32,.72,0,1)] shadow-xl">
            {/* Drawer Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F0EEF4] flex-shrink-0 sticky top-0 bg-white z-10">
              <button 
                onClick={closeSubcategoryDrawer} 
                className="flex items-center justify-center w-8 h-8 bg-[#F5F3FF] rounded-lg text-black hover:bg-[#EDE9FF] transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedCategory.icon}</span>
                <span className="text-[0.9rem] font-extrabold text-black">{selectedCategory.label}</span>
              </div>
            </div>

            {/* View All Link */}
            <div className="px-4 pt-3 pb-2">
              <Link 
                href={`/category/${selectedCategory.label.toLowerCase()}`} 
                className="flex items-center gap-2 text-[0.8rem] font-bold text-[#F59E0B] hover:opacity-70 transition-opacity"
                onClick={closeSubcategoryDrawer}
              >
                <ChevronRight size={14} />
                View all {selectedCategory.label}
              </Link>
            </div>

            <div className="h-px bg-[#EDE9F6] mx-4 mb-2" />

            {/* Subcategories List */}
            <div className="flex-1 pb-4">
              {selectedCategory.subcategories.map((sub) => (
                <Link
                  key={sub.href}
                  href={`/category/${selectedCategory.label.toLowerCase()}/${sub.label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                  className="flex items-center gap-3 px-4 py-3 text-[0.84rem] font-medium text-black hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors"
                  onClick={closeSubcategoryDrawer}
                >
                  <span className="text-base w-7 h-7 flex items-center justify-center bg-[#F8F6FF] rounded-lg flex-shrink-0">
                    {sub.icon}
                  </span>
                  {sub.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}