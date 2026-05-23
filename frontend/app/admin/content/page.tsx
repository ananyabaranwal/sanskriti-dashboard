"use client";

import { useState } from "react";

type Video = {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  url: string;
  published: boolean;
  views: number;
  description: string;
};

const MOCK_VIDEOS: Video[] = [
  { id:"v1", title:"How to Authenticate Antique Brass Items",   category:"Authentication", level:"Beginner",     duration:"14:22", url:"", published:true,  views:124, description:"Learn the 5-point authentication process for brass antiques." },
  { id:"v2", title:"Photography Tips for Listing Antiques",      category:"Photography",   level:"Beginner",     duration:"18:05", url:"", published:true,  views:98,  description:"Master natural lighting, angles, and close-up shots." },
  { id:"v3", title:"GST Invoicing for Antique Sellers",          category:"GST & Billing", level:"Intermediate", duration:"22:18", url:"", published:true,  views:211, description:"Step-by-step guide to generating GST-compliant invoices." },
  { id:"v4", title:"Pricing Strategy for Antiques",              category:"Business",      level:"Intermediate", duration:"16:44", url:"", published:true,  views:87,  description:"How to price using market research and condition grading." },
  { id:"v5", title:"Packing & Shipping Fragile Antiques",        category:"Shipping",      level:"Beginner",     duration:"11:30", url:"", published:false, views:0,   description:"Professional packing techniques to prevent damage." },
  { id:"v6", title:"Identifying Fake vs Real Mughal Art",        category:"Authentication",level:"Advanced",      duration:"28:10", url:"", published:true,  views:176, description:"Expert techniques to distinguish genuine Mughal paintings." },
  { id:"v7", title:"Building Buyer Trust Online",                category:"Business",      level:"Beginner",     duration:"13:55", url:"", published:true,  views:143, description:"How to write compelling descriptions and build reputation." },
  { id:"v8", title:"Cleaning & Restoration Basics",              category:"Restoration",   level:"Intermediate", duration:"19:48", url:"", published:false, views:0,   description:"Safe cleaning methods for wood, metal, and ceramic antiques." },
  { id:"v9", title:"Using the Sanskriti Dashboard — Full Walkthrough", category:"Platform", level:"Beginner",   duration:"24:00", url:"", published:true,  views:302, description:"Complete tutorial on using your seller dashboard." },
];

const CATEGORIES = ["All","Authentication","Photography","GST & Billing","Business","Shipping","Restoration","Platform"];

function Toast({ msg, type, onClose }: { msg:string; type:"success"|"error"; onClose:()=>void }) {
  return (
    <div style={{position:"fixed",top:"24px",right:"24px",zIndex:9999,padding:"12px 16px",borderRadius:"12px",background:type==="success"?"#F0FDF4":"#FEF2F2",border:`1px solid ${type==="success"?"#BBF7D0":"#FECACA"}`,color:type==="success"?"#15803d":"#dc2626",fontSize:"13px",fontWeight:500,boxShadow:"0 6px 24px rgba(0,0,0,.1)",display:"flex",alignItems:"center",gap:"10px",maxWidth:"360px",animation:"slideDown .3s ease",fontFamily:"inherit"}}>
      <span>{type==="success"?"✅":"❌"}</span><span style={{flex:1}}>{msg}</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:"17px",color:"inherit",padding:0,opacity:.6}}>×</button>
    </div>
  );
}

