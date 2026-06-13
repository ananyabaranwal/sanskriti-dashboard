"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ── ADD YOUR VIDEO URLs HERE ──────────────────────────────────
// Replace the empty strings with your video URLs
// Supported: YouTube embed, direct MP4, Google Drive embed, Vimeo
// Example YouTube: "https://www.youtube.com/embed/VIDEO_ID"
// Example MP4: "https://yoursite.com/videos/day1.mp4"
// Example Google Drive: "https://drive.google.com/file/d/FILE_ID/preview"
// Leave empty string "" if video not uploaded yet
const VIDEOS = [
  { day: 1,  title: "Amazon Seller Account Setup",          url: "" },
  { day: 2,  title: "Understanding Amazon Marketplace",     url: "" },
  { day: 3,  title: "Choosing Your Product Category",       url: "" },
  { day: 4,  title: "Competitor Research Basics",           url: "" },
  { day: 5,  title: "Product Research & Selection",         url: "" },
  { day: 6,  title: "Sourcing Products for Amazon",         url: "" },
  { day: 7,  title: "Pricing Strategy for Amazon",          url: "" },
  { day: 8,  title: "Amazon-Compliant Photography",         url: "" },
  { day: 9,  title: "Writing Product Titles",               url: "" },
  { day: 10, title: "Writing Bullet Points",                url: "" },
  { day: 11, title: "Writing Product Descriptions",         url: "" },
  { day: 12, title: "Backend Keywords Strategy",            url: "" },
  { day: 13, title: "Creating Your First Listing",          url: "" },
  { day: 14, title: "Listing Optimisation Checklist",       url: "" },
  { day: 15, title: "FBA vs FBM — Which to Choose",        url: "" },
  { day: 16, title: "Setting Up FBA Shipment",              url: "" },
  { day: 17, title: "Understanding Amazon Fees",            url: "" },
  { day: 18, title: "Inventory Planning Basics",            url: "" },
  { day: 19, title: "Managing FBA Inventory",               url: "" },
  { day: 20, title: "Amazon Brand Registry",                url: "" },
  { day: 21, title: "A+ Content Creation",                  url: "" },
  { day: 22, title: "Amazon Storefront Setup",              url: "" },
  { day: 23, title: "PPC Advertising Basics",               url: "" },
  { day: 24, title: "Sponsored Products Campaign",          url: "" },
  { day: 25, title: "Sponsored Brands Campaign",            url: "" },
  { day: 26, title: "Understanding ACoS & ROAS",            url: "" },
  { day: 27, title: "Keyword Bidding Strategy",             url: "" },
  { day: 28, title: "Negative Keywords Setup",              url: "" },
  { day: 29, title: "Campaign Optimisation",                url: "" },
  { day: 30, title: "PPC Budget Management",                url: "" },
  { day: 31, title: "Getting Your First Reviews",           url: "" },
  { day: 32, title: "Review Request Strategy",              url: "" },
  { day: 33, title: "Handling Negative Reviews",            url: "" },
  { day: 34, title: "Amazon A-to-Z Claims",                 url: "" },
  { day: 35, title: "Account Health Management",            url: "" },
  { day: 36, title: "Dealing with Account Suspensions",     url: "" },
  { day: 37, title: "Winning the Buy Box",                  url: "" },
  { day: 38, title: "Lightning Deals & Coupons",            url: "" },
  { day: 39, title: "Amazon Prime Day Preparation",         url: "" },
  { day: 40, title: "Seasonal Sales Strategy",              url: "" },
  { day: 41, title: "Bundling Products for More Sales",     url: "" },
  { day: 42, title: "Variation Listings Setup",             url: "" },
  { day: 43, title: "Virtual Bundles on Amazon",            url: "" },
  { day: 44, title: "International Selling Basics",         url: "" },
  { day: 45, title: "Amazon Global Selling",               url: "" },
  { day: 46, title: "External Traffic to Amazon",           url: "" },
  { day: 47, title: "Social Media for Amazon Sellers",      url: "" },
  { day: 48, title: "Influencer Marketing for Amazon",      url: "" },
  { day: 49, title: "Email Marketing for Amazon Sellers",   url: "" },
  { day: 50, title: "Building a Brand Beyond Amazon",       url: "" },
  { day: 51, title: "Understanding Amazon Analytics",       url: "" },
  { day: 52, title: "Reading Your Sales Dashboard",         url: "" },
  { day: 53, title: "Tracking BSR & Keyword Rank",          url: "" },
  { day: 54, title: "Competitor Monitoring Tools",          url: "" },
  { day: 55, title: "Profit & Loss Calculation",            url: "" },
  { day: 56, title: "GST for Amazon Sellers",               url: "" },
  { day: 57, title: "Amazon GST Invoice Setup",             url: "" },
  { day: 58, title: "TDS on Amazon Payouts",                url: "" },
  { day: 59, title: "Managing Returns on Amazon",           url: "" },
  { day: 60, title: "Reducing Return Rates",                url: "" },
  { day: 61, title: "Customer Service Excellence",          url: "" },
  { day: 62, title: "Handling Counterfeit Claims",          url: "" },
  { day: 63, title: "Amazon Transparency Program",          url: "" },
  { day: 64, title: "Launching a New Product",              url: "" },
  { day: 65, title: "Product Launch Strategy",              url: "" },
  { day: 66, title: "Scaling Your Best Sellers",            url: "" },
  { day: 67, title: "Expanding Product Catalogue",          url: "" },
  { day: 68, title: "Outsourcing & Delegation",             url: "" },
  { day: 69, title: "Building a Team for Amazon",           url: "" },
  { day: 70, title: "Automating Your Amazon Business",      url: "" },
  { day: 71, title: "Amazon Seller Tools Overview",         url: "" },
  { day: 72, title: "Using Helium10 / Jungle Scout",        url: "" },
  { day: 73, title: "Monthly Business Review",              url: "" },
  { day: 74, title: "Planning Your Next Quarter",           url: "" },
  { day: 75, title: "Scaling to ₹5 Lakh Per Month",        url: "" },
];
// ─────────────────────────────────────────────────────────────

