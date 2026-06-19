"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import api from "@/lib/api";

const BURG = "#9B0020";

// ── Backend serves uploaded files (e.g. /uploads/categories/x.jpg) from its
// root, not under /api — so strip a trailing "/api" off NEXT_PUBLIC_API_URL
// to get the right origin to prefix those paths with.
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");
function resolveUploadUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${API_ORIGIN}${path}`;
}

// ── Shape of each category once fetched from /api/categories and normalized ──
type CategoryItem = {
  id: string;        // category slug
  label: string;
  img: string;        // grid thumbnail (PLACEHOLDER_IMG if none uploaded yet)
  heroImg: string;    // hero banner photo (falls back to the grid thumbnail)
  count: string;
  showInHero: boolean;
  heroOrder: number;
};


// ── Shown whenever a photo hasn't been added yet (no external image host involved) ──
const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23f3f1ee'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='%23ccc' text-anchor='middle' dominant-baseline='middle'%3EAdd Photo%3C/text%3E%3C/svg%3E";

// ── Categories now come from the admin panel (Category model) via /api/categories.
// The "Choose the Category" grid and the hero carousel below render whatever the
// admin panel returns — there's no hardcoded category list in this file anymore.
// Use the admin "Categories" section to add/edit/delete/reorder categories, set a
// category's hero photo, and choose which categories appear in the hero carousel.
// ── Products — each img path points to /public/images/products/{id}.jpg ──
const PRODUCTS = [
  // Wooden
  { id:"w1",  name:"Handcrafted Colorful Wooden Elephant Stool Table",          cat:"wooden",    tag:"Bestseller", moq:5,  img:"/images/products/w1.jpg" },
  { id:"w2",  name:"Handcrafted Rajasthani Wooden Tea Coasters",                cat:"wooden",    tag:"Popular",    moq:10, img:"/images/products/w2.jpg" },
  { id:"w3",  name:"Handcrafted Wooden Ashoka Pillar Replica",                  cat:"wooden",    tag:"Heritage",   moq:5,  img:"/images/products/w3.jpg" },
  { id:"w4",  name:"Handcrafted Wooden Camel Figurine",                         cat:"wooden",    tag:"New",        moq:8,  img:"/images/products/w4.jpg" },
  { id:"w5",  name:"Handcrafted Wooden Dry Fruit Box",                          cat:"wooden",    tag:"Bestseller", moq:6,  img:"/images/products/w5.jpg" },
  { id:"w6",  name:"Handcrafted Wooden Peacock Wall Hanging",                   cat:"wooden",    moq:5,            img:"/images/products/w6.jpg" },
  // Gemstone — real images found
  { id:"g1",  name:"7 Chakra Bracelet — Healing Crystal Gemstone Beaded",      cat:"gemstone",  tag:"New Launch", moq:10, img:"/images/products/g1.jpg" },
  { id:"g2",  name:"7 Chakra Pendant Tree of Life Crystal Stone Locket",       cat:"gemstone",  tag:"New Launch", moq:10, img:"/images/products/g2.jpg" },
  { id:"g3",  name:"African Turquoise Healing Crystal Bracelet 8mm",            cat:"gemstone",  tag:"New Launch", moq:12, img:"/images/products/g3.jpg" },
  // Jewellery — using category image as product
  { id:"j1",  name:"Oxidised Radha Krishna Jhumka Earrings — Traditional",     cat:"jewellery", tag:"Bestseller", moq:12, img:"/images/products/j1.jpg" },
  { id:"j2",  name:"German Silver Chand Bali Jhumka Set",                      cat:"jewellery", moq:10,           img:"/images/products/j2.jpg" },
  { id:"j3",  name:"Oxidised Tribal Necklace Set — Boho Style",                cat:"jewellery", tag:"Premium",    moq:5,  img:"/images/products/j3.jpg" },
  // Paintings
  { id:"p1",  name:"Set of Two Golden Frame Wall Paintings",                   cat:"paintings", tag:"New Launch", moq:3,  img:"/images/products/p1.jpg" },
  { id:"p2",  name:"Madhubani Folk Art Canvas Painting",                       cat:"paintings", tag:"Heritage",   moq:2,  img:"/images/products/p2.jpg" },
  { id:"p3",  name:"Tanjore Painting — Goddess Lakshmi",                      cat:"paintings", tag:"Featured",   moq:2,  img:"/images/products/p3.jpg" },
  // Marble
  { id:"m1",  name:"Handcrafted Marble Camel Clock — Timeless Elegance",      cat:"marble",    tag:"Featured",   moq:3,  img:"/images/products/m1.jpg" },
  { id:"m2",  name:"Marble Inlay Decorative Serving Plate",                   cat:"marble",    tag:"Premium",    moq:4,  img:"/images/products/m2.jpg" },
  // Saree
  { id:"s1",  name:"Gopi Silk Saree — Traditional Handloom Weave",            cat:"saree",     tag:"Bestseller", moq:6,  img:"/images/products/s1.jpg" },
  { id:"s2",  name:"Banarasi Silk Saree — Festival Collection",               cat:"saree",     tag:"Premium",    moq:5,  img:"/images/products/s2.jpg" },
  // Kurtis
  { id:"k1",  name:"Women Block Print Cotton Kurti — Jaipur",                 cat:"kurti",     tag:"Popular",    moq:12, img:"/images/products/k1.jpg" },
  { id:"k2",  name:"Anarkali Embroidered Kurti — Full Length",                cat:"kurti",     moq:10,           img:"/images/products/k2.jpg" },
  // Wall Art
  { id:"wa1", name:"3D MDF Mandala Wall Art — Laser Cut",                     cat:"wallart",   tag:"Trending",   moq:5,  img:"/images/products/wa1.jpg" },
  { id:"wa2", name:"Metal Peacock Decorative Wall Hanging",                   cat:"wallart",   tag:"Bestseller", moq:5,  img:"/images/products/wa2.jpg" },
  // Bronze
  { id:"br1", name:"Bronze Nataraja Idol — 12 Inch Antique Finish",           cat:"bronze",    tag:"Heritage",   moq:2,  img:"/images/products/br1.jpg" },
  { id:"br2", name:"Bronze Ganesha — Premium Casting",                        cat:"bronze",    tag:"Premium",    moq:3,  img:"/images/products/br2.jpg" },
  // Bedsheet
  { id:"b1",  name:"Premium Cotton Block Print Bedsheet — King Size",         cat:"bedsheet",  tag:"Popular",    moq:12, img:"/images/products/b1.jpg" },
  { id:"b2",  name:"Jaipuri Rajasthani Double Bedsheet",                      cat:"bedsheet",  moq:10,           img:"/images/products/b2.jpg" },
  // Lehenga
  { id:"l1",  name:"Designer Embroidered Lehenga Choli — Wedding",            cat:"lehenga",   tag:"Premium",    moq:3,  img:"/images/products/l1.jpg" },
  // Co-ord
  { id:"c1",  name:"Cotton Co-ord Set — Printed Summer Collection",           cat:"coordset",  tag:"New Launch", moq:8,  img:"/images/products/c1.jpg" },
  // Bagru
  { id:"bg1", name:"Bagru Hand Block Print Suit Set",                         cat:"bagru",     tag:"New",        moq:10, img:"/images/products/bg1.jpg" },
  // Wall Hangings
  { id:"wh1", name:"Macramé Boho Wall Hanging — Handwoven",                   cat:"wallhang",  tag:"Trending",   moq:8,  img:"/images/products/wh1.jpg" },
  { id:"wh2", name:"Wooden Carved Jali Wall Panel",                           cat:"wallhang",  moq:5,            img:"/images/products/wh2.jpg" },
];

const TAG_STYLE: Record<string, { bg: string; color: string }> = {
  "Bestseller": { bg:"rgba(155,0,32,.1)",  color:BURG       },
  "Popular":    { bg:"rgba(155,0,32,.08)", color:BURG       },
  "New Launch": { bg:"rgba(22,163,74,.1)", color:"#15803d"  },
  "New":        { bg:"rgba(22,163,74,.1)", color:"#15803d"  },
  "Featured":   { bg:"rgba(59,130,246,.1)",color:"#1d4ed8"  },
  "Premium":    { bg:"rgba(124,58,237,.1)",color:"#6d28d9"  },
  "Heritage":   { bg:"rgba(120,53,15,.1)", color:"#92400e"  },
  "Trending":   { bg:"rgba(234,88,12,.1)", color:"#c2410c"  },
};

// ── Login Modal ───────────────────────────────────────────────
function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:"20px",backdropFilter:"blur(8px)" }}>
      <div style={{ background:"#fff",borderRadius:"20px",padding:"44px 40px",width:"100%",maxWidth:"400px",textAlign:"center",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:"14px",right:"16px",background:"none",border:"none",fontSize:"22px",color:"#aaa",cursor:"pointer" }}>×</button>
        <div style={{ width:"60px",height:"60px",borderRadius:"50%",background:BURG,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:"26px" }}>🔒</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"24px",fontWeight:700,color:"#111",marginBottom:"8px" }}>Sign in to view prices</h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"14px",color:"#666",lineHeight:1.75,marginBottom:"28px" }}>
          Prices are exclusively visible to verified sellers. Register free to unlock pricing, margins, and bulk ordering.
        </p>
        <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
          <Link href="/login" style={{ display:"block",padding:"14px",borderRadius:"10px",background:BURG,color:"#fff",fontSize:"14px",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Sign In →</Link>
          <Link href="/register" style={{ display:"block",padding:"14px",borderRadius:"10px",border:`1.5px solid rgba(155,0,32,.2)`,color:BURG,fontSize:"14px",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Register as Seller — Free</Link>
          <button onClick={onClose} style={{ padding:"10px",background:"none",border:"none",color:"#aaa",fontSize:"13px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>Continue browsing →</button>
        </div>
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────
function ProductCard({ p, categories, onLock, wishlisted, onWish }: {
  p: typeof PRODUCTS[0];
  categories: CategoryItem[];
  onLock: () => void;
  wishlisted: boolean;
  onWish: () => void;
}) {
  const [hov, setHov] = useState(false);
  const cat = categories.find(c => c.id === p.cat);
  const tc = p.tag ? TAG_STYLE[p.tag] : null;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background:"#fff",borderRadius:"16px",border:`1px solid ${hov?"rgba(155,0,32,.22)":"#f0f0f0"}`,overflow:"hidden",transition:"all .22s ease",transform:hov?"translateY(-5px)":"none",boxShadow:hov?"0 20px 48px rgba(0,0,0,.1)":"0 1px 4px rgba(0,0,0,.04)" }}
    >
      {/* Image */}
      <div style={{ height:"220px",position:"relative",overflow:"hidden",background:"#f8f6f4" }}>
        <img
          src={p.img}
          alt={p.name}
          style={{ width:"100%",height:"100%",objectFit:"cover",transition:"transform .35s ease",transform:hov?"scale(1.06)":"scale(1)" }}
          onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
        />
        {/* hover overlay */}
        <div style={{ position:"absolute",inset:0,background:"rgba(155,0,32,.72)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:hov?1:0,transition:"opacity .22s ease" }}>
          <button onClick={onLock} style={{ padding:"10px 24px",borderRadius:"8px",background:"#fff",color:BURG,border:"none",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"8px" }}>🔒 View Price</button>
          <span style={{ fontSize:"12px",color:"rgba(255,255,255,.8)",fontFamily:"'DM Sans',sans-serif" }}>Sign in to unlock</span>
        </div>
        {/* tag */}
        {tc && (
          <div style={{ position:"absolute",top:"10px",left:"10px",padding:"3px 9px",borderRadius:"99px",background:tc.bg,color:tc.color,fontSize:"10px",fontWeight:700,letterSpacing:".06em",fontFamily:"'DM Sans',sans-serif" }}>{p.tag}</div>
        )}
        {/* wishlist */}
        <button
          onClick={e => { e.stopPropagation(); onWish(); }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          style={{ position:"absolute",top:"10px",right:"10px",width:"32px",height:"32px",borderRadius:"50%",background:"rgba(255,255,255,.92)",border:`1px solid ${wishlisted?BURG:"#ddd"}`,color:wishlisted?BURG:"#ccc",fontSize:"15px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,.08)",transition:"all .18s" }}
        >♥</button>
        {/* MOQ */}
        <div style={{ position:"absolute",bottom:"10px",right:"10px",padding:"3px 8px",borderRadius:"6px",background:"rgba(0,0,0,.5)",color:"rgba(255,255,255,.9)",fontSize:"10px",fontFamily:"'DM Sans',sans-serif" }}>MOQ: {p.moq}</div>
      </div>

      {/* Info */}
      <div style={{ padding:"14px 16px 16px" }}>
        <div style={{ fontSize:"10px",color:BURG,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",marginBottom:"5px",fontFamily:"'DM Sans',sans-serif" }}>{cat?.label ?? p.cat}</div>
        <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"14px",fontWeight:600,color:"#111",lineHeight:1.35,marginBottom:"12px",minHeight:"38px" }}>{p.name}</h3>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"6px" }}>
            <span style={{ fontFamily:"'Playfair Display',serif",fontSize:"16px",fontWeight:700,color:"#111",filter:"blur(7px)",userSelect:"none",letterSpacing:".02em" }}>₹9,999</span>
            <button onClick={onLock} style={{ padding:"3px 8px",borderRadius:"6px",background:"rgba(155,0,32,.07)",color:BURG,border:"0.5px solid rgba(155,0,32,.18)",fontSize:"10px",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"inline-flex",alignItems:"center",gap:"3px" }}>🔒 Login</button>
          </div>
          <button onClick={onLock} style={{ padding:"8px 16px",borderRadius:"7px",background:BURG,color:"#fff",border:"none",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0 }}>Order →</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function GalleryPage() {
  const [isLoggedIn,    setIsLoggedIn]    = useState(false);
  const [showLogin,     setShowLogin]     = useState(false);
  const [activeCat,     setActiveCat]     = useState("All");
  const [search,        setSearch]        = useState("");
  const [sortBy,        setSortBy]        = useState("default");
  const [wishlist,      setWishlist]      = useState<Set<string>>(new Set());
  const [mounted,       setMounted]       = useState(false);
  const [heroIdx,       setHeroIdx]       = useState(0);
  const [heroPaused,    setHeroPaused]    = useState(false);
  const [showAllCats,   setShowAllCats]   = useState(false);
  const [categories,        setCategories]        = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
    try { setWishlist(new Set(JSON.parse(localStorage.getItem("sk_wish") || "[]"))); } catch {}
  }, []);

  // ── Fetch categories from the admin-managed Category collection ──
  useEffect(() => {
    api.get("/categories")
      .then((res: any) => {
        const list: CategoryItem[] = (res.data?.categories || []).map((c: any) => ({
          id: c.slug,
          label: c.label,
          img: resolveUploadUrl(c.image) || PLACEHOLDER_IMG,
          heroImg: resolveUploadUrl(c.heroImage) || resolveUploadUrl(c.image) || PLACEHOLDER_IMG,
          count: c.count || "",
          showInHero: !!c.showInHero,
          heroOrder: c.heroOrder || 0,
        }));
        setCategories(list);
      })
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, []);

  // ── Hero carousel slides — whichever categories the admin marked "show in hero" ──
  const heroSlides = categories
    .filter(c => c.showInHero)
    .sort((a, b) => a.heroOrder - b.heroOrder)
    .map(c => ({ ...c, img: c.heroImg }));

  useEffect(() => {
    if (heroPaused || heroSlides.length === 0) return;
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroSlides.length), 4000);
    return () => clearInterval(t);
  }, [heroPaused, heroSlides.length]);

  const heroPrev = () => setHeroIdx(i => (i - 1 + heroSlides.length) % Math.max(heroSlides.length, 1));
  const heroNext = () => setHeroIdx(i => (i + 1) % Math.max(heroSlides.length, 1));

  const toggleWish = (id: string) => {
    setWishlist(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      localStorage.setItem("sk_wish", JSON.stringify([...n]));
      return n;
    });
  };

  const PILLS = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.cat)))];

  const filtered = PRODUCTS
    .filter(p => {
      const matchCat    = activeCat === "All" || p.cat === activeCat;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "az")       return a.name.localeCompare(b.name);
      if (sortBy === "moq-low")  return a.moq - b.moq;
      if (sortBy === "moq-high") return b.moq - a.moq;
      return 0;
    });

  const visibleCats = showAllCats ? categories : categories.slice(0, 16);

  if (!mounted) return null;

  return (
    <div style={{ background:"#fff", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes sk-fade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sk-hero { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        input:focus { outline:none; border-color:${BURG}!important; }
        input::placeholder { color:#ccc; }
        select:focus { outline:none; }
      `}</style>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* ══ HERO — COLLECTION CAROUSEL ══════════════════════ */}
      {heroSlides.length > 0 && (
      <section
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        style={{ position:"relative", background:"#111", overflow:"hidden", borderBottom:"1px solid #f0f0f0" }}
      >
        <div style={{ position:"relative", width:"100%", height:"clamp(380px, 52vw, 560px)" }}>
          {heroSlides.map((slide, i) => (
            <div
              key={slide.id}
              style={{ position:"absolute", inset:0, opacity:i===heroIdx?1:0, transition:"opacity .7s ease", pointerEvents:i===heroIdx?"auto":"none" }}
            >
              <img
                src={slide.img}
                alt={slide.label}
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
              />
              {/* legibility gradient so text/button stay readable over any photo */}
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,.78) 100%)" }} />

              {/* slide content */}
              <div style={{ position:"absolute", left:"48px", right:"48px", bottom:"44px", maxWidth:"560px" }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"5px 14px", borderRadius:"99px", border:"1px solid rgba(255,255,255,.35)", background:"rgba(255,255,255,.12)", fontSize:"11px", fontWeight:600, color:"#fff", letterSpacing:".12em", textTransform:"uppercase", marginBottom:"14px", fontFamily:"'DM Sans',sans-serif", backdropFilter:"blur(6px)" }}>
                  {slide.count} Products
                </div>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,52px)", fontWeight:700, color:"#fff", lineHeight:1.08, marginBottom:"18px" }}>
                  {slide.label}
                </h1>
                <button
                  onClick={() => { setActiveCat(slide.id); productsRef.current?.scrollIntoView({ behavior:"smooth" }); }}
                  style={{ padding:"13px 28px", borderRadius:"8px", background:"#fff", color:BURG, fontSize:"13px", fontWeight:700, border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", letterSpacing:".04em", boxShadow:"0 8px 24px rgba(0,0,0,.25)" }}
                >
                  Explore {slide.label} →
                </button>
              </div>
            </div>
          ))}

          {/* Prev / Next arrows */}
          <button onClick={heroPrev} aria-label="Previous category" style={{ position:"absolute", left:"18px", top:"50%", transform:"translateY(-50%)", width:"40px", height:"40px", borderRadius:"50%", border:"1px solid rgba(255,255,255,.4)", background:"rgba(0,0,0,.32)", color:"#fff", fontSize:"18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2 }}>‹</button>
          <button onClick={heroNext} aria-label="Next category" style={{ position:"absolute", right:"18px", top:"50%", transform:"translateY(-50%)", width:"40px", height:"40px", borderRadius:"50%", border:"1px solid rgba(255,255,255,.4)", background:"rgba(0,0,0,.32)", color:"#fff", fontSize:"18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2 }}>›</button>
        </div>

        {/* Slide dots */}
        <div style={{ display:"flex",justifyContent:"center",gap:"6px",padding:"16px 0",background:"#fff" }}>
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} aria-label={`Go to slide ${i + 1}`} style={{ width:i===heroIdx?"24px":"7px",height:"7px",borderRadius:"99px",background:i===heroIdx?BURG:"#e0e0e0",border:"none",cursor:"pointer",transition:"all .3s",padding:0 }} />
          ))}
        </div>
      </section>
      )}

      {/* ══ CATEGORIES ════════════════════════════════════ */}
      <section style={{ padding:"56px 48px 44px",background:"#fafafa",borderBottom:"1px solid #f0f0f0" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto" }}>

          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"28px",flexWrap:"wrap",gap:"12px" }}>
            <div>
              <div style={{ display:"inline-flex",alignItems:"center",gap:"5px",padding:"4px 12px",borderRadius:"99px",border:"1px solid rgba(155,0,32,.2)",background:"rgba(155,0,32,.05)",fontSize:"10px",fontWeight:600,color:BURG,letterSpacing:".1em",textTransform:"uppercase",marginBottom:"12px",fontFamily:"'DM Sans',sans-serif" }}>
                <span style={{ width:"4px",height:"4px",borderRadius:"50%",background:BURG,display:"block" }} />
                Browse by Category
              </div>
              <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(22px,3vw,34px)",fontWeight:700,color:"#111",marginBottom:"5px" }}>Choose the Category</h2>
              <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"14px",color:"#888" }}>25+ categories · 1 Lakh+ products · All from verified manufacturers</p>
            </div>
            {wishlist.size > 0 && (
              <div style={{ padding:"8px 16px",borderRadius:"8px",border:"1px solid rgba(155,0,32,.2)",background:"rgba(155,0,32,.05)",color:BURG,fontSize:"13px",fontWeight:600,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:"6px" }}>
                ♥ {wishlist.size} saved
              </div>
            )}
          </div>

          {/* Category grid */}
          {categoriesLoading ? (
            <div style={{ textAlign:"center", padding:"40px 0", color:"#aaa", fontFamily:"'DM Sans',sans-serif", fontSize:"13px" }}>
              Loading categories…
            </div>
          ) : categories.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 0", color:"#aaa", fontFamily:"'DM Sans',sans-serif", fontSize:"13px" }}>
              No categories added yet. Add some from the admin panel's "Categories" section.
            </div>
          ) : (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:"12px" }}>
            {visibleCats.map(cat => {
              const isActive = activeCat === cat.id;
              return (
                <button key={cat.id} onClick={() => { setActiveCat(isActive?"All":cat.id); productsRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }); }}
                  style={{ background:"#fff",border:`1.5px solid ${isActive?BURG:"#f0f0f0"}`,borderRadius:"14px",padding:0,cursor:"pointer",overflow:"hidden",transition:"all .22s",transform:isActive?"translateY(-3px)":"none",boxShadow:isActive?`0 10px 28px rgba(155,0,32,.18)`:"0 1px 4px rgba(0,0,0,.04)",textAlign:"center" }}
                  onMouseEnter={e => { if(!isActive){ e.currentTarget.style.borderColor="rgba(155,0,32,.25)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)"; } }}
                  onMouseLeave={e => { if(!isActive){ e.currentTarget.style.borderColor="#f0f0f0"; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.04)"; } }}
                >
                  <div style={{ height:"88px",overflow:"hidden",position:"relative",background:"#f8f6f4" }}>
                    <img src={cat.img} alt={cat.label} style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }} />
                    {isActive && <div style={{ position:"absolute",inset:0,background:"rgba(155,0,32,.15)" }} />}
                  </div>
                  <div style={{ padding:"9px 6px 11px" }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"11px",fontWeight:600,color:isActive?BURG:"#111",lineHeight:1.3,marginBottom:"2px" }}>{cat.label}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",color:"#aaa" }}>{cat.count}</div>
                  </div>
                </button>
              );
            })}
          </div>
          )}

          {categories.length > 16 && (
            <div style={{ textAlign:"center",marginTop:"18px" }}>
              <button onClick={() => setShowAllCats(!showAllCats)} style={{ padding:"9px 24px",borderRadius:"8px",border:"1px solid rgba(155,0,32,.2)",background:"transparent",color:BURG,fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                {showAllCats ? "Show Less ↑" : `Show All ${categories.length} Categories ↓`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══ PRODUCTS ══════════════════════════════════════ */}
      <section ref={productsRef} style={{ padding:"0 48px 72px",background:"#f8f8f8" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto" }}>

          {/* Sticky filter bar */}
          <div style={{ position:"sticky",top:"68px",zIndex:50,background:"#f8f8f8",paddingTop:"28px",paddingBottom:"16px",borderBottom:"1px solid #ebebeb",marginBottom:"24px" }}>
            <div style={{ display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center",marginBottom:"12px" }}>
              <div style={{ flex:1,minWidth:"220px",position:"relative" }}>
                <span style={{ position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",fontSize:"14px",pointerEvents:"none" }}>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ width:"100%",padding:"10px 14px 10px 36px",borderRadius:"8px",border:"1.5px solid #e0e0e0",fontSize:"13px",color:"#111",background:"#fff",fontFamily:"'DM Sans',sans-serif" }} />
                {search && <button onClick={() => setSearch("")} style={{ position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",fontSize:"18px",color:"#bbb",cursor:"pointer",padding:0,lineHeight:1 }}>×</button>}
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding:"10px 14px",borderRadius:"8px",border:"1.5px solid #e0e0e0",fontSize:"13px",color:"#111",background:"#fff",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                <option value="default">Featured First</option>
                <option value="az">A – Z</option>
                <option value="moq-low">MOQ: Low to High</option>
                <option value="moq-high">MOQ: High to Low</option>
              </select>
              {activeCat !== "All" && (
                <button onClick={() => setActiveCat("All")} style={{ padding:"10px 16px",borderRadius:"8px",border:"1px solid rgba(155,0,32,.2)",background:"rgba(155,0,32,.07)",color:BURG,fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                  {categories.find(c => c.id === activeCat)?.label} ×
                </button>
              )}
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"13px",color:"#888" }}>
                Showing <strong style={{ color:"#111" }}>{filtered.length}</strong> products
                {activeCat !== "All" && <> in <strong style={{ color:BURG }}>{categories.find(c => c.id === activeCat)?.label}</strong></>}
              </span>
              {!isLoggedIn && (
                <div style={{ padding:"4px 12px",borderRadius:"99px",background:"rgba(155,0,32,.07)",border:"1px solid rgba(155,0,32,.18)",fontSize:"11px",fontWeight:600,color:BURG,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:"4px" }}>
                  🔒 Sign in to view prices & place orders
                </div>
              )}
            </div>
          </div>

          {/* Category pills */}
          <div style={{ display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"24px" }}>
            <button onClick={() => setActiveCat("All")} style={{ padding:"7px 16px",borderRadius:"99px",border:`1px solid ${activeCat==="All"?BURG:"#ddd"}`,background:activeCat==="All"?BURG:"#fff",color:activeCat==="All"?"#fff":"#555",fontSize:"12px",fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .18s" }}>
              All Products
            </button>
            {PILLS.filter(c => c !== "All").slice(0, 12).map(cat => (
              <button key={cat} onClick={() => setActiveCat(activeCat === cat ? "All" : cat)} style={{ padding:"7px 16px",borderRadius:"99px",border:`1px solid ${activeCat===cat?BURG:"#ddd"}`,background:activeCat===cat?BURG:"#fff",color:activeCat===cat?"#fff":"#555",fontSize:"12px",fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .18s" }}>
                {categories.find(c => c.id === cat)?.label ?? cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center",padding:"80px 20px",background:"#fff",borderRadius:"20px",border:"1px solid #f0f0f0" }}>
              <div style={{ fontSize:"48px",marginBottom:"16px" }}>🔍</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"22px",color:"#111",marginBottom:"8px" }}>No products found</h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"14px",color:"#888",marginBottom:"20px" }}>Try a different category or search term</p>
              <button onClick={() => { setActiveCat("All"); setSearch(""); }} style={{ padding:"11px 24px",borderRadius:"8px",background:BURG,color:"#fff",border:"none",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                Show All Products
              </button>
            </div>
          ) : (
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"20px" }}>
              {filtered.map((p, i) => (
                <div key={p.id} style={{ animation:`sk-fade .4s ${Math.min(i, 8) * 0.05}s ease both` }}>
                  <ProductCard p={p} categories={categories} onLock={() => setShowLogin(true)} wishlisted={wishlist.has(p.id)} onWish={() => toggleWish(p.id)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ UNLOCK CTA — only for guests ═════════════════ */}
      {!isLoggedIn && (
        <section style={{ padding:"0 48px 72px",background:"#f8f8f8" }}>
          <div style={{ maxWidth:"1280px",margin:"0 auto" }}>
            <div style={{ borderRadius:"24px",background:"#fff",border:"1.5px solid rgba(155,0,32,.15)",padding:"64px 48px",textAlign:"center",position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",inset:0,backgroundImage:`radial-gradient(rgba(155,0,32,.055) 1.5px,transparent 1.5px)`,backgroundSize:"26px 26px",pointerEvents:"none" }} />
              <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"72px",height:"4px",background:BURG,borderRadius:"0 0 5px 5px" }} />
              <div style={{ position:"relative" }}>
                <div style={{ width:"64px",height:"64px",borderRadius:"50%",background:"rgba(155,0,32,.07)",border:"1px solid rgba(155,0,32,.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:"28px" }}>🔒</div>
                <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,3.5vw,40px)",fontWeight:700,color:"#111",lineHeight:1.1,marginBottom:"14px" }}>
                  Unlock Full Gallery Access
                </h2>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"15px",color:"#555",lineHeight:1.85,maxWidth:"500px",margin:"0 auto 20px" }}>
                  Prices are <strong style={{ color:BURG }}>exclusively available to verified sellers.</strong> Register free to unlock pricing, bulk order capabilities, and direct-from-manufacturer rates.
                </p>
                <div style={{ display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap",marginBottom:"36px" }}>
                  {["✓ View all prices","✓ Bulk ordering","✓ Best margins","✓ GST invoices","✓ Direct from warehouse"].map(f => (
                    <span key={f} style={{ padding:"5px 14px",borderRadius:"99px",background:"rgba(155,0,32,.07)",color:BURG,fontSize:"12px",fontWeight:600,fontFamily:"'DM Sans',sans-serif" }}>{f}</span>
                  ))}
                </div>
                <div style={{ display:"flex",gap:"14px",justifyContent:"center",flexWrap:"wrap" }}>
                  <Link href="/register" style={{ padding:"15px 44px",borderRadius:"10px",background:BURG,color:"#fff",fontSize:"14px",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 10px 28px rgba(155,0,32,.28)",letterSpacing:".04em" }}>
                    Register as Seller — Free →
                  </Link>
                  <Link href="/login" style={{ padding:"15px 36px",borderRadius:"10px",border:"1.5px solid #ddd",color:"#333",fontSize:"14px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>
                    Already a Seller? Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
