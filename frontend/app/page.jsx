"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;
const BURG  = "#9B0020";
const GRADS = "0 8px 24px rgba(155,0,32,.3)";

// ── ADD HERO CAROUSEL IMAGES/VIDEOS HERE ─────────────────────
const HERO_MEDIA = [
  // { type:"image", src:"/hero/product1.jpg", caption:"Brass Ganesh Collection" },
  // { type:"image", src:"/hero/artisans.jpg", caption:"Artisans at Work"        },
  // { type:"video", src:"/hero/reel.mp4",     caption:"Product Reel"            },
];

// ── GALLERY / TRAINING SNEAK-PEEK MEDIA (put your real photos here) ──
const GALLERY_PEEK = [
  "/gallery/peek1.jpg",
  "/gallery/peek2.jpg",
  "/gallery/peek3.jpg",
];
const TRAINING_PEEK = "/training/thumb.jpg";

const TESTIMONIALS = [
  { name:"Neha Sharma",   role:"Antique Seller, Lucknow",  text:"Sanskriti made it so easy to start my online business. They handle everything and I just focus on growing my brand.", stars:5 },
  { name:"Ramesh Gupta",  role:"Brass Craftsman, Moradabad",text:"The photoshoots and marketing videos they create are top-notch. My sales increased 5x in 2 months!", stars:5 },
  { name:"Pooja Verma",   role:"Textile Dealer, Jaipur",   text:"Inventory and order management saved me so much time and effort. Highly recommended to every seller.", stars:5 },
  { name:"Anil Sharma",   role:"Pottery Artist, Khurja",   text:"I never thought selling online could be this simple. Sanskriti handles everything from listing to delivery.", stars:5 },
  { name:"Sunita Agarwal",role:"Jewellery Seller, Delhi",  text:"The training videos and live sessions are excellent. I learned so much about GST, pricing, and Amazon in just weeks.", stars:5 },
  { name:"Vivek Tiwari",  role:"Furniture Maker, Saharanpur",text:"Best decision I made for my business. Dashboard gives real-time visibility and the team is always responsive.", stars:5 },
];

// ── Hero Carousel ─────────────────────────────────────────────
function HeroCarousel() {
  const [idx, setIdx]   = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (HERO_MEDIA.length <= 1) return;
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % HERO_MEDIA.length); setFade(true); }, 300);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const go = i => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 200); };
  const cur = HERO_MEDIA[idx];
  const isVid = cur?.src?.endsWith(".mp4") || cur?.src?.endsWith(".webm");

  if (!HERO_MEDIA.length) return (
    <div style={{ borderRadius:"20px", background:"linear-gradient(135deg,#f5f5f5,#ebebeb)", aspectRatio:"4/3", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", border:"2px dashed #e0e0e0" }}>
      <div style={{ fontSize:"56px", opacity:.1, marginBottom:"12px" }}>🏺</div>
      <div style={{ fontSize:"13px", color:"#ccc", fontWeight:600 }}>Add your photos & videos</div>
      <div style={{ fontSize:"11px", color:"#ddd", marginTop:"5px", textAlign:"center" }}>Uncomment items in <code style={{ background:"#f0f0f0", padding:"1px 5px", borderRadius:"3px", color:"#bbb" }}>HERO_MEDIA</code></div>
    </div>
  );

  return (
    <div style={{ position:"relative", borderRadius:"20px", overflow:"hidden", aspectRatio:"4/3", background:"#111", boxShadow:"0 24px 60px rgba(0,0,0,.15)" }}>
      <div style={{ position:"absolute", inset:0, opacity:fade?1:0, transition:"opacity .3s" }}>
        {isVid
          ? <video key={cur.src} src={cur.src} autoPlay muted loop playsInline style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : <img key={cur.src} src={cur.src} alt={cur.caption} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        }
      </div>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.55),transparent 50%)" }} />
      {cur.caption && (
        <div style={{ position:"absolute", bottom:"52px", left:"20px" }}>
          <div style={{ fontSize:"14px", fontWeight:700, color:"#fff" }}>{cur.caption}</div>
          <div style={{ fontSize:"11px", color:"rgba(255,255,255,.6)" }}>{idx+1} / {HERO_MEDIA.length}</div>
        </div>
      )}
      {HERO_MEDIA.length > 1 && <>
        <button onClick={() => go((idx-1+HERO_MEDIA.length)%HERO_MEDIA.length)} style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", width:"34px", height:"34px", borderRadius:"50%", background:"rgba(255,255,255,.18)", border:"1px solid rgba(255,255,255,.3)", color:"#fff", fontSize:"18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
        <button onClick={() => go((idx+1)%HERO_MEDIA.length)} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", width:"34px", height:"34px", borderRadius:"50%", background:"rgba(255,255,255,.18)", border:"1px solid rgba(255,255,255,.3)", color:"#fff", fontSize:"18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
      </>}
      <div style={{ position:"absolute", bottom:"20px", left:"50%", transform:"translateX(-50%)", display:"flex", gap:"5px" }}>
        {HERO_MEDIA.map((_,i) => <button key={i} onClick={() => go(i)} style={{ width:i===idx?"18px":"6px", height:"6px", borderRadius:"99px", background:i===idx?"#fff":"rgba(255,255,255,.4)", border:"none", cursor:"pointer", transition:"all .25s", padding:0 }} />)}
      </div>
    </div>
  );
}

