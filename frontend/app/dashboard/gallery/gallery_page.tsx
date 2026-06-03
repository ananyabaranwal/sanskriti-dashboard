"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const categories = ["All", "Beginner", "Advanced", "Business", "Valuation", "Restoration"];

const videos = [
  { id: 1,  title: "Introduction to Indian Antiques",         category: "Beginner",    duration: "18:24", views: "12.4K", thumbnail: "🏺", instructor: "Rajesh Kumar",   level: "Beginner",  description: "Learn the basics of identifying authentic Indian antiques from the Mughal and colonial era.", free: true  },
  { id: 2,  title: "How to Value Brass & Bronze Items",        category: "Valuation",   duration: "24:10", views: "8.9K",  thumbnail: "⚖️", instructor: "Priya Sharma",   level: "Beginner",  description: "Step-by-step valuation guide for brass and bronze antiques including market pricing.", free: false },
  { id: 3,  title: "Selling Antiques Online — Complete Guide", category: "Business",    duration: "31:45", views: "15.2K", thumbnail: "💼", instructor: "Arjun Nair",    level: "Advanced",  description: "Master the art of selling antiques digitally — photography, descriptions, pricing strategy.", free: false },
  { id: 4,  title: "Spotting Fake vs Authentic Terracotta",   category: "Advanced",    duration: "22:08", views: "6.7K",  thumbnail: "🏛️", instructor: "Meera Joshi",   level: "Advanced",  description: "Expert techniques to identify genuine terracotta pieces versus modern reproductions.", free: false },
  { id: 5,  title: "Silver Jewellery Authentication",         category: "Valuation",   duration: "19:33", views: "9.1K",  thumbnail: "💍", instructor: "Sunita Rao",    level: "Beginner",  description: "Complete guide to authenticating tribal and traditional silver jewellery from India.", free: false },
  { id: 6,  title: "Building Your Antique Business Brand",    category: "Business",    duration: "28:17", views: "11.3K", thumbnail: "🏷️", instructor: "Vikram Singh",  level: "Advanced",  description: "From positioning to marketing — build a recognisable brand in the antique industry.", free: false },
  { id: 7,  title: "Wood Carving Identification Techniques",   category: "Advanced",    duration: "26:52", views: "5.8K",  thumbnail: "🪵", instructor: "Rajesh Kumar",   level: "Advanced",  description: "Identify regional styles, age markers, and authenticity cues in carved wooden antiques.", free: false },
  { id: 8,  title: "GST & Taxation for Antique Sellers",      category: "Business",    duration: "23:06", views: "7.4K",  thumbnail: "🧾", instructor: "CA Ritu Mehta", level: "Beginner",  description: "Complete taxation guide for antique sellers — GST registration, invoicing, and compliance.", free: false },
  { id: 9,  title: "Restoration Basics for Beginners",        category: "Restoration", duration: "35:20", views: "10.6K", thumbnail: "🔧", instructor: "Priya Sharma",   level: "Beginner",  description: "Safe cleaning and basic restoration techniques that preserve the value of your antiques.", free: false },
  { id: 10, title: "Coins & Stamps — Collector's Guide",      category: "Valuation",   duration: "20:44", views: "8.2K",  thumbnail: "🪙", instructor: "Dr. Anand Roy",  level: "Advanced",  description: "Complete collector's guide to valuing and authenticating Indian coins and postal stamps.", free: false },
  { id: 11, title: "Photography Tips for Antique Listings",   category: "Business",    duration: "16:38", views: "13.9K", thumbnail: "📸", instructor: "Arjun Nair",    level: "Beginner",  description: "Professional photography techniques to showcase your antiques and attract buyers online.", free: true  },
  { id: 12, title: "Advanced Painting Authentication",        category: "Advanced",    duration: "42:15", views: "4.3K",  thumbnail: "🖼️", instructor: "Prof. Aisha Khan",level: "Advanced", description: "Deep dive into authenticating Mughal miniatures, Tanjore paintings, and folk art.", free: false },
];

