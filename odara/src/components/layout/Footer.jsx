// components/ui/Footer.jsx

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────
   LOGO
   ───────────────────────────────────────────── */

function OdaraLogo() {
  return (
    <Link href="/" className="inline-block mb-4">
      <Image
        src="/logo.png"
        alt="Odara"
        width={200}
        height={48}
        className="object-contain h-12 w-auto"
        priority
      />
    </Link>
  );
}

/* ─────────────────────────────────────────────
   SOCIAL ICONS
   ───────────────────────────────────────────── */

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.19 8.19 0 0 0 4.78 1.52V7.12a4.85 4.85 0 0 1-1.01-.43z" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────
   PAYMENT METHOD ICONS  (inline SVG — no /public files needed)
   ───────────────────────────────────────────── */

function VisaIcon() {
  return (
    <svg viewBox="0 0 60 20" height="18" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="17" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="900" fontStyle="italic" fill="#1a1f71">
        VISA
      </text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 48 30" height="28" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="15" r="13" fill="#EB001B" />
      <circle cx="30" cy="15" r="13" fill="#F79E1B" />
      <path d="M24 4.8a13 13 0 0 1 0 20.4A13 13 0 0 1 24 4.8z" fill="#FF5F00" />
    </svg>
  );
}

function VerveIcon() {
  return (
    <svg viewBox="0 0 70 22" height="22" xmlns="http://www.w3.org/2000/svg">
      <rect width="70" height="22" rx="4" fill="#025B9B" />
      <text x="8" y="16" fontFamily="Arial Black, sans-serif" fontSize="11" fontWeight="900" fill="white">
        Verve
      </text>
      <rect x="48" y="5" width="4" height="12" rx="1" fill="#F7941D" />
      <rect x="55" y="5" width="4" height="12" rx="1" fill="#F7941D" />
      <rect x="62" y="5" width="4" height="12" rx="1" fill="#F7941D" />
    </svg>
  );
}

function PaystackIcon() {
  return (
    <svg viewBox="0 0 100 22" height="22" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="10" fill="#00C3F7" />
      <path d="M6 14 L11 7 L16 14" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="26" y="16" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill="#011B33">Pay</text>
      <text x="47" y="16" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill="#00C3F7">stack</text>
    </svg>
  );
}

function FlutterwaveIcon() {
  return (
    <svg viewBox="0 0 120 24" height="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16 Q8 8 12 12 Q16 16 20 8" stroke="#F5A623" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M4 19 Q8 11 12 15 Q16 19 20 11" stroke="#FF6B00" strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="26" y="17" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" fill="#1a1a1a">
        Flutterwave
      </text>
    </svg>
  );
}




const PAYMENT_METHODS = [
  { name: "Visa", icon: <VisaIcon /> },
  { name: "Mastercard", icon: <MastercardIcon /> },
  { name: "Verve", icon: <VerveIcon /> },
  { name: "Paystack", icon: <PaystackIcon /> },
  { name: "Flutterwave", icon: <FlutterwaveIcon /> },
 
];

/* ─────────────────────────────────────────────
   LINK DATA
   ───────────────────────────────────────────── */

const SHOP_LINKS = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Electronics", href: "/category/electronics" },
  { label: "Fashion", href: "/category/fashion" },
  { label: "Home & Living", href: "/category/home" },
  { label: "Beauty", href: "/category/beauty" },
  { label: "Phones & Tablets", href: "/category/phones" },
  { label: "Sports", href: "/category/sports" },
  { label: "Groceries", href: "/category/groceries" },
  { label: "Baby Products", href: "/category/baby" },
  { label: "Health", href: "/category/health" },
];

const ACCOUNT_LINKS = [
  { label: "My Account", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Track Order", href: "/track" },
  { label: "Saved Items", href: "/saved" },
  { label: "Returns", href: "/returns" },
  { label: "Recently Viewed", href: "/recent" },
];

const SUPPORT_LINKS = [
  { label: "Help Centre", href: "/help" },
  { label: "Live Chat", href: "/chat" },
  { label: "Shipping Info", href: "/shipping" },
  { label: "Refund Policy", href: "/refunds" },
  { label: "Payment Methods", href: "/payments" },
  { label: "Contact Support", href: "/contact" },
];

const COMPANY_LINKS = [
  { label: "About Odara", href: "/about" },
  { label: "Sell on Odara", href: "/sell" },
  { label: "Become Vendor", href: "/vendor" },
  { label: "Careers", href: "/careers" },
  { label: "Affiliate Program", href: "/affiliate" },
  { label: "Press", href: "/press" },
];

const LEGAL_LINKS = [
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
];

/* ─────────────────────────────────────────────
   REUSABLE LINK GROUP
   ───────────────────────────────────────────── */

function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h4 className="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-4">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="group flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition"
            >
              <ChevronRight
                size={12}
                className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-orange-500"
              />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN FOOTER
   ───────────────────────────────────────────── */

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-16 mb-16 md:mb-0">

      {/* ── MAIN GRID ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          {/* BRAND */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <OdaraLogo />

            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Africa's marketplace for authentic African products — by Africans, for Africans.
            </p>

            <ul className="space-y-3 mb-5">
              <li className="flex gap-2 text-sm text-gray-500">
                <MapPin size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                Ibadan, Nigeria
              </li>
              <li className="flex gap-2 text-sm text-gray-500">
                <Phone size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                +234 900 000 0000
              </li>
              <li className="flex gap-2 text-sm text-gray-500">
                <Mail size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                support@odara.com.ng
              </li>
            </ul>

          

            {/* Social */}
            <div className="flex gap-2 mt-5">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  title={item.label}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-300 transition"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <FooterLinkGroup title="Shop" links={SHOP_LINKS} />
          <FooterLinkGroup title="Account" links={ACCOUNT_LINKS} />
          <FooterLinkGroup title="Support" links={SUPPORT_LINKS} />
          <FooterLinkGroup title="Company" links={COMPANY_LINKS} />
        </div>
      </div>

      {/* ── PAYMENTS ── */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">
            Accepted Payments
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.name}
                title={method.name}
                className="h-10 px-3 bg-transparent  flex items-center justify-center"
              >
                {method.icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ── */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {year}{" "}
            <span className="font-semibold text-orange-500">Odara Marketplace Ltd.</span>{" "}
            All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs text-gray-400 hover:text-orange-500 transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-5">
          <p className="text-[10px] text-gray-300 leading-relaxed">
            Odara connects African sellers with African buyers through a trusted marketplace
            focused only on African-made products.
          </p>
        </div>
      </div>

    </footer>
  );
}