// ── Flow Diagram ──────────────────────────────────────────────
const FLOW = [
  { n:1, icon:"🙋", title:"Enroll",          desc:"Register on Sanskriti"      },
  { n:2, icon:"⚙️", title:"Account Setup",   desc:"We set up your profile"     },
  { n:3, icon:"📋", title:"Product Listing", desc:"We list your products"       },
  { n:4, icon:"📦", title:"Order Received",  desc:"You receive orders"          },
  { n:5, icon:"🚚", title:"We Dispatch",     desc:"We ship from our warehouse"  },
  { n:6, icon:"💰", title:"You Earn",        desc:"Profit to your wallet"       },
];

function FlowStep({ s }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", flex:1 }}>
      <div style={{ position:"relative", marginBottom:"14px" }}>
        <div style={{ width:"80px", height:"80px", borderRadius:"22px", background:BURG, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"32px", boxShadow:`0 8px 24px rgba(155,0,32,.35)` }}>{s.icon}</div>
        <div style={{ position:"absolute", top:"-10px", right:"-10px", width:"26px", height:"26px", borderRadius:"50%", background:"#fff", border:`2.5px solid ${BURG}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:700, color:BURG }}>{s.n}</div>
      </div>
      <div style={{ fontSize:"15px", fontWeight:700, color:"#111", marginBottom:"4px", fontFamily:"'Playfair Display',serif" }}>{s.title}</div>
      <div style={{ fontSize:"12px", color:"#888", lineHeight:1.5 }}>{s.desc}</div>
    </div>
  );
}

const ArrowR = () => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"60px", height:"80px", flexShrink:0 }}>
    <svg width="54" height="16" viewBox="0 0 54 16">
      <line x1="0" y1="8" x2="44" y2="8" stroke={BURG} strokeWidth="2.5" strokeDasharray="5 4"/>
      <polygon points="44,2 54,8 44,14" fill={BURG}/>
    </svg>
  </div>
);
const ArrowL = () => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"60px", height:"80px", flexShrink:0 }}>
    <svg width="54" height="16" viewBox="0 0 54 16">
      <line x1="54" y1="8" x2="10" y2="8" stroke={BURG} strokeWidth="2.5" strokeDasharray="5 4"/>
      <polygon points="10,2 0,8 10,14" fill={BURG}/>
    </svg>
  </div>
);
const ArrowDown = () => (
  <div style={{ display:"flex", alignItems:"center", marginBottom:"8px" }}>
    <div style={{ flex:1 }} />
    <div style={{ width:"60px", flexShrink:0 }} />
    <div style={{ flex:1 }} />
    <div style={{ width:"60px", flexShrink:0 }} />
    <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
      <svg width="16" height="36" viewBox="0 0 16 36">
        <line x1="8" y1="0" x2="8" y2="26" stroke={BURG} strokeWidth="2.5" strokeDasharray="5 4"/>
        <polygon points="2,26 8,36 14,26" fill={BURG}/>
      </svg>
    </div>
  </div>
);

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [testiPage, setTestiPage] = useState(0);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const perPage = 3;
  const totalPages = Math.ceil(TESTIMONIALS.length / perPage);
  const visibleTestis = TESTIMONIALS.slice(testiPage * perPage, testiPage * perPage + perPage);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", color:"#111", overflowX:"hidden" }}>
      <style>{`
        ${GF}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp  {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes marquee {from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes pulse   {0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
        .testi-card:hover{border-color:${BURG}!important;transform:translateY(-3px)!important;box-shadow:0 10px 28px rgba(155,0,32,.08)!important}
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{ padding:"58px 64px 52px", background:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(155,0,32,.01) 1px,transparent 1px),linear-gradient(90deg,rgba(155,0,32,.01) 1px,transparent 1px)`, backgroundSize:"48px 48px", pointerEvents:"none" }} />
        <div style={{ maxWidth:"1280px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"56px", alignItems:"center", position:"relative" }}>

          {/* Left — text */}
          <div style={{ animation:"fadeUp .7s ease both" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"5px 14px", borderRadius:"99px", border:`1px solid rgba(155,0,32,.2)`, background:`rgba(155,0,32,.04)`, marginBottom:"14px" }}>
              <span style={{ color:"#f59e0b" }}>★</span>
              <span style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase" }}>India's Premier Seller Platform</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,2.6vw,38px)", fontWeight:700, color:"#111", lineHeight:1.12, marginBottom:"14px" }}>
              We Build, Manage &amp; Scale<br />
              <span style={{ color:BURG, fontStyle:"italic", fontWeight:400 }}>Your Online Business</span><br />
              End-to-End.
            </h1>
            <p style={{ fontSize:"15px", color:"#555", lineHeight:1.75, marginBottom:"22px", maxWidth:"480px" }}>
              From e-commerce setup to photoshoots, videos, inventory, orders and marketing — we handle everything. You focus on your products. We handle the rest.
            </p>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", marginBottom:"26px" }}>
              <Link href="/register" style={{ padding:"13px 30px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none", boxShadow:GRADS }}>Join as Seller →</Link>
              <Link href="/services" style={{ display:"flex", alignItems:"center", gap:"8px", padding:"13px 24px", borderRadius:"8px", border:"1.5px solid #e5e5e5", color:"#333", fontSize:"14px", fontWeight:500, textDecoration:"none" }}>
                <span style={{ width:"24px", height:"24px", borderRadius:"50%", border:`1.5px solid ${BURG}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", color:BURG }}>▶</span>
                Watch How It Works
              </Link>
            </div>
            <div style={{ display:"flex", borderTop:"1px solid #f0f0f0", paddingTop:"16px" }}>
              {[["25+","Categories"],["1,00,000+","Products"],["500+","Seller Assets"],["1000+","Photoshoots"],["24×7","Support"]].map(([v,l],i) => (
                <div key={l} style={{ flex:1, padding:"0 8px", borderRight:i<4?"1px solid #f0f0f0":"none", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"17px", fontWeight:700, color:BURG }}>{v}</div>
                  <div style={{ fontSize:"10px", color:"#888", marginTop:"2px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — carousel with glass sneak-peek cards */}
          <div style={{ position:"relative" }}>
            <HeroCarousel />

          {/* white gradient blur — left edge fade (Muchhad-style) */}
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"64%", borderRadius:"20px 0 0 20px", background:"linear-gradient(to right,rgba(255,255,255,.95),rgba(255,255,255,.6) 50%,transparent)", backdropFilter:"blur(5px)", WebkitBackdropFilter:"blur(5px)", pointerEvents:"none" }} />

          {/* two glass sneak-peek cards stacked on the left blur */}
          <div style={{ position:"absolute", left:"18px", top:0, bottom:0, width:"56%", display:"flex", flexDirection:"column", justifyContent:"center", gap:"12px" }}>

          {/* Gallery sneak peek */}
          <Link href="/gallery"
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 16px 36px rgba(155,0,32,.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 12px 30px rgba(0,0,0,.14)"; }}
            style={{ display:"block", width:"100%", textDecoration:"none", background:"rgba(255,255,255,.62)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", border:`1.5px solid ${BURG}`, borderRadius:"16px", boxShadow:"0 12px 30px rgba(0,0,0,.14)", padding:"12px 13px", transition:"transform .2s, box-shadow .2s" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <span style={{ width:"26px", height:"26px", borderRadius:"8px", background:"rgba(155,0,32,.10)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>🏺</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:700, color:"#1d1d1d" }}>Gallery</span>
              </div>
              <span style={{ fontSize:"10px", fontWeight:700, color:BURG, background:"rgba(155,0,32,.08)", border:`1px solid rgba(155,0,32,.20)`, padding:"3px 8px", borderRadius:"99px", whiteSpace:"nowrap" }}>1,00,000+ products</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"7px", marginBottom:"10px" }}>
              {GALLERY_PEEK.map((src,i) => (
                <div key={i} style={{ position:"relative", aspectRatio:"1", borderRadius:"9px", overflow:"hidden", background:"rgba(155,0,32,.08)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:"18px", opacity:.35 }}>🏺</span>
                  <img src={src} alt="" onError={e => { e.currentTarget.style.display="none"; }} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", fontWeight:600, color:BURG }}>Explore the gallery →</div>
          </Link>

          {/* Training videos sneak peek */}
          <Link href="/training"
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 16px 36px rgba(155,0,32,.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 12px 30px rgba(0,0,0,.14)"; }}
            style={{ display:"block", width:"100%", textDecoration:"none", background:"rgba(255,255,255,.62)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", border:`1.5px solid ${BURG}`, borderRadius:"16px", boxShadow:"0 12px 30px rgba(0,0,0,.14)", padding:"12px 13px", transition:"transform .2s, box-shadow .2s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
              <span style={{ width:"26px", height:"26px", borderRadius:"8px", background:"rgba(155,0,32,.10)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px" }}>🎬</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:700, color:"#1d1d1d" }}>Training Videos</span>
            </div>
            <div style={{ position:"relative", aspectRatio:"16/9", borderRadius:"10px", overflow:"hidden", background:"#2a1418", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"10px" }}>
              <img src={TRAINING_PEEK} alt="" onError={e => { e.currentTarget.style.display="none"; }} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:.9 }} />
              <span style={{ position:"absolute", width:"70px", height:"70px", borderRadius:"50%", background:"rgba(155,0,32,.4)", filter:"blur(14px)" }} />
              <span style={{ position:"relative", width:"38px", height:"38px", borderRadius:"50%", background:BURG, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"14px", boxShadow:"0 6px 16px rgba(155,0,32,.5)" }}>▶</span>
              <span style={{ position:"absolute", left:"8px", bottom:"7px", fontSize:"9px", color:"rgba(255,255,255,.85)", letterSpacing:".04em" }}>EP 01 · Amazon Selling 101</span>
            </div>
            <div style={{ fontSize:"11px", color:"#6b6258", marginBottom:"8px", lineHeight:1.5 }}>Expert courses on Amazon, branding &amp; operations.</div>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", fontWeight:600, color:BURG }}>Watch &amp; learn →</div>
          </Link>

          </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════ */}
      <div style={{ borderTop:"1px solid #f0f0f0", borderBottom:"1px solid #f0f0f0", padding:"11px 0", overflow:"hidden", background:"#fafafa" }}>
        <div style={{ display:"flex", animation:"marquee 22s linear infinite", width:"max-content" }}>
          {[...Array(2)].map((_,ri) =>
            ["Photoshoots","Marketing Videos","E-commerce Setup","Inventory Management","Order Management","Dashboard & Analytics","Training & Support","Marketing & Ads"].map((s,i) => (
              <span key={`${ri}-${i}`} style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"0 28px", fontSize:"12px", fontWeight:500, color:"#888", letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                <span style={{ width:"4px", height:"4px", borderRadius:"50%", background:BURG, opacity:.4 }} />{s}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══ FLOW DIAGRAM — full width ═════════════════════════ */}
      <section style={{ padding:"72px 64px", background:"#fff" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          {/* Heading */}
          <div style={{ textAlign:"center", marginBottom:"52px" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", padding:"4px 14px", borderRadius:"99px", border:`1px solid rgba(155,0,32,.2)`, background:`rgba(155,0,32,.04)`, marginBottom:"14px" }}>
              <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:BURG, animation:"pulse 2s infinite", display:"inline-block" }} />
              <span style={{ fontSize:"10px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase" }}>How It Works</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, color:"#111", marginBottom:"10px" }}>
              Simple 6-Step Journey to
              <span style={{ fontStyle:"italic", color:BURG, fontWeight:400 }}> Success</span>
            </h2>
            <p style={{ fontSize:"15px", color:"#666", maxWidth:"500px", margin:"0 auto", lineHeight:1.8 }}>
              From enrollment to earning — fully managed by our team. No manpower, no warehouse, no inventory needed.
            </p>
          </div>

          {/* Top row: 1 → 2 → 3 */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"center" }}>
            <FlowStep s={FLOW[0]} /><ArrowR />
            <FlowStep s={FLOW[1]} /><ArrowR />
            <FlowStep s={FLOW[2]} />
          </div>

          {/* Down arrow on right */}
          <ArrowDown />

          {/* Bottom row: 6 ← 5 ← 4 */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"center" }}>
            <FlowStep s={FLOW[5]} /><ArrowL />
            <FlowStep s={FLOW[4]} /><ArrowL />
            <FlowStep s={FLOW[3]} />
          </div>

          {/* CTA */}
          <div style={{ textAlign:"center", marginTop:"28px" }}>
            <Link href="/register" style={{ display:"inline-block", padding:"13px 36px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none", boxShadow:GRADS }}>
              Start Your Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TRUST STRIP — Muchhad-style full-width band ═══════ */}
      <div style={{ background:"linear-gradient(90deg,rgba(155,0,32,.06),rgba(155,0,32,.015) 50%,rgba(155,0,32,.06))", borderTop:"1px solid rgba(155,0,32,.12)", borderBottom:"1px solid rgba(155,0,32,.12)", padding:"18px 24px" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-around", flexWrap:"wrap", rowGap:"12px" }}>
          {[
            { icon:"❌", label:"No Manpower Needed",  hi:false },
            { icon:"❌", label:"No Warehouse Needed", hi:false },
            { icon:"❌", label:"No Inventory Needed", hi:false },
            { icon:"✅", label:"Just Enroll & Earn",  hi:true  },
          ].map(c => (
            <div key={c.label} style={{ display:"inline-flex", alignItems:"center", gap:"10px", padding:"0 12px" }}>
              <span style={{ width:"28px", height:"28px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", background:c.hi?"rgba(34,197,94,.12)":"rgba(155,0,32,.07)", border:c.hi?"1px solid rgba(34,197,94,.35)":"1px solid rgba(155,0,32,.18)", flexShrink:0 }}>{c.icon}</span>
              <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:c.hi?BURG:"#555", whiteSpace:"nowrap" }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ DASHBOARD SECTION — 50/50 split ═════════════════ */}
      <section style={{ padding:"0", background:"#fff" }}>
        <div style={{ display:"grid", gridTemplateColumns:"38% 62%", minHeight:"100vh", alignItems:"stretch" }}>

          {/* LEFT — text + features */}
          <div style={{ padding:"44px 52px", display:"flex", flexDirection:"column", justifyContent:"center", borderRight:"1px solid #eeeeee" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", padding:"4px 14px", borderRadius:"99px", border:`1px solid rgba(155,0,32,.2)`, background:`rgba(155,0,32,.04)`, marginBottom:"18px", width:"fit-content" }}>
              <span style={{ fontSize:"10px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase" }}>Seller Dashboard</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,42px)", fontWeight:700, color:"#111", lineHeight:1.1, marginBottom:"14px" }}>
              Everything you need,
              <span style={{ display:"block", fontStyle:"italic", color:BURG, fontWeight:400 }}>in one place.</span>
            </h2>
            <p style={{ fontSize:"14px", color:"#555", lineHeight:1.7, marginBottom:"6px" }}>
              Track your orders, manage your wallet, download GST invoices, and access training videos — all from a single powerful seller dashboard.
            </p>
            <p style={{ fontSize:"14px", color:"#555", lineHeight:1.7, marginBottom:"18px" }}>
              Built for Indian sellers. Compliant, simple, and always up to date.
            </p>

            {/* Feature list */}
            <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginBottom:"20px" }}>
              {[
                { icon:"💰", title:"Wallet & Payouts",  desc:"Add funds, track balance, request payouts — all in real time."          },
                { icon:"📦", title:"Order Management",  desc:"View, track, and manage every order with full status history."           },
                { icon:"🧾", title:"GST Invoices",      desc:"Auto-generated, compliant GST invoices for every transaction."          },
                { icon:"🎬", title:"Training Videos",   desc:"Unlock expert courses on Amazon, branding, and operations."             },
                { icon:"🏺", title:"Product Gallery",   desc:"Browse and order from 1L+ products across 25+ categories."              },
                { icon:"👤", title:"KYC & Profile",     desc:"Complete your KYC verification and manage your business details."       },
              ].map((f,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"9px 12px", borderRadius:"12px", background:"rgba(255,255,255,.55)", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)", border:`1.5px solid rgba(155,0,32,.35)`, boxShadow:"0 4px 18px rgba(155,0,32,.06)", transition:"all .2s", cursor:"default" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=BURG; e.currentTarget.style.transform="translateX(4px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(155,0,32,.14)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(155,0,32,.35)"; e.currentTarget.style.transform="translateX(0)"; e.currentTarget.style.boxShadow="0 4px 18px rgba(155,0,32,.06)"; }}>
                  <div style={{ width:"36px", height:"36px", borderRadius:"9px", background:`rgba(155,0,32,.07)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize:"13px", fontWeight:600, color:"#111", marginBottom:"1px" }}>{f.title}</div>
                    <div style={{ fontSize:"11px", color:"#888", lineHeight:1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:"10px" }}>
              <Link href="/register" style={{ padding:"12px 26px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", boxShadow:GRADS }}>Get Your Dashboard →</Link>
              <Link href="/login" style={{ padding:"12px 20px", borderRadius:"8px", border:"1.5px solid #e5e5e5", color:"#333", fontSize:"13px", fontWeight:500, textDecoration:"none" }}>Sign In</Link>
            </div>
          </div>

          {/* RIGHT — dashboard mockup */}
          <div style={{ padding:"32px 44px", display:"flex", alignItems:"center", justifyContent:"center", background:"#fff" }}>
            <div style={{ width:"100%", maxWidth:"none", borderRadius:"16px", overflow:"hidden", border:"1px solid #e5e5e5", boxShadow:"0 20px 60px rgba(0,0,0,.12)", background:"#fff" }}>
              {/* Browser chrome */}
              <div style={{ background:"#f5f5f5", borderBottom:"1px solid #e5e5e5", padding:"9px 14px", display:"flex", alignItems:"center", gap:"8px" }}>
                <div style={{ display:"flex", gap:"5px" }}>
                  <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#ff5f57" }} />
                  <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#ffbd2e" }} />
                  <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#28c840" }} />
                </div>
                <div style={{ flex:1, background:"#fff", borderRadius:"5px", padding:"3px 10px", fontSize:"10px", color:"#aaa", border:"1px solid #e5e5e5" }}>sanskriti.vyrelle.in/dashboard</div>
                <div style={{ display:"flex", alignItems:"center", gap:"4px", padding:"3px 9px", borderRadius:"99px", background:"#f0fdf4", border:"1px solid #bbf7d0" }}>
                  <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />
                  <span style={{ fontSize:"9px", color:"#15803d", fontWeight:600 }}>Live</span>
                </div>
              </div>

              {/* Dashboard UI */}
              <div style={{ display:"grid", gridTemplateColumns:"190px 1fr" }}>
                {/* Sidebar */}
                <div style={{ background:`linear-gradient(180deg,${BURG} 0%,#7a0018 100%)`, padding:"16px 0", minHeight:"420px" }}>
                  <div style={{ padding:"0 14px 12px", borderBottom:"1px solid rgba(255,255,255,.1)", marginBottom:"6px" }}>
                    <div style={{ fontSize:"12px", fontWeight:700, color:"#fff" }}>Sanskriti</div>
                    <div style={{ fontSize:"9px", color:"rgba(255,255,255,.5)", letterSpacing:".08em" }}>SELLER DASHBOARD</div>
                  </div>
                  {[["📊","Dashboard",true],["💰","Wallet",false],["📦","Orders",false],["🧾","Bills",false],["🎬","Videos",false],["🏺","Gallery",false],["👤","Profile",false]].map(([ic,lb,active]) => (
                    <div key={lb} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"9px 14px", background:active?"rgba(255,255,255,.15)":"transparent" }}>
                      <span style={{ fontSize:"12px" }}>{ic}</span>
                      <span style={{ fontSize:"11px", color:active?"#fff":"rgba(255,255,255,.5)", fontWeight:active?600:400 }}>{lb}</span>
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div style={{ padding:"16px 18px", background:"#fafafa" }}>
                  {/* Header */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
                    <div>
                      <div style={{ fontSize:"14px", fontWeight:700, color:"#111" }}>Good morning, Rahul 👋</div>
                      <div style={{ fontSize:"10px", color:"#888" }}>Here's your seller summary for today</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                      <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:BURG, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"10px", fontWeight:700 }}>R</div>
                      <div>
                        <div style={{ fontSize:"10px", fontWeight:600, color:"#111" }}>Rahul Sharma</div>
                        <div style={{ fontSize:"9px", color:"#22c55e" }}>KYC Verified ✓</div>
                      </div>
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px", marginBottom:"14px" }}>
                    {[
                      { icon:"🪙", value:"₹12,450",  label:"Wallet Balance", sub:"+₹2,000 today", subC:"#22c55e" },
                      { icon:"📦", value:"48",        label:"Total Orders",   sub:"3 pending",      subC:"#f59e0b" },
                      { icon:"💹", value:"₹1,84,500", label:"Revenue",        sub:"This month",     subC:"#22c55e" },
                      { icon:"🧾", value:"48",        label:"GST Invoices",   sub:"All generated",  subC:"#888"    },
                    ].map((s,i) => (
                      <div key={i} style={{ background:"#fff", borderRadius:"8px", padding:"10px 11px", border:"1px solid #f0f0f0" }}>
                        <div style={{ fontSize:"16px", marginBottom:"4px" }}>{s.icon}</div>
                        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"14px", fontWeight:700, color:BURG }}>{s.value}</div>
                        <div style={{ fontSize:"9px", color:"#555", marginTop:"1px" }}>{s.label}</div>
                        <div style={{ fontSize:"9px", color:s.subC, fontWeight:500, marginTop:"1px" }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent orders */}
                  <div style={{ background:"#fff", borderRadius:"8px", border:"1px solid #f0f0f0", overflow:"hidden" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 12px", borderBottom:"1px solid #f5f5f5" }}>
                      <div style={{ fontSize:"11px", fontWeight:700, color:"#111" }}>Recent Orders</div>
                      <span style={{ fontSize:"9px", color:BURG, fontWeight:600 }}>View all →</span>
                    </div>
                    {[
                      { id:"SNK-2605-001", name:"Brass Ganesh Idol", buyer:"Priya Mehta",  amt:"₹4,500", status:"DELIVERED", sc:"#22c55e" },
                      { id:"SNK-2605-002", name:"Tanjore Painting",  buyer:"Arjun Nair",   amt:"₹8,200", status:"SHIPPED",   sc:"#3b82f6" },
                      { id:"SNK-2605-003", name:"Silver Necklace",   buyer:"Meera Joshi",  amt:"₹3,100", status:"PENDING",   sc:"#f59e0b" },
                      { id:"SNK-2605-004", name:"Madhubani Art",     buyer:"Rohit Gupta",  amt:"₹2,800", status:"CONFIRMED", sc:"#8b5cf6" },
                    ].map((o,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"7px 12px", borderBottom:i<3?"1px solid #f9f9f9":"none" }}>
                        <div style={{ fontSize:"8px", color:"#aaa", minWidth:"72px" }}>{o.id}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:"10px", fontWeight:600, color:"#111", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{o.name}</div>
                          <div style={{ fontSize:"9px", color:"#aaa" }}>{o.buyer}</div>
                        </div>
                        <div style={{ fontSize:"10px", fontWeight:700, color:"#111", flexShrink:0 }}>{o.amt}</div>
                        <span style={{ fontSize:"8px", fontWeight:700, color:o.sc, padding:"2px 6px", borderRadius:"99px", background:`${o.sc}18`, flexShrink:0 }}>{o.status}</span>
                      </div>
                    ))}
                    {/* CTA button with gradient-blur glow */}
                    <div style={{ position:"relative", display:"flex", justifyContent:"center", margin:"14px 0 16px" }}>
                      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"72%", height:"150%", background:"radial-gradient(ellipse,rgba(155,0,32,.45),transparent 70%)", filter:"blur(22px)", pointerEvents:"none" }} />
                      <Link href="/register" style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"7px", padding:"12px 26px", background:BURG, textDecoration:"none", borderRadius:"10px", boxShadow:GRADS }}>
                        <span style={{ fontSize:"12px" }}>🔓</span>
                        <span style={{ fontSize:"11px", fontWeight:700, color:"#fff" }}>Unlock Your Dashboard — Register Free →</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS — full width ═════════════════════════ */}
      <section style={{ padding:"72px 64px", background:"#fff" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"44px" }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase", marginBottom:"10px" }}>Testimonials</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#111", marginBottom:"10px" }}>
              What Our Sellers Say
            </h2>
            <p style={{ fontSize:"14px", color:"#888" }}>Real sellers. Real results. Real growth.</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px", marginBottom:"28px" }}>
            {visibleTestis.map((t,i) => (
              <div key={i} className="testi-card" style={{ padding:"24px", borderRadius:"16px", border:"1.5px solid #f0f0f0", background:"#fff", transition:"all .25s" }}>
                <div style={{ display:"flex", gap:"2px", marginBottom:"12px" }}>
                  {"★★★★★".split("").map((s,j) => <span key={j} style={{ color:"#f59e0b", fontSize:"14px" }}>{s}</span>)}
                </div>
                <p style={{ fontSize:"13px", color:"#444", lineHeight:1.75, marginBottom:"16px", fontStyle:"italic" }}>"{t.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:BURG, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"13px", fontWeight:700, flexShrink:0 }}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize:"13px", fontWeight:700, color:"#111" }}>{t.name}</div>
                    <div style={{ fontSize:"11px", color:"#aaa" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          <div style={{ display:"flex", justifyContent:"center", gap:"8px" }}>
            {[...Array(totalPages)].map((_,i) => (
              <button key={i} onClick={() => setTestiPage(i)}
                style={{ width:i===testiPage?"24px":"8px", height:"8px", borderRadius:"99px", background:i===testiPage?BURG:"#e5e5e5", border:"none", cursor:"pointer", transition:"all .25s", padding:0 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ GLASS CTA ═════════════════════════════════════════ */}
      <section style={{ background:"#f9f9f9", padding:"40px 64px 64px" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ borderRadius:"24px", background:"rgba(255,255,255,.9)", backdropFilter:"blur(20px)", border:`2px solid ${BURG}`, padding:"56px 48px", textAlign:"center", position:"relative", overflow:"hidden", boxShadow:`0 8px 40px rgba(155,0,32,.1)` }}>
            <div style={{ position:"absolute", top:"-80px", left:"-80px", width:"240px", height:"240px", background:`radial-gradient(circle,rgba(155,0,32,.07),transparent 70%)`, pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:"-80px", right:"-80px", width:"240px", height:"240px", background:`radial-gradient(circle,rgba(155,0,32,.07),transparent 70%)`, pointerEvents:"none" }} />
            <div style={{ position:"absolute", left:"48px", bottom:"16px", fontSize:"80px", opacity:.05, transform:"rotate(-12deg)" }}>🏺</div>
            <div style={{ position:"absolute", right:"48px", top:"16px", fontSize:"70px", opacity:.05, transform:"rotate(12deg)" }}>🪔</div>
            <div style={{ position:"relative" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"5px 16px", borderRadius:"99px", background:`rgba(155,0,32,.06)`, border:`1px solid rgba(155,0,32,.15)`, marginBottom:"18px" }}>
                <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:BURG, animation:"pulse 2s infinite", display:"inline-block" }} />
                <span style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".12em", textTransform:"uppercase" }}>Join 5,000+ Sellers</span>
              </div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,4vw,42px)", fontWeight:700, color:"#111", marginBottom:"12px" }}>
                Ready to Start Your Online Business?
              </h2>
              <p style={{ fontSize:"15px", color:"#666", marginBottom:"28px", maxWidth:"460px", margin:"0 auto 28px", lineHeight:1.85 }}>
                Join thousands of successful sellers who trust Sanskriti to grow their business.
              </p>
              <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
                <Link href="/register" style={{ padding:"14px 40px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none", boxShadow:GRADS }}>
                  Join as Seller Today →
                </Link>
                <Link href="/services" style={{ padding:"14px 32px", borderRadius:"8px", border:`1.5px solid rgba(155,0,32,.3)`, color:BURG, fontSize:"14px", fontWeight:600, textDecoration:"none" }}>
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STICKY BOTTOM BAR ════════════════════════════════ */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:900, background:"#fff", borderTop:"1px solid #f0f0f0", padding:"11px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 -4px 20px rgba(0,0,0,.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ display:"flex" }}>
            {[1,2,3].map(i => <div key={i} style={{ width:"28px", height:"28px", borderRadius:"50%", background:`rgba(155,0,32,.${i}5)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", marginLeft:i>1?"-6px":"0", border:"2px solid #fff" }}>👤</div>)}
          </div>
          <div>
            <div style={{ fontSize:"12px", fontWeight:600, color:"#111" }}>Thousands of sellers trust Sanskriti.</div>
            <div style={{ display:"flex", gap:"1px", alignItems:"center" }}>
              {"★★★★★".split("").map((s,i) => <span key={i} style={{ color:"#f59e0b", fontSize:"11px" }}>{s}</span>)}
              <span style={{ fontSize:"11px", color:"#888", marginLeft:"4px" }}>4.8/5</span>
            </div>
          </div>
        </div>
        <Link href="/register" style={{ padding:"10px 26px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", boxShadow:GRADS }}>
          Join as Seller →
        </Link>
      </div>
      <div style={{ height:"60px" }} />
    </div>
  );
}
