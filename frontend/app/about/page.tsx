"use client";

import Link from "next/link";

const timeline = [
  { year: "2008", title: "Founded in Lucknow",         desc: "Started as a small antique shop in Hazratganj, Lucknow by the Baranwal family." },
  { year: "2012", title: "First Exhibition",            desc: "Participated in the National Crafts Mela, Delhi — won recognition for authentic Mughal-era pieces." },
  { year: "2016", title: "Digital Expansion",           desc: "Launched our first online catalogue, connecting with buyers across India and internationally." },
  { year: "2019", title: "Seller Network Launch",       desc: "Opened the platform to verified sellers across India, building a community of 200+ antique dealers." },
  { year: "2022", title: "Training Programme",          desc: "Launched the Sanskriti Training Academy — professional education for antique sellers." },
  { year: "2024", title: "1,200+ Sellers Strong",       desc: "Grew to over 1,200 verified sellers with ₹50Cr+ in annual transactions through the platform." },
];

const team = [
  { name: "Vikas Arya",   role: "Founder & CEO",          initials: "VA", bio: "Third-generation antique dealer with 20+ years in the Indian heritage market." },
  { name: "Rajesh Kumar",      role: "Head of Authentication",  initials: "RK", bio: "Certified gemologist and antique appraiser with expertise in brass, bronze, and silver." },
  { name: "Priya Sharma",      role: "Business Development",   initials: "PS", bio: "MBA with specialisation in luxury goods and heritage market strategy." },
  { name: "Arjun Nair",        role: "Digital & Marketing",    initials: "AN", bio: "Digital marketing expert helping antique sellers build strong online presence." },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#FBF7F0", minHeight: "100vh", paddingTop: "72px" }}>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(160deg, #1A0F0A 0%, #2C1810 50%, #3D2B1F 100%)", padding: "72px 0 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <Link href="/" style={{ fontSize: "13px", color: "rgba(201,168,76,.6)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(201,168,76,.3)" }}>›</span>
            <span style={{ fontSize: "13px", color: "rgba(201,168,76,.9)" }}>About Us</span>
          </div>
          <div style={{ maxWidth: "680px" }}>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontFamily: "Georgia, serif", color: "#F5E6C8", lineHeight: "1.1", marginBottom: "20px", fontWeight: "400" }}>
              Preserving India's Heritage,<br />
              <span style={{ background: "linear-gradient(135deg, #C9A84C, #E8C86A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>One Piece at a Time</span>
            </h1>
            <p style={{ fontSize: "17px", color: "rgba(245,230,200,.62)", lineHeight: "1.75" }}>
              Sanskriti The Antique is India's most trusted marketplace for authentic antiques — connecting passionate sellers with discerning collectors since 2008.
            </p>
          </div>
        </div>
      </div>

      {/* ── STORY ── */}
      <section style={{ padding: "80px 0", background: "#FFFDF9" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".18em", textTransform: "uppercase", color: "#A08060", display: "block", marginBottom: "10px" }}>Our story</span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "20px" }}>A Legacy of Authenticity</h2>
              <div style={{ width: "52px", height: "2px", background: "linear-gradient(90deg, #C9A84C, #8B6914)", borderRadius: "1px", marginBottom: "24px" }} />
              <p style={{ fontSize: "15px", color: "#6B4F12", lineHeight: "1.85", marginBottom: "16px" }}>
                What began as a small family antique shop in the lanes of Hazratganj, Lucknow has grown into India's largest verified antique marketplace. Founded by Ananya Baranwal in 2008, Sanskriti The Antique was built on a simple belief — that every authentic antique deserves to find the right home.
              </p>
              <p style={{ fontSize: "15px", color: "#A08060", lineHeight: "1.85", marginBottom: "24px" }}>
                Today, we connect over 1,200 verified sellers with thousands of collectors, interior designers, and heritage enthusiasts across India and internationally. Every piece on our platform has been assessed for authenticity, ensuring buyers can trust what they purchase.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { value: "1,200+", label: "Verified Sellers" },
                  { value: "5,000+", label: "Authentic Pieces" },
                  { value: "15+",    label: "Years in Business" },
                  { value: "98%",    label: "Authenticity Rate" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#FBF7F0", borderRadius: "12px", padding: "16px", border: "1px solid #E8D5A3" }}>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#C9A84C", fontFamily: "Georgia, serif" }}>{s.value}</div>
                    <div style={{ fontSize: "12px", color: "#A08060", marginTop: "3px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #2C1810, #3D2B1F)", borderRadius: "20px", padding: "48px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.05) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
              <div style={{ position: "relative", textAlign: "center" }}>
                <div style={{ fontSize: "80px", marginBottom: "24px" }}>🏺</div>
                <blockquote style={{ fontSize: "18px", fontFamily: "Georgia, serif", color: "#F5E6C8", lineHeight: "1.65", fontStyle: "italic", marginBottom: "20px" }}>
                  "Every antique carries the soul of its era. Our mission is to ensure these pieces of history find homes where they will be cherished for generations."
                </blockquote>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#C9A84C" }}>— Ananya Baranwal</div>
                <div style={{ fontSize: "12px", color: "rgba(201,168,76,.55)", marginTop: "3px" }}>Founder & CEO</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ padding: "80px 0", background: "#FBF7F0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".18em", textTransform: "uppercase", color: "#A08060", display: "block", marginBottom: "10px" }}>Our journey</span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontFamily: "Georgia, serif", color: "#2C1810" }}>15 Years of Heritage</h2>
            <div style={{ width: "52px", height: "2px", background: "linear-gradient(90deg, #C9A84C, #8B6914)", borderRadius: "1px", margin: "16px auto 0" }} />
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "71px", top: "0", bottom: "0", width: "1px", background: "linear-gradient(180deg, transparent, #E8D5A3 10%, #E8D5A3 90%, transparent)" }} />
            {timeline.map((t, i) => (
              <div key={t.year} style={{ display: "flex", gap: "24px", marginBottom: "36px", position: "relative" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 16px rgba(139,105,20,.3)", zIndex: 1 }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#3D2B1F", fontFamily: "Georgia, serif" }}>{t.year}</span>
                </div>
                <div style={{ paddingTop: "16px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#2C1810", marginBottom: "6px", fontFamily: "Georgia, serif" }}>{t.title}</h3>
                  <p style={{ fontSize: "14px", color: "#A08060", lineHeight: "1.65" }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ padding: "80px 0", background: "#FFFDF9" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".18em", textTransform: "uppercase", color: "#A08060", display: "block", marginBottom: "10px" }}>The people behind it</span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontFamily: "Georgia, serif", color: "#2C1810" }}>Our Team</h2>
            <div style={{ width: "52px", height: "2px", background: "linear-gradient(90deg, #C9A84C, #8B6914)", borderRadius: "1px", margin: "16px auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {team.map((m) => (
              <div key={m.name} style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "16px", padding: "28px 24px", textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#3D2B1F", fontSize: "18px", fontWeight: "700" }}>{m.initials}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#2C1810", marginBottom: "4px", fontFamily: "Georgia, serif" }}>{m.name}</h3>
                <div style={{ fontSize: "12px", color: "#C9A84C", fontWeight: "600", marginBottom: "10px", letterSpacing: ".03em" }}>{m.role}</div>
                <p style={{ fontSize: "13px", color: "#A08060", lineHeight: "1.65" }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION + VALUES ── */}
      <section style={{ padding: "80px 0", background: "linear-gradient(160deg, #1A0F0A, #2C1810, #3D2B1F)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.03) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(201,168,76,.6)", display: "block", marginBottom: "10px" }}>What drives us</span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontFamily: "Georgia, serif", color: "#F5E6C8" }}>Our Mission & Values</h2>
            <div style={{ width: "52px", height: "2px", background: "linear-gradient(90deg, #C9A84C, #8B6914)", borderRadius: "1px", margin: "16px auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {[
              { icon: "🔍", title: "Authenticity First",  desc: "Every piece is assessed. We never compromise on the integrity of what we list." },
              { icon: "🌱", title: "Heritage Preservation",desc: "We believe India's cultural history deserves to be preserved and celebrated." },
              { icon: "🤝", title: "Seller Success",       desc: "Our sellers' growth is our growth. We invest deeply in their education and tools." },
              { icon: "🌍", title: "Global Reach",         desc: "Connecting Indian heritage with collectors and enthusiasts around the world." },
            ].map((v) => (
              <div key={v.title} style={{ background: "rgba(201,168,76,.05)", border: "1px solid rgba(201,168,76,.12)", borderRadius: "16px", padding: "28px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "14px" }}>{v.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#F5E6C8", marginBottom: "8px", fontFamily: "Georgia, serif" }}>{v.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(245,230,200,.6)", lineHeight: "1.65" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px", background: "#FFFDF9", textAlign: "center" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "14px" }}>Join Our Community</h2>
          <div style={{ width: "52px", height: "2px", background: "linear-gradient(90deg, #C9A84C, #8B6914)", borderRadius: "1px", margin: "0 auto 20px" }} />
          <p style={{ fontSize: "15px", color: "#A08060", lineHeight: "1.75", marginBottom: "32px" }}>
            Be part of India's most trusted antique marketplace. Register as a seller today.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-gold btn-lg">Register as Seller →</Link>
            <Link href="/contact" className="btn btn-outline-gold btn-lg">Talk to Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
