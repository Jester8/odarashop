"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronLeft,
  X,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

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

function QuantitySelector({ quantity, setQuantity, stock }) {
  return (
    <div className="inline-flex items-center bg-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
        disabled={quantity <= 1}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 transition-colors"
      >
        <Minus size={12} className="text-gray-700" />
      </button>
      <span className="w-8 text-center text-sm font-bold text-gray-900">{quantity}</span>
      <button
        onClick={() => quantity < stock && setQuantity(quantity + 1)}
        disabled={quantity >= stock}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 transition-colors"
      >
        <Plus size={12} className="text-gray-700" />
      </button>
    </div>
  );
}

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const itemTotal = item.price * (item.quantity || 1);

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 last:border-0">
      <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={item.image || "/placeholder.jpg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link
              href={`/product/${item.id}`}
              className="text-sm md:text-base font-bold text-gray-900 hover:text-[#2D1B4E] transition line-clamp-2"
            >
              {item.name}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={parseFloat(item.rating || 4.5)} size={12} />
              <span className="text-[10px] text-gray-400">{item.rating || 4.5}</span>
            </div>
            <div className="mt-1.5">
              <span className="text-sm font-bold text-[#2D1B4E]">
                ₦{item.price.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500 transition p-1"
            aria-label="Remove item"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <QuantitySelector
            quantity={item.quantity || 1}
            setQuantity={(q) => onUpdateQuantity(item.id, q)}
            stock={99}
          />
          <span className="text-sm font-bold text-gray-900">
            ₦{itemTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ShoppingCart size={40} className="text-gray-300" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-sm">
        Looks like you haven&apos;t added any items to your cart yet.
      </p>
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-2 bg-[#2D1B4E] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#3d2568] transition"
      >
        Start Shopping <ArrowRight size={16} />
      </button>
    </div>
  );
}

function OrderSummary({ subtotal, shipping, tax, total, onCheckout }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 md:p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">
            {shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (7.5%)</span>
          <span className="font-medium text-gray-900">₦{tax.toLocaleString()}</span>
        </div>

        <div className="border-t border-gray-200 pt-3 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-xl font-black text-[#2D1B4E]">₦{total.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Inclusive of all taxes</p>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full mt-6 bg-orange-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition active:scale-95"
      >
        Proceed to Checkout
      </button>

      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-green-600" />
          <span className="text-[10px] text-gray-500">Secure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Truck size={14} className="text-blue-600" />
          <span className="text-[10px] text-gray-500">Free Shipping over ₦50k</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw size={14} className="text-purple-600" />
          <span className="text-[10px] text-gray-500">30-Day Returns</span>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = subtotal > 50000 ? 0 : 2500;
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      router.push("/checkout");
      setIsCheckingOut(false);
    }, 500);
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-12 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#2D1B4E] transition group text-sm font-medium"
          >
            <ChevronLeft size={17} className="group-hover:-translate-x-0.5 transition" />
            Back
          </button>
          <h1 className="text-sm font-bold text-gray-900">Your Cart</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="min-h-screen bg-white pb-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl">
                  <div className="hidden md:flex justify-between text-xs font-semibold text-gray-400 uppercase pb-3 border-b border-gray-100 mb-2 px-1">
                    <span className="flex-1">Product</span>
                    <span className="w-20 text-center">Quantity</span>
                    <span className="w-20 text-right">Total</span>
                    <span className="w-8" />
                  </div>

                  <div>
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Gift card or discount code"
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:border-[#2D1B4E] focus:ring-1 focus:ring-[#2D1B4E] outline-none"
                      />
                      <button className="px-4 py-2 text-sm font-semibold text-[#2D1B4E] border border-[#2D1B4E] rounded-xl hover:bg-[#2D1B4E] hover:text-white transition">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <OrderSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                  onCheckout={handleCheckout}
                />

                <p className="text-xs text-gray-400 text-center mt-4">
                  By completing your purchase, you agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isCheckingOut && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#2D1B4E] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-700">Redirecting to checkout...</p>
          </div>
        </div>
      )}
    </>
  );
}