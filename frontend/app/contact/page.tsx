"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div style={{ background: "#FBF7F0", minHeight: "100vh", paddingTop: "72px" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(160deg, #1A0F0A 0%, #2C1810 50%, #3D2B1F 100%)", padding: "64px 0 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
            <Link href="/" style={{ fontSize: "13px", color: "rgba(201,168,76,.6)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(201,168,76,.3)" }}>›</span>
            <span style={{ fontSize: "13px", color: "rgba(201,168,76,.9)" }}>Contact</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontFamily: "Georgia, serif", color: "#F5E6C8", marginBottom: "12px", fontWeight: "400" }}>Get In Touch</h1>
          <p style={{ fontSize: "16px", color: "rgba(245,230,200,.58)", maxWidth: "480px", lineHeight: "1.7" }}>
            Have a question about our platform, services, or becoming a seller? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "48px", alignItems: "start" }}>

          {/* Left — contact info */}
          <div>
            <h2 style={{ fontSize: "22px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "8px" }}>Contact Information</h2>
            <div style={{ width: "40px", height: "2px", background: "linear-gradient(90deg, #C9A84C, #8B6914)", borderRadius: "1px", marginBottom: "24px" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
              {[
                { icon: "📍", label: "Address",  value: BRAND.address },
                { icon: "📞", label: "Phone",    value: BRAND.phone },
                { icon: "✉️", label: "Email",    value: BRAND.email },
                { icon: "🕐", label: "Hours",    value: "Mon–Sat, 10:00 AM – 7:00 PM IST" },
              ].map((c) => (
                <div key={c.label} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#F5E6C8", border: "1px solid #E8D5A3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "600", color: "#A08060", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "3px" }}>{c.label}</div>
                    <div style={{ fontSize: "14px", color: "#2C1810", lineHeight: "1.5" }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <a href={`https://wa.me/${BRAND.whatsapp}?text=Hi%20Sanskriti%20The%20Antique%2C%20I%20have%20a%20query.`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderRadius: "12px", background: "rgba(37,211,102,.1)", border: "1px solid rgba(37,211,102,.25)", textDecoration: "none", marginBottom: "20px", transition: "all .2s" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>💬</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#15803d" }}>Chat on WhatsApp</div>
                <div style={{ fontSize: "12px", color: "#166534" }}>Fastest response — usually within 1 hour</div>
              </div>
              <span style={{ marginLeft: "auto", color: "#25D366", fontSize: "18px" }}>→</span>
            </a>

            {/* Social */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#A08060", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "12px" }}>Follow Us</div>
              <div style={{ display: "flex", gap: "10px" }}>
                {[
                  { label: "Instagram", href: BRAND.social.instagram, icon: "📸" },
                  { label: "Facebook",  href: BRAND.social.facebook,  icon: "👥" },
                  { label: "YouTube",   href: BRAND.social.youtube,   icon: "▶️" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#F5E6C8", border: "1px solid #E8D5A3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", textDecoration: "none" }}>{s.icon}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "20px", padding: "36px", boxShadow: "0 4px 24px rgba(61,43,31,.06)" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontSize: "22px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "10px" }}>Message Sent!</h3>
                <p style={{ fontSize: "14px", color: "#A08060", lineHeight: "1.7", marginBottom: "24px" }}>
                  Thank you for reaching out. We'll get back to you within 24 hours on your email or phone.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }} style={{ padding: "11px 24px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#3D2B1F", border: "none", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: "20px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "6px" }}>Send Us a Message</h2>
                <p style={{ fontSize: "13px", color: "#A08060", marginBottom: "24px" }}>We typically respond within 24 hours</p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#6B4F12", display: "block", marginBottom: "5px", letterSpacing: ".03em" }}>Full Name *</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E8D5A3", fontSize: "14px", color: "#2C1810", background: "#FBF7F0", outline: "none", fontFamily: "inherit" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#6B4F12", display: "block", marginBottom: "5px", letterSpacing: ".03em" }}>Phone Number</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E8D5A3", fontSize: "14px", color: "#2C1810", background: "#FBF7F0", outline: "none", fontFamily: "inherit" }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#6B4F12", display: "block", marginBottom: "5px", letterSpacing: ".03em" }}>Email Address *</label>
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="your@email.com" required style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E8D5A3", fontSize: "14px", color: "#2C1810", background: "#FBF7F0", outline: "none", fontFamily: "inherit" }} />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#6B4F12", display: "block", marginBottom: "5px", letterSpacing: ".03em" }}>Subject</label>
                    <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E8D5A3", fontSize: "14px", color: form.subject ? "#2C1810" : "#A08060", background: "#FBF7F0", outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
                      <option value="">Select a subject</option>
                      <option>Becoming a Seller</option>
                      <option>Platform Support</option>
                      <option>Services Enquiry</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#6B4F12", display: "block", marginBottom: "5px", letterSpacing: ".03em" }}>Message *</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help you..." required rows={5} style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E8D5A3", fontSize: "14px", color: "#2C1810", background: "#FBF7F0", outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: "1.6" }} />
                  </div>

                  <button type="submit" disabled={loading} style={{ padding: "13px", borderRadius: "8px", background: loading ? "#E8D5A3" : "linear-gradient(135deg, #C9A84C, #8B6914)", color: loading ? "#A08060" : "#3D2B1F", border: "none", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: ".02em", transition: "all .2s" }}>
                    {loading ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        input:focus, textarea:focus, select:focus { border-color: #C9A84C !important; }
        input::placeholder, textarea::placeholder { color: #C4A882; }
      `}</style>
    </div>
  );
}