function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(26,0,5,.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px", backdropFilter: "blur(6px)" }}
    >
      <div style={{ background: "#fff", borderRadius: "20px", padding: "40px 36px", width: "100%", maxWidth: "420px", textAlign: "center", boxShadow: "0 24px 64px rgba(26,0,5,.4)", animation: "scaleIn .3s ease" }}>
        <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#9B0020", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "28px" }}>▶️</div>
        <h2 style={{ fontSize: "22px", fontFamily: "'Playfair Display',serif", color: "#111", marginBottom: "10px", fontWeight: "400" }}>Seller Access Required</h2>
        <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.75", marginBottom: "28px" }}>
          Sign in to your verified seller account to watch full training videos and access all course content.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/login" style={{ display: "block", padding: "13px", borderRadius: "8px", background: "#9B0020", color: "#fff", fontSize: "14px", fontWeight: "700", textDecoration: "none", letterSpacing: ".02em" }}>
            Sign In to Watch
          </Link>
          <Link href="/register" style={{ display: "block", padding: "13px", borderRadius: "8px", border: "1.5px solid #eee", color: "#9B0020", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
            Register as New Seller
          </Link>
          <button onClick={onClose} style={{ padding: "10px", background: "none", border: "none", color: "#666", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
            Continue browsing →
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoPlayerModal({ video, onClose }: { video: typeof videos[0]; onClose: () => void }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(26,15,10,.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px", backdropFilter: "blur(8px)" }}
    >
      <div style={{ background: "#1a0005", borderRadius: "16px", width: "100%", maxWidth: "800px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.6)", animation: "scaleIn .3s ease" }}>
        {/* Video area */}
        <div style={{ width: "100%", aspectRatio: "16/9", background: "#1a0005", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>{video.thumbnail}</div>
            <div style={{ fontSize: "18px", color: "#111", fontFamily: "'Playfair Display',serif", marginBottom: "8px" }}>{video.title}</div>
            <div style={{ fontSize: "13px", color: "rgba(245,230,200,.5)" }}>Duration: {video.duration}</div>
          </div>
          <button style={{ position: "absolute", top: "16px", right: "16px", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,.1)", border: "none", color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>×</button>
        </div>
        {/* Info */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontFamily: "'Playfair Display',serif", color: "#fff", marginBottom: "6px", fontWeight: "400" }}>{video.title}</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,.7)", lineHeight: "1.6" }}>{video.description}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: "12px", color: "rgba(155,0,32,.7)", marginBottom: "2px" }}>Instructor</div>
              <div style={{ fontSize: "13px", color: "#9B0020", fontWeight: "600" }}>{video.instructor}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({
  v,
  isLoggedIn,
  onLockClick,
  onPlay,
}: {
  v: typeof videos[0];
  isLoggedIn: boolean;
  onLockClick: () => void;
  onPlay: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const canWatch = isLoggedIn || v.free;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1px solid ${hovered ? "rgba(155,0,32,.4)" : "#eee"}`,
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all .25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(61,43,31,.12)" : "0 2px 8px rgba(61,43,31,.04)",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => canWatch ? onPlay() : onLockClick()}
    >
      {/* Free badge */}
      {v.free && (
        <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 2, padding: "3px 10px", borderRadius: "99px", background: "rgba(21,128,61,.85)", color: "#fff", fontSize: "10px", fontWeight: "700", letterSpacing: ".06em" }}>
          FREE
        </div>
      )}

      {/* Level badge */}
      <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 2, padding: "3px 8px", borderRadius: "99px", background: v.level === "Advanced" ? "rgba(139,105,20,.85)" : "rgba(26,0,5,.7)", color: "#fff", fontSize: "10px", fontWeight: "600", backdropFilter: "blur(4px)" }}>
        {v.level}
      </div>

      {/* Thumbnail */}
      <div style={{ height: "170px", background: "#1a0005", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ fontSize: "64px", filter: !canWatch ? "brightness(.6)" : "none", transition: "filter .2s" }}>{v.thumbnail}</div>

        {/* Play overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: hovered ? "rgba(0,0,0,.25)" : "transparent",
          transition: "background .2s",
        }}>
          <div style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: canWatch ? "rgba(155,0,32,.9)" : "rgba(26,0,5,.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            opacity: hovered ? 1 : 0.7,
            transition: "all .2s",
            transform: hovered ? "scale(1.1)" : "scale(1)",
            backdropFilter: "blur(4px)",
          }}>
            {canWatch ? "▶" : "🔒"}
          </div>
        </div>

        {/* Duration */}
        <div style={{ position: "absolute", bottom: "10px", right: "10px", padding: "3px 8px", borderRadius: "6px", background: "rgba(0,0,0,.55)", color: "#fff", fontSize: "11px", backdropFilter: "blur(4px)", fontWeight: "500" }}>
          {v.duration}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", color: "#666", letterSpacing: ".04em" }}>{v.category}</span>
          <span style={{ fontSize: "11px", color: "#666" }}>👁 {v.views}</span>
        </div>
        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "8px", lineHeight: "1.4", fontFamily: "'Playfair Display',serif" }}>{v.title}</h3>
        <p style={{ fontSize: "12px", color: "#666", lineHeight: "1.6", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {v.description}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#9B0020", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "10px", fontWeight: "700", flexShrink: 0 }}>
              {v.instructor.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <span style={{ fontSize: "12px", color: "#9B0020", fontWeight: "500" }}>{v.instructor}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); canWatch ? onPlay() : onLockClick(); }}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              background: canWatch ? "#9B0020" : "#fff",
              color: canWatch ? "#111" : "#9B0020",
              border: canWatch ? "none" : "1px solid #ddd",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {canWatch ? "▶ Watch" : "🔒 Unlock"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<typeof videos[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  const filtered = videos.filter((v) => {
    const matchCat = activeCategory === "All" || v.category === activeCategory;
    const matchSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const freeCount = videos.filter((v) => v.free).length;
  const lockedCount = videos.length - freeCount;

  if (!mounted) return null;

  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingTop: "72px" }}>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {playingVideo && <VideoPlayerModal video={playingVideo} onClose={() => setPlayingVideo(null)} />}

      {/* ── PAGE HEADER ── */}
      <div style={{ background: "#9B0020", padding: "52px 0 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(155,0,32,.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", position: "relative" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Link href="/" style={{ fontSize: "13px", color: "rgba(255,255,255,.65)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(155,0,32,.2)" }}>›</span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,.9)" }}>Training Videos</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontFamily: "'Playfair Display',serif", color: "#fff", marginBottom: "10px", fontWeight: "400" }}>
                Training Videos
              </h1>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,.7)", maxWidth: "500px", lineHeight: "1.65" }}>
                Expert-led training on antique identification, valuation, business growth, and restoration techniques.
              </p>
              {/* Stats pills */}
              <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
                <div style={{ padding: "6px 14px", borderRadius: "99px", background: "rgba(155,0,32,.07)", border: "1px solid rgba(155,0,32,.2)", fontSize: "12px", color: "#9B0020", fontWeight: "500" }}>
                  {videos.length} Videos Total
                </div>
                <div style={{ padding: "6px 14px", borderRadius: "99px", background: "rgba(21,128,61,.12)", border: "1px solid rgba(21,128,61,.25)", fontSize: "12px", color: "#4ade80", fontWeight: "500" }}>
                  {freeCount} Free to Watch
                </div>
                <div style={{ padding: "6px 14px", borderRadius: "99px", background: "rgba(26,0,5,.4)", border: "1px solid rgba(155,0,32,.15)", fontSize: "12px", color: "rgba(245,230,200,.6)", fontWeight: "500" }}>
                  🔒 {lockedCount} Seller-Only
                </div>
              </div>
            </div>

            {/* Search */}
            <div style={{ position: "relative", minWidth: "260px" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", pointerEvents: "none" }}>🔍</span>
              <input
                type="text"
                placeholder="Search videos or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: "8px", border: "1.5px solid rgba(155,0,32,.25)", background: "rgba(255,253,249,.07)", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ddd", position: "sticky", top: "72px", zIndex: 100 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "12px 0", scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "99px",
                  border: `1px solid ${activeCategory === cat ? "#9B0020" : "#ddd"}`,
                  background: activeCategory === cat ? "#9B0020" : "transparent",
                  color: activeCategory === cat ? "#fff" : "#9B0020",
                  fontSize: "13px",
                  fontWeight: activeCategory === cat ? "700" : "500",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all .2s",
                  flexShrink: 0,
                  fontFamily: "inherit",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Login banner for guests */}
        {!isLoggedIn && (
          <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", borderRadius: "12px", background: "#FFFBEB", border: "1px solid #FDE68A", marginBottom: "24px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "20px" }}>🎬</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#854d0e", marginBottom: "2px" }}>Unlock all {lockedCount} training videos</div>
              <div style={{ fontSize: "13px", color: "#92400e" }}>Sign in to your seller account to access the full training library</div>
            </div>
            <Link href="/login" style={{ padding: "8px 20px", borderRadius: "8px", background: "#9B0020", color: "#fff", fontSize: "13px", fontWeight: "700", textDecoration: "none", whiteSpace: "nowrap" }}>
              Sign In →
            </Link>
          </div>
        )}

        {/* Results count */}
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
          Showing <strong style={{ color: "#111" }}>{filtered.length}</strong> videos
          {activeCategory !== "All" && <> in <strong style={{ color: "#9B0020" }}>{activeCategory}</strong></>}
        </p>

        {/* Video grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎬</div>
            <h3 style={{ fontSize: "20px", fontFamily: "'Playfair Display',serif", color: "#111", marginBottom: "8px" }}>No videos found</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>Try a different search or category</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} style={{ padding: "10px 22px", borderRadius: "8px", background: "#9B0020", color: "#fff", border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {filtered.map((v) => (
              <VideoCard
                key={v.id}
                v={v}
                isLoggedIn={isLoggedIn}
                onLockClick={() => setShowLoginModal(true)}
                onPlay={() => setPlayingVideo(v)}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA for guests */}
        {!isLoggedIn && (
          <div style={{ marginTop: "60px", padding: "48px 40px", borderRadius: "20px", background: "#fff", border: "1.5px solid rgba(155,0,32,.15)", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(155,0,32,.04) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>🎓</div>
              <h3 style={{ fontSize: "26px", fontFamily: "'Playfair Display',serif", color: "#fff", marginBottom: "12px", fontWeight: "400" }}>
                Access the Full Training Library
              </h3>
              <p style={{ fontSize: "15px", color: "rgba(245,230,200,.6)", marginBottom: "28px", maxWidth: "480px", margin: "0 auto 28px", lineHeight: "1.75" }}>
                Get unlimited access to {lockedCount} expert-led training videos on antique identification, valuation, business growth, and restoration.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/register" style={{ padding: "13px 30px", borderRadius: "8px", background: "#9B0020", color: "#fff", fontSize: "14px", fontWeight: "700", textDecoration: "none", letterSpacing: ".02em" }}>
                  Register as Seller →
                </Link>
                <Link href="/login" style={{ padding: "13px 30px", borderRadius: "8px", border: "1.5px solid rgba(155,0,32,.35)", color: "#9B0020", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
                  Already a Seller? Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
        input::placeholder { color: rgba(245,230,200,.32) !important; }
      `}</style>
    </div>
  );
}
