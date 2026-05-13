"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, useAuth } from "@/lib/firebase/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { db, auth } from "@/lib/firebase/firebase";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = 1.8, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  user:        "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  orders:      "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  heart:       "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  address:     "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z",
  lock:        "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  bell:        "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  logout:      "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  edit:        "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  chevronRight:"M9 18l6-6-6-6",
  check:       "M20 6L9 17l-5-5",
  camera:      "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z",
  package:     "M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  star:        "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  trash:       "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  plus:        "M12 5v14M5 12h14",
  x:           "M18 6L6 18M6 6l12 12",
  eye:         "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeOff:      "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22",
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputCls  = "w-full bg-white border border-[#DDD5F8] rounded-xl px-4 py-3 text-[0.9rem] font-medium text-[#111827] outline-none placeholder:text-[#C4BAD8] focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/10 transition-all";
const labelCls  = "block text-[0.72rem] font-bold text-[#4B3B72] uppercase tracking-[0.055em] mb-1.5";
const btnPrimary = "flex items-center justify-center gap-2 bg-[#2D1B4E] hover:bg-[#3d2568] text-white font-extrabold text-[0.88rem] rounded-xl px-5 py-2.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed";
const btnOrange  = "flex items-center justify-center gap-2 bg-[#2D1B4E] hover:bg-[#3d2568] text-white font-extrabold text-[0.88rem] rounded-xl px-5 py-2.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed";
const btnGhost  = "flex items-center justify-center gap-2 border border-[#DDD5F8] bg-white hover:bg-[#F5F3FF] text-[#4B3B72] font-bold text-[0.88rem] rounded-xl px-5 py-2.5 transition-all";

