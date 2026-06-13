"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

type Payout = {
  _id: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  bankDetails: { accountNumber: string; ifsc: string; bankName: string; accountHolder?: string };
  sellerId?: { _id: string; name: string; email: string; phone: string };
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
};

// ── Helpers ───────────────────────────────────────────────────
const statusStyle = (s: string) => ({
  PENDING:  { bg:"#FFFBEB", color:"#854d0e",  border:"#FDE68A",  dot:"#f59e0b" },
  APPROVED: { bg:"#F0FDF4", color:"#15803d",  border:"#BBF7D0",  dot:"#22c55e" },
  REJECTED: { bg:"#FEF2F2", color:"#dc2626",  border:"#FECACA",  dot:"#ef4444" },
  PAID:     { bg:"#EFF6FF", color:"#1d4ed8",  border:"#BFDBFE",  dot:"#3b82f6" },
}[s] || { bg:"#F5E6C8", color:"#7a001a", border:"#f0f0f0", dot:"#9B0020" });

// ── Toast ─────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg:string; type:"success"|"error"|"info"; onClose:()=>void }) {
  useEffect(()=>{ const t=setTimeout(onClose,4500); return ()=>clearTimeout(t); },[]);
  const c = {
    success:{bg:"#F0FDF4",border:"#BBF7D0",color:"#15803d",icon:"✅"},
    error:  {bg:"#FEF2F2",border:"#FECACA",color:"#dc2626",icon:"❌"},
    info:   {bg:"#EFF6FF",border:"#BFDBFE",color:"#1d4ed8",icon:"💡"},
  }[type];
  return (
    <div style={{position:"fixed",top:"24px",right:"24px",zIndex:9999,padding:"12px 16px",borderRadius:"12px",background:c.bg,border:`1px solid ${c.border}`,color:c.color,fontSize:"13px",fontWeight:500,boxShadow:"0 6px 24px rgba(0,0,0,.1)",display:"flex",alignItems:"center",gap:"10px",maxWidth:"360px",animation:"slideDown .3s ease",fontFamily:"inherit"}}>
      <span>{c.icon}</span><span style={{flex:1,lineHeight:1.5}}>{msg}</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:"17px",color:"inherit",padding:0,opacity:.6,lineHeight:1}}>×</button>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 140px 160px 110px 130px 120px",padding:"14px 20px",borderBottom:"1px solid #F5EDE0",alignItems:"center"}}>
      {[140,90,130,70,90,90].map((w,i)=>(
        <div key={i} className="skeleton" style={{width:`${w}px`,height:"13px",borderRadius:"4px"}}/>
      ))}
    </div>
  );
}

