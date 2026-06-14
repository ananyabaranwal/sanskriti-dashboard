"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ══════════════════════════════════════════════════════════════
// ADD YOUR CAROUSEL MEDIA HERE
// Place files in frontend/public/about/ and reference below
// Supports: .jpg .png .webp .mp4 .webm
// ══════════════════════════════════════════════════════════════
const CAROUSEL_ITEMS: { type: "image" | "video"; src: string; caption: string }[] = [
  // { type:"image", src:"/about/workshop.jpg",   caption:"Our Lucknow Workshop"    },
  // { type:"image", src:"/about/artisans.jpg",   caption:"Brass Artisans at Work"  },
  // { type:"image", src:"/about/products.jpg",   caption:"Our Product Collection"  },
  // { type:"video", src:"/about/tour.mp4",       caption:"Factory Tour"            },
  // { type:"image", src:"/about/store.jpg",       caption:"Hazratganj Flagship Store"},
  // { type:"image", src:"/about/team.jpg",        caption:"Our Team"                },
];
// ══════════════════════════════════════════════════════════════

const STATS = [
  { icon:"🏺", value:"1L+",    label:"Products Listed"   },
  { icon:"📦", value:"25+",    label:"Categories"        },
  { icon:"👥", value:"5,000+", label:"Active Sellers"    },
  { icon:"🏆", value:"12+",    label:"Years Experience"  },
  { icon:"💰", value:"₹10Cr+", label:"Revenue Generated" },
];

const TIMELINE = [
  { year:"2008", title:"The Beginning",    desc:"Started as a small family antique shop in Hazratganj, Lucknow. Specialising in brass idols and wooden antiques." },
  { year:"2012", title:"Going Digital",    desc:"Launched our first online presence. Discovered the massive gap between India's artisans and the global antique market." },
  { year:"2016", title:"Platform Launch",  desc:"Sanskriti The Antique platform launched. First 100 sellers onboarded. Zero-inventory model introduced." },
  { year:"2019", title:"Training Academy", desc:"Launched the seller training program. 1,000+ sellers trained in digital selling, authentication, and GST compliance." },
  { year:"2022", title:"1 Lakh Products",  desc:"Crossed 1 lakh products across 25+ categories. Expanded to Amazon and Flipkart integrations." },
  { year:"2024", title:"The Book & Beyond",desc:"Vipul Kumar Arya publishes The Zero-Inventory Empire. 5,000+ active sellers. ₹10 Cr+ revenue generated." },
];

