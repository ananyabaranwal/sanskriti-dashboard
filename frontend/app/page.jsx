"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────
// DESIGN: White base · Crimson #C41E3A accent
// Fonts:  Playfair Display (headings) + DM Sans (body)
// ─────────────────────────────────────────────────────────────

const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ── STATIC DATA ───────────────────────────────────────────────

const STATS = [
  { value: "1L+",   label: "Products"   },
  { value: "25+",   label: "Categories" },
  { value: "5000+", label: "Sellers"    },
  { value: "12+",   label: "Years"      },
];

const SERVICES = [
  { icon: "🛍️", title: "E-Commerce Setup",     desc: "Amazon, Flipkart & website setup — account to first order, completely managed." },
  { icon: "✦",  title: "Branding",             desc: "Logo, brand kit, packaging, Amazon storefront — your identity, built premium." },
  { icon: "🏭", title: "Manufacturing Setup",  desc: "Factory setup, machinery, QC systems, and workforce — all under one program." },
  { icon: "📦", title: "Inventory Management", desc: "Zero-error stock control for 1 lakh+ SKUs with our proprietary system." },
  { icon: "📸", title: "Photoshoot",           desc: "Studio & lifestyle photography. Amazon-compliant. Catalogue-ready." },
  { icon: "🎬", title: "Instagram Videos",     desc: "Scroll-stopping reels and brand films that drive genuine product discovery." },
  { icon: "📊", title: "Business Consultancy", desc: "Pricing, margins, scaling — from practitioners who've built real businesses." },
  { icon: "🎓", title: "Training Programs",    desc: "Master e-commerce from scratch or scale what you already have. 25+ courses." },
];

const GALLERY_ITEMS = [
  { id: 1, name: "Brass Ganesh Idol",        cat: "Idols & Figurines", emoji: "🏺", bg: "#F5EDE8", tag: "Bestseller"   },
  { id: 2, name: "Handwoven Pashmina Shawl", cat: "Textiles",          emoji: "🧣", bg: "#EDF0F5", tag: "New"          },
  { id: 3, name: "Tanjore Painting",         cat: "Art & Paintings",   emoji: "🖼️", bg: "#EFF5ED", tag: "Featured"     },
  { id: 4, name: "Silver Tribal Necklace",   cat: "Jewellery",         emoji: "💎", bg: "#F0EDF5", tag: "Premium"      },
  { id: 5, name: "Sandalwood Jewellery Box", cat: "Wooden Crafts",     emoji: "🪵", bg: "#F5F0E8", tag: "Bestseller"   },
  { id: 6, name: "Madhubani Painting",       cat: "Art & Paintings",   emoji: "🎨", bg: "#F5EDF2", tag: "New"          },
  { id: 7, name: "Terracotta Lamp Set",      cat: "Home Décor",        emoji: "🪔", bg: "#F5EDE8", tag: "Festival Pick" },
  { id: 8, name: "Bronze Nataraja",          cat: "Idols & Figurines", emoji: "🗿", bg: "#EDF3F5", tag: "Heritage"     },
];

const VIDEOS = [
  { id: 1, title: "Launch on Amazon in 7 Days",       cat: "E-Commerce",  dur: "24:10", views: "15.2K", free: true  },
  { id: 2, title: "Brand Building from Zero",         cat: "Branding",    dur: "31:45", views: "12.4K", free: false },
  { id: 3, title: "Product Photography Secrets",      cat: "Photoshoot",  dur: "18:24", views: "18.6K", free: true  },
  { id: 4, title: "GST & Compliance for Sellers",     cat: "Finance",     dur: "22:08", views: "7.3K",  free: false },
  { id: 5, title: "Instagram Reels That Convert",     cat: "Social Media",dur: "19:33", views: "21.1K", free: false },
  { id: 6, title: "Inventory Management Masterclass", cat: "Operations",  dur: "28:17", views: "9.8K",  free: false },
];

const CATS = [
  "Home Décor","Jewellery","Textiles","Art & Paintings",
  "Wooden Crafts","Idols & Figurines","Pooja Items",
  "Organic Foods","Ayurveda","Accessories","Pottery","Sculptures",
];

const HERO_LINES = [
  "Grow Your Business.",
  "Sell on Amazon.",
  "Build Your Brand.",
  "Train. Scale. Win.",
];

