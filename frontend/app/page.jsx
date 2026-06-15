"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;
const BURG  = "#9B0020";
const GRADS = "0 8px 24px rgba(155,0,32,.3)";

const HERO_MEDIA = [
  // { type:"image", src:"/hero/product1.jpg", caption:"Brass Ganesh Collection" },
  // { type:"image", src:"/hero/product2.jpg", caption:"Madhubani Paintings"     },
  // { type:"video", src:"/hero/reel.mp4",     caption:"Product Reel"            },
];

const GALLERY_IMGS = ["","","","","",""];
const VIDEO_ITEMS  = [
  { src:"", thumb:"", title:"Photoshoot Behind the Scenes", dur:"01:25" },
  { src:"", thumb:"", title:"Marketing Reel Sample",        dur:"00:45" },
  { src:"", thumb:"", title:"Seller Training Demo",         dur:"02:10" },
];
const TRAINING = [
  { title:"How to Manage Your Store",       desc:"Basic store management tutorial",     dur:"15:30" },
  { title:"Product Listing Best Practices", desc:"Increase visibility & better sales",  dur:"12:45" },
  { title:"Marketing Strategies",           desc:"Grow with ads & social media",        dur:"18:20" },
  { title:"Order & Inventory Management",   desc:"Complete guide for smooth operations",dur:"10:15" },
];
const TESTIMONIALS = [
  { name:"Neha Sharma",  text:"Sanskriti made it so easy to start my online business. They handle everything and I just focus on growing my brand.", stars:5 },
  { name:"Ramesh Gupta", text:"The photoshoots and marketing videos they create are top-notch. My sales increased 5x in 2 months!", stars:5 },
  { name:"Pooja Verma",  text:"Inventory and order management saved me so much time and effort. Highly recommended.", stars:5 },
];
const WHY = [
  { icon:"🤝", title:"End-to-End Support",     desc:"We handle everything from start to scale."     },
  { icon:"😌", title:"Zero Hassle Operations", desc:"No worry about inventory, packing or shipping." },
  { icon:"👨‍💼", title:"Expert Team",            desc:"Professionals in photography, marketing, ops."  },
  { icon:"🏷️", title:"Grow Your Brand",        desc:"We help you build a brand that lasts."         },
];
const SERVICES = [
  { icon:"📸", title:"Photoshoots",          desc:"Professional product photos for every platform."        },
  { icon:"🎬", title:"Marketing Videos",     desc:"Reels, ads & product videos that sell your brand."      },
  { icon:"🛍️", title:"E-commerce Setup",     desc:"Store creation, branding, and product listing."         },
  { icon:"📦", title:"Inventory Management", desc:"We store, manage & monitor your stock."                  },
  { icon:"🚚", title:"Order Management",      desc:"Packing, shipping & order tracking handled by us."      },
  { icon:"📊", title:"Dashboard",            desc:"Real-time analytics of sales, orders & inventory."      },
  { icon:"🎓", title:"Training & Support",   desc:"Step-by-step training and expert seller support."       },
  { icon:"📢", title:"Marketing & Ads",      desc:"Meta Ads, Google Ads & social media growth strategies." },
];

// Flow steps — 6 steps in circular flow
const FLOW_STEPS = [
  { n:1, icon:"🙋", title:"Enroll",           desc:"Register on Sanskriti"       },
  { n:2, icon:"⚙️", title:"Account Setup",    desc:"We set up your profile"      },
  { n:3, icon:"📋", title:"Product Listing",  desc:"We list your products"        },
  { n:4, icon:"📦", title:"Order Received",   desc:"You receive orders"           },
  { n:5, icon:"🚚", title:"We Dispatch",      desc:"We ship from our warehouse"   },
  { n:6, icon:"💰", title:"You Earn",         desc:"Profit to your wallet"        },
];

