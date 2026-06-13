"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const STATS = [
  { value:"1L+",   label:"Products Listed"     },
  { value:"25+",   label:"Categories"           },
  { value:"5,000+",label:"Active Sellers"       },
  { value:"12+",   label:"Years of Experience"  },
];

const VALUES = [
  { icon:"🏛️", title:"Heritage First",       desc:"Every antique listed on our platform is verified for authenticity. We protect India's cultural legacy one piece at a time." },
  { icon:"🤝", title:"Seller Success",       desc:"We grow when our sellers grow. Our entire platform is built to help artisans and dealers build sustainable digital businesses." },
  { icon:"🔍", title:"Transparency",         desc:"Clear pricing, honest descriptions, and full disclosure of condition. Buyers and sellers both deserve complete transparency." },
  { icon:"🌐", title:"Digital India",        desc:"We believe every Indian artisan deserves access to global markets. We bridge the gap between heritage craftsmanship and modern e-commerce." },
];

const TEAM = [
  { name:"Vipul Kumar Arya",  role:"Founder & CEO",          initials:"VK", desc:"Author of The Zero-Inventory Empire. 12+ years in antique trade and e-commerce." },
  { name:"Operations Team",   role:"Platform & Seller Support",initials:"OT", desc:"Dedicated team managing seller onboarding, KYC, orders, and platform operations." },
  { name:"Content Team",      role:"Training & Education",    initials:"CT", desc:"Experts creating training videos, ebooks, and seller education programmes." },
  { name:"Tech Team",         role:"Platform Development",    initials:"TT", desc:"Building the technology that powers Sanskriti's seller and buyer experience." },
];

