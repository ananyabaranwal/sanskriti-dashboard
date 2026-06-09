"use client";
import Link from "next/link";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

export default function TrainingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#fff", minHeight: "100vh", paddingTop: "68px" }}>
      <style>{`${GF}*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {/* Hero */}
      <section style={{ background: BURG, padding: "80px 48px 72px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 16px", borderRadius: "99px", border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.08)", marginBottom: "20px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,.9)", letterSpacing: ".14em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Sanskriti Training</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: "16px" }}>
            Learn. Grow.<br /><span style={{ fontStyle: "italic", fontWeight: 400 }}>Scale Your Business.</span>
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,.75)", lineHeight: 1.8, marginBottom: "36px", fontFamily: "'DM Sans',sans-serif" }}>
            From ebooks to expert video training — everything you need to build a successful antique business on Amazon, your own website, and beyond.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/training/videos" style={{ padding: "13px 32px", borderRadius: "8px", background: "#fff", color: BURG, fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
              Browse Videos →
            </Link>
            <Link href="/training/ebook" style={{ padding: "13px 32px", borderRadius: "8px", border: "1.5px solid rgba(255,255,255,.4)", color: "#fff", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
              Download Ebooks
            </Link>
          </div>
        </div>
      </section>

      {/* Two main categories */}
      <section style={{ padding: "80px 48px", background: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#111", marginBottom: "12px" }}>
              Choose Your Learning Path
            </h2>
            <p style={{ fontSize: "15px", color: "#777", fontFamily: "'DM Sans',sans-serif" }}>Two formats, one goal — turning you into a successful seller</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "24px" }}>

            {/* Ebook card */}
            <Link href="/training/ebook" style={{ textDecoration: "none" }}>
              <div style={{ borderRadius: "20px", border: `2px solid rgba(155,0,32,.12)`, padding: "40px 36px", background: "#fff", transition: "all .3s", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 48px rgba(155,0,32,.1)`; (e.currentTarget as HTMLElement).style.borderColor = `rgba(155,0,32,.3)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = `rgba(155,0,32,.12)`; }}
              >
                <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: `rgba(155,0,32,.08)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", marginBottom: "20px" }}>📖</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "26px", fontWeight: 700, color: "#111", marginBottom: "10px" }}>Ebook</h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.75, marginBottom: "24px", fontFamily: "'DM Sans',sans-serif" }}>
                  Download our comprehensive seller guides covering antique identification, pricing strategies, GST compliance, and platform-specific selling tactics.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
                  {["Antique Identification Guide", "GST for Sellers", "Amazon Seller Handbook", "Pricing Strategy"].map(t => (
                    <span key={t} style={{ padding: "4px 12px", borderRadius: "99px", background: `rgba(155,0,32,.06)`, border: `1px solid rgba(155,0,32,.15)`, fontSize: "11px", fontWeight: 600, color: BURG, fontFamily: "'DM Sans',sans-serif" }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: BURG, fontSize: "14px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
                  Download Ebooks <span>→</span>
                </div>
              </div>
            </Link>

            {/* Videos card */}
            <Link href="/training/videos" style={{ textDecoration: "none" }}>
              <div style={{ borderRadius: "20px", border: `2px solid ${BURG}`, padding: "40px 36px", background: BURG, transition: "all .3s", cursor: "pointer", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 48px rgba(155,0,32,.3)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
                <div style={{ position: "relative" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", marginBottom: "20px" }}>🎬</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>Videos</h3>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,.8)", lineHeight: 1.75, marginBottom: "24px", fontFamily: "'DM Sans',sans-serif" }}>
                    Expert-led video training for Website and Amazon sellers. 75-day structured programs, live sessions, and social media content creation.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
                    {[
                      { icon: "🌐", label: "Website", sub: "3 tracks" },
                      { icon: "📦", label: "Amazon",  sub: "3 tracks" },
                    ].map(p => (
                      <div key={p.label} style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)" }}>
                        <div style={{ fontSize: "18px", marginBottom: "4px" }}>{p.icon}</div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>{p.label}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,.6)", fontFamily: "'DM Sans',sans-serif" }}>{p.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fff", fontSize: "14px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
                    Explore Videos <span>→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Video tracks overview */}
      <section style={{ padding: "80px 48px", background: "#fafafa" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#111", marginBottom: "10px" }}>Video Training Tracks</h2>
            <p style={{ fontSize: "15px", color: "#777", fontFamily: "'DM Sans',sans-serif" }}>Structured programs for every type of seller</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px" }}>
            {[
              { icon: "📅", title: "75 Days Training", desc: "A complete day-by-day structured program. From zero to your first sale in 75 days.", color: "#fff3f4", border: "rgba(155,0,32,.15)" },
              { icon: "🔴", title: "Live Training", desc: "Interactive live sessions with experts. Ask questions, get real-time feedback.", color: "#fff3f4", border: "rgba(155,0,32,.15)" },
              { icon: "📱", title: "Social Media Content", desc: "Create scroll-stopping content for Instagram, YouTube, and Facebook.", color: "#fff3f4", border: "rgba(155,0,32,.15)" },
            ].map(t => (
              <div key={t.title} style={{ padding: "28px 24px", borderRadius: "16px", background: t.color, border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{t.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "18px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>{t.title}</h3>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif" }}>{t.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px" }}>
            {[
              { icon: "🌐", label: "Website Training", href: "/training/videos/website", desc: "Build and grow your own antique website" },
              { icon: "📦", label: "Amazon Training", href: "/training/videos/amazon", desc: "Master selling on Amazon marketplace" },
            ].map(p => (
              <Link key={p.href} href={p.href} style={{ textDecoration: "none" }}>
                <div style={{ padding: "24px", borderRadius: "14px", background: BURG, color: "#fff", display: "flex", alignItems: "center", gap: "16px", transition: "opacity .2s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = ".9"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                >
                  <span style={{ fontSize: "28px" }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{p.label}</div>
                    <div style={{ fontSize: "12px", opacity: .75, fontFamily: "'DM Sans',sans-serif", marginTop: "2px" }}>{p.desc}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: "18px" }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
