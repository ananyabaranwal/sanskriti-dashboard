"use client";

import { useState, useEffect, useRef } from "react";
import DashPageWrapper from "../DashPageWrapper";

// ── Types ─────────────────────────────────────────────────────
type Video = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string; // "12:34"
  durationSec: number;
  thumbnail: string;
  url: string; // hosted video URL or YouTube embed
  isYoutube: boolean;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
};

// ── Mock video library (replace URLs with your real videos) ───
const ALL_VIDEOS: Video[] = [
  {
    id: "v1",
    title: "How to Authenticate Antique Brass Items",
    description: "Learn the 5-point authentication process for brass antiques — patina check, weight test, hallmark reading, acid test, and UV inspection.",
    category: "Authentication",
    duration: "14:22",
    durationSec: 862,
    thumbnail: "",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isYoutube: true,
    level: "Beginner",
    tags: ["brass","authentication","patina"],
  },
  {
    id: "v2",
    title: "Photography Tips for Listing Antiques",
    description: "Master natural lighting, angles, and close-up shots to make your antique listings stand out and sell faster.",
    category: "Photography",
    duration: "18:05",
    durationSec: 1085,
    thumbnail: "",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isYoutube: true,
    level: "Beginner",
    tags: ["photography","listing","lighting"],
  },
  {
    id: "v3",
    title: "GST Invoicing for Antique Sellers",
    description: "Step-by-step guide to generating GST-compliant invoices, understanding CGST vs IGST, and filing returns as an antique dealer.",
    category: "GST & Billing",
    duration: "22:18",
    durationSec: 1338,
    thumbnail: "",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isYoutube: true,
    level: "Intermediate",
    tags: ["gst","invoice","tax"],
  },
  {
    id: "v4",
    title: "Pricing Strategy for Antiques",
    description: "How to price your antiques using market research, condition grading, rarity assessment, and competitor analysis.",
    category: "Business",
    duration: "16:44",
    durationSec: 1004,
    thumbnail: "",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isYoutube: true,
    level: "Intermediate",
    tags: ["pricing","strategy","valuation"],
  },
  {
    id: "v5",
    title: "Packing & Shipping Fragile Antiques",
    description: "Professional packing techniques to prevent damage — bubble wrap, foam inserts, double boxing, and choosing the right courier.",
    category: "Shipping",
    duration: "11:30",
    durationSec: 690,
    thumbnail: "",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isYoutube: true,
    level: "Beginner",
    tags: ["shipping","packing","fragile"],
  },
  {
    id: "v6",
    title: "Identifying Fake vs Real Mughal Art",
    description: "Expert techniques to distinguish genuine Mughal miniature paintings from reproductions — paper age, pigment analysis, and brushwork.",
    category: "Authentication",
    duration: "28:10",
    durationSec: 1690,
    thumbnail: "",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isYoutube: true,
    level: "Advanced",
    tags: ["mughal","art","authentication","miniature"],
  },
  {
    id: "v7",
    title: "Building Buyer Trust Online",
    description: "How to write compelling descriptions, respond to buyer queries, and build a 5-star seller reputation on the platform.",
    category: "Business",
    duration: "13:55",
    durationSec: 835,
    thumbnail: "",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isYoutube: true,
    level: "Beginner",
    tags: ["trust","communication","reputation"],
  },
  {
    id: "v8",
    title: "Cleaning & Restoration Basics",
    description: "Safe cleaning methods for wood, metal, ceramic, and textile antiques without reducing their value or damaging surfaces.",
    category: "Restoration",
    duration: "19:48",
    durationSec: 1188,
    thumbnail: "",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isYoutube: true,
    level: "Intermediate",
    tags: ["cleaning","restoration","preservation"],
  },
  {
    id: "v9",
    title: "Using the Sanskriti Dashboard — Full Walkthrough",
    description: "Complete tutorial on using your seller dashboard — creating orders, generating invoices, managing wallet, and tracking payouts.",
    category: "Platform",
    duration: "24:00",
    durationSec: 1440,
    thumbnail: "",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isYoutube: true,
    level: "Beginner",
    tags: ["dashboard","tutorial","platform"],
  },
];

