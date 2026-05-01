"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ─── Inline SVG flag components (reliable cross-platform rendering) ───────────
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

// ─── Data ─────────────────────────────────────────────────────────────────────
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

// ─── Component ────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen]       = useState(false);
  const [isDrawerOpen, setIsDrawerOpen]                   = useState(false);
  const [drawerLangOpen, setDrawerLangOpen]               = useState(false);
  const [searchQuery, setSearchQuery]                     = useState('');
  const [isScrolled, setIsScrolled]                       = useState(false);
  const [selectedLang, setSelectedLang]                   = useState(LANGUAGES[0]);

  const dropdownRef       = useRef(null);
  const accountButtonRef  = useRef(null);
  const langDropdownRef   = useRef(null);
  const langButtonRef     = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          accountButtonRef.current && !accountButtonRef.current.contains(e.target))
        setIsAccountDropdownOpen(false);
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
      <nav className={`sticky top-0 z-50 bg-white font-['Manrope'] transition-shadow duration-300 ${
        isScrolled ? 'shadow-lg shadow-[rgba(45,27,78,.08)]' : ''
      }`}>
        
        {/* ════════════════════════ DESKTOP NAVIGATION ════════════════════════ */}
        <div className="hidden md:block">
          {/* Top Bar */}
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

              {/* Right Navigation */}
              <div className="flex items-center gap-1 ml-auto">
                {/* Deals */}
                <Link href="/deals" className="relative text-sm font-extrabold text-[#1F2937] px-2.5 py-1.5 hover:text-[#2D1B4E] transition-colors group">
                  Deals
                  <span className="absolute -top-1 -right-0.5 bg-[#FF4C4C] text-white text-[0.48rem] font-extrabold px-1 py-px rounded-full">HOT</span>
                  <span className="absolute left-2.5 bottom-0.5 w-0 h-0.5 bg-[#2D1B4E] rounded-full transition-all duration-200 group-hover:w-[calc(100%-20px)]"></span>
                </Link>

                {/* New Arrivals */}
                <Link href="/new-arrivals" className="text-sm font-extrabold text-[#1F2937] px-2.5 py-1.5 hover:text-[#2D1B4E] transition-colors group relative">
                  New Arrivals
                  <span className="absolute left-2.5 bottom-0.5 w-0 h-0.5 bg-[#2D1B4E] rounded-full transition-all duration-200 group-hover:w-[calc(100%-20px)]"></span>
                </Link>

                <div className="w-px h-5 bg-[#EDE9F6] mx-1"></div>

                {/* Language Dropdown */}
                <div className="relative">
                  <button
                    ref={langButtonRef}
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className={`flex items-center gap-1.5 bg-[#F5F3FF] border-[1.5px] border-[#DDD5F8] rounded-[22px] py-1.5 pl-2 pr-3 cursor-pointer font-['Manrope'] transition-all hover:bg-[#EDE9FF] hover:border-[#C4B5E0] hover:shadow-md text-[#2D1B4E] whitespace-nowrap ${
                      isLangDropdownOpen ? 'shadow-md' : ''
                    }`}
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
                            className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#374151] font-['Manrope'] font-medium text-left hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors ${
                              selectedLang.code === lang.code ? 'text-[#2D1B4E] font-bold bg-[#EDE9F6]' : ''
                            }`}
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

                <div className="w-px h-5 bg-[#EDE9F6] mx-1"></div>

                {/* Account */}
                <div className="relative">
                  <button
                    ref={accountButtonRef}
                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                    className="flex flex-col items-center gap-0.5 text-[#374151] bg-none border-none cursor-pointer px-2 py-1.5 rounded-lg hover:text-[#2D1B4E] hover:bg-[#F5F3FF] transition-all"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[0.58rem] font-bold tracking-wide uppercase">Account</span>
                  </button>

                  {isAccountDropdownOpen && (
                    <div ref={dropdownRef} className="absolute right-0 top-full mt-2.5 bg-white border border-[#EDE9F6] rounded-xl shadow-lg overflow-hidden z-50 w-[184px] animate-[nb-dropIn_0.15s_ease]">
                      <Link href="/account" className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-[#374151] font-['Manrope'] font-medium hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors" onClick={() => setIsAccountDropdownOpen(false)}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        My Account
                      </Link>
                      <div className="h-px bg-[#F3F4F6]" />
                      <Link href="/wishlist" className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-[#374151] font-['Manrope'] font-medium hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors" onClick={() => setIsAccountDropdownOpen(false)}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        Wishlist
                      </Link>
                      <div className="h-px bg-[#F3F4F6]" />
                      <Link href="/orders" className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-[#374151] font-['Manrope'] font-medium hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors" onClick={() => setIsAccountDropdownOpen(false)}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        Orders
                      </Link>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <Link href="/cart" className="flex flex-col items-center gap-0.5 text-[#374151] px-2 py-1.5 rounded-lg hover:text-[#2D1B4E] hover:bg-[#F5F3FF] transition-all relative">
                  <span className="relative inline-flex">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-[#2D1B4E] text-white text-[9px] font-extrabold rounded-full h-3.5 min-w-[14px] flex items-center justify-center border-[1.5px] border-white">0</span>
                  </span>
                  <span className="text-[0.58rem] font-bold tracking-wide uppercase">Cart</span>
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

        {/* ════════════════════════ MOBILE NAVIGATION ════════════════════════ */}
        <div className="md:hidden">
          {/* Top Bar */}
          <div className="border-b border-[#F0EEF4] px-4 h-16 flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex flex-col justify-center items-center gap-1 w-9 h-9 bg-none border-none cursor-pointer p-1.5 rounded-lg hover:bg-[#F5F3FF] transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <span className="w-5 h-0.5 bg-[#2D1B4E] rounded-full transition-all"></span>
              <span className="w-5 h-0.5 bg-[#2D1B4E] rounded-full transition-all"></span>
              <span className="w-5 h-0.5 bg-[#2D1B4E] rounded-full transition-all"></span>
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.png" alt="Odara Logo" width={120} height={26} priority />
            </Link>

            {/* Search - Mobile (first and only search button) */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#EEEEF2] border-[1.5px] border-[#E8E4F0] rounded-full py-2 pl-3.5 pr-14 text-sm text-[#111827] font-['Manrope'] outline-none focus:border-[#C4B5E0] focus:bg-white transition-all"
                />
                <button type="submit" className="absolute right-1 bg-[#2D1B4E] text-white rounded-full p-1.5 hover:bg-[#3d2568] transition-colors">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Cart Icon - Mobile */}
            <Link href="/cart" className="relative flex-shrink-0">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-[#374151]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1.5 -right-1.5 bg-[#2D1B4E] text-white text-[9px] font-extrabold rounded-full h-4 min-w-[16px] flex items-center justify-center px-0.5">0</span>
            </Link>
          </div>
        </div>

        {/* ════════════════════════ DRAWER MENU (MOBILE) ════════════════════════ */}
        {isDrawerOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-[rgba(15,8,30,.52)] z-[300] animate-[nb-fadeIn_0.2s_ease] backdrop-blur-[2px]"
              onClick={() => setIsDrawerOpen(false)}
            />
            
            {/* Drawer Panel */}
            <div className="fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white z-[301] flex flex-col overflow-y-auto animate-[nb-slideIn_0.26s_cubic-bezier(.32,.72,0,1)]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F0EEF4] flex-shrink-0">
                <Image src="/logo.png" alt="Odara Logo" width={90} height={26} priority />
                <button 
                  onClick={() => setIsDrawerOpen(false)} 
                  className="flex items-center justify-center w-8 h-8 bg-[#F5F3FF] border-none rounded-lg text-[#2D1B4E] cursor-pointer hover:bg-[#EDE9FF] transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Categories Section */}
              <div className="text-[0.6rem] font-extrabold tracking-wide uppercase text-[#B0A8C8] px-4 pt-4 pb-1.5">Categories</div>
              {CATEGORIES.map((cat) => (
                <Link 
                  key={cat.label} 
                  href={cat.href} 
                  className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] font-semibold font-['Manrope'] text-[#1F2937] no-underline hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="text-base w-7 h-7 flex items-center justify-center bg-[#F5F3FF] rounded-lg flex-shrink-0">{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}

              <div className="h-px bg-[#F0EEF4] my-1.5 mx-4" />

              {/* Language Section */}
              <div className="text-[0.6rem] font-extrabold tracking-wide uppercase text-[#B0A8C8] px-4 pt-4 pb-1.5">Preferences</div>
              
              <button
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-[0.9rem] font-semibold font-['Manrope'] text-[#1F2937] text-left cursor-pointer bg-none border-none hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors ${
                  drawerLangOpen ? 'text-[#2D1B4E]' : ''
                }`}
                onClick={() => setDrawerLangOpen(!drawerLangOpen)}
              >
                <span className="text-base w-7 h-7 flex items-center justify-center bg-[#F5F3FF] rounded-lg flex-shrink-0">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </span>
                Language
                <span className="flex items-center gap-2 ml-auto">
                  <span className="flex items-center gap-1.5 bg-[#EDE9F8] rounded-xl py-0.5 px-2">
                    <FlagIcon code={selectedLang.code} size={14} />
                    <span className="text-[0.62rem] font-extrabold tracking-wide uppercase text-[#2D1B4E]">{selectedLang.label}</span>
                  </span>
                  <svg className={`w-3.5 h-3.5 text-[#B0A8C8] transition-transform duration-200 ${drawerLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${drawerLangOpen ? 'max-h-[280px]' : 'max-h-0'}`}>
                <div className="bg-[#FAFAFE]">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      className={`flex items-center gap-3 w-full px-4 py-3 pl-14 text-[0.875rem] font-medium font-['Manrope'] text-[#374151] text-left hover:bg-[#EDE9FF] hover:text-[#2D1B4E] transition-colors ${
                        selectedLang.code === lang.code ? 'text-[#2D1B4E] font-bold' : ''
                      }`}
                      onClick={() => { setSelectedLang(lang); setDrawerLangOpen(false); }}
                    >
                      <FlagIcon code={lang.code} size={20} />
                      <span className="flex-1">{lang.name}</span>
                      {selectedLang.code === lang.code && (
                        <svg className="text-[#2D1B4E]" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-[#F0EEF4] my-1.5 mx-4" />

              {/* Support Section */}
              <div className="text-[0.6rem] font-extrabold tracking-wide uppercase text-[#B0A8C8] px-4 pt-4 pb-1.5">Support</div>
              <Link href="/contact" className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] font-semibold font-['Manrope'] text-[#1F2937] no-underline hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors" onClick={() => setIsDrawerOpen(false)}>
                <span className="text-base w-7 h-7 flex items-center justify-center bg-[#F5F3FF] rounded-lg flex-shrink-0">💬</span>
                Contact Us
              </Link>
              <Link href="/faq" className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] font-semibold font-['Manrope'] text-[#1F2937] no-underline hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors" onClick={() => setIsDrawerOpen(false)}>
                <span className="text-base w-7 h-7 flex items-center justify-center bg-[#F5F3FF] rounded-lg flex-shrink-0">❓</span>
                FAQs
              </Link>
              <Link href="/track-order" className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] font-semibold font-['Manrope'] text-[#1F2937] no-underline hover:bg-[#F5F3FF] hover:text-[#2D1B4E] transition-colors" onClick={() => setIsDrawerOpen(false)}>
                <span className="text-base w-7 h-7 flex items-center justify-center bg-[#F5F3FF] rounded-lg flex-shrink-0">📦</span>
                Track My Order
              </Link>

              {/* Footer Links */}
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

      {/* Add keyframe animations to global styles */}
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Navbar;