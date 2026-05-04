"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" />
    <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="12" />
    <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
  </svg>
);

const FlagIcon = ({ code, size = 20 }) => {
  if (code === 'en') return <FlagGB size={size} />;
  return <FlagNG size={size} />;
};

const ShoppingBagIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'yo', label: 'YO', name: 'Yorùbá' },
  { code: 'ha', label: 'HA', name: 'Hausa' },
  { code: 'ig', label: 'IG', name: 'Igbo' },
];

const CATEGORIES = [
  { label: 'Electronics',   icon: '📱', href: '/category/electronics' },
  { label: 'Fashion',       icon: '👗', href: '/category/fashion' },
  { label: 'Home & Living', icon: '🏠', href: '/category/home-living' },
  { label: 'Beauty',        icon: '💄', href: '/category/beauty' },
  { label: 'Sports',        icon: '⚽', href: '/category/sports' },
  { label: 'Groceries',     icon: '🛒', href: '/category/groceries' },
  { label: 'Books',         icon: '📚', href: '/category/books' },
  { label: 'Toys & Kids',   icon: '🧸', href: '/category/toys-kids' },
  { label: 'Automotive',    icon: '🚗', href: '/category/automotive' },
  { label: 'Health',        icon: '💊', href: '/category/health' },
];

const Navbar = () => {
  const [isLangDropdownOpen, setIsLangDropdownOpen]       = useState(false);
  const [isDrawerOpen, setIsDrawerOpen]                   = useState(false);
  const [drawerLangOpen, setDrawerLangOpen]               = useState(false);
  const [searchQuery, setSearchQuery]                     = useState('');
  const [isScrolled, setIsScrolled]                       = useState(false);
  const [selectedLang, setSelectedLang]                   = useState(LANGUAGES[0]);

  const langDropdownRef        = useRef(null);
  const langButtonRef          = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target) &&
          langButtonRef.current && !langButtonRef.current.contains(e.target))
        setIsLangDropdownOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : 'unset';
    if (!isDrawerOpen) setDrawerLangOpen(false);
    return () => { document.body.style.overflow = 'unset'; };
  }, [isDrawerOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) console.log('Search:', searchQuery);
  };

  return (
    <>
      {/* ── Fixed mobile offset spacer ── */}
      <div className="block md:hidden h-[108px]" aria-hidden="true" />

      <nav className={`fixed md:sticky top-0 left-0 right-0 z-50 bg-white font-['Manrope'] transition-shadow duration-300 ${
        isScrolled ? 'shadow-lg shadow-[rgba(45,27,78,.08)]' : ''
      }`}>

        {/* ══ DESKTOP ══ */}
        <div className="hidden md:block">
          <div className="border-b border-[#F0EEF4]">
            <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-4">

              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <Image src="/logo.png" alt="Odara Logo" width={150} height={32} priority />
              </Link>

              {/* Search */}
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

              {/* Right */}
              <div className="flex items-center gap-1 ml-auto">
                <Link href="/deals" className="relative text-sm font-extrabold text-[#1F2937] px-2.5 py-1.5 hover:text-[#2D1B4E] transition-colors group">
                  Deals
                  <span className="absolute -top-1 -right-0.5 bg-[#FF4C4C] text-white text-[0.48rem] font-extrabold px-1 py-px rounded-full">HOT</span>
                  <span className="absolute left-2.5 bottom-0.5 w-0 h-0.5 bg-[#2D1B4E] rounded-full transition-all duration-200 group-hover:w-[calc(100%-20px)]"></span>
                </Link>
                <Link href="/new-arrivals" className="text-sm font-extrabold text-[#1F2937] px-2.5 py-1.5 hover:text-[#2D1B4E] transition-colors group relative">
                  New Arrivals
                  <span className="absolute left-2.5 bottom-0.5 w-0 h-0.5 bg-[#2D1B4E] rounded-full transition-all duration-200 group-hover:w-[calc(100%-20px)]"></span>
                </Link>

                <div className="w-px h-5 bg-[#EDE9F6] mx-1" />

                {/* Language */}
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

                {/* Account — desktop - now links directly to login */}
                <Link href="/login" className="flex flex-col items-center gap-0.5 text-[#2D1B4E] px-2 py-1.5 rounded-lg hover:bg-[#F5F3FF] transition-all">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 20a7 7 0 0 1 14 0" />
                  </svg>
                  <span className="text-[0.6rem] font-extrabold tracking-widest uppercase text-[#2D1B4E]">Account</span>
                </Link>

                {/* Cart — desktop */}
                <Link href="/cart" className="flex flex-col items-center gap-0.5 text-[#2D1B4E] px-2 py-1.5 rounded-lg hover:bg-[#F5F3FF] transition-all relative">
                  <span className="relative inline-flex">
                    <ShoppingBagIcon size={22} />
                    <span className="absolute -top-1 -right-1 bg-[#2D1B4E] text-white text-[9px] font-extrabold rounded-full h-3.5 min-w-[14px] flex items-center justify-center border-[1.5px] border-white">0</span>
                  </span>
                  <span className="text-[0.6rem] font-extrabold tracking-widest uppercase text-[#2D1B4E]">Cart</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Category Bar */}
          <div className="border-b border-[#F0EEF4] bg-[#FAFAFC]">
            <div className="max-w-[1280px] mx-auto px-6 flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <Link key={cat.label} href={cat.href} className="flex items-center gap-1.5 px-3.5 py-2 text-[0.8125rem] font-bold text-[#374151] no-underline whitespace-nowrap rounded-lg hover:bg-[#F0EEFB] hover:text-[#2D1B4E] transition-all flex-shrink-0">
                  <span className="text-[15px] leading-none">{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ══ MOBILE ══ */}
        <div className="md:hidden border-b border-[#F0EEF4] bg-white">
          {/* Row 1 */}
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

            {/* Account — mobile - now links directly to login */}
            <Link href="/login" className="flex items-center justify-center w-10 h-10 text-[#2D1B4E] rounded-lg hover:bg-[#F5F3FF] transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M5 20a7 7 0 0 1 14 0" />
              </svg>
            </Link>

            {/* Cart — mobile */}
            <Link href="/cart" className="relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#F5F3FF] transition-all text-[#2D1B4E]">
              <ShoppingBagIcon size={24} />
              <span className="absolute top-0.5 right-0.5 bg-[#2D1B4E] text-white text-[9px] font-extrabold rounded-full h-4 min-w-[16px] flex items-center justify-center px-0.5">0</span>
            </Link>
          </div>

          {/* Row 2: Search */}
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

        {/* ══ DRAWER ══ */}
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

              <div className="text-[0.6rem] font-extrabold tracking-wide uppercase text-[#B0A8C8] px-4 pt-4 pb-1.5">Categories</div>
              {CATEGORIES.map((cat) => (
                <Link key={cat.label} href={cat.href} className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] font-semibold font-['Manrope'] text-[#1F2937] no-underline hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors" onClick={() => setIsDrawerOpen(false)}>
                  <span className="text-base w-7 h-7 flex items-center justify-center bg-[#F5F3FF] rounded-lg flex-shrink-0">{cat.icon}</span>
                  {cat.label}
                </Link>
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
      </nav>

      <style jsx global>{`
        @keyframes nb-dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes nb-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes nb-slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default Navbar;