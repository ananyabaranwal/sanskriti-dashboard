"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ── ADD VIDEO URLs HERE ───────────────────────────────────────
// Replace empty strings with your video/image URLs for each category
// Format: YouTube embed, Google Drive preview, or direct MP4

const PRODUCT_IMAGES = [
  { id:1, title:"Product Image Basics",          url:"", thumbnail:"" },
  { id:2, title:"White Background Photography",  url:"", thumbnail:"" },
  { id:3, title:"Lifestyle Shots for Antiques",  url:"", thumbnail:"" },
  { id:4, title:"Mobile Photography Tips",       url:"", thumbnail:"" },
  { id:5, title:"Editing with Lightroom Mobile", url:"", thumbnail:"" },
];

const PRODUCT_VIDEOS = [
  { id:1, title:"Product Video Basics",          url:"", thumbnail:"" },
  { id:2, title:"Shooting 360° Product Videos",  url:"", thumbnail:"" },
  { id:3, title:"Creating Reels from Videos",    url:"", thumbnail:"" },
  { id:4, title:"Editing Product Videos",        url:"", thumbnail:"" },
  { id:5, title:"YouTube Product Listings",      url:"", thumbnail:"" },
];

const MANUFACTURING = [
  { id:1, title:"Manufacturing Process Videos",  url:"", thumbnail:"" },
  { id:2, title:"Behind the Scenes Content",     url:"", thumbnail:"" },
  { id:3, title:"Artisan Storytelling Videos",   url:"", thumbnail:"" },
  { id:4, title:"Workshop Tour Videos",          url:"", thumbnail:"" },
  { id:5, title:"Craft Process Time-lapse",      url:"", thumbnail:"" },
];
// ─────────────────────────────────────────────────────────────

type Category = "images" | "videos" | "manufacturing";

const CATEGORIES = [
  {
    key: "images" as Category,
    label: "Product Images",
    desc: "Photography guides for antique products",
    bg: "linear-gradient(135deg,#1a0a0a 0%,#3d1515 50%,#2a0d0d 100%)",
    thumbnail: "🏺",
    videos: PRODUCT_IMAGES,
  },
  {
    key: "videos" as Category,
    label: "Product Videos",
    desc: "Video creation for your product listings",
    bg: "linear-gradient(135deg,#0a0a1a 0%,#151535 50%,#0d0d2a 100%)",
    thumbnail: "🎬",
    videos: PRODUCT_VIDEOS,
  },
  {
    key: "manufacturing" as Category,
    label: "Manufacturing",
    desc: "Behind-the-scenes and process content",
    bg: "linear-gradient(135deg,#0a0e0a 0%,#152515 50%,#0d1a0d 100%)",
    thumbnail: "🏭",
    videos: MANUFACTURING,
  },
];

