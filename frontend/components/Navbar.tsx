"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BURG = "#9B0020";

const NAV_LINKS = [
  { label: "Home",     href: "/",         hasDropdown: false },
  { label: "Gallery",  href: "/gallery",  hasDropdown: false },
  { label: "Training", href: "/training", hasDropdown: true  },
  { label: "Services", href: "/services", hasDropdown: false },
  { label: "About",    href: "/about",    hasDropdown: false },
  { label: "Contact",  href: "/contact",  hasDropdown: false },
];

type DropLevel = 0 | 1 | 2 | 3;
type Platform  = "website" | "amazon" | null;

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]    = useState(false);
  const [loggedIn,   setLoggedIn]    = useState(false);
  const [dropLevel,  setDropLevel]   = useState<DropLevel>(0);
  const [platform,   setPlatform]    = useState<Platform>(null);
  const [mobileStep, setMobileStep]  = useState<"root" | "videos" | "website" | "amazon">("root");
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("accessToken"));
    setMenuOpen(false);
    setDropLevel(0);
    setMobileStep("root");
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropLevel(0);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isAuthPage  = pathname === "/login" || pathname === "/register";
  if (isDashboard || isAuthPage) return null;

  const tracks = [
    { label: "75 Days Training",    slug: "75-days"      },
    { label: "Live Training",       slug: "live"         },
    { label: "Social Media Content",slug: "social-media" },
  ];

  const closeAll = () => { setDropLevel(0); setMenuOpen(false); setMobileStep("root"); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .sk-nav-link:hover   { color: ${BURG} !important; }
        .sk-signin:hover     { border-color: ${BURG} !important; color: ${BURG} !important; }
        .sk-mobile-lnk:hover { background: rgba(155,0,32,.06) !important; color: ${BURG} !important; }
        .sk-dd-row:hover     { background: rgba(155,0,32,.04) !important; }
        @keyframes sk-slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 768px) { .sk-desk { display: none !important; } .sk-ham { display: flex !important; } }
        @media (min-width: 769px) { .sk-ham  { display: none !important; } }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: "68px", display: "flex", alignItems: "center", padding: "0 48px",
        background: scrolled ? "rgba(255,255,255,.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(155,0,32,.1)" : "none",
        transition: "all .35s ease",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <img src="/logo.png" alt="Sanskriti The Antique" style={{ height: "42px", width: "42px", objectFit: "contain", flexShrink: 0 }}
              onError={(e: any) => { e.target.style.display = "none"; (e.target.nextSibling as HTMLElement).style.display = "flex"; }} />
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: `linear-gradient(135deg,${BURG},#8B6914)`, display: "none", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: "18px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>S</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "17px", fontWeight: 700, color: "#111", lineHeight: 1, letterSpacing: ".02em" }}>Sanskriti</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", letterSpacing: ".2em", color: "#8B6914", textTransform: "uppercase", marginTop: "2px" }}>The Antique</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="sk-desk" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {NAV_LINKS.map(l => {
              if (!l.hasDropdown) {
                return (
                  <Link key={l.href} href={l.href} className="sk-nav-link" style={{
                    padding: "7px 14px", borderRadius: "8px",
                    fontSize: "14px", fontWeight: isActive(l.href) ? 600 : 500,
                    color: isActive(l.href) ? BURG : "#333",
                    background: isActive(l.href) ? `rgba(155,0,32,.07)` : "transparent",
                    textDecoration: "none", transition: "color .2s",
                    fontFamily: "'DM Sans',sans-serif",
                  }}>{l.label}</Link>
                );
              }

              return (
                <div key={l.href} ref={dropRef} style={{ position: "relative" }}>
                  {/* Training button */}
                  <button
                    onClick={() => setDropLevel(dropLevel > 0 ? 0 : 1)}
                    style={{
                      padding: "7px 14px", borderRadius: "8px",
                      fontSize: "14px", fontWeight: isActive(l.href) || dropLevel > 0 ? 600 : 500,
                      color: isActive(l.href) || dropLevel > 0 ? BURG : "#333",
                      background: isActive(l.href) || dropLevel > 0 ? `rgba(155,0,32,.07)` : "transparent",
                      border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                      display: "flex", alignItems: "center", gap: "5px",
                    }}
                  >
                    {l.label}
                    <span style={{ fontSize: "10px", transition: "transform .2s", display: "inline-block", transform: dropLevel > 0 ? "rotate(180deg)" : "none" }}>▾</span>
                  </button>

                  {/* Level 1 — Ebook + Videos */}
                  {dropLevel === 1 && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#fff", borderRadius: "12px", border: "1px solid rgba(155,0,32,.15)", boxShadow: "0 8px 24px rgba(0,0,0,.1)", width: "180px", zIndex: 200, overflow: "hidden", animation: "sk-slideDown .2s ease" }}>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: ".12em", textTransform: "uppercase", padding: "8px 14px 4px", fontFamily: "'DM Sans',sans-serif" }}>Training</div>
                      <Link href="/training/ebook" onClick={closeAll} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", textDecoration: "none", borderBottom: "1px solid #f0f0f0" }} className="sk-dd-row">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9B0020" strokeWidth="2" style={{flexShrink:0}}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#111", fontFamily: "'DM Sans',sans-serif" }}>Ebook</span>
                      </Link>
                      <div onClick={() => setDropLevel(2)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", cursor: "pointer" }} className="sk-dd-row">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9B0020" strokeWidth="2" style={{flexShrink:0}}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: BURG, fontFamily: "'DM Sans',sans-serif" }}>Videos</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "#bbb" }}>›</span>
                      </div>
                    </div>
                  )}

                  {/* Level 2 — Website + Amazon */}
                  {dropLevel === 2 && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#fff", borderRadius: "12px", border: "1px solid rgba(155,0,32,.15)", boxShadow: "0 8px 24px rgba(0,0,0,.1)", width: "180px", zIndex: 200, overflow: "hidden", animation: "sk-slideDown .15s ease" }}>
                      <div onClick={() => setDropLevel(1)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "11px", fontWeight: 600, color: BURG, cursor: "pointer", borderBottom: "1px solid #f0f0f0", background: "#fafafa", fontFamily: "'DM Sans',sans-serif" }}>← Back</div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: ".12em", textTransform: "uppercase", padding: "8px 14px 4px", fontFamily: "'DM Sans',sans-serif" }}>Videos</div>
                      <div onClick={() => { setPlatform("website"); setDropLevel(3); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f0f0f0" }} className="sk-dd-row">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9B0020" strokeWidth="2" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#111", fontFamily: "'DM Sans',sans-serif" }}>Website</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "#bbb" }}>›</span>
                      </div>
                      <div onClick={() => { setPlatform("amazon"); setDropLevel(3); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", cursor: "pointer" }} className="sk-dd-row">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9B0020" strokeWidth="2" style={{flexShrink:0}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#111", fontFamily: "'DM Sans',sans-serif" }}>Amazon</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "#bbb" }}>›</span>
                      </div>
                    </div>
                  )}

                  {/* Level 3 — 3 tracks */}
                  {dropLevel === 3 && platform && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#fff", borderRadius: "12px", border: "1px solid rgba(155,0,32,.15)", boxShadow: "0 8px 24px rgba(0,0,0,.1)", width: "200px", zIndex: 200, overflow: "hidden", animation: "sk-slideDown .15s ease" }}>
                      <div onClick={() => setDropLevel(2)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "11px", fontWeight: 600, color: BURG, cursor: "pointer", borderBottom: "1px solid #f0f0f0", background: "#fafafa", fontFamily: "'DM Sans',sans-serif" }}>← Back</div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: ".12em", textTransform: "uppercase", padding: "8px 14px 4px", fontFamily: "'DM Sans',sans-serif" }}>{platform === "website" ? "Website" : "Amazon"}</div>
                      {tracks.map((t, i) => (
                        <Link key={t.slug} href={`/training/videos/${platform}/${t.slug}`} onClick={closeAll} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", textDecoration: "none", borderBottom: i < tracks.length - 1 ? "1px solid #f0f0f0" : "none" }} className="sk-dd-row">
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: BURG, opacity: .5, flexShrink: 0 }} />
                          <span style={{ fontSize: "13px", fontWeight: 500, color: "#111", fontFamily: "'DM Sans',sans-serif" }}>{t.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA buttons */}
          <div className="sk-desk" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {loggedIn ? (
              <Link href="/dashboard" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "#fff", textDecoration: "none", padding: "9px 22px", borderRadius: "6px", background: BURG, boxShadow: `0 4px 14px rgba(155,0,32,.3)` }}>
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" className="sk-signin" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 500, color: "#333", textDecoration: "none", padding: "8px 20px", borderRadius: "6px", border: "1.5px solid #ddd", transition: "all .2s" }}>
                  Sign In
                </Link>
                <Link href="/register" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "#fff", textDecoration: "none", padding: "9px 22px", borderRadius: "6px", background: BURG, boxShadow: `0 4px 14px rgba(155,0,32,.3)` }}>
                  Join as Seller
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="sk-ham" aria-label="Toggle menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", flexDirection: "column", gap: "5px", display: "none" }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: "22px", height: "2px", background: "#333", borderRadius: "2px", transition: "all .25s",
                transform: menuOpen ? i === 0 ? "rotate(45deg) translate(5px,5px)" : i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "scaleX(0)" : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "fixed", top: "68px", left: 0, right: 0, zIndex: 999, background: "rgba(255,255,255,.98)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid #f0f0f0", padding: "12px 20px 20px", boxShadow: "0 8px 32px rgba(0,0,0,.08)", animation: "sk-slideDown .25s ease", maxHeight: "80vh", overflowY: "auto" }}>

          {/* Step: root */}
          {mobileStep === "root" && (
            <>
              {NAV_LINKS.map(l => {
                if (!l.hasDropdown) return (
                  <Link key={l.href} href={l.href} className="sk-mobile-lnk" onClick={closeAll} style={{ display: "block", padding: "12px 16px", borderRadius: "10px", marginBottom: "2px", fontSize: "15px", fontWeight: isActive(l.href) ? 600 : 400, color: isActive(l.href) ? BURG : "#222", background: isActive(l.href) ? `rgba(155,0,32,.06)` : "transparent", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
                    {l.label}
                  </Link>
                );
                return (
                  <button key={l.href} onClick={() => setMobileStep("videos")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "10px", marginBottom: "2px", fontSize: "15px", fontWeight: 600, color: BURG, background: `rgba(155,0,32,.06)`, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                    Training <span style={{ fontSize: "12px" }}>▸</span>
                  </button>
                );
              })}
            </>
          )}

          {/* Step: videos (Ebook + Website + Amazon) */}
          {mobileStep === "videos" && (
            <>
              <button onClick={() => setMobileStep("root")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", marginBottom: "8px", fontSize: "13px", fontWeight: 500, color: BURG, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>← Back</button>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 16px 8px", fontFamily: "'DM Sans',sans-serif" }}>Training</div>
              <Link href="/training/ebook" onClick={closeAll} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", marginBottom: "4px", textDecoration: "none", background: "#fafafa" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9B0020" strokeWidth="2" style={{flexShrink:0}}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#111", fontFamily: "'DM Sans',sans-serif" }}>Ebook</div>
                  <div style={{ fontSize: "11px", color: "#888", fontFamily: "'DM Sans',sans-serif" }}>Download seller guides</div>
                </div>
              </Link>
              <button onClick={() => setMobileStep("website")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "10px", marginBottom: "4px", background: "#fafafa", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9B0020" strokeWidth="2" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>Website</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>Sell on your own site</div>
                  </div>
                </div>
                <span style={{ fontSize: "12px", color: "#aaa" }}>▸</span>
              </button>
              <button onClick={() => setMobileStep("amazon")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "10px", background: "#fafafa", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9B0020" strokeWidth="2" style={{flexShrink:0}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>Amazon</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>Sell on Amazon</div>
                  </div>
                </div>
                <span style={{ fontSize: "12px", color: "#aaa" }}>▸</span>
              </button>
            </>
          )}

          {/* Step: website tracks */}
          {mobileStep === "website" && (
            <>
              <button onClick={() => setMobileStep("videos")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", marginBottom: "8px", fontSize: "13px", fontWeight: 500, color: BURG, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>← Back</button>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 16px 8px", fontFamily: "'DM Sans',sans-serif" }}>🌐 Website</div>
              {tracks.map(t => (
                <Link key={t.slug} href={`/training/videos/website/${t.slug}`} onClick={closeAll} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "10px", marginBottom: "4px", textDecoration: "none", background: "#fafafa" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: BURG, opacity: .45, flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#111", fontFamily: "'DM Sans',sans-serif" }}>{t.label}</span>
                </Link>
              ))}
            </>
          )}

          {/* Step: amazon tracks */}
          {mobileStep === "amazon" && (
            <>
              <button onClick={() => setMobileStep("videos")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", marginBottom: "8px", fontSize: "13px", fontWeight: 500, color: BURG, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>← Back</button>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 16px 8px", fontFamily: "'DM Sans',sans-serif" }}>📦 Amazon</div>
              {tracks.map(t => (
                <Link key={t.slug} href={`/training/videos/amazon/${t.slug}`} onClick={closeAll} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "10px", marginBottom: "4px", textDecoration: "none", background: "#fafafa" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: BURG, opacity: .45, flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#111", fontFamily: "'DM Sans',sans-serif" }}>{t.label}</span>
                </Link>
              ))}
            </>
          )}

          {mobileStep === "root" && (
            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "14px", marginTop: "10px", display: "flex", gap: "10px" }}>
              <Link href="/login" style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1.5px solid #ddd", color: "#333", fontSize: "14px", fontWeight: 500, textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>Sign In</Link>
              <Link href="/register" style={{ flex: 1, padding: "12px", borderRadius: "8px", background: BURG, color: "#fff", fontSize: "14px", fontWeight: 600, textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>Join as Seller</Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
