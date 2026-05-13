"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ChevronRight, ChevronLeft } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useUser } from '@/lib/firebase/useAuth';

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
    label: 'Electronics', icon: '📱', href: '/category/electronics',
    subcategories: [
      { label: 'Smartphones',       icon: '📱', href: '/category/electronics/smartphones' },
      { label: 'Laptops',           icon: '💻', href: '/category/electronics/laptops' },
      { label: 'Tablets',           icon: '📟', href: '/category/electronics/tablets' },
      { label: 'Headphones',        icon: '🎧', href: '/category/electronics/headphones' },
      { label: 'Smart Watches',     icon: '⌚', href: '/category/electronics/smart-watches' },
      { label: 'Cameras',           icon: '📷', href: '/category/electronics/cameras' },
      { label: 'TVs & Monitors',    icon: '📺', href: '/category/electronics/tvs' },
      { label: 'Gaming',            icon: '🎮', href: '/category/electronics/gaming' },
      { label: 'Speakers',          icon: '🔊', href: '/category/electronics/speakers' },
      { label: 'Accessories',       icon: '🔌', href: '/category/electronics/accessories' },
      { label: 'Printers',          icon: '🖨️', href: '/category/electronics/printers' },
      { label: 'Networking',        icon: '📡', href: '/category/electronics/networking' },
      { label: 'Power Banks',       icon: '🔋', href: '/category/electronics/power-banks' },
      { label: 'Memory & Storage',  icon: '💾', href: '/category/electronics/storage' },
      { label: 'Smart Home',        icon: '🏡', href: '/category/electronics/smart-home' },
      { label: 'Drones',            icon: '🚁', href: '/category/electronics/drones' },
      { label: 'Projectors',        icon: '🎬', href: '/category/electronics/projectors' },
      { label: 'Office Equipment',  icon: '🖥️', href: '/category/electronics/office' },
      { label: 'Cables & Hubs',     icon: '🔗', href: '/category/electronics/cables' },
      { label: 'Wearables',         icon: '💍', href: '/category/electronics/wearables' },
    ],
  },
  {
    label: 'Fashion', icon: '👗', href: '/category/fashion',
    subcategories: [
      { label: "Men's Clothing",   icon: '👔', href: '/category/fashion/mens' },
      { label: "Women's Clothing", icon: '👗', href: '/category/fashion/womens' },
      { label: 'Kids Fashion',     icon: '🧒', href: '/category/fashion/kids' },
      { label: 'Shoes',            icon: '👟', href: '/category/fashion/shoes' },
      { label: 'Bags & Purses',    icon: '👜', href: '/category/fashion/bags' },
      { label: 'Watches',          icon: '⌚', href: '/category/fashion/watches' },
      { label: 'Sunglasses',       icon: '🕶️', href: '/category/fashion/sunglasses' },
      { label: 'Jewellery',        icon: '💎', href: '/category/fashion/jewellery' },
      { label: 'Belts',            icon: '🪢', href: '/category/fashion/belts' },
      { label: 'Hats & Caps',      icon: '🧢', href: '/category/fashion/hats' },
      { label: 'Ankara & Native',  icon: '🎨', href: '/category/fashion/ankara' },
      { label: 'Lingerie',         icon: '🌸', href: '/category/fashion/lingerie' },
      { label: 'Swimwear',         icon: '🩱', href: '/category/fashion/swimwear' },
      { label: 'Sports Wear',      icon: '🏃', href: '/category/fashion/sportswear' },
      { label: 'Formal Wear',      icon: '🤵', href: '/category/fashion/formal' },
      { label: 'Dresses',          icon: '👘', href: '/category/fashion/dresses' },
      { label: 'Jackets & Coats',  icon: '🧥', href: '/category/fashion/jackets' },
      { label: 'Scarves',          icon: '🧣', href: '/category/fashion/scarves' },
      { label: 'Socks & Hosiery',  icon: '🧦', href: '/category/fashion/socks' },
      { label: 'Accessories',      icon: '✨', href: '/category/fashion/accessories' },
    ],
  },
  {
    label: 'Home & Living', icon: '🏠', href: '/category/home-living',
    subcategories: [
      { label: 'Furniture',        icon: '🛋️', href: '/category/home/furniture' },
      { label: 'Bedding',          icon: '🛏️', href: '/category/home/bedding' },
      { label: 'Kitchen',          icon: '🍳', href: '/category/home/kitchen' },
      { label: 'Lighting',         icon: '💡', href: '/category/home/lighting' },
      { label: 'Bathroom',         icon: '🚿', href: '/category/home/bathroom' },
      { label: 'Cleaning',         icon: '🧹', href: '/category/home/cleaning' },
      { label: 'Decor',            icon: '🖼️', href: '/category/home/decor' },
      { label: 'Storage',          icon: '📦', href: '/category/home/storage' },
      { label: 'Garden & Outdoor', icon: '🌿', href: '/category/home/garden' },
      { label: 'Cookware',         icon: '🥘', href: '/category/home/cookware' },
      { label: 'Appliances',       icon: '🧺', href: '/category/home/appliances' },
      { label: 'Curtains & Blinds',icon: '🪟', href: '/category/home/curtains' },
      { label: 'Rugs & Carpets',   icon: '🟥', href: '/category/home/rugs' },
      { label: 'Tools & Hardware', icon: '🔧', href: '/category/home/tools' },
      { label: 'Pet Supplies',     icon: '🐾', href: '/category/home/pets' },
      { label: 'Air Conditioning', icon: '❄️', href: '/category/home/ac' },
      { label: 'Generators',       icon: '⚡', href: '/category/home/generators' },
      { label: 'Candles & Scents', icon: '🕯️', href: '/category/home/candles' },
      { label: 'Baby Gear',        icon: '🍼', href: '/category/home/baby' },
      { label: 'Office Supplies',  icon: '📎', href: '/category/home/office' },
    ],
  },
  {
    label: 'Beauty', icon: '💄', href: '/category/beauty',
    subcategories: [
      { label: 'Skincare',         icon: '🧴', href: '/category/beauty/skincare' },
      { label: 'Makeup',           icon: '💄', href: '/category/beauty/makeup' },
      { label: 'Hair Care',        icon: '💇', href: '/category/beauty/hair' },
      { label: 'Fragrances',       icon: '🌹', href: '/category/beauty/fragrance' },
      { label: 'Nail Care',        icon: '💅', href: '/category/beauty/nails' },
      { label: 'Body Care',        icon: '🧼', href: '/category/beauty/body' },
      { label: 'Shaving',          icon: '🪒', href: '/category/beauty/shaving' },
      { label: 'Oral Care',        icon: '🦷', href: '/category/beauty/oral' },
      { label: 'Hair Extensions',  icon: '👱', href: '/category/beauty/extensions' },
      { label: 'Beauty Tools',     icon: '🪞', href: '/category/beauty/tools' },
      { label: 'Men\'s Grooming',  icon: '🧔', href: '/category/beauty/mens-grooming' },
      { label: 'Sunscreen',        icon: '☀️', href: '/category/beauty/sunscreen' },
      { label: 'Lip Care',         icon: '💋', href: '/category/beauty/lips' },
      { label: 'Eye Care',         icon: '👁️', href: '/category/beauty/eyes' },
      { label: 'Foundation',       icon: '🎨', href: '/category/beauty/foundation' },
      { label: 'Wigs',             icon: '🦱', href: '/category/beauty/wigs' },
      { label: 'Brushes & Sponges',icon: '🖌️', href: '/category/beauty/brushes' },
      { label: 'Toners',           icon: '💧', href: '/category/beauty/toners' },
      { label: 'Anti-Ageing',      icon: '✨', href: '/category/beauty/anti-ageing' },
      { label: 'Natural & Organic',icon: '🌿', href: '/category/beauty/organic' },
    ],
  },
  {
    label: 'Sports', icon: '⚽', href: '/category/sports',
    subcategories: [
      { label: 'Football',         icon: '⚽', href: '/category/sports/football' },
      { label: 'Basketball',       icon: '🏀', href: '/category/sports/basketball' },
      { label: 'Tennis',           icon: '🎾', href: '/category/sports/tennis' },
      { label: 'Fitness & Gym',    icon: '🏋️', href: '/category/sports/gym' },
      { label: 'Cycling',          icon: '🚴', href: '/category/sports/cycling' },
      { label: 'Running',          icon: '🏃', href: '/category/sports/running' },
      { label: 'Swimming',         icon: '🏊', href: '/category/sports/swimming' },
      { label: 'Martial Arts',     icon: '🥋', href: '/category/sports/martial-arts' },
      { label: 'Yoga',             icon: '🧘', href: '/category/sports/yoga' },
      { label: 'Outdoor Sports',   icon: '🏕️', href: '/category/sports/outdoor' },
      { label: 'Cricket',          icon: '🏏', href: '/category/sports/cricket' },
      { label: 'Table Tennis',     icon: '🏓', href: '/category/sports/table-tennis' },
      { label: 'Badminton',        icon: '🏸', href: '/category/sports/badminton' },
      { label: 'Volleyball',       icon: '🏐', href: '/category/sports/volleyball' },
      { label: 'Boxing',           icon: '🥊', href: '/category/sports/boxing' },
      { label: 'Skipping Ropes',   icon: '🪢', href: '/category/sports/skipping' },
      { label: 'Sports Nutrition', icon: '💊', href: '/category/sports/nutrition' },
      { label: 'Water Sports',     icon: '🚣', href: '/category/sports/water' },
      { label: 'Team Jerseys',     icon: '👕', href: '/category/sports/jerseys' },
      { label: 'Sports Bags',      icon: '🎒', href: '/category/sports/bags' },
    ],
  },
  {
    label: 'Groceries', icon: '🛒', href: '/category/groceries',
    subcategories: [
      { label: 'Rice & Grains',    icon: '🌾', href: '/category/groceries/rice' },
      { label: 'Cooking Oil',      icon: '🫙', href: '/category/groceries/oil' },
      { label: 'Beverages',        icon: '☕', href: '/category/groceries/beverages' },
      { label: 'Snacks',           icon: '🍫', href: '/category/groceries/snacks' },
      { label: 'Dairy & Eggs',     icon: '🥚', href: '/category/groceries/dairy' },
      { label: 'Frozen Foods',     icon: '🧊', href: '/category/groceries/frozen' },
      { label: 'Seasoning',        icon: '🧂', href: '/category/groceries/seasoning' },
      { label: 'Cereals',          icon: '🥣', href: '/category/groceries/cereals' },
      { label: 'Pasta & Noodles',  icon: '🍝', href: '/category/groceries/pasta' },
      { label: 'Canned Foods',     icon: '🥫', href: '/category/groceries/canned' },
      { label: 'Bread & Bakery',   icon: '🍞', href: '/category/groceries/bakery' },
      { label: 'Baby Food',        icon: '🍼', href: '/category/groceries/baby-food' },
      { label: 'Sauces',           icon: '🍯', href: '/category/groceries/sauces' },
      { label: 'Nuts & Dried',     icon: '🥜', href: '/category/groceries/nuts' },
      { label: 'Sugar & Sweetener',icon: '🍬', href: '/category/groceries/sugar' },
      { label: 'Flour & Starch',   icon: '🌽', href: '/category/groceries/flour' },
      { label: 'Water & Drinks',   icon: '💧', href: '/category/groceries/water' },
      { label: 'Tea & Coffee',     icon: '🍵', href: '/category/groceries/tea' },
      { label: 'Organic Foods',    icon: '🌿', href: '/category/groceries/organic' },
      { label: 'Hygiene Products', icon: '🧻', href: '/category/groceries/hygiene' },
    ],
  },
  {
    label: 'Books', icon: '📚', href: '/category/books',
    subcategories: [
      { label: 'Fiction',          icon: '📖', href: '/category/books/fiction' },
      { label: 'Non-Fiction',      icon: '📘', href: '/category/books/non-fiction' },
      { label: 'Children\'s',      icon: '🧒', href: '/category/books/children' },
      { label: 'Textbooks',        icon: '📗', href: '/category/books/textbooks' },
      { label: 'Business',         icon: '💼', href: '/category/books/business' },
      { label: 'Self Help',        icon: '🌟', href: '/category/books/self-help' },
      { label: 'Religion',         icon: '✝️', href: '/category/books/religion' },
      { label: 'Science',          icon: '🔬', href: '/category/books/science' },
      { label: 'History',          icon: '🏛️', href: '/category/books/history' },
      { label: 'Biographies',      icon: '👤', href: '/category/books/biographies' },
      { label: 'Arts & Music',     icon: '🎨', href: '/category/books/arts' },
      { label: 'Travel',           icon: '✈️', href: '/category/books/travel' },
      { label: 'Cooking',          icon: '🍳', href: '/category/books/cooking' },
      { label: 'Technology',       icon: '💻', href: '/category/books/technology' },
      { label: 'Law',              icon: '⚖️', href: '/category/books/law' },
      { label: 'Health & Medicine',icon: '🏥', href: '/category/books/health' },
      { label: 'African Authors',  icon: '🌍', href: '/category/books/african' },
      { label: 'Poetry',           icon: '🖊️', href: '/category/books/poetry' },
      { label: 'Comics & Manga',   icon: '💥', href: '/category/books/comics' },
      { label: 'E-Books',          icon: '📱', href: '/category/books/ebooks' },
    ],
  },
  {
    label: 'Toys & Kids', icon: '🧸', href: '/category/toys-kids',
    subcategories: [
      { label: 'Action Figures',   icon: '🦸', href: '/category/toys/action-figures' },
      { label: 'Dolls',            icon: '🪆', href: '/category/toys/dolls' },
      { label: 'Board Games',      icon: '🎲', href: '/category/toys/board-games' },
      { label: 'Puzzles',          icon: '🧩', href: '/category/toys/puzzles' },
      { label: 'Building Blocks',  icon: '🧱', href: '/category/toys/blocks' },
      { label: 'Remote Control',   icon: '🚗', href: '/category/toys/remote-control' },
      { label: 'Educational Toys', icon: '🎓', href: '/category/toys/educational' },
      { label: 'Outdoor Play',     icon: '🛝', href: '/category/toys/outdoor' },
      { label: 'Arts & Crafts',    icon: '🎨', href: '/category/toys/arts-crafts' },
      { label: 'Baby Toys',        icon: '🍼', href: '/category/toys/baby' },
      { label: 'Stuffed Animals',  icon: '🧸', href: '/category/toys/stuffed' },
      { label: 'Musical Toys',     icon: '🎵', href: '/category/toys/musical' },
      { label: 'Science Kits',     icon: '🔭', href: '/category/toys/science' },
      { label: 'Card Games',       icon: '🃏', href: '/category/toys/card-games' },
      { label: 'Role Play',        icon: '🎭', href: '/category/toys/role-play' },
      { label: 'Sports Toys',      icon: '⚽', href: '/category/toys/sports' },
      { label: 'School Supplies',  icon: '✏️', href: '/category/toys/school' },
      { label: 'Bikes & Scooters', icon: '🛴', href: '/category/toys/bikes' },
      { label: 'Kids Clothing',    icon: '👕', href: '/category/toys/clothing' },
      { label: 'Feeding & Nursing',icon: '🤱', href: '/category/toys/nursing' },
    ],
  },
  {
    label: 'Automotive', icon: '🚗', href: '/category/automotive',
    subcategories: [
      { label: 'Car Parts',        icon: '⚙️', href: '/category/auto/parts' },
      { label: 'Tyres',            icon: '🔄', href: '/category/auto/tyres' },
      { label: 'Car Accessories',  icon: '🚗', href: '/category/auto/accessories' },
      { label: 'Car Care',         icon: '🧽', href: '/category/auto/care' },
      { label: 'Oils & Fluids',    icon: '🛢️', href: '/category/auto/oils' },
      { label: 'Tools & Equipment',icon: '🔧', href: '/category/auto/tools' },
      { label: 'Car Audio',        icon: '🔊', href: '/category/auto/audio' },
      { label: 'GPS & Tracking',   icon: '📍', href: '/category/auto/gps' },
      { label: 'Dash Cams',        icon: '📷', href: '/category/auto/dashcams' },
      { label: 'Seat Covers',      icon: '💺', href: '/category/auto/seat-covers' },
      { label: 'Car Chargers',     icon: '🔋', href: '/category/auto/chargers' },
      { label: 'Motorcycle Parts', icon: '🏍️', href: '/category/auto/moto' },
      { label: 'Lighting',         icon: '💡', href: '/category/auto/lighting' },
      { label: 'Air Fresheners',   icon: '🌸', href: '/category/auto/fresheners' },
      { label: 'Wiper Blades',     icon: '🌧️', href: '/category/auto/wipers' },
      { label: 'Security Systems', icon: '🔒', href: '/category/auto/security' },
      { label: 'Jump Starters',    icon: '⚡', href: '/category/auto/jump-start' },
      { label: 'Covers & Tents',   icon: '⛺', href: '/category/auto/covers' },
      { label: 'Floor Mats',       icon: '🟫', href: '/category/auto/mats' },
      { label: 'Batteries',        icon: '🔋', href: '/category/auto/batteries' },
    ],
  },
  {
    label: 'Health', icon: '💊', href: '/category/health',
    subcategories: [
      { label: 'Vitamins',         icon: '💊', href: '/category/health/vitamins' },
      { label: 'Pain Relief',      icon: '🩹', href: '/category/health/pain-relief' },
      { label: 'First Aid',        icon: '🩺', href: '/category/health/first-aid' },
      { label: 'Blood Pressure',   icon: '❤️', href: '/category/health/blood-pressure' },
      { label: 'Diabetes Care',    icon: '🩸', href: '/category/health/diabetes' },
      { label: 'Weight Loss',      icon: '⚖️', href: '/category/health/weight-loss' },
      { label: 'Digestive Health', icon: '🫃', href: '/category/health/digestive' },
      { label: 'Eye Care',         icon: '👁️', href: '/category/health/eyes' },
      { label: 'Fitness Equipment',icon: '🏋️', href: '/category/health/fitness' },
      { label: 'Pregnancy',        icon: '🤰', href: '/category/health/pregnancy' },
      { label: 'Sleep Aids',       icon: '😴', href: '/category/health/sleep' },
      { label: 'Immunity',         icon: '🛡️', href: '/category/health/immunity' },
      { label: 'Protein & Shakes', icon: '💪', href: '/category/health/protein' },
      { label: 'Mental Wellness',  icon: '🧠', href: '/category/health/mental' },
      { label: 'Herbal Remedies',  icon: '🌿', href: '/category/health/herbal' },
      { label: 'Medical Devices',  icon: '🔬', href: '/category/health/devices' },
      { label: 'Sexual Health',    icon: '💑', href: '/category/health/sexual' },
      { label: 'Bone & Joint',     icon: '🦴', href: '/category/health/bone' },
      { label: 'Kids Health',      icon: '👶', href: '/category/health/kids' },
      { label: 'Thermometers',     icon: '🌡️', href: '/category/health/thermometers' },
    ],
  },
];

