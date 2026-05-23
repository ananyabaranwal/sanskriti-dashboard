"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────
type ReturnRequest = {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  sellerName: string;
  itemName: string;
  orderAmount: number;
  refundAmount: number;
  reason: string;
  status: "PENDING" | "RECEIVED" | "APPROVED" | "REFUNDED" | "REJECTED" | "DISPUTED";
  requestedAt: string;
  receivedAt?: string;
  resolvedAt?: string;
  notes: string;
  disputeNote: string;
  images: number;
};

// ── Mock data (replace with real API when returns endpoint is ready) ──
const MOCK_RETURNS: ReturnRequest[] = [
  { id:"r1", orderNumber:"SNK-2605-0003", buyerName:"Priya Mehta",   buyerEmail:"priya@example.com",  buyerPhone:"8765432109", sellerName:"Ananya Seller", itemName:"Wooden Carved Frame",       orderAmount:2400,  refundAmount:2400,  reason:"Item damaged during shipping — frame cracked at corner",      status:"PENDING",  requestedAt:"2026-05-03", notes:"",     disputeNote:"", images:3 },
  { id:"r2", orderNumber:"SNK-2605-0002", buyerName:"Priya Mehta",   buyerEmail:"priya@example.com",  buyerPhone:"8765432109", sellerName:"Ananya Seller", itemName:"Antique Brass Diya",         orderAmount:2400,  refundAmount:2400,  reason:"Item significantly different from description — not antique", status:"RECEIVED", requestedAt:"2026-05-02", receivedAt:"2026-05-04", notes:"Item received. Verification in progress.", disputeNote:"", images:2 },
  { id:"r3", orderNumber:"SNK-2605-0001", buyerName:"Rahul Sharma",  buyerEmail:"rahul@example.com",  buyerPhone:"9876543210", sellerName:"Ananya Seller", itemName:"Brass Ganesh Idol",          orderAmount:9440,  refundAmount:4720,  reason:"Minor chip on idol base — partial refund requested",          status:"APPROVED", requestedAt:"2026-04-28", receivedAt:"2026-04-30", notes:"Partial damage confirmed. 50% refund approved.", disputeNote:"", images:4 },
  { id:"r4", orderNumber:"SNK-2605-0004", buyerName:"Rahul Sharma",  buyerEmail:"rahul@example.com",  buyerPhone:"9876543210", sellerName:"Ananya Seller", itemName:"Wooden Carved Frame + Idol", orderAmount:9440,  refundAmount:9440,  reason:"Changed mind after delivery",                                  status:"REJECTED", requestedAt:"2026-04-25", notes:"Return rejected — change of mind not covered under policy.", disputeNote:"Buyer raised dispute. Claims item was not as shown in photos.", images:1 },
];

// ── Status config ─────────────────────────────────────────────
const statusCfg = (s: string) => ({
  PENDING:  { bg:"#fffbeb", color:"#854d0e", border:"#fde68a", dot:"#f59e0b", label:"Pending"   },
  RECEIVED: { bg:"#eff6ff", color:"#1d4ed8", border:"#bfdbfe", dot:"#3b82f6", label:"Received"  },
  APPROVED: { bg:"#f0fdf4", color:"#15803d", border:"#bbf7d0", dot:"#22c55e", label:"Approved"  },
  REFUNDED: { bg:"#ecfdf5", color:"#065f46", border:"#a7f3d0", dot:"#10b981", label:"Refunded"  },
  REJECTED: { bg:"#fef2f2", color:"#dc2626", border:"#fecaca", dot:"#ef4444", label:"Rejected"  },
  DISPUTED: { bg:"#f5f3ff", color:"#6d28d9", border:"#ddd6fe", dot:"#8b5cf6", label:"Disputed"  },
}[s] || { bg:"#f3f4f6", color:"#374151", border:"#e5e7eb", dot:"#9ca3af", label:s });

