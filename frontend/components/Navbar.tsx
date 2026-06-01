"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`;

export default function Navbar() {
  const pathname               = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // auth + close menu on route change
  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("accessToken"));
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // hide on dashboard, admin, auth pages
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isAuthPage  = pathname === "/login" || pathname === "/register";
  if (isDashboard || isAuthPage) return null;

  return (
    <>
      <style>{`
        ${GF}
        .sk-nav-link:hover { color: #C41E3A !important; }
        .sk-shop-btn:hover { border-color: #C41E3A !important; color: #C41E3A !important; }
        .sk-signin-btn:hover { border-color: #C41E3A !important; color: #C41E3A !important; }
        .sk-mobile-link:hover { background: rgba(196,30,58,.06) !important; color: #C41E3A !important; }
        @keyframes sk-slideDown { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
        @media (max-width: 768px) {
          .sk-desktop-links { display: none !important; }
          .sk-hamburger      { display: flex !important; }
        }
        @media (min-width: 769px) {
          .sk-hamburger { display: none !important; }
        }
      `}</style>

      {/* ── MAIN NAV ─────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 1000, height: "68px",
        display: "flex", alignItems: "center",
        padding: "0 48px",
        background: scrolled ? "rgba(255,255,255,.97)" : "rgba(255,255,255,0)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,.07)" : "none",
        transition: "all .35s ease",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "11px", textDecoration: "none" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "linear-gradient(135deg,#C41E3A,#8B0020)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Playfair Display',serif", fontSize: "18px",
              fontWeight: 700, color: "#fff", flexShrink: 0,
              boxShadow: "0 4px 14px rgba(196,30,58,.25)",
            }}>S</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "17px", fontWeight: 700, color: "#111", lineHeight: 1, letterSpacing: ".02em" }}>
                Sanskriti
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", letterSpacing: ".2em", color: "#C41E3A", textTransform: "uppercase", marginTop: "2px" }}>
                The Antique
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="sk-desktop-links" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="sk-nav-link"
                style={{
                  padding: "7px 15px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: isActive(l.href) ? 600 : 500,
                  color: isActive(l.href) ? "#C41E3A" : "#333",
                  background: isActive(l.href) ? "rgba(196,30,58,.07)" : "transparent",
                  textDecoration: "none",
                  transition: "color .2s",
                  fontFamily: "'DM Sans',sans-serif",
                  letterSpacing: ".01em",
                }}
              >{l.label}</Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="sk-desktop-links" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a
              href="https://sanskrititheantique.com/"
              target="_blank"
              rel="noreferrer"
              className="sk-shop-btn"
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "13px", fontWeight: 500,
                color: "#333", textDecoration: "none",
                padding: "8px 18px", borderRadius: "6px",
                border: "1.5px solid #ddd",
                transition: "all .2s",
              }}
            >Shop →</a>

            {loggedIn ? (
              <Link
                href="/dashboard"
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "13px", fontWeight: 600,
                  color: "#fff", textDecoration: "none",
                  padding: "9px 22px", borderRadius: "6px",
                  background: "linear-gradient(135deg,#C41E3A,#8B0020)",
                  boxShadow: "0 4px 14px rgba(196,30,58,.25)",
                }}
              >Dashboard →</Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="sk-signin-btn"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "13px", fontWeight: 500,
                    color: "#333", textDecoration: "none",
                    padding: "8px 18px", borderRadius: "6px",
                    border: "1.5px solid #ddd",
                    transition: "all .2s",
                  }}
                >Sign In</Link>
                <Link
                  href="/register"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "13px", fontWeight: 600,
                    color: "#fff", textDecoration: "none",
                    padding: "9px 22px", borderRadius: "6px",
                    background: "linear-gradient(135deg,#C41E3A,#8B0020)",
                    boxShadow: "0 4px 14px rgba(196,30,58,.25)",
                  }}
                >Join as Seller</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sk-hamburger"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", flexDirection: "column", gap: "5px", display: "none" }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: "22px", height: "2px",
                background: "#111", borderRadius: "2px",
                transition: "all .25s",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(5px,5px)"
                  : i === 2 ? "rotate(-45deg) translate(5px,-5px)"
                  : "scaleX(0)"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>

        </div>
      </nav>

      {/* ── MOBILE MENU ──────────────────────────────────── */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "68px", left: 0, right: 0,
          zIndex: 999,
          background: "rgba(255,255,255,.98)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid #f0f0f0",
          padding: "12px 20px 20px",
          boxShadow: "0 8px 32px rgba(0,0,0,.08)",
          animation: "sk-slideDown .25s ease",
        }}>
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="sk-mobile-link"
              style={{
                display: "block", padding: "13px 16px",
                borderRadius: "10px", marginBottom: "2px",
                fontSize: "15px", fontWeight: isActive(l.href) ? 600 : 400,
                color: isActive(l.href) ? "#C41E3A" : "#222",
                background: isActive(l.href) ? "rgba(196,30,58,.06)" : "transparent",
                textDecoration: "none",
                fontFamily: "'DM Sans',sans-serif",
                transition: "all .2s",
              }}
            >{l.label}</Link>
          ))}

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "14px", marginTop: "10px", display: "flex", gap: "10px" }}>
            <Link
              href="/login"
              style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1.5px solid #ddd", color: "#333", fontSize: "14px", fontWeight: 500, textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}
            >Sign In</Link>
            <Link
              href="/register"
              style={{ flex: 1, padding: "12px", borderRadius: "8px", background: "linear-gradient(135deg,#C41E3A,#8B0020)", color: "#fff", fontSize: "14px", fontWeight: 600, textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}
            >Join as Seller</Link>
          </div>
        </div>
      )}
    </>
  );
}
