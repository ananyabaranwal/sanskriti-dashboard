"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const STATS = [
  { value:"1L+",    label:"Products Listed",    icon:"🏺" },
  { value:"25+",    label:"Categories",          icon:"📦" },
  { value:"5,000+", label:"Active Sellers",      icon:"👥" },
  { value:"12+",    label:"Years Experience",    icon:"🏆" },
  { value:"₹10Cr+", label:"Revenue Generated",  icon:"💰" },
  { value:"98%",    label:"Authenticity Rate",   icon:"✅" },
];

const TIMELINE = [
  { year:"2008", title:"The Beginning",       desc:"Started as a small family antique shop in Hazratganj, Lucknow. Specialising in brass idols and wooden antiques." },
  { year:"2012", title:"Going Digital",        desc:"Launched our first online presence. Discovered the massive gap between India's artisans and the global antique market." },
  { year:"2016", title:"Platform Launch",      desc:"Sanskriti The Antique platform launched. First 100 sellers onboarded. Zero-inventory model introduced." },
  { year:"2019", title:"Training Academy",     desc:"Launched the seller training program. 1,000+ sellers trained in digital selling, authentication, and GST compliance." },
  { year:"2022", title:"1 Lakh Products",      desc:"Crossed 1 lakh products listed across 25+ categories. Expanded to Amazon and Flipkart integrations." },
  { year:"2024", title:"The Book & Beyond",    desc:"Vipul Kumar Arya publishes The Zero-Inventory Empire. 5,000+ active sellers. ₹10 Cr+ revenue generated." },
];

const VALUES = [
  { icon:"🏛️", title:"Heritage First",    desc:"Every antique is verified for authenticity. We protect India's cultural legacy one piece at a time.", color:"rgba(155,0,32,.06)" },
  { icon:"🤝", title:"Seller Success",    desc:"We grow when our sellers grow. Our entire platform is built to help artisans build sustainable digital businesses.", color:"rgba(155,0,32,.06)" },
  { icon:"🔍", title:"Transparency",      desc:"Clear pricing, honest descriptions, full condition disclosure. Buyers and sellers both deserve complete transparency.", color:"rgba(155,0,32,.06)" },
  { icon:"🌐", title:"Digital India",     desc:"Every Indian artisan deserves global market access. We bridge heritage craftsmanship with modern e-commerce.", color:"rgba(155,0,32,.06)" },
  { icon:"📚", title:"Education",         desc:"Knowledge is power. We invest in seller education through videos, ebooks, live training, and expert workshops.", color:"rgba(155,0,32,.06)" },
  { icon:"🚀", title:"Zero to Scale",     desc:"From zero inventory to scalable business — our model lets anyone start and grow without capital-heavy investments.", color:"rgba(155,0,32,.06)" },
];

const TEAM = [
  { name:"Vipul Kumar Arya",   role:"Founder & CEO",           initials:"VK", desc:"Author of The Zero-Inventory Empire. 12+ years in antique trade and e-commerce. Built Sanskriti from a single shop to India's premier antique platform." },
  { name:"Operations Team",    role:"Platform & Seller Support",initials:"OT", desc:"20+ member team managing seller onboarding, KYC verification, order management, and daily platform operations across India." },
  { name:"Content & Training", role:"Education & Media",        initials:"CT", desc:"Expert team creating training videos, ebooks, live sessions, and seller education programmes covering authentication, GST, and digital selling." },
  { name:"Technology Team",    role:"Platform Development",     initials:"TT", desc:"Engineering team building the seller dashboard, admin panel, mobile apps, and integrations with Amazon, Flipkart, and Razorpay." },
];


// ══════════════════════════════════════════════════════════════
// HOW TO ADD IMAGES & VIDEOS:
//
// 1. Place your files in:  frontend/public/about/
//    Example structure:
//      frontend/public/about/manufacturing/workshop.jpg
//      frontend/public/about/manufacturing/artisans.jpg
//      frontend/public/about/products/brass.jpg
//      frontend/public/about/shop/store.jpg
//      frontend/public/about/videos/factory-tour.mp4
//
// 2. Reference them below using /about/... paths
//    Example: src: "/about/manufacturing/workshop.jpg"
//
// 3. For VIDEOS: set type:"video" and use .mp4 file
//    For IMAGES: set type:"image" (or leave out, default is image)
//
// 4. Push to GitHub — Hostinger will serve from public/
// ══════════════════════════════════════════════════════════════

