"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const BURG = "#9B0020";
const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ── This single component handles all 6 tracks ───────────────
// /training/videos/website/75-days
// /training/videos/website/live
// /training/videos/website/social-media
// /training/videos/amazon/75-days
// /training/videos/amazon/live
// /training/videos/amazon/social-media
// ─────────────────────────────────────────────────────────────

const TRACK_DATA: Record<string, Record<string, {
  title: string; subtitle: string; desc: string;
  videos: { day?: number; title: string; duration: string; desc: string; free: boolean }[];
}>> = {
  website: {
    "75-days": {
      title: "75 Days Website Training",
      subtitle: "Website · 75 Days Program",
      desc: "A complete day-by-day program to build, launch, and grow your antique website from zero to your first sale.",
      videos: [
        { day: 1,  title: "Domain & Hosting Setup",          duration: "18:24", desc: "Register your domain, choose hosting, and get your site online.", free: true  },
        { day: 5,  title: "Website Design Fundamentals",     duration: "24:10", desc: "Create a professional-looking antique store that builds trust.", free: false },
        { day: 10, title: "Product Photography for Web",     duration: "31:45", desc: "Shoot and edit product photos that sell.", free: false },
        { day: 15, title: "Writing Product Descriptions",    duration: "22:08", desc: "SEO-friendly, compelling descriptions that convert browsers to buyers.", free: false },
        { day: 20, title: "Payment Gateway Integration",     duration: "19:33", desc: "Set up Razorpay, UPI and COD on your website.", free: false },
        { day: 30, title: "SEO for Antique Websites",        duration: "28:17", desc: "Rank on Google for antique-related searches.", free: false },
        { day: 45, title: "Running Your First Ad Campaign",  duration: "26:52", desc: "Facebook and Google ads for antique sellers — step by step.", free: false },
        { day: 60, title: "Customer Service & Returns",      duration: "23:06", desc: "Handle customers, returns, and reviews professionally.", free: false },
        { day: 75, title: "Scaling to ₹1 Lakh/Month",       duration: "35:20", desc: "Strategies to grow your website revenue consistently.", free: false },
      ],
    },
    live: {
      title: "Live Website Training Sessions",
      subtitle: "Website · Live Training",
      desc: "Interactive live sessions with website experts. Ask questions, get real-time feedback on your website.",
      videos: [
        { title: "Live Session 1 — Website Audit",              duration: "60:00", desc: "Live review of participant websites with actionable feedback.", free: true  },
        { title: "Live Session 2 — SEO Deep Dive",              duration: "75:00", desc: "Live keyword research and on-page SEO for antique sites.", free: false },
        { title: "Live Session 3 — Conversion Optimisation",    duration: "60:00", desc: "How to turn more visitors into buyers.", free: false },
        { title: "Live Session 4 — Q&A with Top Sellers",       duration: "90:00", desc: "Panel of successful antique website sellers answer your questions.", free: false },
        { title: "Live Session 5 — Google Analytics Masterclass",duration: "60:00", desc: "Understand your traffic data and make smarter decisions.", free: false },
      ],
    },
    "social-media": {
      title: "Social Media Content for Website",
      subtitle: "Website · Social Media Content",
      desc: "Create engaging social media content that drives traffic to your antique website.",
      videos: [
        { title: "Instagram Strategy for Antique Sellers",   duration: "24:10", desc: "Build an Instagram presence that drives website sales.", free: true  },
        { title: "Creating Reels for Your Antique Business", duration: "18:24", desc: "Shoot and edit professional reels on your phone.", free: false },
        { title: "Pinterest for Antique Traffic",            duration: "22:08", desc: "Use Pinterest to drive long-term website visitors.", free: false },
        { title: "YouTube Channel Setup & Growth",           duration: "31:45", desc: "Start a YouTube channel that positions you as an expert.", free: false },
        { title: "Content Calendar Planning",                duration: "19:33", desc: "Plan 30 days of content in 2 hours.", free: false },
        { title: "WhatsApp Broadcast for Sellers",           duration: "16:38", desc: "Build and leverage a WhatsApp broadcast list.", free: false },
      ],
    },
  },
  amazon: {
    "75-days": {
      title: "75 Days Amazon Training",
      subtitle: "Amazon · 75 Days Program",
      desc: "Master the complete Amazon seller journey — from account registration to becoming a top-rated seller in 75 days.",
      videos: [
        { day: 1,  title: "Amazon Seller Account Setup",        duration: "18:24", desc: "Register, verify, and configure your Amazon seller account.", free: true  },
        { day: 5,  title: "Product Research & Selection",       duration: "24:10", desc: "Find winning antique products with high demand and low competition.", free: false },
        { day: 10, title: "Amazon-Compliant Photography",       duration: "31:45", desc: "Meet Amazon's strict image requirements and stand out.", free: false },
        { day: 15, title: "Listing Optimisation & Keywords",    duration: "22:08", desc: "Write titles, bullets, and descriptions that rank.", free: false },
        { day: 20, title: "FBA vs FBM — Which to Choose",       duration: "19:33", desc: "Decide the right fulfilment strategy for antique products.", free: false },
        { day: 30, title: "Amazon PPC Advertising Basics",      duration: "28:17", desc: "Run your first Sponsored Products campaign profitably.", free: false },
        { day: 45, title: "Managing Reviews & A-to-Z Claims",   duration: "26:52", desc: "Handle reviews, complaints, and Amazon claims like a pro.", free: false },
        { day: 60, title: "Advanced PPC & ACoS Reduction",      duration: "23:06", desc: "Scale your ads while reducing advertising cost.", free: false },
        { day: 75, title: "Scaling to Top 100 Seller",          duration: "35:20", desc: "The exact strategies to hit consistent ₹5L+ monthly on Amazon.", free: false },
      ],
    },
    live: {
      title: "Live Amazon Training Sessions",
      subtitle: "Amazon · Live Training",
      desc: "Live coaching sessions with top Amazon sellers. Get your listings reviewed and questions answered in real time.",
      videos: [
        { title: "Live Session 1 — Account Health Review",     duration: "60:00", desc: "Live audit of participant accounts with expert feedback.", free: true  },
        { title: "Live Session 2 — PPC Masterclass",           duration: "90:00", desc: "Live campaign building and optimisation.", free: false },
        { title: "Live Session 3 — Listing Teardown",          duration: "75:00", desc: "Expert review of real antique listings — what works and what doesn't.", free: false },
        { title: "Live Session 4 — FBA Deep Dive",             duration: "60:00", desc: "Fulfilment strategy, inventory planning, and fee calculation.", free: false },
        { title: "Live Session 5 — Q&A with Amazon Experts",   duration: "90:00", desc: "Open Q&A with sellers doing ₹1Cr+ on Amazon annually.", free: false },
      ],
    },
    "social-media": {
      title: "Social Media Content for Amazon",
      subtitle: "Amazon · Social Media Content",
      desc: "Build a social media presence that drives external traffic to your Amazon listings and builds brand trust.",
      videos: [
        { title: "Why Social Media Matters for Amazon",        duration: "18:24", desc: "How social proof and external traffic boost your Amazon rank.", free: true  },
        { title: "Instagram Shop Setup for Amazon Sellers",    duration: "24:10", desc: "Link Instagram to drive Amazon sales.", free: false },
        { title: "Unboxing Videos That Convert",               duration: "22:08", desc: "Create unboxing content that builds trust and drives reviews.", free: false },
        { title: "Influencer Collaborations on a Budget",      duration: "19:33", desc: "Partner with micro-influencers to boost your Amazon listings.", free: false },
        { title: "Facebook Groups for Antique Sellers",        duration: "16:38", desc: "Use Facebook communities to find buyers and build your brand.", free: false },
        { title: "Building a Brand Beyond Amazon",             duration: "28:17", desc: "Why and how to build a brand that survives Amazon algorithm changes.", free: false },
      ],
    },
  },
};