// ─── Default Avatar SVG Icon ─────────────────────────────────────────────────
// Shown when user has no photoURL
const DefaultAvatarIcon = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Circular background */}
    <circle cx="14" cy="14" r="14" fill="#2D1B4E" />
    {/* Head */}
    <circle cx="14" cy="11" r="4" fill="white" fillOpacity="0.9" />
    {/* Body / shoulders */}
    <path
      d="M6 24c0-4.418 3.582-8 8-8s8 3.582 8 8"
      stroke="white"
      strokeOpacity="0.9"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Mega-Menu Panel ────────────────────────────────────────────────────────
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

// ─── Account Button ──────────────────────────────────────────────────────────
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

  // ── Not logged in ──
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

  // ── Logged in — Avatar: photo > initials > default icon ──
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
    // Fallback: default SVG person icon
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

  // ── Desktop logged-in button: avatar + "Hi, {firstName}" label ──
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex flex-col items-center gap-0.5 text-[#2D1B4E] px-2 py-1.5 rounded-lg hover:bg-[#F5F3FF] transition-all"
        aria-label="Account menu"
      >
        <Avatar size={26} />
        {/* "Hi, Name" welcome label under the avatar */}
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

// ─── Dropdown Menu Items ─────────────────────────────────────────────────────
function MiniDropdown({ firstName, onLogout, router, setDropdownOpen }) {
  const items = [
    { label: 'My Profile',   icon: '👤', href: '/profile' },
    { label: 'My Orders',    icon: '📦', href: '/orders' },
    { label: 'Wishlist',     icon: '❤️',  href: '/wishlist' },
    { label: 'Settings',     icon: '⚙️',  href: '/settings' },
  ];

  return (
    <>
      {/* Welcome header */}
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

// ─── Main Navbar ─────────────────────────────────────────────────────────────
const Navbar = () => {
  const router = useRouter();
  const { user, profile } = useUser();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen]             = useState(false);
  const [drawerLangOpen, setDrawerLangOpen]         = useState(false);
  const [searchQuery, setSearchQuery]               = useState('');
  const [isScrolled, setIsScrolled]                 = useState(false);
  const [selectedLang, setSelectedLang]             = useState(LANGUAGES[0]);
  const [mobileSubDrawerOpen, setMobileSubDrawerOpen] = useState(false);
  const [selectedMobileCategory, setSelectedMobileCategory] = useState(null);
  const [hoveredCat, setHoveredCat]   = useState(null);
  const [pinnedCat, setPinnedCat]     = useState(null);
  const hoverTimerRef                  = useRef(null);
  const megaMenuRef                    = useRef(null);
  const categoryBarRef                 = useRef(null);
  const langDropdownRef                = useRef(null);
  const langButtonRef                  = useRef(null);
  const cartCount = 0;

  const activeCatLabel = pinnedCat ?? hoveredCat;
  const activeCat = CATEGORIES.find(c => c.label === activeCatLabel) ?? null;
  const megaVisible = !!activeCatLabel;

  // ── Logout handler — uses static imports, no dynamic import needed ──
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
        langButtonRef.current  && !langButtonRef.current.contains(e.target)
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

        {/* ══ DESKTOP ══ */}
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

                {/* Language dropdown */}
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

                {/* Account button */}
                <AccountButton user={user} profile={profile} onLogout={handleLogout} />

                <Link href="/cart" className="flex flex-col items-center gap-0.5 text-[#2D1B4E] px-2 py-1.5 rounded-lg hover:bg-[#F5F3FF] transition-all relative">
                  <span className="relative inline-flex">
                    <ShoppingCart size={22} strokeWidth={1.8} />
                    <span className="absolute -top-1 -right-1 bg-[#2D1B4E] text-white text-[9px] font-extrabold rounded-full h-3.5 min-w-[14px] flex items-center justify-center border-[1.5px] border-white">
                      {cartCount}
                    </span>
                  </span>
                  <span className="text-[0.6rem] font-extrabold tracking-widest uppercase text-[#2D1B4E]">Cart</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Category bar */}
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

        {/* ══ MOBILE ══ */}
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

            {/* Mobile account button */}
            <AccountButton user={user} profile={profile} onLogout={handleLogout} isMobile />

            <Link href="/cart" className="relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#F5F3FF] transition-all text-[#2D1B4E]">
              <ShoppingCart size={24} strokeWidth={1.8} />
              <span className="absolute top-0.5 right-0.5 bg-[#2D1B4E] text-white text-[9px] font-extrabold rounded-full h-4 min-w-[16px] flex items-center justify-center px-0.5">
                {cartCount}
              </span>
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

        {/* ══ MOBILE DRAWER ══ */}
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

              {/* Auth section in drawer */}
              {user ? (
                <div className="px-4 py-3 bg-[#F8F6FF] border-b border-[#EDE9F6]">
                  {/* Avatar + welcome row */}
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

        {/* ══ MOBILE SUB-DRAWER ══ */}
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