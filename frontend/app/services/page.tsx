"use client";
import { useState } from "react";
import Link from "next/link";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const SERVICES = [
  {
    icon: "📢", title: "Marketing & Promotion",
    shortDesc: "Digital and offline marketing to grow your antique business.",
    fullDesc: "We design comprehensive marketing campaigns tailored for antique businesses — from social media and SEO to exhibitions and influencer collaborations.",
    features: ["Social media management", "SEO & Google Ads", "Exhibition participation", "Email marketing", "Influencer collaborations", "Print & offline media"],
    ideal: "Sellers wanting to expand their customer base",
  },
  {
    icon: "🏷️", title: "Brand Building",
    shortDesc: "Complete branding solutions for your antique dealership.",
    fullDesc: "A strong brand sets you apart. We create complete visual identities including logo, brand guidelines, packaging, and your unique brand story.",
    features: ["Logo & visual identity", "Brand guidelines", "Packaging design", "Business cards & stationery", "Brand story writing", "Website branding"],
    ideal: "New sellers and rebranding businesses",
  },
  {
    icon: "💼", title: "Business Consultancy",
    shortDesc: "Expert guidance on launching and scaling your antique business.",
    fullDesc: "Our consultants have decades of experience in the Indian antique trade — guiding you through pricing, supplier relations, legal compliance and growth.",
    features: ["Business structure advice", "Pricing strategy", "Supplier sourcing", "GST & legal compliance", "Growth planning", "P&L optimisation"],
    ideal: "New entrants and scaling businesses",
  },
  {
    icon: "🏭", title: "Manufacturing Setup",
    shortDesc: "End-to-end support for setting up manufacturing units.",
    fullDesc: "From location selection and machinery procurement to workforce training and quality control — we set up your complete manufacturing infrastructure.",
    features: ["Infrastructure planning", "Machinery sourcing", "Workforce training", "Quality control systems", "Compliance & licensing", "Cost optimisation"],
    ideal: "Sellers looking to add manufacturing",
  },
  {
    icon: "🎓", title: "Training & Education",
    shortDesc: "Professional training on antique identification and trading.",
    fullDesc: "Structured training covering authentication, market dynamics, negotiation, and digital selling — for beginners and experienced dealers alike.",
    features: ["Video training library", "Live online workshops", "Authentication techniques", "Market valuation", "Digital selling skills", "Completion certificate"],
    ideal: "All sellers at every experience level",
  },
  {
    icon: "🔗", title: "Network & Distribution",
    shortDesc: "Connect with verified buyers, sellers, and exporters.",
    fullDesc: "Join our curated network of antique dealers, collectors, and exporters. Get introductions to serious buyers and distribution partnerships across India.",
    features: ["Verified buyer introductions", "Exporter connections", "Collector database access", "Trade fair invitations", "Partnership facilitation", "International network"],
    ideal: "Sellers ready to scale distribution",
  },
];

