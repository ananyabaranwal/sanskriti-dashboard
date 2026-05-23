"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const categories = ["All", "Brass & Bronze", "Wooden Crafts", "Silver Jewellery", "Terracotta", "Paintings", "Coins & Stamps"];

const products = [
  { id: 1,  name: "Antique Brass Ganesh Idol",     category: "Brass & Bronze",   price: 8500,  originalPrice: 12000, age: "~150 years", condition: "Excellent", origin: "Rajasthan",   image: "🏺", featured: true  },
  { id: 2,  name: "Hand-Carved Teak Wood Frame",   category: "Wooden Crafts",    price: 4200,  originalPrice: 6000,  age: "~80 years",  condition: "Good",      origin: "Kerala",      image: "🪵", featured: false },
  { id: 3,  name: "Sterling Silver Anklet Pair",   category: "Silver Jewellery", price: 6800,  originalPrice: 9500,  age: "~100 years", condition: "Excellent", origin: "Gujarat",     image: "💍", featured: true  },
  { id: 4,  name: "Terracotta Horse Figurine",     category: "Terracotta",       price: 2400,  originalPrice: 3500,  age: "~200 years", condition: "Good",      origin: "West Bengal", image: "🏛️", featured: false },
  { id: 5,  name: "Mughal Miniature Painting",     category: "Paintings",        price: 15000, originalPrice: 22000, age: "~300 years", condition: "Restored",  origin: "Agra",        image: "🖼️", featured: true  },
  { id: 6,  name: "East India Company Coin Set",   category: "Coins & Stamps",   price: 3600,  originalPrice: 5000,  age: "~200 years", condition: "Good",      origin: "Bengal",      image: "🪙", featured: false },
  { id: 7,  name: "Bronze Dancing Nataraja",       category: "Brass & Bronze",   price: 18000, originalPrice: 25000, age: "~250 years", condition: "Excellent", origin: "Tamil Nadu",  image: "🏺", featured: true  },
  { id: 8,  name: "Sandalwood Jewellery Box",      category: "Wooden Crafts",    price: 5500,  originalPrice: 7800,  age: "~60 years",  condition: "Excellent", origin: "Mysore",      image: "🪵", featured: false },
  { id: 9,  name: "Tribal Silver Necklace",        category: "Silver Jewellery", price: 9200,  originalPrice: 13000, age: "~120 years", condition: "Good",      origin: "Odisha",      image: "💍", featured: false },
  { id: 10, name: "Madhubani Folk Painting",       category: "Paintings",        price: 7800,  originalPrice: 11000, age: "~50 years",  condition: "Excellent", origin: "Bihar",       image: "🖼️", featured: true  },
  { id: 11, name: "Ancient Terracotta Lamp Set",   category: "Terracotta",       price: 1800,  originalPrice: 2600,  age: "~400 years", condition: "Fragile",   origin: "Harappa",     image: "🏛️", featured: false },
  { id: 12, name: "British India Stamp Collection",category: "Coins & Stamps",   price: 4400,  originalPrice: 6200,  age: "~150 years", condition: "Good",      origin: "Mumbai",      image: "🪙", featured: false },
];

