"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

const RED = "#9B0020";
const RED_TINT = "#FDF1F3";
const BADGE_TINT = "#FCE7EA";
const BORDER_RED = "#F0C7CE";
const WA_NUMBER = BRAND.whatsapp.replace(/\D/g, "");

function Icon({ name, size = 16, color = "currentColor" }: { name: string; size?: number; color?: string }) {
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

function WhatsappIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.6.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.6-.7.7-.9.1-.2.1-.3 0-.5-.1-.2-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.8 2.6 1 2.6.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

function InstagramIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <text x="12" y="17.5" fontSize="16" fontWeight="700" fontFamily="Georgia, serif" textAnchor="middle" fill="currentColor">f</text>
    </svg>
  );
}

function YoutubeIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="5" fill="currentColor" />
      <path d="M10 9l6 3-6 3z" fill="#fff" />
    </svg>
  );
}

function TwitterIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <text x="12" y="17" fontSize="15" fontWeight="700" fontFamily="Arial, sans-serif" textAnchor="middle" fill="currentColor">X</text>
    </svg>
  );
}

const labelStyle: React.CSSProperties = { fontSize: "12px", fontWeight: 600, color: "#6b4f53", display: "block", marginBottom: "5px", letterSpacing: ".03em" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: "8px", border: `1.5px solid ${BORDER_RED}`, fontSize: "14px", color: "#1a1a1a", background: RED_TINT, outline: "none", fontFamily: "inherit" };

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

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px 24px" }}>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "28px", alignItems: "stretch" }}>

          {/* Left — heading + plain contact info, stretched to match form height */}
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <Link href="/" style={{ fontSize: "13px", color: "#a3a3a3", textDecoration: "none" }}>Home</Link>
              <span style={{ color: "#d4d4d4" }}>›</span>
              <span style={{ fontSize: "13px", color: RED, fontWeight: 600 }}>Contact</span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 2.8vw, 30px)", fontFamily: "Georgia, serif", color: RED, marginBottom: "6px", fontWeight: 400 }}>Get In Touch</h1>
            <p style={{ fontSize: "14px", color: "#6b6b6b", lineHeight: "1.6", marginBottom: "26px" }}>
              Have a question about our platform, services, or becoming a seller? We&apos;d love to hear from you.
            </p>

            <h2 style={{ fontSize: "18px", fontFamily: "Georgia, serif", color: "#1a1a1a", marginBottom: "6px", fontWeight: 400 }}>Contact Information</h2>
            <div style={{ width: "36px", height: "2px", background: RED, borderRadius: "1px", marginBottom: "22px" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
              {infoItems.map((c) => (
                <div key={c.label} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: BADGE_TINT, border: `1px solid ${BORDER_RED}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={c.icon} size={17} color={RED} />
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#a3717c", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "3px" }}>{c.label}</div>
                    <div style={{ fontSize: "14px", color: "#1a1a1a", lineHeight: "1.5" }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Sanskriti The Antique, I have a query.")}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", borderRadius: "12px", background: "rgba(37,211,102,.08)", border: "1px solid rgba(37,211,102,.25)", textDecoration: "none", marginBottom: "28px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <WhatsappIcon size={18} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#15803d" }}>Chat on WhatsApp</div>
                <div style={{ fontSize: "12px", color: "#166534" }}>Fastest response — usually within 1 hour</div>
              </div>
              <span style={{ marginLeft: "auto" }}><Icon name="arrow" size={16} color="#25D366" /></span>
            </a>

            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#a3717c", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "14px" }}>Follow Us</div>
              <div style={{ display: "flex", gap: "10px" }}>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{ width: "40px", height: "40px", borderRadius: "10px", background: BADGE_TINT, border: `1px solid ${BORDER_RED}`, display: "flex", alignItems: "center", justifyContent: "center", color: RED, textDecoration: "none" }}>
                    <s.Icon size={17} />
                  </a>
                ))}
              </div>
            </div>

            {/* spacer pushes content to fully fill the column height, matching the form card */}
            <div style={{ flex: 1 }} />
          </div>

          {/* Right — form, in its own white card, stretched taller */}
          <div style={{ background: "#fff", border: `1px solid ${BORDER_RED}`, borderRadius: "18px", padding: "32px 36px", boxShadow: "0 4px 24px rgba(155,0,32,.06)", display: "flex", flexDirection: "column" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 16px", margin: "auto 0" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: RED_TINT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Icon name="check" size={26} color={RED} />
                </div>
                <h3 style={{ fontSize: "20px", fontFamily: "Georgia, serif", color: "#1a1a1a", marginBottom: "8px", fontWeight: 400 }}>Message sent!</h3>
                <p style={{ fontSize: "14px", color: "#6b6b6b", lineHeight: "1.7", marginBottom: "20px" }}>
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours on your email or phone.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                  style={{ padding: "11px 24px", borderRadius: "8px", background: RED, color: "#fff", border: "none", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: "20px", fontFamily: "Georgia, serif", color: "#1a1a1a", marginBottom: "6px", fontWeight: 400 }}>Send Us a Message</h2>
                <p style={{ fontSize: "13px", color: "#8a8a8a", marginBottom: "22px" }}>We typically respond within 24 hours</p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", flex: 1 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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

                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label style={labelStyle}>Message *</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help you..." required style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6", flex: 1, minHeight: "90px" }} />
                  </div>

                  <button type="submit" disabled={loading} style={{ padding: "13px", borderRadius: "8px", background: loading ? "#e8b9c2" : RED, color: "#fff", border: "none", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: ".02em" }}>
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
        input:focus, textarea:focus, select:focus { border-color: ${RED} !important; }
        input::placeholder, textarea::placeholder { color: #c2a0a6; }
      `}</style>
    </div>
  );
}
