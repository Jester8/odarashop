"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ChevronRight, ChevronLeft } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useUser } from '@/lib/firebase/useAuth';
import { useCart } from '@/lib/context/CartContext';

const FlagNG = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" style={{ borderRadius: 3, flexShrink: 0 }}>
    <rect width="20" height="20" fill="#fff" />
    <rect width="6.67" height="20" fill="#008751" />
    <rect x="13.33" width="6.67" height="20" fill="#008751" />
  </svg>
);

const FlagGB = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 60 40" style={{ borderRadius: 3, flexShrink: 0 }}>
    <rect width="60" height="40" fill="#012169" />
    <path d="M0,0 L60,40 M60,0 L40,20" stroke="#fff" strokeWidth="8" />
    <path d="M0,0 L60,40 M60,0 L40,20" stroke="#C8102E" strokeWidth="4" />
    <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="12" />
    <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
  </svg>
);

const FlagIcon = ({ code, size = 20 }) => {
  if (code === 'en') return <FlagGB size={size} />;
  return <FlagNG size={size} />;
};

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'yo', label: 'YO', name: 'Yorùbá' },
  { code: 'ha', label: 'HA', name: 'Hausa' },
  { code: 'ig', label: 'IG', name: 'Igbo' },
];

const CATEGORIES = [
  {
    label: 'Fashion & Apparel', icon: '👗', href: '/category/fashion-apparel',
    subcategories: [
      { label: 'Traditional Clothing', icon: '👘', href: '/category/fashion-apparel/traditional' },
      { label: 'Contemporary African Fashion', icon: '👔', href: '/category/fashion-apparel/contemporary' },
      { label: 'Footwear', icon: '👟', href: '/category/fashion-apparel/footwear' },
      { label: 'Accessories', icon: '💍', href: '/category/fashion-apparel/accessories' },
      { label: 'Bags & Purses', icon: '👜', href: '/category/fashion-apparel/bags' },
    ],
  },
  {
    label: 'Arts & Crafts', icon: '🎨', href: '/category/arts-crafts',
    subcategories: [
      { label: 'Sculptures & Carvings', icon: '🗿', href: '/category/arts-crafts/sculptures' },
      { label: 'Paintings & Prints', icon: '🖼️', href: '/category/arts-crafts/paintings' },
      { label: 'Textile Art', icon: '🧵', href: '/category/arts-crafts/textile' },
      { label: 'Pottery & Ceramics', icon: '🏺', href: '/category/arts-crafts/pottery' },
      { label: 'Beadwork', icon: '📿', href: '/category/arts-crafts/beadwork' },
    ],
  },
  {
    label: 'Jewelry', icon: '💎', href: '/category/jewelry',
    subcategories: [
      { label: 'Beaded Jewelry', icon: '📿', href: '/category/jewelry/beaded' },
      { label: 'Metalwork', icon: '⚜️', href: '/category/jewelry/metalwork' },
      { label: 'Natural Materials', icon: '🌿', href: '/category/jewelry/natural' },
      { label: 'Statement Pieces', icon: '✨', href: '/category/jewelry/statement' },
      { label: 'Custom Designs', icon: '✏️', href: '/category/jewelry/custom' },
    ],
  },
  {
    label: 'Food & Beverages', icon: '🍲', href: '/category/food-beverages',
    subcategories: [
      { label: 'Spices & Seasonings', icon: '🌶️', href: '/category/food-beverages/spices' },
      { label: 'Packaged Foods', icon: '📦', href: '/category/food-beverages/packaged' },
      { label: 'Beverages', icon: '🍵', href: '/category/food-beverages/beverages' },
      { label: 'Snacks', icon: '🍪', href: '/category/food-beverages/snacks' },
      { label: 'Preserves & Sauces', icon: '🥫', href: '/category/food-beverages/preserves' },
    ],
  },
  {
    label: 'Beauty & Personal Care', icon: '💄', href: '/category/beauty-personal-care',
    subcategories: [
      { label: 'Skincare', icon: '🧴', href: '/category/beauty-personal-care/skincare' },
      { label: 'Haircare', icon: '💇', href: '/category/beauty-personal-care/haircare' },
      { label: 'Cosmetics', icon: '💄', href: '/category/beauty-personal-care/cosmetics' },
      { label: 'Bath & Body', icon: '🛁', href: '/category/beauty-personal-care/bath-body' },
      { label: "Men's Grooming", icon: '🧔', href: '/category/beauty-personal-care/mens-grooming' },
    ],
  },
  {
    label: 'Home & Living', icon: '🏠', href: '/category/home-living',
    subcategories: [
      { label: 'Furniture', icon: '🛋️', href: '/category/home-living/furniture' },
      { label: 'Textiles', icon: '🪡', href: '/category/home-living/textiles' },
      { label: 'Kitchenware', icon: '🍳', href: '/category/home-living/kitchenware' },
      { label: 'Decor Accents', icon: '🖼️', href: '/category/home-living/decor' },
      { label: 'Storage & Organization', icon: '📦', href: '/category/home-living/storage' },
    ],
  },
  {
    label: 'Health & Wellness', icon: '💊', href: '/category/health-wellness',
    subcategories: [
      { label: 'Herbal Remedies', icon: '🌿', href: '/category/health-wellness/herbal' },
      { label: 'Essential Oils', icon: '🫙', href: '/category/health-wellness/essential-oils' },
      { label: 'Wellness Teas', icon: '🍵', href: '/category/health-wellness/teas' },
      { label: 'Natural Supplements', icon: '💊', href: '/category/health-wellness/supplements' },
      { label: 'Aromatherapy', icon: '🕯️', href: '/category/health-wellness/aromatherapy' },
    ],
  },
  {
    label: 'Literature & Stationery', icon: '📚', href: '/category/literature-stationery',
    subcategories: [
      { label: 'Books', icon: '📖', href: '/category/literature-stationery/books' },
      { label: 'Journals & Notebooks', icon: '📓', href: '/category/literature-stationery/journals' },
      { label: 'Stationery', icon: '✏️', href: '/category/literature-stationery/stationery' },
      { label: 'Educational Materials', icon: '🎓', href: '/category/literature-stationery/educational' },
      { label: 'Art Prints', icon: '🖼️', href: '/category/literature-stationery/art-prints' },
    ],
  },
  {
    label: 'Music & Instruments', icon: '🎵', href: '/category/music-instruments',
    subcategories: [
      { label: 'Traditional Instruments', icon: '🥁', href: '/category/music-instruments/traditional' },
      { label: 'Modern Instruments', icon: '🎸', href: '/category/music-instruments/modern' },
      { label: 'Music Accessories', icon: '🎧', href: '/category/music-instruments/accessories' },
      { label: 'Music & Audio', icon: '💿', href: '/category/music-instruments/audio' },
      { label: 'Instructional Materials', icon: '📘', href: '/category/music-instruments/instructional' },
    ],
  },
  {
    label: 'Technology', icon: '📱', href: '/category/technology',
    subcategories: [
      { label: 'Smartphones & Accessories', icon: '📱', href: '/category/technology/smartphones' },
      { label: 'Wearable Tech', icon: '⌚', href: '/category/technology/wearables' },
      { label: 'Gadgets & Electronics', icon: '💡', href: '/category/technology/gadgets' },
      { label: 'EdTech Tools', icon: '📚', href: '/category/technology/edtech' },
      { label: 'Software & Apps', icon: '💻', href: '/category/technology/software' },
    ],
  },
];

