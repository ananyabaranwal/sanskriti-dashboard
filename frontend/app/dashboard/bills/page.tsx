"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import DashPageWrapper from "../DashPageWrapper";

type Bill = {
  _id: string;
  invoiceNumber: string;
  orderId?: { orderNumber: string; _id: string };
  buyer: { name: string; phone?: string; address?: { city?: string; state?: string } };
  seller: { businessName?: string; gstNumber?: string; name?: string };
  items: { name: string; quantity: number; price: number; total: number }[];
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  discount?: number;
  isIntraState: boolean;
  paymentStatus: "PAID" | "UNPAID" | "PARTIAL";
  pdfUrl?: string;
  createdAt: string;
};

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

const payStyle = (s: string) => ({
  PAID:    { bg:"#F0FDF4", color:"#15803d", border:"#BBF7D0" },
  UNPAID:  { bg:"#FFFBEB", color:"#854d0e", border:"#FDE68A" },
  PARTIAL: { bg:"#EFF6FF", color:"#1d4ed8", border:"#BFDBFE" },
}[s] || { bg:"#F5E6C8", color:"#6B4F12", border:"#E8D5A3" });

// ── Toast ─────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg:string; type:"success"|"error"|"info"; onClose:()=>void }) {
  useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t); }, []);
  const c = { success:{bg:"#F0FDF4",border:"#BBF7D0",color:"#15803d",icon:"✅"}, error:{bg:"#FEF2F2",border:"#FECACA",color:"#dc2626",icon:"❌"}, info:{bg:"#FFFBEB",border:"#FDE68A",color:"#854d0e",icon:"💡"} }[type];
  return (
    <div style={{position:"fixed",top:"24px",right:"24px",zIndex:9999,padding:"12px 16px",borderRadius:"12px",background:c.bg,border:`1px solid ${c.border}`,color:c.color,fontSize:"13px",fontWeight:500,boxShadow:"0 6px 24px rgba(0,0,0,.1)",display:"flex",alignItems:"center",gap:"10px",maxWidth:"360px",animation:"slideDown .3s ease",fontFamily:"inherit"}}>
      <span style={{fontSize:"15px"}}>{c.icon}</span>
      <span style={{flex:1,lineHeight:1.5}}>{msg}</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:"17px",color:"inherit",padding:0,opacity:.6,lineHeight:1}}>×</button>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div style={{display:"grid",gridTemplateColumns:"150px 1fr 100px 110px 100px 130px",padding:"14px 18px",borderBottom:"1px solid #F5EDE0",alignItems:"center"}}>
      {[110,140,75,70,65,100].map((w,i) => (
        <div key={i} className="skeleton" style={{width:`${w}px`,height:"13px",borderRadius:"4px"}}/>
      ))}
    </div>
  );
}

