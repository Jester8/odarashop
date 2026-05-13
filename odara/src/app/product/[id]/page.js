"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import products from "@/data/products";
import Footer from "@/components/layout/Footer";

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
          <CheckCircle size={18} />
        ) : (
          <AlertCircle size={18} />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-80">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, size = 14, showCount = true }) {
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
      {showCount && (
        <span className="text-xs text-gray-400 ml-1 font-medium">({rating})</span>
      )}
    </div>
  );
}

// ─── Quantity Selector ────────────────────────────────────────────────────────
function QuantitySelector({ quantity, setQuantity, stock }) {
  return (
    <div className="inline-flex items-center bg-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
        disabled={quantity <= 1}
        className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 transition-colors"
      >
        <Minus size={13} className="text-gray-700" />
      </button>
      <span className="w-10 text-center text-sm font-bold text-gray-900">{quantity}</span>
      <button
        onClick={() => quantity < stock && setQuantity(quantity + 1)}
        disabled={quantity >= stock}
        className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 transition-colors"
      >
        <Plus size={13} className="text-gray-700" />
      </button>
    </div>
  );
}

// ─── Review Component ─────────────────────────────────────────────────────────
function Review({ review }) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2D1B4E] to-[#7C5CBF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          {review.userName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-sm text-gray-900">{review.userName}</span>
            <span className="text-xs text-gray-400 flex-shrink-0">{review.date}</span>
          </div>
          <StarRating rating={review.rating} size={12} showCount={false} />
          <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Review Form ──────────────────────────────────────────────────────────────
function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);

  const labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit({ rating, comment, userName: "You", date: new Date().toLocaleDateString(), likes: 0 });
    setComment("");
    setRating(5);
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-5 mb-6">
      <h3 className="font-semibold text-gray-900 text-sm mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  size={20}
                  className={`transition-colors ${
                    s <= (hover || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              </button>
            ))}
            <span className="text-xs text-gray-500 font-medium ml-1">{labels[(hover || rating) - 1]}</span>
          </div>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-[#2D1B4E] focus:ring-2 focus:ring-[#2D1B4E]/10 outline-none transition resize-none placeholder:text-gray-400"
          placeholder="Share your experience with this product..."
          required
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 bg-[#2D1B4E] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#3d2568] transition active:scale-95"
        >
          <Send size={13} />
          Submit Review
        </button>
      </form>
    </div>
  );
}

// ─── Related Product Card ─────────────────────────────────────────────────────
function RelatedProductCard({ product, onClick }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [showToast, setShowToast] = useState(false);
  
  const discountPercent = 15;
  const hasDiscount = product.id % 2 === 0;
  const oldPrice = hasDiscount ? Math.floor(product.price / (1 - discountPercent / 100)) : null;

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    onClick(product.id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group rounded-2xl p-2 md:p-3 bg-white transition-all duration-300 ease-out cursor-pointer md:hover:-translate-y-2 md:hover:scale-[1.03] md:hover:shadow-[0_12px_40px_rgba(0,0,0,0.13)] md:hover:z-10 relative"
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
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute bottom-1.5 left-1.5 bg-red-500 text-white text-[8px] md:text-[10px] px-1.5 py-0.5 rounded-md font-semibold">
              Only {product.stock} left!
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
            className="absolute top-1.5 right-1.5 w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition"
            aria-label="Toggle wishlist"
          >
            <Heart
              size={13}
              className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}
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
              size={11}
              showCount={true}
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
              onClick={handleAddToCart}
              className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center active:scale-95 transition"
              aria-label="Add to cart"
            >
              <ShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
      {showToast && (
        <Toast message="Added to cart!" onClose={() => setShowToast(false)} />
      )}
    </>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-200 rounded-2xl aspect-square" />
        <div className="space-y-4 pt-2">
          <div className="h-5 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded w-1/2" />
          <div className="space-y-2 pt-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-3.5 bg-gray-200 rounded" />)}
          </div>
          <div className="h-12 bg-gray-200 rounded-xl mt-6" />
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id);

  const { addToCart, toggleWishlist, isInWishlist, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    setReviews([
      { id: 1, userName: "Adebayo O.", rating: 5, date: "Mar 15, 2024", comment: "Absolutely love this product! Quality is amazing and delivery was super fast. Highly recommend.", likes: 24 },
      { id: 2, userName: "Chiamaka N.", rating: 4, date: "Mar 10, 2024", comment: "Great product, very durable. Packaging was excellent. Would give 5 stars if shipping was faster.", likes: 12 },
      { id: 3, userName: "Emeka I.", rating: 5, date: "Mar 5, 2024", comment: "Exceeded my expectations! Worth every naira. Will definitely buy again from Odara.", likes: 8 },
    ]);
  }, [productId]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [productId]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setToastMessage(`${quantity} × ${product.name} added to cart`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    router.push("/cart");
  };

  if (loading) return (
    <div className="min-h-screen bg-white pt-14">
      <Skeleton />
    </div>
  );

  if (!product) return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500 text-sm mb-5">This product doesn't exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-[#2D1B4E] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3d2568] transition"
          >
            <ChevronLeft size={16} /> Go Back
          </button>
        </div>
      </div>
      <Footer />
    </>
  );

  const discountPercent = 15;
  const hasDiscount = product.id % 2 === 0;
  const oldPrice = hasDiscount ? Math.floor(product.price / (1 - discountPercent / 100)) : null;
  const inWishlist = isInWishlist(product.id);
  const inStock = product.stock > 0;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const productImages = [product.image, product.image, product.image, product.image];

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-12 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#2D1B4E] transition group text-sm font-medium"
          >
            <ChevronLeft size={17} className="group-hover:-translate-x-0.5 transition" />
            Back
          </button>
          <p className="md:hidden text-xs font-semibold text-gray-700 line-clamp-1 max-w-[200px]">{product.name}</p>
          <div className="w-16" />
        </div>
      </div>

      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">

          {/* ── Main Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">

            {/* Left — Images */}
            <div className="space-y-3">
              <div className="relative bg-[#F8F7FC] rounded-2xl overflow-hidden aspect-square">
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {hasDiscount && (
                  <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2.5 py-1 rounded-lg font-bold shadow-sm">
                    -{discountPercent}% OFF
                  </span>
                )}
                {!inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                      selectedImage === i ? "border-[#2D1B4E]" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right — Info */}
            <div className="flex flex-col gap-4">

              <div>
                <span className="text-xs font-bold text-[#7C5CBF] uppercase tracking-wider">{product.category}</span>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-1 leading-snug">{product.name}</h1>
              </div>

              <div className="flex items-center gap-3">
                <StarRating rating={parseFloat(avgRating)} size={15} showCount={false} />
                <span className="text-xs font-semibold text-gray-700">{avgRating}</span>
                <span className="text-gray-300 text-xs">•</span>
                <span className="text-xs text-gray-500">{reviews.length} reviews</span>
                <span className="text-gray-300 text-xs">•</span>
                <span className={`text-xs font-semibold ${inStock ? "text-emerald-600" : "text-red-500"}`}>
                  {inStock ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  ₦{product.price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-gray-400 line-through">₦{oldPrice.toLocaleString()}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Save ₦{(oldPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                Experience premium quality with the <strong className="text-gray-800">{product.name}</strong>. Designed for everyday use, combining durability with style — whether at home, work, or on the go.
              </p>

              <div className="flex flex-wrap gap-2">
                {["Premium Quality", "1-Year Warranty", "Free Shipping over ₦50k", "30-Day Returns"].map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                    <CheckCircle size={11} className="text-emerald-500 flex-shrink-0" /> {f}
                  </span>
                ))}
              </div>

              {inStock && (
                <div className="flex items-center gap-3">
                  <QuantitySelector quantity={quantity} setQuantity={setQuantity} stock={product.stock} />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="h-9 w-9 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:border-red-300 transition"
                  >
                    <Heart size={16} className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"} />
                  </button>
                </div>
              )}

              {inStock ? (
                <div className="flex gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#2D1B4E] text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-[#3d2568] transition active:scale-95"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-orange-600 transition active:scale-95"
                  >
                    Buy Now
                  </button>
                </div>
              ) : (
                <div className="p-3.5 bg-red-50 rounded-xl text-center">
                  <p className="text-red-600 font-semibold text-sm">Out of Stock</p>
                  <p className="text-xs text-red-400 mt-0.5">Currently unavailable</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                {[
                  { icon: <Truck size={15} />, label: "Free Delivery" },
                  { icon: <ShieldCheck size={15} />, label: "Secure Payment" },
                  { icon: <RefreshCw size={15} />, label: "Easy Returns" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 text-center py-2 bg-gray-50 rounded-xl">
                    <span className="text-[#2D1B4E]">{icon}</span>
                    <span className="text-[11px] font-semibold text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Reviews ── */}
          <div id="reviews-section" className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Customer Reviews</h2>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={parseFloat(avgRating)} size={14} showCount={false} />
                  <span className="text-sm font-semibold text-gray-700">{avgRating}</span>
                  <span className="text-xs text-gray-400">· {reviews.length} reviews</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <MessageCircle size={14} />
                <span>{reviews.length}</span>
              </div>
            </div>

            <ReviewForm onSubmit={(r) => setReviews([{ ...r, id: reviews.length + 1 }, ...reviews])} />

            <div>
              {displayedReviews.map((r) => <Review key={r.id} review={r} />)}
            </div>

            {reviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="mt-4 text-sm font-semibold text-[#2D1B4E] hover:underline"
              >
                {showAllReviews ? "Show less" : `View all ${reviews.length} reviews`}
              </button>
            )}
          </div>

          {/* ── Related Products ── */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100 pb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-5">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {relatedProducts.map((p) => (
                  <RelatedProductCard
                    key={p.id}
                    product={p}
                    onClick={(id) => { router.push(`/product/${id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp 0.25s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}