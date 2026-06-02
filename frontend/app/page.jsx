"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ── Colour — Deep Maroon ──────────────────────────────────────
// #9B0020 — richer, darker version of the original crimson red
// ─────────────────────────────────────────────────────────────
const BURG  = "#9B0020";
const GRAD  = "#9B0020";
const GRADS = "0 12px 32px rgba(155,0,32,.3)";

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
  { id: 1, name: "Brass Ganesh Idol",        cat: "Idols & Figurines", emoji: "🏺", bg: "#F5EDE8", tag: "Bestseller"    },
  { id: 2, name: "Handwoven Pashmina Shawl", cat: "Textiles",          emoji: "🧣", bg: "#EDF0F5", tag: "New"           },
  { id: 3, name: "Tanjore Painting",         cat: "Art & Paintings",   emoji: "🖼️", bg: "#EFF5ED", tag: "Featured"      },
  { id: 4, name: "Silver Tribal Necklace",   cat: "Jewellery",         emoji: "💎", bg: "#F0EDF5", tag: "Premium"       },
  { id: 5, name: "Sandalwood Jewellery Box", cat: "Wooden Crafts",     emoji: "🪵", bg: "#F5F0E8", tag: "Bestseller"    },
  { id: 6, name: "Madhubani Painting",       cat: "Art & Paintings",   emoji: "🎨", bg: "#F5EDF2", tag: "New"           },
  { id: 7, name: "Terracotta Lamp Set",      cat: "Home Décor",        emoji: "🪔", bg: "#F5EDE8", tag: "Festival Pick" },
  { id: 8, name: "Bronze Nataraja",          cat: "Idols & Figurines", emoji: "🗿", bg: "#EDF3F5", tag: "Heritage"      },
];

const VIDEOS = [
  { id: 1, title: "Launch on Amazon in 7 Days",       cat: "E-Commerce",   dur: "24:10", views: "15.2K", color:"#9B0020" },
  { id: 2, title: "Brand Building from Zero",         cat: "Branding",     dur: "31:45", views: "12.4K", color:"#0F4C81" },
  { id: 3, title: "Product Photography Secrets",      cat: "Photoshoot",   dur: "18:24", views: "18.6K", color:"#1A5C38" },
  { id: 4, title: "GST & Compliance for Sellers",     cat: "Finance",      dur: "22:08", views: "7.3K",  color:"#5C3D00" },
  { id: 5, title: "Instagram Reels That Convert",     cat: "Social Media", dur: "19:33", views: "21.1K", color:"#4A0080" },
  { id: 6, title: "Inventory Management Masterclass", cat: "Operations",   dur: "28:17", views: "9.8K",  color:"#004D40" },
];

const CATS = [
  "Home Décor","Jewellery","Textiles","Art & Paintings",
  "Wooden Crafts","Idols & Figurines","Pooja Items",
  "Organic Foods","Ayurveda","Accessories","Pottery","Sculptures",
];

const HERO_LINES = ["Grow Your Business.","Sell on Amazon.","Build Your Brand.","Train. Scale. Win."];

const Tag = ({ children }) => (
  <div style={{ display:"inline-block", padding:"6px 14px", borderRadius:"99px", background:"rgba(155,0,32,.06)", border:"1px solid rgba(155,0,32,.18)", fontSize:"11px", fontWeight:600, color:BURG, letterSpacing:".14em", textTransform:"uppercase", marginBottom:"18px", fontFamily:"'DM Sans',sans-serif" }}>
    {children}
  </div>
);

