import Link from "next/link";
import { BRAND } from "@/lib/constants";

const footerLinks = {
  "Explore": [
    { label: "Gallery",          href: "/gallery" },
    { label: "Training Videos",  href: "/videos" },
    { label: "Our Services",     href: "/services" },
    { label: "About Us",         href: "/about" },
    { label: "Contact",          href: "/contact" },
  ],
  "Seller": [
    { label: "Become a Seller",  href: "/register" },
    { label: "Seller Login",     href: "/login" },
    { label: "Dashboard",        href: "/dashboard" },
    { label: "FAQ",              href: "/faq" },
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Disclaimer",       href: "/disclaimer" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "#2C1810", color: "#F5E6C8" }}>
      <div className="container" style={{ paddingTop: "60px", paddingBottom: "0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", paddingBottom: "48px", borderBottom: "1px solid rgba(201,168,76,.12)" }}>

          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3D2B1F", fontSize: "20px", fontWeight: "700", fontFamily: "Georgia, serif", flexShrink: 0 }}>S</div>
              <div>
                <div style={{ color: "#C9A84C", fontSize: "15px", fontWeight: "700", fontFamily: "Georgia, serif", letterSpacing: ".06em" }}>SANSKRITI</div>
                <div style={{ color: "#A08060", fontSize: "9px", letterSpacing: ".22em", marginTop: "2px" }}>THE ANTIQUE</div>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(245,230,200,.55)", lineHeight: "1.75", marginBottom: "22px" }}>
              Preserving India's heritage through authentic antiques. Your trusted marketplace for verified collectibles and cultural treasures.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                { label: "IG",  href: BRAND.social.instagram },
                { label: "FB",  href: BRAND.social.facebook  },
                { label: "YT",  href: BRAND.social.youtube   },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#C9A84C", textDecoration: "none", transition: "all .2s", letterSpacing: ".02em" }}>{s.label}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 style={{ color: "#C9A84C", fontSize: "11px", fontWeight: "600", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "18px", fontFamily: "inherit" }}>{section}</h3>
              {links.map((l) => (
                <Link key={l.href} href={l.href} style={{ display: "block", color: "rgba(245,230,200,.55)", fontSize: "13px", textDecoration: "none", marginBottom: "11px", transition: "color .2s", lineHeight: 1.4 }}>{l.label}</Link>
              ))}
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 style={{ color: "#C9A84C", fontSize: "11px", fontWeight: "600", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "18px", fontFamily: "inherit" }}>Get In Touch</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
              {[
                { icon: "📍", text: BRAND.address },
                { icon: "📞", text: BRAND.phone   },
                { icon: "✉️", text: BRAND.email   },
              ].map((c) => (
                <div key={c.text} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>{c.icon}</span>
                  <span style={{ fontSize: "13px", color: "rgba(245,230,200,.55)", lineHeight: "1.5" }}>{c.text}</span>
                </div>
              ))}
            </div>
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "9px 18px", borderRadius: "8px", background: "rgba(37,211,102,.12)", border: "1px solid rgba(37,211,102,.25)", color: "#4ade80", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}
            >
              <span>💬</span> WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "12px", color: "rgba(245,230,200,.3)" }}>
            © {new Date().getFullYear()} {BRAND.fullName}. All rights reserved. GST: {BRAND.gst}
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Disclaimer",     href: "/disclaimer" },
              { label: "FAQ",            href: "/faq" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: "12px", color: "rgba(245,230,200,.3)", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
