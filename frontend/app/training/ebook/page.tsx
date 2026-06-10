"use client";
import Link from "next/link";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;
const AMAZON_LINK = "https://www.amazon.in/ZERO-INVENTORY-EMPIRE-VIPUL-KUMAR-ARYA/dp/9376503139";

// ── ADD YOUR BOOK COVER IMAGE URL HERE ───────────────────────
// Replace the empty string with your image URL or local path
// Example: "/images/book-cover.jpg" or "https://yoursite.com/cover.jpg"
const BOOK_COVER_URL = "";
// ─────────────────────────────────────────────────────────────

export default function EbookPage() {
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", height:"100vh", overflow:"hidden", paddingTop:"68px", display:"flex", flexDirection:"column" }}>
      <style>{`${GF}*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {/* Breadcrumb */}
      <div style={{ background:"#fafafa", borderBottom:"1px solid #f0f0f0", padding:"8px 48px", flexShrink:0 }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", display:"flex", gap:"6px", alignItems:"center" }}>
          <Link href="/" style={{ fontSize:"11px", color:"#aaa", textDecoration:"none" }}>Home</Link>
          <span style={{ color:"#ddd", fontSize:"11px" }}>›</span>
          <Link href="/training" style={{ fontSize:"11px", color:"#aaa", textDecoration:"none" }}>Training</Link>
          <span style={{ color:"#ddd", fontSize:"11px" }}>›</span>
          <span style={{ fontSize:"11px", color:"#555" }}>Ebook</span>
        </div>
      </div>

      {/* Main — full height, no scroll */}
      <div style={{ flex:1, display:"flex", alignItems:"center", padding:"0 48px", overflow:"hidden" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"220px 1fr", gap:"48px", alignItems:"center" }}>

          {/* Left — Book cover */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"14px" }}>
            {/* Book cover — shows image if URL provided, else shows styled placeholder */}
            <div style={{ width:"200px", borderRadius:"10px", overflow:"hidden", boxShadow:"0 16px 48px rgba(0,0,0,.18)", aspectRatio:"3/4" }}>
              {BOOK_COVER_URL ? (
                <img src={BOOK_COVER_URL} alt="The Zero-Inventory Empire" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              ) : (
                <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#0a0a2e 0%,#1a1a5e 40%,#0d0d3d 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:"42px", fontWeight:800, color:"#C9A84C", fontFamily:"'Playfair Display',serif", lineHeight:1 }}>E²</div>
                  <div style={{ width:"30px", height:"1px", background:"rgba(201,168,76,.4)", margin:"8px auto" }} />
                  <div style={{ fontSize:"9px", fontWeight:700, color:"#C9A84C", letterSpacing:".14em", textTransform:"uppercase", marginBottom:"10px" }}>The Zero-Inventory</div>
                  <div style={{ fontSize:"16px", fontWeight:700, color:"#fff", fontFamily:"'Playfair Display',serif", lineHeight:1.2, marginBottom:"6px" }}>Empire</div>
                  <div style={{ fontSize:"9px", color:"rgba(255,255,255,.4)", lineHeight:1.4, marginBottom:"14px" }}>Building a Profitable E-Commerce Business without Stocking Products</div>
                  <div style={{ width:"30px", height:"1px", background:"rgba(201,168,76,.3)", margin:"0 auto 10px" }} />
                  <div style={{ fontSize:"9px", color:"#C9A84C", fontWeight:600, letterSpacing:".1em" }}>V.K. ARYA</div>
                </div>
              )}
            </div>

            {/* Price + Buy */}
            <div style={{ textAlign:"center" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"10px" }}>
                <span style={{ fontSize:"22px", fontWeight:700, color:BURG, fontFamily:"'Playfair Display',serif" }}>₹179</span>
                <span style={{ fontSize:"12px", color:"#aaa", textDecoration:"line-through" }}>₹199</span>
                <span style={{ fontSize:"10px", color:"#15803d", fontWeight:600, background:"#f0fdf4", padding:"2px 6px", borderRadius:"4px" }}>-10%</span>
              </div>
              <a href={AMAZON_LINK} target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", width:"200px", padding:"11px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", fontFamily:"'DM Sans',sans-serif", boxShadow:`0 4px 16px rgba(155,0,32,.3)` }}>
                Buy on Amazon →
              </a>
            </div>
          </div>

          {/* Right — Details */}
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

            {/* Title */}
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"3px 10px", borderRadius:"99px", background:`rgba(155,0,32,.06)`, border:`1px solid rgba(155,0,32,.15)`, fontSize:"10px", fontWeight:600, color:BURG, textTransform:"uppercase", letterSpacing:".1em", marginBottom:"10px", fontFamily:"'DM Sans',sans-serif" }}>
                📖 Ebook
              </div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,3vw,32px)", fontWeight:700, color:"#111", lineHeight:1.15, marginBottom:"4px" }}>
                THE ZERO-INVENTORY EMPIRE
              </h1>
              <p style={{ fontSize:"13px", color:"#888", fontFamily:"'DM Sans',sans-serif" }}>
                by <strong style={{ color:"#333" }}>Vipul Kumar Arya</strong> · Paperback · 78 pages
              </p>
            </div>

            {/* About */}
            <div style={{ padding:"14px 16px", borderRadius:"10px", background:"#fafafa", border:"1px solid #f0f0f0" }}>
              <p style={{ fontSize:"13px", color:"#444", lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
                A practical guide to building a profitable e-commerce business <strong>without stocking products</strong>. Learn dropshipping, print-on-demand, and digital product strategies to generate income online — from first-time entrepreneurs to experienced sellers looking to scale.
              </p>
            </div>

            {/* What you learn — compact 2 col */}
            <div>
              <div style={{ fontSize:"12px", fontWeight:700, color:"#111", letterSpacing:".04em", textTransform:"uppercase", marginBottom:"10px", fontFamily:"'DM Sans',sans-serif" }}>What You Will Learn</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
                {[
                  "Start with zero inventory",
                  "Sell on Amazon & Flipkart",
                  "Dropshipping strategies",
                  "Build automated income",
                  "Find profitable products",
                  "Scale to ₹1 Lakh/month",
                ].map(p => (
                  <div key={p} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={BURG} strokeWidth="2.5" style={{ flexShrink:0 }}><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize:"12px", color:"#444", fontFamily:"'DM Sans',sans-serif" }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Book details — inline */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
              {[
                ["Publisher", "Namya Online Publishing"],
                ["Published", "10 Feb 2026"],
                ["Pages", "78"],
                ["ISBN", "9376503139"],
                ["Format", "Paperback"],
                ["Language", "English"],
              ].map(([label, value]) => (
                <div key={label} style={{ padding:"5px 10px", borderRadius:"6px", background:"#f5f5f5", border:"1px solid #eee" }}>
                  <span style={{ fontSize:"10px", color:"#aaa", fontFamily:"'DM Sans',sans-serif" }}>{label}: </span>
                  <span style={{ fontSize:"10px", fontWeight:600, color:"#333", fontFamily:"'DM Sans',sans-serif" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div style={{ display:"flex", alignItems:"center", gap:"12px", paddingTop:"4px", borderTop:"1px solid #f0f0f0" }}>
              <span style={{ fontSize:"12px", color:"#888", fontFamily:"'DM Sans',sans-serif" }}>Available on Amazon India · FREE Delivery available</span>
              <a href={AMAZON_LINK} target="_blank" rel="noopener noreferrer"
                style={{ marginLeft:"auto", padding:"9px 22px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap" }}>
                Buy Now — ₹179
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