function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,backdropFilter:"blur(6px)" }}>
      <div style={{ background:"#fff",borderRadius:"20px",padding:"40px 36px",width:"100%",maxWidth:"380px",textAlign:"center",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:"14px",right:"16px",background:"none",border:"none",fontSize:"22px",color:"#aaa",cursor:"pointer" }}>×</button>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:700,color:"#111",marginBottom:"8px" }}>Seller Access Required</h2>
        <p style={{ fontSize:"13px",color:"#666",lineHeight:1.7,marginBottom:"22px",fontFamily:"'DM Sans',sans-serif" }}>Sign in to watch training videos.</p>
        <div style={{ display:"flex",flexDirection:"column",gap:"9px" }}>
          <Link href="/login" style={{ display:"block",padding:"12px",borderRadius:"9px",background:BURG,color:"#fff",fontSize:"14px",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Sign In to Watch</Link>
          <Link href="/register" style={{ display:"block",padding:"12px",borderRadius:"9px",border:"1.5px solid #e5e5e5",color:"#333",fontSize:"14px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Register as New Seller</Link>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [isLoggedIn,   setIsLoggedIn]   = useState(false);
  const [showLogin,    setShowLogin]    = useState(false);
  const [mounted,      setMounted]      = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeVideo,  setActiveVideo]  = useState<number | null>(null);
  const [hoveredCard,  setHoveredCard]  = useState<Category | null>(null);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  if (!mounted) return null;

  const activeCat = CATEGORIES.find(c => c.key === activeCategory);
  const activeVid = activeCat?.videos.find(v => v.id === activeVideo);

  const handleVideoClick = (videoId: number) => {
    if (!isLoggedIn) { setShowLogin(true); return; }
    setActiveVideo(videoId);
  };

  // Category grid view
  if (!activeCategory) {
    return (
      <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", minHeight:"100vh", display:"flex", flexDirection:"column", paddingTop:"68px" }}>
        <style>{`${GF}*{box-sizing:border-box;margin:0;padding:0}.cat-card:hover{transform:translateY(-4px)!important;box-shadow:0 20px 48px rgba(0,0,0,.2)!important}`}</style>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

        {/* Narrow white header */}
        <div style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", padding:"10px 24px", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
              <Link href="/training" style={{ fontSize:"11px", color:"#aaa", textDecoration:"none" }}>Training</Link>
              <span style={{ color:"#ddd", fontSize:"11px" }}>›</span>
              <Link href="/training/videos" style={{ fontSize:"11px", color:"#aaa", textDecoration:"none" }}>Videos</Link>
              <span style={{ color:"#ddd", fontSize:"11px" }}>›</span>
              <Link href="/training/videos/website" style={{ fontSize:"11px", color:"#aaa", textDecoration:"none" }}>Website</Link>
              <span style={{ color:"#ddd", fontSize:"11px" }}>›</span>
              <span style={{ fontSize:"11px", color:"#555" }}>Social Media Content</span>
            </div>
            {!isLoggedIn && (
              <Link href="/login" style={{ padding:"6px 16px", borderRadius:"7px", background:BURG, color:"#fff", fontSize:"12px", fontWeight:600, textDecoration:"none", fontFamily:"'DM Sans',sans-serif" }}>Sign In to Watch</Link>
            )}
          </div>
        </div>

        {/* Section label */}
        <div style={{ padding:"28px 48px 16px" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"22px", fontWeight:600, color:"#111" }}>Social Media Content</h2>
          <p style={{ fontSize:"13px", color:"#888", marginTop:"4px", fontFamily:"'DM Sans',sans-serif" }}>Choose a category to start learning</p>
        </div>

        {/* 3 category cards — large horizontal like reference image */}
        <div style={{ flex:1, padding:"0 48px 48px", display:"flex", gap:"16px", alignItems:"stretch" }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat.key}
              className="cat-card"
              onClick={() => isLoggedIn ? setActiveCategory(cat.key) : setShowLogin(true)}
              onMouseEnter={() => setHoveredCard(cat.key)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ flex:1, borderRadius:"16px", overflow:"hidden", cursor:"pointer", position:"relative", transition:"all .3s", boxShadow:"0 8px 32px rgba(0,0,0,.12)", background:cat.bg, minHeight:"300px", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}
            >
              {/* Background emoji */}
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-60%)", fontSize:"80px", opacity:.15, userSelect:"none" }}>{cat.thumbnail}</div>

              {/* Hover overlay */}
              <div style={{ position:"absolute", inset:0, background:hoveredCard===cat.key?"rgba(155,0,32,.3)":"transparent", transition:"background .3s" }} />

              {/* Lock icon for non-logged in */}
              {!isLoggedIn && (
                <div style={{ position:"absolute", top:"16px", right:"16px", width:"32px", height:"32px", borderRadius:"50%", background:"rgba(0,0,0,.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
              )}

              {/* Bottom text */}
              <div style={{ position:"relative", padding:"20px 24px", background:"linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 100%)" }}>
                <div style={{ fontSize:"18px", fontWeight:700, color:"#fff", fontFamily:"'Playfair Display',serif", marginBottom:"4px" }}>{cat.label}</div>
                <div style={{ fontSize:"12px", color:"rgba(255,255,255,.65)", fontFamily:"'DM Sans',sans-serif" }}>{cat.desc} · {cat.videos.length} videos</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Video list view for selected category
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", height:"100vh", overflow:"hidden", display:"flex", flexDirection:"column", paddingTop:"68px" }}>
      <style>{`${GF}*{box-sizing:border-box;margin:0;padding:0}.vid-row:hover{background:rgba(155,0,32,.04)!important}.vid-row.active{background:rgba(155,0,32,.08)!important;border-left:3px solid ${BURG}!important}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px}`}</style>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Narrow header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", padding:"10px 24px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
            <Link href="/training" style={{ fontSize:"11px", color:"#aaa", textDecoration:"none" }}>Training</Link>
            <span style={{ color:"#ddd", fontSize:"11px" }}>›</span>
            <Link href="/training/videos/website/social-media" style={{ fontSize:"11px", color:"#aaa", textDecoration:"none" }}>Social Media</Link>
            <span style={{ color:"#ddd", fontSize:"11px" }}>›</span>
            <span style={{ fontSize:"11px", color:"#555" }}>{activeCat?.label}</span>
          </div>
          <button onClick={() => { setActiveCategory(null); setActiveVideo(null); }} style={{ fontSize:"12px", color:BURG, fontWeight:600, background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>← Back to Categories</button>
        </div>
      </div>

      {/* Playlist + Player */}
      <div style={{ flex:1, display:"grid", gridTemplateColumns:"280px 1fr", overflow:"hidden" }}>

        {/* Playlist */}
        <div style={{ borderRight:"1px solid #f0f0f0", overflowY:"auto", background:"#fafafa" }}>
          <div style={{ padding:"10px 14px", borderBottom:"1px solid #f0f0f0", background:"#fff", position:"sticky", top:0 }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:"#888", letterSpacing:".08em", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>{activeCat?.label}</div>
          </div>
          {activeCat?.videos.map(v => (
            <div key={v.id} onClick={() => handleVideoClick(v.id)}
              className={`vid-row${activeVideo===v.id?" active":""}`}
              style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", cursor:"pointer", borderLeft:"3px solid transparent", borderBottom:"1px solid #f5f5f5", background:"#fff", transition:"all .15s" }}
            >
              <div style={{ width:"48px", height:"36px", borderRadius:"6px", background:activeVideo===v.id?BURG:isLoggedIn?"#e8e8e8":"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {activeVideo===v.id ? <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"/></svg> : isLoggedIn ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"11px", fontWeight:500, color:activeVideo===v.id?"#111":"#666", fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{v.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Player */}
        <div style={{ display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ flex:1, background:"#111", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {!isLoggedIn ? (
              <div style={{ textAlign:"center", padding:"40px" }}>
                <div style={{ fontSize:"36px", marginBottom:"14px" }}>🔒</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#fff", marginBottom:"8px" }}>Sign In to Watch</h3>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,.5)", marginBottom:"20px", fontFamily:"'DM Sans',sans-serif" }}>Seller-only content</p>
                <div style={{ display:"flex", gap:"10px", justifyContent:"center" }}>
                  <Link href="/login" style={{ padding:"9px 22px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"13px", fontWeight:600, textDecoration:"none", fontFamily:"'DM Sans',sans-serif" }}>Sign In</Link>
                  <Link href="/register" style={{ padding:"9px 22px", borderRadius:"8px", border:"1.5px solid rgba(255,255,255,.3)", color:"#fff", fontSize:"13px", fontWeight:500, textDecoration:"none", fontFamily:"'DM Sans',sans-serif" }}>Register</Link>
                </div>
              </div>
            ) : !activeVideo ? (
              <div style={{ textAlign:"center", padding:"40px" }}>
                <div style={{ fontSize:"36px", marginBottom:"12px" }}>{activeCat?.thumbnail}</div>
                <p style={{ fontSize:"14px", color:"rgba(255,255,255,.5)", fontFamily:"'DM Sans',sans-serif" }}>Select a video from the playlist</p>
              </div>
            ) : activeVid?.url ? (
              activeVid.url.includes(".mp4") ? (
                <video key={activeVid.url} src={activeVid.url} controls style={{ width:"100%", height:"100%", objectFit:"contain" }} />
              ) : (
                <iframe key={activeVid.url} src={activeVid.url} style={{ width:"100%", height:"100%", border:"none" }} allowFullScreen />
              )
            ) : (
              <div style={{ textAlign:"center", padding:"40px" }}>
                <div style={{ fontSize:"32px", marginBottom:"12px" }}>📹</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", color:"rgba(255,255,255,.8)", marginBottom:"6px" }}>Coming Soon</h3>
                <p style={{ fontSize:"12px", color:"rgba(255,255,255,.4)", fontFamily:"'DM Sans',sans-serif" }}>{activeVid?.title}</p>
              </div>
            )}
          </div>
          {activeVideo && (
            <div style={{ padding:"12px 20px", borderTop:"1px solid #f0f0f0", background:"#fff", flexShrink:0 }}>
              <div style={{ fontSize:"14px", fontWeight:600, color:"#111", fontFamily:"'Playfair Display',serif" }}>{activeVid?.title}</div>
              <div style={{ fontSize:"11px", color:"#aaa", marginTop:"2px", fontFamily:"'DM Sans',sans-serif" }}>{activeCat?.label}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