// ── Hero Carousel ─────────────────────────────────────────────
function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    if (HERO_MEDIA.length <= 1) return;
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i+1) % HERO_MEDIA.length); setFade(true); }, 300);
    }, 4000);
    return () => clearInterval(t);
  }, []);
  const go = i => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 200); };
  const cur = HERO_MEDIA[idx];
  const isVid = cur?.src?.endsWith(".mp4") || cur?.src?.endsWith(".webm");

  if (!HERO_MEDIA.length) return (
    <div style={{ borderRadius:"20px", background:"linear-gradient(135deg,#f9f9f9,#f0f0f0)", aspectRatio:"4/3", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", border:"2px dashed #e5e5e5" }}>
      <div style={{ fontSize:"60px", opacity:.12, marginBottom:"14px" }}>🏺</div>
      <div style={{ fontSize:"13px", color:"#ccc", fontWeight:600 }}>Add your photos & videos</div>
      <div style={{ fontSize:"11px", color:"#ddd", marginTop:"6px", textAlign:"center", lineHeight:1.6 }}>Uncomment items in<br /><code style={{ background:"#f0f0f0", padding:"1px 5px", borderRadius:"3px", color:"#bbb" }}>HERO_MEDIA</code></div>
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
      <div style={{ position:"absolute", bottom:"52px", left:"20px" }}>
        <div style={{ fontSize:"14px", fontWeight:700, color:"#fff" }}>{cur.caption}</div>
        <div style={{ fontSize:"11px", color:"rgba(255,255,255,.6)" }}>{idx+1} / {HERO_MEDIA.length}</div>
      </div>
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

// ── Flow Diagram (How We Work) ────────────────────────────────
function FlowDiagram() {
  const top = FLOW_STEPS.slice(0,3);  // 1,2,3
  const bot = FLOW_STEPS.slice(3).reverse(); // 6,5,4

  const ArrowR = () => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"40px", flexShrink:0 }}>
      <svg width="40" height="14" viewBox="0 0 40 14">
        <line x1="0" y1="7" x2="32" y2="7" stroke={BURG} strokeWidth="2" strokeDasharray="4 3"/>
        <polygon points="32,2 40,7 32,12" fill={BURG}/>
      </svg>
    </div>
  );
  const ArrowL = () => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"40px", flexShrink:0 }}>
      <svg width="40" height="14" viewBox="0 0 40 14">
        <line x1="40" y1="7" x2="8" y2="7" stroke={BURG} strokeWidth="2" strokeDasharray="4 3"/>
        <polygon points="8,2 0,7 8,12" fill={BURG}/>
      </svg>
    </div>
  );
  const ArrowD = () => (
    <div style={{ display:"flex", justifyContent:"flex-end", paddingRight:"30px", height:"24px", alignItems:"center" }}>
      <svg width="14" height="24" viewBox="0 0 14 24">
        <line x1="7" y1="0" x2="7" y2="18" stroke={BURG} strokeWidth="2" strokeDasharray="4 3"/>
        <polygon points="2,18 7,24 12,18" fill={BURG}/>
      </svg>
    </div>
  );
  const ArrowU = () => (
    <div style={{ display:"flex", justifyContent:"flex-start", paddingLeft:"30px", height:"24px", alignItems:"center" }}>
      <svg width="14" height="24" viewBox="0 0 14 24">
        <line x1="7" y1="24" x2="7" y2="6" stroke={BURG} strokeWidth="2" strokeDasharray="4 3"/>
        <polygon points="2,6 7,0 12,6" fill={BURG}/>
      </svg>
    </div>
  );

  const Step = ({ s, small }) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", flex:1 }}>
      <div style={{ position:"relative", marginBottom:"10px" }}>
        <div style={{ width:small?"52px":"60px", height:small?"52px":"60px", borderRadius:"16px", background:BURG, display:"flex", alignItems:"center", justifyContent:"center", fontSize:small?"22px":"26px", boxShadow:`0 6px 18px rgba(155,0,32,.3)` }}>{s.icon}</div>
        <div style={{ position:"absolute", top:"-8px", right:"-8px", width:"22px", height:"22px", borderRadius:"50%", background:"#fff", border:`2.5px solid ${BURG}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:700, color:BURG }}>{s.n}</div>
      </div>
      <div style={{ fontSize:"13px", fontWeight:700, color:"#111", marginBottom:"3px" }}>{s.title}</div>
      <div style={{ fontSize:"11px", color:"#888", lineHeight:1.4 }}>{s.desc}</div>
    </div>
  );

  return (
    <div style={{ padding:"4px 0" }}>
      {/* Top row: 1 → 2 → 3 */}
      <div style={{ display:"flex", alignItems:"center", gap:"0" }}>
        <Step s={top[0]} /><ArrowR /><Step s={top[1]} /><ArrowR /><Step s={top[2]} />
      </div>
      {/* Down arrow on right */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr" }}>
        <div /><div /><ArrowD />
      </div>
      {/* Bottom row: 6 ← 5 ← 4 */}
      <div style={{ display:"flex", alignItems:"center", gap:"0" }}>
        <Step s={bot[0]} /><ArrowL /><Step s={bot[1]} /><ArrowL /><Step s={bot[2]} />
      </div>
      {/* Up arrow on left */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr" }}>
        <ArrowU /><div /><div />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", color:"#111", overflowX:"hidden" }}>
      <style>{`
        ${GF}
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        .srv:hover  { background:#fff8f8!important; border-color:${BURG}!important; }
        .gal:hover  { transform:scale(1.04)!important; }
        .why:hover  { border-color:${BURG}!important; }
        .testi:hover{ border-color:${BURG}!important; }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{ padding:"60px 48px 48px", background:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(155,0,32,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(155,0,32,.012) 1px,transparent 1px)`, backgroundSize:"48px 48px", pointerEvents:"none" }} />
        <div style={{ maxWidth:"1280px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"56px", alignItems:"center" }}>
          <div style={{ animation:"fadeUp .7s ease both" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"5px 14px", borderRadius:"99px", border:`1px solid rgba(155,0,32,.2)`, background:`rgba(155,0,32,.04)`, marginBottom:"20px" }}>
              <span style={{ color:"#f59e0b" }}>★</span>
              <span style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase" }}>India's Premier Seller Platform</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(30px,4vw,54px)", fontWeight:700, color:"#111", lineHeight:1.08, marginBottom:"16px" }}>
              We Build, Manage &amp; Scale<br />
              <span style={{ color:BURG, fontStyle:"italic", fontWeight:400 }}>Your Online Business</span><br />
              End-to-End.
            </h1>
            <p style={{ fontSize:"15px", color:"#555", lineHeight:1.85, marginBottom:"26px", maxWidth:"480px" }}>
              From e-commerce setup to photoshoots, videos, inventory, orders and marketing — we handle everything. You focus on your products. We handle the rest.
            </p>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", marginBottom:"32px" }}>
              <Link href="/register" style={{ padding:"13px 30px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none", boxShadow:GRADS }}>Join as Seller →</Link>
              <Link href="/services" style={{ display:"flex", alignItems:"center", gap:"8px", padding:"13px 24px", borderRadius:"8px", border:"1.5px solid #e5e5e5", color:"#333", fontSize:"14px", fontWeight:500, textDecoration:"none" }}>
                <span style={{ width:"24px", height:"24px", borderRadius:"50%", border:`1.5px solid ${BURG}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", color:BURG }}>▶</span>
                Watch How It Works
              </Link>
            </div>
            <div style={{ display:"flex", borderTop:"1px solid #f0f0f0", paddingTop:"20px" }}>
              {[["25+","Categories"],["1,00,000+","Products"],["500+","Seller Assets"],["1000+","Photoshoots"],["24×7","Support"]].map(([v,l],i) => (
                <div key={l} style={{ flex:1, padding:"0 10px", borderRight:i<4?"1px solid #f0f0f0":"none", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", fontWeight:700, color:BURG }}>{v}</div>
                  <div style={{ fontSize:"10px", color:"#888", marginTop:"2px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <HeroCarousel />
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════ */}
      <div style={{ borderTop:"1px solid #f0f0f0", borderBottom:"1px solid #f0f0f0", padding:"11px 0", overflow:"hidden", background:"#fafafa" }}>
        <div style={{ display:"flex", animation:"marquee 22s linear infinite", width:"max-content" }}>
          {[...Array(2)].map((_,ri) => (
            ["Photoshoots","Marketing Videos","E-commerce Setup","Inventory Management","Order Management","Dashboard & Analytics","Training & Support","Marketing & Ads"].map((s,i) => (
              <span key={`${ri}-${i}`} style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"0 28px", fontSize:"12px", fontWeight:500, color:"#888", letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                <span style={{ width:"4px", height:"4px", borderRadius:"50%", background:BURG, opacity:.4 }} />{s}
              </span>
            ))
          ))}
        </div>
      </div>

      {/* ══ SERVICES ══════════════════════════════════════════ */}
      <section style={{ padding:"0", background:"#fff" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)" }}>
            {SERVICES.map((s,i) => (
              <div key={s.title} className="srv" style={{ padding:"22px 12px", textAlign:"center", borderRight:"1px solid #f0f0f0", borderBottom:"1px solid #f0f0f0", borderTop:"1px solid #f0f0f0", borderLeft:i===0?"1px solid #f0f0f0":"none", transition:"all .2s" }}>
                <div style={{ fontSize:"26px", marginBottom:"8px" }}>{s.icon}</div>
                <div style={{ fontSize:"12px", fontWeight:700, color:"#111", marginBottom:"4px", lineHeight:1.3 }}>{s.title}</div>
                <div style={{ fontSize:"10px", color:"#888", lineHeight:1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3-COL: FLOW DIAGRAM | GALLERY | VIDEOS ═══════════ */}
      <section style={{ padding:"40px 48px", background:"#fafafa" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1.3fr 1.3fr", gap:"18px" }}>

          {/* How We Work — Flow Diagram */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", padding:"20px 16px" }}>
            <div style={{ fontSize:"15px", fontWeight:700, color:"#111", marginBottom:"18px", fontFamily:"'Playfair Display',serif" }}>How We Work</div>
            <FlowDiagram />
          </div>

          {/* Gallery */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", padding:"18px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
              <div style={{ fontSize:"15px", fontWeight:700, color:"#111", fontFamily:"'Playfair Display',serif" }}>Gallery — Our Work</div>
              <Link href="/gallery" style={{ fontSize:"12px", color:BURG, fontWeight:600, textDecoration:"none" }}>View All →</Link>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"6px" }}>
              {[...Array(6)].map((_,i) => (
                <div key={i} className="gal" style={{ aspectRatio:"1", borderRadius:"8px", background:`linear-gradient(135deg,#f0f0f0,#e5e5e5)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", overflow:"hidden", transition:"transform .2s", cursor:"pointer" }}>
                  {GALLERY_IMGS[i] ? <img src={GALLERY_IMGS[i]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ opacity:.25 }}>🏺</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", padding:"18px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
              <div style={{ fontSize:"15px", fontWeight:700, color:"#111", fontFamily:"'Playfair Display',serif" }}>Videos — See It In Action</div>
              <Link href="/training/videos" style={{ fontSize:"12px", color:BURG, fontWeight:600, textDecoration:"none" }}>View All →</Link>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {VIDEO_ITEMS.map((v,i) => (
                <div key={i} style={{ display:"flex", gap:"10px", alignItems:"center", padding:"8px", borderRadius:"8px", background:"#f9f9f9", cursor:"pointer", transition:"background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background="#fff8f8"}
                  onMouseLeave={e => e.currentTarget.style.background="#f9f9f9"}>
                  <div style={{ width:"72px", height:"52px", borderRadius:"6px", background:"#1a1a1a", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                    {v.thumb && <img src={v.thumb} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />}
                    <div style={{ width:"22px", height:"22px", borderRadius:"50%", background:"rgba(255,255,255,.2)", border:"1.5px solid rgba(255,255,255,.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", color:"#fff", zIndex:1 }}>▶</div>
                    <div style={{ position:"absolute", bottom:"3px", right:"4px", fontSize:"9px", color:"rgba(255,255,255,.8)", background:"rgba(0,0,0,.4)", padding:"1px 4px", borderRadius:"3px", zIndex:1 }}>{v.dur}</div>
                  </div>
                  <div style={{ fontSize:"12px", fontWeight:600, color:"#111" }}>{v.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4-COL: DASHBOARD | TRAINING | WHY | TESTIMONIALS ═ */}
      <section style={{ padding:"40px 48px", background:"#fff" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", display:"grid", gridTemplateColumns:"1.3fr 1fr 1fr 1fr", gap:"18px", alignItems:"start" }}>

          {/* Dashboard Preview */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", overflow:"hidden" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 14px 10px" }}>
              <div style={{ fontSize:"14px", fontWeight:700, color:"#111", fontFamily:"'Playfair Display',serif" }}>Seller Dashboard Preview</div>
              <Link href="/login" style={{ fontSize:"11px", color:BURG, fontWeight:600, textDecoration:"none" }}>View Dashboard →</Link>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"72px 1fr" }}>
              <div style={{ background:BURG, padding:"8px 0" }}>
                {["📊","📦","🏺","📋","👥","📈","⚙️"].map((ic,i) => (
                  <div key={i} style={{ padding:"6px 8px", fontSize:"11px", color:i===0?"#fff":"rgba(255,255,255,.4)", background:i===0?"rgba(255,255,255,.15)":"transparent", textAlign:"center" }}>{ic}</div>
                ))}
              </div>
              <div style={{ padding:"9px", background:"#f8f8f8" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px", marginBottom:"8px" }}>
                  {[["₹12,45,000","Total Sales","+16%"],["598","Total Orders","+22%"],["23","Products","+3%"],["3","Pending","Orders"]].map(([v,l,b]) => (
                    <div key={l} style={{ background:"#fff", borderRadius:"5px", padding:"5px", border:"1px solid #eee" }}>
                      <div style={{ fontSize:"10px", fontWeight:700, color:BURG }}>{v}</div>
                      <div style={{ fontSize:"7px", color:"#aaa" }}>{l}</div>
                      {b && <div style={{ fontSize:"7px", color:"#22c55e" }}>{b}</div>}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:"8px", fontWeight:600, color:"#555", marginBottom:"4px" }}>Top Categories</div>
                {[["Home Décor","35%"],["Puja Items","28%"],["Furniture","18%"]].map(([cat,pct]) => (
                  <div key={cat} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px", gap:"4px" }}>
                    <div style={{ fontSize:"8px", color:"#666", minWidth:"50px" }}>{cat}</div>
                    <div style={{ flex:1, height:"4px", background:"#f0f0f0", borderRadius:"99px", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:pct, background:BURG, borderRadius:"99px" }} />
                    </div>
                    <div style={{ fontSize:"8px", color:BURG, fontWeight:600 }}>{pct}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Training */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", padding:"14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
              <div style={{ fontSize:"14px", fontWeight:700, color:"#111", fontFamily:"'Playfair Display',serif" }}>Training & Learning</div>
              <Link href="/training" style={{ fontSize:"11px", color:BURG, fontWeight:600, textDecoration:"none" }}>View All →</Link>
            </div>
            {TRAINING.map((t,i) => (
              <div key={i} style={{ display:"flex", gap:"8px", alignItems:"center", padding:"8px 0", borderBottom:i<3?"1px solid #f5f5f5":"none" }}>
                <div style={{ width:"34px", height:"26px", borderRadius:"5px", background:BURG, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:"9px", color:"#fff" }}>▶</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"11px", fontWeight:600, color:"#111", lineHeight:1.3 }}>{t.title}</div>
                  <div style={{ fontSize:"9px", color:"#aaa" }}>{t.desc}</div>
                </div>
                <div style={{ fontSize:"9px", color:"#aaa" }}>{t.dur}</div>
              </div>
            ))}
          </div>

          {/* Why */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", padding:"14px" }}>
            <div style={{ fontSize:"14px", fontWeight:700, color:"#111", marginBottom:"12px", fontFamily:"'Playfair Display',serif" }}>Why Sellers Trust Sanskriti</div>
            {WHY.map((w,i) => (
              <div key={i} className="why" style={{ display:"flex", gap:"9px", alignItems:"flex-start", padding:"8px", borderRadius:"8px", border:"1px solid transparent", transition:"all .2s", marginBottom:"5px" }}>
                <div style={{ width:"28px", height:"28px", borderRadius:"7px", background:`rgba(155,0,32,.08)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0 }}>{w.icon}</div>
                <div>
                  <div style={{ fontSize:"12px", fontWeight:600, color:"#111" }}>{w.title}</div>
                  <div style={{ fontSize:"10px", color:"#888", lineHeight:1.4 }}>{w.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", padding:"14px" }}>
            <div style={{ fontSize:"14px", fontWeight:700, color:"#111", marginBottom:"12px", fontFamily:"'Playfair Display',serif" }}>What Our Sellers Say</div>
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="testi" style={{ padding:"9px", borderRadius:"8px", border:"1px solid #f0f0f0", marginBottom:"7px", transition:"border .2s" }}>
                <div style={{ display:"flex", gap:"1px", marginBottom:"4px" }}>{"★★★★★".split("").map((s,j) => <span key={j} style={{ color:"#f59e0b", fontSize:"10px" }}>{s}</span>)}</div>
                <div style={{ fontSize:"11px", color:"#444", lineHeight:1.6, marginBottom:"4px" }}>{t.text}</div>
                <div style={{ fontSize:"10px", fontWeight:700, color:BURG }}>— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOTTOM CTA — glass box ════════════════════════════ */}
      <section style={{ background:"#f9f9f9", padding:"40px 48px 60px" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <div style={{ borderRadius:"20px", background:"rgba(255,255,255,.85)", backdropFilter:"blur(16px)", border:`2px solid ${BURG}`, padding:"52px 48px", textAlign:"center", position:"relative", overflow:"hidden", boxShadow:`0 8px 40px rgba(155,0,32,.1)` }}>
            {/* Subtle red glow corners */}
            <div style={{ position:"absolute", top:"-60px", left:"-60px", width:"200px", height:"200px", background:`radial-gradient(circle,rgba(155,0,32,.08),transparent 70%)`, pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:"-60px", right:"-60px", width:"200px", height:"200px", background:`radial-gradient(circle,rgba(155,0,32,.08),transparent 70%)`, pointerEvents:"none" }} />
            {/* Antique emojis */}
            <div style={{ position:"absolute", left:"40px", bottom:"20px", fontSize:"80px", opacity:.06, transform:"rotate(-10deg)" }}>🏺</div>
            <div style={{ position:"absolute", right:"40px", top:"20px", fontSize:"70px", opacity:.06, transform:"rotate(10deg)" }}>🪔</div>
            <div style={{ position:"relative" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"5px 16px", borderRadius:"99px", background:`rgba(155,0,32,.07)`, border:`1px solid rgba(155,0,32,.15)`, marginBottom:"16px" }}>
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
