"use client";
import { useState } from "react";
import Link from "next/link";

const BURG = "#9B0020";

type Section = "root" | "ebook" | "videos" | "website" | "amazon" |
  "website-75" | "website-live" | "website-social" |
  "amazon-75" | "amazon-live" | "amazon-social";

// ── Video URL store — edit these to update video URLs on the site ──
// These map directly to the VIDEOS arrays in each training page
// Format: YouTube embed, Google Drive preview, or direct MP4 URL
const VIDEO_URLS: Record<string, { title: string; url: string }[]> = {
  "website-75": [
    { title: "Day 1 — Domain & Hosting Setup",        url: "" },
    { title: "Day 2 — Setting Up Your Website",       url: "" },
    { title: "Day 3 — Choosing the Right Platform",   url: "" },
    { title: "Day 4 — Installing Essential Plugins",  url: "" },
    { title: "Day 5 — Website Design Fundamentals",   url: "" },
    { title: "Day 6 — Creating Your Homepage",        url: "" },
    { title: "Day 7 — About Page & Brand Story",      url: "" },
    { title: "Day 8 — Setting Up Product Categories", url: "" },
    { title: "Day 9 — Adding Your First Products",    url: "" },
    { title: "Day 10 — Product Photography for Web",  url: "" },
  ],
  "website-live": [
    { title: "Live Session 1 — Website Audit",        url: "" },
    { title: "Live Session 2 — SEO Deep Dive",        url: "" },
    { title: "Live Session 3 — Conversion Tips",      url: "" },
    { title: "Live Session 4 — Q&A with Top Sellers", url: "" },
    { title: "Live Session 5 — Google Analytics",     url: "" },
  ],
  "website-social": [
    { title: "Instagram Strategy",                    url: "" },
    { title: "Creating Reels",                        url: "" },
    { title: "Pinterest for Traffic",                 url: "" },
    { title: "YouTube Channel Setup",                 url: "" },
    { title: "Content Calendar Planning",             url: "" },
    { title: "WhatsApp Broadcast",                    url: "" },
  ],
  "amazon-75": [
    { title: "Day 1 — Amazon Seller Account Setup",   url: "" },
    { title: "Day 5 — Product Research",              url: "" },
    { title: "Day 10 — Amazon Photography",           url: "" },
    { title: "Day 15 — Listing Optimisation",         url: "" },
    { title: "Day 20 — FBA vs FBM",                   url: "" },
    { title: "Day 30 — Amazon PPC Basics",            url: "" },
    { title: "Day 45 — Managing Reviews",             url: "" },
    { title: "Day 60 — Advanced PPC",                 url: "" },
    { title: "Day 75 — Scaling to Top Seller",        url: "" },
  ],
  "amazon-live": [
    { title: "Live Session 1 — Account Health",       url: "" },
    { title: "Live Session 2 — PPC Masterclass",      url: "" },
    { title: "Live Session 3 — Listing Teardown",     url: "" },
    { title: "Live Session 4 — FBA Deep Dive",        url: "" },
    { title: "Live Session 5 — Q&A with Experts",     url: "" },
  ],
  "amazon-social": [
    { title: "Why Social Media for Amazon",           url: "" },
    { title: "Instagram Shop for Amazon",             url: "" },
    { title: "Unboxing Videos",                       url: "" },
    { title: "Influencer Collaborations",             url: "" },
    { title: "Facebook Groups",                       url: "" },
    { title: "Building a Brand Beyond Amazon",        url: "" },
  ],
};

// Breadcrumb label map
const LABELS: Record<Section, string> = {
  root:           "Content",
  ebook:          "Ebook",
  videos:         "Videos",
  website:        "Website",
  amazon:         "Amazon",
  "website-75":   "75 Days Training",
  "website-live": "Live Training",
  "website-social":"Social Media Content",
  "amazon-75":    "75 Days Training",
  "amazon-live":  "Live Training",
  "amazon-social":"Social Media Content",
};

function Breadcrumb({ path, onNav }: { path: Section[]; onNav: (s: Section) => void }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"20px", flexWrap:"wrap" }}>
      {path.map((s, i) => (
        <span key={s} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          {i < path.length - 1 ? (
            <button onClick={() => onNav(s)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"13px", color:"#aaa", fontFamily:"inherit", padding:0 }}>{LABELS[s]}</button>
          ) : (
            <span style={{ fontSize:"13px", fontWeight:600, color:"#111" }}>{LABELS[s]}</span>
          )}
          {i < path.length - 1 && <span style={{ color:"#ddd", fontSize:"13px" }}>›</span>}
        </span>
      ))}
    </div>
  );
}