export default function AboutPage() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [visible, setVisible] = useState<Set<string>>(new Set());

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setVisible(prev => new Set([...prev, (e.target as HTMLElement).dataset.sec!])); }),
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const ref = (id: string) => (el: HTMLElement | null) => {
    if (el) { el.dataset.sec = id; sectionRefs.current[id] = el; }
  };
  const vis = (id: string) => visible.has(id);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", paddingTop:"68px" }}>
      <style>{`
        ${GF}
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes reveal{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .val-card:hover{border-color:${BURG}!important;transform:translateY(-3px)!important;box-shadow:0 10px 28px rgba(155,0,32,.08)!important}
        .team-card:hover{border-color:${BURG}!important;box-shadow:0 8px 24px rgba(155,0,32,.08)!important}
      `}</style>

      {/* ── HERO — no big banner, clean white ─────────────────── */}
      <section style={{ padding:"64px 48px 56px", background:"#fff", borderBottom:"1px solid #f0f0f0" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"center" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", padding:"4px 14px", borderRadius:"99px", border:`1px solid rgba(155,0,32,.18)`, background:`rgba(155,0,32,.04)`, marginBottom:"18px" }}>
              <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:BURG, animation:"pulse 2s infinite", display:"inline-block" }} />
              <span style={{ fontSize:"10px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase" }}>About Sanskriti</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,4vw,52px)", fontWeight:700, color:"#111", lineHeight:1.08, marginBottom:"18px" }}>
              Preserving India's
              <span style={{ display:"block", fontStyle:"italic", color:BURG, fontWeight:400 }}>Heritage, Digitally.</span>
            </h1>
            <p style={{ fontSize:"15px", color:"#555", lineHeight:1.85, marginBottom:"14px" }}>
              Sanskriti The Antique is India's most trusted marketplace for authentic antiques — connecting passionate sellers with discerning collectors since 2008.
            </p>
            <p style={{ fontSize:"15px", color:"#555", lineHeight:1.85, marginBottom:"28px" }}>
              We serve <strong style={{ color:"#111" }}>25+ categories</strong> with over <strong style={{ color:"#111" }}>1 lakh products</strong> — helping every artisan and dealer build a sustainable digital business without needing inventory, warehouse, or manpower.
            </p>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
              <Link href="/register" style={{ padding:"12px 28px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", boxShadow:`0 4px 16px rgba(155,0,32,.28)` }}>Join as Seller →</Link>
              <Link href="/services" style={{ padding:"12px 24px", borderRadius:"8px", border:"1.5px solid #e5e5e5", color:"#333", fontSize:"13px", fontWeight:500, textDecoration:"none" }}>Our Services</Link>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px", background:"#f0f0f0", borderRadius:"16px", overflow:"hidden" }}>
            {STATS.map(s => (
              <div key={s.label} style={{ padding:"28px 24px", background:"#fff", textAlign:"center" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"36px", fontWeight:700, color:BURG, lineHeight:1, marginBottom:"6px" }}>{s.value}</div>
                <div style={{ fontSize:"12px", color:"#888", letterSpacing:".08em", textTransform:"uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ─────────────────────────────────────────── */}
      <section ref={ref("story")} style={{ padding:"72px 48px", background:"#f9f9f9", opacity:vis("story")?1:0, transform:vis("story")?"none":"translateY(28px)", transition:"all .7s ease" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase", marginBottom:"10px" }}>Our Story</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#111", lineHeight:1.1, marginBottom:"20px" }}>
              A Legacy of
              <span style={{ fontStyle:"italic", color:BURG, fontWeight:400 }}> Authenticity</span>
            </h2>
            <p style={{ fontSize:"14px", color:"#555", lineHeight:1.85, marginBottom:"14px" }}>
              What began as a small family antique shop in the lanes of Hazratganj, Lucknow has grown into India's premier digital antique marketplace. Founded by Vipul Kumar Arya — author of <em>The Zero-Inventory Empire</em> — Sanskriti was built on a simple belief: every Indian artisan deserves access to a global market.
            </p>
            <p style={{ fontSize:"14px", color:"#555", lineHeight:1.85, marginBottom:"14px" }}>
              Over 12 years, we have helped thousands of sellers across India digitise their antique businesses — from brass craftsmen in Moradabad to Madhubani painters in Bihar and silver jewellers in Rajasthan.
            </p>
            <p style={{ fontSize:"14px", color:"#555", lineHeight:1.85 }}>
              Today, Sanskriti is not just a marketplace — it is a complete seller ecosystem offering e-commerce setup, branding, photoshoots, manufacturing support, and expert training to help every seller thrive.
            </p>
          </div>

          {/* Visual card */}
          <div style={{ borderRadius:"20px", overflow:"hidden", background:BURG, padding:"40px 36px", position:"relative" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }} />
            <div style={{ position:"relative" }}>
              <div style={{ fontSize:"48px", marginBottom:"20px" }}>🏺</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"22px", fontWeight:700, color:"#fff", marginBottom:"12px" }}>The Zero-Inventory Model</h3>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,.75)", lineHeight:1.8, marginBottom:"20px" }}>
                Sell lakhs of products online without stocking a single item. Our model lets you earn margin on every order while we handle packaging and dispatch from our warehouse.
              </p>
              {["No inventory investment", "No warehouse required", "No manpower needed", "Earn margin on every sale"].map(f => (
                <div key={f} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontSize:"13px", color:"rgba(255,255,255,.85)" }}>{f}</span>
                </div>
              ))}
              <Link href="/training/ebook" style={{ display:"inline-block", marginTop:"18px", padding:"10px 22px", borderRadius:"8px", background:"#fff", color:BURG, fontSize:"12px", fontWeight:700, textDecoration:"none" }}>
                Read the Book →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────── */}
      <section ref={ref("values")} style={{ padding:"72px 48px", background:"#fff", opacity:vis("values")?1:0, transform:vis("values")?"none":"translateY(28px)", transition:"all .7s ease" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"44px" }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase", marginBottom:"10px" }}>Our Values</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#111" }}>
              What We Stand For
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"14px" }}>
            {VALUES.map((v, i) => (
              <div key={v.title} className="val-card" style={{ padding:"26px 22px", borderRadius:"14px", border:"1.5px solid #f0f0f0", background:"#fff", transition:"all .25s", animation:vis("values")?`reveal .5s ${i*.08}s ease both`:"none" }}>
                <div style={{ fontSize:"28px", marginBottom:"12px" }}>{v.icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"17px", fontWeight:600, color:"#111", marginBottom:"8px" }}>{v.title}</h3>
                <p style={{ fontSize:"13px", color:"#666", lineHeight:1.75 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────── */}
      <section ref={ref("team")} style={{ padding:"72px 48px", background:"#f9f9f9", opacity:vis("team")?1:0, transform:vis("team")?"none":"translateY(28px)", transition:"all .7s ease" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"44px" }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase", marginBottom:"10px" }}>Our Team</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#111" }}>
              The People Behind Sanskriti
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"14px" }}>
            {TEAM.map((t, i) => (
              <div key={t.name} className="team-card" style={{ padding:"24px 20px", borderRadius:"14px", border:"1.5px solid #f0f0f0", background:"#fff", transition:"all .25s", textAlign:"center", animation:vis("team")?`reveal .5s ${i*.08}s ease both`:"none" }}>
                <div style={{ width:"56px", height:"56px", borderRadius:"50%", background:BURG, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"16px", fontWeight:700, margin:"0 auto 14px" }}>{t.initials}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:600, color:"#111", marginBottom:"4px" }}>{t.name}</div>
                <div style={{ fontSize:"11px", color:BURG, fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", marginBottom:"10px" }}>{t.role}</div>
                <p style={{ fontSize:"12px", color:"#888", lineHeight:1.65 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding:"72px 48px", background:"#fff", textAlign:"center" }}>
        <div style={{ maxWidth:"560px", margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"#111", marginBottom:"12px" }}>
            Be Part of the
            <span style={{ fontStyle:"italic", color:BURG, fontWeight:400 }}> Sanskriti Story</span>
          </h2>
          <p style={{ fontSize:"14px", color:"#666", lineHeight:1.85, marginBottom:"28px" }}>
            Join thousands of sellers building real businesses on India's most trusted antique platform.
          </p>
          <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/register" style={{ padding:"13px 32px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", boxShadow:`0 4px 16px rgba(155,0,32,.28)` }}>Join as Seller →</Link>
            <Link href="/contact" style={{ padding:"13px 28px", borderRadius:"8px", border:"1.5px solid #e5e5e5", color:"#333", fontSize:"13px", fontWeight:500, textDecoration:"none" }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
