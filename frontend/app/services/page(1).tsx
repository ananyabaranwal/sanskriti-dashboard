"use client";

import { useState } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/constants";

const detailedServices = [
  {
    icon: "📢",
    title: "Marketing & Promotion",
    shortDesc: "Digital and offline marketing strategies to grow your antique business.",
    fullDesc: "We design and execute comprehensive marketing campaigns tailored specifically for antique businesses. From social media management and SEO to print media and exhibition participation, we help you reach serious collectors, interior designers, and heritage enthusiasts across India and internationally.",
    features: ["Social media management", "SEO & Google Ads", "Exhibition participation", "Email marketing", "Influencer collaborations", "Print & offline media"],
    ideal: "Sellers wanting to expand their customer base",
    color: "#C9A84C",
  },
  {
    icon: "🏷️",
    title: "Brand Building",
    shortDesc: "Complete branding solutions for your antique dealership.",
    fullDesc: "A strong brand identity sets you apart in the crowded antique market. We create complete visual identities including logo design, brand guidelines, packaging, and your unique brand story. We help position your business as a trusted, premium antique source that buyers return to.",
    features: ["Logo & visual identity", "Brand guidelines", "Packaging design", "Business cards & stationery", "Brand story writing", "Website branding"],
    ideal: "New sellers and rebranding businesses",
    color: "#8B6914",
  },
  {
    icon: "💼",
    title: "Business Consultancy",
    shortDesc: "Expert guidance on launching and scaling your antique business.",
    fullDesc: "Our experienced consultants have decades of combined experience in the Indian antique trade. We guide you through business structure, pricing strategies, supplier relationships, legal compliance, and growth planning. Get personalised advice that transforms your passion into a profitable business.",
    features: ["Business structure advice", "Pricing strategy", "Supplier sourcing", "Legal compliance (GST, etc.)", "Growth planning", "P&L optimisation"],
    ideal: "New entrants and scaling businesses",
    color: "#6B4F0A",
  },
  {
    icon: "🏭",
    title: "Manufacturing Setup",
    shortDesc: "End-to-end support for setting up manufacturing units.",
    fullDesc: "Whether you want to produce high-quality reproductions, restoration workshops, or craft complementary products, we help you set up the right manufacturing infrastructure. From location selection and machinery procurement to workforce training and quality control systems.",
    features: ["Location & infrastructure planning", "Machinery & equipment sourcing", "Workforce recruitment & training", "Quality control systems", "Compliance & licensing", "Production cost optimisation"],
    ideal: "Sellers looking to add manufacturing",
    color: "#5C3A1E",
  },
  {
    icon: "🎓",
    title: "Training & Education",
    shortDesc: "Professional training on antique identification and trading.",
    fullDesc: "Knowledge is your most valuable asset in the antique business. We provide structured training programmes covering authentication techniques, market dynamics, negotiation skills, and digital selling. Our training videos library and live workshops are designed for both beginners and experienced dealers.",
    features: ["Video training library access", "Live online workshops", "Authentication techniques", "Market valuation training", "Digital selling skills", "Certification on completion"],
    ideal: "All sellers at every experience level",
    color: "#3D2B1F",
  },
  {
    icon: "🔗",
    title: "Network & Distribution",
    shortDesc: "Connect with verified buyers, sellers, and exporters.",
    fullDesc: "Access our curated network of serious antique collectors, export buyers, interior decorators, auction houses, and museum procurement departments. We facilitate introductions, manage negotiations, and help you build lasting business relationships that generate consistent revenue.",
    features: ["Buyer introductions", "Export connections", "Auction house tie-ups", "Interior designer network", "Museum procurement links", "Regular buyer-seller meetups"],
    ideal: "Sellers seeking reliable distribution",
    color: "#2C1810",
  },
];

