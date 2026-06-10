"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const CONTENT: Record<string, Record<string, {
  title: string;
  tagline: string;
  desc: string;
  duration: string;
  videos: { id: number; title: string; duration: string; desc: string; free: boolean }[];
}>> = {
  website: {
    "75-days": {
      title: "75 Days Website Training",
      tagline: "From Zero to Your First Sale in 75 Days",
      desc: "A complete day-by-day structured program to build, launch, and grow your antique website. Follow the exact steps our top sellers used to generate ₹1L+ per month.",
      duration: "75 days · 40+ videos",
      videos: [
        { id:1,  title:"Day 1 — Domain & Hosting Setup",         duration:"18:24", desc:"Register your domain, choose hosting, and get your site live today.", free:true  },
        { id:2,  title:"Day 5 — Website Design Fundamentals",    duration:"24:10", desc:"Create a professional antique store that builds instant trust.", free:false },
        { id:3,  title:"Day 10 — Product Photography for Web",   duration:"31:45", desc:"Shoot and edit product photos that sell on mobile and desktop.", free:false },
        { id:4,  title:"Day 15 — Writing Product Descriptions",  duration:"22:08", desc:"SEO-friendly, compelling descriptions that convert browsers to buyers.", free:false },
        { id:5,  title:"Day 20 — Payment Gateway Integration",   duration:"19:33", desc:"Set up Razorpay, UPI and COD on your website in one session.", free:false },
        { id:6,  title:"Day 30 — SEO for Antique Websites",      duration:"28:17", desc:"Rank on Google for antique-related searches and drive free traffic.", free:false },
        { id:7,  title:"Day 45 — Running Your First Ad Campaign", duration:"26:52", desc:"Facebook and Google ads for antique sellers — step by step.", free:false },
        { id:8,  title:"Day 60 — Customer Service & Returns",    duration:"23:06", desc:"Handle customers, returns, and reviews professionally.", free:false },
        { id:9,  title:"Day 75 — Scaling to ₹1 Lakh/Month",     duration:"35:20", desc:"Strategies to grow your website revenue consistently.", free:false },
      ],
    },
    live: {
      title: "Live Website Training",
      tagline: "Interactive Sessions with Expert Website Sellers",
      desc: "Join live coaching sessions where experts review your website, answer your questions in real time, and help you fix issues instantly.",
      duration: "Weekly live sessions",
      videos: [
        { id:1, title:"Live Session 1 — Website Audit",               duration:"60:00", desc:"Live review of participant websites with actionable feedback.", free:true  },
        { id:2, title:"Live Session 2 — SEO Deep Dive",               duration:"75:00", desc:"Live keyword research and on-page SEO for antique sites.", free:false },
        { id:3, title:"Live Session 3 — Conversion Optimisation",     duration:"60:00", desc:"How to turn more visitors into buyers — live examples.", free:false },
        { id:4, title:"Live Session 4 — Q&A with Top Sellers",        duration:"90:00", desc:"Panel of successful antique website sellers answer your questions.", free:false },
        { id:5, title:"Live Session 5 — Google Analytics Masterclass",duration:"60:00", desc:"Understand your traffic data and make smarter decisions.", free:false },
      ],
    },
    "social-media": {
      title: "Social Media Content for Website",
      tagline: "Build an Audience That Drives Website Sales",
      desc: "Create engaging social media content that brings targeted traffic to your antique website and converts followers into buyers.",
      duration: "6 modules · 20+ videos",
      videos: [
        { id:1, title:"Instagram Strategy for Antique Sellers",   duration:"24:10", desc:"Build an Instagram presence that drives website sales.", free:true  },
        { id:2, title:"Creating Reels for Your Antique Business", duration:"18:24", desc:"Shoot and edit professional reels on your phone.", free:false },
        { id:3, title:"Pinterest for Antique Traffic",            duration:"22:08", desc:"Use Pinterest to drive long-term website visitors.", free:false },
        { id:4, title:"YouTube Channel Setup & Growth",           duration:"31:45", desc:"Start a YouTube channel that positions you as an expert.", free:false },
        { id:5, title:"Content Calendar Planning",                duration:"19:33", desc:"Plan 30 days of content in 2 hours.", free:false },
        { id:6, title:"WhatsApp Broadcast for Sellers",           duration:"16:38", desc:"Build and leverage a WhatsApp broadcast list of buyers.", free:false },
      ],
    },
  },
  amazon: {
    "75-days": {
      title: "75 Days Amazon Training",
      tagline: "From Account Setup to Top-Rated Amazon Seller",
      desc: "Master the complete Amazon seller journey in 75 days. From registering your account to running profitable ad campaigns — the exact playbook our top Amazon sellers follow.",
      duration: "75 days · 40+ videos",
      videos: [
        { id:1, title:"Day 1 — Amazon Seller Account Setup",       duration:"18:24", desc:"Register, verify, and configure your Amazon seller account.", free:true  },
        { id:2, title:"Day 5 — Product Research & Selection",      duration:"24:10", desc:"Find winning antique products with high demand and low competition.", free:false },
        { id:3, title:"Day 10 — Amazon-Compliant Photography",     duration:"31:45", desc:"Meet Amazon's strict image requirements and stand out.", free:false },
        { id:4, title:"Day 15 — Listing Optimisation & Keywords",  duration:"22:08", desc:"Write titles, bullets, and descriptions that rank on Amazon.", free:false },
        { id:5, title:"Day 20 — FBA vs FBM — Which to Choose",    duration:"19:33", desc:"Decide the right fulfilment strategy for antique products.", free:false },
        { id:6, title:"Day 30 — Amazon PPC Advertising Basics",    duration:"28:17", desc:"Run your first Sponsored Products campaign profitably.", free:false },
        { id:7, title:"Day 45 — Managing Reviews & Claims",        duration:"26:52", desc:"Handle reviews, complaints, and Amazon A-to-Z claims.", free:false },
        { id:8, title:"Day 60 — Advanced PPC & ACoS Reduction",   duration:"23:06", desc:"Scale your ads while reducing advertising cost of sales.", free:false },
        { id:9, title:"Day 75 — Scaling to Top 100 Seller",       duration:"35:20", desc:"The exact strategies to hit ₹5L+ monthly on Amazon.", free:false },
      ],
    },
    live: {
      title: "Live Amazon Training",
      tagline: "Real-Time Coaching from Top Amazon Sellers",
      desc: "Live coaching sessions where Amazon experts review your listings, audit your account health, and help you grow your sales in real time.",
      duration: "Weekly live sessions",
      videos: [
        { id:1, title:"Live Session 1 — Account Health Review",  duration:"60:00", desc:"Live audit of participant accounts with expert feedback.", free:true  },
        { id:2, title:"Live Session 2 — PPC Masterclass",        duration:"90:00", desc:"Live campaign building and optimisation — hands on.", free:false },
        { id:3, title:"Live Session 3 — Listing Teardown",       duration:"75:00", desc:"Expert review of real antique listings — what works, what doesn't.", free:false },
        { id:4, title:"Live Session 4 — FBA Deep Dive",          duration:"60:00", desc:"Fulfilment strategy, inventory planning, and fee calculation.", free:false },
        { id:5, title:"Live Session 5 — Q&A with Amazon Experts",duration:"90:00", desc:"Open Q&A with sellers doing ₹1Cr+ on Amazon annually.", free:false },
      ],
    },
    "social-media": {
      title: "Social Media Content for Amazon",
      tagline: "Drive External Traffic to Boost Your Amazon Rank",
      desc: "Build a social media presence that sends external traffic to your Amazon listings, improves your BSR, and builds the brand trust that converts browsers into buyers.",
      duration: "6 modules · 20+ videos",
      videos: [
        { id:1, title:"Why Social Media Matters for Amazon",       duration:"18:24", desc:"How external traffic boosts your Amazon rank and BSR.", free:true  },
        { id:2, title:"Instagram Shop Setup for Amazon Sellers",   duration:"24:10", desc:"Link Instagram to drive direct Amazon sales.", free:false },
        { id:3, title:"Unboxing Videos That Convert",              duration:"22:08", desc:"Create unboxing content that builds trust and drives reviews.", free:false },
        { id:4, title:"Influencer Collaborations on a Budget",     duration:"19:33", desc:"Partner with micro-influencers to boost your Amazon listings.", free:false },
        { id:5, title:"Facebook Groups for Antique Sellers",       duration:"16:38", desc:"Use communities to find buyers and build your brand.", free:false },
        { id:6, title:"Building a Brand Beyond Amazon",            duration:"28:17", desc:"Why and how to build a brand that survives algorithm changes.", free:false },
      ],
    },
  },
};