const MEDIA_TABS = [
  {
    key: "manufacturing",
    label: "Manufacturing",
    icon: "🏭",
    items: [
      // ── ADD YOUR MANUFACTURING IMAGES/VIDEOS HERE ──
      // { type:"image", src:"/about/manufacturing/workshop.jpg",   caption:"Our Lucknow Workshop"   },
      // { type:"image", src:"/about/manufacturing/artisans.jpg",   caption:"Brass Artisans at Work" },
      // { type:"image", src:"/about/manufacturing/qc.jpg",         caption:"Quality Inspection"     },
      // { type:"video", src:"/about/videos/factory-tour.mp4",      caption:"Factory Tour"           },
      // ──────────────────────────────────────────────
    ] as { type?:string; src:string; caption:string }[],
  },
  {
    key: "products",
    label: "Products",
    icon: "🏺",
    items: [
      // ── ADD YOUR PRODUCT IMAGES HERE ──
      // { type:"image", src:"/about/products/brass-ganesh.jpg",    caption:"Brass Ganesh Collection" },
      // { type:"image", src:"/about/products/madhubani.jpg",        caption:"Madhubani Paintings"    },
      // { type:"image", src:"/about/products/silver.jpg",           caption:"Silver Jewellery"       },
      // { type:"image", src:"/about/products/teak.jpg",             caption:"Teak Wood Furniture"    },
      // { type:"image", src:"/about/products/terracotta.jpg",       caption:"Terracotta Art"         },
      // { type:"image", src:"/about/products/pashmina.jpg",         caption:"Pashmina Textiles"      },
      // ──────────────────────────────────
    ] as { type?:string; src:string; caption:string }[],
  },
  {
    key: "shop",
    label: "Our Spaces",
    icon: "🏪",
    items: [
      // ── ADD YOUR SHOP/OFFICE IMAGES HERE ──
      // { type:"image", src:"/about/shop/store.jpg",               caption:"Hazratganj Store"       },
      // { type:"image", src:"/about/shop/office.jpg",              caption:"Operations Center"      },
      // { type:"image", src:"/about/shop/team.jpg",                caption:"Our Team"               },
      // { type:"video", src:"/about/videos/shop-tour.mp4",         caption:"Shop Tour Video"        },
      // ──────────────────────────────────────
    ] as { type?:string; src:string; caption:string }[],
  },
];

// ── ADD A SHOWCASE VIDEO (optional) ──────────────────────────
// Place video in frontend/public/about/videos/ and set path below
// Supports: .mp4, .webm, or YouTube embed URL
const SHOWCASE_VIDEO: string = "";
// Example: const SHOWCASE_VIDEO = "/about/videos/company-intro.mp4";
// ─────────────────────────────────────────────────────────────

const MILESTONES = [
  { n:"1L+",   label:"Products" },
  { n:"5K+",   label:"Sellers"  },
  { n:"25+",   label:"Categories" },
  { n:"₹10Cr+",label:"Revenue" },
];