function LoginModal({ onClose }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.52)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"20px",backdropFilter:"blur(6px)",animation:"sk-fadeIn .22s ease" }}>
      <div style={{ background:"#fff",borderRadius:"20px",padding:"48px 40px",width:"100%",maxWidth:"420px",textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,.18)",animation:"sk-slideUp .28s ease",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:"16px",right:"18px",background:"none",border:"none",fontSize:"22px",color:"#aaa",cursor:"pointer" }}>×</button>
        <div style={{ width:"60px",height:"60px",borderRadius:"50%",background:BURG,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px" }}>🎬</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"26px",fontWeight:600,color:"#111",marginBottom:"10px" }}>Seller Access Required</h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"15px",color:"#666",lineHeight:1.7,marginBottom:"30px" }}>Sign in to your verified seller account to watch full training videos.</p>
        <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
          <Link href="/login" style={{ display:"block",padding:"14px",borderRadius:"10px",background:BURG,color:"#fff",fontSize:"14px",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Sign In to Watch →</Link>
          <Link href="/register" style={{ display:"block",padding:"14px",borderRadius:"10px",border:"1.5px solid #e5e5e5",color:"#333",fontSize:"14px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Register as New Seller</Link>
        </div>
      </div>
    </div>
  );
}

function GalleryPopup({ item, onClose }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.58)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,padding:"20px",backdropFilter:"blur(10px)",animation:"sk-fadeIn .22s ease" }}>
      <div style={{ background:"#fff",borderRadius:"24px",width:"100%",maxWidth:"460px",overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,.22)",animation:"sk-scaleIn .28s ease",position:"relative" }}>
        <div style={{ height:"260px",background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
          <span style={{ fontSize:"88px",display:"block",animation:"sk-float 3s ease-in-out infinite" }}>{item.emoji}</span>
          <div style={{ position:"absolute",top:"14px",left:"14px",padding:"5px 12px",borderRadius:"99px",background:BURG,color:"#fff",fontSize:"11px",fontWeight:700,letterSpacing:".08em",fontFamily:"'DM Sans',sans-serif" }}>{item.tag}</div>
          <button onClick={onClose} style={{ position:"absolute",top:"12px",right:"12px",width:"32px",height:"32px",borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",fontSize:"18px",color:"#444",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
        </div>
        <div style={{ padding:"24px 28px 28px" }}>
          <div style={{ fontSize:"11px",color:BURG,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",marginBottom:"6px",fontFamily:"'DM Sans',sans-serif" }}>{item.cat}</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"24px",fontWeight:600,color:"#111",marginBottom:"18px",lineHeight:1.2 }}>{item.name}</h3>
          <div style={{ background:"#fafafa",border:"1px solid #f0f0f0",borderRadius:"12px",padding:"14px 16px",marginBottom:"18px" }}>
            <div style={{ fontSize:"11px",color:"#aaa",marginBottom:"4px",fontFamily:"'DM Sans',sans-serif" }}>Seller Price</div>
            <div style={{ display:"flex",alignItems:"center",gap:"10px" }}>
              <span style={{ fontSize:"22px",fontWeight:700,color:"#111",filter:"blur(5px)",userSelect:"none",fontFamily:"'DM Sans',sans-serif" }}>₹8,500</span>
              <span style={{ fontSize:"11px",padding:"3px 9px",borderRadius:"6px",background:"rgba(155,0,32,.07)",color:BURG,fontWeight:600,border:"1px solid rgba(155,0,32,.15)",fontFamily:"'DM Sans',sans-serif" }}>🔒 Login to View</span>
            </div>
          </div>
          <div style={{ display:"flex",gap:"10px" }}>
            <Link href="/login" style={{ flex:1,padding:"13px",borderRadius:"10px",background:BURG,color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",textAlign:"center",fontFamily:"'DM Sans',sans-serif" }}>Login to Order →</Link>
            <Link href="/gallery" style={{ flex:1,padding:"13px",borderRadius:"10px",border:"1.5px solid #e5e5e5",color:"#333",fontSize:"13px",fontWeight:500,textDecoration:"none",textAlign:"center",fontFamily:"'DM Sans',sans-serif" }}>View Gallery</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SanskritiHomepage() {
  const [showLogin,   setShowLogin]   = useState(false);
  const [galleryItem, setGalleryItem] = useState(null);
  const [heroLine,    setHeroLine]    = useState(0);
  const sectionRefs = useRef({});
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const t = setInterval(() => setHeroLine(l => (l + 1) % HERO_LINES.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setVisibleSections(prev => new Set([...prev, e.target.dataset.sec])); }); },
      { threshold: 0.12 }
    );
    Object.values(sectionRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const secRef = id => el => { if (el) { el.dataset.sec = id; sectionRefs.current[id] = el; } };
  const vis    = id => visibleSections.has(id);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif",background:"#fff",color:"#111",overflowX:"hidden" }}>
      <style>{`
        ${GF}
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes sk-fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes sk-slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sk-scaleIn { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
        @keyframes sk-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes sk-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes sk-heroIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sk-reveal  { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sk-blink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes sk-shimmer { 0%,100%{transform:translateX(-100%)} 50%{transform:translateX(100%)} }
        .sk-srv:hover { border-color:rgba(155,0,32,.25)!important; transform:translateY(-5px)!important; box-shadow:0 16px 40px rgba(155,0,32,.08)!important; }
        .sk-gal:hover { transform:translateY(-6px) scale(1.01)!important; box-shadow:0 20px 48px rgba(0,0,0,.13)!important; }
        .sk-gal:hover .sk-ov { opacity:1!important; }
        .sk-vid:hover { border-color:rgba(155,0,32,.25)!important; transform:translateY(-4px)!important; }
        .sk-feat:hover { background:#fff!important; border-color:rgba(155,0,32,.2)!important; box-shadow:0 8px 24px rgba(155,0,32,.07)!important; }
      `}</style>

      {showLogin   && <LoginModal   onClose={() => setShowLogin(false)} />}
      {galleryItem && <GalleryPopup item={galleryItem} onClose={() => setGalleryItem(null)} />}

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"120px 48px 80px",background:"#fff",position:"relative",overflow:"hidden",textAlign:"center" }}>
        <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(155,0,32,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(155,0,32,.015) 1px,transparent 1px)",backgroundSize:"48px 48px",pointerEvents:"none" }} />
        <div style={{ position:"absolute",top:"20%",left:"30%",width:"500px",height:"400px",background:"radial-gradient(ellipse,rgba(155,0,32,.06) 0%,transparent 65%)",pointerEvents:"none" }} />

        <div style={{ display:"inline-flex",alignItems:"center",gap:"8px",padding:"7px 18px",borderRadius:"99px",border:"1px solid rgba(155,0,32,.2)",background:"rgba(155,0,32,.04)",marginBottom:"32px",animation:"sk-slideUp .7s ease both" }}>
          <span style={{ width:"6px",height:"6px",borderRadius:"50%",background:BURG,animation:"sk-blink 2s infinite" }} />
          <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"12px",letterSpacing:".16em",textTransform:"uppercase",color:BURG,fontWeight:600 }}>India's Premier Seller Platform</span>
        </div>

        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(48px,7vw,88px)",fontWeight:700,color:"#111",lineHeight:1.05,marginBottom:"16px",animation:"sk-slideUp .8s .1s ease both" }}>
          Sanskriti
          <span style={{ display:"block",fontStyle:"italic",color:BURG,fontWeight:400 }}>The Antique</span>
        </h1>

        <div style={{ height:"48px",overflow:"hidden",marginBottom:"22px" }}>
          <span key={heroLine} style={{ display:"block",fontFamily:"'Playfair Display',serif",fontSize:"clamp(20px,3vw,34px)",color:"#777",fontWeight:400,fontStyle:"italic",animation:"sk-heroIn .5s ease both" }}>
            {HERO_LINES[heroLine]}
          </span>
        </div>

        <p style={{ maxWidth:"560px",fontSize:"16px",color:"#666",lineHeight:1.85,marginBottom:"44px",animation:"sk-slideUp 1s .2s ease both" }}>
          From e-commerce setup to branding, photoshoots to training — everything a seller needs across{" "}
          <strong style={{ color:"#111" }}>25+ categories</strong> with <strong style={{ color:"#111" }}>1 lakh+ products</strong>.
        </p>

        <div style={{ display:"flex",gap:"14px",flexWrap:"wrap",justifyContent:"center",animation:"sk-slideUp 1s .3s ease both" }}>
          <Link href="/register" style={{ padding:"15px 44px",borderRadius:"8px",background:BURG,color:"#fff",fontSize:"14px",fontWeight:600,letterSpacing:".08em",textDecoration:"none",boxShadow:GRADS }}>Join as Seller →</Link>
          <Link href="/login" style={{ padding:"15px 36px",borderRadius:"8px",border:"1.5px solid #ddd",color:"#333",fontSize:"14px",fontWeight:500,textDecoration:"none" }}>Sign In</Link>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",background:"#f0f0f0",borderRadius:"16px",overflow:"hidden",marginTop:"72px",width:"100%",maxWidth:"680px",animation:"sk-slideUp 1s .45s ease both" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ padding:"22px 12px",background:"#fff",textAlign:"center" }}>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"30px",fontWeight:700,color:BURG,lineHeight:1 }}>{s.value}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"11px",color:"#999",letterSpacing:".12em",textTransform:"uppercase",marginTop:"5px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ position:"absolute",bottom:"32px",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"5px" }}>
          <div style={{ width:"1px",height:"44px",background:"linear-gradient(to bottom,transparent,rgba(155,0,32,.35))" }} />
          <span style={{ fontSize:"9px",color:"#ccc",letterSpacing:".18em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>scroll</span>
        </div>
      </section>

      {/* ══ MARQUEE ══════════════════════════════════════════ */}
      <div style={{ borderTop:"1px solid #f0f0f0",borderBottom:"1px solid #f0f0f0",padding:"13px 0",overflow:"hidden",background:"#fafafa" }}>
        <div style={{ display:"flex",animation:"sk-marquee 24s linear infinite",width:"max-content" }}>
          {[...CATS,...CATS].map((c,i) => (
            <span key={i} style={{ display:"inline-flex",alignItems:"center",gap:"8px",padding:"0 26px",fontSize:"11px",fontWeight:500,color:"#888",letterSpacing:".1em",textTransform:"uppercase",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif" }}>
              <span style={{ width:"4px",height:"4px",borderRadius:"50%",background:BURG,opacity:.4,flexShrink:0 }} />{c}
            </span>
          ))}
        </div>
      </div>

      {/* ══ WHY JOIN + SERVICES (merged) ══════════════════════ */}
      <section ref={secRef("why")} style={{ padding:"100px 48px",background:"#f8f8f8",opacity:vis("why")?1:0,transform:vis("why")?"none":"translateY(40px)",transition:"all .7s ease" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto" }}>

          {/* Centred headline block */}
          <div style={{ textAlign:"center",marginBottom:"48px" }}>
            <Tag>Why Join Sanskriti?</Tag>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,4vw,54px)",fontWeight:700,color:"#111",lineHeight:1.08,marginBottom:"8px" }}>
              More than a marketplace.
              <span style={{ fontStyle:"italic",color:BURG,fontWeight:400 }}> An ecosystem.</span>
            </h2>
            <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(20px,2.5vw,32px)",fontWeight:700,color:"#111",lineHeight:1.12,marginBottom:"18px" }}>
              Everything a seller needs.
              <span style={{ fontStyle:"italic",fontWeight:400,color:BURG }}> Under one roof.</span>
            </h3>
            <p style={{ fontSize:"16px",color:"#555",lineHeight:1.85,maxWidth:"600px",margin:"0 auto 10px" }}>
              A complete platform that transforms artisans and entrepreneurs into thriving digital-first businesses.
            </p>
            <p style={{ fontSize:"16px",color:"#555",lineHeight:1.85,maxWidth:"600px",margin:"0 auto 32px" }}>
              We serve <strong style={{ color:"#111" }}>25+ product categories</strong> with over <strong style={{ color:"#111" }}>1 lakh products</strong> — handling every step from brand creation to your first sale.
            </p>
            <div style={{ display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap" }}>
              <Link href="/register" style={{ padding:"13px 32px",borderRadius:"8px",background:BURG,color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",boxShadow:"0 6px 20px rgba(155,0,32,.22)" }}>Start Your Journey →</Link>
              <Link href="/services" style={{ padding:"13px 28px",borderRadius:"8px",border:"1.5px solid #ddd",color:"#333",fontSize:"13px",fontWeight:500,textDecoration:"none" }}>See All Services</Link>
            </div>
          </div>

          {/* Services grid — staggered reveal */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"14px" }}>
            {SERVICES.map((s,i) => (
              <div
                key={s.title}
                className="sk-srv"
                style={{
                  background:"#fff",borderRadius:"16px",padding:"26px 22px",
                  border:"1px solid #eee",transition:"all .3s ease",
                  opacity: vis("why") ? 1 : 0,
                  transform: vis("why") ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: vis("why") ? `${i * 0.07}s` : "0s",
                }}
              >
                <div style={{ fontSize:"26px",marginBottom:"12px" }}>{s.icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:600,color:"#111",marginBottom:"8px" }}>{s.title}</h3>
                <p style={{ fontSize:"13px",color:"#777",lineHeight:1.75,fontFamily:"'DM Sans',sans-serif" }}>{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ GALLERY ══════════════════════════════════════════ */}
      <section ref={secRef("gal")} style={{ padding:"100px 48px",background:"#fff",opacity:vis("gal")?1:0,transform:vis("gal")?"none":"translateY(40px)",transition:"all .7s ease" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto" }}>
          <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:"44px",flexWrap:"wrap",gap:"20px" }}>
            <div>
              <Tag>Product Gallery</Tag>
              <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(30px,4vw,48px)",fontWeight:700,color:"#111",lineHeight:1.1 }}>
                A glimpse of <span style={{ fontStyle:"italic",fontWeight:400,color:BURG }}>our collection.</span>
              </h2>
              <p style={{ fontSize:"15px",color:"#777",marginTop:"10px",fontFamily:"'DM Sans',sans-serif" }}>
                Click any product to preview. <strong style={{ color:BURG }}>Prices visible to registered sellers only.</strong>
              </p>
            </div>
            <Link href="/gallery" style={{ display:"inline-flex",alignItems:"center",gap:"6px",padding:"11px 24px",borderRadius:"8px",border:"1.5px solid #ddd",color:"#333",fontSize:"13px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>View Full Gallery →</Link>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px" }}>
            {GALLERY_ITEMS.map((item,i) => (
              <div key={item.id} className="sk-gal" onClick={() => setGalleryItem(item)} style={{ borderRadius:"16px",overflow:"hidden",cursor:"pointer",transition:"all .3s ease",boxShadow:"0 2px 12px rgba(0,0,0,.06)",border:"1px solid #f0f0f0",position:"relative",animation:vis("gal")?`sk-reveal .5s ${i*0.07}s ease both`:"none" }}>
                <div style={{ height:"190px",background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
                  <span style={{ fontSize:"60px" }}>{item.emoji}</span>
                  <div className="sk-ov" style={{ position:"absolute",inset:0,background:BURG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .25s ease" }}>
                    <div style={{ width:"42px",height:"42px",borderRadius:"50%",border:"2px solid rgba(255,255,255,.7)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"20px",marginBottom:"6px" }}>+</div>
                    <span style={{ fontSize:"12px",color:"#fff",fontWeight:600,letterSpacing:".06em",fontFamily:"'DM Sans',sans-serif" }}>Quick View</span>
                  </div>
                  <div style={{ position:"absolute",top:"10px",left:"10px",padding:"3px 9px",borderRadius:"99px",background:"#fff",color:BURG,fontSize:"10px",fontWeight:700,letterSpacing:".08em",boxShadow:"0 2px 8px rgba(0,0,0,.1)",fontFamily:"'DM Sans',sans-serif" }}>{item.tag}</div>
                </div>
                <div style={{ padding:"12px 14px",background:"#fff" }}>
                  <div style={{ fontSize:"10px",color:BURG,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",marginBottom:"4px",fontFamily:"'DM Sans',sans-serif" }}>{item.cat}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"14px",fontWeight:600,color:"#111",marginBottom:"8px",lineHeight:1.3 }}>{item.name}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:"7px" }}>
                    <span style={{ fontSize:"15px",fontWeight:700,color:"#111",filter:"blur(4.5px)",userSelect:"none",fontFamily:"'DM Sans',sans-serif" }}>₹8,500</span>
                    <span style={{ fontSize:"10px",padding:"2px 7px",borderRadius:"5px",background:"rgba(155,0,32,.07)",color:BURG,fontWeight:600,border:"1px solid rgba(155,0,32,.15)",fontFamily:"'DM Sans',sans-serif" }}>🔒 Login</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:"32px",padding:"20px 28px",borderRadius:"14px",background:"#fafafa",border:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"14px" }}>
            <div>
              <span style={{ fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:600,color:"#111" }}>1,00,000+ products</span>
              <span style={{ fontSize:"14px",color:"#888",marginLeft:"10px",fontFamily:"'DM Sans',sans-serif" }}>across 25+ categories. Register to view pricing.</span>
            </div>
            <Link href="/register" style={{ padding:"11px 26px",borderRadius:"8px",background:BURG,color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",boxShadow:"0 6px 20px rgba(155,0,32,.22)",fontFamily:"'DM Sans',sans-serif" }}>Register to Unlock →</Link>
          </div>
        </div>
      </section>

      {/* ══ TRAINING VIDEOS ══════════════════════════════════ */}
      <section ref={secRef("vid")} style={{ background:"#f8f8f8",padding:"100px 48px",opacity:vis("vid")?1:0,transform:vis("vid")?"none":"translateY(40px)",transition:"all .7s ease" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto" }}>
          <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:"44px",flexWrap:"wrap",gap:"20px" }}>
            <div>
              <Tag>Training Library</Tag>
              <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(30px,4vw,48px)",fontWeight:700,color:"#111",lineHeight:1.1 }}>
                Learn from <span style={{ fontStyle:"italic",fontWeight:400,color:BURG }}>the best.</span>
              </h2>
              <p style={{ fontSize:"15px",color:"#777",marginTop:"10px",fontFamily:"'DM Sans',sans-serif" }}>
                Expert courses on Amazon, branding & operations. <strong style={{ color:"#111" }}>Locked for registered sellers.</strong>
              </p>
            </div>
            <Link href="/login" style={{ display:"inline-flex",alignItems:"center",gap:"6px",padding:"11px 24px",borderRadius:"8px",border:"1.5px solid #ddd",color:"#333",fontSize:"13px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>View All Videos →</Link>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px" }}>
            {VIDEOS.map((v,i) => (
              <div key={v.id} className="sk-vid" onClick={() => setShowLogin(true)} style={{ background:"#fff",borderRadius:"16px",overflow:"hidden",border:"1px solid #eee",transition:"all .3s ease",cursor:"pointer",animation:vis("vid")?`sk-reveal .5s ${i*0.08}s ease both`:"none" }}>
                {/* Coloured thumbnail — each card unique colour */}
                <div style={{ height:"148px",background:v.color,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden" }}>
                  {/* animated shimmer sweep */}
                  <div style={{ position:"absolute",inset:0,background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,.08) 50%,transparent 60%)",animation:`sk-shimmer ${1.8+i*0.3}s ease-in-out infinite` }} />
                  {/* lock icon */}
                  <div style={{ width:"52px",height:"52px",borderRadius:"50%",background:"rgba(255,255,255,.12)",border:"2px solid rgba(255,255,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",color:"#fff",backdropFilter:"blur(4px)",position:"relative",zIndex:1 }}>🔒</div>
                  {/* Members only badge */}
                  <div style={{ position:"absolute",top:"10px",left:"10px",padding:"3px 9px",borderRadius:"99px",background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",color:"#fff",fontSize:"9px",fontWeight:700,letterSpacing:".1em",backdropFilter:"blur(4px)",fontFamily:"'DM Sans',sans-serif" }}>MEMBERS ONLY</div>
                  <div style={{ position:"absolute",bottom:"9px",right:"9px",padding:"3px 7px",borderRadius:"5px",background:"rgba(0,0,0,.35)",color:"rgba(255,255,255,.9)",fontSize:"11px",fontFamily:"'DM Sans',sans-serif" }}>{v.dur}</div>
                  {/* views */}
                  <div style={{ position:"absolute",bottom:"9px",left:"10px",padding:"3px 7px",borderRadius:"5px",background:"rgba(0,0,0,.35)",color:"rgba(255,255,255,.8)",fontSize:"10px",fontFamily:"'DM Sans',sans-serif" }}>👁 {v.views}</div>
                </div>
                <div style={{ padding:"14px 16px" }}>
                  <div style={{ fontSize:"10px",color:v.color,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",marginBottom:"5px",fontFamily:"'DM Sans',sans-serif" }}>{v.cat}</div>
                  <h4 style={{ fontFamily:"'Playfair Display',serif",fontSize:"15px",fontWeight:600,color:"#111",lineHeight:1.35 }}>{v.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DASHBOARD PREVIEW ═══════════════════════════════ */}
      <section ref={secRef("dash")} style={{ padding:"100px 48px",background:"#fff",opacity:vis("dash")?1:0,transform:vis("dash")?"none":"translateY(40px)",transition:"all .7s ease" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto" }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"center",marginBottom:"64px" }}>
            <div>
              <Tag>Seller Dashboard</Tag>
              <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,4vw,52px)",fontWeight:700,color:"#111",lineHeight:1.1,marginBottom:"18px" }}>
                Everything you need,
                <span style={{ display:"block",fontStyle:"italic",color:BURG,fontWeight:400 }}>in one place.</span>
              </h2>
              <p style={{ fontSize:"16px",color:"#555",lineHeight:1.85,marginBottom:"14px" }}>Track your orders, manage your wallet, download GST invoices, and access training videos — all from a single powerful seller dashboard.</p>
              <p style={{ fontSize:"16px",color:"#555",lineHeight:1.85,marginBottom:"32px" }}>Built for Indian sellers. Compliant, simple, and always up to date.</p>
              <div style={{ display:"flex",gap:"12px",flexWrap:"wrap" }}>
                <Link href="/register" style={{ padding:"13px 30px",borderRadius:"8px",background:BURG,color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",boxShadow:"0 6px 20px rgba(155,0,32,.22)" }}>Get Your Dashboard →</Link>
                <Link href="/login" style={{ padding:"13px 30px",borderRadius:"8px",border:"1.5px solid #ddd",color:"#333",fontSize:"13px",fontWeight:500,textDecoration:"none" }}>Sign In</Link>
              </div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:"16px" }}>
              {[
                ["💰","Wallet & Payouts",   "Add funds, track balance, request payouts — all in real time."],
                ["📦","Order Management",   "View, track, and manage every order with full status history."],
                ["🧾","GST Invoices",       "Auto-generated, compliant GST invoices for every transaction."],
                ["🎬","Training Videos",    "Unlock expert courses on Amazon, branding, and operations."],
                ["🏺","Product Gallery",    "Browse and order from 1L+ products across 25+ categories."],
                ["👤","KYC & Profile",      "Complete your KYC verification and manage your business details."],
              ].map(([icon,title,desc]) => (
                <div key={title} style={{ display:"flex",gap:"14px",alignItems:"flex-start",padding:"14px 16px",borderRadius:"12px",border:"1px solid #f0f0f0",background:"#fafafa",transition:"all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(155,0,32,.2)"; e.currentTarget.style.background="#fff"; e.currentTarget.style.boxShadow="0 4px 16px rgba(155,0,32,.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#f0f0f0"; e.currentTarget.style.background="#fafafa"; e.currentTarget.style.boxShadow="none"; }}
                >
                  <div style={{ fontSize:"20px",flexShrink:0,marginTop:"2px" }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"15px",fontWeight:600,color:"#111",marginBottom:"3px" }}>{title}</div>
                    <div style={{ fontSize:"13px",color:"#888",lineHeight:1.55,fontFamily:"'DM Sans',sans-serif" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius:"20px",overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,.12)",border:"1px solid #e8e8e8",position:"relative" }}>
            <div style={{ background:"#f5f5f5",padding:"10px 16px",borderBottom:"1px solid #e0e0e0",display:"flex",alignItems:"center",gap:"8px" }}>
              <span style={{ width:"12px",height:"12px",borderRadius:"50%",background:"#ff5f57",display:"block" }} />
              <span style={{ width:"12px",height:"12px",borderRadius:"50%",background:"#ffbd2e",display:"block" }} />
              <span style={{ width:"12px",height:"12px",borderRadius:"50%",background:"#28c840",display:"block" }} />
              <div style={{ flex:1,background:"#ebebeb",borderRadius:"6px",padding:"4px 12px",fontSize:"11px",color:"#888",fontFamily:"'DM Sans',sans-serif",marginLeft:"8px" }}>sanskriti.vyrelle.in/dashboard</div>
              <div style={{ display:"flex",alignItems:"center",gap:"6px",padding:"3px 10px",borderRadius:"6px",background:"rgba(155,0,32,.06)",border:"1px solid rgba(155,0,32,.15)" }}>
                <span style={{ width:"6px",height:"6px",borderRadius:"50%",background:"#22c55e",display:"block" }} />
                <span style={{ fontSize:"10px",color:BURG,fontWeight:600,fontFamily:"'DM Sans',sans-serif" }}>Live</span>
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"200px 1fr",background:"#fff",minHeight:"440px" }}>
              <div style={{ background:"linear-gradient(180deg,#1a0005 0%,#2d000d 100%)",padding:"20px 0",display:"flex",flexDirection:"column",gap:"2px" }}>
                <div style={{ padding:"0 16px 16px",borderBottom:"1px solid rgba(255,255,255,.06)",marginBottom:"8px" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"14px",fontWeight:700,color:"#fff" }}>Sanskriti</div>
                  <div style={{ fontSize:"8px",letterSpacing:".18em",color:BURG,textTransform:"uppercase",marginTop:"2px" }}>Seller Dashboard</div>
                </div>
                {[["🏛️","Dashboard",true],["💰","Wallet",false],["📦","Orders",false],["🧾","Bills",false],["🎬","Videos",false],["🏺","Gallery",false],["👤","Profile",false]].map(([icon,label,active]) => (
                  <div key={label} style={{ display:"flex",alignItems:"center",gap:"10px",padding:"9px 16px",margin:"0 8px",borderRadius:"8px",background:active?"rgba(155,0,32,.9)":"transparent",cursor:"default" }}>
                    <span style={{ fontSize:"14px" }}>{icon}</span>
                    <span style={{ fontSize:"12px",fontWeight:active?600:400,color:active?"#fff":"rgba(255,255,255,.5)",fontFamily:"'DM Sans',sans-serif" }}>{label}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding:"24px",background:"#f8f7f5",overflow:"hidden" }}>
                <div style={{ marginBottom:"20px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"20px",fontWeight:700,color:"#111" }}>Good morning, Rahul 👋</div>
                    <div style={{ fontSize:"12px",color:"#888",marginTop:"2px",fontFamily:"'DM Sans',sans-serif" }}>Here's your seller summary for today</div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:"8px",padding:"6px 12px",borderRadius:"8px",background:"#fff",border:"1px solid #eee" }}>
                    <span style={{ width:"28px",height:"28px",borderRadius:"50%",background:BURG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",color:"#fff",fontWeight:700,fontFamily:"'DM Sans',sans-serif",flexShrink:0 }}>R</span>
                    <div>
                      <div style={{ fontSize:"11px",fontWeight:600,color:"#111",fontFamily:"'DM Sans',sans-serif" }}>Rahul Sharma</div>
                      <div style={{ fontSize:"10px",color:"#22c55e",fontFamily:"'DM Sans',sans-serif" }}>KYC Verified ✓</div>
                    </div>
                  </div>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"18px" }}>
                  {[["💰","Wallet Balance","₹12,450","+₹2,000 today","rgba(155,0,32,.08)"],["📦","Total Orders","48","3 pending","rgba(155,0,32,.05)"],["💹","Revenue","₹1,84,500","This month","rgba(34,197,94,.08)"],["🧾","GST Invoices","48","All generated","rgba(59,130,246,.08)"]].map(([icon,label,val,sub,bg]) => (
                    <div key={label} style={{ background:"#fff",borderRadius:"12px",padding:"14px",border:"1px solid #eee" }}>
                      <div style={{ width:"32px",height:"32px",borderRadius:"8px",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",marginBottom:"8px" }}>{icon}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:700,color:"#111",lineHeight:1,marginBottom:"3px" }}>{val}</div>
                      <div style={{ fontSize:"10px",color:"#888",fontFamily:"'DM Sans',sans-serif" }}>{label}</div>
                      <div style={{ fontSize:"10px",color:"#22c55e",fontFamily:"'DM Sans',sans-serif",marginTop:"3px" }}>{sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:"#fff",borderRadius:"12px",border:"1px solid #eee",overflow:"hidden" }}>
                  <div style={{ padding:"12px 16px",borderBottom:"1px solid #f5f5f5",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"13px",fontWeight:600,color:"#111" }}>Recent Orders</div>
                    <div style={{ fontSize:"10px",color:BURG,fontWeight:600,fontFamily:"'DM Sans',sans-serif" }}>View all →</div>
                  </div>
                  {[["SNK-2605-001","Brass Ganesh Idol","Priya Mehta","₹4,500","DELIVERED"],["SNK-2605-002","Tanjore Painting","Arjun Nair","₹8,200","SHIPPED"],["SNK-2605-003","Silver Necklace","Meera Joshi","₹3,100","PENDING"],["SNK-2605-004","Madhubani Art","Rohit Gupta","₹2,800","CONFIRMED"]].map(([id,product,customer,amount,status],i) => {
                    const sc = { DELIVERED:{bg:"#f0fdf4",c:"#15803d"}, SHIPPED:{bg:"#eff6ff",c:"#1d4ed8"}, PENDING:{bg:"#fffbeb",c:"#854d0e"}, CONFIRMED:{bg:"#f5f3ff",c:"#6d28d9"} }[status];
                    return (
                      <div key={id} style={{ display:"grid",gridTemplateColumns:"auto 1fr auto auto",gap:"12px",padding:"10px 16px",borderBottom:i<3?"1px solid #f9f9f9":"none",alignItems:"center" }}>
                        <div style={{ fontSize:"10px",color:"#aaa",fontFamily:"'DM Sans',sans-serif",fontWeight:600,minWidth:"88px" }}>{id}</div>
                        <div><div style={{ fontSize:"11px",fontWeight:600,color:"#111",fontFamily:"'DM Sans',sans-serif" }}>{product}</div><div style={{ fontSize:"10px",color:"#aaa",fontFamily:"'DM Sans',sans-serif" }}>{customer}</div></div>
                        <div style={{ fontSize:"12px",fontWeight:700,color:"#111",fontFamily:"'DM Sans',sans-serif" }}>{amount}</div>
                        <div style={{ padding:"3px 8px",borderRadius:"99px",background:sc.bg,color:sc.c,fontSize:"9px",fontWeight:700,letterSpacing:".06em",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap" }}>{status}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"120px",background:"linear-gradient(to top,rgba(255,255,255,.98) 0%,rgba(255,255,255,.6) 60%,transparent 100%)",display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"20px" }}>
              <Link href="/register" style={{ display:"inline-flex",alignItems:"center",gap:"8px",padding:"12px 32px",borderRadius:"8px",background:BURG,color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",boxShadow:GRADS,fontFamily:"'DM Sans',sans-serif" }}>
                🔓 Unlock Your Dashboard — Register Free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA BAND ═════════════════════════════════════════ */}
      <section style={{ background:"#f8f8f8",padding:"0 48px 100px" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto" }}>
          <div style={{ borderRadius:"20px",background:"#1a0005",padding:"52px 48px",textAlign:"center",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(155,0,32,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(155,0,32,.06) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none" }} />
            <div style={{ position:"relative" }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,4vw,40px)",fontWeight:600,color:"#fff",marginBottom:"12px" }}>Ready to unlock the full library?</h3>
              <p style={{ fontSize:"15px",color:"rgba(255,255,255,.5)",maxWidth:"460px",margin:"0 auto 32px",lineHeight:1.8,fontFamily:"'DM Sans',sans-serif" }}>Join 5,000+ sellers who have built real businesses with Sanskriti's training and tools.</p>
              <div style={{ display:"flex",gap:"14px",justifyContent:"center",flexWrap:"wrap" }}>
                <Link href="/register" style={{ padding:"14px 36px",borderRadius:"8px",background:BURG,color:"#fff",fontSize:"14px",fontWeight:600,letterSpacing:".08em",textDecoration:"none",boxShadow:"0 12px 32px rgba(155,0,32,.45)",fontFamily:"'DM Sans',sans-serif" }}>Register as Seller →</Link>
                <Link href="/login" style={{ padding:"14px 36px",borderRadius:"8px",border:"1px solid rgba(255,255,255,.18)",color:"rgba(255,255,255,.8)",fontSize:"14px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Already a Seller? Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRUST STRIP ══════════════════════════════════════ */}
      <section ref={secRef("trust")} style={{ padding:"60px 48px",background:"#fff",borderTop:"1px solid #f0f0f0",opacity:vis("trust")?1:0,transform:vis("trust")?"none":"translateY(24px)",transition:"all .6s ease" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"28px" }}>
          {[
            ["🛡️","Verified Sellers","Every seller is KYC-verified by our team."],
            ["📦","GST Invoicing","Compliant invoices on every order."],
            ["🚚","Logistics Support","Packaging and shipping fully guided."],
            ["🤝","Dedicated Support","An account manager for every seller."],
          ].map(([icon,title,desc]) => (
            <div key={title} style={{ display:"flex",gap:"14px",alignItems:"flex-start" }}>
              <div style={{ fontSize:"22px",flexShrink:0,marginTop:"2px" }}>{icon}</div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"15px",fontWeight:600,color:"#111",marginBottom:"4px" }}>{title}</div>
                <div style={{ fontSize:"13px",color:"#888",lineHeight:1.65,fontFamily:"'DM Sans',sans-serif" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
