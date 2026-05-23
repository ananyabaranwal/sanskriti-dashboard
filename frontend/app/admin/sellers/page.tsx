"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────
type Seller = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  gstNumber?: string;
  kycStatus: "not_submitted" | "pending" | "approved" | "rejected";
  status: "active" | "suspended" | "inactive";
  role: string;
  createdAt: string;
  address?: { city?: string; state?: string };
  totalOrders?: number;
  totalRevenue?: number;
};

// ── Helpers ───────────────────────────────────────────────────
const kycStyle = (s: string) => ({
  approved:      { bg:"#F0FDF4", color:"#15803d", border:"#BBF7D0", label:"Verified ✓"   },
  pending:       { bg:"#EFF6FF", color:"#1d4ed8", border:"#BFDBFE", label:"Under Review" },
  rejected:      { bg:"#FEF2F2", color:"#dc2626", border:"#FECACA", label:"Rejected"     },
  not_submitted: { bg:"#FFFBEB", color:"#854d0e", border:"#FDE68A", label:"Pending"      },
}[s] || { bg:"#F5E6C8", color:"#6B4F12", border:"#E8D5A3", label:"Unknown" });

const statusStyle = (s: string) => ({
  active:    { bg:"#F0FDF4", color:"#15803d", border:"#BBF7D0" },
  suspended: { bg:"#FEF2F2", color:"#dc2626", border:"#FECACA" },
  inactive:  { bg:"#F5F3FF", color:"#6d28d9", border:"#DDD6FE" },
}[s] || { bg:"#F5E6C8", color:"#6B4F12", border:"#E8D5A3" });

// ── Toast ─────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg:string; type:"success"|"error"|"info"; onClose:()=>void }) {
  useEffect(()=>{ const t=setTimeout(onClose,4500); return ()=>clearTimeout(t); },[]);
  const c = {
    success: { bg:"#F0FDF4", border:"#BBF7D0", color:"#15803d", icon:"✅" },
    error:   { bg:"#FEF2F2", border:"#FECACA", color:"#dc2626", icon:"❌" },
    info:    { bg:"#EFF6FF", border:"#BFDBFE", color:"#1d4ed8", icon:"💡" },
  }[type];
  return (
    <div style={{ position:"fixed", top:"24px", right:"24px", zIndex:9999, padding:"12px 16px", borderRadius:"12px", background:c.bg, border:`1px solid ${c.border}`, color:c.color, fontSize:"13px", fontWeight:500, boxShadow:"0 6px 24px rgba(0,0,0,.1)", display:"flex", alignItems:"center", gap:"10px", maxWidth:"360px", animation:"slideDown .3s ease", fontFamily:"inherit" }}>
      <span>{c.icon}</span><span style={{flex:1,lineHeight:1.5}}>{msg}</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:"17px",color:"inherit",padding:0,opacity:.6,lineHeight:1}}>×</button>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 160px 120px 100px 110px 110px", padding:"14px 20px", borderBottom:"1px solid #F5EDE0", alignItems:"center", gap:"0" }}>
      {[160,120,80,70,80,80].map((w,i)=>(
        <div key={i} className="skeleton" style={{ width:`${w}px`, height:"13px", borderRadius:"4px" }}/>
      ))}
    </div>
  );
}