const DefaultAvatarIcon = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="14" cy="14" r="14" fill="#2D1B4E" />
    <circle cx="14" cy="11" r="4" fill="white" fillOpacity="0.9" />
    <path
      d="M6 24c0-4.418 3.582-8 8-8s8 3.582 8 8"
      stroke="white"
      strokeOpacity="0.9"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

function MegaMenu({ category, visible }) {
  if (!category) return null;
  return (
    <div className={`absolute left-0 right-0 top-full z-[200] transition-all duration-200 ease-out ${
      visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
    }`}>
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#2D1B4E] to-transparent opacity-10" />
      <div className="bg-white shadow-2xl shadow-[rgba(45,27,78,0.12)] border-b border-[#F0EEF4]">
        <div className="max-w-[1280px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{category.icon}</span>
              <h3 className="text-[0.9rem] font-extrabold text-[#2D1B4E] tracking-tight">{category.label}</h3>
            </div>
            <Link href={category.href} className="text-[0.75rem] font-bold text-[#2D1B4E] hover:underline flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
              View all
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {category.subcategories.map((sub, i) => (
              <Link key={sub.href} href={sub.href} style={{ animationDelay: `${i * 18}ms` }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[0.8125rem] font-semibold text-[#374151] hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-all group animate-[megaFadeIn_0.22s_ease_both]">
                <span className="text-[15px] w-7 h-7 flex items-center justify-center bg-[#F8F6FF] rounded-lg group-hover:bg-[#EDE9FF] transition-colors flex-shrink-0">
                  {sub.icon}
                </span>
                <span className="leading-tight">{sub.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountButton({ user, profile, onLogout, isMobile = false }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const firstName = (profile?.fullName || user?.displayName || '').split(' ')[0];

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) {
    if (isMobile) {
      return (
        <Link href="/login" className="flex items-center justify-center w-10 h-10 text-[#2D1B4E] rounded-lg hover:bg-[#F5F3FF] transition-all">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M5 20a7 7 0 0 1 14 0" />
          </svg>
        </Link>
      );
    }
    return (
      <Link href="/login" className="flex flex-col items-center gap-0.5 text-[#2D1B4E] px-2 py-1.5 rounded-lg hover:bg-[#F5F3FF] transition-all">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
        <span className="text-[0.6rem] font-extrabold tracking-widest uppercase text-[#2D1B4E]">Account</span>
      </Link>
    );
  }

  const avatarLetter = firstName?.[0]?.toUpperCase();

  const Avatar = ({ size = 28 }) => {
    if (user.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt={firstName}
          width={size}
          height={size}
          className="rounded-full object-cover flex-shrink-0"
          style={{ width: size, height: size }}
        />
      );
    }
    if (avatarLetter) {
      return (
        <div
          className="rounded-full bg-[#2D1B4E] flex items-center justify-center flex-shrink-0"
          style={{ width: size, height: size }}
        >
          <span className="text-white font-extrabold" style={{ fontSize: size * 0.36 }}>
            {avatarLetter}
          </span>
        </div>
      );
    }
    return <DefaultAvatarIcon size={size} />;
  };

  if (isMobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center justify-center w-10 h-10 text-[#2D1B4E] rounded-lg hover:bg-[#F5F3FF] transition-all"
          aria-label="Account menu"
        >
          <Avatar size={28} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-[200px] bg-white border border-[#EDE9F6] rounded-xl shadow-xl z-[999] overflow-hidden animate-[nb-dropIn_0.15s_ease]">
            <MiniDropdown firstName={firstName} onLogout={onLogout} router={router} setDropdownOpen={setDropdownOpen} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex flex-col items-center gap-0.5 text-[#2D1B4E] px-2 py-1.5 rounded-lg hover:bg-[#F5F3FF] transition-all"
        aria-label="Account menu"
      >
        <Avatar size={26} />
        <span className="text-[0.6rem] font-extrabold tracking-widest uppercase text-[#2D1B4E] max-w-[64px] truncate leading-none">
          Hi, {firstName || 'You'}
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-[200px] bg-white border border-[#EDE9F6] rounded-xl shadow-xl z-[999] overflow-hidden animate-[nb-dropIn_0.15s_ease]">
          <MiniDropdown firstName={firstName} onLogout={onLogout} router={router} setDropdownOpen={setDropdownOpen} />
        </div>
      )}
    </div>
  );
}

function MiniDropdown({ firstName, onLogout, router, setDropdownOpen }) {
  const items = [
    { label: 'My Profile', icon: '👤', href: '/profile' },
    { label: 'My Orders', icon: '📦', href: '/orders' },
    { label: 'Wishlist', icon: '❤️', href: '/wishlist' },
    { label: 'Settings', icon: '⚙️', href: '/settings' },
  ];

  return (
    <>
      <div className="px-4 py-3 border-b border-[#F0EEF4] bg-[#FAFAFC]">
        <p className="text-[0.65rem] font-bold text-[#B0A8C8] uppercase tracking-wider">Welcome back</p>
        <p className="text-[0.88rem] font-extrabold text-[#2D1B4E] truncate">{firstName || 'there'}</p>
      </div>

      {items.map((item, i) => (
        <div key={item.href}>
          <button
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[0.82rem] font-semibold text-[#374151] hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors text-left"
            onClick={() => { router.push(item.href); setDropdownOpen(false); }}
          >
            <span className="text-sm">{item.icon}</span>
            {item.label}
          </button>
          {i < items.length - 1 && <div className="h-px bg-[#F3F4F6] mx-3" />}
        </div>
      ))}

      <div className="border-t border-[#F0EEF4]">
        <button
          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[0.82rem] font-semibold text-[#C0392B] hover:bg-[#FFF0F0] transition-colors"
          onClick={onLogout}
        >
          <span className="text-sm">🚪</span>
          Sign Out
        </button>
      </div>
    </>
  );
}

const Navbar = () => {
  const router = useRouter();
  const { user, profile } = useUser();
  const { cartCount } = useCart();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerLangOpen, setDrawerLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [mobileSubDrawerOpen, setMobileSubDrawerOpen] = useState(false);
  const [selectedMobileCategory, setSelectedMobileCategory] = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);
  const [pinnedCat, setPinnedCat] = useState(null);
  const hoverTimerRef = useRef(null);
  const megaMenuRef = useRef(null);
  const categoryBarRef = useRef(null);
  const langDropdownRef = useRef(null);
  const langButtonRef = useRef(null);

  const activeCatLabel = pinnedCat ?? hoveredCat;
  const activeCat = CATEGORIES.find(c => c.label === activeCatLabel) ?? null;
  const megaVisible = !!activeCatLabel;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onOutside = (e) => {
      if (
        langDropdownRef.current && !langDropdownRef.current.contains(e.target) &&
        langButtonRef.current && !langButtonRef.current.contains(e.target)
      ) setIsLangDropdownOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  useEffect(() => {
    const onOutside = (e) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setPinnedCat(null);
        setHoveredCat(null);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen || mobileSubDrawerOpen ? 'hidden' : 'unset';
    if (!isDrawerOpen) setDrawerLangOpen(false);
    if (!mobileSubDrawerOpen) setSelectedMobileCategory(null);
    return () => { document.body.style.overflow = 'unset'; };
  }, [isDrawerOpen, mobileSubDrawerOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) console.log('Search:', searchQuery);
  };

  const handleCatMouseEnter = (label) => {
    clearTimeout(hoverTimerRef.current);
    setHoveredCat(label);
  };

  const handleCatMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => setHoveredCat(null), 120);
  };

  const handleMegaMouseEnter = () => clearTimeout(hoverTimerRef.current);

  const handleMegaMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => setHoveredCat(null), 120);
  };

  const handleCatClick = (label) => setPinnedCat(prev => prev === label ? null : label);

  const handleMobileCategoryClick = (cat) => {
    setSelectedMobileCategory(cat);
    setMobileSubDrawerOpen(true);
  };

  const closeMobileSubDrawer = () => {
    setMobileSubDrawerOpen(false);
    setSelectedMobileCategory(null);
  };

  return (
    <>
      <div className="block md:hidden h-[108px]" aria-hidden="true" />

      <nav
        ref={megaMenuRef}
        className={`fixed md:sticky top-0 left-0 right-0 z-50 bg-white font-['Manrope'] transition-shadow duration-300 ${
          isScrolled ? 'shadow-lg shadow-[rgba(45,27,78,.08)]' : ''
        }`}
      >

        <div className="hidden md:block">
          <div className="border-b border-[#F0EEF4]">
            <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-4">

              <Link href="/" className="flex-shrink-0">
                <Image src="/logo.png" alt="Odara Logo" width={150} height={32} priority />
              </Link>

              <div className="relative flex-1 max-w-[680px]">
                <form onSubmit={handleSearch} className="flex w-full relative items-center">
                  <input
                    type="text"
                    placeholder="Search products, brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#EEEEF2] border-[1.5px] border-[#E8E4F0] rounded-[22px] py-2.5 px-4 pr-20 text-sm text-[#111827] font-['Manrope'] outline-none focus:border-[#C4B5E0] focus:bg-white transition-all"
                  />
                  <button type="submit" className="absolute right-1 flex items-center gap-1.5 bg-[#2D1B4E] text-white border-none rounded-[18px] py-1.5 px-3.5 text-xs font-bold font-['Manrope'] cursor-pointer whitespace-nowrap hover:bg-[#3d2568] transition-colors">
                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                </form>
              </div>

              <div className="flex items-center gap-1 ml-auto">
                <Link href="/deals" className="relative text-sm font-extrabold text-[#1F2937] px-2.5 py-1.5 hover:text-[#2D1B4E] transition-colors">
                  Deals
                  <span className="absolute -top-1 -right-0.5 bg-[#FF4C4C] text-white text-[0.48rem] font-extrabold px-1 py-px rounded-full">HOT</span>
                </Link>
                <Link href="/new-arrivals" className="text-sm font-extrabold text-[#1F2937] px-2.5 py-1.5 hover:text-[#2D1B4E] transition-colors">
                  New Arrivals
                </Link>

                <div className="w-px h-5 bg-[#EDE9F6] mx-1" />

                <div className="relative">
                  <button
                    ref={langButtonRef}
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className={`flex items-center gap-1.5 bg-[#F5F3FF] border-[1.5px] border-[#DDD5F8] rounded-[22px] py-1.5 pl-2 pr-3 cursor-pointer font-['Manrope'] transition-all hover:bg-[#EDE9FF] hover:border-[#C4B5E0] hover:shadow-md text-[#2D1B4E] whitespace-nowrap ${isLangDropdownOpen ? 'shadow-md' : ''}`}
                  >
                    <FlagIcon code={selectedLang.code} size={18} />
                    <span className="text-[0.72rem] font-extrabold tracking-wide uppercase text-[#2D1B4E]">{selectedLang.label}</span>
                    <svg className={`w-3 h-3 opacity-55 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isLangDropdownOpen && (
                    <div ref={langDropdownRef} className="absolute right-0 top-full mt-2.5 bg-white border border-[#EDE9F6] rounded-xl shadow-lg overflow-hidden z-50 w-[190px] animate-[nb-dropIn_0.15s_ease]">
                      {LANGUAGES.map((lang, i) => (
                        <div key={lang.code}>
                          <button
                            className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm font-['Manrope'] font-medium text-left hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors ${selectedLang.code === lang.code ? 'text-[#2D1B4E] font-bold bg-[#EDE9F6]' : 'text-[#374151]'}`}
                            onClick={() => { setSelectedLang(lang); setIsLangDropdownOpen(false); }}
                          >
                            <FlagIcon code={lang.code} size={18} />
                            <span className="flex-1">{lang.name}</span>
                            {selectedLang.code === lang.code && (
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          {i < LANGUAGES.length - 1 && <div className="h-px bg-[#F3F4F6]" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px h-5 bg-[#EDE9F6] mx-1" />

                <AccountButton user={user} profile={profile} onLogout={handleLogout} />

                <Link href="/cart" className="flex flex-col items-center gap-0.5 text-[#2D1B4E] px-2 py-1.5 rounded-lg hover:bg-[#F5F3FF] transition-all relative">
                  <span className="relative inline-flex">
                    <ShoppingCart size={22} strokeWidth={1.8} />
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-extrabold rounded-full h-3.5 min-w-[14px] flex items-center justify-center border-[1.5px] border-white shadow-sm">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  </span>
                  <span className="text-[0.6rem] font-extrabold tracking-widest uppercase text-[#2D1B4E]">Cart</span>
                </Link>
              </div>
            </div>
          </div>

          <div
            ref={categoryBarRef}
            className="border-b border-[#F0EEF4] bg-[#FAFAFC] relative"
            onMouseLeave={handleCatMouseLeave}
          >
            <div className="max-w-[1280px] mx-auto px-6 flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map((cat) => {
                const isActive = activeCatLabel === cat.label;
                const isPinned = pinnedCat === cat.label;
                return (
                  <button
                    key={cat.label}
                    onMouseEnter={() => handleCatMouseEnter(cat.label)}
                    onClick={() => handleCatClick(cat.label)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-[0.8125rem] font-bold whitespace-nowrap rounded-lg transition-all flex-shrink-0 cursor-pointer bg-transparent border-none outline-none ${
                      isActive ? 'bg-[#F0EEFB] text-[#2D1B4E]' : 'text-[#374151] hover:bg-[#F0EEFB] hover:text-[#2D1B4E]'
                    }`}
                  >
                    <span className="text-[15px] leading-none">{cat.icon}</span>
                    {cat.label}
                    {isPinned && (
                      <svg className="w-3 h-3 opacity-60 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <div onMouseEnter={handleMegaMouseEnter} onMouseLeave={handleMegaMouseLeave}>
              <MegaMenu category={activeCat} visible={megaVisible} />
            </div>
          </div>
        </div>

        <div className="md:hidden border-b border-[#F0EEF4] bg-white">
          <div className="px-4 h-14 flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex flex-col justify-center items-center gap-1 w-9 h-9 border-none cursor-pointer p-1.5 rounded-lg hover:bg-[#F5F3FF] transition-colors flex-shrink-0 bg-transparent"
              aria-label="Open menu"
            >
              <span className="w-5 h-0.5 bg-[#2D1B4E] rounded-full block" />
              <span className="w-5 h-0.5 bg-[#2D1B4E] rounded-full block" />
              <span className="w-5 h-0.5 bg-[#2D1B4E] rounded-full block" />
            </button>

            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.png" alt="Odara Logo" width={100} height={32} priority />
            </Link>

            <div className="flex-1" />

            <AccountButton user={user} profile={profile} onLogout={handleLogout} isMobile />

            <Link href="/cart" className="relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#F5F3FF] transition-all text-[#2D1B4E]">
              <ShoppingCart size={24} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-extrabold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="px-4 pb-3">
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#EEEEF2] border-[1.5px] border-[#E8E4F0] rounded-full py-2.5 pl-4 pr-14 text-sm text-[#111827] font-['Manrope'] outline-none focus:border-[#C4B5E0] focus:bg-white transition-all"
              />
              <button type="submit" className="absolute right-1 bg-[#2D1B4E] text-white rounded-full p-2 hover:bg-[#3d2568] transition-colors flex items-center justify-center">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {isDrawerOpen && (
          <>
            <div className="fixed inset-0 bg-[rgba(15,8,30,.52)] z-[300] animate-[nb-fadeIn_0.2s_ease] backdrop-blur-[2px]" onClick={() => setIsDrawerOpen(false)} />
            <div className="fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white z-[301] flex flex-col overflow-y-auto animate-[nb-slideIn_0.26s_cubic-bezier(.32,.72,0,1)]">

              <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F0EEF4] flex-shrink-0">
                <Image src="/logo.png" alt="Odara Logo" width={90} height={26} priority />
                <button onClick={() => setIsDrawerOpen(false)} className="flex items-center justify-center w-8 h-8 bg-[#F5F3FF] border-none rounded-lg text-[#2D1B4E] cursor-pointer hover:bg-[#EDE9FF] transition-colors" aria-label="Close menu">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {user ? (
                <div className="px-4 py-3 bg-[#F8F6FF] border-b border-[#EDE9F6]">
                  <div className="flex items-center gap-2.5 mb-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="avatar" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <DefaultAvatarIcon size={36} />
                    )}
                    <div className="min-w-0">
                      <p className="text-[0.62rem] font-bold text-[#B0A8C8] uppercase tracking-wider leading-none mb-0.5">Welcome back</p>
                      <p className="text-[0.9rem] font-extrabold text-[#2D1B4E] truncate">
                        {(profile?.fullName || user?.displayName || '').split(' ')[0] || 'there'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-1">
                    <button
                      onClick={() => { router.push('/profile'); setIsDrawerOpen(false); }}
                      className="text-[0.72rem] font-bold text-[#6D4DB2] hover:underline bg-transparent border-none cursor-pointer p-0"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => { router.push('/orders'); setIsDrawerOpen(false); }}
                      className="text-[0.72rem] font-bold text-[#6D4DB2] hover:underline bg-transparent border-none cursor-pointer p-0"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-[0.72rem] font-bold text-[#C0392B] hover:underline bg-transparent border-none cursor-pointer p-0 ml-auto"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 border-b border-[#EDE9F6]">
                  <Link
                    href="/login"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full flex items-center justify-center bg-[#2D1B4E] text-white text-[0.82rem] font-extrabold rounded-xl py-2.5 no-underline hover:bg-[#3d2568] transition-colors"
                  >
                    Sign In / Sign Up
                  </Link>
                </div>
              )}

              <div className="text-[0.6rem] font-extrabold tracking-wide uppercase text-[#B0A8C8] px-4 pt-4 pb-1.5">Categories</div>

              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-[0.9rem] font-semibold font-['Manrope'] text-left cursor-pointer bg-transparent border-none transition-colors text-[#1F2937] hover:bg-[#F5F3FF] hover:text-[#2D1B4E]"
                  onClick={() => handleMobileCategoryClick(cat)}
                >
                  <span className="text-base w-7 h-7 flex items-center justify-center bg-[#F5F3FF] rounded-lg flex-shrink-0">{cat.icon}</span>
                  <span className="flex-1">{cat.label}</span>
                  <ChevronRight size={18} className="text-[#B0A8C8]" />
                </button>
              ))}

              <div className="h-px bg-[#F0EEF4] my-1.5 mx-4" />

              <div className="text-[0.6rem] font-extrabold tracking-wide uppercase text-[#B0A8C8] px-4 pt-4 pb-1.5">Preferences</div>
              <button
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-[0.9rem] font-semibold font-['Manrope'] text-left cursor-pointer bg-transparent border-none hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors ${drawerLangOpen ? 'text-[#2D1B4E]' : 'text-[#1F2937]'}`}
                onClick={() => setDrawerLangOpen(!drawerLangOpen)}
              >
                <span className="w-7 h-7 flex items-center justify-center bg-[#F5F3FF] rounded-lg flex-shrink-0">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                </span>
                Language
                <span className="flex items-center gap-2 ml-auto">
                  <span className="flex items-center gap-1.5 bg-[#EDE9F8] rounded-xl py-0.5 px-2">
                    <FlagIcon code={selectedLang.code} size={14} />
                    <span className="text-[0.62rem] font-extrabold tracking-wide uppercase text-[#2D1B4E]">{selectedLang.label}</span>
                  </span>
                  <svg className={`w-3.5 h-3.5 text-[#B0A8C8] transition-transform duration-200 ${drawerLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${drawerLangOpen ? 'max-h-[280px]' : 'max-h-0'}`}>
                <div className="bg-[#FAFAFE]">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      className={`flex items-center gap-3 w-full px-4 py-3 pl-14 text-[0.875rem] font-['Manrope'] text-left hover:bg-[#EDE9FF] hover:text-[#2D1B4E] transition-colors ${selectedLang.code === lang.code ? 'text-[#2D1B4E] font-bold' : 'text-[#374151] font-medium'}`}
                      onClick={() => { setSelectedLang(lang); setDrawerLangOpen(false); }}
                    >
                      <FlagIcon code={lang.code} size={20} />
                      <span className="flex-1">{lang.name}</span>
                      {selectedLang.code === lang.code && (
                        <svg className="text-[#2D1B4E]" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-[#F0EEF4] my-1.5 mx-4" />

              <div className="text-[0.6rem] font-extrabold tracking-wide uppercase text-[#B0A8C8] px-4 pt-4 pb-1.5">Support</div>
              <Link href="/contact" className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] font-semibold font-['Manrope'] text-[#1F2937] no-underline hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors" onClick={() => setIsDrawerOpen(false)}>
                <span className="text-base w-7 h-7 flex items-center justify-center bg-[#F5F3FF] rounded-lg flex-shrink-0">💬</span>Contact Us
              </Link>
              <Link href="/faq" className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] font-semibold font-['Manrope'] text-[#1F2937] no-underline hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors" onClick={() => setIsDrawerOpen(false)}>
                <span className="text-base w-7 h-7 flex items-center justify-center bg-[#F5F3FF] rounded-lg flex-shrink-0">❓</span>FAQs
              </Link>
              <Link href="/track-order" className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] font-semibold font-['Manrope'] text-[#1F2937] no-underline hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors" onClick={() => setIsDrawerOpen(false)}>
                <span className="text-base w-7 h-7 flex items-center justify-center bg-[#F5F3FF] rounded-lg flex-shrink-0">📦</span>Track My Order
              </Link>

              <div className="mt-auto pt-4 pb-4 px-4 border-t border-[#F0EEF4] flex-shrink-0">
                <div className="flex gap-3.5 flex-wrap">
                  <Link href="/privacy" className="text-[0.72rem] font-semibold text-[#B0A8C8] no-underline hover:text-[#2D1B4E] transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="text-[0.72rem] font-semibold text-[#B0A8C8] no-underline hover:text-[#2D1B4E] transition-colors">Terms of Use</Link>
                  <Link href="/about" className="text-[0.72rem] font-semibold text-[#B0A8C8] no-underline hover:text-[#2D1B4E] transition-colors">About Odara</Link>
                </div>
              </div>
            </div>
          </>
        )}

        {mobileSubDrawerOpen && selectedMobileCategory && (
          <>
            <div className="fixed inset-0 bg-[rgba(15,8,30,.52)] z-[350] animate-[nb-fadeIn_0.2s_ease] backdrop-blur-[2px]" onClick={closeMobileSubDrawer} />
            <div className="fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white z-[351] flex flex-col overflow-y-auto animate-[nb-slideInRight_0.26s_cubic-bezier(.32,.72,0,1)]">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F0EEF4] flex-shrink-0">
                <button onClick={closeMobileSubDrawer} className="flex items-center justify-center w-8 h-8 bg-[#F5F3FF] border-none rounded-lg text-[#2D1B4E] cursor-pointer hover:bg-[#EDE9FF] transition-colors" aria-label="Go back">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedMobileCategory.icon}</span>
                  <span className="text-[0.9rem] font-extrabold text-[#2D1B4E]">{selectedMobileCategory.label}</span>
                </div>
              </div>
              <div className="px-4 pt-3 pb-2">
                <Link href={selectedMobileCategory.href} className="flex items-center gap-2 text-[0.8rem] font-bold text-[#2D1B4E] hover:opacity-70 transition-opacity" onClick={closeMobileSubDrawer}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                  View all {selectedMobileCategory.label}
                </Link>
              </div>
              <div className="h-px bg-[#EDE9F6] mx-4 mb-2" />
              <div className="flex-1 pb-4">
                {selectedMobileCategory.subcategories.map((sub) => (
                  <Link key={sub.href} href={sub.href} className="flex items-center gap-3 px-4 py-3 text-[0.84rem] font-medium font-['Manrope'] text-[#374151] no-underline hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors" onClick={closeMobileSubDrawer}>
                    <span className="text-base w-7 h-7 flex items-center justify-center bg-[#F8F6FF] rounded-lg flex-shrink-0">{sub.icon}</span>
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </nav>

      <style jsx global>{`
        @keyframes nb-dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nb-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes nb-slideIn {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes nb-slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes megaFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default Navbar;