// ── Bill Detail Modal ─────────────────────────────────────────
function BillDetailModal({ bill, onClose, onPaymentUpdate, onDownload, downloading }: {
  bill: Bill;
  onClose: ()=>void;
  onPaymentUpdate: (id:string, status:string)=>void;
  onDownload: (bill:Bill)=>void;
  downloading: boolean;
}) {
  const [updating, setUpdating] = useState(false);
  const ps = payStyle(bill.paymentStatus);

  const handlePayment = async (status: string) => {
    setUpdating(true);
    await onPaymentUpdate(bill._id, status);
    setUpdating(false);
  };

  return (
    <div onClick={(e) => { if(e.target===e.currentTarget) onClose(); }} style={{position:"fixed",inset:0,background:"rgba(44,24,16,.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:"20px",backdropFilter:"blur(6px)"}}>
      <div style={{background:"#FFFDF9",borderRadius:"20px",width:"100%",maxWidth:"560px",maxHeight:"92vh",overflowY:"auto",boxShadow:"0 28px 72px rgba(44,24,16,.45)",animation:"scaleIn .3s ease"}}>

        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#1A0F0A,#2C1810,#3D2B1F)",padding:"22px 28px",borderRadius:"20px 20px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:"19px",fontFamily:"Georgia,serif",color:"#C9A84C",fontWeight:400}}>{bill.invoiceNumber}</div>
            <div style={{fontSize:"12px",color:"rgba(245,230,200,.5)",marginTop:"3px"}}>{new Date(bill.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <span style={{padding:"4px 10px",borderRadius:"99px",fontSize:"11px",fontWeight:700,background:ps.bg,color:ps.color,border:`1px solid ${ps.border}`}}>{bill.paymentStatus}</span>
            <button onClick={onClose} style={{width:"30px",height:"30px",borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"none",color:"#C9A84C",fontSize:"17px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>×</button>
          </div>
        </div>

        <div style={{padding:"22px 28px",display:"flex",flexDirection:"column",gap:"16px"}}>

          {/* Seller + Buyer */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
            {[{title:"FROM",data:bill.seller},{title:"BILLED TO",data:bill.buyer}].map(({title,data}) => (
              <div key={title} style={{background:"#FBF7F0",borderRadius:"10px",padding:"13px",border:"1px solid #E8D5A3"}}>
                <div style={{fontSize:"10px",fontWeight:700,color:"#A08060",letterSpacing:".08em",marginBottom:"7px"}}>{title}</div>
                <div style={{fontSize:"13px",fontWeight:700,color:"#2C1810"}}>{(data as any)?.businessName||(data as any)?.name}</div>
                {(data as any)?.gstNumber&&<div style={{fontSize:"11px",color:"#6B4F12",marginTop:"2px"}}>GST: {(data as any).gstNumber}</div>}
                {(data as any)?.phone&&<div style={{fontSize:"11px",color:"#A08060",marginTop:"2px"}}>{(data as any).phone}</div>}
                {(data as any)?.address?.city&&<div style={{fontSize:"11px",color:"#A08060",marginTop:"2px"}}>{[(data as any).address.city,(data as any).address.state].filter(Boolean).join(", ")}</div>}
              </div>
            ))}
          </div>

          {/* Items */}
          <div>
            <div style={{fontSize:"11px",fontWeight:700,color:"#A08060",textTransform:"uppercase",letterSpacing:".06em",marginBottom:"8px"}}>Items ({bill.items?.length})</div>
            {bill.items?.map((item,i) => (
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 13px",background:i%2===0?"#FBF7F0":"#FFFDF9",borderRadius:"7px",marginBottom:"5px",fontSize:"13px",border:"1px solid #F0E4C0"}}>
                <div>
                  <div style={{fontWeight:500,color:"#2C1810"}}>{item.name}</div>
                  <div style={{fontSize:"12px",color:"#A08060",marginTop:"2px"}}>Qty {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</div>
                </div>
                <div style={{fontWeight:700,color:"#2C1810",fontFamily:"Georgia,serif"}}>₹{item.total?.toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>

          {/* GST Breakdown */}
          <div style={{background:"#FBF7F0",borderRadius:"10px",padding:"14px",border:"1px solid #E8D5A3"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#6B4F12",marginBottom:"5px"}}><span>Subtotal</span><span>₹{bill.subtotal?.toLocaleString("en-IN")}</span></div>
            {bill.isIntraState ? (
              <>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#6B4F12",marginBottom:"5px"}}><span>CGST (9%)</span><span>₹{bill.cgst?.toLocaleString("en-IN")}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#6B4F12",marginBottom:"5px"}}><span>SGST (9%)</span><span>₹{bill.sgst?.toLocaleString("en-IN")}</span></div>
              </>
            ) : (
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#6B4F12",marginBottom:"5px"}}><span>IGST (18%)</span><span>₹{bill.igst?.toLocaleString("en-IN")}</span></div>
            )}
            {(bill.discount ?? 0) > 0 && (
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#15803d",marginBottom:"5px"}}><span>Discount</span><span>-₹{bill.discount?.toLocaleString("en-IN")}</span></div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"17px",fontWeight:700,borderTop:"1px solid #E8D5A3",paddingTop:"9px",marginTop:"5px"}}>
              <span style={{color:"#2C1810"}}>Grand Total</span>
              <span style={{color:"#8B6914",fontFamily:"Georgia,serif"}}>₹{bill.grandTotal?.toLocaleString("en-IN")}</span>
            </div>
            <div style={{marginTop:"8px",fontSize:"11px",color:"#A08060",padding:"6px 10px",borderRadius:"6px",background:"rgba(201,168,76,.06)",border:"1px solid rgba(201,168,76,.15)"}}>
              {bill.isIntraState ? "📍 Intra-state: CGST + SGST applied" : "🚚 Inter-state: IGST applied"}
            </div>
          </div>

          {/* Payment status */}
          <div>
            <div style={{fontSize:"11px",fontWeight:700,color:"#A08060",textTransform:"uppercase",letterSpacing:".06em",marginBottom:"8px"}}>Payment Status</div>
            <div style={{display:"flex",gap:"8px"}}>
              {(["PAID","UNPAID","PARTIAL"] as const).map(s => {
                const ss = payStyle(s);
                const active = bill.paymentStatus === s;
                return (
                  <button key={s} onClick={() => handlePayment(s)} disabled={updating||active} style={{flex:1,padding:"9px",borderRadius:"8px",border:`1px solid ${active?ss.border:"#E8D5A3"}`,background:active?ss.bg:"transparent",color:active?ss.color:"#A08060",fontSize:"12px",fontWeight:active?700:500,cursor:active?"default":"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                    {active&&"✓ "}{s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Download PDF button */}
          <button
            onClick={() => onDownload(bill)}
            disabled={downloading}
            style={{width:"100%",padding:"14px",borderRadius:"10px",background:downloading?"#E8D5A3":"linear-gradient(135deg,#C9A84C,#8B6914)",color:downloading?"#A08060":"#2C1810",border:"none",fontSize:"15px",fontWeight:700,cursor:downloading?"not-allowed":"pointer",fontFamily:"inherit",letterSpacing:".02em",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",boxShadow:downloading?"none":"0 6px 20px rgba(201,168,76,.3)",transition:"all .2s"}}
          >
            {downloading ? (
              <><span style={{width:"16px",height:"16px",borderRadius:"50%",border:"2px solid rgba(44,24,16,.3)",borderTopColor:"#2C1810",animation:"spin .7s linear infinite",display:"inline-block"}}/>Generating PDF...</>
            ) : (
              <><span>📄</span> Download PDF Invoice</>
            )}
          </button>

          <p style={{fontSize:"12px",color:"#A08060",textAlign:"center",marginTop:"-8px"}}>
            Generated by Sanskriti The Antique · GST compliant invoice
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Generate Bill from Order modal ────────────────────────────
function GenerateFromOrderModal({ onClose, onGenerated }: { onClose:()=>void; onGenerated:()=>void }) {
  const [orders, setOrders]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [genId, setGenId]     = useState<string|null>(null);
  const [error, setError]     = useState("");

  useEffect(() => {
    api.get("/orders?limit=20&status=DELIVERED")
      .then(r => setOrders(r.data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const generate = async (orderId: string, orderNumber: string) => {
    setGenId(orderId); setError("");
    try {
      await api.post(`/bills/generate/${orderId}`);
      onGenerated();
    } catch(e: any) {
      setError(e.response?.data?.message || `Failed to generate for ${orderNumber}`);
      setGenId(null);
    }
  };

  return (
    <div onClick={(e)=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(44,24,16,.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:"20px",backdropFilter:"blur(6px)"}}>
      <div style={{background:"#FFFDF9",borderRadius:"20px",width:"100%",maxWidth:"480px",maxHeight:"80vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 28px 72px rgba(44,24,16,.45)",animation:"scaleIn .3s ease"}}>
        <div style={{background:"linear-gradient(135deg,#1A0F0A,#2C1810)",padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <h2 style={{fontSize:"18px",fontFamily:"Georgia,serif",color:"#F5E6C8",fontWeight:400}}>Generate Invoice</h2>
            <p style={{fontSize:"12px",color:"rgba(245,230,200,.5)",marginTop:"2px"}}>Select a delivered order</p>
          </div>
          <button onClick={onClose} style={{width:"30px",height:"30px",borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"none",color:"#C9A84C",fontSize:"17px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>×</button>
        </div>
        <div style={{overflowY:"auto",flex:1}}>
          {loading ? (
            <div style={{padding:"24px"}}>{[1,2,3].map(i=><div key={i} className="skeleton" style={{height:"52px",borderRadius:"8px",marginBottom:"8px"}}/>)}</div>
          ) : orders.length === 0 ? (
            <div style={{padding:"40px 24px",textAlign:"center"}}>
              <div style={{fontSize:"36px",marginBottom:"12px"}}>📦</div>
              <p style={{fontSize:"14px",color:"#A08060"}}>No delivered orders found. Mark orders as DELIVERED to generate invoices.</p>
            </div>
          ) : (
            <div style={{padding:"12px"}}>
              {error&&<div style={{padding:"10px 14px",borderRadius:"8px",background:"#FEF2F2",border:"1px solid #FECACA",color:"#dc2626",fontSize:"13px",margin:"4px 4px 10px"}}>{error}</div>}
              {orders.map((o,i) => (
                <div key={o._id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",borderRadius:"10px",background:i%2===0?"#FBF7F0":"#FFFDF9",border:"1px solid #F0E4C0",marginBottom:"6px"}}>
                  <div>
                    <div style={{fontSize:"13px",fontWeight:600,color:"#2C1810"}}>{o.orderNumber}</div>
                    <div style={{fontSize:"12px",color:"#A08060"}}>{o.buyer?.name} · ₹{o.total?.toLocaleString("en-IN")}</div>
                  </div>
                  <button onClick={()=>generate(o._id,o.orderNumber)} disabled={!!genId} style={{padding:"7px 14px",borderRadius:"7px",background:genId===o._id?"#E8D5A3":"linear-gradient(135deg,#C9A84C,#8B6914)",color:genId===o._id?"#A08060":"#2C1810",border:"none",fontSize:"12px",fontWeight:700,cursor:genId?"not-allowed":"pointer",fontFamily:"inherit",minWidth:"80px",display:"flex",alignItems:"center",justifyContent:"center",gap:"5px"}}>
                    {genId===o._id?<><span style={{width:"12px",height:"12px",borderRadius:"50%",border:"2px solid rgba(44,24,16,.3)",borderTopColor:"#2C1810",animation:"spin .7s linear infinite",display:"inline-block"}}/>...</>:"Generate"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Bills Page ───────────────────────────────────────────
export default function BillsPage() {
  const [bills, setBills]               = useState<Bill[]>([]);
  const [loading, setLoading]           = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [total, setTotal]               = useState(0);
  const [selectedBill, setSelectedBill] = useState<Bill|null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [downloading, setDownloading]   = useState(false);
  const [toast, setToast]               = useState<{msg:string;type:"success"|"error"|"info"}|null>(null);

  const showToast = (msg:string, type:"success"|"error"|"info"="success") => setToast({msg,type});

  const fetchBills = useCallback(async (p=1, smooth=false) => {
    smooth ? setTableLoading(true) : setLoading(true);
    try {
      const res = await api.get(`/bills?page=${p}&limit=8`);
      setBills(res.data.bills||[]);
      setTotalPages(res.data.pagination?.totalPages||1);
      setTotal(res.data.pagination?.total||0);
      setPage(p);
    } catch(e) { console.error(e); }
    finally { smooth ? setTableLoading(false) : setLoading(false); }
  }, []);

  useEffect(() => { fetchBills(1); }, [fetchBills]);

  const handlePaymentUpdate = async (billId:string, status:string) => {
    try {
      await api.patch(`/bills/${billId}/payment`, { paymentStatus: status });
      showToast(`Payment marked as ${status}`);
      setBills(prev => prev.map(b => b._id===billId ? {...b,paymentStatus:status as any} : b));
      setSelectedBill(prev => prev?._id===billId ? {...prev,paymentStatus:status as any} : prev);
    } catch(e:any) { showToast(e.response?.data?.message||"Update failed","error"); }
  };

  const downloadPDF = async (bill: Bill) => {
    setDownloading(true);
    try {
      if (bill.pdfUrl) {
        // PDF already exists — open directly
        window.open(`${BACKEND}${bill.pdfUrl}`, "_blank");
        showToast(`Invoice ${bill.invoiceNumber} opened for download`);
      } else {
        // Regenerate PDF via backend
        const res = await api.post(`/bills/generate/${bill.orderId?._id||bill._id}`);
        const newPdfUrl = res.data.bill?.pdfUrl;
        if (newPdfUrl) {
          window.open(`${BACKEND}${newPdfUrl}`, "_blank");
          showToast(`Invoice ${bill.invoiceNumber} generated and downloaded!`);
          fetchBills(page, true); // refresh to get updated pdfUrl
        } else {
          showToast("PDF generated — check your bills list", "info");
        }
      }
    } catch(e:any) {
      showToast(e.response?.data?.message || "Failed to download PDF", "error");
    } finally { setDownloading(false); }
  };

  const collected = bills.filter(b=>b.paymentStatus==="PAID").reduce((s,b)=>s+b.grandTotal,0);
  const pending   = bills.filter(b=>b.paymentStatus==="UNPAID").reduce((s,b)=>s+b.grandTotal,0);
  const partial   = bills.filter(b=>b.paymentStatus==="PARTIAL").reduce((s,b)=>s+b.grandTotal,0);

  return (
    <DashPageWrapper>
    <div style={{maxWidth:"1100px"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {selectedBill&&<BillDetailModal bill={selectedBill} onClose={()=>setSelectedBill(null)} onPaymentUpdate={handlePaymentUpdate} onDownload={downloadPDF} downloading={downloading}/>}
      {showGenerate&&<GenerateFromOrderModal onClose={()=>setShowGenerate(false)} onGenerated={()=>{setShowGenerate(false);fetchBills(1);showToast("Invoice generated successfully!");}}/>}

      {/* Page header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
        <div>
          <p style={{fontSize:"12px",color:"#A08060",letterSpacing:".1em",textTransform:"uppercase",marginBottom:"4px"}}>Manage</p>
          <h1 style={{fontSize:"26px",fontFamily:"Georgia,serif",color:"#2C1810",fontWeight:400}}>Bills & Invoices</h1>
          <p style={{fontSize:"14px",color:"#A08060",marginTop:"3px"}}>{total} GST invoices · PDF download available</p>
        </div>
        <button onClick={()=>setShowGenerate(true)} style={{padding:"11px 22px",borderRadius:"9px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",color:"#2C1810",border:"none",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 14px rgba(201,168,76,.25)",letterSpacing:".02em",display:"flex",alignItems:"center",gap:"8px"}}>
          <span>🧾</span> Generate Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"14px",marginBottom:"24px"}}>
        {[
          {label:"Total Invoices", value:String(total),                               sub:`${bills.length} shown`,    bg:"#FFFDF9", border:"#E8D5A3",   color:"#2C1810",  icon:"🧾"},
          {label:"Collected",      value:`₹${collected.toLocaleString("en-IN")}`,    sub:"Fully paid",               bg:"#F0FDF4", border:"#BBF7D0",   color:"#15803d",  icon:"✅"},
          {label:"Pending",        value:`₹${pending.toLocaleString("en-IN")}`,      sub:"Unpaid invoices",          bg:"#FFFBEB", border:"#FDE68A",   color:"#854d0e",  icon:"⏳"},
          {label:"Partial",        value:`₹${partial.toLocaleString("en-IN")}`,      sub:"Partially paid",           bg:"#EFF6FF", border:"#BFDBFE",   color:"#1d4ed8",  icon:"💰"},
        ].map(s => (
          <div key={s.label} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:"14px",padding:"18px 20px"}}>
            <div style={{fontSize:"22px",marginBottom:"8px"}}>{s.icon}</div>
            <div style={{fontSize:"22px",fontWeight:700,color:s.color,fontFamily:"Georgia,serif",lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:"12px",fontWeight:600,color:s.color,opacity:.75,marginTop:"4px"}}>{s.label}</div>
            <div style={{fontSize:"11px",color:s.color,opacity:.5,marginTop:"2px"}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Bills table */}
      <div style={{background:"#FFFDF9",border:"1px solid #E8D5A3",borderRadius:"16px",overflow:"hidden",opacity:tableLoading?.6:1,transition:"opacity .25s"}}>

        {/* Dark table header */}
        <div style={{display:"grid",gridTemplateColumns:"150px 1fr 100px 110px 100px 130px",padding:"10px 18px",background:"linear-gradient(135deg,#2C1810,#3D2B1F)"}}>
          {["Invoice #","Buyer","Amount","GST Type","Payment","Actions"].map(h=>(
            <div key={h} style={{fontSize:"10px",fontWeight:700,color:"#C9A84C",letterSpacing:".08em",textTransform:"uppercase"}}>{h}</div>
          ))}
        </div>

        {loading ? (
          Array(5).fill(0).map((_,i)=><SkeletonRow key={i}/>)
        ) : bills.length===0 ? (
          <div style={{padding:"64px 20px",textAlign:"center"}}>
            <div style={{fontSize:"52px",marginBottom:"16px"}}>🧾</div>
            <p style={{fontSize:"17px",fontWeight:500,color:"#2C1810",marginBottom:"6px"}}>No invoices yet</p>
            <p style={{fontSize:"13px",color:"#A08060",marginBottom:"8px"}}>Generate GST invoices from delivered orders</p>
            <p style={{fontSize:"12px",color:"#C4A882",marginBottom:"20px"}}>Invoices include CGST/SGST for intra-state and IGST for inter-state sales</p>
            <button onClick={()=>setShowGenerate(true)} style={{padding:"10px 24px",borderRadius:"8px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",color:"#2C1810",border:"none",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Generate First Invoice →</button>
          </div>
        ) : (
          <>
            {bills.map((b,i) => {
              const ps2 = payStyle(b.paymentStatus);
              return (
                <div key={b._id} style={{display:"grid",gridTemplateColumns:"150px 1fr 100px 110px 100px 130px",padding:"14px 18px",borderBottom:i<bills.length-1?"1px solid #F5EDE0":"none",background:i%2===0?"#FFFDF9":"#FDFAF4",alignItems:"center",transition:"background .15s",cursor:"pointer"}}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="#F5E6C8"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=i%2===0?"#FFFDF9":"#FDFAF4"}
                >
                  <div>
                    <div style={{fontSize:"13px",fontWeight:700,color:"#2C1810"}}>{b.invoiceNumber}</div>
                    <div style={{fontSize:"11px",color:"#A08060"}}>{new Date(b.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                  </div>
                  <div>
                    <div style={{fontSize:"13px",fontWeight:500,color:"#2C1810"}}>{b.buyer?.name}</div>
                    <div style={{fontSize:"11px",color:"#A08060"}}>{b.orderId?.orderNumber||"—"}</div>
                  </div>
                  <div style={{fontSize:"13px",fontWeight:700,color:"#2C1810",fontFamily:"Georgia,serif"}}>₹{b.grandTotal?.toLocaleString("en-IN")}</div>
                  <div>
                    <span style={{padding:"3px 8px",borderRadius:"6px",background:b.isIntraState?"rgba(139,92,246,.08)":"rgba(59,130,246,.08)",color:b.isIntraState?"#6d28d9":"#1d4ed8",fontSize:"11px",fontWeight:700,border:`1px solid ${b.isIntraState?"rgba(139,92,246,.2)":"rgba(59,130,246,.2)"}`}}>
                      {b.isIntraState?"CGST+SGST":"IGST"}
                    </span>
                    <div style={{fontSize:"11px",color:"#A08060",marginTop:"3px"}}>₹{b.totalTax?.toLocaleString("en-IN")}</div>
                  </div>
                  <span style={{display:"inline-block",padding:"3px 8px",borderRadius:"99px",fontSize:"10px",fontWeight:700,background:ps2.bg,color:ps2.color,border:`1px solid ${ps2.border}`}}>{b.paymentStatus}</span>
                  <div style={{display:"flex",gap:"6px"}}>
                    <button onClick={(e)=>{e.stopPropagation();setSelectedBill(b);}} style={{padding:"6px 10px",borderRadius:"6px",background:"transparent",border:"1px solid #E8D5A3",color:"#6B4F12",fontSize:"11px",cursor:"pointer",fontFamily:"inherit",fontWeight:500,transition:"all .15s"}}>View</button>
                    <button
                      onClick={(e)=>{e.stopPropagation();downloadPDF(b);}}
                      disabled={downloading}
                      style={{padding:"6px 10px",borderRadius:"6px",background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.25)",color:"#8B6914",fontSize:"11px",cursor:downloading?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:700,display:"flex",alignItems:"center",gap:"4px",transition:"all .15s"}}
                    >
                      {downloading?"...":"📄 PDF"}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages>1&&(
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"14px",borderTop:"1px solid #F0E4C0"}}>
                <button onClick={()=>fetchBills(1,true)} disabled={page===1} style={{padding:"5px 10px",borderRadius:"6px",border:"1px solid #E8D5A3",background:"transparent",color:page===1?"#C4A882":"#6B4F12",cursor:page===1?"not-allowed":"pointer",fontSize:"12px",fontFamily:"inherit"}}>«</button>
                <button onClick={()=>fetchBills(page-1,true)} disabled={page===1} style={{padding:"5px 13px",borderRadius:"6px",border:"1px solid #E8D5A3",background:"transparent",color:page===1?"#C4A882":"#2C1810",cursor:page===1?"not-allowed":"pointer",fontSize:"13px",fontFamily:"inherit"}}>← Prev</button>
                {Array.from({length:Math.min(totalPages,5)},(_,i)=>{
                  const start=Math.max(1,Math.min(page-2,totalPages-4));
                  const p2=start+i;
                  return <button key={p2} onClick={()=>fetchBills(p2,true)} style={{width:"32px",height:"32px",borderRadius:"7px",border:`1px solid ${p2===page?"#C9A84C":"#E8D5A3"}`,background:p2===page?"linear-gradient(135deg,#C9A84C,#8B6914)":"transparent",color:p2===page?"#2C1810":"#6B4F12",fontSize:"13px",fontWeight:p2===page?700:400,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>{p2}</button>;
                })}
                <button onClick={()=>fetchBills(page+1,true)} disabled={page===totalPages} style={{padding:"5px 13px",borderRadius:"6px",border:"1px solid #E8D5A3",background:"transparent",color:page===totalPages?"#C4A882":"#2C1810",cursor:page===totalPages?"not-allowed":"pointer",fontSize:"13px",fontFamily:"inherit"}}>Next →</button>
                <button onClick={()=>fetchBills(totalPages,true)} disabled={page===totalPages} style={{padding:"5px 10px",borderRadius:"6px",border:"1px solid #E8D5A3",background:"transparent",color:page===totalPages?"#C4A882":"#6B4F12",cursor:page===totalPages?"not-allowed":"pointer",fontSize:"12px",fontFamily:"inherit"}}>»</button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes scaleIn  {from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin     {to{transform:rotate(360deg)}}
        input::placeholder  {color:#C4A882;}
        input:focus         {border-color:#C9A84C !important;}
      `}</style>
    </div>
    </DashPageWrapper>
  );
}