function VideoCard({ v, index, isLoggedIn, onLockClick }: { v: any; index: number; isLoggedIn: boolean; onLockClick: () => void }) {
  const canWatch = isLoggedIn || v.free;
  const [hov, setHov] = useState(false);

  return (
    <div onClick={() => !canWatch && onLockClick()} style={{ display: "flex", gap: "16px", padding: "16px", borderRadius: "12px", border: `1.5px solid ${hov ? BURG : "rgba(155,0,32,.1)"}`, background: hov ? "#fff3f4" : "#fff", cursor: canWatch ? "default" : "pointer", transition: "all .2s" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: "72px", height: "54px", borderRadius: "8px", background: canWatch ? BURG : "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "20px" }}>
        {canWatch ? "▶" : "🔒"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
          {v.day && <span style={{ fontSize: "10px", fontWeight: 700, color: BURG, background: `rgba(155,0,32,.08)`, padding: "2px 8px", borderRadius: "99px", fontFamily: "'DM Sans',sans-serif" }}>Day {v.day}</span>}
          {v.free && <span style={{ fontSize: "10px", fontWeight: 700, color: "#15803d", background: "#f0fdf4", padding: "2px 8px", borderRadius: "99px", fontFamily: "'DM Sans',sans-serif" }}>FREE</span>}
          <span style={{ fontSize: "11px", color: "#aaa", marginLeft: "auto", fontFamily: "'DM Sans',sans-serif" }}>{v.duration}</span>
        </div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "14px", fontWeight: 600, color: "#111", marginBottom: "3px", lineHeight: 1.3 }}>{v.title}</div>
        <div style={{ fontSize: "12px", color: "#888", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>{v.desc}</div>
      </div>
    </div>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.52)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#fff", borderRadius: "20px", padding: "48px 40px", width: "100%", maxWidth: "420px", textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,.18)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "18px", background: "none", border: "none", fontSize: "22px", color: "#aaa", cursor: "pointer" }}>×</button>
        <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: BURG, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🎬</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "24px", fontWeight: 700, color: "#111", marginBottom: "10px" }}>Seller Access Required</h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "#666", lineHeight: 1.7, marginBottom: "28px" }}>Sign in to your verified seller account to watch full training videos.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/login" style={{ display: "block", padding: "13px", borderRadius: "10px", background: BURG, color: "#fff", fontSize: "14px", fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Sign In to Watch →</Link>
          <Link href="/register" style={{ display: "block", padding: "13px", borderRadius: "10px", border: "1.5px solid #e5e5e5", color: "#333", fontSize: "14px", fontWeight: 500, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Register as New Seller</Link>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage({ params }: { params: { platform: string; track: string } }) {
  const { platform, track } = params;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  const data = TRACK_DATA[platform]?.[track];
  if (!data) return <div style={{ padding: "120px 48px", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>Track not found</div>;

  const freeCount = data.videos.filter(v => v.free).length;

  if (!mounted) return null;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#fff", minHeight: "100vh", paddingTop: "68px" }}>
      <style>{`${GF}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Header */}
      <div style={{ background: BURG, padding: "60px 48px 52px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
            <Link href="/training" style={{ fontSize: "12px", color: "rgba(255,255,255,.6)", textDecoration: "none" }}>Training</Link>
            <span style={{ color: "rgba(255,255,255,.3)" }}>›</span>
            <Link href="/training/videos" style={{ fontSize: "12px", color: "rgba(255,255,255,.6)", textDecoration: "none" }}>Videos</Link>
            <span style={{ color: "rgba(255,255,255,.3)" }}>›</span>
            <Link href={`/training/videos/${platform}`} style={{ fontSize: "12px", color: "rgba(255,255,255,.6)", textDecoration: "none", textTransform: "capitalize" }}>{platform}</Link>
            <span style={{ color: "rgba(255,255,255,.3)" }}>›</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,.9)", textTransform: "capitalize" }}>{track.replace(/-/g, " ")}</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 700, color: "#fff", marginBottom: "10px", lineHeight: 1.1 }}>{data.title}</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,.75)", lineHeight: 1.75, maxWidth: "600px", fontFamily: "'DM Sans',sans-serif", marginBottom: "20px" }}>{data.desc}</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ padding: "5px 14px", borderRadius: "99px", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", fontSize: "12px", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
              {data.videos.length} Videos
            </div>
            <div style={{ padding: "5px 14px", borderRadius: "99px", background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.3)", fontSize: "12px", color: "#4ade80", fontFamily: "'DM Sans',sans-serif" }}>
              {freeCount} Free
            </div>
          </div>
        </div>
      </div>

      {/* Video list */}
      <section style={{ padding: "60px 48px", maxWidth: "900px", margin: "0 auto" }}>
        {!isLoggedIn && (
          <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", borderRadius: "12px", background: "#fff3f4", border: `1px solid rgba(155,0,32,.2)`, marginBottom: "28px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "20px" }}>🔒</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: BURG, marginBottom: "2px", fontFamily: "'DM Sans',sans-serif" }}>Unlock all {data.videos.length - freeCount} locked videos</div>
              <div style={{ fontSize: "13px", color: "#c0392b", fontFamily: "'DM Sans',sans-serif" }}>Sign in to your seller account to access the full training library</div>
            </div>
            <Link href="/login" style={{ padding: "8px 20px", borderRadius: "8px", background: BURG, color: "#fff", fontSize: "13px", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" }}>Sign In →</Link>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {data.videos.map((v, i) => (
            <VideoCard key={i} v={v} index={i} isLoggedIn={isLoggedIn} onLockClick={() => setShowLogin(true)} />
          ))}
        </div>

        {/* Bottom CTA */}
        {!isLoggedIn && (
          <div style={{ marginTop: "48px", padding: "40px", borderRadius: "16px", background: BURG, textAlign: "center" }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>Ready to unlock all videos?</h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,.75)", marginBottom: "24px", fontFamily: "'DM Sans',sans-serif" }}>Register as a seller and get instant access to the complete training library.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/register" style={{ padding: "12px 28px", borderRadius: "8px", background: "#fff", color: BURG, fontSize: "14px", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Register as Seller →</Link>
              <Link href="/login" style={{ padding: "12px 28px", borderRadius: "8px", border: "1.5px solid rgba(255,255,255,.4)", color: "#fff", fontSize: "14px", fontWeight: 500, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Already a Seller? Sign In</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
