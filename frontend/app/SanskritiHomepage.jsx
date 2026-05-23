"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────
// DESIGN SYSTEM
// Base: #FFFFFF / #F8F8F8 (white dominant)
// Accent: #C41E3A (rich crimson — confident, Indian-luxury)
// Text: #111111 primary, #555 secondary, #999 muted
// Fonts: Playfair Display (headings) + DM Sans (body)
// ─────────────────────────────────────────────────────────────

const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ── DATA ─────────────────────────────────────────────────────

const STATS = [
  { value: "1L+",   label: "Products" },
  { value: "25+",   label: "Categories" },
  { value: "5000+", label: "Sellers" },
  { value: "12+",   label: "Years" },
];

const SERVICES = [
  { icon: "🛍️", title: "E-Commerce Setup",        desc: "Amazon, Flipkart & website setup — account to first order, completely managed." },
  { icon: "✦",  title: "Branding",                desc: "Logo, brand kit, packaging, Amazon storefront — your identity, built premium." },
  { icon: "🏭", title: "Manufacturing Setup",     desc: "Factory setup, machinery, QC systems, and workforce — all under one program." },
  { icon: "📦", title: "Inventory Management",    desc: "Zero-error stock control for 1 lakh+ SKUs with our proprietary system." },
  { icon: "📸", title: "Photoshoot",              desc: "Studio & lifestyle photography. Amazon-compliant. Catalogue-ready." },
  { icon: "🎬", title: "Instagram Videos",        desc: "Scroll-stopping reels and brand films that drive genuine product discovery." },
  { icon: "📊", title: "Business Consultancy",    desc: "Pricing, margins, scaling — from practitioners who've built real businesses." },
  { icon: "🎓", title: "Training Programs",       desc: "Master e-commerce from scratch or scale what you already have. 25+ courses." },
];

const GALLERY_ITEMS = [
  { id: 1,  name: "Brass Ganesh Idol",          cat: "Idols & Figurines",   emoji: "🏺", bg: "#F5EDE8", tag: "Bestseller" },
  { id: 2,  name: "Handwoven Pashmina Shawl",   cat: "Textiles",            emoji: "🧣", bg: "#EDF0F5", tag: "New" },
  { id: 3,  name: "Tanjore Painting",           cat: "Art & Paintings",     emoji: "🖼️", bg: "#EFF5ED", tag: "Featured" },
  { id: 4,  name: "Silver Tribal Necklace",     cat: "Jewellery",           emoji: "💎", bg: "#F0EDF5", tag: "Premium" },
  { id: 5,  name: "Sandalwood Jewellery Box",   cat: "Wooden Crafts",       emoji: "🪵", bg: "#F5F0E8", tag: "Bestseller" },
  { id: 6,  name: "Madhubani Painting",         cat: "Art & Paintings",     emoji: "🎨", bg: "#F5EDF2", tag: "New" },
  { id: 7,  name: "Terracotta Lamp Set",        cat: "Home Décor",          emoji: "🪔", bg: "#F5EDE8", tag: "Festival Pick" },
  { id: 8,  name: "Bronze Nataraja",            cat: "Idols & Figurines",   emoji: "🗿", bg: "#EDF3F5", tag: "Heritage" },
];

const VIDEOS = [
  { id: 1, title: "Launch on Amazon in 7 Days",        cat: "E-Commerce",  dur: "24:10", views: "15.2K", free: true  },
  { id: 2, title: "Brand Building from Zero",          cat: "Branding",    dur: "31:45", views: "12.4K", free: false },
  { id: 3, title: "Product Photography Secrets",       cat: "Photoshoot",  dur: "18:24", views: "18.6K", free: true  },
  { id: 4, title: "GST & Compliance for Sellers",      cat: "Finance",     dur: "22:08", views: "7.3K",  free: false },
  { id: 5, title: "Instagram Reels That Convert",      cat: "Social Media",dur: "19:33", views: "21.1K", free: false },
  { id: 6, title: "Inventory Management Masterclass",  cat: "Operations",  dur: "28:17", views: "9.8K",  free: false },
];

const CATS = ["Home Décor","Jewellery","Textiles","Art & Paintings","Wooden Crafts","Idols & Figurines","Pooja Items","Organic Foods","Ayurveda","Accessories","Pottery","Sculptures"];