function ServiceCard({ s, onSelect }: { s: typeof detailedServices[0]; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      style={{
        background: "#FFFDF9",
        border: `1px solid ${hovered ? "rgba(201,168,76,.5)" : "#E8D5A3"}`,
        borderRadius: "16px",
        padding: "32px 28px",
        cursor: "pointer",
        transition: "all .25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(61,43,31,.12)" : "0 2px 8px rgba(61,43,31,.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "0", right: "0", width: "80px", height: "80px", background: "linear-gradient(225deg, rgba(201,168,76,.06), transparent)", borderRadius: "0 16px 0 80px" }} />
      <div style={{ fontSize: "36px", marginBottom: "16px" }}>{s.icon}</div>
      <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#2C1810", marginBottom: "10px", fontFamily: "Georgia, serif" }}>{s.title}</h3>
      <p style={{ fontSize: "14px", color: "#A08060", lineHeight: "1.7", marginBottom: "16px" }}>{s.shortDesc}</p>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#8B6914", fontSize: "13px", fontWeight: "600" }}>
        Learn more <span style={{ transition: "transform .2s", transform: hovered ? "translateX(4px)" : "none", display: "inline-block" }}>→</span>
      </div>
    </div>
  );
}

function ServiceModal({ s, onClose }: { s: typeof detailedServices[0]; onClose: () => void }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(44,24,16,.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px", backdropFilter: "blur(6px)" }}
    >
      <div style={{ background: "#FFFDF9", borderRadius: "20px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(44,24,16,.4)", animation: "scaleIn .3s ease" }}>
        <div style={{ padding: "32px 32px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div style={{ fontSize: "48px" }}>{s.icon}</div>
            <button onClick={onClose} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#F5E6C8", border: "none", color: "#6B4F12", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
          </div>
          <h2 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "12px", fontWeight: "400" }}>{s.title}</h2>
          <p style={{ fontSize: "15px", color: "#A08060", lineHeight: "1.75", marginBottom: "24px" }}>{s.fullDesc}</p>
          <div style={{ borderTop: "1px solid #E8D5A3", paddingTop: "20px", marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#6B4F12", marginBottom: "12px", letterSpacing: ".04em", textTransform: "uppercase" }}>What's included</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {s.features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#2C1810" }}>
                  <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "9px", color: "#3D2B1F", fontWeight: "700" }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "#FBF7F0", borderRadius: "10px", padding: "14px 16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>🎯</span>
            <div><span style={{ fontSize: "12px", color: "#A08060" }}>Ideal for: </span><span style={{ fontSize: "13px", fontWeight: "600", color: "#6B4F12" }}>{s.ideal}</span></div>
          </div>
        </div>
        <div style={{ padding: "0 32px 32px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/contact" style={{ flex: 1, padding: "13px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#3D2B1F", fontSize: "14px", fontWeight: "700", textDecoration: "none", textAlign: "center", letterSpacing: ".02em" }}>
            Get Started →
          </Link>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", borderRadius: "8px", border: "1.5px solid #E8D5A3", color: "#6B4F12", fontSize: "14px", fontWeight: "600", cursor: "pointer", background: "transparent", fontFamily: "inherit" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<typeof detailedServices[0] | null>(null);

  return (
    <div style={{ background: "#FBF7F0", minHeight: "100vh", paddingTop: "72px" }}>
      {selectedService && <ServiceModal s={selectedService} onClose={() => setSelectedService(null)} />}

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(160deg, #1A0F0A 0%, #2C1810 50%, #3D2B1F 100%)", padding: "72px 0 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <Link href="/" style={{ fontSize: "13px", color: "rgba(201,168,76,.6)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(201,168,76,.3)" }}>›</span>
            <span style={{ fontSize: "13px", color: "rgba(201,168,76,.9)" }}>Services</span>
          </div>
          <div style={{ maxWidth: "640px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "99px", background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.22)", marginBottom: "24px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C9A84C", display: "block" }} />
              <span style={{ fontSize: "11px", color: "#C9A84C", letterSpacing: ".12em", fontWeight: "600" }}>PREMIUM SERVICES</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontFamily: "Georgia, serif", color: "#F5E6C8", lineHeight: "1.1", marginBottom: "20px", fontWeight: "400" }}>
              Grow Your Antique<br />
              <span style={{ background: "linear-gradient(135deg, #C9A84C, #E8C86A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Business With Us</span>
            </h1>
            <p style={{ fontSize: "17px", color: "rgba(245,230,200,.62)", lineHeight: "1.75", marginBottom: "36px" }}>
              From marketing and branding to manufacturing setup — comprehensive services designed specifically for the Indian antique trade.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-gold btn-lg">Get Started Today →</Link>
              <Link href="/register" className="btn btn-outline-gold btn-lg">Become a Seller</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── SERVICES GRID ── */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".18em", textTransform: "uppercase", color: "#A08060", display: "block", marginBottom: "10px" }}>What we offer</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontFamily: "Georgia, serif", color: "#2C1810" }}>Our Services</h2>
            <div style={{ width: "52px", height: "2px", background: "linear-gradient(90deg, #C9A84C, #8B6914)", borderRadius: "1px", margin: "16px auto 0" }} />
            <p style={{ fontSize: "15px", color: "#A08060", marginTop: "16px", maxWidth: "520px", margin: "16px auto 0", lineHeight: "1.7" }}>
              Click any service to learn more and get started
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {detailedServices.map((s) => (
              <ServiceCard key={s.title} s={s} onSelect={() => setSelectedService(s)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section style={{ padding: "80px 0", background: "#FFFDF9" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".18em", textTransform: "uppercase", color: "#A08060", display: "block", marginBottom: "10px" }}>Why Sanskriti</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontFamily: "Georgia, serif", color: "#2C1810" }}>Why Choose Us</h2>
            <div style={{ width: "52px", height: "2px", background: "linear-gradient(90deg, #C9A84C, #8B6914)", borderRadius: "1px", margin: "16px auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
            {[
              { icon: "🏆", title: "15+ Years Experience", desc: "Deep expertise in the Indian antique market with a proven track record of growing businesses." },
              { icon: "🤝", title: "Dedicated Support",    desc: "Personal account manager for every client. We're with you at every step of your journey." },
              { icon: "📊", title: "Measurable Results",  desc: "We set clear KPIs and report regularly. Your growth is our success metric." },
              { icon: "🇮🇳", title: "India-Focused",      desc: "Specialists in Indian antiques — not a generic consultancy. We know this market deeply." },
            ].map((w) => (
              <div key={w.title} style={{ textAlign: "center", padding: "28px 20px", background: "#FFFDF9", borderRadius: "16px", border: "1px solid #E8D5A3" }}>
                <div style={{ fontSize: "36px", marginBottom: "14px" }}>{w.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#2C1810", marginBottom: "8px", fontFamily: "Georgia, serif" }}>{w.title}</h3>
                <p style={{ fontSize: "13px", color: "#A08060", lineHeight: "1.65" }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, #C9A84C 0%, #E8C86A 40%, #8B6914 100%)", textAlign: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "14px", fontWeight: "400" }}>Ready to Transform Your Business?</h2>
          <p style={{ fontSize: "16px", color: "rgba(44,24,16,.65)", marginBottom: "32px", lineHeight: "1.7" }}>Let's have a conversation about how we can help you grow.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ padding: "14px 32px", borderRadius: "8px", background: "#2C1810", color: "#F5E6C8", fontSize: "15px", fontWeight: "700", textDecoration: "none", letterSpacing: ".02em", display: "inline-flex", alignItems: "center" }}>Contact Us →</Link>
            <Link href="/register" style={{ padding: "14px 32px", borderRadius: "8px", border: "2px solid rgba(44,24,16,.3)", color: "#2C1810", fontSize: "15px", fontWeight: "600", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Register as Seller</Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scaleIn { from { opacity:0; transform:scale(.93); } to { opacity:1; transform:scale(1); } }
      `}</style>
    </div>
  );
}
