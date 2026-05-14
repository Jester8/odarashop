"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Star,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { useUser } from "@/lib/firebase/useAuth";

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, size = 14 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < full
              ? "fill-amber-400 text-amber-400"
              : i === full && half
              ? "fill-amber-400 text-amber-400 opacity-40"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
}

// ─── Wishlist Product Card ────────────────────────────────────────────────────
function WishlistProductCard({ product, onRemove, onMoveToCart }) {
  const [isMoving, setIsMoving] = useState(false);

  const handleMoveToCart = async () => {
    setIsMoving(true);
    await onMoveToCart(product);
    setIsMoving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE9FF] overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Product Image */}
        <Link 
          href={`/product/${product.id}`}
          className="relative w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 group"
        >
          <Image
            src={product.image || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition duration-500"
          />
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute bottom-1.5 left-1.5 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-md font-semibold">
              Only {product.stock} left!
            </span>
          )}
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link href={`/product/${product.id}`}>
                <h3 className="text-sm md:text-base font-bold text-black hover:text-[#2D1B4E] transition line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={parseFloat(product.rating || 4.5)} size={12} />
                <span className="text-[10px] text-gray-400">{product.rating || 4.5}</span>
              </div>
              <div className="mt-2">
                <span className="text-lg font-black text-[#2D1B4E]">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="ml-2 text-sm text-gray-400 line-through">
                    ₦{product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.category && (
                <p className="text-[10px] text-gray-400 mt-1">
                  Category: {product.category}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleMoveToCart}
                disabled={isMoving || product.stock === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMoving ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingCart size={13} />
                )}
                Move to Cart
              </button>
              <button
                onClick={() => onRemove(product.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty Wishlist ──────────────────────────────────────────────────────────
function EmptyWishlist() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
      <div className="w-24 h-24 bg-[#F0ECFF] rounded-full flex items-center justify-center mb-4">
        <Heart size={40} className="text-[#9C8EC1]" />
      </div>
      <h2 className="text-xl font-bold text-black mb-2">Your wishlist is empty</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-sm">
        Save your favorite items here by clicking the heart icon on any product.
      </p>
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-2 bg-[#2D1B4E] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#3d2568] transition"
      >
        Start Shopping <ShoppingBag size={16} />
      </button>
    </div>
  );
}

// ─── Toast Component ──────────────────────────────────────────────────────────
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-4 z-50 animate-slide-up">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${
        type === "success" 
          ? "bg-emerald-500 text-white" 
          : "bg-red-500 text-white"
      }`}>
        {type === "success" ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function WishlistSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#EDE9FF] p-4">
          <div className="flex gap-4">
            <div className="w-32 h-32 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Wishlist Page ──────────────────────────────────────────────────────
export default function WishlistPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const { 
    wishlistItems = [], 
    removeFromWishlist, 
    addToCart, 
    isInWishlist,
    toggleWishlist 
  } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Simulate loading products
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    showToast("Removed from wishlist", "success");
  };

  const handleMoveToCart = async (product) => {
    // Add to cart
    addToCart({ ...product, quantity: 1 });
    
    // Remove from wishlist
    removeFromWishlist(product.id);
    
    showToast(`${product.name} moved to cart`, "success");
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F7F5FF]">
        <div className="bg-white border-b border-[#EDE9FF] sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[0.85rem] font-bold text-black hover:text-[#2D1B4E] transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
            <h1 className="text-sm font-bold text-black">My Wishlist</h1>
            <div className="w-16" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <WishlistSkeleton />
        </div>
      </div>
    );
  }

  // Show login redirect message
  if (!user) {
    return null;
  }

  const wishlistCount = wishlistItems.length;

  return (
    <div className="min-h-screen bg-[#F7F5FF]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#EDE9FF] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[0.85rem] font-bold text-black hover:text-[#2D1B4E] transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <h1 className="text-sm font-bold text-black">My Wishlist</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2D1B4E] to-[#4B3B72] text-white pt-8 pb-6">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart size={28} className="text-[#F59E0B]" fill="#F59E0B" />
            <h1 className="text-2xl md:text-3xl font-extrabold">My Wishlist</h1>
          </div>
          <p className="text-[#DDD5F8] text-sm">
            {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {wishlistCount === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="space-y-4">
            {/* Wishlist Items */}
            <div className="space-y-3">
              {wishlistItems.map((product) => (
                <WishlistProductCard
                  key={product.id}
                  product={product}
                  onRemove={handleRemoveFromWishlist}
                  onMoveToCart={handleMoveToCart}
                />
              ))}
            </div>

            {/* Recommended Section */}
            <div className="mt-8 pt-6 border-t border-[#EDE9FF]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-black">You Might Also Like</h2>
                <Link 
                  href="/" 
                  className="flex items-center gap-1 text-sm font-semibold text-[#F59E0B] hover:underline"
                >
                  Browse All
                  <ChevronRight size={14} />
                </Link>
              </div>
              <p className="text-sm text-gray-500 text-center py-8">
                Keep exploring our collection to find more items you'll love!
              </p>
            </div>

            {/* Summary Card */}
            <div className="sticky bottom-4 mt-6 bg-white rounded-2xl border border-[#EDE9FF] p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-red-500" fill="currentColor" />
                  <span className="text-sm font-medium text-gray-600">
                    {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} in wishlist
                  </span>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => router.push("/")}
                    className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-black hover:bg-gray-50 transition"
                  >
                    Continue Shopping
                  </button>
                  {wishlistCount > 0 && (
                    <button
                      onClick={() => {
                        wishlistItems.forEach(item => {
                          addToCart({ ...item, quantity: 1 });
                          removeFromWishlist(item.id);
                        });
                        showToast(`Moved ${wishlistCount} items to cart`, "success");
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 bg-[#2D1B4E] text-white rounded-xl text-sm font-semibold hover:bg-[#3d2568] transition"
                    >
                      Move All to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}