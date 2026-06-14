"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;
const BURG  = "#9B0020";
const GRADS = "0 8px 24px rgba(155,0,32,.3)";

// ── GALLERY IMAGES — add your product image URLs here ─────────
const GALLERY_IMGS = [
  "", "", "", "", "", "",  // 6 slots — replace "" with /images/product1.jpg etc
];

// ── VIDEO PREVIEWS — add your video URLs here ────────────────
const VIDEO_ITEMS = [
  { src:"", thumb:"", title:"Photoshoot Behind the Scenes", dur:"01:25" },
  { src:"", thumb:"", title:"Marketing Reel Sample",        dur:"00:45" },
  { src:"", thumb:"", title:"Seller Training Demo",         dur:"02:10" },
];

// ── TRAINING VIDEOS ───────────────────────────────────────────
const TRAINING = [
  { title:"How to Manage Your Store",       desc:"Basic store management tutorial",          dur:"15:30" },
  { title:"Product Listing Best Practices", desc:"Increase visibility & better sales",       dur:"12:45" },
  { title:"Marketing Strategies",           desc:"How to grow with ads & social media",      dur:"18:20" },
  { title:"Order & Inventory Management",   desc:"Complete guide for smooth operations",     dur:"10:15" },
];

// ── TESTIMONIALS ──────────────────────────────────────────────
const TESTIMONIALS = [
  { name:"Neha Sharma",  text:"Sanskriti made it so easy to start my online business. They handle everything and I just focus on growing my brand.", stars:5 },
  { name:"Ramesh Gupta", text:"The photoshoots and marketing videos they create are top-notch. My sales increased 5x in 2 months!", stars:5 },
  { name:"Pooja Verma",  text:"Inventory and order management saved me so much time and effort. Highly recommended.", stars:5 },
];

const SERVICES = [
  { icon:"📸", title:"Photoshoots",           desc:"Professional product photos for every platform."          },
  { icon:"🎬", title:"Marketing Videos",      desc:"Reels, ads & product videos that sell your brand."        },
  { icon:"🛍️", title:"E-commerce Setup",      desc:"Store creation, branding, and product listing."           },
  { icon:"📦", title:"Inventory Management",  desc:"We store, manage & monitor your stock."                   },
  { icon:"🚚", title:"Order Management",       desc:"Packing, shipping & order tracking handled by us."        },
  { icon:"📊", title:"Dashboard",             desc:"Real-time analytics of sales, orders & inventory."        },
  { icon:"🎓", title:"Training & Support",    desc:"Step-by-step training and expert seller support."         },
  { icon:"📢", title:"Marketing & Ads",       desc:"Meta Ads, Google Ads & social media growth strategies."   },
];

const HOW_STEPS = [
  { n:1, icon:"👤", title:"You Join",         desc:"Become a seller with us"                  },
  { n:2, icon:"📋", title:"Share Details",    desc:"Share your product information"            },
  { n:3, icon:"📸", title:"We Create",        desc:"Photoshoot, videos & store setup"          },
  { n:4, icon:"⚙️", title:"We Manage",        desc:"Inventory, orders & operations"            },
  { n:5, icon:"📣", title:"We Market",        desc:"We run ads & bring customers"              },
  { n:6, icon:"🛒", title:"Orders Grow",      desc:"You get orders, we handle the rest"        },
  { n:7, icon:"📈", title:"Track & Scale",    desc:"Monitor everything from dashboard"         },
];