function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"20px",backdropFilter:"blur(6px)" }}>
      <div style={{ background:"#fff",borderRadius:"20px",padding:"44px 36px",width:"100%",maxWidth:"400px",textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,.15)",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:"14px",right:"16px",background:"none",border:"none",fontSize:"22px",color:"#aaa",cursor:"pointer" }}>×</button>
        <div style={{ width:"56px",height:"56px",borderRadius:"50%",background:BURG,margin:"0 auto 18px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px" }}>🎬</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:700,color:"#111",marginBottom:"8px" }}>Seller Access Required</h2>
        <p style={{ fontSize:"14px",color:"#666",lineHeight:1.7,marginBottom:"24px",fontFamily:"'DM Sans',sans-serif" }}>Sign in to your verified seller account to watch full training videos.</p>
        <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
          <Link href="/login" style={{ display:"block",padding:"13px",borderRadius:"10px",background:BURG,color:"#fff",fontSize:"14px",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Sign In to Watch →</Link>
          <Link href="/register" style={{ display:"block",padding:"13px",borderRadius:"10px",border:"1.5px solid #e5e5e5",color:"#333",fontSize:"14px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Register as New Seller</Link>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  const params = useParams();
  const platform = params?.platform as string;
  const track    = params?.track as string;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin,  setShowLogin]  = useState(false);
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  const data = CONTENT[platform]?.[track];
  if (!data) return <div style={{ padding:"120px 48px",textAlign:"center",fontFamily:"'DM Sans',sans-serif",color:"#888" }}>Page not found</div>;

  const freeCount   = data.videos.filter(v => v.free).length;
  const lockedCount = data.videos.length - freeCount;

  if (!mounted) return null;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#fff", minHeight:"100vh", paddingTop:"68px" }}>
      <style>{`${GF}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Header */}
      <div style={{ background:BURG, padding:"52px 48px 44px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none" }} />
        <div style={{ maxWidth:"900px", margin:"0 auto", position:"relative" }}>
          <div style={{ display:"flex",gap:"6px",alignItems:"center",marginBottom:"16px",flexWrap:"wrap" }}>
            <Link href="/training" style={{ fontSize:"12px",color:"rgba(255,255,255,.55)",textDecoration:"none" }}>Training</Link>
            <span style={{ color:"rgba(255,255,255,.3)" }}>›</span>
            <Link href="/training/videos" style={{ fontSize:"12px",color:"rgba(255,255,255,.55)",textDecoration:"none" }}>Videos</Link>
            <span style={{ color:"rgba(255,255,255,.3)" }}>›</span>
            <Link href={`/training/videos/${platform}`} style={{ fontSize:"12px",color:"rgba(255,255,255,.55)",textDecoration:"none",textTransform:"capitalize" }}>{platform}</Link>
            <span style={{ color:"rgba(255,255,255,.3)" }}>›</span>
            <span style={{ fontSize:"12px",color:"rgba(255,255,255,.9)",textTransform:"capitalize" }}>{track.replace(/-/g," ")}</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:700,color:"#fff",marginBottom:"10px",lineHeight:1.1 }}>{data.title}</h1>
          <p style={{ fontSize:"15px",color:"rgba(255,255,255,.7)",fontStyle:"italic",marginBottom:"12px",fontFamily:"'Playfair Display',serif" }}>{data.tagline}</p>
          <p style={{ fontSize:"14px",color:"rgba(255,255,255,.65)",lineHeight:1.75,maxWidth:"580px",fontFamily:"'DM Sans',sans-serif",marginBottom:"20px" }}>{data.desc}</p>
          <div style={{ display:"flex",gap:"10px",flexWrap:"wrap" }}>
            <div style={{ padding:"5px 14px",borderRadius:"99px",background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",fontSize:"12px",color:"#fff",fontFamily:"'DM Sans',sans-serif" }}>{data.duration}</div>
            <div style={{ padding:"5px 14px",borderRadius:"99px",background:"rgba(34,197,94,.15)",border:"1px solid rgba(34,197,94,.3)",fontSize:"12px",color:"#4ade80",fontFamily:"'DM Sans',sans-serif" }}>{freeCount} Free Preview</div>
            <div style={{ padding:"5px 14px",borderRadius:"99px",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",fontSize:"12px",color:"rgba(255,255,255,.7)",fontFamily:"'DM Sans',sans-serif" }}>🔒 {lockedCount} Seller Only</div>
          </div>
        </div>
      </div>

      {/* Login banner */}
      {!isLoggedIn && (
        <div style={{ background:"#fff3f4",borderBottom:`1px solid rgba(155,0,32,.15)`,padding:"12px 48px" }}>
          <div style={{ maxWidth:"900px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px",flexWrap:"wrap" }}>
            <div style={{ fontSize:"13px",color:BURG,fontFamily:"'DM Sans',sans-serif" }}>
              🔒 <strong>{lockedCount} videos locked.</strong> Sign in to your seller account to unlock the full training.
            </div>
            <Link href="/login" style={{ padding:"7px 18px",borderRadius:"7px",background:BURG,color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif" }}>Sign In →</Link>
          </div>
        </div>
      )}

      {/* Video list */}
      <div style={{ maxWidth:"900px",margin:"0 auto",padding:"48px 48px 80px" }}>
        <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
          {data.videos.map((v, i) => {
            const canWatch = isLoggedIn || v.free;
            return (
              <div key={v.id} onClick={() => !canWatch && setShowLogin(true)}
                style={{ display:"flex",alignItems:"center",gap:"16px",padding:"16px 20px",borderRadius:"12px",border:`1.5px solid ${canWatch ? "rgba(155,0,32,.1)" : "#f0f0f0"}`,background:canWatch?"#fff":"#fafafa",cursor:canWatch?"default":"pointer",transition:"all .2s" }}
                onMouseEnter={e => { if (!canWatch) (e.currentTarget as HTMLElement).style.borderColor = BURG; }}
                onMouseLeave={e => { if (!canWatch) (e.currentTarget as HTMLElement).style.borderColor = "#f0f0f0"; }}
              >
                {/* Thumbnail */}
                <div style={{ width:"80px",height:"56px",borderRadius:"8px",background:canWatch?BURG:"#e5e5e5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  {canWatch ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px",flexWrap:"wrap" }}>
                    {v.free && <span style={{ fontSize:"10px",fontWeight:700,color:"#15803d",background:"#f0fdf4",padding:"2px 8px",borderRadius:"99px",fontFamily:"'DM Sans',sans-serif" }}>FREE</span>}
                    {!canWatch && <span style={{ fontSize:"10px",fontWeight:700,color:"#888",background:"#f5f5f5",padding:"2px 8px",borderRadius:"99px",fontFamily:"'DM Sans',sans-serif" }}>🔒 SELLER ONLY</span>}
                  </div>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"15px",fontWeight:600,color:canWatch?"#111":"#888",marginBottom:"3px",lineHeight:1.3 }}>{v.title}</div>
                  <div style={{ fontSize:"12px",color:"#aaa",fontFamily:"'DM Sans',sans-serif" }}>{v.desc}</div>
                </div>

                {/* Duration */}
                <div style={{ fontSize:"12px",color:"#aaa",fontFamily:"'DM Sans',sans-serif",flexShrink:0 }}>{v.duration}</div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        {!isLoggedIn && (
          <div style={{ marginTop:"48px",padding:"40px",borderRadius:"16px",background:BURG,textAlign:"center",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)",backgroundSize:"24px 24px",pointerEvents:"none" }} />
            <div style={{ position:"relative" }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"24px",fontWeight:700,color:"#fff",marginBottom:"10px" }}>Unlock All {lockedCount} Videos</h3>
              <p style={{ fontSize:"14px",color:"rgba(255,255,255,.75)",marginBottom:"24px",fontFamily:"'DM Sans',sans-serif" }}>Register as a seller and get instant access to the complete training library.</p>
              <div style={{ display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap" }}>
                <Link href="/register" style={{ padding:"12px 28px",borderRadius:"8px",background:"#fff",color:BURG,fontSize:"14px",fontWeight:700,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Register as Seller →</Link>
                <Link href="/login" style={{ padding:"12px 28px",borderRadius:"8px",border:"1.5px solid rgba(255,255,255,.4)",color:"#fff",fontSize:"14px",fontWeight:500,textDecoration:"none",fontFamily:"'DM Sans',sans-serif" }}>Already a Seller? Sign In</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