function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,backdropFilter:"blur(6px)" }}>
      <div style={{ background:"#fff",borderRadius:"20px",padding:"40px 36px",width:"100%",maxWidth:"380px",textAlign:"center",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:"14px",right:"16px",background:"none",border:"none",fontSize:"22px",color:"#aaa",cursor:"pointer" }}>×</button>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:700,color:"#111",marginBottom:"8px" }}>Seller Access Required</h2>
        <p style={{ fontSize:"13px",color:"#666",lineHeight:1.7,marginBottom:"22px",fontFamily:"'DM Sans',sans-serif" }}>Sign in to your verified seller account to watch training videos.</p>
        <div style={{ display:"flex",flexDirection:"column",gap:"9px" }}>
          <Link href="/login" style={{ display:"block",padding:"12px",borderRadius:"9px",background:BURG,color:"#fff",fontSize:"14px",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Sign In to Watch</Link>
          <Link href="/register" style={{ display:"block",padding:"12px",borderRadius:"9px",border:"1.5px solid #e5e5e5",color:"#333",fontSize:"14px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Register as New Seller</Link>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin,  setShowLogin]  = useState(false);
  const [mounted,    setMounted]    = useState(false);
  const [activeDay,  setActiveDay]  = useState(1);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  if (!mounted) return null;

  const activeVideo = VIDEOS[activeDay - 1];

  const handleVideoClick = (day: number) => {
    if (!isLoggedIn) { setShowLogin(true); return; }
    setActiveDay(day);
  };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif",background:"#fff",height:"100vh",overflow:"hidden",display:"flex",flexDirection:"column",paddingTop:"68px" }}>
      <style>{`
        ${GF}
        *{box-sizing:border-box;margin:0;padding:0}
        .vid-row:hover{background:rgba(155,0,32,.04)!important}
        .vid-row.active{background:rgba(155,0,32,.08)!important;border-left:3px solid ${BURG}!important}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#f5f5f5}
        ::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px}
      `}</style>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Narrow header banner */}
      <div style={{ background:"#fff",borderBottom:"1px solid #f0f0f0",padding:"10px 24px",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"12px" }}>
            <div style={{ display:"flex",gap:"6px",alignItems:"center" }}>
              <Link href="/training" style={{ fontSize:"11px",color:"#aaa",textDecoration:"none" }}>Training</Link>
              <span style={{ color:"#ddd",fontSize:"11px" }}>›</span>
              <Link href="/training/videos" style={{ fontSize:"11px",color:"#aaa",textDecoration:"none" }}>Videos</Link>
              <span style={{ color:"#ddd",fontSize:"11px" }}>›</span>
              <Link href="/training/videos/amazon" style={{ fontSize:"11px",color:"#aaa",textDecoration:"none" }}>Amazon</Link>
              <span style={{ color:"#ddd",fontSize:"11px" }}>›</span>
              <span style={{ fontSize:"11px",color:"#555" }}>75 Days Training</span>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:"10px" }}>
            <span style={{ fontSize:"12px",color:"#888",fontFamily:"'DM Sans',sans-serif" }}>75 Days Amazon Training</span>
            <span style={{ padding:"3px 10px",borderRadius:"99px",background:`rgba(155,0,32,.07)`,border:`1px solid rgba(155,0,32,.15)`,fontSize:"11px",fontWeight:600,color:BURG,fontFamily:"'DM Sans',sans-serif" }}>75 Videos</span>
            {!isLoggedIn && (
              <Link href="/login" style={{ padding:"6px 16px",borderRadius:"7px",background:BURG,color:"#fff",fontSize:"12px",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Sign In to Watch</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main layout: playlist left, player right */}
      <div style={{ flex:1,display:"grid",gridTemplateColumns:"300px 1fr",overflow:"hidden" }}>

        {/* Left — Video playlist */}
        <div style={{ borderRight:"1px solid #f0f0f0",overflowY:"auto",background:"#fafafa" }}>
          <div style={{ padding:"10px 14px",borderBottom:"1px solid #f0f0f0",background:"#fff",position:"sticky",top:0,zIndex:1 }}>
            <div style={{ fontSize:"11px",fontWeight:700,color:"#888",letterSpacing:".08em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>Course Playlist</div>
          </div>
          {VIDEOS.map(v => (
            <div
              key={v.day}
              onClick={() => handleVideoClick(v.day)}
              className={`vid-row${activeDay === v.day ? " active" : ""}`}
              style={{ display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",cursor:"pointer",borderLeft:"3px solid transparent",borderBottom:"1px solid #f5f5f5",background:"#fff",transition:"all .15s" }}
            >
              {/* Thumbnail */}
              <div style={{ width:"52px",height:"38px",borderRadius:"6px",background:activeDay===v.day?BURG:isLoggedIn?"#e8e8e8":"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                {activeDay === v.day && isLoggedIn ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                ) : isLoggedIn ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                )}
              </div>
              {/* Info */}
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:"10px",fontWeight:600,color:activeDay===v.day?BURG:"#bbb",fontFamily:"'DM Sans',sans-serif",marginBottom:"2px" }}>Day {v.day}</div>
                <div style={{ fontSize:"12px",fontWeight:activeDay===v.day?600:400,color:activeDay===v.day?"#111":"#555",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{v.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — Video player */}
        <div style={{ display:"flex",flexDirection:"column",overflow:"hidden",background:"#fff" }}>

          {/* Player area */}
          <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:"#111",position:"relative",overflow:"hidden" }}>
            {!isLoggedIn ? (
              /* Locked state */
              <div style={{ textAlign:"center",padding:"40px" }}>
                <div style={{ width:"64px",height:"64px",borderRadius:"50%",background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:"28px" }}>🔒</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:700,color:"#fff",marginBottom:"8px" }}>Sign In to Watch</h3>
                <p style={{ fontSize:"13px",color:"rgba(255,255,255,.55)",marginBottom:"20px",fontFamily:"'DM Sans',sans-serif" }}>This is a seller-only training program</p>
                <div style={{ display:"flex",gap:"10px",justifyContent:"center" }}>
                  <Link href="/login" style={{ padding:"10px 24px",borderRadius:"8px",background:BURG,color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Sign In</Link>
                  <Link href="/register" style={{ padding:"10px 24px",borderRadius:"8px",border:"1.5px solid rgba(255,255,255,.3)",color:"#fff",fontSize:"13px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Register</Link>
                </div>
              </div>
            ) : activeVideo.url ? (
              /* Video player — iframe for YouTube/Drive/Vimeo, or video tag for MP4 */
              activeVideo.url.includes(".mp4") ? (
                <video
                  key={activeVideo.url}
                  src={activeVideo.url}
                  controls
                  style={{ width:"100%",height:"100%",objectFit:"contain" }}
                />
              ) : (
                <iframe
                  key={activeVideo.url}
                  src={activeVideo.url}
                  style={{ width:"100%",height:"100%",border:"none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )
            ) : (
              /* No URL uploaded yet */
              <div style={{ textAlign:"center",padding:"40px" }}>
                <div style={{ width:"64px",height:"64px",borderRadius:"50%",background:"rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:"28px" }}>📹</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"20px",fontWeight:600,color:"rgba(255,255,255,.9)",marginBottom:"6px" }}>Coming Soon</h3>
                <p style={{ fontSize:"13px",color:"rgba(255,255,255,.4)",fontFamily:"'DM Sans',sans-serif" }}>Day {activeVideo.day} — {activeVideo.title}</p>
              </div>
            )}
          </div>

          {/* Video info bar */}
          <div style={{ padding:"14px 20px",borderTop:"1px solid #f0f0f0",background:"#fff",flexShrink:0 }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px" }}>
              <div>
                <div style={{ fontSize:"11px",fontWeight:600,color:BURG,fontFamily:"'DM Sans',sans-serif",marginBottom:"3px" }}>Day {activeVideo.day} of 75</div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"16px",fontWeight:600,color:"#111" }}>{activeVideo.title}</div>
              </div>
              <div style={{ display:"flex",gap:"8px" }}>
                <button
                  disabled={activeDay === 1}
                  onClick={() => isLoggedIn ? setActiveDay(d => Math.max(1, d-1)) : setShowLogin(true)}
                  style={{ padding:"7px 16px",borderRadius:"7px",border:"1.5px solid #e5e5e5",background:activeDay===1?"#f5f5f5":"#fff",color:activeDay===1?"#ccc":"#333",fontSize:"12px",fontWeight:600,cursor:activeDay===1?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif" }}
                >← Prev</button>
                <button
                  disabled={activeDay === 75}
                  onClick={() => isLoggedIn ? setActiveDay(d => Math.min(75, d+1)) : setShowLogin(true)}
                  style={{ padding:"7px 16px",borderRadius:"7px",border:"1.5px solid #e5e5e5",background:activeDay===75?"#f5f5f5":"#fff",color:activeDay===75?"#ccc":"#333",fontSize:"12px",fontWeight:600,cursor:activeDay===75?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif" }}
                >Next →</button>
              </div>
            </div>
            {/* Progress bar */}
            {isLoggedIn && (
              <div style={{ marginTop:"10px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"4px" }}>
                  <span style={{ fontSize:"10px",color:"#bbb",fontFamily:"'DM Sans',sans-serif" }}>Progress</span>
                  <span style={{ fontSize:"10px",color:BURG,fontFamily:"'DM Sans',sans-serif",fontWeight:600 }}>{activeDay}/75</span>
                </div>
                <div style={{ height:"3px",background:"#f0f0f0",borderRadius:"99px",overflow:"hidden" }}>
                  <div style={{ height:"100%",background:BURG,borderRadius:"99px",width:`${(activeDay/75)*100}%`,transition:"width .3s" }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
