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
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"60px", flexShrink:0, paddingBottom:"40px" }}>
    <svg width="54" height="16" viewBox="0 0 54 16">
      <line x1="0" y1="8" x2="44" y2="8" stroke={BURG} strokeWidth="2.5" strokeDasharray="5 4"/>
      <polygon points="44,2 54,8 44,14" fill={BURG}/>
    </svg>
  </div>
);
const ArrowL = () => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"60px", flexShrink:0, paddingBottom:"40px" }}>
    <svg width="54" height="16" viewBox="0 0 54 16">
      <line x1="54" y1="8" x2="10" y2="8" stroke={BURG} strokeWidth="2.5" strokeDasharray="5 4"/>
      <polygon points="10,2 0,8 10,14" fill={BURG}/>
    </svg>
  </div>
);
const ArrowDown = () => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", marginBottom:"8px" }}>
    <div/><div/>
    <div style={{ display:"flex", justifyContent:"center", paddingRight:"10px" }}>
      <svg width="16" height="36" viewBox="0 0 16 36">
        <line x1="8" y1="0" x2="8" y2="26" stroke={BURG} strokeWidth="2.5" strokeDasharray="5 4"/>
        <polygon points="2,26 8,36 14,26" fill={BURG}/>
      </svg>
    </div>
  </div>
);
const ArrowUp = () => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", marginTop:"8px" }}>
    <div style={{ display:"flex", justifyContent:"center", paddingLeft:"10px" }}>
      <svg width="16" height="36" viewBox="0 0 16 36">
        <line x1="8" y1="36" x2="8" y2="10" stroke={BURG} strokeWidth="2.5" strokeDasharray="5 4"/>
        <polygon points="2,10 8,0 14,10" fill={BURG}/>
      </svg>
    </div>
    <div/><div/>
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
      <section style={{ padding:"60px 64px 52px", background:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(155,0,32,.01) 1px,transparent 1px),linear-gradient(90deg,rgba(155,0,32,.01) 1px,transparent 1px)`, backgroundSize:"48px 48px", pointerEvents:"none" }} />
        <div style={{ maxWidth:"1280px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"center" }}>

          {/* Left */}
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

          {/* Right */}
          <HeroCarousel />
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

          {/* Up arrow on left */}
          <ArrowUp />

          {/* Chips */}
          <div style={{ display:"flex", justifyContent:"center", gap:"10px", marginTop:"20px", flexWrap:"wrap" }}>
            {[
              { label:"No Manpower Needed",  yes:false },
              { label:"No Warehouse Needed", yes:false },
              { label:"No Inventory Needed", yes:false },
              { label:"Just Enroll & Earn",  yes:true  },
            ].map(c => (
              <div key={c.label} style={{ display:"flex", alignItems:"center", gap:"7px", padding:"8px 18px", borderRadius:"99px", background:c.yes?BURG:"#fff", border:c.yes?"none":`1.5px solid #f0f0f0`, boxShadow:c.yes?GRADS:"0 1px 4px rgba(0,0,0,.04)" }}>
                <span style={{ fontSize:"14px" }}>{c.yes?"✅":"❌"}</span>
                <span style={{ fontSize:"13px", fontWeight:600, color:c.yes?"#fff":"#555" }}>{c.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign:"center", marginTop:"28px" }}>
            <Link href="/register" style={{ display:"inline-block", padding:"13px 36px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none", boxShadow:GRADS }}>
              Start Your Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ DASHBOARD PREVIEW — full width ════════════════════ */}
      <section style={{ padding:"72px 64px", background:"#f9f9f9" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase", marginBottom:"10px" }}>Seller Dashboard</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#111", marginBottom:"8px" }}>
              Full Visibility,
              <span style={{ fontStyle:"italic", color:BURG, fontWeight:400 }}> Real-Time</span>
            </h2>
            <p style={{ fontSize:"14px", color:"#888", maxWidth:"440px", margin:"0 auto" }}>Track your sales, orders, and inventory from one powerful dashboard.</p>
          </div>

          {/* Dashboard card */}
          <div style={{ borderRadius:"20px", overflow:"hidden", border:"1px solid #e5e5e5", boxShadow:"0 16px 48px rgba(0,0,0,.08)", background:"#fff" }}>
            {/* Top stats bar */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0", borderBottom:"1px solid #f0f0f0" }}>
              {[["₹12,45,000","Total Sales","↑ +16% this month"],["598","Total Orders","↑ +22% this month"],["23","Total Products","↑ +3 new this week"],["3","Pending Orders","Action required"]].map(([v,l,s],i) => (
                <div key={l} style={{ padding:"22px 24px", borderRight:i<3?"1px solid #f0f0f0":"none" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"26px", fontWeight:700, color:BURG, marginBottom:"3px" }}>{v}</div>
                  <div style={{ fontSize:"13px", fontWeight:600, color:"#111", marginBottom:"3px" }}>{l}</div>
                  <div style={{ fontSize:"11px", color:"#22c55e" }}>{s}</div>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div style={{ display:"grid", gridTemplateColumns:"200px 1fr 280px" }}>
              {/* Sidebar */}
              <div style={{ background:BURG, padding:"16px 0" }}>
                {[["📊","Dashboard"],["📦","Orders"],["🏺","Products"],["📋","Inventory"],["👥","Customers"],["📈","Reports"],["⚙️","Settings"]].map(([ic,lb],i) => (
                  <div key={lb} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 16px", background:i===0?"rgba(255,255,255,.15)":"transparent", cursor:"pointer" }}>
                    <span style={{ fontSize:"14px" }}>{ic}</span>
                    <span style={{ fontSize:"12px", color:i===0?"#fff":"rgba(255,255,255,.5)", fontWeight:i===0?600:400 }}>{lb}</span>
                  </div>
                ))}
              </div>

              {/* Chart area */}
              <div style={{ padding:"24px", borderRight:"1px solid #f0f0f0" }}>
                <div style={{ fontSize:"14px", fontWeight:700, color:"#111", marginBottom:"16px" }}>Sales Overview</div>
                {/* Bar chart */}
                <div style={{ display:"flex", alignItems:"flex-end", gap:"8px", height:"120px", marginBottom:"8px" }}>
                  {[30,52,42,72,58,85,68,92,78,88,65,95].map((h,i) => (
                    <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                      <div style={{ width:"100%", height:`${h}%`, background:i===11?BURG:`rgba(155,0,32,.${Math.max(1,Math.floor(h/18))})`, borderRadius:"4px 4px 0 0", transition:"height .3s" }} />
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"9px", color:"#bbb" }}>
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => <span key={m}>{m}</span>)}
                </div>
              </div>

              {/* Top categories */}
              <div style={{ padding:"24px" }}>
                <div style={{ fontSize:"14px", fontWeight:700, color:"#111", marginBottom:"16px" }}>Top Categories</div>
                {[["Home Décor","35%","#9B0020"],["Puja Items","28%","#c0392b"],["Furniture","18%","#e74c3c"],["Metalwork","12%","#f1948a"],["Textiles","7%","#fadbd8"]].map(([cat,pct,col]) => (
                  <div key={cat} style={{ marginBottom:"12px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                      <span style={{ fontSize:"12px", color:"#555" }}>{cat}</span>
                      <span style={{ fontSize:"12px", fontWeight:600, color:BURG }}>{pct}</span>
                    </div>
                    <div style={{ height:"6px", background:"#f0f0f0", borderRadius:"99px", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:pct, background:col, borderRadius:"99px" }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop:"16px", padding:"10px 14px", borderRadius:"10px", background:`rgba(155,0,32,.05)`, border:`1px solid rgba(155,0,32,.1)` }}>
                  <div style={{ fontSize:"11px", fontWeight:600, color:BURG, marginBottom:"2px" }}>This Month</div>
                  <div style={{ fontSize:"13px", fontWeight:700, color:"#111" }}>₹3,24,500 Revenue</div>
                  <div style={{ fontSize:"11px", color:"#22c55e" }}>↑ 18% vs last month</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign:"center", marginTop:"24px" }}>
            <Link href="/login" style={{ fontSize:"13px", fontWeight:600, color:BURG, textDecoration:"none", borderBottom:`1px solid rgba(155,0,32,.3)`, paddingBottom:"2px" }}>
              View Full Dashboard →
            </Link>
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