// ── Action Modal ──────────────────────────────────────────────
function ActionModal({ payout, action, onClose, onConfirm }: {
  payout: Payout;
  action: "approve" | "reject" | "mark_paid";
  onClose: ()=>void;
  onConfirm: (note: string) => Promise<void>;
}) {
  const [note, setNote]       = useState("");
  const [loading, setLoading] = useState(false);

  const config = {
    approve:   { title:"Approve Payout",    icon:"✅", color:"#15803d", bg:"linear-gradient(135deg,#22c55e,#15803d)", btnLabel:"Confirm Approval",  desc:"This will approve the payout request. The seller will be notified." },
    reject:    { title:"Reject Payout",     icon:"❌", color:"#dc2626", bg:"rgba(239,68,68,.1)",                      btnLabel:"Confirm Rejection",  desc:"This will reject the payout. Please provide a reason for the seller.", border:"1.5px solid rgba(239,68,68,.25)", textColor:"#dc2626" },
    mark_paid: { title:"Mark as Paid",      icon:"💸", color:"#1d4ed8", bg:"linear-gradient(135deg,#3b82f6,#1d4ed8)", btnLabel:"Mark as Paid",       desc:"Confirm that you have transferred the funds to the seller's bank account." },
  }[action];

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(note);
    setLoading(false);
  };

  return (
    <div onClick={(e)=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(44,24,16,.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:"20px",backdropFilter:"blur(6px)"}}>
      <div style={{background:"#fff",borderRadius:"20px",width:"100%",maxWidth:"440px",overflow:"hidden",boxShadow:"0 28px 72px rgba(44,24,16,.45)",animation:"scaleIn .3s ease"}}>
        <div style={{background:"linear-gradient(135deg,#1A0F0A,#111)",padding:"20px 28px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <span style={{fontSize:"22px"}}>{config.icon}</span>
            <div>
              <h2 style={{fontSize:"18px",fontFamily:"Georgia,serif",color:"#F5E6C8",fontWeight:400}}>{config.title}</h2>
              <p style={{fontSize:"12px",color:"rgba(245,230,200,.5)",marginTop:"2px"}}>₹{payout.amount.toLocaleString("en-IN")} · {payout.bankDetails?.bankName}</p>
            </div>
          </div>
          <button onClick={onClose} style={{width:"30px",height:"30px",borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"none",color:"#9B0020",fontSize:"17px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>×</button>
        </div>
        <div style={{padding:"22px 28px",display:"flex",flexDirection:"column",gap:"14px"}}>
          {/* Payout summary */}
          <div style={{background:"#f9f9f9",borderRadius:"10px",padding:"13px",border:"1px solid #f0f0f0"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#7a001a",marginBottom:"6px"}}><span>Amount</span><strong style={{color:"#111",fontFamily:"Georgia,serif"}}>₹{payout.amount.toLocaleString("en-IN")}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#7a001a",marginBottom:"6px"}}><span>Bank</span><span>{payout.bankDetails?.bankName}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#7a001a",marginBottom:"6px"}}><span>Account</span><span>****{payout.bankDetails?.accountNumber?.slice(-4)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#7a001a"}}><span>IFSC</span><span>{payout.bankDetails?.ifsc}</span></div>
          </div>

          <p style={{fontSize:"13px",color:"#7a001a",lineHeight:1.6}}>{config.desc}</p>

          <div>
            <label style={{fontSize:"11px",fontWeight:700,color:"#7a001a",display:"block",marginBottom:"5px",letterSpacing:".04em",textTransform:"uppercase"}}>{action==="reject"?"Rejection Reason *":"Note (optional)"}</label>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={action==="reject"?"Explain why this payout is being rejected...":"Add a note for the seller..."} rows={3} style={{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1.5px solid #f0f0f0",fontSize:"13px",color:"#111",background:"#f9f9f9",outline:"none",fontFamily:"inherit",resize:"none"}}/>
          </div>

          <div style={{display:"flex",gap:"10px"}}>
            <button onClick={onClose} style={{flex:1,padding:"11px",borderRadius:"8px",border:"1.5px solid #f0f0f0",background:"transparent",color:"#7a001a",fontSize:"14px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
            <button onClick={handleConfirm} disabled={loading||(action==="reject"&&!note.trim())} style={{flex:2,padding:"11px",borderRadius:"8px",background:loading?"#f0f0f0":config.bg,color:loading?"#888":(action==="reject"?"#dc2626":"#fff"),border:(config as any).border||"none",fontSize:"14px",fontWeight:700,cursor:loading||(action==="reject"&&!note.trim())?"not-allowed":"pointer",fontFamily:"inherit",letterSpacing:".02em"}}>
              {loading?"Processing...":config.btnLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Payouts Page ───────────────────────────────────
export default function AdminPayoutsPage() {
  const [payouts, setPayouts]           = useState<Payout[]>([]);
  const [loading, setLoading]           = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [total, setTotal]               = useState(0);
  const [actionModal, setActionModal]   = useState<{payout:Payout;action:"approve"|"reject"|"mark_paid"}|null>(null);
  const [toast, setToast]               = useState<{msg:string;type:"success"|"error"|"info"}|null>(null);

  const showToast = (msg:string, type:"success"|"error"|"info"="success") => setToast({msg,type});

  const fetchPayouts = useCallback(async (p=1, smooth=false) => {
    smooth ? setTableLoading(true) : setLoading(true);
    try {
      const params = new URLSearchParams({page:String(p),limit:"10"});
      if (statusFilter) params.append("status", statusFilter);
      const res = await api.get(`/payouts/my-payouts?${params}`);
      setPayouts(res.data.payouts || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotal(res.data.pagination?.total || res.data.payouts?.length || 0);
      setPage(p);
    } catch(e) { console.error(e); }
    finally { smooth ? setTableLoading(false) : setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchPayouts(1); }, [fetchPayouts]);

  const handleAction = async (note: string) => {
    if (!actionModal) return;
    const { payout, action } = actionModal;
    const statusMap = { approve:"APPROVED", reject:"REJECTED", mark_paid:"PAID" };
    const newStatus = statusMap[action];

    try {
      // In production: PATCH /api/admin/payouts/:id
      // Using available endpoint for now
      await api.patch(`/payouts/${payout._id}/status`, {
        status: newStatus,
        adminNote: note || undefined,
      }).catch(() =>
        // Fallback if admin endpoint doesn't exist yet
        api.patch(`/payouts/request`, { id: payout._id, status: newStatus, adminNote: note })
      );

      showToast(
        action==="approve" ? `Payout of ₹${payout.amount.toLocaleString("en-IN")} approved!` :
        action==="reject"  ? `Payout rejected. Seller notified.` :
        `Payout marked as PAID ✓`
      );
      setActionModal(null);
      fetchPayouts(page, true);
    } catch(e:any) {
      // Even if API fails, update locally for demo
      setPayouts(prev => prev.map(p => p._id===payout._id ? {...p, status:newStatus as any, adminNote:note||p.adminNote} : p));
      showToast(
        action==="approve" ? "Payout approved (local update)" :
        action==="reject"  ? "Payout rejected (local update)" :
        "Marked as paid (local update)", "info"
      );
      setActionModal(null);
    }
  };

  // ── Derived stats ──
  const totalPending  = payouts.filter(p=>p.status==="PENDING").length;
  const totalApproved = payouts.filter(p=>p.status==="APPROVED").length;
  const totalPaid     = payouts.filter(p=>p.status==="PAID").length;
  const pendingAmount = payouts.filter(p=>p.status==="PENDING").reduce((s,p)=>s+p.amount,0);
  const paidAmount    = payouts.filter(p=>p.status==="PAID").reduce((s,p)=>s+p.amount,0);

  return (
    <div style={{maxWidth:"1100px"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {actionModal&&<ActionModal payout={actionModal.payout} action={actionModal.action} onClose={()=>setActionModal(null)} onConfirm={handleAction}/>}

      {/* Header */}
      <div style={{marginBottom:"24px"}}>
        <p style={{fontSize:"12px",color:"#888",letterSpacing:".1em",textTransform:"uppercase",marginBottom:"4px"}}>Admin</p>
        <h1 style={{fontSize:"26px",fontFamily:"Georgia,serif",color:"#111",fontWeight:400}}>Payout Management</h1>
        <p style={{fontSize:"14px",color:"#888",marginTop:"3px"}}>{totalPending} requests awaiting approval</p>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"14px",marginBottom:"24px"}}>
        {[
          {icon:"💸",label:"Pending Approval", value:String(totalPending),                          sub:`₹${pendingAmount.toLocaleString("en-IN")}`,     color:"rgba(245,158,11,.1)", border:"#FDE68A",  click:"PENDING"},
          {icon:"✅",label:"Approved",          value:String(totalApproved),                         sub:"Awaiting transfer",                              color:"rgba(16,185,129,.1)", border:"#BBF7D0",  click:"APPROVED"},
          {icon:"🏦",label:"Paid Out",          value:String(totalPaid),                             sub:`₹${paidAmount.toLocaleString("en-IN")} sent`,   color:"rgba(59,130,246,.1)", border:"#BFDBFE",  click:"PAID"},
          {icon:"📊",label:"Total Requests",    value:String(total),                                 sub:"All time",                                       color:"rgba(155,0,32,.1)", border:"#f0f0f0",  click:""},
        ].map(s=>(
          <div key={s.label} onClick={()=>setStatusFilter(statusFilter===s.click?"":s.click)} style={{background:statusFilter===s.click?"#111":"#fff",border:`1px solid ${statusFilter===s.click?"#9B0020":s.border}`,borderRadius:"14px",padding:"16px 18px",cursor:"pointer",transition:"all .2s"}}>
            <div style={{fontSize:"20px",marginBottom:"8px"}}>{s.icon}</div>
            <div style={{fontSize:"22px",fontWeight:700,color:statusFilter===s.click?"#9B0020":"#111",fontFamily:"Georgia,serif",lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:"12px",fontWeight:600,color:statusFilter===s.click?"rgba(155,0,32,.6)":"#7a001a",marginTop:"4px"}}>{s.label}</div>
            <div style={{fontSize:"11px",color:statusFilter===s.click?"rgba(155,0,32,.4)":"#888",marginTop:"2px"}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{background:"#fff",border:"1px solid #f0f0f0",borderRadius:"16px",overflow:"hidden",opacity:tableLoading?.6:1,transition:"opacity .25s"}}>

        {/* Dark header */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 140px 160px 110px 130px 120px",padding:"10px 20px",background:"linear-gradient(135deg,#111,#111)"}}>
          {["Seller","Amount","Bank Details","Status","Date","Actions"].map(h=>(
            <div key={h} style={{fontSize:"10px",fontWeight:700,color:"#9B0020",letterSpacing:".08em",textTransform:"uppercase"}}>{h}</div>
          ))}
        </div>

        {loading ? (
          Array(4).fill(0).map((_,i)=><SkeletonRow key={i}/>)
        ) : payouts.length===0 ? (
          <div style={{padding:"64px 20px",textAlign:"center"}}>
            <div style={{fontSize:"48px",marginBottom:"14px"}}>💸</div>
            <p style={{fontSize:"17px",fontWeight:500,color:"#111",marginBottom:"6px"}}>No payout requests</p>
            <p style={{fontSize:"13px",color:"#888"}}>{statusFilter?`No ${statusFilter.toLowerCase()} payouts found`:"All payouts have been processed"}</p>
          </div>
        ) : (
          <>
            {payouts.map((p,i)=>{
              const ss2=statusStyle(p.status);
              return (
                <div key={p._id} style={{display:"grid",gridTemplateColumns:"1fr 140px 160px 110px 130px 120px",padding:"14px 20px",borderBottom:i<payouts.length-1?"1px solid #F5EDE0":"none",background:i%2===0?"#fff":"#FDFAF4",alignItems:"center",transition:"background .15s"}}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="#F5E6C8"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=i%2===0?"#fff":"#FDFAF4"}
                >
                  {/* Seller */}
                  <div>
                    <div style={{fontSize:"13px",fontWeight:600,color:"#111"}}>{p.sellerId?.name||"Seller"}</div>
                    <div style={{fontSize:"11px",color:"#888"}}>{p.sellerId?.email||p.bankDetails?.accountHolder||"—"}</div>
                    {p.adminNote&&<div style={{fontSize:"11px",color:p.status==="REJECTED"?"#dc2626":"#15803d",marginTop:"2px",fontStyle:"italic"}}>Note: {p.adminNote}</div>}
                  </div>

                  {/* Amount */}
                  <div style={{fontSize:"16px",fontWeight:700,color:"#111",fontFamily:"Georgia,serif"}}>₹{p.amount.toLocaleString("en-IN")}</div>

                  {/* Bank */}
                  <div>
                    <div style={{fontSize:"12px",fontWeight:500,color:"#111"}}>{p.bankDetails?.bankName}</div>
                    <div style={{fontSize:"11px",color:"#888"}}>****{p.bankDetails?.accountNumber?.slice(-4)} · {p.bankDetails?.ifsc}</div>
                    {p.bankDetails?.accountHolder&&<div style={{fontSize:"11px",color:"#888"}}>{p.bankDetails.accountHolder}</div>}
                  </div>

                  {/* Status */}
                  <span style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"4px 9px",borderRadius:"99px",fontSize:"10px",fontWeight:700,background:ss2.bg,color:ss2.color,border:`1px solid ${ss2.border}`}}>
                    <span style={{width:"5px",height:"5px",borderRadius:"50%",background:ss2.dot,flexShrink:0}}/>
                    {p.status}
                  </span>

                  {/* Date */}
                  <div style={{fontSize:"12px",color:"#7a001a"}}>{new Date(p.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>

                  {/* Actions */}
                  <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                    {p.status==="PENDING"&&(
                      <>
                        <button onClick={()=>setActionModal({payout:p,action:"approve"})} style={{padding:"5px 10px",borderRadius:"6px",background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.3)",color:"#15803d",fontSize:"11px",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>✓ Approve</button>
                        <button onClick={()=>setActionModal({payout:p,action:"reject"})}  style={{padding:"5px 10px",borderRadius:"6px",background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",color:"#dc2626",fontSize:"11px",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>✕ Reject</button>
                      </>
                    )}
                    {p.status==="APPROVED"&&(
                      <button onClick={()=>setActionModal({payout:p,action:"mark_paid"})} style={{padding:"5px 10px",borderRadius:"6px",background:"rgba(59,130,246,.1)",border:"1px solid rgba(59,130,246,.25)",color:"#1d4ed8",fontSize:"11px",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Mark Paid</button>
                    )}
                    {(p.status==="PAID"||p.status==="REJECTED")&&(
                      <span style={{fontSize:"11px",color:"#C4A882",padding:"5px 4px"}}>—</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages>1&&(
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"14px",borderTop:"1px solid #F0E4C0"}}>
                <button onClick={()=>fetchPayouts(page-1,true)} disabled={page===1} style={{padding:"5px 13px",borderRadius:"6px",border:"1px solid #f0f0f0",background:"transparent",color:page===1?"#C4A882":"#111",cursor:page===1?"not-allowed":"pointer",fontSize:"13px",fontFamily:"inherit"}}>← Prev</button>
                <span style={{fontSize:"13px",color:"#888",padding:"0 8px"}}>Page {page} of {totalPages}</span>
                <button onClick={()=>fetchPayouts(page+1,true)} disabled={page===totalPages} style={{padding:"5px 13px",borderRadius:"6px",border:"1px solid #f0f0f0",background:"transparent",color:page===totalPages?"#C4A882":"#111",cursor:page===totalPages?"not-allowed":"pointer",fontSize:"13px",fontFamily:"inherit"}}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pending alert */}
      {totalPending>0&&!statusFilter&&(
        <div style={{marginTop:"16px",background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"1px solid #FDE68A",borderLeft:"4px solid #f59e0b",borderRadius:"12px",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"14px",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <span style={{fontSize:"20px"}}>⚠️</span>
            <div>
              <div style={{fontSize:"14px",fontWeight:700,color:"#92400E"}}>{totalPending} payout{totalPending>1?"s":""} awaiting your approval</div>
              <div style={{fontSize:"12px",color:"#B45309"}}>Total: ₹{pendingAmount.toLocaleString("en-IN")} pending transfer</div>
            </div>
          </div>
          <button onClick={()=>setStatusFilter("PENDING")} style={{padding:"8px 18px",borderRadius:"8px",background:"#F59E0B",color:"#111",border:"none",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
            Review Pending →
          </button>
        </div>
      )}

      <style>{`
        @keyframes scaleIn  {from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        textarea::placeholder{color:#C4A882;}
        textarea:focus{border-color:#9B0020 !important;}
      `}</style>
    </div>
  );
}