const WHY = [
  { icon:"🤝", title:"End-to-End Support",    desc:"We handle everything from start to scale."    },
  { icon:"😌", title:"Zero Hassle Operations",desc:"No worry about inventory, packing or shipping."},
  { icon:"👨‍💼", title:"Expert Team",           desc:"Professionals in photography, marketing, ops." },
  { icon:"🏷️", title:"Grow Your Brand",       desc:"We help you build a brand that lasts."        },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [visibleSecs, setVisibleSecs] = useState(new Set());
  const secRefs = useRef({});

  useEffect(() => {
    setMounted(true);
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setVisibleSecs(prev => new Set([...prev, e.target.dataset.sec])); }),
      { threshold: 0.08 }
    );
    Object.values(secRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const ref = id => el => { if (el) { el.dataset.sec = id; secRefs.current[id] = el; } };
  const vis = id => visibleSecs.has(id);

  if (!mounted) return null;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", color:"#111", overflowX:"hidden" }}>
      <style>{`
        ${GF}
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .srv:hover { background:#fff8f8!important; border-color:${BURG}!important; }
        .gal-img:hover { transform:scale(1.04)!important; }
        .why:hover { border-color:${BURG}!important; transform:translateY(-3px)!important; }
        .testi:hover { border-color:${BURG}!important; }
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;}
          .srv-grid{grid-template-columns:repeat(2,1fr)!important;}
          .three-col{grid-template-columns:1fr!important;}
          .four-col{grid-template-columns:1fr 1fr!important;}
          .how-steps{flex-wrap:wrap!important;}
          .mock-right{display:none!important;}
        }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{ padding:"64px 48px 52px", background:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(155,0,32,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(155,0,32,.012) 1px,transparent 1px)`, backgroundSize:"48px 48px", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"15%", right:"25%", width:"500px", height:"400px", background:`radial-gradient(ellipse,rgba(155,0,32,.05) 0%,transparent 65%)`, pointerEvents:"none" }} />

        <div className="hero-grid" style={{ maxWidth:"1280px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"center" }}>
          {/* Left */}
          <div style={{ animation:"fadeUp .7s ease both" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"5px 14px", borderRadius:"99px", border:`1px solid rgba(155,0,32,.2)`, background:`rgba(155,0,32,.04)`, marginBottom:"22px" }}>
              <span style={{ color:"#f59e0b", fontSize:"14px" }}>★</span>
              <span style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase" }}>India's Premier Seller Platform</span>
            </div>

            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,4.5vw,56px)", fontWeight:700, color:"#111", lineHeight:1.08, marginBottom:"18px" }}>
              We Build, Manage &amp; Scale<br />
              <span style={{ color:BURG, fontStyle:"italic", fontWeight:400 }}>Your Online Business</span><br />
              End-to-End.
            </h1>

            <p style={{ fontSize:"15px", color:"#555", lineHeight:1.85, marginBottom:"28px", maxWidth:"480px" }}>
              From e-commerce setup to photoshoots, videos, inventory, orders and marketing — we handle everything. You focus on your products. We handle the rest.
            </p>

            <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", marginBottom:"36px" }}>
              <Link href="/register" style={{ padding:"14px 32px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none", boxShadow:GRADS }}>Join as Seller →</Link>
              <Link href="/services" style={{ display:"flex", alignItems:"center", gap:"8px", padding:"14px 28px", borderRadius:"8px", border:"1.5px solid #e5e5e5", color:"#333", fontSize:"14px", fontWeight:500, textDecoration:"none" }}>
                <span style={{ width:"26px", height:"26px", borderRadius:"50%", border:`1.5px solid ${BURG}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", color:BURG }}>▶</span>
                Watch How It Works
              </Link>
            </div>

            {/* Stats row */}
            <div style={{ display:"flex", gap:"0", borderTop:"1px solid #f0f0f0", paddingTop:"24px", flexWrap:"wrap" }}>
              {[
                { icon:"▦", value:"25+",      label:"Categories"    },
                { icon:"📦", value:"1,00,000+",label:"Products"     },
                { icon:"👥", value:"500+",     label:"Seller Assets" },
                { icon:"📸", value:"1000+",    label:"Photoshoots"  },
                { icon:"🕐", value:"24×7",     label:"Support"      },
              ].map((s, i) => (
                <div key={s.label} style={{ flex:"1", minWidth:"80px", padding:"0 12px", borderRight:i<4?"1px solid #f0f0f0":"none", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"20px", fontWeight:700, color:BURG, lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:"11px", color:"#888", marginTop:"3px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — platform mockup */}
          <div className="mock-right" style={{ position:"relative", animation:"fadeIn .8s .2s ease both" }}>
            {/* Laptop frame */}
            <div style={{ background:"#1a1a1a", borderRadius:"14px", padding:"10px 10px 0", boxShadow:"0 32px 80px rgba(0,0,0,.2)", position:"relative", zIndex:1 }}>
              <div style={{ background:"#333", borderRadius:"2px", height:"6px", width:"40px", margin:"0 auto 6px" }} />
              <div style={{ background:"#f9f9f9", borderRadius:"8px", overflow:"hidden", aspectRatio:"16/10" }}>
                {/* Dashboard preview inside laptop */}
                <div style={{ background:"#fff", height:"100%", display:"grid", gridTemplateColumns:"160px 1fr" }}>
                  <div style={{ background:`linear-gradient(180deg,${BURG} 0%,#7a0018 100%)`, padding:"12px 0" }}>
                    {["Dashboard","Orders","Products","Inventory","Customers","Reports","Settings"].map(item => (
                      <div key={item} style={{ padding:"6px 12px", fontSize:"10px", color:item==="Dashboard"?"#fff":"rgba(255,255,255,.5)", fontWeight:item==="Dashboard"?600:400, background:item==="Dashboard"?`rgba(255,255,255,.15)`:"transparent" }}>{item}</div>
                    ))}
                  </div>
                  <div style={{ padding:"12px", background:"#f8f8f8" }}>
                    <div style={{ fontSize:"11px", fontWeight:700, color:"#111", marginBottom:"8px" }}>Sales Overview</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"6px", marginBottom:"8px" }}>
                      {[["₹12,45,000","Total Sales"],["598","Orders"],["23","Pending"],["98%","Rating"]].map(([v,l]) => (
                        <div key={l} style={{ background:"#fff", borderRadius:"6px", padding:"6px 8px", border:"1px solid #eee" }}>
                          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"12px", fontWeight:700, color:BURG }}>{v}</div>
                          <div style={{ fontSize:"8px", color:"#aaa" }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    {/* Mini chart bars */}
                    <div style={{ display:"flex", alignItems:"flex-end", gap:"4px", height:"40px" }}>
                      {[30,50,40,70,55,80,65,90,75,85].map((h,i) => (
                        <div key={i} style={{ flex:1, height:`${h}%`, background:i===9?BURG:`rgba(155,0,32,.${Math.floor(h/15)})`, borderRadius:"2px 2px 0 0" }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ background:"#1a1a1a", height:"8px", borderRadius:"0 0 14px 14px" }} />
            </div>

            {/* Phone floating */}
            <div style={{ position:"absolute", right:"-30px", bottom:"-20px", width:"110px", background:"#1a1a1a", borderRadius:"16px", padding:"6px", boxShadow:"0 16px 40px rgba(0,0,0,.25)", animation:"float 3s ease-in-out infinite", zIndex:2 }}>
              <div style={{ background:"#fff", borderRadius:"10px", overflow:"hidden", aspectRatio:"9/16" }}>
                <div style={{ background:BURG, padding:"8px 6px 4px" }}>
                  <div style={{ fontSize:"6px", fontWeight:700, color:"#fff", marginBottom:"2px" }}>Sanskriti</div>
                  <div style={{ fontSize:"5px", color:"rgba(255,255,255,.7)" }}>Brass Antique Diya Stand</div>
                </div>
                <div style={{ padding:"6px", background:"#f9f9f9", height:"60%" }}>
                  <div style={{ background:"#e5e5e5", borderRadius:"4px", height:"50%", marginBottom:"4px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>🏺</div>
                  <div style={{ fontSize:"7px", fontWeight:700, color:"#111" }}>₹1,399</div>
                  <div style={{ marginTop:"4px", padding:"3px 6px", background:BURG, borderRadius:"4px", textAlign:"center" }}>
                    <div style={{ fontSize:"6px", color:"#fff", fontWeight:600 }}>Add to Cart</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating antique emoji */}
            <div style={{ position:"absolute", left:"-20px", top:"20%", fontSize:"48px", animation:"float 4s .5s ease-in-out infinite", filter:"drop-shadow(0 8px 16px rgba(0,0,0,.2))", zIndex:2 }}>🏺</div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════ */}
      <div style={{ borderTop:"1px solid #f0f0f0", borderBottom:"1px solid #f0f0f0", padding:"12px 0", overflow:"hidden", background:"#fafafa" }}>
        <div style={{ display:"flex", animation:"marquee 20s linear infinite", width:"max-content" }}>
          {[...Array(2)].map((_, ri) => (
            ["Photoshoots","Marketing Videos","E-commerce Setup","Inventory Management","Order Management","Dashboard & Analytics","Training & Support","Marketing & Ads"].map((s,i) => (
              <span key={`${ri}-${i}`} style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"0 24px", fontSize:"12px", fontWeight:500, color:"#888", letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                <span style={{ width:"4px", height:"4px", borderRadius:"50%", background:BURG, opacity:.4 }} />{s}
              </span>
            ))
          ))}
        </div>
      </div>

      {/* ══ SERVICES ══════════════════════════════════════════ */}
      <section ref={ref("srv")} style={{ padding:"60px 48px", background:"#fff", opacity:vis("srv")?1:0, transform:vis("srv")?"none":"translateY(24px)", transition:"all .7s ease" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <div className="srv-grid" style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:"0" }}>
            {SERVICES.map((s, i) => (
              <div key={s.title} className="srv" style={{ padding:"20px 14px", textAlign:"center", borderRight:i<7?"1px solid #f0f0f0":"none", border:"1px solid #f0f0f0", borderLeft:i===0?"1px solid #f0f0f0":"none", borderTop:"1px solid #f0f0f0", borderBottom:"1px solid #f0f0f0", transition:"all .2s", cursor:"default", marginLeft:i>0?"-1px":"0" }}>
                <div style={{ fontSize:"28px", marginBottom:"10px" }}>{s.icon}</div>
                <div style={{ fontSize:"12px", fontWeight:700, color:"#111", marginBottom:"5px", lineHeight:1.3 }}>{s.title}</div>
                <div style={{ fontSize:"11px", color:"#888", lineHeight:1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3-COL: HOW WE WORK | GALLERY | VIDEOS ════════════ */}
      <section ref={ref("mid")} style={{ padding:"48px 48px", background:"#fafafa", opacity:vis("mid")?1:0, transform:vis("mid")?"none":"translateY(24px)", transition:"all .7s .1s ease" }}>
        <div className="three-col" style={{ maxWidth:"1280px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1.4fr 1.4fr", gap:"20px" }}>

          {/* How We Work */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", padding:"20px" }}>
            <div style={{ fontSize:"15px", fontWeight:700, color:"#111", marginBottom:"16px", fontFamily:"'Playfair Display',serif" }}>How We Work</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {HOW_STEPS.map((s, i) => (
                <div key={s.n} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:i<3?BURG:"rgba(155,0,32,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", flexShrink:0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize:"12px", fontWeight:600, color:"#111" }}>{s.n}. {s.title}</div>
                    <div style={{ fontSize:"10px", color:"#aaa" }}>{s.desc}</div>
                  </div>
                  {i < HOW_STEPS.length - 1 && i % 1 === 0 && (
                    <div style={{ position:"absolute" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", padding:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
              <div style={{ fontSize:"15px", fontWeight:700, color:"#111", fontFamily:"'Playfair Display',serif" }}>Gallery — Our Work</div>
              <Link href="/gallery" style={{ fontSize:"12px", color:BURG, fontWeight:600, textDecoration:"none" }}>View All Gallery →</Link>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"6px" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="gal-img" style={{ aspectRatio:"1", borderRadius:"8px", background:`linear-gradient(135deg,#f0f0f0,#e5e5e5)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", overflow:"hidden", transition:"transform .2s", cursor:"pointer" }}>
                  {GALLERY_IMGS[i] ? (
                    <img src={GALLERY_IMGS[i]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  ) : (
                    <span style={{ opacity:.3 }}>🏺</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", padding:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
              <div style={{ fontSize:"15px", fontWeight:700, color:"#111", fontFamily:"'Playfair Display',serif" }}>Videos — See It In Action</div>
              <Link href="/training/videos" style={{ fontSize:"12px", color:BURG, fontWeight:600, textDecoration:"none" }}>View All Videos →</Link>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {VIDEO_ITEMS.map((v, i) => (
                <div key={i} style={{ display:"flex", gap:"10px", alignItems:"center", padding:"8px", borderRadius:"8px", background:"#f9f9f9", cursor:"pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background="#fff8f8")}
                  onMouseLeave={e => (e.currentTarget.style.background="#f9f9f9")}
                >
                  <div style={{ width:"72px", height:"52px", borderRadius:"6px", background:`linear-gradient(135deg,#1a1a1a,#333)`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                    {v.thumb && <img src={v.thumb} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }} />}
                    <div style={{ width:"22px", height:"22px", borderRadius:"50%", background:"rgba(255,255,255,.2)", border:"1.5px solid rgba(255,255,255,.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", color:"#fff", zIndex:1 }}>▶</div>
                    <div style={{ position:"absolute", bottom:"3px", right:"4px", fontSize:"9px", color:"rgba(255,255,255,.8)", background:"rgba(0,0,0,.4)", padding:"1px 4px", borderRadius:"3px" }}>{v.dur}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:"12px", fontWeight:600, color:"#111" }}>{v.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4-COL: DASHBOARD | TRAINING | WHY | TESTIMONIALS ═ */}
      <section ref={ref("bot")} style={{ padding:"48px 48px", background:"#fff", opacity:vis("bot")?1:0, transform:vis("bot")?"none":"translateY(24px)", transition:"all .7s .1s ease" }}>
        <div className="four-col" style={{ maxWidth:"1280px", margin:"0 auto", display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr 1fr", gap:"20px", alignItems:"start" }}>

          {/* Seller Dashboard Preview */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", overflow:"hidden" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 16px 12px" }}>
              <div style={{ fontSize:"14px", fontWeight:700, color:"#111", fontFamily:"'Playfair Display',serif" }}>Seller Dashboard Preview</div>
              <Link href="/login" style={{ fontSize:"11px", color:BURG, fontWeight:600, textDecoration:"none" }}>View Dashboard →</Link>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"80px 1fr" }}>
              <div style={{ background:BURG, padding:"8px 0" }}>
                {["📊","📦","🏺","📋","👥","📈","⚙️"].map((icon,i) => (
                  <div key={i} style={{ padding:"6px 10px", fontSize:"12px", color:i===0?"#fff":"rgba(255,255,255,.45)", background:i===0?"rgba(255,255,255,.15)":"transparent", textAlign:"center" }}>{icon}</div>
                ))}
              </div>
              <div style={{ padding:"10px", background:"#f8f8f8" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px", marginBottom:"8px" }}>
                  {[["₹12,45,000","Total Sales","+16%"],["598","Total Orders","+22%"],["23","Total Products","+3%"],["3","Pending","Orders"]].map(([v,l,b]) => (
                    <div key={l} style={{ background:"#fff", borderRadius:"5px", padding:"6px", border:"1px solid #eee" }}>
                      <div style={{ fontSize:"11px", fontWeight:700, color:BURG }}>{v}</div>
                      <div style={{ fontSize:"8px", color:"#aaa" }}>{l}</div>
                      {b && <div style={{ fontSize:"7px", color:"#22c55e" }}>{b}</div>}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:"9px", fontWeight:600, color:"#555", marginBottom:"4px" }}>Top Categories</div>
                {[["Home Décor","35%"],["Puja Items","28%"],["Furniture","18%"]].map(([cat,pct]) => (
                  <div key={cat} style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                    <div style={{ fontSize:"8px", color:"#666" }}>{cat}</div>
                    <div style={{ width:"50%", height:"5px", background:"#f0f0f0", borderRadius:"99px", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:pct, background:BURG, borderRadius:"99px" }} />
                    </div>
                    <div style={{ fontSize:"8px", color:BURG, fontWeight:600 }}>{pct}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Training & Learning */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", padding:"16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
              <div style={{ fontSize:"14px", fontWeight:700, color:"#111", fontFamily:"'Playfair Display',serif" }}>Training & Learning</div>
              <Link href="/training" style={{ fontSize:"11px", color:BURG, fontWeight:600, textDecoration:"none" }}>View All →</Link>
            </div>
            {TRAINING.map((t, i) => (
              <div key={i} style={{ display:"flex", gap:"8px", alignItems:"center", padding:"8px 0", borderBottom:i<3?"1px solid #f5f5f5":"none" }}>
                <div style={{ width:"36px", height:"28px", borderRadius:"5px", background:BURG, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:"9px", color:"#fff" }}>▶</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"11px", fontWeight:600, color:"#111", lineHeight:1.3 }}>{t.title}</div>
                  <div style={{ fontSize:"9px", color:"#aaa" }}>{t.desc}</div>
                </div>
                <div style={{ fontSize:"9px", color:"#aaa", flexShrink:0 }}>{t.dur}</div>
              </div>
            ))}
          </div>

          {/* Why Sellers Trust */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", padding:"16px" }}>
            <div style={{ fontSize:"14px", fontWeight:700, color:"#111", marginBottom:"12px", fontFamily:"'Playfair Display',serif" }}>Why Sellers Trust Sanskriti</div>
            {WHY.map((w, i) => (
              <div key={i} className="why" style={{ display:"flex", gap:"10px", alignItems:"flex-start", padding:"8px", borderRadius:"8px", border:"1px solid transparent", transition:"all .2s", marginBottom:"6px" }}>
                <div style={{ width:"28px", height:"28px", borderRadius:"7px", background:`rgba(155,0,32,.08)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0 }}>{w.icon}</div>
                <div>
                  <div style={{ fontSize:"12px", fontWeight:600, color:"#111" }}>{w.title}</div>
                  <div style={{ fontSize:"10px", color:"#888", lineHeight:1.4 }}>{w.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", padding:"16px" }}>
            <div style={{ fontSize:"14px", fontWeight:700, color:"#111", marginBottom:"12px", fontFamily:"'Playfair Display',serif" }}>What Our Sellers Say</div>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi" style={{ padding:"10px", borderRadius:"8px", border:"1px solid #f0f0f0", marginBottom:"8px", transition:"border .2s" }}>
                <div style={{ display:"flex", gap:"1px", marginBottom:"5px" }}>
                  {"★★★★★".split("").map((s, j) => <span key={j} style={{ color:"#f59e0b", fontSize:"10px" }}>{s}</span>)}
                </div>
                <div style={{ fontSize:"11px", color:"#444", lineHeight:1.6, marginBottom:"5px" }}>{t.text}</div>
                <div style={{ fontSize:"10px", fontWeight:700, color:BURG }}>— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOTTOM CTA ════════════════════════════════════════ */}
      <section ref={ref("cta")} style={{ background:"#fff", padding:"0 48px 60px", opacity:vis("cta")?1:0, transform:vis("cta")?"none":"translateY(20px)", transition:"all .6s ease" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", borderRadius:"20px", background:BURG, padding:"56px 48px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)`, backgroundSize:"28px 28px", pointerEvents:"none" }} />
          <div style={{ position:"absolute", left:"-40px", bottom:"-20px", fontSize:"120px", opacity:.06, transform:"rotate(-15deg)" }}>🏺</div>
          <div style={{ position:"absolute", right:"-20px", top:"-20px", fontSize:"100px", opacity:.06, transform:"rotate(15deg)" }}>🪔</div>
          <div style={{ position:"relative" }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, color:"#fff", marginBottom:"12px" }}>
              Ready to Start Your Online Business?
            </h2>
            <p style={{ fontSize:"15px", color:"rgba(255,255,255,.75)", marginBottom:"28px", maxWidth:"480px", margin:"0 auto 28px", lineHeight:1.8 }}>
              Join thousands of successful sellers who trust Sanskriti to grow their business.
            </p>
            <Link href="/register" style={{ display:"inline-block", padding:"15px 44px", borderRadius:"8px", background:"#fff", color:BURG, fontSize:"15px", fontWeight:700, textDecoration:"none", boxShadow:"0 8px 24px rgba(0,0,0,.15)" }}>
              Join as Seller Today →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STICKY BOTTOM BAR ════════════════════════════════ */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:900, background:"#fff", borderTop:"1px solid #f0f0f0", padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 -4px 20px rgba(0,0,0,.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ display:"flex" }}>
            {["👤","👤","👤"].map((e,i) => (
              <div key={i} style={{ width:"28px", height:"28px", borderRadius:"50%", background:`rgba(155,0,32,.${i+1}5)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", marginLeft:i>0?"-6px":"0", border:"2px solid #fff" }}>{e}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:"12px", fontWeight:600, color:"#111" }}>Thousands of sellers trust Sanskriti.</div>
            <div style={{ display:"flex", gap:"2px", alignItems:"center" }}>
              {"★★★★★".split("").map((s,i) => <span key={i} style={{ color:"#f59e0b", fontSize:"11px" }}>{s}</span>)}
              <span style={{ fontSize:"11px", color:"#888", marginLeft:"4px" }}>4.8/5</span>
            </div>
          </div>
        </div>
        <Link href="/register" style={{ padding:"11px 28px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", boxShadow:GRADS }}>
          Join as Seller →
        </Link>
      </div>
      <div style={{ height:"60px" }} />
    </div>
  );
}
