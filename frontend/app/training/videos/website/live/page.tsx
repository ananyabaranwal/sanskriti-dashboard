"use client";
import Link from "next/link";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

export default function Page() {
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", height:"100vh", overflow:"hidden", display:"flex", flexDirection:"column", paddingTop:"68px" }}>
      <style>{`${GF}*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {/* Narrow white header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", padding:"10px 24px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px" }}>
          <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
            <Link href="/training" style={{ fontSize:"11px", color:"#aaa", textDecoration:"none" }}>Training</Link>
            <span style={{ color:"#ddd", fontSize:"11px" }}>›</span>
            <Link href="/training/videos" style={{ fontSize:"11px", color:"#aaa", textDecoration:"none" }}>Videos</Link>
            <span style={{ color:"#ddd", fontSize:"11px" }}>›</span>
            <Link href="/training/videos/website" style={{ fontSize:"11px", color:"#aaa", textDecoration:"none" }}>Website</Link>
            <span style={{ color:"#ddd", fontSize:"11px" }}>›</span>
            <span style={{ fontSize:"11px", color:"#555" }}>Live Training</span>
          </div>
          <span style={{ padding:"3px 10px", borderRadius:"99px", background:`rgba(155,0,32,.07)`, border:`1px solid rgba(155,0,32,.15)`, fontSize:"11px", fontWeight:600, color:BURG, fontFamily:"'DM Sans',sans-serif" }}>Live Training</span>
        </div>
      </div>

      {/* Coming Soon — full height centered */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:"#fff", padding:"48px" }}>
        <div style={{ textAlign:"center", maxWidth:"480px" }}>
          {/* Animated dot */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"24px" }}>
            <span style={{ width:"10px", height:"10px", borderRadius:"50%", background:BURG, display:"inline-block", animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:"12px", fontWeight:600, color:BURG, letterSpacing:".14em", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>Live Sessions</span>
          </div>

          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,5vw,52px)", fontWeight:700, color:"#111", lineHeight:1.1, marginBottom:"16px" }}>
            Coming Soon
          </h1>
          <p style={{ fontSize:"15px", color:"#888", lineHeight:1.8, fontFamily:"'DM Sans',sans-serif", marginBottom:"32px" }}>
            Live website training sessions are being scheduled. Register as a seller to get notified when sessions go live — interactive coaching, Q&A, and website reviews.
          </p>

          <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/register" style={{ padding:"12px 28px", borderRadius:"8px", background:BURG, color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none", fontFamily:"'DM Sans',sans-serif" }}>
              Register to Get Notified →
            </Link>
            <Link href="/training/videos/website/75-days" style={{ padding:"12px 28px", borderRadius:"8px", border:"1.5px solid #e5e5e5", color:"#333", fontSize:"14px", fontWeight:500, textDecoration:"none", fontFamily:"'DM Sans',sans-serif" }}>
              Watch 75 Days Training
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}`}</style>
    </div>
  );
}