const Spinner = () => (
  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
  </svg>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, photoURL, size = 80 }) {
  const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size }}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#6D4DB2] to-[#2D1B4E] flex items-center justify-center shrink-0">
      {photoURL
        ? <img src={photoURL} alt={name} className="w-full h-full object-cover" />
        : <span style={{ fontSize: size * 0.32 }} className="font-extrabold text-white tracking-tight">{initials}</span>
      }
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[0.875rem] font-bold transition-all
      ${type === "success" ? "bg-[#1a3a2a] text-[#6ee7a0]" : "bg-[#3a1a1a] text-[#f87171]"}`}>
      {type === "success"
        ? <Icon d={icons.check} size={16} stroke={2.5} />
        : <Icon d={icons.x} size={16} stroke={2.5} />}
      {message}
    </div>
  );
}

// ─── Fullscreen Modal Popup for Mobile ──────────────────────────────────────────────
function FullscreenModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col md:hidden">
      {/* Sticky header */}
      <div className="sticky top-0 bg-white border-b border-[#EDE9FF] px-5 py-4 flex items-center justify-between shrink-0">
        <h3 className="text-[1rem] font-extrabold text-[#2D1B4E]">{title}</h3>
        <button onClick={onClose} className="text-[#9C8EC1] hover:text-[#2D1B4E] p-1">
          <Icon d={icons.x} size={24} stroke={2} />
        </button>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-8">
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EDE9FF] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE9FF]">
        <h3 className="text-[0.85rem] font-extrabold text-[#2D1B4E] uppercase tracking-[0.07em]">{title}</h3>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Mobile Nav Item ──────────────────────────────────────────────────────────
function MobileNavItem({ iconPath, label, sublabel, onClick, danger }) {
  const cls = `flex items-center gap-4 px-5 py-4 hover:bg-[#F7F5FF] transition-colors cursor-pointer ${danger ? "text-red-500" : "text-[#1F1235]"}`;
  return (
    <div className={cls} onClick={onClick}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
        ${danger ? "bg-red-50" : "bg-[#F0ECFF]"}`}>
        <Icon d={iconPath} size={18} stroke={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[0.9rem] font-bold ${danger ? "text-red-500" : "text-[#1F1235]"}`}>{label}</p>
        {sublabel && <p className="text-[0.75rem] font-medium text-[#9C8EC1] truncate">{sublabel}</p>}
      </div>
      {!danger && <Icon d={icons.chevronRight} size={16} stroke={2} />}
    </div>
  );
}

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────
function SideNavItem({ iconPath, label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-bold text-[0.875rem]
        ${active
          ? "bg-[#2D1B4E] text-white"
          : "text-[#4B3B72] hover:bg-[#F0ECFF] hover:text-[#2D1B4E]"}`}>
      <Icon d={iconPath} size={18} stroke={1.8} />
      {label}
    </button>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function PersonalInfoSection({ userData, onSave, saving }) {
  const [form, setForm] = useState({
    fullName: userData?.fullName || "",
    phone:    userData?.phone    || "",
    dob:      userData?.dob      || "",
  });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <SectionCard title="Personal Information"
      action={
        <button onClick={() => onSave(form)} disabled={saving} className={btnPrimary}>
          {saving ? <Spinner /> : <Icon d={icons.check} size={15} stroke={2.5} />}
          {saving ? "Saving…" : "Save"}
        </button>
      }>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className={labelCls}>Full Name</label>
          <input className={inputCls} value={form.fullName} onChange={set("fullName")} placeholder="Your full name" />
        </div>
        <div>
          <label className={labelCls}>Email Address</label>
          <input className={`${inputCls} bg-[#FAFAFA] text-[#9C8EC1] cursor-not-allowed`}
            value={userData?.email || ""} disabled placeholder="Email" />
          <p className="text-[0.7rem] text-[#C4BAD8] mt-1 font-medium">Email cannot be changed here</p>
        </div>
        <div>
          <label className={labelCls}>Phone Number</label>
          <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="+234 000 000 0000" />
        </div>
        <div>
          <label className={labelCls}>Date of Birth</label>
          <input type="date" className={inputCls} value={form.dob} onChange={set("dob")} />
        </div>
        <div>
          <label className={labelCls}>Member Since</label>
          <input className={`${inputCls} bg-[#FAFAFA] text-[#9C8EC1] cursor-not-allowed`}
            value={userData?.createdAt?.toDate
              ? userData.createdAt.toDate().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
              : "—"} disabled />
        </div>
      </div>
    </SectionCard>
  );
}

function OrdersSection({ orders }) {
  const statusColor = {
    delivered:  "bg-emerald-50 text-emerald-700",
    processing: "bg-amber-50 text-amber-700",
    shipped:    "bg-blue-50 text-blue-700",
    cancelled:  "bg-red-50 text-red-600",
  };

  if (!orders?.length) return (
    <SectionCard title="My Orders">
      <div className="flex flex-col items-center py-12 text-center">
        <div className="w-16 h-16 bg-[#F0ECFF] rounded-2xl flex items-center justify-center mb-4">
          <Icon d={icons.package} size={28} stroke={1.5} />
        </div>
        <p className="font-extrabold text-[#2D1B4E] mb-1">No orders yet</p>
        <p className="text-[0.82rem] text-[#9C8EC1] mb-5">When you place an order, it'll appear here</p>
        <Link href="/shop" className={btnOrange}>Start Shopping</Link>
      </div>
    </SectionCard>
  );

  return (
    <SectionCard title="My Orders">
      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="flex items-center gap-4 p-4 bg-[#FAFAFA] rounded-xl border border-[#F0ECFF] hover:border-[#F59E0B]/40 transition-colors">
            <div className="w-12 h-12 bg-[#EDE9FF] rounded-xl flex items-center justify-center shrink-0">
              <Icon d={icons.package} size={20} stroke={1.6} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1F1235] text-[0.9rem] truncate">Order #{order.id?.slice(-6).toUpperCase()}</p>
              <p className="text-[0.75rem] text-[#9C8EC1] font-medium">{order.items} item{order.items !== 1 ? "s" : ""} · {order.date}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <p className="font-extrabold text-[#2D1B4E] text-[0.9rem]">₦{order.total?.toLocaleString()}</p>
              <span className={`text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full capitalize ${statusColor[order.status] || "bg-gray-100 text-gray-600"}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function WishlistSection({ wishlist }) {
  if (!wishlist?.length) return (
    <SectionCard title="Wishlist">
      <div className="flex flex-col items-center py-12 text-center">
        <div className="w-16 h-16 bg-[#F0ECFF] rounded-2xl flex items-center justify-center mb-4">
          <Icon d={icons.heart} size={28} stroke={1.5} />
        </div>
        <p className="font-extrabold text-[#2D1B4E] mb-1">Your wishlist is empty</p>
        <p className="text-[0.82rem] text-[#9C8EC1] mb-5">Save items you love and shop them later</p>
        <Link href="/shop" className={btnOrange}>Browse Products</Link>
      </div>
    </SectionCard>
  );

  return (
    <SectionCard title="Wishlist">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {wishlist.map(item => (
          <div key={item.id} className="group relative bg-[#FAFAFA] rounded-xl border border-[#F0ECFF] overflow-hidden hover:border-[#F59E0B]/40 transition-all">
            <div className="aspect-square bg-[#EDE9FF] flex items-center justify-center">
              {item.image
                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                : <Icon d={icons.package} size={32} stroke={1.4} />}
            </div>
            <div className="p-3">
              <p className="font-bold text-[#1F1235] text-[0.8rem] truncate">{item.name}</p>
              <p className="font-extrabold text-[#2D1B4E] text-[0.875rem] mt-0.5">₦{item.price?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function AddressSection({ addresses, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", line1: "", line2: "", city: "", state: "", default: false });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <SectionCard title="Saved Addresses"
      action={
        <button onClick={() => setShowForm(!showForm)} className={btnGhost}>
          <Icon d={showForm ? icons.x : icons.plus} size={14} stroke={2.5} />
          {showForm ? "Cancel" : "Add Address"}
        </button>
      }>

      {showForm && (
        <div className="mb-5 p-5 bg-[#F7F5FF] rounded-xl border border-[#DDD5F8]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Label (e.g. Home, Work)</label>
              <input className={inputCls} value={form.label} onChange={set("label")} placeholder="Home" />
            </div>
            <div>
              <label className={labelCls}>Street Address</label>
              <input className={inputCls} value={form.line1} onChange={set("line1")} placeholder="12 Adeola Odeku St" />
            </div>
            <div>
              <label className={labelCls}>Apartment / Suite</label>
              <input className={inputCls} value={form.line2} onChange={set("line2")} placeholder="Optional" />
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input className={inputCls} value={form.city} onChange={set("city")} placeholder="Lagos" />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input className={inputCls} value={form.state} onChange={set("state")} placeholder="Lagos State" />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer mb-4">
            <input type="checkbox" checked={form.default} onChange={e => setForm(p => ({ ...p, default: e.target.checked }))}
              className="w-4 h-4 accent-[#F59E0B]" />
            <span className="text-[0.82rem] font-semibold text-[#4B3B72]">Set as default address</span>
          </label>
          <button onClick={() => { onAdd(form); setShowForm(false); setForm({ label: "", line1: "", line2: "", city: "", state: "", default: false }); }}
            className={btnOrange}>
            <Icon d={icons.check} size={15} stroke={2.5} />
            Save Address
          </button>
        </div>
      )}

      {!addresses?.length ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="w-14 h-14 bg-[#F0ECFF] rounded-2xl flex items-center justify-center mb-3">
            <Icon d={icons.address} size={24} stroke={1.5} />
          </div>
          <p className="font-bold text-[#2D1B4E] mb-1 text-[0.9rem]">No saved addresses</p>
          <p className="text-[0.78rem] text-[#9C8EC1]">Add an address for faster checkout</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-[#FAFAFA] rounded-xl border border-[#F0ECFF] hover:border-[#F59E0B]/40 transition-colors">
              <div className="w-9 h-9 bg-[#EDE9FF] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Icon d={icons.address} size={16} stroke={1.8} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-extrabold text-[#1F1235] text-[0.875rem]">{addr.label}</p>
                  {addr.default && (
                    <span className="text-[0.65rem] font-bold px-2 py-0.5 bg-[#EDE9FF] text-[#F59E0B] rounded-full">Default</span>
                  )}
                </div>
                <p className="text-[0.8rem] text-[#7A6B98] font-medium">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                <p className="text-[0.8rem] text-[#7A6B98] font-medium">{addr.city}, {addr.state}</p>
              </div>
              <button onClick={() => onDelete(i)} className="text-[#C4BAD8] hover:text-red-400 transition-colors p-1">
                <Icon d={icons.trash} size={15} stroke={1.8} />
              </button>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function SecuritySection({ onChangePassword, saving }) {
  const [form, setForm]   = useState({ current: "", next: "", confirm: "" });
  const [show, setShow]   = useState({ current: false, next: false, confirm: false });
  const toggle = (k) => setShow(p => ({ ...p, [k]: !p[k] }));
  const set    = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const PasswordField = ({ id, label, field }) => (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <input id={id} type={show[field] ? "text" : "password"} className={`${inputCls} pr-11`}
          value={form[field]} onChange={set(field)} placeholder="••••••••" autoComplete="new-password" />
        <button type="button" onClick={() => toggle(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C8EC1] hover:text-[#2D1B4E] transition-colors">
          <Icon d={show[field] ? icons.eye : icons.eyeOff} size={17} stroke={1.8} />
        </button>
      </div>
    </div>
  );

  return (
    <SectionCard title="Security">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <PasswordField id="cur" label="Current Password" field="current" />
        </div>
        <PasswordField id="new" label="New Password" field="next" />
        <PasswordField id="conf" label="Confirm New Password" field="confirm" />
      </div>
      <div className="mt-5 pt-5 border-t border-[#F0ECFF] flex justify-end">
        <button onClick={() => onChangePassword(form)} disabled={saving} className={btnOrange}>
          {saving ? <Spinner /> : <Icon d={icons.lock} size={15} stroke={2} />}
          {saving ? "Updating…" : "Update Password"}
        </button>
      </div>
    </SectionCard>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "info",      label: "Personal Info",  icon: icons.user    },
  { id: "orders",    label: "My Orders",      icon: icons.orders  },
  { id: "wishlist",  label: "Wishlist",       icon: icons.heart   },
  { id: "addresses", label: "Addresses",      icon: icons.address },
  { id: "security",  label: "Security",       icon: icons.lock    },
];

export default function ProfilePage() {
  const router   = useRouter();
  const { user, loading: authLoading } = useUser();
  const { logout } = useAuth();

  const [userData,    setUserData]    = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab,   setActiveTab]   = useState("info");
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState(null);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Placeholder data — replace with real Firestore collections
  const [orders]    = useState([]);
  const [wishlist]  = useState([]);
  const [addresses, setAddresses] = useState([]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const openModal = (sectionId) => {
    setActiveTab(sectionId);
    setModalOpen(true);
    setModalContent(sectionId);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  // ── Redirect if not logged in ─────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading]);

  // ── Fetch Firestore profile ───────────────────────────────────────────────
  useEffect(() => {
    if (!user?.uid) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setUserData(snap.data());
      } catch (e) {
        console.error("Profile fetch error:", e);
      } finally {
        setFetchLoading(false);
      }
    })();
  }, [user]);

  // ── Save personal info ────────────────────────────────────────────────────
  const handleSaveInfo = async (form) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        fullName: form.fullName,
        phone:    form.phone,
        dob:      form.dob,
      });
      await updateProfile(auth.currentUser, { displayName: form.fullName });
      setUserData(p => ({ ...p, ...form }));
      showToast("Profile updated successfully");
      closeModal();
    } catch (e) {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ───────────────────────────────────────────────────────
  const handleChangePassword = async ({ current, next, confirm }) => {
    if (!next || next !== confirm) { showToast("Passwords don't match", "error"); return; }
    if (next.length < 8)           { showToast("Password must be 8+ characters", "error"); return; }
    setSaving(true);
    try {
      await updatePassword(auth.currentUser, next);
      showToast("Password updated successfully");
      closeModal();
    } catch (e) {
      if (e.code === "auth/requires-recent-login")
        showToast("Please log out and log back in first", "error");
      else showToast("Failed to update password", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Address handlers ──────────────────────────────────────────────────────
  const handleAddAddress = async (addr) => {
    const updated = [...addresses, addr];
    setAddresses(updated);
    await updateDoc(doc(db, "users", user.uid), { addresses: updated });
    showToast("Address saved");
    closeModal();
  };

  const handleDeleteAddress = async (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    await updateDoc(doc(db, "users", user.uid), { addresses: updated });
    showToast("Address removed");
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (authLoading || fetchLoading) return (
    <div className="min-h-dvh bg-[#F7F5FF] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#EDE9FF] flex items-center justify-center animate-pulse">
          <Icon d={icons.user} size={22} stroke={1.6} />
        </div>
        <p className="text-[0.82rem] font-bold text-[#9C8EC1] tracking-wide">Loading profile…</p>
      </div>
    </div>
  );

  if (!user) return null;

  const sectionProps = { userData, orders, wishlist, addresses, saving };

  const renderSection = () => {
    switch (activeTab) {
      case "info":      return <PersonalInfoSection {...sectionProps} onSave={handleSaveInfo} />;
      case "orders":    return <OrdersSection {...sectionProps} />;
      case "wishlist":  return <WishlistSection {...sectionProps} />;
      case "addresses": return <AddressSection {...sectionProps} onAdd={handleAddAddress} onDelete={handleDeleteAddress} />;
      case "security":  return <SecuritySection {...sectionProps} onChangePassword={handleChangePassword} />;
      default:          return null;
    }
  };

  const displayName = userData?.fullName || user.displayName || "User";
  const memberSince = userData?.createdAt?.toDate
    ? userData.createdAt.toDate().toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    : "";

  return (
    <div className="min-h-dvh bg-[#F7F5FF]">

      {/* ════════════════════════════════════════════════════════════════════
          MOBILE  (< md) - Fullscreen Popup Modals
      ════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col min-h-dvh">

        {/* Mobile header */}
        <div className="bg-white border-b border-[#EDE9FF] px-5 pt-12 pb-5">
          <div className="flex items-center gap-4">
            <Avatar name={displayName} photoURL={user.photoURL} size={60} />
            <div className="flex-1 min-w-0">
              <h1 className="text-[1.1rem] font-extrabold text-[#1F1235] truncate">{displayName}</h1>
              <p className="text-[0.77rem] font-medium text-[#9C8EC1] truncate">{userData?.email || user.email}</p>
              {memberSince && (
                <p className="text-[0.7rem] font-bold text-[#C4BAD8] mt-0.5">Member since {memberSince}</p>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            {[
              { label: "Orders",    value: orders.length   },
              { label: "Wishlist",  value: wishlist.length },
              { label: "Addresses", value: addresses.length},
            ].map(s => (
              <div key={s.label} className="bg-[#F7F5FF] rounded-xl py-3 text-center border border-[#EDE9FF]">
                <p className="text-[1.1rem] font-extrabold text-[#2D1B4E]">{s.value}</p>
                <p className="text-[0.68rem] font-bold text-[#9C8EC1] uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile nav list - opens modals */}
        <div className="flex-1 py-3">
          <div className="bg-white rounded-2xl mx-4 mt-2 border border-[#EDE9FF] overflow-hidden divide-y divide-[#F5F3FF]">
            {NAV_ITEMS.map(item => (
              <MobileNavItem key={item.id} iconPath={item.icon} label={item.label}
                sublabel={
                  item.id === "orders"    ? `${orders.length} order${orders.length !== 1 ? "s" : ""}` :
                  item.id === "wishlist"  ? `${wishlist.length} saved item${wishlist.length !== 1 ? "s" : ""}` :
                  item.id === "addresses" ? `${addresses.length} address${addresses.length !== 1 ? "es" : ""}` :
                  undefined
                }
                onClick={() => openModal(item.id)}
              />
            ))}
          </div>

          {/* Logout */}
          <div className="bg-white rounded-2xl mx-4 mt-4 border border-[#EDE9FF] overflow-hidden mb-8">
            <MobileNavItem iconPath={icons.logout} label="Sign Out"
              sublabel="You will be logged out" onClick={handleLogout} danger />
          </div>
        </div>
      </div>

      {/* Mobile Fullscreen Modal */}
      <FullscreenModal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        title={NAV_ITEMS.find(n => n.id === modalContent)?.label || ""}
      >
        {renderSection()}
      </FullscreenModal>

      {/* ════════════════════════════════════════════════════════════════════
          DESKTOP  (≥ md)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block">
        {/* Top bar */}
        <div className="bg-white border-b border-[#EDE9FF] px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-[0.82rem] font-bold text-[#9C8EC1] hover:text-[#F59E0B] transition-colors flex items-center gap-1.5">
            <Icon d="M19 12H5M12 5l-7 7 7 7" size={14} stroke={2.5} />
            Back to shop
          </Link>
          <p className="text-[0.72rem] font-extrabold text-[#C4BAD8] uppercase tracking-[0.12em]">My Account</p>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-[0.82rem] font-bold text-[#9C8EC1] hover:text-red-400 transition-colors">
            <Icon d={icons.logout} size={15} stroke={2} />
            Sign out
          </button>
        </div>

        <div className="max-w-[1100px] mx-auto px-8 py-10">
          <div className="flex gap-8">

            {/* ── Sidebar ── */}
            <aside className="w-[260px] shrink-0">
              {/* Profile card */}
              <div className="bg-white rounded-2xl border border-[#EDE9FF] p-6 mb-4">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar name={displayName} photoURL={user.photoURL} size={80} />
                  </div>
                  <h2 className="font-extrabold text-[#1F1235] text-[1rem] mb-0.5">{displayName}</h2>
                  <p className="text-[0.77rem] font-medium text-[#9C8EC1] break-all">{userData?.email || user.email}</p>
                  {memberSince && (
                    <p className="text-[0.7rem] font-bold text-[#C4BAD8] mt-1.5">Member since {memberSince}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-[#F0ECFF]">
                  {[
                    { label: "Orders",   value: orders.length    },
                    { label: "Saved",    value: wishlist.length  },
                    { label: "Addr.",    value: addresses.length },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-[1.1rem] font-extrabold text-[#2D1B4E]">{s.value}</p>
                      <p className="text-[0.65rem] font-bold text-[#C4BAD8] uppercase tracking-wide">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nav */}
              <nav className="bg-white rounded-2xl border border-[#EDE9FF] p-3 space-y-1">
                {NAV_ITEMS.map(item => (
                  <SideNavItem key={item.id} iconPath={item.icon} label={item.label}
                    active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
                ))}
                <div className="pt-2 mt-2 border-t border-[#F0ECFF]">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-bold text-[0.875rem] text-red-400 hover:bg-red-50">
                    <Icon d={icons.logout} size={18} stroke={1.8} />
                    Sign Out
                  </button>
                </div>
              </nav>
            </aside>

            {/* ── Main content ── */}
            <main className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-5 text-[0.77rem] font-bold text-[#C4BAD8]">
                <span>Account</span>
                <Icon d={icons.chevronRight} size={12} stroke={2.5} />
                <span className="text-[#F59E0B]">{NAV_ITEMS.find(n => n.id === activeTab)?.label}</span>
              </div>

              {renderSection()}
            </main>
          </div>
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}