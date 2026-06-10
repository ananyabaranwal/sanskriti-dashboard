"use client";
import Link from "next/link";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;
const AMAZON_LINK = "https://www.amazon.in/ZERO-INVENTORY-EMPIRE-VIPUL-KUMAR-ARYA/dp/9376503139";

export default function EbookPage() {
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#fff", minHeight: "100vh", paddingTop: "68px" }}>
      <style>{`${GF}*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {/* Breadcrumb */}
      <div style={{ background: "#fafafa", borderBottom: "1px solid #f0f0f0", padding: "12px 48px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", gap: "8px", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "12px", color: "#aaa", textDecoration: "none" }}>Home</Link>
          <span style={{ color: "#ddd" }}>›</span>
          <Link href="/training" style={{ fontSize: "12px", color: "#aaa", textDecoration: "none" }}>Training</Link>
          <span style={{ color: "#ddd" }}>›</span>
          <span style={{ fontSize: "12px", color: "#555" }}>Ebook</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "60px", alignItems: "start" }}>

          {/* Left — Book cover */}
          <div style={{ position: "sticky", top: "88px" }}>
            {/* Book cover placeholder — dark blue like Amazon */}
            <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.2)", aspectRatio: "3/4", background: "linear-gradient(160deg,#0a0a2e 0%,#1a1a5e 40%,#0d0d3d 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center", position: "relative" }}>
              {/* Gold glow */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle,rgba(201,168,76,.15) 0%,transparent 70%)", pointerEvents: "none" }} />
              {/* E² icon */}
              <div style={{ fontSize: "56px", fontWeight: 800, color: "#C9A84C", fontFamily: "'Playfair Display',serif", lineHeight: 1, marginBottom: "12px", position: "relative" }}>
                E²
                <div style={{ position: "absolute", top: "-8px", right: "-16px", fontSize: "16px", color: "#C9A84C" }}>↗</div>
              </div>
              <div style={{ width: "40px", height: "1px", background: "rgba(201,168,76,.4)", margin: "8px auto 14px" }} />
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#C9A84C", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: "16px" }}>The Zero-Inventory</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display',serif", lineHeight: 1.2, marginBottom: "8px" }}>Empire</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,.5)", lineHeight: 1.5, marginBottom: "20px" }}>Building a Profitable E-Commerce Business without Stocking Products</div>
              <div style={{ width: "40px", height: "1px", background: "rgba(201,168,76,.3)", margin: "0 auto 14px" }} />
              <div style={{ fontSize: "12px", color: "#C9A84C", fontWeight: 600, letterSpacing: ".1em" }}>V.K. ARYA</div>
            </div>

            {/* Buy button */}
            <a href={AMAZON_LINK} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", padding: "14px", borderRadius: "10px", background: BURG, color: "#fff", fontSize: "15px", fontWeight: 700, textDecoration: "none", marginTop: "20px", boxShadow: `0 6px 20px rgba(155,0,32,.3)`, fontFamily: "'DM Sans',sans-serif" }}>
              Buy on Amazon →
            </a>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <span style={{ fontSize: "22px", fontWeight: 700, color: BURG, fontFamily: "'Playfair Display',serif" }}>₹179</span>
              <span style={{ fontSize: "12px", color: "#aaa", marginLeft: "8px", textDecoration: "line-through" }}>₹199</span>
              <span style={{ fontSize: "11px", color: "#15803d", marginLeft: "8px", fontWeight: 600 }}>-10% off</span>
            </div>
          </div>

          {/* Right — Details */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "99px", background: `rgba(155,0,32,.06)`, border: `1px solid rgba(155,0,32,.15)`, fontSize: "11px", fontWeight: 600, color: BURG, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "16px", fontFamily: "'DM Sans',sans-serif" }}>
              📖 Ebook
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: "#111", lineHeight: 1.1, marginBottom: "8px" }}>
              THE ZERO-INVENTORY EMPIRE
            </h1>
            <p style={{ fontSize: "15px", color: "#888", marginBottom: "24px", fontFamily: "'DM Sans',sans-serif" }}>
              by <strong style={{ color: "#333" }}>Vipul Kumar Arya</strong> · Paperback · 78 pages
            </p>

            {/* Star rating placeholder */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= 4 ? BURG : "none"} stroke={BURG} strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: "13px", color: "#888", fontFamily: "'DM Sans',sans-serif" }}>New Release</span>
            </div>

            {/* About */}
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "18px", fontWeight: 600, color: "#111", marginBottom: "12px" }}>About This Book</h2>
              <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.85, fontFamily: "'DM Sans',sans-serif", marginBottom: "14px" }}>
                <em>The Zero-Inventory Empire</em> is a practical guide to building a profitable e-commerce business without the burden of stocking products. Written by V.K. Arya, this book reveals how to leverage dropshipping, print-on-demand, and digital product strategies to generate income online.
              </p>
              <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.85, fontFamily: "'DM Sans',sans-serif" }}>
                Whether you are a first-time entrepreneur or an experienced seller looking to scale without capital-heavy inventory, this book provides step-by-step frameworks, real-world examples, and actionable strategies to help you build a sustainable online business from scratch.
              </p>
            </div>

            {/* What you will learn */}
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "18px", fontWeight: 600, color: "#111", marginBottom: "14px" }}>What You Will Learn</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  "How to start an e-commerce business with zero inventory",
                  "Dropshipping and print-on-demand strategies that work",
                  "Selling on Amazon, Flipkart, and your own website",
                  "Finding profitable products without investing in stock",
                  "Building automated income streams online",
                  "Scaling your business from ₹0 to ₹1 Lakh/month",
                ].map(point => (
                  <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BURG} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: "2px" }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ fontSize: "14px", color: "#444", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Book details */}
            <div style={{ borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden", marginBottom: "32px" }}>
              <div style={{ padding: "12px 18px", background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "15px", fontWeight: 600, color: "#111" }}>Book Details</h3>
              </div>
              {[
                ["Publisher",         "Namya Online Publishing Platform"],
                ["Publication Date",  "10 February 2026"],
                ["Print Length",      "78 pages"],
                ["ISBN-10",           "9376503139"],
                ["ISBN-13",           "978-9376503131"],
                ["Language",          "English"],
                ["Format",            "Paperback"],
                ["Dimensions",        "22.86 x 15.24 x 0.46 cm"],
              ].map(([label, value], i) => (
                <div key={label} style={{ display: "grid", gridTemplateColumns: "160px 1fr", padding: "10px 18px", borderBottom: i < 7 ? "1px solid #f5f5f5" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#666", fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
                  <span style={{ fontSize: "13px", color: "#333", fontFamily: "'DM Sans',sans-serif" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ padding: "28px", borderRadius: "14px", background: `rgba(155,0,32,.04)`, border: `1px solid rgba(155,0,32,.12)`, textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "#555", marginBottom: "16px", fontFamily: "'DM Sans',sans-serif" }}>
                Available on Amazon India · Paperback · FREE Delivery available
              </p>
              <a href={AMAZON_LINK} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "13px 36px", borderRadius: "8px", background: BURG, color: "#fff", fontSize: "15px", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", boxShadow: `0 6px 20px rgba(155,0,32,.25)` }}>
                Buy Now on Amazon — ₹179 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