// ── LOGIN GATE MODAL ──────────────────────────────────────────
function LoginModal({ onClose }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"20px",backdropFilter:"blur(6px)",animation:"fdIn .2s ease" }}>
      <div style={{ background:"#fff",borderRadius:"20px",padding:"48px 40px",width:"100%",maxWidth:"420px",textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,.2)",animation:"slUp .28s ease",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:"16px",right:"18px",background:"none",border:"none",fontSize:"22px",color:"#aaa",cursor:"pointer",lineHeight:1 }}>×</button>
        <div style={{ width:"60px",height:"60px",borderRadius:"50%",background:"linear-gradient(135deg,#C41E3A,#8B0020)",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px" }}>🎬</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"26px",fontWeight:600,color:"#111",marginBottom:"10px" }}>Seller Access Required</h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"15px",color:"#666",lineHeight:1.7,marginBottom:"30px" }}>Sign in to your verified seller account to watch full training videos and access our complete library.</p>
        <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
          <a href="/login" style={{ display:"block",padding:"14px",borderRadius:"10px",background:"linear-gradient(135deg,#C41E3A,#8B0020)",color:"#fff",fontSize:"14px",fontWeight:600,textDecoration:"none",letterSpacing:".06em",fontFamily:"'DM Sans',sans-serif" }}>Sign In to Watch →</a>
          <a href="/register" style={{ display:"block",padding:"14px",borderRadius:"10px",border:"1.5px solid #e5e5e5",color:"#333",fontSize:"14px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Register as New Seller</a>
        </div>
      </div>
    </div>
  );
}

// ── GALLERY POPUP ─────────────────────────────────────────────
function GalleryPopup({ item, onClose }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,padding:"20px",backdropFilter:"blur(10px)",animation:"fdIn .22s ease" }}>
      <div style={{ background:"#fff",borderRadius:"24px",width:"100%",maxWidth:"480px",overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,.25)",animation:"scIn .28s ease",position:"relative" }}>
        {/* Image area */}
        <div style={{ height:"280px",background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
          <div style={{ fontSize:"96px",filter:"drop-shadow(0 8px 24px rgba(0,0,0,.12))",animation:"floatAnim 3s ease-in-out infinite" }}>{item.emoji}</div>
          <div style={{ position:"absolute",top:"16px",left:"16px",padding:"6px 14px",borderRadius:"99px",background:"#C41E3A",color:"#fff",fontSize:"11px",fontWeight:600,letterSpacing:".08em",fontFamily:"'DM Sans',sans-serif" }}>{item.tag}</div>
          <button onClick={onClose} style={{ position:"absolute",top:"14px",right:"14px",width:"34px",height:"34px",borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",fontSize:"18px",color:"#333",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,.12)" }}>×</button>
        </div>

        {/* Details */}
        <div style={{ padding:"28px 32px 32px" }}>
          <div style={{ fontSize:"12px",color:"#C41E3A",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",marginBottom:"8px",fontFamily:"'DM Sans',sans-serif" }}>{item.cat}</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"26px",fontWeight:600,color:"#111",marginBottom:"16px",lineHeight:1.2 }}>{item.name}</h3>

          {/* Price — hidden, blurred */}
          <div style={{ display:"flex",alignItems:"center",gap:"14px",marginBottom:"24px",padding:"16px",background:"#fafafa",borderRadius:"12px",border:"1px solid #f0f0f0" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"12px",color:"#999",marginBottom:"4px",fontFamily:"'DM Sans',sans-serif" }}>Seller Price</div>
              <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                <div style={{ fontSize:"22px",fontWeight:700,color:"#111",filter:"blur(6px)",userSelect:"none",fontFamily:"'DM Sans',sans-serif" }}>₹12,500</div>
                <div style={{ padding:"4px 10px",borderRadius:"6px",background:"rgba(196,30,58,.08)",color:"#C41E3A",fontSize:"12px",fontWeight:600 }}>🔒 Login to View</div>
              </div>
            </div>
          </div>

          <div style={{ display:"flex",gap:"12px" }}>
            <a href="/login" style={{ flex:1,padding:"13px",borderRadius:"10px",background:"linear-gradient(135deg,#C41E3A,#8B0020)",color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",textAlign:"center",letterSpacing:".04em",fontFamily:"'DM Sans',sans-serif" }}>Login to Order →</a>
            <a href="/gallery" style={{ flex:1,padding:"13px",borderRadius:"10px",border:"1.5px solid #e5e5e5",color:"#333",fontSize:"13px",fontWeight:500,textDecoration:"none",textAlign:"center",fontFamily:"'DM Sans',sans-serif" }}>View Gallery</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────
function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:1000,height:"68px",display:"flex",alignItems:"center",padding:"0 48px",background:scrolled?"rgba(255,255,255,.97)":"rgba(255,255,255,.0)",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"1px solid rgba(0,0,0,.07)":"none",transition:"all .35s ease" }}>
      <div style={{ maxWidth:"1280px",margin:"0 auto",width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        {/* Logo */}
        <a href="/" style={{ display:"flex",alignItems:"center",gap:"11px",textDecoration:"none" }}>
          <div style={{ width:"40px",height:"40px",borderRadius:"50%",background:"linear-gradient(135deg,#C41E3A,#8B0020)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:700,color:"#fff",boxShadow:"0 4px 14px rgba(196,30,58,.3)",flexShrink:0 }}>S</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:600,color:scrolled?"#111":"#111",lineHeight:1 }}>Sanskriti</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:".2em",color:"#C41E3A",textTransform:"uppercase",marginTop:"1px" }}>The Antique</div>
          </div>
        </a>

        {/* Nav links */}
        <div style={{ display:"flex",gap:"28px",alignItems:"center" }}>
          {[["Services","/services"],["Gallery","/gallery"],["Videos","/videos"],["About","/about"]].map(([l,h])=>(
            <a key={l} href={h} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"14px",fontWeight:500,color:"#333",textDecoration:"none",letterSpacing:".02em",transition:"color .2s" }}
              onMouseEnter={e=>e.target.style.color="#C41E3A"} onMouseLeave={e=>e.target.style.color="#333"}>{l}</a>
          ))}
          <a href="https://sanskrititheantique.com/" target="_blank" rel="noreferrer" style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"13px",fontWeight:500,color:"#333",textDecoration:"none",padding:"8px 18px",borderRadius:"6px",border:"1.5px solid #ddd",transition:"all .2s" }}
            onMouseEnter={e=>{e.target.style.borderColor="#C41E3A";e.target.style.color="#C41E3A"}} onMouseLeave={e=>{e.target.style.borderColor="#ddd";e.target.style.color="#333"}}>
            Shop →
          </a>
          <a href="/login" style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"13px",fontWeight:600,color:"#fff",background:"linear-gradient(135deg,#C41E3A,#8B0020)",padding:"9px 22px",borderRadius:"6px",textDecoration:"none",letterSpacing:".04em",boxShadow:"0 4px 14px rgba(196,30,58,.25)",transition:"transform .2s" }}
            onMouseEnter={e=>e.target.style.transform="translateY(-1px)"} onMouseLeave={e=>e.target.style.transform="none"}>
            Sign In
          </a>
        </div>
      </div>
    </nav>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
export default function SanskritiHomepage() {
  const [scrolled, setScrolled]       = useState(false);
  const [showLogin, setShowLogin]     = useState(false);
  const [galleryItem, setGalleryItem] = useState(null);
  const [mounted, setMounted]         = useState(false);
  const [heroLine, setHeroLine]       = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});

  const heroLines = ["Grow Your Business.", "Sell on Amazon.", "Build Your Brand.", "Train. Scale. Win."];

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroLine(l => (l + 1) % heroLines.length), 3000);
    return () => clearInterval(t);
  }, []);

  // Intersection observer for scroll reveals
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setVisibleSections(prev => new Set([...prev, e.target.dataset.sec])); });
    }, { threshold: 0.12 });
    Object.values(sectionRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [mounted]);

  const secRef = (id) => el => { if (el) { el.dataset.sec = id; sectionRefs.current[id] = el; } };
  const vis = (id) => visibleSections.has(id);

  if (!mounted) return null;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif",background:"#fff",color:"#111",overflowX:"hidden" }}>
      <style>{`
        ${GF}
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:#fff; }
        @keyframes fdIn  { from{opacity:0} to{opacity:1} }
        @keyframes slUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scIn  { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
        @keyframes floatAnim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes marqueeL { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes heroIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes reveal { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        .srv-card:hover { border-color:rgba(196,30,58,.25) !important; transform:translateY(-5px) !important; box-shadow:0 16px 40px rgba(196,30,58,.08) !important; }
        .gal-card:hover .gal-overlay { opacity:1 !important; }
        .gal-card:hover { transform:translateY(-6px) scale(1.01) !important; box-shadow:0 20px 48px rgba(0,0,0,.13) !important; }
        .vid-card:hover { border-color:rgba(196,30,58,.3) !important; transform:translateY(-4px) !important; box-shadow:0 12px 32px rgba(196,30,58,.08) !important; }
        input:focus { outline:none; }
        ::selection { background:rgba(196,30,58,.15); }
      `}</style>

      {showLogin  && <LoginModal onClose={() => setShowLogin(false)} />}
      {galleryItem && <GalleryPopup item={galleryItem} onClose={() => setGalleryItem(null)} />}

      <Navbar scrolled={scrolled} />

      {/* ══════════════════════════════════════════════════════
          HERO — clean white, editorial
      ══════════════════════════════════════════════════════ */}
      <section style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"100px 48px 80px",background:"#fff",position:"relative",overflow:"hidden",textAlign:"center" }}>
        {/* Subtle grid texture */}
        <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(196,30,58,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(196,30,58,.025) 1px,transparent 1px)",backgroundSize:"48px 48px",pointerEvents:"none" }} />
        {/* Soft radial glow */}
        <div style={{ position:"absolute",top:"30%",left:"50%",transform:"translate(-50%,-50%)",width:"800px",height:"500px",background:"radial-gradient(ellipse, rgba(196,30,58,.05) 0%, transparent 65%)",pointerEvents:"none" }} />

        {/* Eyebrow tag */}
        <div style={{ display:"inline-flex",alignItems:"center",gap:"8px",padding:"7px 18px",borderRadius:"99px",border:"1px solid rgba(196,30,58,.2)",background:"rgba(196,30,58,.04)",marginBottom:"32px",animation:"slUp .7s ease both" }}>
          <span style={{ width:"6px",height:"6px",borderRadius:"50%",background:"#C41E3A",animation:"blink 2s infinite" }} />
          <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"12px",letterSpacing:".16em",textTransform:"uppercase",color:"#C41E3A",fontWeight:600 }}>India's Premier Seller Platform</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(48px,7vw,88px)",fontWeight:700,color:"#111",lineHeight:1.05,marginBottom:"18px",animation:"slUp .8s .1s ease both" }}>
          Sanskriti
          <span style={{ display:"block",fontStyle:"italic",color:"#C41E3A",fontWeight:400 }}>The Antique</span>
        </h1>

        {/* Rotating subline */}
        <div style={{ height:"48px",overflow:"hidden",marginBottom:"24px" }}>
          <span key={heroLine} style={{ display:"block",fontFamily:"'Playfair Display',serif",fontSize:"clamp(20px,3vw,34px)",color:"#555",fontWeight:400,fontStyle:"italic",animation:"heroIn .5s ease both" }}>
            {heroLines[heroLine]}
          </span>
        </div>

        <p style={{ maxWidth:"560px",fontSize:"16px",color:"#666",lineHeight:1.85,marginBottom:"44px",animation:"slUp 1s .2s ease both" }}>
          From e-commerce setup to branding, photoshoots to training — everything a seller needs to launch, grow, and win across <strong style={{ color:"#111" }}>25+ categories</strong> with <strong style={{ color:"#111" }}>1 lakh+ products</strong>.
        </p>

        {/* CTAs */}
        <div style={{ display:"flex",gap:"16px",flexWrap:"wrap",justifyContent:"center",animation:"slUp 1s .3s ease both" }}>
          <a href="/register" style={{ padding:"15px 40px",borderRadius:"8px",background:"linear-gradient(135deg,#C41E3A,#8B0020)",color:"#fff",fontSize:"14px",fontWeight:600,letterSpacing:".08em",textDecoration:"none",boxShadow:"0 12px 32px rgba(196,30,58,.28)",transition:"all .2s" }}
            onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow="0 18px 40px rgba(196,30,58,.38)"}}
            onMouseLeave={e=>{e.target.style.transform="none";e.target.style.boxShadow="0 12px 32px rgba(196,30,58,.28)"}}>
            Join as Seller →
          </a>
          <a href="https://sanskrititheantique.com/" target="_blank" rel="noreferrer" style={{ padding:"15px 40px",borderRadius:"8px",border:"1.5px solid #ddd",color:"#333",fontSize:"14px",fontWeight:600,letterSpacing:".06em",textDecoration:"none",transition:"all .2s" }}
            onMouseEnter={e=>{e.target.style.borderColor="#C41E3A";e.target.style.color="#C41E3A"}}
            onMouseLeave={e=>{e.target.style.borderColor="#ddd";e.target.style.color="#333"}}>
            Shop Products
          </a>
        </div>

        {/* Stats band */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",background:"#f0f0f0",borderRadius:"16px",overflow:"hidden",marginTop:"80px",width:"100%",maxWidth:"680px",border:"1px solid #f0f0f0",animation:"slUp 1s .45s ease both" }}>
          {STATS.map((s,i) => (
            <div key={s.label} style={{ padding:"24px 16px",background:"#fff",textAlign:"center" }}>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"32px",fontWeight:700,color:"#C41E3A",lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:"11px",color:"#999",letterSpacing:".12em",textTransform:"uppercase",marginTop:"5px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ position:"absolute",bottom:"32px",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"5px" }}>
          <div style={{ width:"1px",height:"44px",background:"linear-gradient(to bottom,transparent,rgba(196,30,58,.4))" }} />
          <span style={{ fontSize:"9px",color:"#ccc",letterSpacing:".18em",textTransform:"uppercase" }}>scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CATEGORIES MARQUEE
      ══════════════════════════════════════════════════════ */}
      <div style={{ borderTop:"1px solid #f5f5f5",borderBottom:"1px solid #f5f5f5",padding:"14px 0",overflow:"hidden",background:"#fafafa" }}>
        <div style={{ display:"flex",animation:"marqueeL 24s linear infinite",width:"max-content" }}>
          {[...CATS,...CATS].map((c,i) => (
            <span key={i} style={{ display:"inline-flex",alignItems:"center",gap:"8px",padding:"0 28px",fontSize:"12px",fontWeight:500,color:"#666",letterSpacing:".1em",textTransform:"uppercase",whiteSpace:"nowrap" }}>
              <span style={{ width:"4px",height:"4px",borderRadius:"50%",background:"#C41E3A",opacity:.5 }} />{c}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          WHY JOIN SECTION
      ══════════════════════════════════════════════════════ */}
      <section ref={secRef("why")} style={{ padding:"100px 48px",maxWidth:"1280px",margin:"0 auto",opacity:vis("why")?1:0,transform:vis("why")?"none":"translateY(40px)",transition:"all .7s ease" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"center" }}>
          {/* Left */}
          <div>
            <div style={{ display:"inline-block",padding:"6px 14px",borderRadius:"99px",background:"rgba(196,30,58,.06)",border:"1px solid rgba(196,30,58,.15)",fontSize:"11px",fontWeight:600,color:"#C41E3A",letterSpacing:".14em",textTransform:"uppercase",marginBottom:"24px" }}>
              Why Join Sanskriti?
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(34px,4vw,54px)",fontWeight:700,color:"#111",lineHeight:1.1,marginBottom:"20px" }}>
              More than a marketplace.
              <span style={{ display:"block",fontStyle:"italic",color:"#C41E3A",fontWeight:400 }}>An ecosystem.</span>
            </h2>
            <p style={{ fontSize:"16px",color:"#555",lineHeight:1.85,marginBottom:"16px" }}>
              Sanskriti is a complete seller-enablement platform that transforms artisans, manufacturers, and entrepreneurs into thriving digital-first businesses.
            </p>
            <p style={{ fontSize:"16px",color:"#555",lineHeight:1.85,marginBottom:"36px" }}>
              We serve across <strong style={{ color:"#111" }}>25+ product categories</strong> with over <strong style={{ color:"#111" }}>1 lakh products</strong> — and handle every step from brand creation to your first Amazon sale.
            </p>
            <div style={{ display:"flex",gap:"12px",flexWrap:"wrap" }}>
              <a href="/register" style={{ padding:"13px 32px",borderRadius:"8px",background:"linear-gradient(135deg,#C41E3A,#8B0020)",color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",letterSpacing:".06em" }}>
                Start Your Journey →
              </a>
              <a href="/services" style={{ padding:"13px 32px",borderRadius:"8px",border:"1.5px solid #ddd",color:"#333",fontSize:"13px",fontWeight:500,textDecoration:"none" }}>
                See All Services
              </a>
            </div>
          </div>

          {/* Right — 4 feature tiles */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px" }}>
            {[
              ["🛒","Complete Setup","Amazon, website, GST — fully managed for you."],
              ["📸","Pro Media","Photography, reels, brand creatives — catalogue-ready."],
              ["🎓","Expert Training","25+ courses taught by real industry practitioners."],
              ["📦","Zero-Error Inventory","Manage 1L+ SKUs without a single miss."],
            ].map(([icon,title,desc]) => (
              <div key={title} style={{ background:"#fafafa",borderRadius:"16px",padding:"24px 20px",border:"1px solid #f0f0f0",transition:"all .25s" }}
                onMouseEnter={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor="rgba(196,30,58,.2)";e.currentTarget.style.boxShadow="0 8px 24px rgba(196,30,58,.07)"}}
                onMouseLeave={e=>{e.currentTarget.style.background="#fafafa";e.currentTarget.style.borderColor="#f0f0f0";e.currentTarget.style.boxShadow="none"}}>
                <div style={{ fontSize:"24px",marginBottom:"12px" }}>{icon}</div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"17px",fontWeight:600,color:"#111",marginBottom:"6px" }}>{title}</div>
                <div style={{ fontSize:"13px",color:"#888",lineHeight:1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SERVICES GRID — light grey bg
      ══════════════════════════════════════════════════════ */}
      <section ref={secRef("srv")} style={{ background:"#f8f8f8",padding:"100px 48px",opacity:vis("srv")?1:0,transform:vis("srv")?"none":"translateY(40px)",transition:"all .7s ease" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"60px" }}>
            <div style={{ display:"inline-block",padding:"6px 14px",borderRadius:"99px",background:"rgba(196,30,58,.06)",border:"1px solid rgba(196,30,58,.15)",fontSize:"11px",fontWeight:600,color:"#C41E3A",letterSpacing:".14em",textTransform:"uppercase",marginBottom:"18px" }}>
              What We Offer
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(34px,4vw,52px)",fontWeight:700,color:"#111",lineHeight:1.1 }}>
              Everything a seller needs.
              <span style={{ display:"block",fontStyle:"italic",fontWeight:400,color:"#C41E3A" }}>Under one roof.</span>
            </h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"18px" }}>
            {SERVICES.map((s,i) => (
              <div key={s.title} className="srv-card" style={{ background:"#fff",borderRadius:"16px",padding:"28px 24px",border:"1px solid #eeeeee",transition:"all .3s ease",cursor:"default",animation:vis("srv")?`reveal .5s ${i*0.07}s ease both`:"none" }}>
                <div style={{ fontSize:"26px",marginBottom:"14px" }}>{s.icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"20px",fontWeight:600,color:"#111",marginBottom:"8px" }}>{s.title}</h3>
                <p style={{ fontSize:"14px",color:"#777",lineHeight:1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          GALLERY GLIMPSE — with hover popup & blurred price
      ══════════════════════════════════════════════════════ */}
      <section ref={secRef("gal")} style={{ padding:"100px 48px",background:"#fff",opacity:vis("gal")?1:0,transform:vis("gal")?"none":"translateY(40px)",transition:"all .7s ease" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto" }}>
          {/* Header */}
          <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:"48px",flexWrap:"wrap",gap:"20px" }}>
            <div>
              <div style={{ display:"inline-block",padding:"6px 14px",borderRadius:"99px",background:"rgba(196,30,58,.06)",border:"1px solid rgba(196,30,58,.15)",fontSize:"11px",fontWeight:600,color:"#C41E3A",letterSpacing:".14em",textTransform:"uppercase",marginBottom:"16px" }}>
                Product Gallery
              </div>
              <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,4vw,50px)",fontWeight:700,color:"#111",lineHeight:1.1 }}>
                A glimpse of
                <span style={{ fontStyle:"italic",fontWeight:400,color:"#C41E3A" }}> our collection.</span>
              </h2>
              <p style={{ fontSize:"15px",color:"#777",marginTop:"12px",lineHeight:1.7 }}>Click any product to explore. <strong style={{ color:"#C41E3A" }}>Prices visible to registered sellers only.</strong></p>
            </div>
            <a href="/gallery" style={{ display:"inline-flex",alignItems:"center",gap:"8px",padding:"12px 26px",borderRadius:"8px",border:"1.5px solid #ddd",color:"#333",fontSize:"13px",fontWeight:500,textDecoration:"none",transition:"all .2s" }}
              onMouseEnter={e=>{e.target.style.borderColor="#C41E3A";e.target.style.color="#C41E3A"}}
              onMouseLeave={e=>{e.target.style.borderColor="#ddd";e.target.style.color="#333"}}>
              View Full Gallery →
            </a>
          </div>

          {/* Gallery grid — 4 cols */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"18px" }}>
            {GALLERY_ITEMS.map((item,i) => (
              <div key={item.id} className="gal-card" onClick={() => setGalleryItem(item)} style={{ borderRadius:"16px",overflow:"hidden",cursor:"pointer",transition:"all .3s ease",boxShadow:"0 2px 12px rgba(0,0,0,.06)",border:"1px solid #f0f0f0",position:"relative",animation:vis("gal")?`reveal .5s ${i*0.07}s ease both`:"none" }}>
                {/* Product image area */}
                <div style={{ height:"200px",background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
                  <div style={{ fontSize:"64px",transition:"transform .3s" }}>{item.emoji}</div>
                  {/* Hover overlay */}
                  <div className="gal-overlay" style={{ position:"absolute",inset:0,background:"rgba(196,30,58,.72)",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .28s ease" }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ width:"46px",height:"46px",borderRadius:"50%",background:"rgba(255,255,255,.2)",border:"2px solid rgba(255,255,255,.6)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:"18px",color:"#fff" }}>+</div>
                      <div style={{ fontSize:"13px",color:"#fff",fontWeight:600,letterSpacing:".06em" }}>Quick View</div>
                    </div>
                  </div>
                  {/* Tag badge */}
                  <div style={{ position:"absolute",top:"10px",left:"10px",padding:"4px 10px",borderRadius:"99px",background:"#fff",color:"#C41E3A",fontSize:"10px",fontWeight:700,letterSpacing:".08em",boxShadow:"0 2px 8px rgba(0,0,0,.1)" }}>{item.tag}</div>
                </div>
                {/* Info */}
                <div style={{ padding:"14px 16px",background:"#fff" }}>
                  <div style={{ fontSize:"10px",color:"#C41E3A",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",marginBottom:"4px" }}>{item.cat}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"15px",fontWeight:600,color:"#111",marginBottom:"8px",lineHeight:1.3 }}>{item.name}</div>
                  {/* Price blurred */}
                  <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                    <span style={{ fontSize:"16px",fontWeight:700,color:"#111",filter:"blur(5px)",userSelect:"none" }}>₹8,500</span>
                    <span style={{ fontSize:"11px",padding:"3px 8px",borderRadius:"6px",background:"rgba(196,30,58,.07)",color:"#C41E3A",fontWeight:600,letterSpacing:".04em" }}>🔒 Login</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* See more strip */}
          <div style={{ marginTop:"36px",padding:"20px 32px",borderRadius:"14px",background:"#fafafa",border:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"16px" }}>
            <div>
              <span style={{ fontFamily:"'Playfair Display',serif",fontSize:"20px",fontWeight:600,color:"#111" }}>1,00,000+ products</span>
              <span style={{ fontSize:"14px",color:"#888",marginLeft:"12px" }}>across 25+ categories. Register to view pricing and place orders.</span>
            </div>
            <a href="/register" style={{ padding:"12px 28px",borderRadius:"8px",background:"linear-gradient(135deg,#C41E3A,#8B0020)",color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",letterSpacing:".06em",boxShadow:"0 6px 20px rgba(196,30,58,.22)" }}>
              Register to Unlock →
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRAINING VIDEOS PREVIEW
      ══════════════════════════════════════════════════════ */}
      <section ref={secRef("vid")} style={{ background:"#f8f8f8",padding:"100px 48px",opacity:vis("vid")?1:0,transform:vis("vid")?"none":"translateY(40px)",transition:"all .7s ease" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto" }}>
          <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:"48px",flexWrap:"wrap",gap:"20px" }}>
            <div>
              <div style={{ display:"inline-block",padding:"6px 14px",borderRadius:"99px",background:"rgba(196,30,58,.06)",border:"1px solid rgba(196,30,58,.15)",fontSize:"11px",fontWeight:600,color:"#C41E3A",letterSpacing:".14em",textTransform:"uppercase",marginBottom:"16px" }}>Training Library</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,4vw,50px)",fontWeight:700,color:"#111",lineHeight:1.1 }}>
                Learn from{" "}
                <span style={{ fontStyle:"italic",fontWeight:400,color:"#C41E3A" }}>the best.</span>
              </h2>
              <p style={{ fontSize:"15px",color:"#777",marginTop:"10px",lineHeight:1.7 }}>Expert courses on Amazon, branding, operations and more. <strong style={{ color:"#111" }}>Locked for registered sellers.</strong></p>
            </div>
            <a href="/login" style={{ display:"inline-flex",alignItems:"center",gap:"8px",padding:"12px 26px",borderRadius:"8px",border:"1.5px solid #ddd",color:"#333",fontSize:"13px",fontWeight:500,textDecoration:"none" }}
              onMouseEnter={e=>{e.target.style.borderColor="#C41E3A";e.target.style.color="#C41E3A"}} onMouseLeave={e=>{e.target.style.borderColor="#ddd";e.target.style.color="#333"}}>
              View All Videos →
            </a>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"18px" }}>
            {VIDEOS.map((v,i) => (
              <div key={v.id} className="vid-card" onClick={() => !v.free && setShowLogin(true)} style={{ background:"#fff",borderRadius:"16px",overflow:"hidden",border:"1px solid #eeeeee",transition:"all .3s ease",cursor:"pointer",animation:vis("vid")?`reveal .5s ${i*0.08}s ease both`:"none" }}>
                {/* Thumbnail */}
                <div style={{ height:"150px",background:"linear-gradient(135deg,#111 0%,#2a0a10 60%,#3d0e1e 100%)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
                  <div style={{ width:"52px",height:"52px",borderRadius:"50%",background:v.free?"rgba(196,30,58,.9)":"rgba(255,255,255,.1)",border:"2px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",color:"#fff" }}>
                    {v.free ? "▶" : "🔒"}
                  </div>
                  {v.free && (
                    <div style={{ position:"absolute",top:"10px",left:"10px",padding:"4px 10px",borderRadius:"99px",background:"rgba(34,197,94,.85)",color:"#fff",fontSize:"10px",fontWeight:700,letterSpacing:".08em" }}>FREE</div>
                  )}
                  <div style={{ position:"absolute",bottom:"10px",right:"10px",padding:"3px 8px",borderRadius:"6px",background:"rgba(0,0,0,.6)",color:"rgba(255,255,255,.85)",fontSize:"11px" }}>{v.dur}</div>
                </div>
                {/* Info */}
                <div style={{ padding:"16px 18px" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"6px" }}>
                    <span style={{ fontSize:"11px",color:"#C41E3A",fontWeight:600,letterSpacing:".08em",textTransform:"uppercase" }}>{v.cat}</span>
                    <span style={{ fontSize:"11px",color:"#aaa" }}>👁 {v.views}</span>
                  </div>
                  <h4 style={{ fontFamily:"'Playfair Display',serif",fontSize:"16px",fontWeight:600,color:"#111",lineHeight:1.35 }}>{v.title}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* CTA band */}
          <div style={{ marginTop:"48px",borderRadius:"20px",background:"linear-gradient(135deg,#111 0%,#1e0508 50%,#2d0b18 100%)",padding:"56px 56px",textAlign:"center",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(196,30,58,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(196,30,58,.04) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none" }} />
            <div style={{ position:"relative" }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,4vw,42px)",fontWeight:600,color:"#fff",marginBottom:"14px" }}>
                Ready to unlock the full library?
              </h3>
              <p style={{ fontSize:"15px",color:"rgba(255,255,255,.5)",marginBottom:"36px",maxWidth:"480px",margin:"0 auto 36px",lineHeight:1.8 }}>
                Join 5,000+ sellers who have built real businesses with Sanskriti's training, tools, and support.
              </p>
              <div style={{ display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap" }}>
                <a href="/register" style={{ padding:"15px 40px",borderRadius:"8px",background:"linear-gradient(135deg,#C41E3A,#8B0020)",color:"#fff",fontSize:"14px",fontWeight:600,letterSpacing:".08em",textDecoration:"none",boxShadow:"0 12px 32px rgba(196,30,58,.4)" }}>
                  Register as Seller →
                </a>
                <a href="/login" style={{ padding:"15px 40px",borderRadius:"8px",border:"1px solid rgba(255,255,255,.18)",color:"rgba(255,255,255,.8)",fontSize:"14px",fontWeight:500,textDecoration:"none" }}>
                  Already a Seller? Sign In
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════════════════════ */}
      <section ref={secRef("trust")} style={{ padding:"60px 48px",background:"#fff",borderTop:"1px solid #f5f5f5",opacity:vis("trust")?1:0,transform:vis("trust")?"none":"translateY(24px)",transition:"all .6s ease" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"32px" }}>
          {[
            ["🛡️","Verified Sellers","Every seller is KYC-verified and onboarded by our team."],
            ["📦","GST Invoicing","Compliant invoices on every order. No hidden charges."],
            ["🚚","Logistics Support","Packaging, shipping, and delivery — fully guided."],
            ["🤝","Dedicated Support","A dedicated account manager for every seller."],
          ].map(([icon,title,desc]) => (
            <div key={title} style={{ display:"flex",gap:"16px",alignItems:"flex-start" }}>
              <div style={{ fontSize:"24px",flexShrink:0,marginTop:"2px" }}>{icon}</div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"16px",fontWeight:600,color:"#111",marginBottom:"4px" }}>{title}</div>
                <div style={{ fontSize:"13px",color:"#888",lineHeight:1.65 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer style={{ background:"#111",padding:"72px 48px 40px",borderTop:"1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto" }}>
          <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"48px",marginBottom:"60px" }}>
            {/* Brand column */}
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"20px" }}>
                <div style={{ width:"38px",height:"38px",borderRadius:"50%",background:"linear-gradient(135deg,#C41E3A,#8B0020)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:"17px",fontWeight:700,color:"#fff" }}>S</div>
                <div>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:600,color:"#fff" }}>Sanskriti</div>
                  <div style={{ fontSize:"9px",letterSpacing:".2em",color:"#C41E3A",textTransform:"uppercase" }}>The Antique</div>
                </div>
              </div>
              <p style={{ fontSize:"14px",color:"rgba(255,255,255,.38)",lineHeight:1.8,maxWidth:"260px",marginBottom:"24px" }}>
                India's premier seller-enablement platform. We help artisans and entrepreneurs build thriving digital businesses.
              </p>
              <a href="https://sanskrititheantique.com/" target="_blank" rel="noreferrer" style={{ display:"inline-flex",alignItems:"center",gap:"6px",padding:"9px 18px",borderRadius:"6px",border:"1px solid rgba(196,30,58,.4)",color:"#C41E3A",fontSize:"12px",fontWeight:600,textDecoration:"none",letterSpacing:".06em" }}>
                Visit B2C Store ↗
              </a>
            </div>

            {[
              ["Platform", ["Services","Training Videos","Gallery","Seller Dashboard","Register"]],
              ["Company",  ["About Us","Contact","Blog","Careers","Press"]],
              ["Legal",    ["Privacy Policy","Terms of Service","Refund Policy","GST Info","Disclaimer"]],
            ].map(([title,links]) => (
              <div key={title}>
                <div style={{ fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,.3)",letterSpacing:".16em",textTransform:"uppercase",marginBottom:"20px" }}>{title}</div>
                <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
                  {links.map(l => (
                    <a key={l} href="#" style={{ fontSize:"14px",color:"rgba(255,255,255,.42)",textDecoration:"none",transition:"color .18s" }}
                      onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.42)"}>{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:"28px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"14px" }}>
            <div style={{ fontSize:"12px",color:"rgba(255,255,255,.22)" }}>© 2025 Sanskriti The Antique. All rights reserved.</div>
            <div style={{ display:"flex",gap:"20px" }}>
              {["B2C Store","Seller Platform","Admin Portal"].map(l => (
                <a key={l} href="#" style={{ fontSize:"12px",color:"rgba(255,255,255,.25)",textDecoration:"none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
