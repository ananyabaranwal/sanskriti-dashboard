"use client";

import { useState } from "react";
import Link from "next/link";
import { FAQS, BRAND} from "@/lib/constants";

const extraFaqs = [
  { q: "What types of antiques can be listed on the platform?",           a: "We accept all authentic Indian antiques including brass and bronze items, wooden crafts, silver jewellery, terracotta, paintings, coins, stamps, textiles, furniture, and decorative arts. All items must be genuine antiques or heritage pieces, not modern reproductions." },
  { q: "How long does KYC verification take?",                           a: "KYC verification typically takes 2–3 business days after you submit all required documents — PAN card, Aadhaar, bank details, and business information. You'll receive an email confirmation once approved." },
  { q: "Can I sell internationally through Sanskriti The Antique?",      a: "Yes. We have a network of international buyers and export partners. Once your account is verified and active, you can mark items as available for international shipping. We assist with documentation and customs requirements." },
  { q: "What happens if a buyer claims an item is not authentic?",        a: "We have a formal dispute resolution process. The item may be sent to one of our certified appraisers for independent assessment. Please refer to our Disclaimer page for full details on authenticity claims and liability." },
  { q: "Is there a commission charged on sales?",                        a: "Yes, Sanskriti The Antique charges a platform commission on successful sales. The commission structure is shared during onboarding and varies based on your seller tier. Contact us for current commission rates." },
  { q: "How do I upgrade my seller account?",                            a: "Seller accounts are upgraded based on transaction volume, review scores, and KYC completion. Premium sellers get benefits like featured listings, priority support, and lower commission rates. Contact your account manager to learn more." },
];

const allFaqs = [...FAQS, ...extraFaqs];

const faqCategories = [
  { label: "All", filter: null },
  { label: "Getting Started", filter: ["How do I become", "How long does KYC", "What types"] },
  { label: "Payments & Wallet", filter: ["wallet", "withdraw", "commission"] },
  { label: "Orders & Shipping", filter: ["shipped", "return", "invoice", "GST"] },
  { label: "Videos & Content", filter: ["training videos", "watch"] },
  { label: "Account & Profile", filter: ["upgrade", "international", "authentic"] },
];

function FaqItem({ f, index }: { f: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${open ? "rgba(201,168,76,.4)" : "#E8D5A3"}`, borderRadius: "12px", overflow: "hidden", transition: "border-color .2s", background: "#FFFDF9" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "20px 24px", fontSize: "15px", fontWeight: "500", color: "#2C1810", cursor: "pointer", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", textAlign: "left", fontFamily: "inherit", lineHeight: "1.4" }}
      >
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#C9A84C", fontFamily: "Georgia, serif", marginTop: "2px", flexShrink: 0 }}>Q{index + 1}</span>
          <span>{f.q}</span>
        </div>
        <span style={{ color: "#C9A84C", fontSize: "20px", flexShrink: 0, fontWeight: "300", lineHeight: 1, transform: open ? "rotate(45deg)" : "none", transition: "transform .25s", display: "inline-block" }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 24px 20px 62px", fontSize: "14px", color: "#6B4F12", lineHeight: "1.8", borderTop: "1px solid #F0E4C0", paddingTop: "16px" }}>
          {f.a}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allFaqs.filter((f) => {
    const matchSearch = f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeCategory === "All") return true;
    const cat = faqCategories.find((c) => c.label === activeCategory);
    if (!cat?.filter) return true;
    return cat.filter.some((k) => f.q.toLowerCase().includes(k.toLowerCase()) || f.a.toLowerCase().includes(k.toLowerCase()));
  });

  return (
    <div style={{ background: "#FBF7F0", minHeight: "100vh", paddingTop: "72px" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(160deg, #1A0F0A 0%, #2C1810 50%, #3D2B1F 100%)", padding: "64px 0 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "18px" }}>
            <Link href="/" style={{ fontSize: "13px", color: "rgba(201,168,76,.6)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(201,168,76,.3)" }}>›</span>
            <span style={{ fontSize: "13px", color: "rgba(201,168,76,.9)" }}>FAQ</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontFamily: "Georgia, serif", color: "#F5E6C8", marginBottom: "12px", fontWeight: "400" }}>Frequently Asked Questions</h1>
          <p style={{ fontSize: "16px", color: "rgba(245,230,200,.58)", marginBottom: "28px", lineHeight: "1.7" }}>
            Everything you need to know about Sanskriti The Antique platform
          </p>
          {/* Search */}
          <div style={{ position: "relative", maxWidth: "480px", margin: "0 auto" }}>
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "13px 16px 13px 44px", borderRadius: "10px", border: "1.5px solid rgba(201,168,76,.25)", background: "rgba(255,253,249,.08)", color: "#F5E6C8", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
            />
          </div>
        </div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div style={{ background: "#FFFDF9", borderBottom: "1px solid #E8D5A3" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "12px 0", scrollbarWidth: "none" }}>
            {faqCategories.map((cat) => (
              <button key={cat.label} onClick={() => setActiveCategory(cat.label)} style={{ padding: "7px 16px", borderRadius: "99px", border: `1px solid ${activeCategory === cat.label ? "#C9A84C" : "#E8D5A3"}`, background: activeCategory === cat.label ? "linear-gradient(135deg, #C9A84C, #8B6914)" : "transparent", color: activeCategory === cat.label ? "#3D2B1F" : "#6B4F12", fontSize: "13px", fontWeight: activeCategory === cat.label ? "700" : "500", cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s", flexShrink: 0, fontFamily: "inherit" }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ LIST ── */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ fontSize: "14px", color: "#A08060", marginBottom: "24px" }}>
          Showing <strong style={{ color: "#2C1810" }}>{filtered.length}</strong> questions
        </p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "14px" }}>🔍</div>
            <h3 style={{ fontSize: "20px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "8px" }}>No questions found</h3>
            <p style={{ fontSize: "14px", color: "#A08060", marginBottom: "20px" }}>Try a different search term</p>
            <button onClick={() => { setSearch(""); setActiveCategory("All"); }} style={{ padding: "10px 22px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#3D2B1F", border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map((f, i) => <FaqItem key={i} f={f} index={i} />)}
          </div>
        )}

        {/* Still have questions */}
        <div style={{ marginTop: "56px", background: "linear-gradient(135deg, #2C1810, #3D2B1F)", borderRadius: "20px", padding: "40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: "36px", marginBottom: "14px" }}>💬</div>
            <h3 style={{ fontSize: "22px", fontFamily: "Georgia, serif", color: "#F5E6C8", marginBottom: "10px", fontWeight: "400" }}>Still Have Questions?</h3>
            <p style={{ fontSize: "14px", color: "rgba(245,230,200,.6)", marginBottom: "24px", maxWidth: "380px", margin: "0 auto 24px", lineHeight: "1.7" }}>
              Our team is available Monday to Saturday, 10AM to 7PM IST. We respond within 24 hours.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" style={{ padding: "12px 28px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#3D2B1F", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>Contact Us →</Link>
              <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ padding: "12px 28px", borderRadius: "8px", background: "rgba(37,211,102,.15)", border: "1px solid rgba(37,211,102,.3)", color: "#4ade80", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder { color: rgba(245,230,200,.32) !important; }
      `}</style>
    </div>
  );
}