const CATEGORIES = ["All", "Authentication", "Photography", "GST & Billing", "Business", "Shipping", "Restoration", "Platform"];
const LEVELS     = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const levelColor = (l: string) => ({
  Beginner:     { bg:"#F0FDF4", color:"#15803d", border:"#BBF7D0" },
  Intermediate: { bg:"#FFFBEB", color:"#854d0e", border:"#FDE68A" },
  Advanced:     { bg:"#FEF2F2", color:"#dc2626", border:"#FECACA" },
}[l] || { bg:"#F5E6C8", color:"#6B4F12", border:"#E8D5A3" });

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ── Video Player Modal ────────────────────────────────────────
function VideoPlayer({
  video, watched, onClose, onWatched,
}: {
  video: Video;
  watched: boolean;
  onClose: () => void;
  onWatched: (id: string) => void;
}) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [markingWatched, setMarkingWatched] = useState(false);
  const markedRef = useRef(false);

  // Auto-mark watched at 80% progress
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(pct);
    setCurrentTime(Math.floor(videoRef.current.currentTime));
    if (pct >= 80 && !markedRef.current) {
      markedRef.current = true;
      setMarkingWatched(true);
      setTimeout(() => {
        onWatched(video.id);
        setMarkingWatched(false);
      }, 600);
    }
  };

  const handleManualWatch = () => {
    if (!watched) onWatched(video.id);
  };

  const lc = levelColor(video.level);

  return (
    <div onClick={(e) => { if(e.target===e.currentTarget) onClose(); }} style={{position:"fixed",inset:0,background:"rgba(20,10,5,.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:"20px",backdropFilter:"blur(8px)"}}>
      <div style={{background:"#1A0F0A",borderRadius:"20px",width:"100%",maxWidth:"860px",overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,.7)",animation:"scaleIn .3s ease",border:"1px solid rgba(201,168,76,.12)"}}>

        {/* Player header */}
        <div style={{padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(201,168,76,.1)"}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:"15px",fontWeight:600,color:"#F5E6C8",fontFamily:"Georgia,serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{video.title}</div>
            <div style={{display:"flex",gap:"8px",alignItems:"center",marginTop:"4px",flexWrap:"wrap"}}>
              <span style={{fontSize:"11px",color:"rgba(201,168,76,.6)"}}>{video.category}</span>
              <span style={{width:"3px",height:"3px",borderRadius:"50%",background:"rgba(201,168,76,.3)"}}/>
              <span style={{fontSize:"11px",color:"rgba(201,168,76,.6)"}}>{video.duration}</span>
              <span style={{padding:"2px 7px",borderRadius:"99px",fontSize:"10px",fontWeight:700,background:lc.bg,color:lc.color,border:`1px solid ${lc.border}`}}>{video.level}</span>
              {watched && <span style={{padding:"2px 7px",borderRadius:"99px",fontSize:"10px",fontWeight:700,background:"#F0FDF4",color:"#15803d",border:"1px solid #BBF7D0"}}>✓ Watched</span>}
            </div>
          </div>
          <button onClick={onClose} style={{width:"32px",height:"32px",borderRadius:"50%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(201,168,76,.15)",color:"#C9A84C",fontSize:"18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",flexShrink:0,marginLeft:"14px"}}>×</button>
        </div>

        {/* Video embed */}
        <div style={{position:"relative",paddingBottom:video.isYoutube?"56.25%":"0",height:video.isYoutube?0:"auto",background:"#000"}}>
          {video.isYoutube ? (
            <iframe
              src={`${video.url}?rel=0&modestbranding=1&autoplay=1`}
              style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              ref={videoRef}
              src={video.url}
              controls
              autoPlay
              onTimeUpdate={handleTimeUpdate}
              style={{width:"100%",maxHeight:"480px",display:"block",background:"#000"}}
            />
          )}
        </div>

        {/* Progress bar (HTML5 video only) */}
        {!video.isYoutube && (
          <div style={{padding:"10px 22px 0",background:"#1A0F0A"}}>
            <div style={{height:"4px",background:"rgba(201,168,76,.15)",borderRadius:"2px",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#C9A84C,#8B6914)",borderRadius:"2px",transition:"width .3s"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"11px",color:"rgba(201,168,76,.4)",marginTop:"4px"}}>
              <span>{formatTime(currentTime)}</span>
              <span>{video.duration}</span>
            </div>
          </div>
        )}

        {/* Description + actions */}
        <div style={{padding:"16px 22px 20px",background:"#1A0F0A"}}>
          <p style={{fontSize:"13px",color:"rgba(245,230,200,.55)",lineHeight:1.7,marginBottom:"14px"}}>{video.description}</p>
          <div style={{display:"flex",gap:"10px",alignItems:"center",flexWrap:"wrap"}}>
            {/* Tags */}
            <div style={{display:"flex",gap:"6px",flex:1,flexWrap:"wrap"}}>
              {video.tags.slice(0,4).map(tag => (
                <span key={tag} style={{padding:"3px 9px",borderRadius:"99px",background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.15)",color:"rgba(201,168,76,.7)",fontSize:"11px"}}>{tag}</span>
              ))}
            </div>
            {/* Mark watched */}
            {!video.isYoutube && (
              <button onClick={handleManualWatch} disabled={watched||markingWatched} style={{padding:"8px 18px",borderRadius:"8px",background:watched?"#F0FDF4":"rgba(201,168,76,.1)",border:`1px solid ${watched?"#BBF7D0":"rgba(201,168,76,.25)"}`,color:watched?"#15803d":"#C9A84C",fontSize:"12px",fontWeight:700,cursor:watched?"default":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"6px",transition:"all .2s"}}>
                {watched?"✓ Watched":"Mark as Watched"}
              </button>
            )}
            {video.isYoutube && !watched && (
              <button onClick={handleManualWatch} style={{padding:"8px 18px",borderRadius:"8px",background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.25)",color:"#C9A84C",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"6px"}}>
                ✓ Mark as Watched
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Video Card ────────────────────────────────────────────────
function VideoCard({ video, watched, onPlay }: { video:Video; watched:boolean; onPlay:(v:Video)=>void }) {
  const [hovered, setHovered] = useState(false);
  const lc = levelColor(video.level);
  const categoryColors: Record<string,string> = {
    "Authentication":"#8b5cf6","Photography":"#3b82f6","GST & Billing":"#f59e0b",
    "Business":"#10b981","Shipping":"#6366f1","Restoration":"#ec4899","Platform":"#C9A84C",
  };
  const catColor = categoryColors[video.category] || "#C9A84C";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onPlay(video)}
      style={{background:"#FFFDF9",border:`1px solid ${hovered?"rgba(201,168,76,.5)":"#E8D5A3"}`,borderRadius:"14px",overflow:"hidden",cursor:"pointer",transition:"all .22s ease",transform:hovered?"translateY(-3px)":"none",boxShadow:hovered?"0 10px 28px rgba(61,43,31,.12)":"0 2px 8px rgba(61,43,31,.04)",position:"relative"}}
    >
      {/* Thumbnail / placeholder */}
      <div style={{height:"160px",background:`linear-gradient(135deg, #2C1810, #3D2B1F)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        {/* Category colour stripe at top */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:catColor}}/>
        {/* Dot pattern */}
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}/>
        {/* Play button */}
        <div style={{width:"52px",height:"52px",borderRadius:"50%",background:hovered?"rgba(201,168,76,.25)":"rgba(201,168,76,.12)",border:`2px solid ${hovered?"rgba(201,168,76,.6)":"rgba(201,168,76,.25)"}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
          <div style={{width:0,height:0,borderTop:"10px solid transparent",borderBottom:"10px solid transparent",borderLeft:`18px solid ${hovered?"#C9A84C":"rgba(201,168,76,.6)"}`,marginLeft:"4px",transition:"all .2s"}}/>
        </div>
        {/* Duration badge */}
        <div style={{position:"absolute",bottom:"10px",right:"10px",padding:"3px 8px",borderRadius:"6px",background:"rgba(0,0,0,.65)",color:"#F5E6C8",fontSize:"11px",fontWeight:600}}>{video.duration}</div>
        {/* Watched badge */}
        {watched && (
          <div style={{position:"absolute",top:"10px",right:"10px",width:"24px",height:"24px",borderRadius:"50%",background:"#15803d",border:"2px solid #FFFDF9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",color:"#fff",fontWeight:700}}>✓</div>
        )}
        {/* Category pill */}
        <div style={{position:"absolute",top:"10px",left:"10px",padding:"3px 8px",borderRadius:"99px",background:`${catColor}22`,border:`1px solid ${catColor}44`,color:catColor,fontSize:"10px",fontWeight:700}}>{video.category}</div>
      </div>

      {/* Card body */}
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"8px",marginBottom:"7px"}}>
          <h3 style={{fontSize:"14px",fontWeight:600,color:"#2C1810",lineHeight:1.3,flex:1,fontFamily:"Georgia,serif"}}>{video.title}</h3>
          <span style={{padding:"2px 7px",borderRadius:"99px",fontSize:"10px",fontWeight:700,background:lc.bg,color:lc.color,border:`1px solid ${lc.border}`,flexShrink:0}}>{video.level}</span>
        </div>
        <p style={{fontSize:"12px",color:"#A08060",lineHeight:1.55,marginBottom:"12px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{video.description}</p>
        <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
          {video.tags.slice(0,3).map(tag => (
            <span key={tag} style={{padding:"2px 8px",borderRadius:"99px",background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.15)",color:"#8B6914",fontSize:"10px"}}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel]       = useState("All Levels");
  const [search, setSearch]                 = useState("");
  const [playingVideo, setPlayingVideo]     = useState<Video|null>(null);
  const [watched, setWatched]               = useState<Set<string>>(new Set());

  // Load watched from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sanskriti_watched") || "[]");
      setWatched(new Set(saved));
    } catch {}
  }, []);

  const markWatched = (id: string) => {
    setWatched(prev => {
      const next = new Set(prev).add(id);
      localStorage.setItem("sanskriti_watched", JSON.stringify([...next]));
      return next;
    });
    // Update playing video watched state
    if (playingVideo?.id === id) {
      setPlayingVideo(prev => prev ? { ...prev } : null);
    }
  };

  // Filter videos
  const filtered = ALL_VIDEOS.filter(v => {
    const matchCat   = activeCategory === "All" || v.category === activeCategory;
    const matchLevel = activeLevel === "All Levels" || v.level === activeLevel;
    const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.tags.some(t => t.includes(search.toLowerCase()));
    return matchCat && matchLevel && matchSearch;
  });

  const watchedCount = ALL_VIDEOS.filter(v => watched.has(v.id)).length;
  const progressPct  = Math.round((watchedCount / ALL_VIDEOS.length) * 100);

  return (
    <DashPageWrapper>
    <div style={{maxWidth:"1100px"}}>

      {playingVideo && (
        <VideoPlayer
          video={playingVideo}
          watched={watched.has(playingVideo.id)}
          onClose={() => setPlayingVideo(null)}
          onWatched={markWatched}
        />
      )}

      {/* Page header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
        <div>
          <p style={{fontSize:"12px",color:"#A08060",letterSpacing:".1em",textTransform:"uppercase",marginBottom:"4px"}}>Learn</p>
          <h1 style={{fontSize:"26px",fontFamily:"Georgia,serif",color:"#2C1810",fontWeight:400}}>Training Videos</h1>
          <p style={{fontSize:"14px",color:"#A08060",marginTop:"3px"}}>{ALL_VIDEOS.length} videos · Free access for verified sellers</p>
        </div>
        {/* Overall progress */}
        <div style={{background:"#FFFDF9",border:"1px solid #E8D5A3",borderRadius:"14px",padding:"14px 18px",minWidth:"200px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
            <span style={{fontSize:"12px",fontWeight:600,color:"#2C1810"}}>Your Progress</span>
            <span style={{fontSize:"13px",fontWeight:700,color:"#8B6914",fontFamily:"Georgia,serif"}}>{watchedCount}/{ALL_VIDEOS.length}</span>
          </div>
          <div style={{height:"6px",background:"#F0E4C0",borderRadius:"3px",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${progressPct}%`,background:"linear-gradient(90deg,#C9A84C,#8B6914)",borderRadius:"3px",transition:"width .4s ease"}}/>
          </div>
          <div style={{fontSize:"11px",color:"#A08060",marginTop:"5px"}}>{progressPct}% complete</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"12px",marginBottom:"24px"}}>
        {[
          {icon:"🎬",label:"Total Videos",  value:String(ALL_VIDEOS.length),   color:"rgba(201,168,76,.1)"},
          {icon:"✅",label:"Watched",        value:String(watchedCount),         color:"rgba(16,185,129,.1)"},
          {icon:"⏳",label:"Remaining",      value:String(ALL_VIDEOS.length-watchedCount), color:"rgba(59,130,246,.1)"},
          {icon:"🏆",label:"Progress",       value:`${progressPct}%`,            color:"rgba(139,92,246,.1)"},
        ].map(s => (
          <div key={s.label} style={{background:"#FFFDF9",border:"1px solid #E8D5A3",borderRadius:"14px",padding:"15px 18px"}}>
            <div style={{width:"34px",height:"34px",borderRadius:"9px",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",marginBottom:"9px"}}>{s.icon}</div>
            <div style={{fontSize:"20px",fontWeight:700,color:"#2C1810",fontFamily:"Georgia,serif",lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:"11px",color:"#A08060",marginTop:"4px"}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:"16px"}}>
        <span style={{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",fontSize:"15px",pointerEvents:"none"}}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search videos by title or topic..."
          style={{width:"100%",padding:"11px 14px 11px 40px",borderRadius:"10px",border:"1.5px solid #E8D5A3",fontSize:"14px",color:"#2C1810",background:"#FFFDF9",outline:"none",fontFamily:"inherit",transition:"border-color .2s"}}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{position:"absolute",right:"14px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:"18px",color:"#A08060",padding:0,lineHeight:1}}>×</button>
        )}
      </div>

      {/* Category filter tabs */}
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{padding:"7px 14px",borderRadius:"99px",border:`1.5px solid ${activeCategory===cat?"#C9A84C":"#E8D5A3"}`,background:activeCategory===cat?"linear-gradient(135deg,#C9A84C,#8B6914)":"transparent",color:activeCategory===cat?"#2C1810":"#6B4F12",fontSize:"12px",fontWeight:activeCategory===cat?700:500,cursor:"pointer",fontFamily:"inherit",transition:"all .18s"}}>
            {cat}
          </button>
        ))}
      </div>

      {/* Level filter */}
      <div style={{display:"flex",gap:"6px",marginBottom:"24px",flexWrap:"wrap"}}>
        {LEVELS.map(level => (
          <button key={level} onClick={() => setActiveLevel(level)} style={{padding:"5px 12px",borderRadius:"8px",border:`1px solid ${activeLevel===level?"#C9A84C":"#E8D5A3"}`,background:activeLevel===level?"rgba(201,168,76,.1)":"transparent",color:activeLevel===level?"#8B6914":"#A08060",fontSize:"12px",fontWeight:activeLevel===level?600:400,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
            {level}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
        <p style={{fontSize:"13px",color:"#A08060"}}>
          {filtered.length === ALL_VIDEOS.length ? `All ${ALL_VIDEOS.length} videos` : `${filtered.length} of ${ALL_VIDEOS.length} videos`}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </p>
        {(activeCategory !== "All" || activeLevel !== "All Levels" || search) && (
          <button onClick={() => { setActiveCategory("All"); setActiveLevel("All Levels"); setSearch(""); }} style={{fontSize:"12px",color:"#8B6914",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"inherit"}}>Clear filters ×</button>
        )}
      </div>

      {/* Video grid */}
      {filtered.length === 0 ? (
        <div style={{textAlign:"center",padding:"60px 20px",background:"#FFFDF9",border:"1px solid #E8D5A3",borderRadius:"16px"}}>
          <div style={{fontSize:"44px",marginBottom:"14px"}}>🎬</div>
          <p style={{fontSize:"16px",fontWeight:500,color:"#2C1810",marginBottom:"6px"}}>No videos found</p>
          <p style={{fontSize:"13px",color:"#A08060",marginBottom:"16px"}}>Try different filters or search terms</p>
          <button onClick={() => { setActiveCategory("All"); setActiveLevel("All Levels"); setSearch(""); }} style={{padding:"9px 20px",borderRadius:"8px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",color:"#2C1810",border:"none",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Show All Videos</button>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"18px"}}>
          {filtered.map(video => (
            <VideoCard key={video.id} video={video} watched={watched.has(video.id)} onPlay={setPlayingVideo}/>
          ))}
        </div>
      )}

      {/* Completion banner */}
      {watchedCount === ALL_VIDEOS.length && (
        <div style={{marginTop:"28px",background:"linear-gradient(135deg,#2C1810,#3D2B1F)",borderRadius:"16px",padding:"24px 28px",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)",backgroundSize:"20px 20px",pointerEvents:"none"}}/>
          <div style={{position:"relative"}}>
            <div style={{fontSize:"36px",marginBottom:"10px"}}>🏆</div>
            <h3 style={{fontSize:"20px",fontFamily:"Georgia,serif",color:"#C9A84C",marginBottom:"6px"}}>Training Complete!</h3>
            <p style={{fontSize:"14px",color:"rgba(245,230,200,.6)"}}>You have watched all {ALL_VIDEOS.length} training videos. You are now a certified Sanskriti seller!</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        input::placeholder{color:#C4A882;}
        input:focus{border-color:#C9A84C !important;}
      `}</style>
    </div>
    </DashPageWrapper>
  );
}
