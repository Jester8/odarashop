"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
  ThumbsUp,
  Send
} from "lucide-react";
import { create } from "zustand";
import products from "@/data/products";
import Footer from "@/components/layout/Footer";

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

// ─── Star Rating Component ────────────────────────────────────────────────────
function StarRating({ rating, size = 16, showCount = true }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
            i < fullStars
              ? "fill-amber-400 text-amber-400"
              : i === fullStars && hasHalfStar
              ? "fill-amber-400 text-amber-400 opacity-50"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      {showCount && (
        <span className="text-sm text-gray-500 ml-1">({rating})</span>
      )}
    </div>
  );
}

// ─── Quantity Selector ────────────────────────────────────────────────────────
function QuantitySelector({ quantity, setQuantity, stock }) {
  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increase = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-[120px]">
      <button
        onClick={decrease}
        disabled={quantity <= 1}
        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <Minus size={14} className="text-gray-800" />
      </button>
      <span className="w-12 text-center font-semibold text-gray-900 text-sm">
        {quantity}
      </span>
      <button
        onClick={increase}
        disabled={quantity >= stock}
        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <Plus size={14} className="text-gray-800" />
      </button>
    </div>
  );
}

// ─── Review Component ─────────────────────────────────────────────────────────
function Review({ review }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(review.likes || 0);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D1B4E] to-[#4B3B72] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {review.userName.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <div>
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={review.rating} size={14} showCount={false} />
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
            {review.comment}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition ${
                liked ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <ThumbsUp size={14} />
              <span>Helpful ({likesCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Review Form ──────────────────────────────────────────────────────────────
function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit({
        rating,
        comment,
        userName: "Current User",
        date: new Date().toLocaleDateString(),
        likes: 0,
      });
      setComment("");
      setRating(5);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                size={24}
                className={`${
                  star <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                } transition`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {rating === 5 ? "Excellent" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2D1B4E] focus:ring-2 focus:ring-[#2D1B4E]/10 outline-none transition placeholder:text-gray-400"
          placeholder="Share your experience with this product..."
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 bg-[#2D1B4E] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#3d2568] transition"
      >
        <Send size={16} />
        Submit Review
      </button>
    </form>
  );
}

// ─── Related Products Card ────────────────────────────────────────────────────
function RelatedProductCard({ product, onClick }) {
  const { hasDiscount, discountPercent, oldPrice } = getDiscount(product);
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const isInWishlist = wishlist.includes(product.id);

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    onClick(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group rounded-2xl p-2 bg-white cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.13)]"
    >
      <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition duration-500"
        />
        {hasDiscount && (
          <span className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[9px] md:text-xs px-1.5 py-0.5 rounded-md font-semibold">
            -{discountPercent}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition"
        >
          <Heart
            size={12}
            className={isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </div>
      <div className="pt-2">
        <h4 className="text-xs md:text-sm font-semibold text-black line-clamp-1 mb-0.5">
          {product.name}
        </h4>
        <p className="text-[10px] text-gray-500">{product.category}</p>
        <div className="flex items-center justify-between gap-1 mt-1">
          <div>
            <p className="text-black font-bold text-xs md:text-sm">
              ₦{product.price.toLocaleString()}
            </p>
            {hasDiscount && (
              <p className="text-[8px] md:text-[10px] text-gray-400 line-through">
                ₦{oldPrice.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="shrink-0 w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center active:scale-95 transition"
          >
            <ShoppingCart size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Product Page Component ─────────────────────────────────────────────
export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id);
  
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Find product
  const product = products.find((p) => p.id === productId);

  // Mock reviews data
  useEffect(() => {
    const mockReviews = [
      {
        id: 1,
        userName: "Adebayo O.",
        rating: 5,
        date: "March 15, 2024",
        comment: "Absolutely love this product! The quality is amazing and delivery was super fast. Highly recommend to anyone looking for quality items on Odara.",
        likes: 24,
      },
      {
        id: 2,
        userName: "Chiamaka N.",
        rating: 4,
        date: "March 10, 2024",
        comment: "Great product, very durable. The packaging was excellent. Would give 5 stars if the shipping was a bit faster.",
        likes: 12,
      },
      {
        id: 3,
        userName: "Emeka I.",
        rating: 5,
        date: "March 5, 2024",
        comment: "Exceeded my expectations! Worth every naira. Will definitely buy again from Odara.",
        likes: 8,
      },
    ];
    setReviews(mockReviews);
  }, [productId]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [productId]);

  const handleAddReview = (newReview) => {
    const reviewWithId = {
      ...newReview,
      id: reviews.length + 1,
    };
    setReviews([reviewWithId, ...reviews]);
    document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!loading && !product) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={48} className="text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 bg-[#2D1B4E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3d2568] transition"
            >
              <ChevronLeft size={20} /> Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-white pt-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <div className="bg-gray-200 rounded-2xl aspect-square animate-pulse" />
                <div className="flex gap-3 mt-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded-lg w-2/3 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-full w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded-full w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded-full w-4/6 animate-pulse" />
                </div>
                <div className="h-10 bg-gray-200 rounded-lg w-1/3 animate-pulse" />
                <div className="h-14 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const { hasDiscount, discountPercent, oldPrice } = getDiscount(product);
  const isInWishlist = wishlist.includes(product.id);
  const inStock = product.stock > 0;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    router.push("/cart");
  };

  const handleRelatedProductClick = (id) => {
    router.push(`/product/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  return (
    <>
      {/* Fixed Back Button at Top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2D1B4E] transition group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition" />
            <span className="text-sm font-medium">Back to Shopping</span>
          </button>
        </div>
      </div>

      {/* Main Content with padding to account for fixed header and footer */}
      <div className="pt-16 pb-0 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
          {/* Mobile Sticky Header with Category and Product Name */}
          <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm md:hidden -mx-4 px-4 py-3 mb-4">
            <div>
              <p className="text-xs text-[#2D1B4E] font-semibold">{product.category}</p>
              <h1 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - Images */}
            <div>
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {hasDiscount && (
                  <span className="absolute top-4 left-4 bg-orange-500 text-white text-sm px-3 py-1 rounded-lg font-bold">
                    -{discountPercent}%
                  </span>
                )}
                {!inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx
                        ? "border-[#2D1B4E]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div>
              <p className="text-sm font-semibold text-[#2D1B4E] mb-2 hidden md:block">
                {product.category}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 hidden md:block">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={parseFloat(averageRating)} size={18} />
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-500">
                  {reviews.length} reviews
                </span>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-500">
                  {product.stock} units in stock
                </span>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-400 line-through">
                      ₦{oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-sm text-green-600 mt-1">
                    You save ₦{(oldPrice - product.price).toLocaleString()} ({discountPercent}% off)
                  </p>
                )}
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience premium quality with the {product.name}. Designed for everyday use, 
                  this product combines durability with style. Whether you're at home, work, 
                  or on the go, it delivers exceptional performance that you can rely on.
                </p>
              </div>
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Premium quality materials for durability</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>1-year warranty included</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Free shipping on orders over ₦50,000</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>30-day money-back guarantee</span>
                  </li>
                </ul>
              </div>
              {inStock ? (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity
                    </label>
                    <QuantitySelector
                      quantity={quantity}
                      setQuantity={setQuantity}
                      stock={product.stock}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#2D1B4E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3d2568] transition active:scale-95"
                    >
                      <ShoppingCart size={20} />
                      {addedToCart ? "Added to Cart!" : "Add to Cart"}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition active:scale-95"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="flex items-center justify-center gap-2 border-2 border-gray-200 px-4 py-3 rounded-xl font-semibold hover:border-[#2D1B4E] transition active:scale-95"
                    >
                      <Heart
                        size={20}
                        className={isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"}
                      />
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-6 p-4 bg-red-50 rounded-xl text-center">
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                  <p className="text-sm text-red-500 mt-1">This product is currently unavailable</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck size={18} className="text-[#2D1B4E]" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck size={18} className="text-[#2D1B4E]" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RefreshCw size={18} className="text-[#2D1B4E]" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div id="reviews-section" className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Customer Reviews
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={parseFloat(averageRating)} size={20} />
                  <span className="text-sm text-gray-500">
                    Based on {reviews.length} reviews
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MessageCircle size={18} />
                <span>{reviews.length} comments</span>
              </div>
            </div>

            {/* Review Form */}
            <ReviewForm onSubmit={handleAddReview} />

            {/* Reviews List */}
            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <Review key={review.id} review={review} />
              ))}
            </div>

            {reviews.length > 3 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-[#2D1B4E] font-semibold hover:underline transition"
                >
                  {showAllReviews ? "Show Less" : `View All ${reviews.length} Reviews`}
                </button>
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-100 pb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <RelatedProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    onClick={handleRelatedProductClick}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <Footer />

      {/* Add to Cart Success Toast */}
      {addedToCart && (
        <div className="fixed bottom-20 md:bottom-8 right-4 z-50 animate-slide-up">
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">Added to cart successfully!</span>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}