export default function AboutPage() {
  const [statIdx, setStatIdx]     = useState(0);
  const [carIdx,  setCarIdx]      = useState(0);
  const [tlVis,   setTlVis]       = useState(false);
  const tlRef = useRef<HTMLDivElement>(null);

  // Rotate stats
  useEffect(() => {
    const t = setInterval(() => setStatIdx(i => (i + 1) % STATS.length), 2000);
    return () => clearInterval(t);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (CAROUSEL_ITEMS.length <= 1) return;
    const t = setInterval(() => setCarIdx(i => (i + 1) % CAROUSEL_ITEMS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Timeline scroll reveal
  useEffect(() => {
    if (!tlRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTlVis(true); }, { threshold: 0.08 });
    obs.observe(tlRef.current);
    return () => obs.disconnect();
  }, []);

  const cur = CAROUSEL_ITEMS[carIdx];
  const isVideo = cur?.type === "video";

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", paddingTop:"68px" }}>
      <style>{`
        ${GF}
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp  {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
        @keyframes statIn  {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse   {0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        @keyframes slideL  {from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideR  {from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        .tl-card:hover{border-color:${BURG}!important;transform:translateY(-2px)!important}
      `}</style>

      {/* ══ HERO — full viewport ═══════════════════════════════ */}
      <section style={{ minHeight:"calc(100vh - 68px)", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0", alignItems:"stretch" }}>

        {/* LEFT */}
        <div style={{ padding:"52px 48px 52px 52px", display:"flex", flexDirection:"column", justifyContent:"center", borderRight:"1px solid #f0f0f0", animation:"slideL .7s ease both" }}>

          {/* Tag */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", padding:"4px 14px", borderRadius:"99px", border:`1px solid rgba(155,0,32,.2)`, background:`rgba(155,0,32,.04)`, marginBottom:"20px", width:"fit-content" }}>
            <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:BURG, animation:"pulse 2s infinite", display:"inline-block" }} />
            <span style={{ fontSize:"10px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase" }}>Our Story</span>
          </div>

          {/* Heading */}
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3.2vw,42px)", fontWeight:700, color:"#111", lineHeight:1.12, marginBottom:"20px" }}>
            From a Lucknow Lane to
            <span style={{ display:"block", fontStyle:"italic", color:BURG, fontWeight:400 }}>India's Most Trusted</span>
            Digital Antique Marketplace
          </h1>

          {/* Animated stat */}
          <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"22px", padding:"14px 18px", borderRadius:"12px", background:"#f9f9f9", border:"1px solid #f0f0f0" }}>
            <span key={statIdx + "icon"} style={{ fontSize:"28px", animation:"statIn .35s ease" }}>{STATS[statIdx].icon}</span>
            <div>
              <div key={statIdx + "val"} style={{ fontFamily:"'Playfair Display',serif", fontSize:"28px", fontWeight:700, color:BURG, lineHeight:1, animation:"statIn .35s ease" }}>{STATS[statIdx].value}</div>
              <div key={statIdx + "lbl"} style={{ fontSize:"12px", color:"#888", marginTop:"2px", animation:"statIn .35s ease" }}>{STATS[statIdx].label}</div>
            </div>
            {/* Dot indicators */}
            <div style={{ marginLeft:"auto", display:"flex", gap:"5px" }}>
              {STATS.map((_, i) => (
                <button key={i} onClick={() => setStatIdx(i)} style={{ width: i===statIdx?"16px":"6px", height:"6px", borderRadius:"99px", background:i===statIdx?BURG:"#e5e5e5", border:"none", cursor:"pointer", transition:"all .25s", padding:0 }} />
              ))}
            </div>
          </div>

          {/* Story text */}
          <p style={{ fontSize:"14px", color:"#555", lineHeight:1.85, marginBottom:"10px" }}>
            What began as a small family antique shop in Hazratganj, Lucknow has grown into India's premier digital antique marketplace. Founded by <strong style={{ color:"#111" }}>Vipul Kumar Arya</strong> — author of <em>The Zero-Inventory Empire</em> — Sanskriti was built on one belief: every Indian artisan deserves access to a global market.
          </p>
          <p style={{ fontSize:"14px", color:"#555", lineHeight:1.85, marginBottom:"24px" }}>
            Over 12 years, we've helped thousands of sellers across India digitise their businesses — from brass craftsmen in Moradabad to Madhubani painters in Bihar and silver jewellers in Rajasthan.
          </p>

          {/* Ebook glass card */}
          <div style={{ borderRadius:"14px", border:`1px solid rgba(155,0,32,.2)`, background:"rgba(155,0,32,.03)", backdropFilter:"blur(8px)", padding:"18px 20px", marginBottom:"24px" }}>
            <div style={{ fontSize:"10px", fontWeight:700, color:BURG, letterSpacing:".12em", textTransform:"uppercase", marginBottom:"6px" }}>By Our Founder</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"17px", fontWeight:700, color:"#111", marginBottom:"3px" }}>The Zero-Inventory Empire</div>
            <div style={{ fontSize:"12px", color:"#888", marginBottom:"12px" }}>by Vipul Kumar Arya · ₹179 on Amazon</div>
            <p style={{ fontSize:"12px", color:"#555", lineHeight:1.7, marginBottom:"12px" }}>
              Build a profitable e-commerce business without stocking a single product. The exact playbook behind Sanskriti's zero-inventory model.
            </p>
            <a href="https://www.amazon.in/ZERO-INVENTORY-EMPIRE-VIPUL-KUMAR-ARYA/dp/9376503139" target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"8px 18px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"12px", fontWeight:700, textDecoration:"none" }}>
              Buy on Amazon →
            </a>
          </div>

          {/* CTAs */}
          <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
            <Link href="/register" style={{ padding:"11px 24px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", boxShadow:`0 4px 14px rgba(155,0,32,.28)` }}>Join as Seller →</Link>
            <Link href="/services" style={{ padding:"11px 20px", borderRadius:"8px", border:"1.5px solid #e5e5e5", color:"#333", fontSize:"13px", fontWeight:500, textDecoration:"none" }}>Our Services</Link>
          </div>
        </div>

        {/* RIGHT — Carousel */}
        <div style={{ position:"relative", background:"#111", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", animation:"slideR .7s ease both", minHeight:"500px" }}>
          {CAROUSEL_ITEMS.length === 0 ? (
            // Placeholder when no media added
            <div style={{ textAlign:"center", padding:"40px" }}>
              <div style={{ fontSize:"64px", marginBottom:"16px", opacity:.15 }}>🏺</div>
              <div style={{ fontSize:"14px", color:"rgba(255,255,255,.3)", marginBottom:"6px" }}>Add your images & videos</div>
              <div style={{ fontSize:"12px", color:"rgba(255,255,255,.2)", lineHeight:1.6 }}>
                Uncomment items in<br />
                <code style={{ background:"rgba(255,255,255,.08)", padding:"2px 8px", borderRadius:"4px", fontSize:"11px" }}>CAROUSEL_ITEMS</code><br />
                at top of this file
              </div>
            </div>
          ) : (
            <>
              {/* Media */}
              {isVideo ? (
                <video key={cur.src} src={cur.src} autoPlay muted loop playsInline style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }} />
              ) : (
                <img key={cur.src} src={cur.src} alt={cur.caption} style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0, animation:"fadeIn .5s ease" }} />
              )}

              {/* Caption */}
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"20px 24px", background:"linear-gradient(to top,rgba(0,0,0,.65),transparent)" }}>
                <div style={{ fontSize:"14px", fontWeight:600, color:"#fff" }}>{cur.caption}</div>
                <div style={{ fontSize:"11px", color:"rgba(255,255,255,.5)", marginTop:"2px" }}>{carIdx + 1} / {CAROUSEL_ITEMS.length}</div>
              </div>

              {/* Arrows */}
              {CAROUSEL_ITEMS.length > 1 && (
                <>
                  <button onClick={() => setCarIdx(i => (i - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length)}
                    style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", width:"36px", height:"36px", borderRadius:"50%", background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)", color:"#fff", fontSize:"20px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2 }}>‹</button>
                  <button onClick={() => setCarIdx(i => (i + 1) % CAROUSEL_ITEMS.length)}
                    style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", width:"36px", height:"36px", borderRadius:"50%", background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)", color:"#fff", fontSize:"20px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2 }}>›</button>
                </>
              )}

              {/* Dots */}
              <div style={{ position:"absolute", bottom:"60px", left:"50%", transform:"translateX(-50%)", display:"flex", gap:"6px", zIndex:2 }}>
                {CAROUSEL_ITEMS.map((_, i) => (
                  <button key={i} onClick={() => setCarIdx(i)} style={{ width:i===carIdx?"18px":"6px", height:"6px", borderRadius:"99px", background:i===carIdx?"#fff":"rgba(255,255,255,.4)", border:"none", cursor:"pointer", transition:"all .25s", padding:0 }} />
                ))}
              </div>

              {/* Thumbnail strip */}
              {CAROUSEL_ITEMS.length > 2 && (
                <div style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:"6px", zIndex:2 }}>
                  {CAROUSEL_ITEMS.map((it, i) => (
                    <div key={i} onClick={() => setCarIdx(i)} style={{ width:"48px", height:"36px", borderRadius:"6px", overflow:"hidden", border:`2px solid ${i===carIdx?"#fff":"transparent"}`, cursor:"pointer", opacity:i===carIdx?1:.6, transition:"all .2s" }}>
                      {it.type==="video"
                        ? <div style={{ width:"100%", height:"100%", background:"#333", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", color:"#fff" }}>▶</div>
                        : <img src={it.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      }
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ══ TIMELINE — reveals on scroll ══════════════════════ */}
      <section ref={tlRef} style={{ padding:"80px 52px", background:"#fff" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"52px", opacity:tlVis?1:0, transform:tlVis?"none":"translateY(24px)", transition:"all .7s ease" }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase", marginBottom:"10px" }}>Our History</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, color:"#111" }}>16 Years of Growth</h2>
          </div>

          {/* Vertical timeline */}
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:"2px", background:"#f0f0f0", transform:"translateX(-50%)" }} />

            {TIMELINE.map((t, i) => (
              <div key={t.year} style={{ display:"grid", gridTemplateColumns:"1fr 40px 1fr", gap:"0", marginBottom:"28px", alignItems:"center", opacity:tlVis?1:0, transform:tlVis?"none":"translateY(24px)", transition:`all .6s ${i*.1}s ease` }}>
                {i % 2 === 0 ? (
                  <>
                    <div className="tl-card" style={{ padding:"18px 22px", borderRadius:"12px", border:"1.5px solid #f0f0f0", background:"#fff", transition:"all .2s", textAlign:"right" }}>
                      <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".1em", marginBottom:"3px" }}>{t.year}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"15px", fontWeight:600, color:"#111", marginBottom:"5px" }}>{t.title}</div>
                      <div style={{ fontSize:"12px", color:"#888", lineHeight:1.6 }}>{t.desc}</div>
                    </div>
                    <div style={{ display:"flex", justifyContent:"center" }}>
                      <div style={{ width:"14px", height:"14px", borderRadius:"50%", background:"#fff", border:`3px solid ${BURG}`, zIndex:1 }} />
                    </div>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <div style={{ display:"flex", justifyContent:"center" }}>
                      <div style={{ width:"14px", height:"14px", borderRadius:"50%", background:`rgba(155,0,32,.15)`, border:`3px solid rgba(155,0,32,.4)`, zIndex:1 }} />
                    </div>
                    <div className="tl-card" style={{ padding:"18px 22px", borderRadius:"12px", border:"1.5px solid #f0f0f0", background:"#fff", transition:"all .2s" }}>
                      <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".1em", marginBottom:"3px" }}>{t.year}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"15px", fontWeight:600, color:"#111", marginBottom:"5px" }}>{t.title}</div>
                      <div style={{ fontSize:"12px", color:"#888", lineHeight:1.6 }}>{t.desc}</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════ */}
      <section style={{ padding:"64px 48px", background:BURG, textAlign:"center" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)`, backgroundSize:"28px 28px", pointerEvents:"none" }} />
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(24px,3vw,38px)", fontWeight:700, color:"#fff", marginBottom:"10px" }}>
          Be Part of the Sanskriti Story
        </h2>
        <p style={{ fontSize:"14px", color:"rgba(255,255,255,.75)", marginBottom:"24px", maxWidth:"440px", margin:"0 auto 24px", lineHeight:1.8 }}>
          Join thousands of sellers building real businesses on India's most trusted antique platform.
        </p>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
          <Link href="/register" style={{ padding:"13px 30px", borderRadius:"8px", background:"#fff", color:BURG, fontSize:"13px", fontWeight:700, textDecoration:"none" }}>Join as Seller →</Link>
          <Link href="/contact" style={{ padding:"13px 26px", borderRadius:"8px", border:"1.5px solid rgba(255,255,255,.35)", color:"#fff", fontSize:"13px", fontWeight:500, textDecoration:"none" }}>Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