// ── CAROUSEL COMPONENT ────────────────────────────────────────
function Carousel({ items, icon }: { items: { type?:string; src:string; caption:string }[]; icon:string }) {
  const BURG = "#9B0020";
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + items.length) % items.length);
  const next = () => setIdx(i => (i + 1) % items.length);
  const item = items[idx];
  const isVideo = item.type === "video" || item.src?.endsWith(".mp4") || item.src?.endsWith(".webm");

  return (
    <div>
      {/* Main display */}
      <div style={{ borderRadius:"16px", overflow:"hidden", background:"#111", aspectRatio:"16/9", position:"relative" }}>
        {isVideo ? (
          <video key={item.src} src={item.src} controls style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        ) : (
          <img key={item.src} src={item.src} alt={item.caption} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        )}

        {/* Caption overlay */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px 20px", background:"linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 100%)" }}>
          <div style={{ fontSize:"14px", fontWeight:600, color:"#fff" }}>{item.caption}</div>
          <div style={{ fontSize:"12px", color:"rgba(255,255,255,.55)", marginTop:"2px" }}>{idx + 1} / {items.length}</div>
        </div>

        {/* Prev / Next arrows */}
        {items.length > 1 && (
          <>
            <button onClick={prev} style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", width:"38px", height:"38px", borderRadius:"50%", background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)", color:"#fff", fontSize:"18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}>‹</button>
            <button onClick={next} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", width:"38px", height:"38px", borderRadius:"50%", background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)", color:"#fff", fontSize:"18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}>›</button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div style={{ display:"flex", justifyContent:"center", gap:"6px", marginTop:"12px" }}>
          {items.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ width: i===idx?"20px":"7px", height:"7px", borderRadius:"99px", background:i===idx?BURG:"#e5e5e5", border:"none", cursor:"pointer", transition:"all .25s", padding:0 }} />
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div style={{ display:"flex", gap:"8px", marginTop:"10px", overflowX:"auto", paddingBottom:"4px" }}>
          {items.map((it, i) => {
            const isVid = it.type==="video" || it.src?.endsWith(".mp4") || it.src?.endsWith(".webm");
            return (
              <div key={i} onClick={() => setIdx(i)} style={{ flexShrink:0, width:"72px", height:"54px", borderRadius:"8px", overflow:"hidden", border:`2px solid ${i===idx?BURG:"transparent"}`, cursor:"pointer", transition:"border .2s", background:"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                {isVid ? (
                  <div style={{ fontSize:"20px" }}>▶</div>
                ) : (
                  <img src={it.src} alt={it.caption} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────

export default function AboutPage() {
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const [vis, setVis] = useState<Set<string>>(new Set());
  const [counter, setCounter] = useState(0);
  const [mediaTab, setMediaTab] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setVis(prev => new Set([...prev, (e.target as HTMLElement).dataset.sec!])); }),
      { threshold: 0.08 }
    );
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCounter(c => (c + 1) % MILESTONES.length), 2200);
    return () => clearInterval(t);
  }, []);

  const ref = (id: string) => (el: HTMLElement | null) => {
    if (el) { el.dataset.sec = id; refs.current[id] = el; }
  };
  const v = (id: string) => vis.has(id);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", paddingTop:"68px", overflowX:"hidden" }}>
      <style>{`
        ${GF}
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp   {from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeLeft {from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeRight{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse    {0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
        @keyframes float    {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes shimmer  {0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes spin     {to{transform:rotate(360deg)}}
        @keyframes countUp  {from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
        .val-card:hover{border-color:${BURG}!important;transform:translateY(-4px)!important;box-shadow:0 14px 36px rgba(155,0,32,.1)!important}
        .team-card:hover{transform:translateY(-3px)!important;box-shadow:0 10px 28px rgba(155,0,32,.08)!important}
        .stat-card:hover{background:rgba(155,0,32,.08)!important}
        .tl-dot{transition:all .3s}
        .tl-item:hover .tl-dot{background:${BURG}!important;transform:scale(1.3)}
        .tl-item:hover .tl-content{border-color:${BURG}!important}
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ padding:"72px 48px 60px", background:"#fff", borderBottom:"1px solid #f0f0f0", position:"relative", overflow:"hidden" }}>
        {/* Subtle dot grid background */}
        <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(rgba(155,0,32,.06) 1px,transparent 1px)`, backgroundSize:"32px 32px", pointerEvents:"none" }} />
        {/* Red accent glow */}
        <div style={{ position:"absolute", top:"10%", right:"-5%", width:"500px", height:"400px", background:`radial-gradient(ellipse,rgba(155,0,32,.05) 0%,transparent 65%)`, pointerEvents:"none" }} />

        <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"72px", alignItems:"center" }}>

            {/* Left */}
            <div style={{ animation:"fadeLeft .8s ease both" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", padding:"5px 14px", borderRadius:"99px", border:`1px solid rgba(155,0,32,.2)`, background:`rgba(155,0,32,.04)`, marginBottom:"20px" }}>
                <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:BURG, animation:"pulse 2s infinite", display:"inline-block" }} />
                <span style={{ fontSize:"11px", fontWeight:600, color:BURG, letterSpacing:".14em", textTransform:"uppercase" }}>Our Story</span>
              </div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,4vw,52px)", fontWeight:700, color:"#111", lineHeight:1.08, marginBottom:"20px" }}>
                Preserving India's
                <br />
                <span style={{ fontStyle:"italic", color:BURG, fontWeight:400 }}>Heritage, Digitally.</span>
              </h1>
              <p style={{ fontSize:"15px", color:"#555", lineHeight:1.9, marginBottom:"14px" }}>
                Sanskriti The Antique is India's most trusted marketplace for authentic antiques — connecting passionate sellers with discerning collectors since 2008.
              </p>
              <p style={{ fontSize:"15px", color:"#555", lineHeight:1.9, marginBottom:"32px" }}>
                We serve <strong style={{ color:"#111" }}>25+ categories</strong> with over <strong style={{ color:"#111" }}>1 lakh products</strong> — helping every artisan build a sustainable digital business without needing inventory, warehouse, or manpower.
              </p>
              <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
                <Link href="/register" style={{ padding:"13px 28px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", boxShadow:`0 4px 16px rgba(155,0,32,.28)` }}>Join as Seller →</Link>
                <Link href="/services" style={{ padding:"13px 24px", borderRadius:"8px", border:"1.5px solid #e5e5e5", color:"#333", fontSize:"13px", fontWeight:500, textDecoration:"none" }}>Our Services</Link>
              </div>
            </div>

            {/* Right — animated counter card + stats */}
            <div style={{ animation:"fadeRight .8s .1s ease both" }}>
              {/* Big rotating stat */}
              <div style={{ borderRadius:"20px", background:BURG, padding:"36px", marginBottom:"16px", textAlign:"center", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)`, backgroundSize:"20px 20px", pointerEvents:"none" }} />
                <div key={counter} style={{ position:"relative", animation:"countUp .4s ease" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"64px", fontWeight:700, color:"#fff", lineHeight:1 }}>{MILESTONES[counter].n}</div>
                  <div style={{ fontSize:"14px", color:"rgba(255,255,255,.7)", marginTop:"6px", letterSpacing:".06em" }}>{MILESTONES[counter].label}</div>
                </div>
                <div style={{ display:"flex", gap:"6px", justifyContent:"center", marginTop:"16px" }}>
                  {MILESTONES.map((_, i) => (
                    <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", background:i===counter?"#fff":"rgba(255,255,255,.3)", transition:"all .3s" }} />
                  ))}
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px" }}>
                {STATS.map(s => (
                  <div key={s.label} className="stat-card" style={{ padding:"14px 12px", borderRadius:"12px", background:"#f9f9f9", border:"1px solid #f0f0f0", textAlign:"center", transition:"all .2s", cursor:"default" }}>
                    <div style={{ fontSize:"20px", marginBottom:"4px" }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", fontWeight:700, color:BURG, lineHeight:1 }}>{s.value}</div>
                    <div style={{ fontSize:"10px", color:"#aaa", marginTop:"3px", lineHeight:1.3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY + BOOK ─────────────────────────────────── */}
      <section ref={ref("story")} style={{ padding:"80px 48px", background:"#f9f9f9", opacity:v("story")?1:0, transform:v("story")?"none":"translateY(32px)", transition:"all .8s ease" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase", marginBottom:"10px" }}>Our Journey</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#111", lineHeight:1.1, marginBottom:"20px" }}>
              From a Lucknow Lane
              <span style={{ display:"block", fontStyle:"italic", color:BURG, fontWeight:400 }}>to a National Platform</span>
            </h2>
            <p style={{ fontSize:"14px", color:"#555", lineHeight:1.9, marginBottom:"14px" }}>
              What began as a small family antique shop in the lanes of Hazratganj, Lucknow has grown into India's premier digital antique marketplace. Founded by <strong style={{ color:"#111" }}>Vipul Kumar Arya</strong> — author of <em>The Zero-Inventory Empire</em> — Sanskriti was built on one belief: every Indian artisan deserves access to a global market.
            </p>
            <p style={{ fontSize:"14px", color:"#555", lineHeight:1.9, marginBottom:"14px" }}>
              Over 12 years, we have helped thousands of sellers across India digitise their businesses — from brass craftsmen in Moradabad to Madhubani painters in Bihar and silver jewellers in Rajasthan.
            </p>
            <p style={{ fontSize:"14px", color:"#555", lineHeight:1.9 }}>
              Today, Sanskriti is not just a marketplace — it is a complete seller ecosystem offering e-commerce setup, branding, photoshoots, manufacturing support, and expert training.
            </p>
          </div>

          {/* Book card */}
          <div style={{ borderRadius:"20px", border:`2px solid rgba(155,0,32,.15)`, overflow:"hidden" }}>
            <div style={{ background:BURG, padding:"32px 28px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(rgba(255,255,255,.05) 1px,transparent 1px)`, backgroundSize:"20px 20px", pointerEvents:"none" }} />
              <div style={{ position:"relative" }}>
                <div style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,.6)", letterSpacing:".14em", textTransform:"uppercase", marginBottom:"8px" }}>By our Founder</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"22px", fontWeight:700, color:"#fff", lineHeight:1.2, marginBottom:"6px" }}>The Zero-Inventory Empire</h3>
                <div style={{ fontSize:"13px", color:"rgba(255,255,255,.6)", marginBottom:"16px" }}>by Vipul Kumar Arya · ₹179 on Amazon</div>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,.8)", lineHeight:1.75 }}>
                  Build a profitable e-commerce business without stocking a single product. The exact playbook behind Sanskriti's zero-inventory model.
                </p>
              </div>
            </div>
            <div style={{ background:"#fff", padding:"20px 28px" }}>
              {["No inventory investment", "No warehouse required", "No manpower needed", "Earn on every order"].map(f => (
                <div key={f} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"7px 0", borderBottom:"1px solid #f5f5f5" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BURG} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontSize:"13px", color:"#444" }}>{f}</span>
                </div>
              ))}
              <Link href="/training/ebook" style={{ display:"inline-flex", alignItems:"center", gap:"8px", marginTop:"16px", padding:"10px 22px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"12px", fontWeight:700, textDecoration:"none" }}>
                Get the Book on Amazon →
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ── MEDIA GALLERY ─────────────────────────────────────── */}
      <section ref={ref("media")} style={{ padding:"80px 48px", background:"#fff", opacity:v("media")?1:0, transform:v("media")?"none":"translateY(32px)", transition:"all .8s ease" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase", marginBottom:"10px" }}>Behind the Scenes</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#111", marginBottom:"10px" }}>
              A Glimpse into
              <span style={{ fontStyle:"italic", color:BURG, fontWeight:400 }}> Our World</span>
            </h2>
            <p style={{ fontSize:"14px", color:"#888", maxWidth:"480px", margin:"0 auto" }}>From our workshop floors to product creation — see what makes Sanskriti tick.</p>
          </div>

          {/* Tab switcher */}
          <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginBottom:"28px", flexWrap:"wrap" }}>
            {MEDIA_TABS.map((t, i) => (
              <button key={t.key} onClick={() => setMediaTab(i)}
                style={{ padding:"9px 20px", borderRadius:"99px", border:`1.5px solid ${mediaTab===i?BURG:"#f0f0f0"}`, background:mediaTab===i?BURG:"#fff", color:mediaTab===i?"#fff":"#666", fontSize:"13px", fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", display:"flex", alignItems:"center", gap:"6px" }}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {/* Carousel */}
          {MEDIA_TABS[mediaTab].items.length === 0 ? (
            <div style={{ borderRadius:"16px", border:"2px dashed #f0f0f0", padding:"60px 24px", textAlign:"center" }}>
              <div style={{ fontSize:"48px", marginBottom:"14px", opacity:.2 }}>{MEDIA_TABS[mediaTab].icon}</div>
              <div style={{ fontSize:"15px", fontWeight:600, color:"#bbb", marginBottom:"6px" }}>No media added yet</div>
              <div style={{ fontSize:"13px", color:"#ddd", lineHeight:1.6 }}>
                Place files in <code style={{ background:"#f5f5f5", padding:"2px 7px", borderRadius:"4px", color:"#999", fontSize:"12px" }}>frontend/public/about/{MEDIA_TABS[mediaTab].key}/</code><br />
                then uncomment the entries in the <code style={{ background:"#f5f5f5", padding:"2px 7px", borderRadius:"4px", color:"#999", fontSize:"12px" }}>MEDIA_TABS</code> array
              </div>
            </div>
          ) : (
            <Carousel items={MEDIA_TABS[mediaTab].items} icon={MEDIA_TABS[mediaTab].icon} />
          )}

          {/* Optional video */}
          {SHOWCASE_VIDEO && (
            <div style={{ marginTop:"20px", borderRadius:"16px", overflow:"hidden", border:"1px solid #f0f0f0", aspectRatio:"16/9" }}>
              {SHOWCASE_VIDEO.includes("youtube") ? (
                <iframe src={SHOWCASE_VIDEO} style={{ width:"100%", height:"100%", border:"none" }} allowFullScreen />
              ) : (
                <video src={SHOWCASE_VIDEO} autoPlay muted loop playsInline style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              )}
            </div>
          )}

          {/* Helper note */}
          <div style={{ marginTop:"16px", padding:"12px 16px", borderRadius:"10px", background:"rgba(155,0,32,.04)", border:`1px solid rgba(155,0,32,.1)`, fontSize:"12px", color:"#888" }}>
            📸 <strong style={{ color:"#555" }}>To add images:</strong> Open <code style={{ background:"#f5f5f5", padding:"1px 5px", borderRadius:"4px" }}>app/about/page.tsx</code> and fill in the <code style={{ background:"#f5f5f5", padding:"1px 5px", borderRadius:"4px" }}>url:</code> fields in the <code style={{ background:"#f5f5f5", padding:"1px 5px", borderRadius:"4px" }}>MEDIA_TABS</code> array. Supports direct image URLs, Cloudinary, or /public/ folder paths.
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────── */}
      <section ref={ref("timeline")} style={{ padding:"80px 48px", background:"#fff", opacity:v("timeline")?1:0, transform:v("timeline")?"none":"translateY(32px)", transition:"all .8s ease" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"52px" }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase", marginBottom:"10px" }}>Our History</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#111" }}>
              16 Years of Growth
            </h2>
          </div>

          <div style={{ position:"relative" }}>
            {/* Vertical line */}
            <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:"2px", background:"#f0f0f0", transform:"translateX(-50%)" }} />

            {TIMELINE.map((t, i) => (
              <div key={t.year} className="tl-item" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"32px", marginBottom:"32px", alignItems:"center", animation:v("timeline")?`fadeUp .5s ${i*.1}s ease both`:"none" }}>
                {i % 2 === 0 ? (
                  <>
                    <div className="tl-content" style={{ textAlign:"right", padding:"20px 24px", borderRadius:"14px", border:"1.5px solid #f0f0f0", background:"#fff", transition:"all .25s" }}>
                      <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".1em", marginBottom:"4px" }}>{t.year}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:600, color:"#111", marginBottom:"6px" }}>{t.title}</div>
                      <div style={{ fontSize:"12px", color:"#888", lineHeight:1.6 }}>{t.desc}</div>
                    </div>
                    <div style={{ position:"relative", display:"flex", justifyContent:"flex-start" }}>
                      <div className="tl-dot" style={{ width:"16px", height:"16px", borderRadius:"50%", background:"#f0f0f0", border:`3px solid ${BURG}`, position:"absolute", left:"-8px", top:"50%", transform:"translateY(-50%)", zIndex:1 }} />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ position:"relative", display:"flex", justifyContent:"flex-end" }}>
                      <div className="tl-dot" style={{ width:"16px", height:"16px", borderRadius:"50%", background:"#f0f0f0", border:`3px solid ${BURG}`, position:"absolute", right:"-8px", top:"50%", transform:"translateY(-50%)", zIndex:1 }} />
                    </div>
                    <div className="tl-content" style={{ padding:"20px 24px", borderRadius:"14px", border:"1.5px solid #f0f0f0", background:"#fff", transition:"all .25s" }}>
                      <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".1em", marginBottom:"4px" }}>{t.year}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:600, color:"#111", marginBottom:"6px" }}>{t.title}</div>
                      <div style={{ fontSize:"12px", color:"#888", lineHeight:1.6 }}>{t.desc}</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────── */}
      <section ref={ref("values")} style={{ padding:"80px 48px", background:"#f9f9f9", opacity:v("values")?1:0, transform:v("values")?"none":"translateY(32px)", transition:"all .8s ease" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"48px" }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase", marginBottom:"10px" }}>What We Stand For</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#111" }}>Our Core Values</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"14px" }}>
            {VALUES.map((val, i) => (
              <div key={val.title} className="val-card" style={{ padding:"28px 24px", borderRadius:"16px", border:"1.5px solid #f0f0f0", background:"#fff", transition:"all .3s", animation:v("values")?`fadeUp .5s ${i*.07}s ease both`:"none" }}>
                <div style={{ width:"52px", height:"52px", borderRadius:"14px", background:val.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", marginBottom:"14px" }}>{val.icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"17px", fontWeight:600, color:"#111", marginBottom:"8px" }}>{val.title}</h3>
                <p style={{ fontSize:"13px", color:"#666", lineHeight:1.75 }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────── */}
      <section ref={ref("team")} style={{ padding:"80px 48px", background:"#fff", opacity:v("team")?1:0, transform:v("team")?"none":"translateY(32px)", transition:"all .8s ease" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"48px" }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase", marginBottom:"10px" }}>The People</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#111" }}>Behind Sanskriti</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"14px" }}>
            {TEAM.map((t, i) => (
              <div key={t.name} className="team-card" style={{ padding:"28px 22px", borderRadius:"16px", border:"1.5px solid #f0f0f0", background:"#fff", transition:"all .3s", textAlign:"center", animation:v("team")?`fadeUp .5s ${i*.08}s ease both`:"none" }}>
                <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:BURG, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"18px", fontWeight:700, margin:"0 auto 16px", boxShadow:`0 4px 16px rgba(155,0,32,.25)` }}>{t.initials}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:600, color:"#111", marginBottom:"5px" }}>{t.name}</div>
                <div style={{ fontSize:"11px", color:BURG, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"12px" }}>{t.role}</div>
                <p style={{ fontSize:"12px", color:"#888", lineHeight:1.7 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RED IMPACT BANNER ─────────────────────────────────── */}
      <section ref={ref("impact")} style={{ background:BURG, padding:"60px 48px", opacity:v("impact")?1:0, transform:v("impact")?"none":"translateY(32px)", transition:"all .8s ease", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)`, backgroundSize:"28px 28px", pointerEvents:"none" }} />
        <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative" }}>
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#fff", marginBottom:"10px" }}>
              Our Impact in Numbers
            </h2>
            <p style={{ fontSize:"14px", color:"rgba(255,255,255,.7)", maxWidth:"480px", margin:"0 auto" }}>Every number represents a real artisan, a real sale, a real livelihood.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"16px" }}>
            {[
              { n:"1,00,000+", label:"Products Listed"     },
              { n:"5,000+",    label:"Active Sellers"      },
              { n:"₹10Cr+",   label:"Revenue Generated"   },
              { n:"25+",       label:"Product Categories"  },
              { n:"12+",       label:"Years of Experience" },
              { n:"98%",       label:"Authenticity Rate"   },
            ].map(s => (
              <div key={s.label} style={{ padding:"20px 16px", borderRadius:"14px", background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)", textAlign:"center" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"28px", fontWeight:700, color:"#fff", lineHeight:1, marginBottom:"6px" }}>{s.n}</div>
                <div style={{ fontSize:"11px", color:"rgba(255,255,255,.65)", letterSpacing:".06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding:"80px 48px", background:"#fff", textAlign:"center" }}>
        <div style={{ maxWidth:"560px", margin:"0 auto" }}>
          <div style={{ fontSize:"48px", marginBottom:"16px", animation:"float 3s ease-in-out infinite" }}>🏺</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#111", marginBottom:"12px" }}>
            Be Part of the
            <span style={{ fontStyle:"italic", color:BURG, fontWeight:400 }}> Sanskriti Story</span>
          </h2>
          <p style={{ fontSize:"14px", color:"#666", lineHeight:1.9, marginBottom:"28px" }}>
            Join thousands of sellers building real businesses on India's most trusted antique platform. Start free — no inventory, no warehouse, no manpower needed.
          </p>
          <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/register" style={{ padding:"14px 32px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none", boxShadow:`0 6px 20px rgba(155,0,32,.3)` }}>Join as Seller →</Link>
            <Link href="/contact" style={{ padding:"14px 28px", borderRadius:"8px", border:"1.5px solid #e5e5e5", color:"#333", fontSize:"14px", fontWeight:500, textDecoration:"none" }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
