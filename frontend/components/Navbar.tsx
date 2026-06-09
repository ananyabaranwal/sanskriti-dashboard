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

const TRAINING_DROPDOWN = [
  {
    label: "Ebook",
    href: "/training/ebook",
    icon: "📖",
    desc: "Download our comprehensive seller guides",
  },
  {
    label: "Videos",
    href: "/training/videos",
    icon: "🎬",
    desc: "Expert training video library",
    submenu: [
      {
        label: "Website",
        href: "/training/videos/website",
        icon: "🌐",
        children: [
          { label: "75 Days Training", href: "/training/videos/website/75-days" },
          { label: "Live Training",    href: "/training/videos/website/live" },
          { label: "Social Media Content", href: "/training/videos/website/social-media" },
        ],
      },
      {
        label: "Amazon",
        href: "/training/videos/amazon",
        icon: "📦",
        children: [
          { label: "75 Days Training", href: "/training/videos/amazon/75-days" },
          { label: "Live Training",    href: "/training/videos/amazon/live" },
          { label: "Social Media Content", href: "/training/videos/amazon/social-media" },
        ],
      },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]       = useState(false);
  const [loggedIn,      setLoggedIn]       = useState(false);
  const [trainingOpen,  setTrainingOpen]   = useState(false);
  const [videosHover,   setVideosHover]    = useState(false);
  const [mobileSection, setMobileSection] = useState<"training" | "videos" | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("accessToken"));
    setMenuOpen(false);
    setTrainingOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setTrainingOpen(false);
        setVideosHover(false);
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .sk-nav-link:hover  { color: ${BURG} !important; }
        .sk-signin:hover    { border-color: ${BURG} !important; color: ${BURG} !important; }
        .sk-mobile-lnk:hover { background: rgba(155,0,32,.06) !important; color: ${BURG} !important; }
        .sk-drop-item:hover { background: rgba(155,0,32,.05) !important; }
        .sk-sub-item:hover  { background: rgba(155,0,32,.06) !important; color: ${BURG} !important; }
        @keyframes sk-slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sk-fadeIn    { from{opacity:0} to{opacity:1} }
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

              // Training dropdown
              return (
                <div key={l.href} ref={dropRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setTrainingOpen(!trainingOpen)}
                    className="sk-nav-link"
                    style={{
                      padding: "7px 14px", borderRadius: "8px",
                      fontSize: "14px", fontWeight: isActive(l.href) ? 600 : 500,
                      color: isActive(l.href) || trainingOpen ? BURG : "#333",
                      background: isActive(l.href) || trainingOpen ? `rgba(155,0,32,.07)` : "transparent",
                      border: "none", cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif",
                      display: "flex", alignItems: "center", gap: "5px",
                    }}
                  >
                    {l.label}
                    <span style={{ fontSize: "10px", transition: "transform .2s", transform: trainingOpen ? "rotate(180deg)" : "none" }}>▾</span>
                  </button>

                  {trainingOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 8px)", left: 0,
                      background: "#fff", borderRadius: "14px",
                      border: "1px solid rgba(155,0,32,.12)",
                      boxShadow: "0 16px 48px rgba(0,0,0,.12)",
                      minWidth: "220px", zIndex: 200,
                      animation: "sk-slideDown .2s ease",
                      overflow: "hidden",
                    }}>
                      {TRAINING_DROPDOWN.map(item => (
                        <div key={item.label}>
                          {!item.submenu ? (
                            <Link href={item.href} className="sk-drop-item" style={{
                              display: "flex", alignItems: "flex-start", gap: "12px",
                              padding: "14px 16px", textDecoration: "none",
                              borderBottom: "1px solid #f5f5f5", transition: "background .15s",
                            }} onClick={() => setTrainingOpen(false)}>
                              <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
                              <div>
                                <div style={{ fontSize: "14px", fontWeight: 600, color: "#111", fontFamily: "'DM Sans',sans-serif" }}>{item.label}</div>
                                <div style={{ fontSize: "11px", color: "#888", marginTop: "2px", fontFamily: "'DM Sans',sans-serif" }}>{item.desc}</div>
                              </div>
                            </Link>
                          ) : (
                            <div
                              className="sk-drop-item"
                              onMouseEnter={() => setVideosHover(true)}
                              onMouseLeave={() => setVideosHover(false)}
                              style={{ position: "relative", cursor: "pointer", borderBottom: "1px solid #f5f5f5", transition: "background .15s" }}
                            >
                              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", padding: "14px 16px" }}>
                                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
                                  <div>
                                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#111", fontFamily: "'DM Sans',sans-serif" }}>{item.label}</div>
                                    <div style={{ fontSize: "11px", color: "#888", marginTop: "2px", fontFamily: "'DM Sans',sans-serif" }}>{item.desc}</div>
                                  </div>
                                </div>
                                <span style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>▸</span>
                              </div>

                              {/* Videos submenu */}
                              {videosHover && (
                                <div style={{
                                  position: "absolute", left: "100%", top: 0,
                                  background: "#fff", borderRadius: "14px",
                                  border: "1px solid rgba(155,0,32,.12)",
                                  boxShadow: "0 16px 48px rgba(0,0,0,.12)",
                                  minWidth: "260px", zIndex: 201,
                                  animation: "sk-fadeIn .15s ease",
                                  overflow: "hidden",
                                }}>
                                  {item.submenu.map(sub => (
                                    <div key={sub.label} style={{ borderBottom: "1px solid #f5f5f5" }}>
                                      <div style={{ padding: "10px 16px 6px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "14px" }}>{sub.icon}</span>
                                        <span style={{ fontSize: "12px", fontWeight: 700, color: BURG, letterSpacing: ".06em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>{sub.label}</span>
                                      </div>
                                      {sub.children.map(child => (
                                        <Link key={child.href} href={child.href} className="sk-sub-item" style={{
                                          display: "flex", alignItems: "center", gap: "8px",
                                          padding: "8px 16px 8px 38px",
                                          fontSize: "13px", color: "#444",
                                          textDecoration: "none", fontFamily: "'DM Sans',sans-serif",
                                          transition: "all .15s",
                                        }} onClick={() => { setTrainingOpen(false); setVideosHover(false); }}>
                                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: BURG, opacity: .4, flexShrink: 0 }} />
                                          {child.label}
                                        </Link>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
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
              <Link href="/dashboard" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "#fff", textDecoration: "none", padding: "9px 22px", borderRadius: "6px", background: `linear-gradient(135deg,${BURG},#8B6914)`, boxShadow: `0 4px 14px rgba(155,0,32,.25)` }}>
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" className="sk-signin" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 500, color: "#333", textDecoration: "none", padding: "8px 20px", borderRadius: "6px", border: "1.5px solid #ddd", transition: "all .2s" }}>
                  Sign In
                </Link>
                <Link href="/register" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "#fff", textDecoration: "none", padding: "9px 22px", borderRadius: "6px", background: `linear-gradient(135deg,${BURG},#8B6914)`, boxShadow: `0 4px 14px rgba(155,0,32,.25)` }}>
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
                display: "block", width: "22px", height: "2px", background: "#333",
                borderRadius: "2px", transition: "all .25s",
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
          {NAV_LINKS.map(l => {
            if (!l.hasDropdown) {
              return (
                <Link key={l.href} href={l.href} className="sk-mobile-lnk" style={{ display: "block", padding: "12px 16px", borderRadius: "10px", marginBottom: "2px", fontSize: "15px", fontWeight: isActive(l.href) ? 600 : 400, color: isActive(l.href) ? BURG : "#222", background: isActive(l.href) ? `rgba(155,0,32,.06)` : "transparent", textDecoration: "none", fontFamily: "'DM Sans',sans-serif", transition: "all .2s" }}>
                  {l.label}
                </Link>
              );
            }

            return (
              <div key={l.href}>
                <button onClick={() => setMobileSection(mobileSection === "training" ? null : "training")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "10px", marginBottom: "2px", fontSize: "15px", fontWeight: 600, color: BURG, background: `rgba(155,0,32,.06)`, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Training
                  <span style={{ transform: mobileSection === "training" ? "rotate(180deg)" : "none", transition: "transform .2s", fontSize: "12px" }}>▾</span>
                </button>

                {mobileSection === "training" && (
                  <div style={{ paddingLeft: "16px", marginBottom: "8px" }}>
                    {/* Ebook */}
                    <Link href="/training/ebook" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", textDecoration: "none", marginBottom: "4px", background: "#fafafa" }} onClick={() => setMenuOpen(false)}>
                      <span>📖</span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#111", fontFamily: "'DM Sans',sans-serif" }}>Ebook</span>
                    </Link>

                    {/* Videos */}
                    <button onClick={() => setMobileSection(s => s === "videos" ? "training" : "videos")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "8px", marginBottom: "4px", background: "#fafafa", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>🎬</span>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>Videos</span>
                      </div>
                      <span style={{ fontSize: "11px", color: "#aaa" }}>▸</span>
                    </button>

                    {(mobileSection as string) === "videos" && (
                      <div style={{ paddingLeft: "14px" }}>
                        {[{ label: "Website", icon: "🌐" }, { label: "Amazon", icon: "📦" }].map(platform => (
                          <div key={platform.label} style={{ marginBottom: "8px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", fontSize: "12px", fontWeight: 700, color: BURG, textTransform: "uppercase", letterSpacing: ".06em", fontFamily: "'DM Sans',sans-serif" }}>
                              <span>{platform.icon}</span>{platform.label}
                            </div>
                            {["75 Days Training", "Live Training", "Social Media Content"].map(item => {
                              const slug = item.toLowerCase().replace(/ /g, "-");
                              const platformSlug = platform.label.toLowerCase();
                              return (
                                <Link key={item} href={`/training/videos/${platformSlug}/${slug}`} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "6px", textDecoration: "none", fontSize: "13px", color: "#555", fontFamily: "'DM Sans',sans-serif" }} onClick={() => setMenuOpen(false)}>
                                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: BURG, opacity: .4, flexShrink: 0 }} />
                                  {item}
                                </Link>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "14px", marginTop: "10px", display: "flex", gap: "10px" }}>
            <Link href="/login" style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1.5px solid #ddd", color: "#333", fontSize: "14px", fontWeight: 500, textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>Sign In</Link>
            <Link href="/register" style={{ flex: 1, padding: "12px", borderRadius: "8px", background: `linear-gradient(135deg,${BURG},#8B6914)`, color: "#fff", fontSize: "14px", fontWeight: 600, textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>Join as Seller</Link>
          </div>
        </div>
      )}
    </>
  );
}