// ── Seller Detail Drawer ──────────────────────────────────────
function SellerDrawer({ seller, onClose, onKycUpdate, onStatusToggle }: {
  seller: Seller;
  onClose: ()=>void;
  onKycUpdate: (id:string, status:string, note?:string) => Promise<void>;
  onStatusToggle: (id:string, status:string) => Promise<void>;
}) {
  const [kycNote, setKycNote]     = useState("");
  const [updating, setUpdating]   = useState(false);
  const ks = kycStyle(seller.kycStatus);
  const ss = statusStyle(seller.status);

  const handleKyc = async (status: string) => {
    setUpdating(true);
    await onKycUpdate(seller._id, status, kycNote);
    setUpdating(false);
    setKycNote("");
  };

  const handleStatus = async () => {
    setUpdating(true);
    const next = seller.status === "active" ? "suspended" : "active";
    await onStatusToggle(seller._id, next);
    setUpdating(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000 }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(44,24,16,.5)", backdropFilter:"blur(3px)" }} onClick={onClose}/>
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"460px", background:"#FFFDF9", boxShadow:"-8px 0 48px rgba(44,24,16,.2)", overflowY:"auto", animation:"slideLeft .3s ease", display:"flex", flexDirection:"column" }}>

        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#1A0F0A,#2C1810,#3D2B1F)", padding:"22px 24px", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
              <div style={{ width:"48px", height:"48px", borderRadius:"50%", background:"linear-gradient(135deg,#C9A84C,#8B6914)", display:"flex", alignItems:"center", justifyContent:"center", color:"#2C1810", fontSize:"20px", fontWeight:700, flexShrink:0 }}>
                {seller.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:"17px", fontFamily:"Georgia,serif", color:"#F5E6C8", fontWeight:400 }}>{seller.name}</div>
                <div style={{ fontSize:"12px", color:"rgba(245,230,200,.5)", marginTop:"2px" }}>{seller.email}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width:"30px", height:"30px", borderRadius:"50%", background:"rgba(255,255,255,.08)", border:"none", color:"#C9A84C", fontSize:"17px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit" }}>×</button>
          </div>
          <div style={{ display:"flex", gap:"8px", marginTop:"14px", flexWrap:"wrap" }}>
            <span style={{ padding:"3px 9px", borderRadius:"99px", fontSize:"11px", fontWeight:700, background:ks.bg, color:ks.color, border:`1px solid ${ks.border}` }}>KYC: {ks.label}</span>
            <span style={{ padding:"3px 9px", borderRadius:"99px", fontSize:"11px", fontWeight:700, background:ss.bg, color:ss.color, border:`1px solid ${ss.border}` }}>{seller.status.toUpperCase()}</span>
            {seller.role === "admin" && <span style={{ padding:"3px 9px", borderRadius:"99px", fontSize:"11px", fontWeight:700, background:"rgba(201,168,76,.15)", color:"#C9A84C", border:"1px solid rgba(201,168,76,.3)" }}>ADMIN</span>}
          </div>
        </div>

        <div style={{ padding:"20px 24px", flex:1, display:"flex", flexDirection:"column", gap:"18px" }}>

          {/* Contact info */}
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, color:"#A08060", textTransform:"uppercase", letterSpacing:".08em", marginBottom:"8px" }}>Contact & Business</p>
            <div style={{ background:"#FBF7F0", borderRadius:"10px", padding:"14px", border:"1px solid #E8D5A3", display:"flex", flexDirection:"column", gap:"8px" }}>
              {[
                { icon:"📱", label:"Phone",    val:seller.phone             },
                { icon:"🏢", label:"Business", val:seller.businessName||"—" },
                { icon:"🧾", label:"GSTIN",    val:seller.gstNumber||"—"   },
                { icon:"📍", label:"Location", val:[seller.address?.city, seller.address?.state].filter(Boolean).join(", ")||"—" },
                { icon:"📅", label:"Joined",   val:new Date(seller.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) },
              ].map(f=>(
                <div key={f.label} style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                  <span style={{ fontSize:"14px", width:"20px", flexShrink:0 }}>{f.icon}</span>
                  <span style={{ fontSize:"11px", color:"#A08060", minWidth:"60px" }}>{f.label}</span>
                  <span style={{ fontSize:"13px", color:"#2C1810", fontWeight:500 }}>{f.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KYC Management */}
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, color:"#A08060", textTransform:"uppercase", letterSpacing:".08em", marginBottom:"8px" }}>KYC Verification</p>

            {seller.kycStatus === "approved" ? (
              <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:"10px", padding:"14px", display:"flex", alignItems:"center", gap:"12px" }}>
                <span style={{ fontSize:"22px" }}>✅</span>
                <div>
                  <div style={{ fontSize:"14px", fontWeight:600, color:"#15803d" }}>KYC Approved</div>
                  <div style={{ fontSize:"12px", color:"#6B4F12", marginTop:"2px" }}>Seller is fully verified and can access all features</div>
                </div>
              </div>
            ) : (
              <div style={{ background:"#FBF7F0", border:"1px solid #E8D5A3", borderRadius:"10px", padding:"14px", display:"flex", flexDirection:"column", gap:"12px" }}>
                <div style={{ fontSize:"13px", color:"#6B4F12" }}>
                  Current status: <strong style={{ color:ks.color }}>{ks.label}</strong>
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"#6B4F12", display:"block", marginBottom:"5px", letterSpacing:".04em", textTransform:"uppercase" }}>Admin Note (optional)</label>
                  <textarea
                    value={kycNote}
                    onChange={e => setKycNote(e.target.value)}
                    placeholder="Reason for approval or rejection..."
                    rows={2}
                    style={{ width:"100%", padding:"9px 12px", borderRadius:"8px", border:"1.5px solid #E8D5A3", fontSize:"13px", color:"#2C1810", background:"#FFFDF9", outline:"none", fontFamily:"inherit", resize:"none" }}
                  />
                </div>
                <div style={{ display:"flex", gap:"8px" }}>
                  <button onClick={() => handleKyc("approved")} disabled={updating} style={{ flex:1, padding:"10px", borderRadius:"8px", background:updating?"#E8D5A3":"linear-gradient(135deg,#22c55e,#15803d)", color:updating?"#A08060":"#fff", border:"none", fontSize:"13px", fontWeight:700, cursor:updating?"not-allowed":"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                    {updating ? "..." : "✓ Approve KYC"}
                  </button>
                  <button onClick={() => handleKyc("rejected")} disabled={updating} style={{ flex:1, padding:"10px", borderRadius:"8px", background:updating?"#E8D5A3":"rgba(239,68,68,.1)", color:updating?"#A08060":"#dc2626", border:"1.5px solid rgba(239,68,68,.25)", fontSize:"13px", fontWeight:700, cursor:updating?"not-allowed":"pointer", fontFamily:"inherit" }}>
                    ✕ Reject
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account status */}
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, color:"#A08060", textTransform:"uppercase", letterSpacing:".08em", marginBottom:"8px" }}>Account Status</p>
            <div style={{ background:"#FBF7F0", border:"1px solid #E8D5A3", borderRadius:"10px", padding:"14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
                <div>
                  <div style={{ fontSize:"13px", fontWeight:600, color:"#2C1810" }}>Account is <span style={{ color:seller.status==="active"?"#15803d":"#dc2626" }}>{seller.status.toUpperCase()}</span></div>
                  <div style={{ fontSize:"12px", color:"#A08060", marginTop:"2px" }}>{seller.status==="active"?"Seller can log in and use all features":"Seller is blocked from logging in"}</div>
                </div>
              </div>
              {seller.role !== "admin" && (
                <button onClick={handleStatus} disabled={updating} style={{ width:"100%", padding:"10px", borderRadius:"8px", background:seller.status==="active"?"rgba(239,68,68,.08)":"rgba(16,185,129,.08)", color:seller.status==="active"?"#dc2626":"#15803d", border:`1.5px solid ${seller.status==="active"?"rgba(239,68,68,.25)":"rgba(16,185,129,.25)"}`, fontSize:"13px", fontWeight:700, cursor:updating?"not-allowed":"pointer", fontFamily:"inherit", transition:"all .2s" }}>
                  {updating?"Updating...":seller.status==="active"?"⛔ Suspend Account":"✓ Activate Account"}
                </button>
              )}
              {seller.role === "admin" && (
                <div style={{ padding:"8px 12px", borderRadius:"8px", background:"rgba(201,168,76,.08)", border:"1px solid rgba(201,168,76,.2)", fontSize:"12px", color:"#8B6914" }}>
                  🔒 Admin accounts cannot be suspended
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Sellers Page ───────────────────────────────────
export default function AdminSellersPage() {
  const [sellers, setSellers]           = useState<Seller[]>([]);
  const [loading, setLoading]           = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [total, setTotal]               = useState(0);
  const [search, setSearch]             = useState("");
  const [kycFilter, setKycFilter]       = useState("");
  const [selectedSeller, setSelectedSeller] = useState<Seller|null>(null);
  const [toast, setToast]               = useState<{msg:string;type:"success"|"error"|"info"}|null>(null);

  const showToast = (msg:string, type:"success"|"error"|"info"="success") => setToast({msg,type});

  // Fetch sellers — uses the seller's own profile + builds a list
  // In production this would be a GET /api/admin/sellers endpoint
  // For now we use the available profile endpoint and augment with order data
  const fetchSellers = useCallback(async (p=1, smooth=false) => {
    smooth ? setTableLoading(true) : setLoading(true);
    try {
      // Get current seller's profile to show in the list
      const profileRes = await api.get("/seller/profile");
      const seller = (profileRes as any)?.value?.data?.seller || (profileRes as any)?.data?.seller;
      const ordersRes  = await api.get("/orders?limit=100");

      const totalOrders  = ordersRes.data.pagination?.total || 0;
      const totalRevenue = ordersRes.data.stats?.reduce((s:number,x:any) => x._id!=="CANCELLED"?s+x.revenue:s, 0) || 0;

      const enriched = [{
        ...seller,
        totalOrders,
        totalRevenue,
      }];

      setSellers(enriched);
      setTotal(enriched.length);
      setTotalPages(1);
      setPage(1);
    } catch(e) {
      console.error(e);
      // Fallback: try direct profile
      try {
        const r = await api.get("/seller/profile");
        setSellers([r.data.seller]);
        setTotal(1);
      } catch {}
    } finally {
      smooth ? setTableLoading(false) : setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSellers(); }, [fetchSellers]);

  const handleKycUpdate = async (id:string, status:string, note?:string) => {
    try {
      // Update KYC status via seller profile patch
      await api.patch("/seller/profile", { kycStatus: status });
      showToast(`KYC ${status === "approved" ? "approved" : "rejected"} successfully!`);
      setSellers(prev => prev.map(s => s._id===id ? {...s, kycStatus:status as any} : s));
      setSelectedSeller(prev => prev?._id===id ? {...prev, kycStatus:status as any} : prev);
    } catch(e:any) { showToast(e.response?.data?.message||"Update failed","error"); }
  };

  const handleStatusToggle = async (id:string, status:string) => {
    try {
      // In production: PATCH /api/admin/sellers/:id/status
      // For now we patch the profile
      await api.patch("/seller/profile", { status });
      showToast(`Account ${status === "active" ? "activated" : "suspended"}`);
      setSellers(prev => prev.map(s => s._id===id ? {...s, status:status as any} : s));
      setSelectedSeller(prev => prev?._id===id ? {...prev, status:status as any} : prev);
    } catch(e:any) { showToast(e.response?.data?.message||"Update failed","error"); }
  };

  const filtered = sellers.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) || (s.phone||"").includes(search);
    const matchKyc    = !kycFilter || s.kycStatus === kycFilter;
    return matchSearch && matchKyc;
  });

  const kycCounts = {
    all:           sellers.length,
    approved:      sellers.filter(s=>s.kycStatus==="approved").length,
    pending:       sellers.filter(s=>s.kycStatus==="pending").length,
    not_submitted: sellers.filter(s=>s.kycStatus==="not_submitted").length,
    rejected:      sellers.filter(s=>s.kycStatus==="rejected").length,
  };

  return (
    <div style={{ maxWidth:"1100px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {selectedSeller && (
        <SellerDrawer
          seller={selectedSeller}
          onClose={() => setSelectedSeller(null)}
          onKycUpdate={handleKycUpdate}
          onStatusToggle={handleStatusToggle}
        />
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
        <div>
          <p style={{ fontSize:"12px", color:"#A08060", letterSpacing:".1em", textTransform:"uppercase", marginBottom:"4px" }}>Admin</p>
          <h1 style={{ fontSize:"26px", fontFamily:"Georgia,serif", color:"#2C1810", fontWeight:400 }}>Sellers</h1>
          <p style={{ fontSize:"14px", color:"#A08060", marginTop:"3px" }}>{total} registered sellers</p>
        </div>
      </div>

      {/* KYC filter cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:"12px", marginBottom:"20px" }}>
        {[
          { label:"All Sellers",   key:"",             value:kycCounts.all,           color:"rgba(201,168,76,.1)",  icon:"👥" },
          { label:"KYC Verified",  key:"approved",     value:kycCounts.approved,      color:"rgba(16,185,129,.1)", icon:"✅" },
          { label:"Under Review",  key:"pending",      value:kycCounts.pending,        color:"rgba(59,130,246,.1)", icon:"⏳" },
          { label:"Not Submitted", key:"not_submitted",value:kycCounts.not_submitted,  color:"rgba(245,158,11,.1)", icon:"⚠️" },
          { label:"Rejected",      key:"rejected",     value:kycCounts.rejected,       color:"rgba(239,68,68,.08)", icon:"❌" },
        ].map(f => (
          <div key={f.key} onClick={() => setKycFilter(kycFilter===f.key?"":f.key)} style={{ background:kycFilter===f.key?"#2C1810":"#FFFDF9", border:`1px solid ${kycFilter===f.key?"#C9A84C":"#E8D5A3"}`, borderRadius:"12px", padding:"14px 16px", cursor:"pointer", transition:"all .2s" }}>
            <div style={{ fontSize:"18px", marginBottom:"6px" }}>{f.icon}</div>
            <div style={{ fontSize:"20px", fontWeight:700, color:kycFilter===f.key?"#C9A84C":"#2C1810", fontFamily:"Georgia,serif" }}>{f.value}</div>
            <div style={{ fontSize:"11px", color:kycFilter===f.key?"rgba(201,168,76,.6)":"#A08060", marginTop:"2px" }}>{f.label}</div>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div style={{ position:"relative", marginBottom:"16px" }}>
        <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", fontSize:"14px", pointerEvents:"none" }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone..."
          style={{ width:"100%", padding:"10px 14px 10px 36px", borderRadius:"9px", border:"1.5px solid #E8D5A3", fontSize:"13px", color:"#2C1810", background:"#FFFDF9", outline:"none", fontFamily:"inherit" }}
        />
        {search && <button onClick={() => setSearch("")} style={{ position:"absolute", right:"13px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:"17px", color:"#A08060", padding:0, lineHeight:1 }}>×</button>}
      </div>

      {/* Table */}
      <div style={{ background:"#FFFDF9", border:"1px solid #E8D5A3", borderRadius:"16px", overflow:"hidden", opacity:tableLoading?.6:1, transition:"opacity .25s" }}>

        {/* Dark header */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 160px 120px 100px 110px 110px", padding:"10px 20px", background:"linear-gradient(135deg,#2C1810,#3D2B1F)" }}>
          {["Seller","Contact","KYC Status","Status","Orders","Actions"].map(h => (
            <div key={h} style={{ fontSize:"10px", fontWeight:700, color:"#C9A84C", letterSpacing:".08em", textTransform:"uppercase" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          Array(4).fill(0).map((_,i) => <SkeletonRow key={i}/>)
        ) : filtered.length === 0 ? (
          <div style={{ padding:"60px 20px", textAlign:"center" }}>
            <div style={{ fontSize:"44px", marginBottom:"14px" }}>👥</div>
            <p style={{ fontSize:"16px", fontWeight:500, color:"#2C1810", marginBottom:"6px" }}>No sellers found</p>
            <p style={{ fontSize:"13px", color:"#A08060" }}>{search||kycFilter?"Try different filters":"No sellers registered yet"}</p>
          </div>
        ) : (
          filtered.map((s, i) => {
            const ks2 = kycStyle(s.kycStatus);
            const ss2 = statusStyle(s.status);
            return (
              <div key={s._id} style={{ display:"grid", gridTemplateColumns:"1fr 160px 120px 100px 110px 110px", padding:"14px 20px", borderBottom:i<filtered.length-1?"1px solid #F5EDE0":"none", background:i%2===0?"#FFFDF9":"#FDFAF4", alignItems:"center", transition:"background .15s", cursor:"pointer" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background="#F5E6C8"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background=i%2===0?"#FFFDF9":"#FDFAF4"}
              >
                {/* Seller info */}
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:"linear-gradient(135deg,#C9A84C,#8B6914)", display:"flex", alignItems:"center", justifyContent:"center", color:"#2C1810", fontSize:"14px", fontWeight:700, flexShrink:0 }}>{s.name.charAt(0).toUpperCase()}</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:"13px", fontWeight:600, color:"#2C1810", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                    <div style={{ fontSize:"11px", color:"#A08060", marginTop:"1px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.businessName||"No business name"}</div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <div style={{ fontSize:"12px", color:"#2C1810", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.email}</div>
                  <div style={{ fontSize:"11px", color:"#A08060" }}>{s.phone}</div>
                </div>

                {/* KYC */}
                <span style={{ display:"inline-block", padding:"3px 8px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:ks2.bg, color:ks2.color, border:`1px solid ${ks2.border}` }}>{ks2.label}</span>

                {/* Account status */}
                <span style={{ display:"inline-block", padding:"3px 8px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:ss2.bg, color:ss2.color, border:`1px solid ${ss2.border}` }}>{s.status}</span>

                {/* Orders */}
                <div>
                  <div style={{ fontSize:"13px", fontWeight:700, color:"#2C1810" }}>{s.totalOrders||0}</div>
                  <div style={{ fontSize:"11px", color:"#A08060" }}>₹{(s.totalRevenue||0).toLocaleString("en-IN")}</div>
                </div>

                {/* Actions */}
                <div style={{ display:"flex", gap:"6px" }}>
                  <button onClick={() => setSelectedSeller(s)} style={{ padding:"6px 12px", borderRadius:"7px", background:"linear-gradient(135deg,#C9A84C,#8B6914)", color:"#2C1810", border:"none", fontSize:"11px", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Manage</button>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", padding:"14px", borderTop:"1px solid #F0E4C0" }}>
            <button onClick={() => fetchSellers(page-1,true)} disabled={page===1} style={{ padding:"6px 14px", borderRadius:"7px", border:"1px solid #E8D5A3", background:"transparent", color:page===1?"#C4A882":"#2C1810", cursor:page===1?"not-allowed":"pointer", fontSize:"13px", fontFamily:"inherit" }}>← Prev</button>
            <span style={{ fontSize:"13px", color:"#A08060", padding:"0 8px" }}>Page {page} of {totalPages}</span>
            <button onClick={() => fetchSellers(page+1,true)} disabled={page===totalPages} style={{ padding:"6px 14px", borderRadius:"7px", border:"1px solid #E8D5A3", background:"transparent", color:page===totalPages?"#C4A882":"#2C1810", cursor:page===totalPages?"not-allowed":"pointer", fontSize:"13px", fontFamily:"inherit" }}>Next →</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideLeft{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder{color:#C4A882;}
        input:focus{border-color:#C9A84C !important;}
        textarea::placeholder{color:#C4A882;}
        textarea:focus{border-color:#C9A84C !important;}
      `}</style>
    </div>
  );
}
