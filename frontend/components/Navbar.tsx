"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("accessToken"));
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isDashboard || isAuthPage) return null;

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        height: "72px",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        background: scrolled ? "rgba(251,247,240,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "0.5px solid #E8D5A3" : "none",
        transition: "all .3s ease",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "linear-gradient(135deg, #C9A84C, #8B6914)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#3D2B1F", fontSize: "18px", fontWeight: "700",
              fontFamily: "Georgia, serif",
              flexShrink: 0,
            }}>S</div>
            <div>
              <div style={{ color: scrolled ? "#2C1810" : "#F5E6C8", fontSize: "15px", fontWeight: "700", fontFamily: "Georgia, serif", letterSpacing: ".06em", lineHeight: 1, transition: "color .3s" }}>SANSKRITI</div>
              <div style={{ color: scrolled ? "#A08060" : "rgba(245,230,200,.6)", fontSize: "9px", letterSpacing: ".22em", marginTop: "3px", transition: "color .3s" }}>THE ANTIQUE</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }} className="hide-mobile">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} style={{
                padding: "7px 14px",
                borderRadius: "99px",
                fontSize: "13px",
                fontWeight: isActive(l.href) ? 600 : 400,
                color: isActive(l.href)
                  ? "#8B6914"
                  : scrolled ? "#3D2B1F" : "rgba(245,230,200,.85)",
                background: isActive(l.href) ? "rgba(201,168,76,.12)" : "transparent",
                textDecoration: "none",
                transition: "all .2s",
                letterSpacing: ".01em",
              }}>{l.label}</Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="hide-mobile">
            {loggedIn ? (
              <Link href="/dashboard" className="btn btn-gold btn-sm">Dashboard →</Link>
            ) : (
              <>
                <Link href="/login" style={{
                  padding: "8px 18px", borderRadius: "8px",
                  border: `1.5px solid ${scrolled ? "#E8D5A3" : "rgba(201,168,76,.35)"}`,
                  color: scrolled ? "#2C1810" : "rgba(245,230,200,.9)",
                  fontSize: "13px", fontWeight: "500",
                  textDecoration: "none", transition: "all .2s",
                  background: "transparent",
                }}>Sign In</Link>
                <Link href="/register" className="btn btn-gold btn-sm">Become a Seller</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hide-desktop"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", display: "flex", flexDirection: "column", gap: "5px" }}
            aria-label="Toggle navigation menu"
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: "block", width: "22px", height: "2px",
                background: scrolled ? "#2C1810" : "#F5E6C8",
                borderRadius: "1px",
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="animate-slide-down" style={{
          position: "fixed",
          top: "72px", left: 0, right: 0,
          zIndex: 999,
          background: "rgba(251,247,240,0.98)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid #E8D5A3",
          padding: "12px 16px 20px",
        }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={{
              display: "block",
              padding: "13px 16px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: isActive(l.href) ? 600 : 400,
              color: isActive(l.href) ? "#8B6914" : "#2C1810",
              background: isActive(l.href) ? "rgba(201,168,76,.1)" : "transparent",
              textDecoration: "none",
              marginBottom: "2px",
            }}>{l.label}</Link>
          ))}
          <div style={{ borderTop: "1px solid #E8D5A3", paddingTop: "14px", marginTop: "10px", display: "flex", gap: "10px" }}>
            <Link href="/login" style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1.5px solid #E8D5A3", color: "#2C1810", fontSize: "14px", fontWeight: "500", textDecoration: "none", textAlign: "center" }}>Sign In</Link>
            <Link href="/register" className="btn btn-gold" style={{ flex: 1, padding: "12px" }}>Join Us</Link>
          </div>
        </div>
      )}
    </>
  );
}