function AddVideoModal({ onClose, onSave }: { onClose:()=>void; onSave:(v:Partial<Video>)=>void }) {
  const [form, setForm] = useState({ title:"", category:"Authentication", level:"Beginner" as Video["level"], duration:"", url:"", description:"" });
  const inp: React.CSSProperties = { width:"100%", padding:"10px 13px", borderRadius:"8px", border:"1.5px solid #E8D5A3", fontSize:"14px", color:"#2C1810", background:"#FBF7F0", outline:"none", fontFamily:"inherit" };
  const lbl: React.CSSProperties = { fontSize:"11px", fontWeight:700, color:"#6B4F12", display:"block", marginBottom:"4px", letterSpacing:".04em", textTransform:"uppercase" };

  const handleSave = () => {
    if (!form.title || !form.url) return;
    onSave({ ...form, id:`v${Date.now()}`, published:false, views:0 });
    onClose();
  };

  return (
    <div onClick={(e)=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(44,24,16,.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:"20px",backdropFilter:"blur(6px)"}}>
      <div style={{background:"#FFFDF9",borderRadius:"20px",width:"100%",maxWidth:"500px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 28px 72px rgba(44,24,16,.45)",animation:"scaleIn .3s ease"}}>
        <div style={{background:"linear-gradient(135deg,#1A0F0A,#2C1810)",padding:"20px 28px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"20px 20px 0 0"}}>
          <div>
            <h2 style={{fontSize:"18px",fontFamily:"Georgia,serif",color:"#F5E6C8",fontWeight:400}}>Add Training Video</h2>
            <p style={{fontSize:"12px",color:"rgba(245,230,200,.5)",marginTop:"2px"}}>Saved as draft — publish when ready</p>
          </div>
          <button onClick={onClose} style={{width:"30px",height:"30px",borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"none",color:"#C9A84C",fontSize:"17px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>×</button>
        </div>
        <div style={{padding:"22px 28px",display:"flex",flexDirection:"column",gap:"14px"}}>
          <div><label style={lbl}>Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Video title" style={inp}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            <div><label style={lbl}>Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{...inp,cursor:"pointer"}}>
                {CATEGORIES.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Level</label>
              <select value={form.level} onChange={e=>setForm({...form,level:e.target.value as Video["level"]})} style={{...inp,cursor:"pointer"}}>
                {["Beginner","Intermediate","Advanced"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div><label style={lbl}>Video URL * (YouTube embed or MP4)</label><input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://youtube.com/embed/... or https://..." style={inp}/></div>
          <div><label style={lbl}>Duration (e.g. 14:22)</label><input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} placeholder="MM:SS" style={inp}/></div>
          <div><label style={lbl}>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Brief description of the video..." rows={3} style={{...inp,resize:"none"}}/></div>
          <div style={{display:"flex",gap:"10px"}}>
            <button onClick={onClose} style={{flex:1,padding:"11px",borderRadius:"8px",border:"1.5px solid #E8D5A3",background:"transparent",color:"#6B4F12",fontSize:"14px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
            <button onClick={handleSave} disabled={!form.title||!form.url} style={{flex:2,padding:"11px",borderRadius:"8px",background:!form.title||!form.url?"#E8D5A3":"linear-gradient(135deg,#C9A84C,#8B6914)",color:!form.title||!form.url?"#A08060":"#2C1810",border:"none",fontSize:"14px",fontWeight:700,cursor:!form.title||!form.url?"not-allowed":"pointer",fontFamily:"inherit"}}>
              Save as Draft →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminContentPage() {
  const [videos, setVideos]           = useState<Video[]>(MOCK_VIDEOS);
  const [category, setCategory]       = useState("All");
  const [search, setSearch]           = useState("");
  const [showAdd, setShowAdd]         = useState(false);
  const [toast, setToast]             = useState<{msg:string;type:"success"|"error"}|null>(null);

  const showToast = (msg:string,type:"success"|"error"="success")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),4000); };

  const togglePublish = (id:string) => {
    setVideos(prev=>prev.map(v=>v.id===id?{...v,published:!v.published}:v));
    const v = videos.find(x=>x.id===id);
    showToast(v?.published ? `"${v?.title.substring(0,30)}..." unpublished` : `"${v?.title.substring(0,30)}..." published`);
  };

  const deleteVideo = (id:string) => {
    const v = videos.find(x=>x.id===id);
    if (!confirm(`Delete "${v?.title}"? This cannot be undone.`)) return;
    setVideos(prev=>prev.filter(x=>x.id!==id));
    showToast("Video deleted", "error");
  };

  const filtered = videos.filter(v=>{
    const matchCat    = category==="All" || v.category===category;
    const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const published   = videos.filter(v=>v.published).length;
  const drafts      = videos.filter(v=>!v.published).length;
  const totalViews  = videos.reduce((s,v)=>s+v.views,0);

  const levelColor = (l:string)=>({
    Beginner:    {bg:"#F0FDF4",color:"#15803d",border:"#BBF7D0"},
    Intermediate:{bg:"#FFFBEB",color:"#854d0e",border:"#FDE68A"},
    Advanced:    {bg:"#FEF2F2",color:"#dc2626",border:"#FECACA"},
  }[l]||{bg:"#F5E6C8",color:"#6B4F12",border:"#E8D5A3"});

  return (
    <div style={{maxWidth:"1100px"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {showAdd&&<AddVideoModal onClose={()=>setShowAdd(false)} onSave={(v)=>{setVideos(prev=>[...prev,v as Video]);showToast("Video saved as draft!");}}/>}

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
        <div>
          <p style={{fontSize:"12px",color:"#A08060",letterSpacing:".1em",textTransform:"uppercase",marginBottom:"4px"}}>Admin</p>
          <h1 style={{fontSize:"26px",fontFamily:"Georgia,serif",color:"#2C1810",fontWeight:400}}>Content Management</h1>
          <p style={{fontSize:"14px",color:"#A08060",marginTop:"3px"}}>Manage training videos for sellers</p>
        </div>
        <button onClick={()=>setShowAdd(true)} style={{padding:"11px 22px",borderRadius:"9px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",color:"#2C1810",border:"none",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 14px rgba(201,168,76,.25)",display:"flex",alignItems:"center",gap:"8px"}}>
          <span>+</span> Add Video
        </button>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"12px",marginBottom:"22px"}}>
        {[
          {icon:"🎬",label:"Total Videos",  value:String(videos.length), color:"rgba(201,168,76,.1)"},
          {icon:"✅",label:"Published",      value:String(published),     color:"rgba(16,185,129,.1)"},
          {icon:"📝",label:"Drafts",         value:String(drafts),        color:"rgba(245,158,11,.1)"},
          {icon:"👁",label:"Total Views",    value:String(totalViews),    color:"rgba(59,130,246,.1)"},
        ].map(s=>(
          <div key={s.label} style={{background:"#FFFDF9",border:"1px solid #E8D5A3",borderRadius:"14px",padding:"16px 18px"}}>
            <div style={{width:"34px",height:"34px",borderRadius:"9px",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"17px",marginBottom:"9px"}}>{s.icon}</div>
            <div style={{fontSize:"22px",fontWeight:700,color:"#2C1810",fontFamily:"Georgia,serif",lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:"12px",color:"#A08060",marginTop:"4px"}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + category */}
      <div style={{position:"relative",marginBottom:"14px"}}>
        <span style={{position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",fontSize:"14px",pointerEvents:"none"}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search videos..." style={{width:"100%",padding:"10px 14px 10px 36px",borderRadius:"9px",border:"1.5px solid #E8D5A3",fontSize:"13px",color:"#2C1810",background:"#FFFDF9",outline:"none",fontFamily:"inherit"}}/>
        {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:"13px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:"17px",color:"#A08060",padding:0,lineHeight:1}}>×</button>}
      </div>
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"20px"}}>
        {CATEGORIES.map(cat=>(
          <button key={cat} onClick={()=>setCategory(cat)} style={{padding:"6px 14px",borderRadius:"99px",border:`1.5px solid ${category===cat?"#C9A84C":"#E8D5A3"}`,background:category===cat?"linear-gradient(135deg,#C9A84C,#8B6914)":"transparent",color:category===cat?"#2C1810":"#6B4F12",fontSize:"12px",fontWeight:category===cat?700:500,cursor:"pointer",fontFamily:"inherit",transition:"all .18s"}}>
            {cat}
          </button>
        ))}
      </div>

      {/* Videos list */}
      <div style={{background:"#FFFDF9",border:"1px solid #E8D5A3",borderRadius:"16px",overflow:"hidden"}}>
        {/* Header */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 130px 110px 80px 90px 130px",padding:"10px 20px",background:"linear-gradient(135deg,#2C1810,#3D2B1F)"}}>
          {["Video","Category","Level","Duration","Views","Actions"].map(h=>(
            <div key={h} style={{fontSize:"10px",fontWeight:700,color:"#C9A84C",letterSpacing:".08em",textTransform:"uppercase"}}>{h}</div>
          ))}
        </div>

        {filtered.length===0?(
          <div style={{padding:"56px 20px",textAlign:"center"}}>
            <div style={{fontSize:"44px",marginBottom:"14px"}}>🎬</div>
            <p style={{fontSize:"16px",fontWeight:500,color:"#2C1810",marginBottom:"6px"}}>No videos found</p>
            <p style={{fontSize:"13px",color:"#A08060"}}>Add your first training video using the button above</p>
          </div>
        ):(
          filtered.map((v,i)=>{
            const lc=levelColor(v.level);
            return (
              <div key={v.id} style={{display:"grid",gridTemplateColumns:"1fr 130px 110px 80px 90px 130px",padding:"14px 20px",borderBottom:i<filtered.length-1?"1px solid #F5EDE0":"none",background:i%2===0?"#FFFDF9":"#FDFAF4",alignItems:"center",transition:"background .15s"}}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="#F5E6C8"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=i%2===0?"#FFFDF9":"#FDFAF4"}
              >
                {/* Title */}
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <div style={{width:"36px",height:"36px",borderRadius:"8px",background:"linear-gradient(135deg,#2C1810,#3D2B1F)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>🎬</div>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:"13px",fontWeight:600,color:"#2C1810",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{v.title}</div>
                    <div style={{display:"flex",alignItems:"center",gap:"6px",marginTop:"2px"}}>
                      <span style={{width:"6px",height:"6px",borderRadius:"50%",background:v.published?"#22c55e":"#f59e0b",flexShrink:0}}/>
                      <span style={{fontSize:"11px",color:v.published?"#15803d":"#854d0e",fontWeight:600}}>{v.published?"Published":"Draft"}</span>
                    </div>
                  </div>
                </div>
                <div style={{fontSize:"12px",color:"#6B4F12",fontWeight:500}}>{v.category}</div>
                <span style={{display:"inline-block",padding:"3px 8px",borderRadius:"99px",fontSize:"10px",fontWeight:700,background:lc.bg,color:lc.color,border:`1px solid ${lc.border}`}}>{v.level}</span>
                <div style={{fontSize:"13px",color:"#2C1810",fontWeight:500}}>{v.duration||"—"}</div>
                <div style={{fontSize:"13px",color:"#2C1810",fontWeight:600}}>{v.views.toLocaleString()}</div>
                <div style={{display:"flex",gap:"5px"}}>
                  <button onClick={()=>togglePublish(v.id)} style={{padding:"5px 10px",borderRadius:"6px",background:v.published?"rgba(239,68,68,.08)":"rgba(16,185,129,.1)",border:`1px solid ${v.published?"rgba(239,68,68,.2)":"rgba(16,185,129,.25)"}`,color:v.published?"#dc2626":"#15803d",fontSize:"11px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,transition:"all .15s"}}>
                    {v.published?"Unpublish":"Publish"}
                  </button>
                  <button onClick={()=>deleteVideo(v.id)} style={{padding:"5px 8px",borderRadius:"6px",background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.15)",color:"#dc2626",fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>🗑</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes scaleIn {from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder,textarea::placeholder{color:#C4A882;}
        input:focus,select:focus,textarea:focus{border-color:#C9A84C !important;}
      `}</style>
    </div>
  );
}
