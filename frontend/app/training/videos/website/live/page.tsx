"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const VIDEOS = [{"id":1,"title":"Live Session 1 — Website Audit","duration":"60:00","desc":"Live review of participant websites with actionable feedback.","free":true},{"id":2,"title":"Live Session 2 — SEO Deep Dive","duration":"75:00","desc":"Live keyword research and on-page SEO for antique sites.","free":false},{"id":3,"title":"Live Session 3 — Conversion Optimisation","duration":"60:00","desc":"How to turn more visitors into buyers — live examples.","free":false},{"id":4,"title":"Live Session 4 — Q&A with Top Sellers","duration":"90:00","desc":"Panel of successful antique website sellers answer your questions.","free":false},{"id":5,"title":"Live Session 5 — Google Analytics Masterclass","duration":"60:00","desc":"Understand your traffic data and make smarter decisions.","free":false}];

function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"20px",backdropFilter:"blur(6px)" }}>
      <div style={{ background:"#fff",borderRadius:"20px",padding:"44px 36px",width:"100%",maxWidth:"400px",textAlign:"center",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:"14px",right:"16px",background:"none",border:"none",fontSize:"22px",color:"#aaa",cursor:"pointer" }}>×</button>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:700,color:"#111",marginBottom:"8px" }}>Seller Access Required</h2>
        <p style={{ fontSize:"14px",color:"#666",lineHeight:1.7,marginBottom:"24px",fontFamily:"'DM Sans',sans-serif" }}>Sign in to watch full training videos.</p>
        <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
          <Link href="/login" style={{ display:"block",padding:"13px",borderRadius:"10px",background:BURG,color:"#fff",fontSize:"14px",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Sign In to Watch</Link>
          <Link href="/register" style={{ display:"block",padding:"13px",borderRadius:"10px",border:"1.5px solid #e5e5e5",color:"#333",fontSize:"14px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Register as New Seller</Link>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); setIsLoggedIn(!!localStorage.getItem("accessToken")); }, []);
  if (!mounted) return null;
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif",background:"#fff",minHeight:"100vh",paddingTop:"68px" }}>
      <style>{`${GF}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <div style={{ background:BURG,padding:"52px 48px 44px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none" }} />
        <div style={{ maxWidth:"900px",margin:"0 auto",position:"relative" }}>
          <div style={{ display:"flex",gap:"6px",alignItems:"center",marginBottom:"16px",flexWrap:"wrap" }}>
            <Link href="/training" style={{ fontSize:"12px",color:"rgba(255,255,255,.55)",textDecoration:"none" }}>Training</Link>
            <span style={{ color:"rgba(255,255,255,.3)" }}>›</span>
            <Link href="/training/videos" style={{ fontSize:"12px",color:"rgba(255,255,255,.55)",textDecoration:"none" }}>Videos</Link>
            <span style={{ color:"rgba(255,255,255,.3)" }}>›</span>
            <Link href="/training/videos/website" style={{ fontSize:"12px",color:"rgba(255,255,255,.55)",textDecoration:"none" }}>Website</Link>
            <span style={{ color:"rgba(255,255,255,.3)" }}>›</span>
            <span style={{ fontSize:"12px",color:"rgba(255,255,255,.9)" }}>Live Training</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:700,color:"#fff",marginBottom:"10px",lineHeight:1.1 }}>Live Website Training</h1>
          <p style={{ fontSize:"15px",color:"rgba(255,255,255,.7)",fontStyle:"italic",marginBottom:"12px",fontFamily:"'Playfair Display',serif" }}>Interactive Sessions with Expert Website Sellers</p>
          <p style={{ fontSize:"14px",color:"rgba(255,255,255,.65)",lineHeight:1.75,maxWidth:"580px",fontFamily:"'DM Sans',sans-serif",marginBottom:"20px" }}>Join live coaching sessions where experts review your website and answer your questions in real time.</p>
          <div style={{ display:"flex",gap:"10px",flexWrap:"wrap" }}>
            <div style={{ padding:"5px 14px",borderRadius:"99px",background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",fontSize:"12px",color:"#fff",fontFamily:"'DM Sans',sans-serif" }}>Weekly live sessions</div>
            <div style={{ padding:"5px 14px",borderRadius:"99px",background:"rgba(34,197,94,.15)",border:"1px solid rgba(34,197,94,.3)",fontSize:"12px",color:"#4ade80",fontFamily:"'DM Sans',sans-serif" }}>1 Free Preview</div>
            <div style={{ padding:"5px 14px",borderRadius:"99px",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",fontSize:"12px",color:"rgba(255,255,255,.7)",fontFamily:"'DM Sans',sans-serif" }}>🔒 4 Seller Only</div>
          </div>
        </div>
      </div>
      {!isLoggedIn && (
        <div style={{ background:"#fff3f4",borderBottom:"1px solid rgba(155,0,32,.15)",padding:"12px 48px" }}>
          <div style={{ maxWidth:"900px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px",flexWrap:"wrap" }}>
            <div style={{ fontSize:"13px",color:BURG,fontFamily:"'DM Sans',sans-serif" }}>🔒 <strong>4 videos locked.</strong> Sign in to unlock.</div>
            <Link href="/login" style={{ padding:"7px 18px",borderRadius:"7px",background:BURG,color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Sign In</Link>
          </div>
        </div>
      )}
      <div style={{ maxWidth:"900px",margin:"0 auto",padding:"48px 48px 80px" }}>
        <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
          {VIDEOS.map((v: any) => {
            const canWatch = isLoggedIn || v.free;
            return (
              <div key={v.id} onClick={() => !canWatch && setShowLogin(true)} style={{ display:"flex",alignItems:"center",gap:"16px",padding:"16px 20px",borderRadius:"12px",border:`1.5px solid ${canWatch?"rgba(155,0,32,.1)":"#f0f0f0"}`,background:canWatch?"#fff":"#fafafa",cursor:canWatch?"default":"pointer",transition:"all .2s" }}>
                <div style={{ width:"80px",height:"56px",borderRadius:"8px",background:canWatch?BURG:"#e5e5e5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  {canWatch ? <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ display:"flex",gap:"8px",marginBottom:"4px" }}>
                    {v.free && <span style={{ fontSize:"10px",fontWeight:700,color:"#15803d",background:"#f0fdf4",padding:"2px 8px",borderRadius:"99px",fontFamily:"'DM Sans',sans-serif" }}>FREE</span>}
                    {!canWatch && <span style={{ fontSize:"10px",color:"#888",background:"#f5f5f5",padding:"2px 8px",borderRadius:"99px",fontFamily:"'DM Sans',sans-serif" }}>SELLER ONLY</span>}
                  </div>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"15px",fontWeight:600,color:canWatch?"#111":"#888",marginBottom:"3px" }}>{v.title}</div>
                  <div style={{ fontSize:"12px",color:"#aaa",fontFamily:"'DM Sans',sans-serif" }}>{v.desc}</div>
                </div>
                <div style={{ fontSize:"12px",color:"#aaa",flexShrink:0,fontFamily:"'DM Sans',sans-serif" }}>{v.duration}</div>
              </div>
            );
          })}
        </div>
        {!isLoggedIn && (
          <div style={{ marginTop:"48px",padding:"40px",borderRadius:"16px",background:BURG,textAlign:"center" }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"24px",fontWeight:700,color:"#fff",marginBottom:"10px" }}>Unlock All 4 Videos</h3>
            <p style={{ fontSize:"14px",color:"rgba(255,255,255,.75)",marginBottom:"24px",fontFamily:"'DM Sans',sans-serif" }}>Register as a seller and get instant access.</p>
            <div style={{ display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap" }}>
              <Link href="/register" style={{ padding:"12px 28px",borderRadius:"8px",background:"#fff",color:BURG,fontSize:"14px",fontWeight:700,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Register as Seller</Link>
              <Link href="/login" style={{ padding:"12px 28px",borderRadius:"8px",border:"1.5px solid rgba(255,255,255,.4)",color:"#fff",fontSize:"14px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Sign In</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
