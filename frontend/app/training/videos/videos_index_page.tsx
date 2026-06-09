"use client";
import Link from "next/link";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const PLATFORMS = [
  {
    icon: "🌐",
    title: "Website Training",
    desc: "Build, launch and grow your own antique e-commerce website from scratch.",
    href: "/training/videos/website",
    tracks: [
      { icon: "📅", title: "75 Days Training",      href: "/training/videos/website/75-days",      desc: "Day-by-day structured program to launch your website" },
      { icon: "🔴", title: "Live Training",          href: "/training/videos/website/live",          desc: "Interactive live sessions with website experts" },
      { icon: "📱", title: "Social Media Content",   href: "/training/videos/website/social-media",  desc: "Content strategy for website traffic growth" },
    ],
  },
  {
    icon: "📦",
    title: "Amazon Training",
    desc: "Master Amazon marketplace — from account setup to becoming a top seller.",
    href: "/training/videos/amazon",
    tracks: [
      { icon: "📅", title: "75 Days Training",      href: "/training/videos/amazon/75-days",      desc: "Complete Amazon seller journey in 75 days" },
      { icon: "🔴", title: "Live Training",          href: "/training/videos/amazon/live",          desc: "Live Q&A and real-time coaching sessions" },
      { icon: "📱", title: "Social Media Content",   href: "/training/videos/amazon/social-media",  desc: "Build your brand presence for Amazon success" },
    ],
  },
];

export default function VideosIndexPage() {
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#fff", minHeight: "100vh", paddingTop: "68px" }}>
      <style>{`${GF}*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {/* Header */}
      <div style={{ background: BURG, padding: "60px 48px 52px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "16px" }}>
            <Link href="/training" style={{ fontSize: "13px", color: "rgba(255,255,255,.6)", textDecoration: "none" }}>Training</Link>
            <span style={{ color: "rgba(255,255,255,.3)", fontSize: "13px" }}>›</span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,.9)" }}>Videos</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: "12px" }}>
            Video Training Library
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,.75)", lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif" }}>
            Choose your platform and start learning. Each track is designed for a specific selling goal.
          </p>
        </div>
      </div>

      {/* Platform cards */}
      <section style={{ padding: "72px 48px", background: "#fff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
          {PLATFORMS.map(platform => (
            <div key={platform.title}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `rgba(155,0,32,.08)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>{platform.icon}</div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "24px", fontWeight: 700, color: "#111" }}>{platform.title}</h2>
                  <p style={{ fontSize: "13px", color: "#888", marginTop: "2px", fontFamily: "'DM Sans',sans-serif" }}>{platform.desc}</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "14px" }}>
                {platform.tracks.map(track => (
                  <Link key={track.href} href={track.href} style={{ textDecoration: "none" }}>
                    <div style={{ padding: "24px 22px", borderRadius: "14px", border: "1.5px solid rgba(155,0,32,.12)", background: "#fff", transition: "all .25s", cursor: "pointer" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = BURG; (e.currentTarget as HTMLElement).style.background = "#fff3f4"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px rgba(155,0,32,.1)`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(155,0,32,.12)"; (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                    >
                      <div style={{ fontSize: "24px", marginBottom: "12px" }}>{track.icon}</div>
                      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "17px", fontWeight: 600, color: "#111", marginBottom: "6px" }}>{track.title}</h3>
                      <p style={{ fontSize: "12px", color: "#777", lineHeight: 1.6, marginBottom: "16px", fontFamily: "'DM Sans',sans-serif" }}>{track.desc}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: BURG, fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
                        Start Learning <span>→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
