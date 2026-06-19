"use client";
import { useState } from "react";
import Link from "next/link";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const SERVICES = [
  { icon:"📢", title:"Marketing & Promotion", shortDesc:"Digital and offline marketing to grow your antique business.", fullDesc:"Comprehensive campaigns — social media, SEO, exhibitions, influencer collabs, and more.", features:["Social media management","SEO & Google Ads","Exhibition participation","Email marketing","Influencer collaborations","Print & offline media"], ideal:"Sellers wanting to expand" },
  { icon:"🏷️", title:"Brand Building", shortDesc:"Complete branding solutions for your antique dealership.", fullDesc:"Logo, brand guidelines, packaging, and your unique brand story to set you apart.", features:["Logo & visual identity","Brand guidelines","Packaging design","Business cards","Brand story writing","Website branding"], ideal:"New sellers and rebrandings" },
  { icon:"💼", title:"Business Consultancy", shortDesc:"Expert guidance on launching and scaling.", fullDesc:"Decades of experience guiding pricing, supplier relations, legal compliance and growth.", features:["Business structure","Pricing strategy","Supplier sourcing","GST compliance","Growth planning","P&L optimisation"], ideal:"New entrants and scaling businesses" },
  { icon:"🏭", title:"Manufacturing Setup", shortDesc:"End-to-end support for setting up manufacturing.", fullDesc:"Location, machinery, workforce training, quality control — complete infrastructure setup.", features:["Infrastructure planning","Machinery sourcing","Workforce training","QC systems","Licensing","Cost optimisation"], ideal:"Sellers adding manufacturing" },
  { icon:"🎓", title:"Training & Education", shortDesc:"Professional training on antique identification.", fullDesc:"Structured programmes covering authentication, market dynamics, and digital selling.", features:["Video training library","Live workshops","Authentication","Valuation","Digital selling","Certification"], ideal:"All sellers at every level" },
  { icon:"🔗", title:"Network & Distribution", shortDesc:"Connect with verified buyers, sellers, exporters.", fullDesc:"Curated network of dealers, collectors, and exporters across India and internationally.", features:["Buyer introductions","Exporter connections","Collector database","Trade fair invites","Partnership facilitation","International network"], ideal:"Sellers ready to scale" },
];

const STEPS = [
  { n:1, icon:"🙋", title:"Enroll",          desc:"Register on Sanskriti",        color:BURG },
  { n:2, icon:"⚙️", title:"Account Setup",   desc:"We set up your profile",       color:BURG },
  { n:3, icon:"📋", title:"Product Listing", desc:"We list your products",         color:BURG },
  { n:4, icon:"📦", title:"Order Received",  desc:"You receive orders",            color:BURG },
  { n:5, icon:"🚚", title:"We Dispatch",     desc:"We ship from our warehouse",    color:BURG },
  { n:6, icon:"💰", title:"You Earn",        desc:"Profit to your wallet",         color:BURG },
];

/* ───────────────── FLOW DIAGRAM PIECES — UNCHANGED ───────────────── */

const ARROW_H = (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"48px" }}>
    <svg width="44" height="16" viewBox="0 0 44 16"><line x1="0" y1="8" x2="36" y2="8" stroke={BURG} strokeWidth="2" strokeDasharray="4 3"/><polygon points="36,3 44,8 36,13" fill={BURG}/></svg>
  </div>
);

const ARROW_H_L = (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"48px" }}>
    <svg width="44" height="16" viewBox="0 0 44 16"><line x1="44" y1="8" x2="8" y2="8" stroke={BURG} strokeWidth="2" strokeDasharray="4 3"/><polygon points="8,3 0,8 8,13" fill={BURG}/></svg>
  </div>
);

const ARROW_D = (
  <div style={{ display:"flex", justifyContent:"flex-end", paddingRight:"36px", height:"32px", alignItems:"center" }}>
    <svg width="16" height="32" viewBox="0 0 16 32"><line x1="8" y1="0" x2="8" y2="24" stroke={BURG} strokeWidth="2" strokeDasharray="4 3"/><polygon points="3,24 8,32 13,24" fill={BURG}/></svg>
  </div>
);

const ARROW_U = (
  <div style={{ display:"flex", justifyContent:"flex-start", paddingLeft:"36px", height:"32px", alignItems:"center" }}>
    <svg width="16" height="32" viewBox="0 0 16 32"><line x1="8" y1="32" x2="8" y2="8" stroke={BURG} strokeWidth="2" strokeDasharray="4 3"/><polygon points="3,8 8,0 13,8" fill={BURG}/></svg>
  </div>
);

