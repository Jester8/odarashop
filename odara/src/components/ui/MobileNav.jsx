"use client";

import { Home, ShoppingCart, Heart, User, Grid3x3 } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { create } from "zustand";

// ─── Reuse the same store from Products (or import from a shared store file) ──
const useStore = create((set) => ({
  cart: [],
  wishlist: [],
}));

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Home",       icon: Home,         href: "/"         },
  { label: "Categories", icon: Grid3x3,      href: "/categories" },
  { label: "Cart",       icon: ShoppingCart, href: "/cart"     },
  { label: "Wishlist",   icon: Heart,        href: "/wishlist" },
  { label: "Profile",    icon: User,         href: "/profile"  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function MobileNav() {
  const pathname  = usePathname();
  const { cart, wishlist } = useStore();

  return (
    // md:hidden → renders only on screens smaller than 768px
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-pb">
      <div className="flex items-center justify-around px-2 pt-2 pb-2">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;
          
          // Badge counts
          const badgeCount =
            label === "Cart"
              ? cart.length
              : label === "Wishlist"
              ? wishlist.length
              : 0;

          return (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 active:scale-90 group"
            >
              {/* Icon wrapper */}
              <div className="relative">
                <div
                  className={`
                    flex items-center justify-center w-10 h-8 rounded-lg transition-all duration-200
                    ${isActive ? "bg-[#2D1B4E]/10" : "bg-transparent"}
                  `}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`transition-all duration-200 ${
                      isActive ? "text-[#2D1B4E]" : "text-gray-400"
                    }`}
                  />
                </div>

                {/* Badge */}
                {badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </div>

              {/* Label with underline on active */}
              <span
                className={`
                  text-[10px] font-medium transition-all duration-200 relative
                  ${isActive ? "text-[#2D1B4E] font-bold" : "text-gray-400"}
                `}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[#2D1B4E] rounded-full"></span>
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}