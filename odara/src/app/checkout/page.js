"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Truck,
  ShieldCheck,
  RefreshCw,
  CreditCard,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { useUser } from "@/lib/firebase/useAuth";

// Payment provider scripts
const loadFlutterwaveScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("flutterwave-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "flutterwave-script";
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
};

const loadPaystackScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("paystack-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "paystack-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
};

function CheckoutSteps({ currentStep }) {
  const steps = [
    { id: 1, name: "Cart", path: "/cart" },
    { id: 2, name: "Information", path: "/checkout" },
    { id: 3, name: "Payment", path: "/checkout/payment" },
    { id: 4, name: "Complete", path: "/checkout/complete" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${currentStep >= step.id
                    ? "bg-[#2D1B4E] text-white"
                    : "bg-gray-200 text-gray-500"
                  }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle size={16} />
                ) : (
                  step.id
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1 hidden md:block">{step.name}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-px bg-gray-200 mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CartSummary({ cartItems }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = subtotal > 50000 ? 0 : 2500;
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gray-50 rounded-2xl p-5 md:p-6 sticky top-24">
      <h3 className="text-base font-bold text-gray-900 mb-4">Order Summary</h3>

      <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3 text-sm">
            <div className="relative w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-gray-500 text-xs">Qty: {item.quantity || 1}</p>
            </div>
            <p className="font-medium text-gray-900">
              ₦{((item.price * (item.quantity || 1))).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-3 border-t border-gray-200">
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
        </div>
      </div>
    </div>
  );
}

function PaymentMethodSelector({ selectedMethod, onSelect }) {
  const methods = [
    {
      id: "card",
      name: "Credit / Debit Card",
      icon: CreditCard,
      description: "Pay with your card securely",
    },
    {
      id: "transfer",
      name: "Bank Transfer",
      icon: Building2,
      description: "Pay via bank transfer",
    },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-700 mb-1">Payment Method</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`p-4 border-2 rounded-xl text-left transition-all
                ${selectedMethod === method.id
                  ? "border-[#2D1B4E] bg-[#2D1B4E]/5"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${selectedMethod === method.id ? "bg-[#2D1B4E]" : "bg-gray-100"}`}>
                  <Icon size={20} className={selectedMethod === method.id ? "text-white" : "text-gray-600"} />
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${selectedMethod === method.id ? "text-black" : "text-gray-900"}`}>
                    {method.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BankTransferInfo({ total, onBack }) {
  const [copied, setCopied] = useState(false);

  const bankDetails = {
    bankName: "First Bank of Nigeria",
    accountName: "Odara Shop Limited",
    accountNumber: "1234567890",
    sortCode: "011234567",
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-900">Important Payment Information</p>
            <p className="text-xs text-blue-700 mt-1">
              Please complete your transfer within 24 hours. Your order will be processed once payment is confirmed.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Amount to Pay</p>
          <p className="text-2xl font-black text-[#2D1B4E]">₦{total.toLocaleString()}</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-600">Bank Name</label>
            <div className="flex items-center justify-between mt-1 p-2 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-black">{bankDetails.bankName}</span>
              <button
                onClick={() => copyToClipboard(bankDetails.bankName)}
                className="text-xs text-[#2D1B4E] hover:text-[#3d2568] font-medium"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600">Account Name</label>
            <div className="flex items-center justify-between mt-1 p-2 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-black">{bankDetails.accountName}</span>
              <button
                onClick={() => copyToClipboard(bankDetails.accountName)}
                className="text-xs text-[#2D1B4E] hover:text-[#3d2568] font-medium"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600">Account Number</label>
            <div className="flex items-center justify-between mt-1 p-2 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-black">{bankDetails.accountNumber}</span>
              <button
                onClick={() => copyToClipboard(bankDetails.accountNumber)}
                className="text-xs text-[#2D1B4E] hover:text-[#3d2568] font-medium"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600">Sort Code</label>
            <div className="flex items-center justify-between mt-1 p-2 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-black">{bankDetails.sortCode}</span>
              <button
                onClick={() => copyToClipboard(bankDetails.sortCode)}
                className="text-xs text-[#2D1B4E] hover:text-[#3d2568] font-medium"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {copied && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            <p className="text-sm text-green-700">Copied to clipboard!</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-black hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={() => window.location.href = "/orders/confirm"}
          className="flex-1 px-4 py-2.5 bg-[#2D1B4E] text-white rounded-xl text-sm font-bold hover:bg-[#3d2568] transition"
        >
          I've Made the Transfer
        </button>
      </div>
    </div>
  );
}

function CardPayment({ total, email, name, onSuccess, onError }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState("flutterwave"); // 'flutterwave' or 'paystack'

  const initializeFlutterwavePayment = async () => {
    await loadFlutterwaveScript();
    
    const FlutterwaveCheckout = window.FlutterwaveCheckout;
    
    FlutterwaveCheckout({
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: total,
      currency: "NGN",
      payment_options: "card",
      customer: {
        email: email,
        name: name,
      },
      customizations: {
        title: "Odara Shop",
        description: "Payment for order",
        logo: "/logo.png",
      },
      callback: (response) => {
        if (response.status === "successful") {
          onSuccess(response);
        } else {
          onError("Payment failed or was cancelled");
        }
        setIsProcessing(false);
      },
      onclose: () => {
        setIsProcessing(false);
      },
    });
  };

  const initializePaystackPayment = async () => {
    await loadPaystackScript();
    
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: total * 100, // Paystack uses kobo
      currency: "NGN",
      ref: `paystack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: name,
          },
        ],
      },
      callback: (response) => {
        if (response.status === "success") {
          onSuccess(response);
        } else {
          onError("Payment failed or was cancelled");
        }
        setIsProcessing(false);
      },
      onClose: () => {
        setIsProcessing(false);
      },
    });
    
    handler.openIframe();
  };

  const handlePayment = () => {
    setIsProcessing(true);
    if (paymentProvider === "flutterwave") {
      initializeFlutterwavePayment();
    } else {
      initializePaystackPayment();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setPaymentProvider("flutterwave")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all
            ${paymentProvider === "flutterwave"
              ? "bg-[#2D1B4E] text-white"
              : "bg-gray-100 text-black hover:bg-gray-200"
            }`}
        >
          Flutterwave
        </button>
        <button
          onClick={() => setPaymentProvider("paystack")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all
            ${paymentProvider === "paystack"
              ? "bg-[#2D1B4E] text-white"
              : "bg-gray-100 text-black hover:bg-gray-200"
            }`}
        >
          Paystack
        </button>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="text-center mb-4">
          <CreditCard size={40} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            You will be redirected to {paymentProvider === "flutterwave" ? "Flutterwave" : "Paystack"} secure payment gateway
          </p>
          <p className="text-xs text-gray-500 mt-1">Amount: ₦{total.toLocaleString()}</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-3 bg-[#2D1B4E] text-white rounded-xl text-sm font-bold hover:bg-[#3d2568] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `Pay ₦${total.toLocaleString()}`
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Your payment is secured by {paymentProvider === "flutterwave" ? "Flutterwave" : "Paystack"}
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { user, loading: authLoading } = useUser();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (cartItems.length === 0 && !authLoading) {
      router.push("/cart");
    }
  }, [cartItems, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
      }));
    }
  }, [user]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = subtotal > 50000 ? 0 : 2500;
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentSuccess = async (response) => {
    setIsProcessing(true);
    try {
      // Here you would send the payment details to your backend
      console.log("Payment successful:", response);
      
      // Clear cart and redirect to order confirmation
      clearCart();
      router.push("/orders/confirmation");
    } catch (error) {
      console.error("Error processing order:", error);
      alert("There was an error processing your order. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    alert(error || "Payment failed. Please try again.");
    setIsProcessing(false);
  };

  const handleSubmitOrder = () => {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address) {
      alert("Please fill in all required fields");
      return;
    }

    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    // For card payment, the payment modal will handle it
    if (selectedPayment === "card") {
      // Card payment handled by the component
      return;
    }
  };

  if (authLoading || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#2D1B4E] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-12 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-black hover:text-[#2D1B4E] transition group text-sm font-medium"
          >
            <ChevronLeft size={17} className="group-hover:-translate-x-0.5 transition" />
            Back
          </button>
          <h1 className="text-sm font-bold text-black">Checkout</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="min-h-screen bg-white pb-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <CheckoutSteps currentStep={2} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
                <h2 className="text-lg font-bold text-black mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2D1B4E] focus:ring-1 focus:ring-[#2D1B4E] outline-none text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2D1B4E] focus:ring-1 focus:ring-[#2D1B4E] outline-none text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2D1B4E] focus:ring-1 focus:ring-[#2D1B4E] outline-none text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2D1B4E] focus:ring-1 focus:ring-[#2D1B4E] outline-none text-black"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2D1B4E] focus:ring-1 focus:ring-[#2D1B4E] outline-none text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2D1B4E] focus:ring-1 focus:ring-[#2D1B4E] outline-none text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2D1B4E] focus:ring-1 focus:ring-[#2D1B4E] outline-none text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2D1B4E] focus:ring-1 focus:ring-[#2D1B4E] outline-none text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
                <h2 className="text-lg font-bold text-black mb-4">Payment Method</h2>
                <PaymentMethodSelector
                  selectedMethod={selectedPayment}
                  onSelect={setSelectedPayment}
                />

                {selectedPayment === "card" && (
                  <div className="mt-4">
                    <CardPayment
                      total={total}
                      email={formData.email}
                      name={`${formData.firstName} ${formData.lastName}`}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                )}

                {selectedPayment === "transfer" && (
                  <div className="mt-4">
                    <BankTransferInfo
                      total={total}
                      onBack={() => setSelectedPayment(null)}
                    />
                  </div>
                )}
              </div>

              {/* Order Button for Transfer */}
              {selectedPayment === "transfer" && (
                <button
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#2D1B4E] text-white rounded-xl text-sm font-bold hover:bg-[#3d2568] transition disabled:opacity-60"
                >
                  Place Order
                </button>
              )}
            </div>

            <div>
              <CartSummary cartItems={cartItems} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}