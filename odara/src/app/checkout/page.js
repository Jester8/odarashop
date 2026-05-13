"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Truck,
  ShieldCheck,
  RefreshCw,
  CheckCircle,
  MapPin,
  CreditCard,
  Package,
  User,
  Phone,
  Mail,
  Home,
  Building2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { create } from "zustand";
import { auth, db } from "@/lib/firebase/firebase";
import { doc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const useStore = create((set) => ({
  cart: [],
  clearCart: () => {
    set({ cart: [] });
    localStorage.removeItem("odara_cart");
  },
  setCart: (items) => set({ cart: items }),
}));

function StarRating({ rating, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < Math.floor(rating) ? "#F59E0B" : "#E5E7EB"}
          className={i < Math.floor(rating) ? "text-amber-400" : "text-gray-200"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function OrderSummary({ subtotal, shipping, tax, total, items }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 md:p-6 sticky top-24">
      <h3 className="text-base font-bold text-gray-900 mb-4">Order Summary</h3>

      <div className="max-h-48 overflow-y-auto mb-4 space-y-2 pr-2">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex gap-2 text-sm">
            <div className="w-8 h-8 bg-gray-200 rounded-md flex-shrink-0">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover rounded-md"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
              <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
            </div>
            <span className="text-xs font-medium text-gray-900">
              ₦{(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
        {items.length > 3 && (
          <p className="text-[10px] text-gray-400 text-center pt-1">
            +{items.length - 3} more items
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
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
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <ShieldCheck size={14} className="text-green-600" />
          <span>Secure checkout • SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
}

function DeliveryForm({ formData, setFormData, errors }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                  : "border-gray-200 focus:border-[#2D1B4E] focus:ring-[#2D1B4E]/10"
              }`}
              placeholder="John Doe"
            />
          </div>
          {errors.fullName && (
            <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 transition-all ${
                errors.phone
                  ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                  : "border-gray-200 focus:border-[#2D1B4E] focus:ring-[#2D1B4E]/10"
              }`}
              placeholder="+234 800 000 0000"
            />
          </div>
          {errors.phone && (
            <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 transition-all ${
              errors.email
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-[#2D1B4E] focus:ring-[#2D1B4E]/10"
            }`}
            placeholder="you@example.com"
          />
        </div>
        {errors.email && (
          <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
          Street Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Home size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 transition-all ${
              errors.address
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-[#2D1B4E] focus:ring-[#2D1B4E]/10"
            }`}
            placeholder="12 Adeola Odeku Street"
          />
        </div>
        {errors.address && (
          <p className="text-[10px] text-red-500 mt-1">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 transition-all ${
              errors.city
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-[#2D1B4E] focus:ring-[#2D1B4E]/10"
            }`}
            placeholder="Lagos"
          />
          {errors.city && (
            <p className="text-[10px] text-red-500 mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 transition-all bg-white ${
              errors.state
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-[#2D1B4E] focus:ring-[#2D1B4E]/10"
            }`}
          >
            <option value="">Select State</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
            <option value="Rivers">Rivers</option>
            <option value="Oyo">Oyo</option>
            <option value="Kano">Kano</option>
            <option value="Other">Other</option>
          </select>
          {errors.state && (
            <p className="text-[10px] text-red-500 mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
            ZIP Code
          </label>
          <input
            type="text"
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#2D1B4E] focus:ring-2 focus:ring-[#2D1B4E]/10 transition-all"
            placeholder="100001"
          />
        </div>
      </div>
    </div>
  );
}

function PaymentMethod({ selected, onSelect }) {
  const methods = [
    { id: "card", name: "Credit / Debit Card", icon: "💳", description: "Pay with Visa, Mastercard, Verve" },
    { id: "bank", name: "Bank Transfer", icon: "🏦", description: "Direct bank transfer" },
    { id: "wallet", name: "Digital Wallet", icon: "📱", description: "Pay with PayPal, Flutterwave" },
    { id: "cod", name: "Cash on Delivery", icon: "💰", description: "Pay when you receive" },
  ];

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <label
          key={method.id}
          className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
            selected === method.id
              ? "border-[#2D1B4E] bg-[#F7F5FF]"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={method.id}
            checked={selected === method.id}
            onChange={() => onSelect(method.id)}
            className="mt-0.5 accent-[#2D1B4E]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{method.icon}</span>
              <span className="text-sm font-bold text-gray-900">{method.name}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">{method.description}</p>
          </div>
        </label>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, setCart } = useStore();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    const savedCart = localStorage.getItem("odara_cart");
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      setCart(parsed);
    }
    if (cart.length === 0 && !savedCart) {
      router.push("/products");
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email || "");
        setFormData(prev => ({
          ...prev,
          email: user.email || "",
          fullName: user.displayName || prev.fullName,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 2500;
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + shipping + tax;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);

    try {
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const orderData = {
        orderId: orderId,
        userId: userId || "guest",
        customerInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          rating: item.rating,
        })),
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (userId) {
        await setDoc(doc(db, "users", userId, "orders", orderId), orderData);
      } else {
        await addDoc(collection(db, "guestOrders"), orderData);
      }

      setOrderNumber(orderId);
      setOrderPlaced(true);
      clearCart();
      
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 text-sm mb-1">Order Number: <span className="font-bold text-[#2D1B4E]">{orderNumber}</span></p>
          <p className="text-gray-500 text-sm mb-6">Thank you for shopping with Odara. We'll notify you when your order ships.</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/products")}
              className="w-full bg-[#2D1B4E] text-white py-3 rounded-xl font-bold hover:bg-[#3d2568] transition flex items-center justify-center gap-2"
            >
              Continue Shopping <ArrowRight size={16} />
            </button>
            {userId && (
              <Link href="/orders" className="block text-sm text-[#2D1B4E] font-semibold hover:underline">
                View My Orders
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={40} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-6">Add items to proceed to checkout</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-[#2D1B4E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#3d2568] transition"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#2D1B4E] transition group text-sm font-medium"
          >
            <ChevronLeft size={17} className="group-hover:-translate-x-0.5 transition" />
            Back to Cart
          </button>
        
          <div className="w-16" />
        </div>
      </div>

      <div className="min-h-screen bg-white pb-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-[#2D1B4E]" />
                  Delivery Information
                </h2>
                <DeliveryForm formData={formData} setFormData={setFormData} errors={errors} />
              </div>

              <div className="bg-white rounded-2xl">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-[#2D1B4E]" />
                  Payment Method
                </h2>
                <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />
              </div>

              <div className="block lg:hidden">
                <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} items={cart} />
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold text-base hover:bg-orange-600 transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order • ₦{total.toLocaleString()}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400">
                <div className="flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <RefreshCw size={12} />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck size={12} />
                  <span>Free Shipping over ₦50k</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} items={cart} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}