function StepBox({ s }: { s: typeof STEPS[0] }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", width:"120px" }}>
      <div style={{ width:"60px", height:"60px", borderRadius:"16px", background:BURG, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", marginBottom:"8px", boxShadow:`0 6px 18px rgba(155,0,32,.28)`, position:"relative" }}>
        <span style={{ fontSize:"22px", lineHeight:1 }}>{s.icon}</span>
        <div style={{ position:"absolute", top:"-8px", right:"-8px", width:"22px", height:"22px", borderRadius:"50%", background:"#fff", border:`2px solid ${BURG}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:700, color:BURG }}>{s.n}</div>
      </div>
      <div style={{ fontSize:"13px", fontWeight:700, color:"#111", marginBottom:"2px" }}>{s.title}</div>
      <div style={{ fontSize:"11px", color:"#888", lineHeight:1.4 }}>{s.desc}</div>
    </div>
  );
}

/* ───────────────── PAGE ───────────────── */

export default function ServicesPage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", paddingTop:"68px" }}>
      <style>{`
        ${GF}*{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

        /* ── motion graphics added below ── */
        @keyframes floatSlow{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(10px,-12px) scale(1.08)}}
        @keyframes floatSlow2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-14px,10px) scale(1.05)}}
        @keyframes underlineGrow{from{width:0}to{width:38px}}
        @keyframes marqueeRTL{from{transform:translateX(0)}to{transform:translateX(-50%)}}

        .srv-track{ display:flex; gap:16px; width:max-content; animation:marqueeRTL 32s linear infinite; }
        .srv-track:hover{ animation-play-state:paused; }
        .srv{ will-change:transform,opacity,box-shadow; flex-shrink:0; width:280px; }
        .srv:hover{border-color:${BURG}!important;transform:translateY(-6px) scale(1.012)!important;box-shadow:0 16px 36px rgba(155,0,32,.16)!important}
        .srv-icon{ transition:transform .4s cubic-bezier(.34,1.56,.64,1); }
        .srv:hover .srv-icon{ transform:scale(1.18) rotate(-6deg); }
        .srv-cta{ transition:transform .25s ease, color .2s ease; display:inline-flex; align-items:center; gap:4px; }
        .srv:hover .srv-cta{ transform:translateX(3px); color:${BURG}; }
        .srv-underline{ height:2px; width:0; background:${BURG}; border-radius:2px; transition:width .35s ease; margin-top:6px; }
        .srv:hover .srv-underline{ width:32px; }

        .floatA{ animation:floatSlow 6s ease-in-out infinite; }
        .floatB{ animation:floatSlow2 7.5s ease-in-out infinite; }

        .banner-title-underline{ animation:underlineGrow .6s ease forwards; }
      `}</style>

      {/* ── FLOW DIAGRAM — KEPT EXACTLY AS-IS ─────────────────── */}
      <section style={{ padding:"44px 48px 40px", background:"#fff", borderBottom:"1px solid #f0f0f0" }}>
        <div style={{ maxWidth:"960px", margin:"0 auto" }}>

          <div style={{ textAlign:"center", marginBottom:"32px" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", padding:"4px 14px", borderRadius:"99px", border:`1px solid rgba(155,0,32,.18)`, background:`rgba(155,0,32,.04)`, marginBottom:"10px" }}>
              <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:BURG, animation:"pulse 2s infinite", display:"inline-block" }} />
              <span style={{ fontSize:"10px", fontWeight:700, color:BURG, letterSpacing:".14em", textTransform:"uppercase" }}>How It Works</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,3vw,32px)", fontWeight:700, color:"#111", lineHeight:1.1 }}>
              Grow Your Business <span style={{ fontStyle:"italic", color:BURG, fontWeight:400 }}>With Sanskriti</span>
            </h1>
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0", marginBottom:"0" }}>
            <StepBox s={STEPS[0]} />
            {ARROW_H}
            <StepBox s={STEPS[1]} />
            {ARROW_H}
            <StepBox s={STEPS[2]} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", marginBottom:"0" }}>
            <div /><div />{ARROW_D}
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0" }}>
            <StepBox s={STEPS[5]} />
            {ARROW_H_L}
            <StepBox s={STEPS[4]} />
            {ARROW_H_L}
            <StepBox s={STEPS[3]} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr" }}>
            {ARROW_U}<div /><div />
          </div>

          <div style={{ display:"flex", justifyContent:"center", gap:"10px", marginTop:"8px", flexWrap:"wrap" }}>
            {[
              { label:"No Manpower Needed",  yes:false },
              { label:"No Warehouse Needed", yes:false },
              { label:"No Inventory Needed", yes:false },
              { label:"Just Enroll & Earn",  yes:true  },
            ].map(c => (
              <div key={c.label} style={{ display:"flex", alignItems:"center", gap:"7px", padding:"7px 16px", borderRadius:"99px", background:c.yes?BURG:"#fff", border:c.yes?`none`:`1.5px solid #f0f0f0`, boxShadow:c.yes?`0 4px 14px rgba(155,0,32,.25)`:"0 1px 4px rgba(0,0,0,.04)" }}>
                <span style={{ fontSize:"14px" }}>{c.yes?"✅":"❌"}</span>
                <span style={{ fontSize:"12px", fontWeight:600, color:c.yes?"#fff":"#555" }}>{c.label}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:"22px" }}>
            <Link href="/register" style={{ display:"inline-block", padding:"12px 32px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", boxShadow:`0 4px 16px rgba(155,0,32,.28)` }}>
              Start Your Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES — banner + grid, ANIMATED ───────────────── */}
      <section style={{ background:"#f9f9f9" }}>

        {/* Narrow banner — with floating motion shapes */}
        <div style={{ background:"#fff", padding:"18px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", position:"relative", overflow:"hidden", borderBottom:"1px solid #f0f0f0" }}>
          <div className="floatA" style={{ position:"absolute", top:"-30px", right:"120px", width:"90px", height:"90px", borderRadius:"50%", background:"rgba(155,0,32,.05)", pointerEvents:"none" }} />
          <div className="floatB" style={{ position:"absolute", bottom:"-40px", right:"260px", width:"70px", height:"70px", borderRadius:"50%", background:"rgba(155,0,32,.04)", pointerEvents:"none" }} />
          <div className="floatA" style={{ position:"absolute", top:"10px", left:"40%", width:"36px", height:"36px", borderRadius:"50%", background:"rgba(155,0,32,.05)", pointerEvents:"none", animationDelay:"1.2s" }} />

          <div style={{ position:"relative", zIndex:1 }}>
            <span style={{ fontSize:"11px", fontWeight:700, color:"rgba(155,0,32,.6)", letterSpacing:".14em", textTransform:"uppercase" }}>What We Offer</span>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"22px", fontWeight:700, color:"#111", marginTop:"2px" }}>Our Services</h2>
            <div className="banner-title-underline" style={{ height:"2px", background:BURG, borderRadius:"2px", marginTop:"4px" }} />
          </div>
          <p style={{ fontSize:"13px", color:"#888", maxWidth:"400px", lineHeight:1.6, position:"relative", zIndex:1 }}>
            Everything a seller needs to build, grow, and scale — under one roof.
          </p>
        </div>

        {/* Services — infinite right-to-left moving track */}
        <div style={{ padding:"32px 0 60px", overflow:"hidden" }}>
          <div className="srv-track">
            {[...SERVICES, ...SERVICES].map((s, i) => (
              <div
                key={`${s.title}-${i}`}
                className="srv"
                onClick={() => setActive(active===i?null:i)}
                style={{
                  padding:"22px 20px",
                  borderRadius:"14px",
                  border:"1.5px solid #f0f0f0",
                  background:"#fff",
                  cursor:"pointer",
                  transition:"border-color .2s ease, box-shadow .2s ease",
                }}
              >
                <div className="srv-icon" style={{ width:"44px", height:"44px", borderRadius:"12px", background:`rgba(155,0,32,.07)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", marginBottom:"12px" }}>{s.icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:600, color:"#111", marginBottom:"6px" }}>{s.title}</h3>
                <p style={{ fontSize:"12px", color:"#888", lineHeight:1.65, marginBottom:"4px" }}>{s.shortDesc}</p>
                <div className="srv-underline" />
                {active === i && (
                  <div style={{ animation:"fadeIn .25s ease", marginTop:"10px" }}>
                    <p style={{ fontSize:"12px", color:"#555", lineHeight:1.7, marginBottom:"12px", paddingTop:"10px", borderTop:"1px solid #f5f5f5" }}>{s.fullDesc}</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:"5px", marginBottom:"10px" }}>
                      {s.features.map((f, fi) => (
                        <div key={f} style={{ display:"flex", alignItems:"center", gap:"7px", animation:`fadeIn .3s ease ${fi*0.04}s both` }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BURG} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          <span style={{ fontSize:"11px", color:"#444" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize:"10px", color:BURG, fontWeight:700, padding:"5px 10px", borderRadius:"6px", background:`rgba(155,0,32,.06)`, display:"inline-block" }}>
                      Ideal for: {s.ideal}
                    </div>
                  </div>
                )}
                <div className="srv-cta" style={{ marginTop:"10px", fontSize:"11px", fontWeight:600, color:active===i?BURG:"#ccc" }}>
                  {active===i ? "Show less ▲" : "Learn more ▾"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