// ── Toast ─────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg:string; type:"success"|"error"|"info"; onClose:()=>void }) {
  useEffect(()=>{ const t=setTimeout(onClose,4500); return ()=>clearTimeout(t); },[]);
  const c={success:{bg:"#f0fdf4",border:"#bbf7d0",color:"#15803d",icon:"✅"},error:{bg:"#fef2f2",border:"#fecaca",color:"#dc2626",icon:"❌"},info:{bg:"#eff6ff",border:"#bfdbfe",color:"#1d4ed8",icon:"💡"}}[type];
  return (
    <div style={{position:"fixed",top:"24px",right:"24px",zIndex:9999,padding:"12px 16px",borderRadius:"10px",background:c.bg,border:`1px solid ${c.border}`,color:c.color,fontSize:"13px",fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,.1)",display:"flex",alignItems:"center",gap:"10px",maxWidth:"360px",animation:"slideDown .3s ease",fontFamily:"inherit"}}>
      <span>{c.icon}</span><span style={{flex:1,lineHeight:1.5}}>{msg}</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:"17px",color:"inherit",padding:0,opacity:.6}}>×</button>
    </div>
  );
}

// ── Return Detail Drawer ──────────────────────────────────────
function ReturnDrawer({ req, onClose, onUpdate }: {
  req: ReturnRequest;
  onClose: ()=>void;
  onUpdate: (id:string, updates:Partial<ReturnRequest>) => void;
}) {
  const [notes, setNotes]         = useState(req.notes);
  const [disputeNote, setDisputeNote] = useState(req.disputeNote);
  const [refundAmt, setRefundAmt] = useState(String(req.refundAmount));
  const [loading, setLoading]     = useState(false);
  const sc = statusCfg(req.status);

  const handleAction = async (action: string) => {
    setLoading(true);
    await new Promise(r=>setTimeout(r,800));
    const now = new Date().toISOString().split("T")[0];
    switch(action) {
      case "mark_received":
        onUpdate(req.id, { status:"RECEIVED", receivedAt:now, notes });
        break;
      case "approve":
        onUpdate(req.id, { status:"APPROVED", notes, refundAmount:Number(refundAmt) });
        break;
      case "reject":
        onUpdate(req.id, { status:"REJECTED", notes, resolvedAt:now });
        break;
      case "refund":
        onUpdate(req.id, { status:"REFUNDED", resolvedAt:now, notes });
        // Credit seller wallet (in production: debit buyer-facing amount, credit seller)
        try { await api.post("/wallet/credit", { amount:Number(refundAmt), description:`Refund processed — ${req.orderNumber}`, category:"Refund" }); } catch {}
        break;
      case "dispute":
        onUpdate(req.id, { status:"DISPUTED", disputeNote });
        break;
    }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:1000}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",backdropFilter:"blur(3px)"}} onClick={onClose}/>
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:"480px",background:"#fff",boxShadow:"-8px 0 48px rgba(0,0,0,.15)",overflowY:"auto",animation:"slideLeft .3s ease",display:"flex",flexDirection:"column"}}>

        {/* Header */}
        <div style={{background:"#111827",padding:"20px 24px",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:"18px",fontWeight:700,color:"#fff",marginBottom:"3px"}}>{req.orderNumber}</div>
              <div style={{fontSize:"12px",color:"rgba(255,255,255,.45)",marginTop:"2px"}}>{req.itemName}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
              <span style={{padding:"4px 10px",borderRadius:"99px",fontSize:"11px",fontWeight:700,background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`}}>{sc.label}</span>
              <button onClick={onClose} style={{width:"30px",height:"30px",borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"none",color:"rgba(255,255,255,.7)",fontSize:"16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
            </div>
          </div>
        </div>

        <div style={{padding:"20px 24px",flex:1,display:"flex",flexDirection:"column",gap:"18px"}}>

          {/* Buyer + Seller */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
            <div style={{background:"#f9fafb",borderRadius:"10px",padding:"12px",border:"1px solid #e5e7eb"}}>
              <div style={{fontSize:"10px",fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"7px"}}>BUYER</div>
              <div style={{fontSize:"13px",fontWeight:600,color:"#111827"}}>{req.buyerName}</div>
              <div style={{fontSize:"11px",color:"#6b7280",marginTop:"2px"}}>{req.buyerEmail}</div>
              <div style={{fontSize:"11px",color:"#6b7280"}}>{req.buyerPhone}</div>
            </div>
            <div style={{background:"#f9fafb",borderRadius:"10px",padding:"12px",border:"1px solid #e5e7eb"}}>
              <div style={{fontSize:"10px",fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"7px"}}>SELLER</div>
              <div style={{fontSize:"13px",fontWeight:600,color:"#111827"}}>{req.sellerName}</div>
              <div style={{fontSize:"11px",color:"#6b7280",marginTop:"2px"}}>Order: {req.orderNumber}</div>
              <div style={{fontSize:"11px",color:"#6b7280"}}>{req.images} photo{req.images>1?"s":""} attached</div>
            </div>
          </div>

          {/* Return reason */}
          <div>
            <div style={{fontSize:"11px",fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"7px"}}>Return Reason</div>
            <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"9px",padding:"12px 14px",fontSize:"13px",color:"#374151",lineHeight:1.6}}>{req.reason}</div>
          </div>

          {/* Amounts */}
          <div style={{background:"#f9fafb",borderRadius:"10px",padding:"14px",border:"1px solid #e5e7eb"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#6b7280",marginBottom:"8px"}}><span>Order Amount</span><strong style={{color:"#111827"}}>₹{req.orderAmount.toLocaleString("en-IN")}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"8px",borderTop:"1px solid #e5e7eb"}}>
              <span style={{fontSize:"13px",fontWeight:600,color:"#111827"}}>Refund Amount</span>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",fontSize:"13px",fontWeight:700,color:"#8B6914"}}>₹</span>
                <input type="number" value={refundAmt} onChange={e=>setRefundAmt(e.target.value)} style={{padding:"6px 10px 6px 24px",borderRadius:"7px",border:"1.5px solid #e5e7eb",fontSize:"14px",fontWeight:700,color:"#111827",background:"#fff",outline:"none",width:"120px",fontFamily:"inherit"}}/>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div style={{fontSize:"11px",fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"10px"}}>Timeline</div>
            <div style={{position:"relative",paddingLeft:"18px"}}>
              <div style={{position:"absolute",left:"5px",top:0,bottom:0,width:"1px",background:"#e5e7eb"}}/>
              {[
                {label:"Return Requested", date:req.requestedAt,  done:true},
                {label:"Item Received",    date:req.receivedAt,   done:!!req.receivedAt},
                {label:"Refund Approved",  date:req.status==="APPROVED"||req.status==="REFUNDED"?req.resolvedAt:null, done:req.status==="APPROVED"||req.status==="REFUNDED"},
                {label:"Refund Processed", date:req.status==="REFUNDED"?req.resolvedAt:null, done:req.status==="REFUNDED"},
              ].map((t,i)=>(
                <div key={i} style={{display:"flex",gap:"10px",marginBottom:"12px",position:"relative"}}>
                  <div style={{width:"10px",height:"10px",borderRadius:"50%",background:t.done?"#22c55e":"#e5e7eb",position:"absolute",left:"-14px",top:"3px",border:"2px solid #fff",flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:"12px",fontWeight:t.done?600:400,color:t.done?"#111827":"#9ca3af"}}>{t.label}</div>
                    {t.date&&<div style={{fontSize:"11px",color:"#9ca3af"}}>{t.date}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <label style={{fontSize:"11px",fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".08em",display:"block",marginBottom:"6px"}}>Admin Notes</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add internal notes about this return..." rows={3} style={{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1.5px solid #e5e7eb",fontSize:"13px",color:"#111827",background:"#f9fafb",outline:"none",fontFamily:"inherit",resize:"none"}}/>
          </div>

          {/* Dispute note */}
          {(req.status==="DISPUTED"||req.disputeNote) && (
            <div>
              <label style={{fontSize:"11px",fontWeight:700,color:"#6d28d9",textTransform:"uppercase",letterSpacing:".08em",display:"block",marginBottom:"6px"}}>⚖ Dispute Resolution Notes</label>
              <textarea value={disputeNote} onChange={e=>setDisputeNote(e.target.value)} placeholder="Document dispute details, buyer claims, seller response..." rows={3} style={{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1.5px solid #ddd6fe",fontSize:"13px",color:"#111827",background:"#f5f3ff",outline:"none",fontFamily:"inherit",resize:"none"}}/>
            </div>
          )}

          {/* Action buttons */}
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {req.status==="PENDING" && (
              <button onClick={()=>handleAction("mark_received")} disabled={loading} style={{padding:"11px",borderRadius:"8px",background:loading?"#e5e7eb":"#eff6ff",color:loading?"#9ca3af":"#1d4ed8",border:"1.5px solid #bfdbfe",fontSize:"13px",fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                {loading?"Processing...":"📦 Mark as Received"}
              </button>
            )}
            {req.status==="RECEIVED" && (
              <div style={{display:"flex",gap:"8px"}}>
                <button onClick={()=>handleAction("approve")} disabled={loading} style={{flex:1,padding:"11px",borderRadius:"8px",background:loading?"#e5e7eb":"#f0fdf4",color:loading?"#9ca3af":"#15803d",border:"1.5px solid #bbf7d0",fontSize:"13px",fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit"}}>
                  {loading?"...":"✓ Approve Refund"}
                </button>
                <button onClick={()=>handleAction("reject")} disabled={loading} style={{flex:1,padding:"11px",borderRadius:"8px",background:loading?"#e5e7eb":"#fef2f2",color:loading?"#9ca3af":"#dc2626",border:"1.5px solid #fecaca",fontSize:"13px",fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit"}}>
                  {loading?"...":"✕ Reject Return"}
                </button>
              </div>
            )}
            {req.status==="APPROVED" && (
              <button onClick={()=>handleAction("refund")} disabled={loading} style={{padding:"11px",borderRadius:"8px",background:loading?"#e5e7eb":"linear-gradient(135deg,#C9A84C,#8B6914)",color:loading?"#9ca3af":"#2C1810",border:"none",fontSize:"13px",fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",boxShadow:loading?"none":"0 4px 14px rgba(201,168,76,.3)",transition:"all .2s"}}>
                {loading?"Processing Refund...":"💸 Process Refund — Credit ₹"+Number(refundAmt).toLocaleString("en-IN")+" to Wallet"}
              </button>
            )}
            {(req.status==="PENDING"||req.status==="RECEIVED") && (
              <button onClick={()=>handleAction("dispute")} disabled={loading} style={{padding:"10px",borderRadius:"8px",background:"transparent",color:"#6d28d9",border:"1.5px solid #ddd6fe",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                ⚖ Mark as Disputed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CSV Export ────────────────────────────────────────────────
function exportCSV(data: ReturnRequest[]) {
  const headers = ["Return ID","Order #","Buyer","Seller","Item","Order Amount","Refund Amount","Reason","Status","Requested","Resolved","Notes"];
  const rows = data.map(r=>[
    r.id, r.orderNumber, r.buyerName, r.sellerName, r.itemName,
    `₹${r.orderAmount}`, `₹${r.refundAmount}`, `"${r.reason.replace(/"/g,'""')}"`,
    r.status, r.requestedAt, r.resolvedAt||"", `"${r.notes.replace(/"/g,'""')}"`
  ]);
  const csv = [headers,...rows].map(r=>r.join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `returns-report-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main Page ─────────────────────────────────────────────────
export default function AdminReturnsPage() {
  const [returns, setReturns]           = useState<ReturnRequest[]>(MOCK_RETURNS);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch]             = useState("");
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest|null>(null);
  const [toast, setToast]               = useState<{msg:string;type:"success"|"error"|"info"}|null>(null);

  const showToast = (msg:string,type:"success"|"error"|"info"="success")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),4500); };

  const handleUpdate = (id:string, updates:Partial<ReturnRequest>) => {
    setReturns(prev=>prev.map(r=>r.id===id?{...r,...updates}:r));
    setSelectedReturn(prev=>prev?.id===id?{...prev,...updates} as ReturnRequest:prev);
    const msgs: Record<string,string> = {
      RECEIVED:"Item marked as received — review and approve or reject",
      APPROVED:"Refund approved! Process payment when ready.",
      REJECTED:"Return request rejected. Seller notified.",
      REFUNDED:"Refund processed! Amount credited to wallet ✓",
      DISPUTED:"Case marked as disputed — document resolution notes",
    };
    showToast(msgs[updates.status||""]||"Return updated");
  };

  const filtered = returns.filter(r=>{
    const matchStatus = !statusFilter || r.status===statusFilter;
    const matchSearch = !search || r.orderNumber.toLowerCase().includes(search.toLowerCase()) || r.buyerName.toLowerCase().includes(search.toLowerCase()) || r.itemName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all:      returns.length,
    PENDING:  returns.filter(r=>r.status==="PENDING").length,
    RECEIVED: returns.filter(r=>r.status==="RECEIVED").length,
    APPROVED: returns.filter(r=>r.status==="APPROVED").length,
    REFUNDED: returns.filter(r=>r.status==="REFUNDED").length,
    REJECTED: returns.filter(r=>r.status==="REJECTED").length,
    DISPUTED: returns.filter(r=>r.status==="DISPUTED").length,
  };
  const totalRefundValue  = returns.filter(r=>r.status==="REFUNDED").reduce((s,r)=>s+r.refundAmount,0);
  const pendingRefundValue = returns.filter(r=>r.status==="APPROVED").reduce((s,r)=>s+r.refundAmount,0);

  return (
    <div style={{maxWidth:"1200px"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {selectedReturn&&<ReturnDrawer req={selectedReturn} onClose={()=>setSelectedReturn(null)} onUpdate={handleUpdate}/>}

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
        <div>
          <h1 style={{fontSize:"22px",fontWeight:700,color:"#111827",marginBottom:"4px"}}>Returns & Refunds</h1>
          <p style={{fontSize:"14px",color:"#6b7280"}}>{returns.length} total return requests · {counts.PENDING} pending action</p>
        </div>
        <button onClick={()=>exportCSV(filtered)} style={{padding:"9px 18px",borderRadius:"8px",background:"#111827",color:"#fff",border:"none",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"8px",transition:"all .2s"}}>
          📥 Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"12px",marginBottom:"22px"}}>
        {[
          {icon:"📋",label:"Total Returns",    value:String(counts.all),                                color:"rgba(79,70,229,.1)"},
          {icon:"⏳",label:"Pending",           value:String(counts.PENDING),                            color:"rgba(245,158,11,.1)"},
          {icon:"📦",label:"Received",          value:String(counts.RECEIVED),                           color:"rgba(59,130,246,.1)"},
          {icon:"✅",label:"Approved",           value:String(counts.APPROVED),                           color:"rgba(16,185,129,.1)"},
          {icon:"💸",label:"Refunded",          value:`₹${totalRefundValue.toLocaleString("en-IN")}`,   color:"rgba(16,185,129,.08)"},
          {icon:"⚖",label:"Disputed",           value:String(counts.DISPUTED),                           color:"rgba(139,92,246,.1)"},
        ].map(s=>(
          <div key={s.label} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"10px",padding:"14px 16px"}}>
            <div style={{width:"32px",height:"32px",borderRadius:"8px",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",marginBottom:"8px"}}>{s.icon}</div>
            <div style={{fontSize:"20px",fontWeight:700,color:"#111827",lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:"11px",color:"#9ca3af",marginTop:"3px"}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending refund alert */}
      {pendingRefundValue>0&&(
        <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderLeft:"4px solid #f59e0b",borderRadius:"10px",padding:"12px 16px",marginBottom:"18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <span style={{fontSize:"18px"}}>⚠️</span>
            <div>
              <div style={{fontSize:"14px",fontWeight:600,color:"#92400e"}}>₹{pendingRefundValue.toLocaleString("en-IN")} in approved refunds awaiting payment</div>
              <div style={{fontSize:"12px",color:"#b45309"}}>{counts.APPROVED} return{counts.APPROVED>1?"s":""} approved — process payment to sellers</div>
            </div>
          </div>
          <button onClick={()=>setStatusFilter("APPROVED")} style={{padding:"7px 16px",borderRadius:"7px",background:"#f59e0b",color:"#2C1810",border:"none",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Process Now →</button>
        </div>
      )}

      {/* Search + filter */}
      <div style={{display:"flex",gap:"10px",marginBottom:"16px",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:"200px",position:"relative"}}>
          <span style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",fontSize:"14px",pointerEvents:"none"}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by order no., buyer name, item..." style={{width:"100%",padding:"9px 14px 9px 34px",borderRadius:"8px",border:"1.5px solid #e5e7eb",fontSize:"13px",color:"#111827",background:"#fff",outline:"none",fontFamily:"inherit"}}/>
          {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:"16px",color:"#9ca3af",padding:0}}>×</button>}
        </div>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{padding:"9px 14px",borderRadius:"8px",border:"1.5px solid #e5e7eb",fontSize:"13px",color:"#111827",background:"#fff",outline:"none",cursor:"pointer",fontFamily:"inherit"}}>
          <option value="">All Status</option>
          {["PENDING","RECEIVED","APPROVED","REFUNDED","REJECTED","DISPUTED"].map(s=><option key={s}>{s}</option>)}
        </select>
        {(search||statusFilter)&&<button onClick={()=>{setSearch("");setStatusFilter("");}} style={{padding:"9px 16px",borderRadius:"8px",border:"1px solid #e5e7eb",background:"transparent",color:"#9ca3af",fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>Clear</button>}
      </div>

      {/* Returns table */}
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"12px",overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"140px 1fr 120px 110px 110px 90px 80px",padding:"10px 20px",background:"#111827"}}>
          {["Order #","Item & Buyer","Refund Amt","Status","Requested","Images","Action"].map(h=>(
            <div key={h} style={{fontSize:"10px",fontWeight:700,color:"rgba(255,255,255,.4)",letterSpacing:".08em",textTransform:"uppercase"}}>{h}</div>
          ))}
        </div>

        {filtered.length===0?(
          <div style={{padding:"64px 20px",textAlign:"center"}}>
            <div style={{fontSize:"48px",marginBottom:"14px"}}>📋</div>
            <p style={{fontSize:"16px",fontWeight:500,color:"#111827",marginBottom:"6px"}}>No returns found</p>
            <p style={{fontSize:"13px",color:"#9ca3af"}}>{search||statusFilter?"Try different filters":"No return requests yet"}</p>
          </div>
        ):(
          filtered.map((r,i)=>{
            const sc=statusCfg(r.status);
            return (
              <div key={r.id} style={{display:"grid",gridTemplateColumns:"140px 1fr 120px 110px 110px 90px 80px",padding:"14px 20px",borderBottom:i<filtered.length-1?"1px solid #f9fafb":"none",background:i%2===0?"#fff":"#fafafa",alignItems:"center",cursor:"pointer",transition:"background .15s"}}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="#fffbeb"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=i%2===0?"#fff":"#fafafa"}
              >
                <div>
                  <div style={{fontSize:"13px",fontWeight:700,color:"#111827"}}>{r.orderNumber}</div>
                  <div style={{fontSize:"11px",color:"#9ca3af"}}>{r.requestedAt}</div>
                </div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:"13px",fontWeight:500,color:"#111827",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.itemName}</div>
                  <div style={{fontSize:"11px",color:"#9ca3af"}}>{r.buyerName} · {r.buyerPhone}</div>
                  <div style={{fontSize:"11px",color:"#6b7280",marginTop:"2px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontStyle:"italic"}}>{r.reason.substring(0,50)}...</div>
                </div>
                <div style={{fontSize:"14px",fontWeight:700,color:"#111827"}}>₹{r.refundAmount.toLocaleString("en-IN")}</div>
                <span style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"4px 9px",borderRadius:"99px",fontSize:"10px",fontWeight:700,background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`}}>
                  <span style={{width:"5px",height:"5px",borderRadius:"50%",background:sc.dot}}/>
                  {sc.label}
                </span>
                <div style={{fontSize:"12px",color:"#6b7280"}}>{r.requestedAt}</div>
                <div style={{fontSize:"12px",color:"#6b7280",display:"flex",alignItems:"center",gap:"4px"}}>📷 {r.images}</div>
                <button onClick={()=>setSelectedReturn(r)} style={{padding:"6px 12px",borderRadius:"7px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",color:"#2C1810",border:"none",fontSize:"11px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  Review
                </button>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes slideLeft{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder,textarea::placeholder{color:#9ca3af;}
        input:focus,select:focus,textarea:focus{border-color:#C9A84C !important;}
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
      `}</style>
    </div>
  );
}
