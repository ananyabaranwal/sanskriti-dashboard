"use client";
import Link from "next/link";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const EBOOKS = [
  {
    icon: "📘",
    title: "Antique Identification Guide",
    desc: "Complete guide to identifying authentic Indian antiques — Mughal, colonial, and folk art. Covers brass, bronze, silver, wood, and terracotta.",
    pages: "84 pages",
    tag: "Most Popular",
    free: true,
    topics: ["How to spot fakes", "Era identification", "Regional styles", "Material testing"],
  },
  {
    icon: "📗",
    title: "Amazon Seller Handbook",
    desc: "Everything you need to launch and scale on Amazon — from account setup to becoming a top-rated antique seller.",
    pages: "96 pages",
    tag: "Bestseller",
    free: false,
    topics: ["Account setup", "Listing optimisation", "FBA vs FBM", "PPC basics"],
  },
  {
    icon: "📙",
    title: "GST & Taxation for Antique Sellers",
    desc: "Simplified GST guide written specifically for antique dealers. Covers registration, invoicing, filing, and compliance.",
    pages: "62 pages",
    tag: "Essential",
    free: false,
    topics: ["GST registration", "Invoice format", "Filing deadlines", "Exemptions"],
  },
  {
    icon: "📕",
    title: "Pricing Strategy for Antiques",
    desc: "How to price your antiques for maximum profit — valuation methods, competitive analysis, and seasonal adjustments.",
    pages: "54 pages",
    tag: "New",
    free: false,
    topics: ["Valuation methods", "Market research", "Competitive pricing", "Negotiation tips"],
  },
  {
    icon: "📓",
    title: "Social Media for Antique Sellers",
    desc: "Build a powerful social media presence that drives sales. Instagram, YouTube, Pinterest, and WhatsApp strategies for antique businesses.",
    pages: "72 pages",
    tag: "New",
    free: false,
    topics: ["Instagram strategy", "Reel creation", "YouTube basics", "Content calendar"],
  },
  {
    icon: "📔",
    title: "E-Commerce Website Launch Guide",
    desc: "Step-by-step guide to launching your own antique website — domain, hosting, design, payment gateway, and first sale.",
    pages: "88 pages",
    tag: "Complete Guide",
    free: false,
    topics: ["Domain & hosting", "Website design", "Payment setup", "SEO basics"],
  },
];

export default function EbookPage() {
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#fff", minHeight: "100vh", paddingTop: "68px" }}>
      <style>{`${GF}*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {/* Header */}
      <div style={{ background: BURG, padding: "60px 48px 52px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "16px" }}>
            <Link href="/training" style={{ fontSize: "13px", color: "rgba(255,255,255,.6)", textDecoration: "none" }}>Training</Link>
            <span style={{ color: "rgba(255,255,255,.3)", fontSize: "13px" }}>›</span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,.9)" }}>Ebook</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "#fff", marginBottom: "12px", lineHeight: 1.05 }}>
            Seller Ebooks & Guides
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,.75)", lineHeight: 1.75, maxWidth: "560px", fontFamily: "'DM Sans',sans-serif" }}>
            Download our comprehensive guides written by industry experts. One free guide available — the rest unlock with your seller account.
          </p>
        </div>
      </div>

      {/* Ebook grid */}
      <section style={{ padding: "72px 48px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
          {EBOOKS.map(book => (
            <div key={book.title} style={{ borderRadius: "16px", border: `1.5px solid rgba(155,0,32,.12)`, padding: "28px 24px", background: "#fff", display: "flex", flexDirection: "column", transition: "all .25s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = BURG; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px rgba(155,0,32,.1)`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(155,0,32,.12)"; (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "36px" }}>{book.icon}</span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: "99px", background: `rgba(155,0,32,.08)`, border: `1px solid rgba(155,0,32,.15)`, fontSize: "10px", fontWeight: 700, color: BURG, fontFamily: "'DM Sans',sans-serif" }}>{book.tag}</span>
                  {book.free && <span style={{ padding: "3px 10px", borderRadius: "99px", background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: "10px", fontWeight: 700, color: "#15803d", fontFamily: "'DM Sans',sans-serif" }}>FREE</span>}
                </div>
              </div>

              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "17px", fontWeight: 600, color: "#111", marginBottom: "8px", lineHeight: 1.3 }}>{book.title}</h3>
              <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.7, marginBottom: "16px", flex: 1, fontFamily: "'DM Sans',sans-serif" }}>{book.desc}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                {book.topics.map(t => (
                  <span key={t} style={{ padding: "3px 9px", borderRadius: "6px", background: "#fafafa", border: "1px solid #eee", fontSize: "11px", color: "#666", fontFamily: "'DM Sans',sans-serif" }}>{t}</span>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid #f0f0f0" }}>
                <span style={{ fontSize: "11px", color: "#aaa", fontFamily: "'DM Sans',sans-serif" }}>📄 {book.pages}</span>
                {book.free ? (
                  <button style={{ padding: "8px 18px", borderRadius: "8px", background: BURG, color: "#fff", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                    ⬇ Download Free
                  </button>
                ) : (
                  <Link href="/login" style={{ padding: "8px 18px", borderRadius: "8px", background: `rgba(155,0,32,.08)`, color: BURG, border: `1px solid rgba(155,0,32,.2)`, fontSize: "12px", fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
                    🔒 Login to Download
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