function Card({ icon, title, desc, onClick, count, color }: { icon:string; title:string; desc:string; onClick:()=>void; count?:number; color?:string }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ padding:"24px", borderRadius:"14px", border:`1.5px solid ${hov?BURG:"#f0f0f0"}`, background:hov?"#fff8f8":"#fff", cursor:"pointer", transition:"all .2s", transform:hov?"translateY(-2px)":"none", boxShadow:hov?`0 8px 24px rgba(155,0,32,.08)`:"none" }}
    >
      <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:color||`rgba(155,0,32,.07)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", marginBottom:"14px" }}>{icon}</div>
      <div style={{ fontSize:"16px", fontWeight:700, color:"#111", marginBottom:"4px", fontFamily:"Georgia,serif" }}>{title}</div>
      <div style={{ fontSize:"13px", color:"#888" }}>{desc}</div>
      {count !== undefined && <div style={{ marginTop:"10px", fontSize:"12px", fontWeight:600, color:BURG }}>{count} items</div>}
    </div>
  );
}

function VideoManager({ sectionKey }: { sectionKey: string }) {
  const videos = VIDEO_URLS[sectionKey] || [];
  const [urls, setUrls] = useState<Record<number, string>>(
    Object.fromEntries(videos.map((v, i) => [i, v.url]))
  );
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  const save = (i: number) => {
    setSaved(p => ({ ...p, [i]: true }));
    setTimeout(() => setSaved(p => ({ ...p, [i]: false })), 2000);
    // In production: call API to save URL to database
    // api.patch(`/admin/content/${sectionKey}/${i}`, { url: urls[i] })
  };

  const uploaded = Object.values(urls).filter(u => u.trim() !== "").length;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px", padding:"12px 16px", borderRadius:"10px", background:"#f9f9f9", border:"1px solid #f0f0f0" }}>
        <div style={{ flex:1, fontSize:"13px", color:"#666" }}>
          <strong style={{ color:"#111" }}>{uploaded}</strong> of <strong style={{ color:"#111" }}>{videos.length}</strong> videos uploaded
        </div>
        <div style={{ height:"6px", background:"#f0f0f0", borderRadius:"99px", flex:2, overflow:"hidden" }}>
          <div style={{ height:"100%", background:BURG, borderRadius:"99px", width:`${videos.length>0?(uploaded/videos.length)*100:0}%`, transition:"width .3s" }} />
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
        {videos.map((v, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 14px", borderRadius:"10px", border:"1px solid #f0f0f0", background:"#fff" }}>
            <div style={{ width:"36px", height:"36px", borderRadius:"8px", background:urls[i]?`rgba(155,0,32,.08)`:"#f5f5f5", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {urls[i] ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BURG} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
              )}
            </div>
            <div style={{ fontSize:"13px", fontWeight:500, color:"#333", minWidth:"200px", flexShrink:0 }}>{v.title}</div>
            <input
              value={urls[i] || ""}
              onChange={e => setUrls(p => ({ ...p, [i]: e.target.value }))}
              placeholder="Paste YouTube / Google Drive / MP4 URL here"
              style={{ flex:1, padding:"8px 12px", borderRadius:"8px", border:"1.5px solid #f0f0f0", fontSize:"12px", fontFamily:"inherit", outline:"none", color:"#333" }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = BURG}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#f0f0f0"}
            />
            <button onClick={() => save(i)} style={{ padding:"7px 16px", borderRadius:"7px", background:saved[i]?"#f0fdf4":BURG, color:saved[i]?"#15803d":"#fff", border:saved[i]?"1px solid #bbf7d0":"none", fontSize:"12px", fontWeight:600, cursor:"pointer", fontFamily:"inherit", flexShrink:0, transition:"all .2s" }}>
              {saved[i] ? "✓ Saved" : "Save"}
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop:"16px", padding:"12px 16px", borderRadius:"10px", background:"#f9f9f9", border:"1px solid #f0f0f0", fontSize:"12px", color:"#888" }}>
        💡 <strong>Supported formats:</strong> YouTube embed (youtube.com/embed/ID) · Google Drive (drive.google.com/file/d/ID/preview) · Direct MP4 URL
      </div>
    </div>
  );
}

function EbookManager() {
  const [bookCover, setBookCover]   = useState("");
  const [amazonLink, setAmazonLink] = useState("https://www.amazon.in/ZERO-INVENTORY-EMPIRE-VIPUL-KUMAR-ARYA/dp/9376503139");
  const [price, setPrice]           = useState("179");
  const [mrp, setMrp]               = useState("199");
  const [saved, setSaved]           = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"14px", maxWidth:"600px" }}>
      <div style={{ padding:"16px", borderRadius:"12px", border:"1px solid #f0f0f0", background:"#fff" }}>
        <div style={{ fontSize:"13px", fontWeight:700, color:"#111", marginBottom:"14px" }}>Book Cover Image</div>
        <div style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
          <div style={{ width:"80px", height:"110px", borderRadius:"8px", overflow:"hidden", background:"#f5f5f5", border:"1px solid #eee", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {bookCover ? <img src={bookCover} alt="cover" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:"24px" }}>📖</span>}
          </div>
          <div style={{ flex:1 }}>
            <label style={{ fontSize:"11px", fontWeight:600, color:"#888", display:"block", marginBottom:"5px" }}>Cover Image URL</label>
            <input value={bookCover} onChange={e => setBookCover(e.target.value)} placeholder="/images/book-cover.jpg or full URL" style={{ width:"100%", padding:"8px 12px", borderRadius:"8px", border:"1.5px solid #f0f0f0", fontSize:"12px", fontFamily:"inherit", outline:"none" }} />
            <div style={{ fontSize:"11px", color:"#aaa", marginTop:"5px" }}>Place image in frontend/public/images/ and use /images/filename.jpg</div>
          </div>
        </div>
      </div>

      {[
        ["Amazon Buy Link", amazonLink, setAmazonLink, "https://www.amazon.in/..."],
        ["Price (₹)", price, setPrice, "179"],
        ["MRP (₹)", mrp, setMrp, "199"],
      ].map(([label, value, setter, placeholder]) => (
        <div key={String(label)} style={{ padding:"14px 16px", borderRadius:"12px", border:"1px solid #f0f0f0", background:"#fff" }}>
          <label style={{ fontSize:"12px", fontWeight:600, color:"#888", display:"block", marginBottom:"6px" }}>{String(label)}</label>
          <input value={String(value)} onChange={e => (setter as any)(e.target.value)} placeholder={String(placeholder)} style={{ width:"100%", padding:"9px 12px", borderRadius:"8px", border:"1.5px solid #f0f0f0", fontSize:"13px", fontFamily:"inherit", outline:"none" }} />
        </div>
      ))}

      <button onClick={save} style={{ padding:"11px 24px", borderRadius:"9px", background:saved?"#f0fdf4":BURG, color:saved?"#15803d":"#fff", border:saved?"1px solid #bbf7d0":"none", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"inherit", width:"fit-content" }}>
        {saved ? "✓ Settings Saved" : "Save Ebook Settings"}
      </button>
    </div>
  );
}

export default function AdminContentPage() {
  const [section, setSection] = useState<Section>("root");
  const [path, setPath]       = useState<Section[]>(["root"]);

  const nav = (s: Section, addToPath = true) => {
    setSection(s);
    if (addToPath) {
      setPath(prev => {
        const idx = prev.indexOf(s);
        if (idx !== -1) return prev.slice(0, idx + 1);
        return [...prev, s];
      });
    }
  };

  const goTo = (s: Section) => {
    setSection(s);
    const idx = path.indexOf(s);
    setPath(prev => prev.slice(0, idx + 1));
  };

  return (
    <div style={{ maxWidth:"1000px" }}>
      <div style={{ marginBottom:"24px", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontSize:"12px", color:"#9ca3af", letterSpacing:".1em", textTransform:"uppercase", marginBottom:"4px" }}>Admin</p>
          <h1 style={{ fontSize:"26px", fontFamily:"Georgia,serif", color:"#111", fontWeight:400 }}>Content Management</h1>
          <p style={{ fontSize:"13px", color:"#aaa", marginTop:"3px" }}>Manage training videos and ebook for sellers</p>
        </div>
        <Link href="/training" target="_blank" style={{ padding:"9px 18px", borderRadius:"8px", border:`1.5px solid rgba(155,0,32,.2)`, color:BURG, fontSize:"12px", fontWeight:600, textDecoration:"none" }}>
          Preview Training Page →
        </Link>
      </div>

      <Breadcrumb path={path} onNav={goTo} />

      {/* ROOT — Ebook + Videos */}
      {section === "root" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
          <Card icon="📖" title="Ebook" desc="Manage book cover, Amazon link, price and details" onClick={() => nav("ebook")} />
          <Card icon="🎬" title="Videos" desc="Manage all training videos for Website and Amazon tracks" onClick={() => nav("videos")} count={Object.values(VIDEO_URLS).flat().filter(v => v.url).length} />
        </div>
      )}

      {/* EBOOK */}
      {section === "ebook" && <EbookManager />}

      {/* VIDEOS — Website + Amazon */}
      {section === "videos" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
          <Card icon="🌐" title="Website" desc="75 Days Training, Live Training, Social Media Content" onClick={() => nav("website")} color="rgba(14,116,144,.07)" />
          <Card icon="📦" title="Amazon" desc="75 Days Training, Live Training, Social Media Content" onClick={() => nav("amazon")} color="rgba(146,64,14,.07)" />
        </div>
      )}

      {/* WEBSITE — 3 tracks */}
      {section === "website" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {[
            { key:"website-75",     icon:"📅", title:"75 Days Training",    desc:"75 structured daily videos for website sellers",  total:75 },
            { key:"website-live",   icon:"🔴", title:"Live Training",        desc:"Interactive live session recordings",               total:5  },
            { key:"website-social", icon:"📱", title:"Social Media Content", desc:"Product images, videos and manufacturing content",  total:6  },
          ].map(t => {
            const uploaded = (VIDEO_URLS[t.key] || []).filter(v => v.url).length;
            return (
              <div key={t.key} onClick={() => nav(t.key as Section)} style={{ display:"flex", alignItems:"center", gap:"16px", padding:"18px 20px", borderRadius:"12px", border:"1.5px solid #f0f0f0", background:"#fff", cursor:"pointer", transition:"all .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = BURG; (e.currentTarget as HTMLElement).style.background = "#fff8f8"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#f0f0f0"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}
              >
                <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:`rgba(155,0,32,.07)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{t.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"15px", fontWeight:600, color:"#111", marginBottom:"3px" }}>{t.title}</div>
                  <div style={{ fontSize:"12px", color:"#888" }}>{t.desc}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:"13px", fontWeight:700, color:uploaded>0?BURG:"#ccc" }}>{uploaded}/{t.total}</div>
                  <div style={{ fontSize:"11px", color:"#aaa" }}>uploaded</div>
                </div>
                <span style={{ color:"#ccc", fontSize:"18px" }}>›</span>
              </div>
            );
          })}
        </div>
      )}

      {/* AMAZON — 3 tracks */}
      {section === "amazon" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {[
            { key:"amazon-75",     icon:"📅", title:"75 Days Training",    desc:"75 structured daily videos for Amazon sellers", total:75 },
            { key:"amazon-live",   icon:"🔴", title:"Live Training",       desc:"Interactive live session recordings",             total:5  },
            { key:"amazon-social", icon:"📱", title:"Social Media Content",desc:"Content strategy for Amazon success",             total:6  },
          ].map(t => {
            const uploaded = (VIDEO_URLS[t.key] || []).filter(v => v.url).length;
            return (
              <div key={t.key} onClick={() => nav(t.key as Section)} style={{ display:"flex", alignItems:"center", gap:"16px", padding:"18px 20px", borderRadius:"12px", border:"1.5px solid #f0f0f0", background:"#fff", cursor:"pointer", transition:"all .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = BURG; (e.currentTarget as HTMLElement).style.background = "#fff8f8"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#f0f0f0"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}
              >
                <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:`rgba(155,0,32,.07)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{t.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"15px", fontWeight:600, color:"#111", marginBottom:"3px" }}>{t.title}</div>
                  <div style={{ fontSize:"12px", color:"#888" }}>{t.desc}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:"13px", fontWeight:700, color:uploaded>0?BURG:"#ccc" }}>{uploaded}/{t.total}</div>
                  <div style={{ fontSize:"11px", color:"#aaa" }}>uploaded</div>
                </div>
                <span style={{ color:"#ccc", fontSize:"18px" }}>›</span>
              </div>
            );
          })}
        </div>
      )}

      {/* VIDEO MANAGERS — all 6 sections */}
      {["website-75","website-live","website-social","amazon-75","amazon-live","amazon-social"].includes(section) && (
        <VideoManager sectionKey={section} />
      )}
    </div>
  );
}
