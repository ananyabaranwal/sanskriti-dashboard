"use client";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

// ── Colour System ─────────────────────────────────────────────
// Deep Burgundy : #6B1A2A   Dark Burgundy : #4A0F1C
// Deep Gold     : #8B6914   Warm Gold     : #A07820
// ─────────────────────────────────────────────────────────────

const footerLinks = {
  "Explore": [
    { label: "Gallery",         href: "/gallery"    },
    { label: "Training Videos", href: "/videos"     },
    { label: "Our Services",    href: "/services"   },
    { label: "About Us",        href: "/about"      },
    { label: "Contact",         href: "/contact"    },
  ],
  "Seller": [
    { label: "Become a Seller", href: "/register"   },
    { label: "Seller Login",    href: "/login"      },
    { label: "Dashboard",       href: "/dashboard"  },
    { label: "FAQ",             href: "/faq"        },
    { label: "Privacy Policy",  href: "/privacy"    },
    { label: "Disclaimer",      href: "/disclaimer" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "#fff", borderTop: "1px solid #f0f0f0", fontFamily: "'DM Sans',sans-serif", color: "#111" }}>
      <div className="container" style={{ paddingTop: "64px", paddingBottom: "0" }}>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "40px", paddingBottom: "52px", borderBottom: "1px solid #f0f0f0" }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
              <img
                src="/logo.png"
                alt="Sanskriti"
                style={{ width: "44px", height: "44px", objectFit: "contain", flexShrink: 0 }}
                onError={(e: any) => { e.target.style.display = "none"; }}
              />
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "16px", fontWeight: 700, color: "#111", lineHeight: 1 }}>Sanskriti</div>
                <div style={{ fontSize: "9px", letterSpacing: ".22em", color: "#8B6914", textTransform: "uppercase", marginTop: "3px" }}>The Antique</div>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.78, marginBottom: "22px", maxWidth: "220px" }}>
              Preserving India's heritage through authentic antiques. Your trusted marketplace for verified collectibles and cultural treasures.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { label: "IG", href: BRAND.social.instagram },
                { label: "FB", href: BRAND.social.facebook  },
                { label: "YT", href: BRAND.social.youtube   },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(107,26,42,.06)", border: "1px solid rgba(107,26,42,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#6B1A2A", textDecoration: "none" }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: "18px", background: "linear-gradient(135deg,#6B1A2A,#8B6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {section}
              </h3>
              {links.map(l => (
                <Link key={l.href} href={l.href}
                  style={{ display: "block", fontSize: "13px", color: "#666", textDecoration: "none", marginBottom: "11px", lineHeight: 1.4 }}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: "18px", background: "linear-gradient(135deg,#6B1A2A,#8B6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Get In Touch
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "22px" }}>
              {[
                { icon: "📍", text: BRAND.address },
                { icon: "📞", text: BRAND.phone   },
                { icon: "✉️", text: BRAND.email   },
              ].map(c => (
                <div key={c.text} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>{c.icon}</span>
                  <span style={{ fontSize: "13px", color: "#666", lineHeight: 1.5 }}>{c.text}</span>
                </div>
              ))}
            </div>
            <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "8px", background: "rgba(37,211,102,.08)", border: "1px solid rgba(37,211,102,.25)", color: "#16a34a", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "12px", color: "#aaa" }}>
            © {new Date().getFullYear()} {BRAND.fullName}. All rights reserved. GST: {BRAND.gst}
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {[
              { label: "Privacy Policy", href: "/privacy"    },
              { label: "Disclaimer",     href: "/disclaimer" },
              { label: "FAQ",            href: "/faq"        },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ fontSize: "12px", color: "#aaa", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