// Flow diagram steps
const FLOW_STEPS = [
  { step: 1, title: "Enroll", desc: "Register on Sanskriti platform", position: "top-left" },
  { step: 2, title: "Account Setup", desc: "Our team sets up your seller profile", position: "top-center" },
  { step: 3, title: "Product Listing", desc: "We list your products across channels", position: "top-right" },
  { step: 4, title: "Order Received", desc: "You receive orders — keep the margin", position: "bottom-right" },
  { step: 5, title: "We Fulfill", desc: "Sanskriti handles packaging & dispatch", position: "bottom-center" },
  { step: 6, title: "You Earn", desc: "Profit credited to your wallet", position: "bottom-left" },
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState<number | null>(null);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", paddingTop:"68px" }}>
      <style>{`
        ${GF}
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .srv-card:hover{border-color:${BURG}!important;transform:translateY(-3px)!important;box-shadow:0 12px 32px rgba(155,0,32,.1)!important}
      `}</style>

      {/* ── FLOW DIAGRAM HERO ─────────────────────────────────── */}
      <section style={{ background:"#fff", padding:"60px 48px 72px", borderBottom:"1px solid #f0f0f0" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>

          {/* Heading */}
          <div style={{ textAlign:"center", marginBottom:"52px" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"5px 16px", borderRadius:"99px", border:`1px solid rgba(155,0,32,.2)`, background:`rgba(155,0,32,.04)`, marginBottom:"16px" }}>
              <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:BURG, animation:"pulse 2s infinite", display:"inline-block" }} />
              <span style={{ fontSize:"11px", fontWeight:600, color:BURG, letterSpacing:".14em", textTransform:"uppercase" }}>How It Works</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,5vw,56px)", fontWeight:700, color:"#111", lineHeight:1.05, marginBottom:"14px" }}>
              Grow Your Business
              <span style={{ display:"block", fontStyle:"italic", fontWeight:400, color:BURG }}>With Sanskriti</span>
            </h1>
            <p style={{ fontSize:"15px", color:"#666", maxWidth:"520px", margin:"0 auto", lineHeight:1.8 }}>
              A simple 6-step journey from enrollment to earning — fully managed by our team. No manpower, no warehouse, no inventory needed.
            </p>
          </div>

          {/* Flow diagram */}
          <div style={{ position:"relative" }}>
            {/* Top row — steps 1, 2, 3 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr auto 1fr", alignItems:"center", marginBottom:"0" }}>
              {[FLOW_STEPS[0], FLOW_STEPS[1], FLOW_STEPS[2]].map((s, i) => (
                <>
                  <div key={s.step} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
                    <div style={{ width:"56px", height:"56px", borderRadius:"50%", background:BURG, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", fontWeight:700, fontFamily:"'Playfair Display',serif", marginBottom:"10px", boxShadow:`0 4px 16px rgba(155,0,32,.3)` }}>{s.step}</div>
                    <div style={{ fontSize:"14px", fontWeight:700, color:"#111", marginBottom:"4px" }}>{s.title}</div>
                    <div style={{ fontSize:"12px", color:"#888", lineHeight:1.5, maxWidth:"120px" }}>{s.desc}</div>
                  </div>
                  {i < 2 && (
                    <div key={`arrow-${i}`} style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"0 8px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                        <div style={{ width:"40px", height:"2px", background:`rgba(155,0,32,.3)`, borderRadius:"1px" }} />
                        <div style={{ width:"0", height:"0", borderTop:"6px solid transparent", borderBottom:"6px solid transparent", borderLeft:`8px solid rgba(155,0,32,.5)` }} />
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>

            {/* Vertical connectors */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr auto 1fr", padding:"16px 0" }}>
              <div />
              <div />
              <div />
              <div />
              {/* Right side down arrow */}
              <div style={{ display:"flex", justifyContent:"center" }}>
                <div style={{ width:"2px", height:"48px", background:`rgba(155,0,32,.3)`, position:"relative" }}>
                  <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:"0", height:"0", borderLeft:"6px solid transparent", borderRight:"6px solid transparent", borderTop:`8px solid rgba(155,0,32,.5)` }} />
                </div>
              </div>
            </div>

            {/* Bottom row — steps 6, 5, 4 (reversed direction) */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr auto 1fr", alignItems:"center" }}>
              {[FLOW_STEPS[5], FLOW_STEPS[4], FLOW_STEPS[3]].map((s, i) => (
                <>
                  <div key={s.step} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
                    <div style={{ width:"56px", height:"56px", borderRadius:"50%", background:i===0?"#fff":BURG, color:i===0?BURG:"#fff", border:i===0?`2px solid ${BURG}`:"none", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", fontWeight:700, fontFamily:"'Playfair Display',serif", marginBottom:"10px", boxShadow:i===0?`0 4px 16px rgba(155,0,32,.15)`:`0 4px 16px rgba(155,0,32,.3)` }}>{s.step}</div>
                    <div style={{ fontSize:"14px", fontWeight:700, color:"#111", marginBottom:"4px" }}>{s.title}</div>
                    <div style={{ fontSize:"12px", color:"#888", lineHeight:1.5, maxWidth:"120px" }}>{s.desc}</div>
                  </div>
                  {i < 2 && (
                    <div key={`arrow-b-${i}`} style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"0 8px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                        <div style={{ width:"0", height:"0", borderTop:"6px solid transparent", borderBottom:"6px solid transparent", borderRight:`8px solid rgba(155,0,32,.5)` }} />
                        <div style={{ width:"40px", height:"2px", background:`rgba(155,0,32,.3)`, borderRadius:"1px" }} />
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>

            {/* Left side up arrow */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr auto 1fr", padding:"16px 0 0" }}>
              <div style={{ display:"flex", justifyContent:"center" }}>
                <div style={{ width:"2px", height:"0px" }} />
              </div>
            </div>
          </div>

          {/* No inventory needed chips */}
          <div style={{ display:"flex", justifyContent:"center", gap:"12px", marginTop:"40px", flexWrap:"wrap" }}>
            {["❌ No Manpower Needed", "❌ No Warehouse Needed", "❌ No Inventory Needed", "✅ Just Enroll & Earn"].map(label => (
              <div key={label} style={{ padding:"7px 16px", borderRadius:"99px", background: label.startsWith("✅") ? `rgba(155,0,32,.08)` : "#f9f9f9", border:`1px solid ${label.startsWith("✅") ? `rgba(155,0,32,.2)` : "#f0f0f0"}`, fontSize:"13px", fontWeight:500, color: label.startsWith("✅") ? BURG : "#666" }}>
                {label}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign:"center", marginTop:"36px" }}>
            <Link href="/register" style={{ display:"inline-block", padding:"14px 40px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none", boxShadow:`0 6px 20px rgba(155,0,32,.3)` }}>
              Start Your Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ─────────────────────────────────────── */}
      <section style={{ padding:"80px 48px", background:"#f9f9f9" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"48px" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"5px 16px", borderRadius:"99px", border:`1px solid rgba(155,0,32,.2)`, background:`rgba(155,0,32,.04)`, marginBottom:"14px" }}>
              <span style={{ fontSize:"11px", fontWeight:600, color:BURG, letterSpacing:".14em", textTransform:"uppercase" }}>What We Offer</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, color:"#111", marginBottom:"12px" }}>
              Our Services
            </h2>
            <p style={{ fontSize:"15px", color:"#666", maxWidth:"480px", margin:"0 auto", lineHeight:1.8 }}>
              Everything a seller needs to build, grow, and scale an antique business — under one roof.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"16px" }}>
            {SERVICES.map((s, i) => (
              <div key={s.title} className="srv-card"
                onClick={() => setActiveService(activeService === i ? null : i)}
                style={{ padding:"28px 24px", borderRadius:"16px", border:"1.5px solid #f0f0f0", background:"#fff", cursor:"pointer", transition:"all .25s" }}
              >
                <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:`rgba(155,0,32,.07)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", marginBottom:"16px" }}>{s.icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", fontWeight:600, color:"#111", marginBottom:"8px" }}>{s.title}</h3>
                <p style={{ fontSize:"13px", color:"#888", lineHeight:1.7, marginBottom:"14px" }}>{s.shortDesc}</p>

                {activeService === i && (
                  <div style={{ animation:"fadeIn .2s ease" }}>
                    <p style={{ fontSize:"13px", color:"#555", lineHeight:1.75, marginBottom:"14px", paddingTop:"10px", borderTop:"1px solid #f0f0f0" }}>{s.fullDesc}</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginBottom:"14px" }}>
                      {s.features.map(f => (
                        <div key={f} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={BURG} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          <span style={{ fontSize:"12px", color:"#444" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize:"11px", color:BURG, fontWeight:600, padding:"6px 12px", borderRadius:"8px", background:`rgba(155,0,32,.06)` }}>
                      Ideal for: {s.ideal}
                    </div>
                  </div>
                )}

                <div style={{ marginTop:"12px", fontSize:"12px", fontWeight:600, color:activeService===i?BURG:"#aaa" }}>
                  {activeService === i ? "Show less ▲" : "Learn more ▼"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────── */}
      <section style={{ padding:"80px 48px", background:"#fff" }}>
        <div style={{ maxWidth:"700px", margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, color:"#111", marginBottom:"14px" }}>
            Ready to grow your
            <span style={{ display:"block", fontStyle:"italic", color:BURG, fontWeight:400 }}>antique business?</span>
          </h2>
          <p style={{ fontSize:"15px", color:"#666", lineHeight:1.85, marginBottom:"32px" }}>
            Join 5,000+ sellers who have built real businesses with Sanskriti. Start for free — no inventory, no warehouse, no manpower required.
          </p>
          <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/register" style={{ padding:"14px 36px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none", boxShadow:`0 6px 20px rgba(155,0,32,.28)` }}>
              Register as Seller →
            </Link>
            <Link href="/login" style={{ padding:"14px 36px", borderRadius:"8px", border:"1.5px solid #e5e5e5", color:"#333", fontSize:"14px", fontWeight:500, textDecoration:"none" }}>
              Already a Seller? Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