function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(44,24,16,.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px", backdropFilter: "blur(6px)" }}
    >
      <div style={{ background: "#FFFDF9", borderRadius: "20px", padding: "40px 36px", width: "100%", maxWidth: "420px", textAlign: "center", boxShadow: "0 24px 64px rgba(44,24,16,.4)", animation: "scaleIn .3s ease" }}>
        <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "26px" }}>🔒</div>
        <h2 style={{ fontSize: "22px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "10px", fontWeight: "400" }}>Seller Access Required</h2>
        <p style={{ fontSize: "14px", color: "#A08060", lineHeight: "1.75", marginBottom: "28px" }}>
          Sign in to your seller account to view pricing, full product details, and place orders.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/login" style={{ display: "block", padding: "13px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#3D2B1F", fontSize: "14px", fontWeight: "700", textDecoration: "none", letterSpacing: ".02em" }}>
            Sign In to Your Account
          </Link>
          <Link href="/register" style={{ display: "block", padding: "13px", borderRadius: "8px", border: "1.5px solid #E8D5A3", color: "#6B4F12", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
            Register as New Seller
          </Link>
          <button onClick={onClose} style={{ padding: "10px", background: "none", border: "none", color: "#A08060", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
            Continue browsing →
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  p,
  isLoggedIn,
  onLockClick,
}: {
  p: typeof products[0];
  isLoggedIn: boolean;
  onLockClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (!isLoggedIn) onLockClick(); }}
      style={{
        background: "#FFFDF9",
        border: `1px solid ${hovered ? "rgba(201,168,76,.6)" : "#E8D5A3"}`,
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all .25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(61,43,31,.12)" : "0 2px 8px rgba(61,43,31,.04)",
        cursor: isLoggedIn ? "default" : "pointer",
        position: "relative",
      }}
    >
      {/* Featured badge */}
      {p.featured && (
        <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 2, padding: "3px 10px", borderRadius: "99px", background: "rgba(201,168,76,.92)", color: "#3D2B1F", fontSize: "10px", fontWeight: "700", letterSpacing: ".06em" }}>
          FEATURED
        </div>
      )}

      {/* Lock icon */}
      {!isLoggedIn && (
        <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 2, width: "30px", height: "30px", borderRadius: "50%", background: "rgba(44,24,16,.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>
          🔒
        </div>
      )}

      {/* Image */}
      <div style={{ height: "180px", background: "linear-gradient(135deg, #F5E6C8 0%, #FBF7F0 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "72px", position: "relative" }}>
        {p.image}
        <div style={{ position: "absolute", bottom: "10px", right: "10px", padding: "3px 8px", borderRadius: "6px", background: "rgba(44,24,16,.6)", color: "#F5E6C8", fontSize: "10px", backdropFilter: "blur(4px)" }}>
          {p.age}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>
        <div style={{ fontSize: "11px", color: "#A08060", marginBottom: "5px", letterSpacing: ".04em" }}>{p.category}</div>
        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#2C1810", marginBottom: "10px", lineHeight: "1.4", fontFamily: "Georgia, serif" }}>{p.name}</h3>

        {/* Badges */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "#F5E6C8", color: "#6B4F12", border: "1px solid #E8D5A3" }}>📍 {p.origin}</span>
          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: p.condition === "Excellent" ? "#F0FDF4" : p.condition === "Fragile" ? "#FEF2F2" : "#FFFBEB", color: p.condition === "Excellent" ? "#15803d" : p.condition === "Fragile" ? "#dc2626" : "#854d0e", border: `1px solid ${p.condition === "Excellent" ? "#BBF7D0" : p.condition === "Fragile" ? "#FECACA" : "#FDE68A"}` }}>
            {p.condition}
          </span>
        </div>

        {/* Price row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          {isLoggedIn ? (
            <div>
              <div style={{ fontSize: "19px", fontWeight: "700", color: "#2C1810", fontFamily: "Georgia, serif", lineHeight: 1 }}>
                ₹{p.price.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: "11px", color: "#A08060", textDecoration: "line-through", marginTop: "2px" }}>
                ₹{p.originalPrice.toLocaleString("en-IN")}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: "19px", fontWeight: "700", color: "#2C1810", fontFamily: "Georgia, serif", lineHeight: 1, filter: "blur(7px)", userSelect: "none" }}>
                ₹99,999
              </div>
              <div style={{ fontSize: "11px", color: "#A08060", marginTop: "2px" }}>Sign in to view</div>
            </div>
          )}

          {isLoggedIn ? (
            <button style={{ padding: "8px 16px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#3D2B1F", border: "none", fontSize: "12px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap", letterSpacing: ".02em" }}>
              View →
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onLockClick(); }}
              style={{ padding: "8px 14px", borderRadius: "8px", background: "#F5E6C8", color: "#8B6914", border: "1px solid #E8D5A3", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              🔒 Unlock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  const filtered = products
    .filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.origin.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "featured")    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sortBy === "price-low")   return a.price - b.price;
      if (sortBy === "price-high")  return b.price - a.price;
      if (sortBy === "oldest")      return parseInt(b.age) - parseInt(a.age);
      return 0;
    });

  if (!mounted) return null;

  return (
    <div style={{ background: "#FBF7F0", minHeight: "100vh", paddingTop: "72px" }}>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {/* ── PAGE HEADER ── */}
      <div style={{ background: "linear-gradient(160deg, #2C1810 0%, #3D2B1F 100%)", padding: "52px 0 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", position: "relative" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Link href="/" style={{ fontSize: "13px", color: "rgba(201,168,76,.6)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(201,168,76,.3)" }}>›</span>
            <span style={{ fontSize: "13px", color: "rgba(201,168,76,.9)" }}>Gallery</span>
          </div>

          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontFamily: "Georgia, serif", color: "#F5E6C8", marginBottom: "10px", fontWeight: "400" }}>
            Antique Gallery
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(245,230,200,.55)", maxWidth: "520px", lineHeight: "1.65" }}>
            Explore our curated collection of authentic Indian antiques.
            {!isLoggedIn && " Sign in to view pricing and place orders."}
          </p>

          {/* Search + sort */}
          <div style={{ marginTop: "28px", display: "flex", gap: "12px", maxWidth: "560px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", pointerEvents: "none" }}>🔍</span>
              <input
                type="text"
                placeholder="Search antiques, origin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: "8px", border: "1.5px solid rgba(201,168,76,.25)", background: "rgba(255,253,249,.07)", color: "#F5E6C8", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: "11px 14px", borderRadius: "8px", border: "1.5px solid rgba(201,168,76,.25)", background: "rgba(44,24,16,.8)", color: "#C9A84C", fontSize: "13px", outline: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low–High</option>
              <option value="price-high">Price: High–Low</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div style={{ background: "#FFFDF9", borderBottom: "1px solid #E8D5A3", position: "sticky", top: "72px", zIndex: 100 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "12px 0", scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "99px",
                  border: `1px solid ${activeCategory === cat ? "#C9A84C" : "#E8D5A3"}`,
                  background: activeCategory === cat ? "linear-gradient(135deg, #C9A84C, #8B6914)" : "transparent",
                  color: activeCategory === cat ? "#3D2B1F" : "#6B4F12",
                  fontSize: "13px",
                  fontWeight: activeCategory === cat ? "700" : "500",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all .2s",
                  flexShrink: 0,
                  fontFamily: "inherit",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Results bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "14px", color: "#A08060" }}>
            Showing <strong style={{ color: "#2C1810" }}>{filtered.length}</strong> items
            {activeCategory !== "All" && <> in <strong style={{ color: "#8B6914" }}>{activeCategory}</strong></>}
          </p>

          {/* Login warning banner */}
          {!isLoggedIn && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", borderRadius: "8px", background: "#FFFBEB", border: "1px solid #FDE68A" }}>
              <span style={{ fontSize: "14px" }}>🔒</span>
              <span style={{ fontSize: "13px", color: "#854d0e" }}>Sign in to view prices and place orders</span>
              <Link href="/login" style={{ fontSize: "13px", fontWeight: "700", color: "#8B6914", textDecoration: "none", borderBottom: "1px solid rgba(139,105,20,.3)" }}>Sign In →</Link>
            </div>
          )}
        </div>

        {/* Grid or empty state */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ fontSize: "20px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "8px" }}>No items found</h3>
            <p style={{ fontSize: "14px", color: "#A08060", marginBottom: "20px" }}>Try a different search term or category</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              style={{ padding: "10px 22px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#3D2B1F", border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                isLoggedIn={isLoggedIn}
                onLockClick={() => setShowLoginModal(true)}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA for guests */}
        {!isLoggedIn && (
          <div style={{ marginTop: "60px", padding: "48px 40px", borderRadius: "20px", background: "linear-gradient(135deg, #2C1810, #3D2B1F)", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>🏺</div>
              <h3 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#F5E6C8", marginBottom: "12px", fontWeight: "400" }}>Unlock the Full Gallery</h3>
              <p style={{ fontSize: "15px", color: "rgba(245,230,200,.6)", marginBottom: "28px", maxWidth: "440px", margin: "0 auto 28px", lineHeight: "1.75" }}>
                Register as a verified seller to access full pricing, detailed specs, authenticity certificates, and place orders directly.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/register" style={{ padding: "13px 30px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#3D2B1F", fontSize: "14px", fontWeight: "700", textDecoration: "none", letterSpacing: ".02em" }}>
                  Register as Seller →
                </Link>
                <Link href="/login" style={{ padding: "13px 30px", borderRadius: "8px", border: "1.5px solid rgba(201,168,76,.35)", color: "#C9A84C", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
                  Already a Seller? Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
        input::placeholder { color: rgba(245,230,200,.32) !important; }
      `}</style>
    </div>
  );
}