// ── LOGIN MODAL ───────────────────────────────────────────────
function LoginModal({ onClose }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,.52)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: "20px",
        backdropFilter: "blur(6px)",
        animation: "sk-fadeIn .22s ease",
      }}
    >
      <div style={{
        background: "#fff", borderRadius: "20px",
        padding: "48px 40px", width: "100%", maxWidth: "420px",
        textAlign: "center",
        boxShadow: "0 32px 80px rgba(0,0,0,.18)",
        animation: "sk-slideUp .28s ease",
        position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "16px", right: "18px", background: "none", border: "none", fontSize: "22px", color: "#aaa", cursor: "pointer" }}
        >×</button>
        <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(135deg,#C41E3A,#8B0020)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🎬</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "26px", fontWeight: 600, color: "#111", marginBottom: "10px" }}>Seller Access Required</h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: "#666", lineHeight: 1.7, marginBottom: "30px" }}>
          Sign in to your verified seller account to watch full training videos and access the complete library.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href="/login" style={{ display: "block", padding: "14px", borderRadius: "10px", background: "linear-gradient(135deg,#C41E3A,#8B0020)", color: "#fff", fontSize: "14px", fontWeight: 600, textDecoration: "none", letterSpacing: ".06em", fontFamily: "'DM Sans',sans-serif" }}>
            Sign In to Watch →
          </Link>
          <Link href="/register" style={{ display: "block", padding: "14px", borderRadius: "10px", border: "1.5px solid #e5e5e5", color: "#333", fontSize: "14px", fontWeight: 500, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
            Register as New Seller
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── GALLERY POPUP ─────────────────────────────────────────────
function GalleryPopup({ item, onClose }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,.58)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9998, padding: "20px",
        backdropFilter: "blur(10px)",
        animation: "sk-fadeIn .22s ease",
      }}
    >
      <div style={{ background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "460px", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.22)", animation: "sk-scaleIn .28s ease", position: "relative" }}>
        {/* Image */}
        <div style={{ height: "260px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <span style={{ fontSize: "88px", display: "block", animation: "sk-float 3s ease-in-out infinite" }}>{item.emoji}</span>
          <div style={{ position: "absolute", top: "14px", left: "14px", padding: "5px 12px", borderRadius: "99px", background: "#C41E3A", color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: ".08em", fontFamily: "'DM Sans',sans-serif" }}>{item.tag}</div>
          <button onClick={onClose} style={{ position: "absolute", top: "12px", right: "12px", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,.9)", border: "none", fontSize: "18px", color: "#444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {/* Body */}
        <div style={{ padding: "24px 28px 28px" }}>
          <div style={{ fontSize: "11px", color: "#C41E3A", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "'DM Sans',sans-serif" }}>{item.cat}</div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "24px", fontWeight: 600, color: "#111", marginBottom: "18px", lineHeight: 1.2 }}>{item.name}</h3>
          {/* Blurred price */}
          <div style={{ background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "14px 16px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "4px", fontFamily: "'DM Sans',sans-serif" }}>Seller Price</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "22px", fontWeight: 700, color: "#111", filter: "blur(5px)", userSelect: "none", fontFamily: "'DM Sans',sans-serif" }}>₹8,500</span>
                <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "6px", background: "rgba(196,30,58,.07)", color: "#C41E3A", fontWeight: 600, border: "1px solid rgba(196,30,58,.15)", fontFamily: "'DM Sans',sans-serif" }}>🔒 Login to View</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/login" style={{ flex: 1, padding: "13px", borderRadius: "10px", background: "linear-gradient(135deg,#C41E3A,#8B0020)", color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>Login to Order →</Link>
            <Link href="/gallery" style={{ flex: 1, padding: "13px", borderRadius: "10px", border: "1.5px solid #e5e5e5", color: "#333", fontSize: "13px", fontWeight: 500, textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>View Gallery</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────
function Navbar({ scrolled }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      height: "68px", display: "flex", alignItems: "center", padding: "0 48px",
      background: scrolled ? "rgba(255,255,255,.97)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,0,0,.07)" : "none",
      transition: "all .35s ease",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "11px", textDecoration: "none" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#C41E3A,#8B0020)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: "18px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>S</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "18px", fontWeight: 600, color: "#111", lineHeight: 1 }}>Sanskriti</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", letterSpacing: ".2em", color: "#C41E3A", textTransform: "uppercase", marginTop: "1px" }}>The Antique</div>
          </div>
        </Link>
        {/* Links */}
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {[["Services","/services"],["Gallery","/gallery"],["Videos","/videos"],["About","/about"]].map(([l, h]) => (
            <Link key={l} href={h} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 500, color: "#333", textDecoration: "none" }}>{l}</Link>
          ))}
          <a href="https://sanskrititheantique.com/" target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 500, color: "#333", textDecoration: "none", padding: "8px 18px", borderRadius: "6px", border: "1.5px solid #ddd" }}>
            Shop →
          </a>
          <Link href="/login" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "#fff", background: "linear-gradient(135deg,#C41E3A,#8B0020)", padding: "9px 22px", borderRadius: "6px", textDecoration: "none" }}>
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
export default function SanskritiHomepage() {
  const [scrolled,    setScrolled]    = useState(false);
  const [showLogin,   setShowLogin]   = useState(false);
  const [galleryItem, setGalleryItem] = useState(null);
  const [heroLine,    setHeroLine]    = useState(0);
  const [isLoggedIn,  setIsLoggedIn]  = useState(false);
  const sectionRefs = useRef({});
  const [visibleSections, setVisibleSections] = useState(new Set());

  // ── scroll listener ──────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── hero line rotator ────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setHeroLine(l => (l + 1) % HERO_LINES.length), 3000);
    return () => clearInterval(t);
  }, []);

  // ── auth check ───────────────────────────────────────────
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  // ── intersection observer for scroll reveals ─────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, e.target.dataset.sec]));
          }
        });
      },
      { threshold: 0.12 }
    );
    Object.values(sectionRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const secRef = id => el => {
    if (el) { el.dataset.sec = id; sectionRefs.current[id] = el; }
  };
  const vis = id => visibleSections.has(id);

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#fff", color: "#111", overflowX: "hidden" }}>
      <style>{`
        ${GF}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes sk-fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes sk-slideUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sk-scaleIn  { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
        @keyframes sk-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes sk-marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes sk-heroIn   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sk-reveal   { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sk-blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        .sk-srv:hover  { border-color:rgba(196,30,58,.25)!important; transform:translateY(-5px)!important; box-shadow:0 16px 40px rgba(196,30,58,.08)!important; }
        .sk-gal:hover  { transform:translateY(-6px) scale(1.01)!important; box-shadow:0 20px 48px rgba(0,0,0,.13)!important; }
        .sk-gal:hover .sk-ov { opacity:1!important; }
        .sk-vid:hover  { border-color:rgba(196,30,58,.3)!important; transform:translateY(-4px)!important; }
      `}</style>

      {showLogin   && <LoginModal   onClose={() => setShowLogin(false)} />}
      {galleryItem && <GalleryPopup item={galleryItem} onClose={() => setGalleryItem(null)} />}

      <Navbar scrolled={scrolled} />

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 48px 80px", background: "#fff", position: "relative", overflow: "hidden", textAlign: "center" }}>
        {/* grid bg */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(196,30,58,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(196,30,58,.02) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        {/* glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "480px", background: "radial-gradient(ellipse,rgba(196,30,58,.05) 0%,transparent 65%)", pointerEvents: "none" }} />

        {/* eyebrow */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "7px 18px", borderRadius: "99px", border: "1px solid rgba(196,30,58,.2)", background: "rgba(196,30,58,.04)", marginBottom: "32px", animation: "sk-slideUp .7s ease both" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C41E3A", animation: "sk-blink 2s infinite" }} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", letterSpacing: ".16em", textTransform: "uppercase", color: "#C41E3A", fontWeight: 600 }}>India's Premier Seller Platform</span>
        </div>

        {/* heading */}
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,7vw,88px)", fontWeight: 700, color: "#111", lineHeight: 1.05, marginBottom: "16px", animation: "sk-slideUp .8s .1s ease both" }}>
          Sanskriti
          <span style={{ display: "block", fontStyle: "italic", color: "#C41E3A", fontWeight: 400 }}>The Antique</span>
        </h1>

        {/* rotating subline */}
        <div style={{ height: "48px", overflow: "hidden", marginBottom: "22px" }}>
          <span key={heroLine} style={{ display: "block", fontFamily: "'Playfair Display',serif", fontSize: "clamp(20px,3vw,34px)", color: "#666", fontWeight: 400, fontStyle: "italic", animation: "sk-heroIn .5s ease both" }}>
            {HERO_LINES[heroLine]}
          </span>
        </div>

        <p style={{ maxWidth: "560px", fontSize: "16px", color: "#666", lineHeight: 1.85, marginBottom: "44px", animation: "sk-slideUp 1s .2s ease both" }}>
          From e-commerce setup to branding, photoshoots to training — everything a seller needs across{" "}
          <strong style={{ color: "#111" }}>25+ categories</strong> with{" "}
          <strong style={{ color: "#111" }}>1 lakh+ products</strong>.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center", animation: "sk-slideUp 1s .3s ease both" }}>
          <Link href="/register" style={{ padding: "15px 40px", borderRadius: "8px", background: "linear-gradient(135deg,#C41E3A,#8B0020)", color: "#fff", fontSize: "14px", fontWeight: 600, letterSpacing: ".08em", textDecoration: "none", boxShadow: "0 12px 32px rgba(196,30,58,.28)" }}>
            Join as Seller →
          </Link>
          <a href="https://sanskrititheantique.com/" target="_blank" rel="noreferrer" style={{ padding: "15px 40px", borderRadius: "8px", border: "1.5px solid #ddd", color: "#333", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
            Shop Products
          </a>
        </div>

        {/* stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "#f0f0f0", borderRadius: "16px", overflow: "hidden", marginTop: "72px", width: "100%", maxWidth: "680px", animation: "sk-slideUp 1s .45s ease both" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ padding: "22px 12px", background: "#fff", textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "30px", fontWeight: 700, color: "#C41E3A", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#999", letterSpacing: ".12em", textTransform: "uppercase", marginTop: "5px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* scroll cue */}
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "1px", height: "44px", background: "linear-gradient(to bottom,transparent,rgba(196,30,58,.4))" }} />
          <span style={{ fontSize: "9px", color: "#ccc", letterSpacing: ".18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>scroll</span>
        </div>
      </section>

      {/* ══ MARQUEE ══════════════════════════════════════════ */}
      <div style={{ borderTop: "1px solid #f5f5f5", borderBottom: "1px solid #f5f5f5", padding: "13px 0", overflow: "hidden", background: "#fafafa" }}>
        <div style={{ display: "flex", animation: "sk-marquee 24s linear infinite", width: "max-content" }}>
          {[...CATS, ...CATS].map((c, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 26px", fontSize: "11px", fontWeight: 500, color: "#888", letterSpacing: ".1em", textTransform: "uppercase", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" }}>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#C41E3A", opacity: .5, flexShrink: 0 }} />{c}
            </span>
          ))}
        </div>
      </div>

      {/* ══ WHY JOIN ═════════════════════════════════════════ */}
      <section
        ref={secRef("why")}
        style={{ padding: "100px 48px", maxWidth: "1280px", margin: "0 auto", opacity: vis("why") ? 1 : 0, transform: vis("why") ? "none" : "translateY(40px)", transition: "all .7s ease" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: "99px", background: "rgba(196,30,58,.06)", border: "1px solid rgba(196,30,58,.15)", fontSize: "11px", fontWeight: 600, color: "#C41E3A", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: "22px", fontFamily: "'DM Sans',sans-serif" }}>
              Why Join Sanskriti?
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, color: "#111", lineHeight: 1.1, marginBottom: "18px" }}>
              More than a marketplace.
              <span style={{ display: "block", fontStyle: "italic", color: "#C41E3A", fontWeight: 400 }}>An ecosystem.</span>
            </h2>
            <p style={{ fontSize: "16px", color: "#555", lineHeight: 1.85, marginBottom: "14px" }}>
              A complete platform that transforms artisans and entrepreneurs into thriving digital-first businesses.
            </p>
            <p style={{ fontSize: "16px", color: "#555", lineHeight: 1.85, marginBottom: "34px" }}>
              We serve <strong style={{ color: "#111" }}>25+ product categories</strong> with over <strong style={{ color: "#111" }}>1 lakh products</strong> — handling every step from brand creation to your first sale.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/register" style={{ padding: "13px 30px", borderRadius: "8px", background: "linear-gradient(135deg,#C41E3A,#8B0020)", color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                Start Your Journey →
              </Link>
              <Link href="/services" style={{ padding: "13px 30px", borderRadius: "8px", border: "1.5px solid #ddd", color: "#333", fontSize: "13px", fontWeight: 500, textDecoration: "none" }}>
                See All Services
              </Link>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              ["🛒","Complete Setup","Amazon, website, GST — fully managed."],
              ["📸","Pro Media","Photography, reels, brand creatives."],
              ["🎓","Expert Training","25+ courses by real practitioners."],
              ["📦","Zero-Error Inventory","Manage 1L+ SKUs without a miss."],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ background: "#fafafa", borderRadius: "16px", padding: "22px 18px", border: "1px solid #f0f0f0", transition: "all .25s" }}>
                <div style={{ fontSize: "22px", marginBottom: "10px" }}>{icon}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "16px", fontWeight: 600, color: "#111", marginBottom: "5px" }}>{title}</div>
                <div style={{ fontSize: "13px", color: "#888", lineHeight: 1.65, fontFamily: "'DM Sans',sans-serif" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ═════════════════════════════════════════ */}
      <section
        ref={secRef("srv")}
        style={{ background: "#f8f8f8", padding: "100px 48px", opacity: vis("srv") ? 1 : 0, transform: vis("srv") ? "none" : "translateY(40px)", transition: "all .7s ease" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: "99px", background: "rgba(196,30,58,.06)", border: "1px solid rgba(196,30,58,.15)", fontSize: "11px", fontWeight: 600, color: "#C41E3A", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: "16px", fontFamily: "'DM Sans',sans-serif" }}>
              What We Offer
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,4vw,50px)", fontWeight: 700, color: "#111", lineHeight: 1.1 }}>
              Everything a seller needs.
              <span style={{ display: "block", fontStyle: "italic", fontWeight: 400, color: "#C41E3A" }}>Under one roof.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="sk-srv"
                style={{ background: "#fff", borderRadius: "16px", padding: "28px 22px", border: "1px solid #eee", transition: "all .3s ease", animation: vis("srv") ? `sk-reveal .5s ${i * 0.07}s ease both` : "none" }}
              >
                <div style={{ fontSize: "24px", marginBottom: "12px" }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "19px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", color: "#777", lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GALLERY ══════════════════════════════════════════ */}
      <section
        ref={secRef("gal")}
        style={{ padding: "100px 48px", background: "#fff", opacity: vis("gal") ? 1 : 0, transform: vis("gal") ? "none" : "translateY(40px)", transition: "all .7s ease" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "44px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: "99px", background: "rgba(196,30,58,.06)", border: "1px solid rgba(196,30,58,.15)", fontSize: "11px", fontWeight: 600, color: "#C41E3A", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: "14px", fontFamily: "'DM Sans',sans-serif" }}>
                Product Gallery
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4vw,48px)", fontWeight: 700, color: "#111", lineHeight: 1.1 }}>
                A glimpse of <span style={{ fontStyle: "italic", fontWeight: 400, color: "#C41E3A" }}>our collection.</span>
              </h2>
              <p style={{ fontSize: "15px", color: "#777", marginTop: "10px", fontFamily: "'DM Sans',sans-serif" }}>
                Click any product to preview.{" "}
                <strong style={{ color: "#C41E3A" }}>Prices visible to registered sellers only.</strong>
              </p>
            </div>
            <Link href="/gallery" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "11px 24px", borderRadius: "8px", border: "1.5px solid #ddd", color: "#333", fontSize: "13px", fontWeight: 500, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
              View Full Gallery →
            </Link>
          </div>

          {/* 4-column grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
            {GALLERY_ITEMS.map((item, i) => (
              <div
                key={item.id}
                className="sk-gal"
                onClick={() => setGalleryItem(item)}
                style={{ borderRadius: "16px", overflow: "hidden", cursor: "pointer", transition: "all .3s ease", boxShadow: "0 2px 12px rgba(0,0,0,.06)", border: "1px solid #f0f0f0", position: "relative", animation: vis("gal") ? `sk-reveal .5s ${i * 0.07}s ease both` : "none" }}
              >
                {/* product image */}
                <div style={{ height: "190px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <span style={{ fontSize: "60px" }}>{item.emoji}</span>
                  {/* hover overlay */}
                  <div className="sk-ov" style={{ position: "absolute", inset: 0, background: "rgba(196,30,58,.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity .25s ease" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "50%", border: "2px solid rgba(255,255,255,.7)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "20px", marginBottom: "6px" }}>+</div>
                    <span style={{ fontSize: "12px", color: "#fff", fontWeight: 600, letterSpacing: ".06em", fontFamily: "'DM Sans',sans-serif" }}>Quick View</span>
                  </div>
                  {/* tag badge */}
                  <div style={{ position: "absolute", top: "10px", left: "10px", padding: "3px 9px", borderRadius: "99px", background: "#fff", color: "#C41E3A", fontSize: "10px", fontWeight: 700, letterSpacing: ".08em", boxShadow: "0 2px 8px rgba(0,0,0,.1)", fontFamily: "'DM Sans',sans-serif" }}>{item.tag}</div>
                </div>
                {/* info */}
                <div style={{ padding: "12px 14px", background: "#fff" }}>
                  <div style={{ fontSize: "10px", color: "#C41E3A", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px", fontFamily: "'DM Sans',sans-serif" }}>{item.cat}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "14px", fontWeight: 600, color: "#111", marginBottom: "8px", lineHeight: 1.3 }}>{item.name}</div>
                  {/* blurred price */}
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#111", filter: "blur(4.5px)", userSelect: "none", fontFamily: "'DM Sans',sans-serif" }}>₹8,500</span>
                    <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "5px", background: "rgba(196,30,58,.07)", color: "#C41E3A", fontWeight: 600, border: "1px solid rgba(196,30,58,.12)", fontFamily: "'DM Sans',sans-serif" }}>🔒 Login</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* unlock strip */}
          <div style={{ marginTop: "32px", padding: "18px 24px", borderRadius: "14px", background: "#fafafa", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
            <div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "18px", fontWeight: 600, color: "#111" }}>1,00,000+ products</span>
              <span style={{ fontSize: "14px", color: "#888", marginLeft: "10px", fontFamily: "'DM Sans',sans-serif" }}>across 25+ categories. Register to view pricing.</span>
            </div>
            <Link href="/register" style={{ padding: "11px 26px", borderRadius: "8px", background: "linear-gradient(135deg,#C41E3A,#8B0020)", color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none", boxShadow: "0 6px 20px rgba(196,30,58,.22)", fontFamily: "'DM Sans',sans-serif" }}>
              Register to Unlock →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TRAINING VIDEOS ══════════════════════════════════ */}
      <section
        ref={secRef("vid")}
        style={{ background: "#f8f8f8", padding: "100px 48px", opacity: vis("vid") ? 1 : 0, transform: vis("vid") ? "none" : "translateY(40px)", transition: "all .7s ease" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "44px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: "99px", background: "rgba(196,30,58,.06)", border: "1px solid rgba(196,30,58,.15)", fontSize: "11px", fontWeight: 600, color: "#C41E3A", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: "14px", fontFamily: "'DM Sans',sans-serif" }}>Training Library</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4vw,48px)", fontWeight: 700, color: "#111", lineHeight: 1.1 }}>
                Learn from <span style={{ fontStyle: "italic", fontWeight: 400, color: "#C41E3A" }}>the best.</span>
              </h2>
              <p style={{ fontSize: "15px", color: "#777", marginTop: "10px", fontFamily: "'DM Sans',sans-serif" }}>
                Expert courses on Amazon, branding & operations.{" "}
                <strong style={{ color: "#111" }}>Locked for registered sellers.</strong>
              </p>
            </div>
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "11px 24px", borderRadius: "8px", border: "1.5px solid #ddd", color: "#333", fontSize: "13px", fontWeight: 500, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
              View All Videos →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
            {VIDEOS.map((v, i) => (
              <div
                key={v.id}
                className="sk-vid"
                onClick={() => !v.free && setShowLogin(true)}
                style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #eee", transition: "all .3s ease", cursor: "pointer", animation: vis("vid") ? `sk-reveal .5s ${i * 0.08}s ease both` : "none" }}
              >
                <div style={{ height: "140px", background: "linear-gradient(135deg,#111 0%,#2a0a10 60%,#3d0e1e 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: v.free ? "rgba(196,30,58,.9)" : "rgba(255,255,255,.1)", border: "2px solid rgba(255,255,255,.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", color: "#fff" }}>
                    {v.free ? "▶" : "🔒"}
                  </div>
                  {v.free && <div style={{ position: "absolute", top: "10px", left: "10px", padding: "3px 9px", borderRadius: "99px", background: "rgba(34,197,94,.85)", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: ".08em", fontFamily: "'DM Sans',sans-serif" }}>FREE</div>}
                  <div style={{ position: "absolute", bottom: "9px", right: "9px", padding: "3px 7px", borderRadius: "5px", background: "rgba(0,0,0,.6)", color: "rgba(255,255,255,.8)", fontSize: "11px", fontFamily: "'DM Sans',sans-serif" }}>{v.dur}</div>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: "10px", color: "#C41E3A", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "5px", fontFamily: "'DM Sans',sans-serif" }}>{v.cat}</div>
                  <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: "15px", fontWeight: 600, color: "#111", lineHeight: 1.35 }}>{v.title}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* CTA band */}
          <div style={{ marginTop: "48px", borderRadius: "20px", background: "linear-gradient(135deg,#111 0%,#1e0508 50%,#2d0b18 100%)", padding: "52px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(196,30,58,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(196,30,58,.04) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>Ready to unlock the full library?</h3>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,.5)", marginBottom: "32px", maxWidth: "460px", margin: "0 auto 32px", lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif" }}>
                Join 5,000+ sellers who have built real businesses with Sanskriti's training and tools.
              </p>
              <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/register" style={{ padding: "14px 36px", borderRadius: "8px", background: "linear-gradient(135deg,#C41E3A,#8B0020)", color: "#fff", fontSize: "14px", fontWeight: 600, letterSpacing: ".08em", textDecoration: "none", boxShadow: "0 12px 32px rgba(196,30,58,.4)", fontFamily: "'DM Sans',sans-serif" }}>
                  Register as Seller →
                </Link>
                <Link href="/login" style={{ padding: "14px 36px", borderRadius: "8px", border: "1px solid rgba(255,255,255,.18)", color: "rgba(255,255,255,.8)", fontSize: "14px", fontWeight: 500, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
                  Already a Seller? Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRUST STRIP ══════════════════════════════════════ */}
      <section
        ref={secRef("trust")}
        style={{ padding: "60px 48px", background: "#fff", borderTop: "1px solid #f5f5f5", opacity: vis("trust") ? 1 : 0, transform: vis("trust") ? "none" : "translateY(24px)", transition: "all .6s ease" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "28px" }}>
          {[
            ["🛡️","Verified Sellers","Every seller is KYC-verified by our team."],
            ["📦","GST Invoicing","Compliant invoices on every order."],
            ["🚚","Logistics Support","Packaging and shipping fully guided."],
            ["🤝","Dedicated Support","An account manager for every seller."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ fontSize: "22px", flexShrink: 0, marginTop: "2px" }}>{icon}</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "15px", fontWeight: 600, color: "#111", marginBottom: "4px" }}>{title}</div>
                <div style={{ fontSize: "13px", color: "#888", lineHeight: 1.65, fontFamily: "'DM Sans',sans-serif" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer style={{ background: "#111", padding: "72px 48px 40px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "56px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#C41E3A,#8B0020)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: "16px", fontWeight: 700, color: "#fff" }}>S</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "17px", fontWeight: 600, color: "#fff" }}>Sanskriti</div>
                  <div style={{ fontSize: "9px", letterSpacing: ".2em", color: "#C41E3A", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>The Antique</div>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,.38)", lineHeight: 1.8, maxWidth: "240px", marginBottom: "20px", fontFamily: "'DM Sans',sans-serif" }}>
                India's premier seller-enablement platform. We help artisans and entrepreneurs build thriving digital businesses.
              </p>
              <a href="https://sanskrititheantique.com/" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "8px 16px", borderRadius: "6px", border: "1px solid rgba(196,30,58,.4)", color: "#C41E3A", fontSize: "12px", fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
                Visit B2C Store ↗
              </a>
            </div>
            {[
              ["Platform", ["Services","Training Videos","Gallery","Seller Dashboard","Register"]],
              ["Company",  ["About Us","Contact","Blog","Careers","Press"]],
              ["Legal",    ["Privacy Policy","Terms of Service","Refund Policy","GST Info","Disclaimer"]],
            ].map(([title, links]) => (
              <div key={title}>
                <div style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,.28)", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: "18px", fontFamily: "'DM Sans',sans-serif" }}>{title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                  {links.map(l => (
                    <Link key={l} href="#" style={{ fontSize: "13px", color: "rgba(255,255,255,.42)", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>{l}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: "26px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,.22)", fontFamily: "'DM Sans',sans-serif" }}>© 2025 Sanskriti The Antique. All rights reserved.</div>
            <div style={{ display: "flex", gap: "18px" }}>
              {["B2C Store","Seller Platform","Admin Portal"].map(l => (
                <Link key={l} href="#" style={{ fontSize: "12px", color: "rgba(255,255,255,.25)", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
