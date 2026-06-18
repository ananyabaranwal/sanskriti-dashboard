"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

const RED = "#9B0020";
const RED_TINT = "#FDF1F3";
const BORDER_RED = "rgba(155,0,32,.18)";

function Icon({ name, size = 18, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "pin":   return (<svg {...p}><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>);
    case "phone": return (<svg {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>);
    case "mail":  return (<svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 6.5l9 6 9-6"/></svg>);
    case "clock": return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>);
    case "check": return (<svg {...p}><path d="M20 6L9 17l-5-5"/></svg>);
    case "arrow": return (<svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>);
    default: return null;
  }
}

function WhatsappIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.6.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.6-.7.7-.9.1-.2.1-.3 0-.5-.1-.2-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.8 2.6 1 2.6.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M15 8.5h-2a1.5 1.5 0 0 0-1.5 1.5v2H15l-.4 3h-2.1V21" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function YoutubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="2.5" y="6" width="19" height="12" rx="4" />
      <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

const labelStyle: React.CSSProperties = { fontSize: "12px", fontWeight: 600, color: "#6b6b6b", display: "block", marginBottom: "5px", letterSpacing: ".03em" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #e8d1d6", fontSize: "14px", color: "#1a1a1a", background: RED_TINT, outline: "none", fontFamily: "inherit" };

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

  const infoItems = [
    { icon: "pin",   label: "Address", value: BRAND.address },
    { icon: "phone", label: "Phone",   value: BRAND.phone },
    { icon: "mail",  label: "Email",   value: BRAND.email },
    { icon: "clock", label: "Hours",   value: "Mon–Sat, 10:00 AM – 7:00 PM IST" },
  ];

  const socials = [
    { label: "Instagram", href: BRAND.social.instagram,        Icon: InstagramIcon },
    { label: "Facebook",  href: BRAND.social.facebook,         Icon: FacebookIcon },
    { label: "YouTube",   href: BRAND.social.youtube,          Icon: YoutubeIcon },
    { label: "Twitter",   href: (BRAND.social as any).twitter || "#", Icon: TwitterIcon },
  ];

  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingTop: "72px" }}>

      {/* ── Compact page heading — no big banner ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "36px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Link href="/" style={{ fontSize: "13px", color: "#a3a3a3", textDecoration: "none" }}>Home</Link>
          <span style={{ color: "#d4d4d4" }}>›</span>
          <span style={{ fontSize: "13px", color: RED, fontWeight: 600 }}>Contact</span>
        </div>
        <h1 style={{ fontSize: "clamp(26px, 3.4vw, 36px)", fontFamily: "Georgia, serif", color: RED, marginBottom: "8px", fontWeight: 400 }}>Get In Touch</h1>
        <p style={{ fontSize: "15px", color: "#6b6b6b", maxWidth: "560px", lineHeight: "1.7", marginBottom: "28px" }}>
          Have a question about our platform, services, or becoming a seller? We&apos;d love to hear from you.
        </p>
      </div>

      {/* ── Single unified contact box ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div className="contact-box" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", borderRadius: "22px", overflow: "hidden", border: `1px solid ${BORDER_RED}`, boxShadow: "0 12px 36px rgba(155,0,32,.10)" }}>

          {/* Left — info panel (deep red) */}
          <div style={{ background: RED, padding: "40px 34px", color: "#fff", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "20px", fontFamily: "Georgia, serif", marginBottom: "8px", fontWeight: 400 }}>Contact Information</h2>
            <div style={{ width: "36px", height: "2px", background: "rgba(255,255,255,.5)", borderRadius: "1px", marginBottom: "24px" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "28px" }}>
              {infoItems.map((c) => (
                <div key={c.label} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={c.icon} size={16} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "10.5px", fontWeight: 600, color: "rgba(255,255,255,.65)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "3px" }}>{c.label}</div>
                    <div style={{ fontSize: "13.5px", color: "#fff", lineHeight: "1.5" }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <a href={`https://wa.me/${BRAND.whatsapp}?text=Hi%20Sanskriti%20The%20Antique%2C%20I%20have%20a%20query.`} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 16px", borderRadius: "12px", background: "#fff", textDecoration: "none", marginBottom: "24px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <WhatsappIcon size={18} />
              </div>
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#1a1a1a" }}>Chat on WhatsApp</div>
                <div style={{ fontSize: "11.5px", color: "#6b6b6b" }}>Fastest response — usually within 1 hour</div>
              </div>
              <span style={{ marginLeft: "auto", color: RED }}><Icon name="arrow" size={16} /></span>
            </a>

            {/* Social */}
            <div style={{ marginTop: "auto" }}>
              <div style={{ fontSize: "10.5px", fontWeight: 600, color: "rgba(255,255,255,.65)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "12px" }}>Follow Us</div>
              <div style={{ display: "flex", gap: "10px" }}>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none" }}>
                    <s.Icon size={17} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form panel (white) */}
          <div style={{ background: "#fff", padding: "40px 36px" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "50px 20px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: RED_TINT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <Icon name="check" size={28} color={RED} />
                </div>
                <h3 style={{ fontSize: "22px", fontFamily: "Georgia, serif", color: "#1a1a1a", marginBottom: "10px", fontWeight: 400 }}>Message sent!</h3>
                <p style={{ fontSize: "14px", color: "#6b6b6b", lineHeight: "1.7", marginBottom: "24px" }}>
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours on your email or phone.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                  style={{ padding: "12px 26px", borderRadius: "8px", background: RED, color: "#fff", border: "none", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: "20px", fontFamily: "Georgia, serif", color: "#1a1a1a", marginBottom: "6px", fontWeight: 400 }}>Send Us a Message</h2>
                <p style={{ fontSize: "13px", color: "#8a8a8a", marginBottom: "24px" }}>We typically respond within 24 hours</p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="your@email.com" required style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Subject</label>
                    <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} style={{ ...inputStyle, color: form.subject ? "#1a1a1a" : "#a3a3a3", cursor: "pointer" }}>
                      <option value="">Select a subject</option>
                      <option>Becoming a Seller</option>
                      <option>Platform Support</option>
                      <option>Services Enquiry</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Message *</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help you..." required rows={5} style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }} />
                  </div>

                  <button type="submit" disabled={loading} style={{ padding: "14px", borderRadius: "8px", background: loading ? "#e8b9c2" : RED, color: "#fff", border: "none", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: ".02em" }}>
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
          .contact-box { grid-template-columns: 1fr !important; }
        }
        input:focus, textarea:focus, select:focus { border-color: ${RED} !important; }
        input::placeholder, textarea::placeholder { color: #c2c2c2; }
      `}</style>
    </div>
  );
}
